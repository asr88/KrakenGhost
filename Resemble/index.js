const fs = require("fs-extra");
const path = require("path");
const sharp = require("sharp");

class ImageComparator {
  constructor() {
    this.version1Path = path.join(__dirname, "./screenshot/4_5");
    this.version2Path = path.join(__dirname, "./screenshot/5_96");
    this.resultPath = path.join(__dirname, "./screenshot/compare");
    this.threshold = 0.1;
  }

  // New method to get folder structure
  async getFolderStructure(basePath) {
    const structure = new Map();

    async function traverse(currentPath, relativePath = "") {
      const items = await fs.readdir(currentPath, { withFileTypes: true });

      for (const item of items) {
        const fullPath = path.join(currentPath, item.name);
        const relPath = path.join(relativePath, item.name);

        if (item.isDirectory()) {
          structure.set(relPath, {
            type: "directory",
            files: [],
          });
          await traverse(fullPath, relPath);
        } else if (item.isFile() && item.name.toLowerCase().endsWith(".png")) {
          const parentDir = relativePath || ".";
          if (!structure.has(parentDir)) {
            structure.set(parentDir, {
              type: "directory",
              files: [],
            });
          }
          structure.get(parentDir).files.push(item.name);
        }
      }
    }

    await traverse(basePath);
    return structure;
  }

  async run() {
    try {
      console.log("\n=== Analyzing Directory Structures ===");

      // Get folder structures for both versions
      const structure1 = await this.getFolderStructure(this.version1Path);
      const structure2 = await this.getFolderStructure(this.version2Path);

      // Compare structures
      const comparisons = [];
      let structuresMatch = true;

      console.log("\nChecking folder structures:");
      for (const [folderPath, content1] of structure1) {
        const content2 = structure2.get(folderPath);

        if (!content2) {
          console.log(`❌ Folder missing in version 2: ${folderPath}`);
          structuresMatch = false;
          continue;
        }

        // Create the corresponding folder in compare directory
        const compareFolder = path.join(this.resultPath, folderPath);
        await fs.ensureDir(compareFolder);
        console.log(`✅ Created folder: ${compareFolder}`);

        // Compare PNG files in this folder
        const files1 = new Set(content1.files);
        const files2 = new Set(content2.files);

        for (const file of files1) {
          if (!files2.has(file)) {
            console.log(
              `❌ File missing in version 2: ${path.join(folderPath, file)}`
            );
            structuresMatch = false;
            continue;
          }

          // Compare the images
          try {
            const img1Path = path.join(this.version1Path, folderPath, file);
            const img2Path = path.join(this.version2Path, folderPath, file);
            const diffPath = path.join(
              this.resultPath,
              folderPath,
              `diff_${file}`
            );

            console.log(`\nComparing: ${path.join(folderPath, file)}`);
            const comparison = await this.compareImages(
              img1Path,
              img2Path,
              diffPath
            );

            comparisons.push({
              fileName: path.join(folderPath, file),
              ...comparison,
              passed: comparison.diffPercentage <= this.threshold,
            });

            console.log(
              `✅ Comparison complete: ${comparison.diffPercentage}% difference`
            );
          } catch (error) {
            console.error(`❌ Error comparing ${file}:`, error.message);
          }
        }

        // Check for extra files in version 2
        for (const file of files2) {
          if (!files1.has(file)) {
            console.log(
              `⚠️ Extra file in version 2: ${path.join(folderPath, file)}`
            );
            structuresMatch = false;
          }
        }
      }

      // Check for extra folders in version 2
      for (const [folderPath] of structure2) {
        if (!structure1.has(folderPath)) {
          console.log(`⚠️ Extra folder in version 2: ${folderPath}`);
          structuresMatch = false;
        }
      }

      // Generate report and print summary
      const results = {
        totalComparisons: comparisons.length,
        passed: comparisons.filter((c) => c.passed).length,
        failed: comparisons.filter((c) => !c.passed).length,
        structuresMatch,
        details: comparisons,
      };

      await this.generateReport(results);
      this.printSummary(results);

      return results;
    } catch (error) {
      console.error("Error during comparison process:", error);
      throw error;
    }
  }

  async compareImages(img1Path, img2Path, outputPath) {
    try {
      // Add detailed logging for image formats
      console.log(`Analyzing images:`);
      console.log(`Image 1: ${img1Path}`);
      console.log(`Image 2: ${img2Path}`);

      // Create Sharp instances for both images
      const img1 = sharp(img1Path);
      const img2 = sharp(img2Path);

      // Read both images and get their metadata
      const [img1Meta, img2Meta] = await Promise.all([
        img1.metadata(),
        img2.metadata(),
      ]);

      console.log("Image 1 format:", img1Meta.format);
      console.log("Image 2 format:", img2Meta.format);

      // Resize img2 to match img1 dimensions
      const resizedImg2 = await img2.resize(img1Meta.width, img1Meta.height, {
        fit: "fill",
      });

      // Create a difference image using composite
      const diffImage = await sharp(img1Path)
        .composite([
          {
            input: await resizedImg2.toBuffer(),
            blend: "difference",
          },
        ])
        .png()
        .toBuffer();

      // Save the difference image
      await sharp(diffImage)
        .threshold(30) // Add threshold to make differences more visible
        .toFile(outputPath);

      // Calculate difference (simplified version)
      const [img1Buffer, img2Buffer] = await Promise.all([
        img1.raw().toBuffer(),
        resizedImg2.raw().toBuffer(),
      ]);

      let diffPixels = 0;
      for (let i = 0; i < img1Buffer.length; i += 3) {
        if (
          Math.abs(img1Buffer[i] - img2Buffer[i]) > 25 ||
          Math.abs(img1Buffer[i + 1] - img2Buffer[i + 1]) > 25 ||
          Math.abs(img1Buffer[i + 2] - img2Buffer[i + 2]) > 25
        ) {
          diffPixels++;
        }
      }

      const totalPixels = img1Meta.width * img1Meta.height;
      const diffPercentage = (diffPixels / totalPixels) * 100;

      return {
        diffPixels,
        diffPercentage: diffPercentage.toFixed(2),
        dimensions: { width: img1Meta.width, height: img1Meta.height },
      };
    } catch (error) {
      console.error(`Error comparing images: ${error}`);
      throw error;
    }
  }

  async generateReport(results) {
    const reportPath = path.join(this.resultPath, "report.html");
    const html = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>Visual Regression Test Results</title>
                <style>
                    body { font-family: Arial, sans-serif; margin: 20px; }
                    .summary { margin-bottom: 20px; }
                    .comparison { margin-bottom: 30px; border-bottom: 1px solid #ccc; padding-bottom: 20px; }
                    .failed { color: red; }
                    .passed { color: green; }
                    .image-comparison { display: flex; flex-wrap: wrap; gap: 20px; }
                    .image-container { text-align: center; }
                    img { max-width: 300px; height: auto; }
                </style>
            </head>
            <body>
                <h1>Visual Regression Test Results</h1>
                <div class="summary">
                    <h2>Summary</h2>
                    <p>Total Comparisons: ${results.totalComparisons}</p>
                    <p class="passed">Passed: ${results.passed}</p>
                    <p class="failed">Failed: ${results.failed}</p>
                </div>
                <div class="details">
                    <h2>Detailed Results</h2>
                    ${results.details
                      .map(
                        (result) => `
                        <div class="comparison ${
                          result.passed ? "passed" : "failed"
                        }">
                            <h3>${result.fileName}</h3>
                            <p>Difference: ${result.diffPercentage}%</p>
                            <p>Different Pixels: ${result.diffPixels}</p>
                            ${
                              !result.passed
                                ? `
                                <div class="image-comparison">
                                    <div class="image-container">
                                        <h4>Version 1</h4>
                                        <img src="../screenshot/4_5/${result.fileName}" alt="Version 1">
                                    </div>
                                    <div class="image-container">
                                        <h4>Version 2</h4>
                                        <img src="../screenshot/latest/${result.fileName}" alt="Version 2">
                                    </div>
                                    <div class="image-container">
                                        <h4>Difference</h4>
                                        <img src="diff_${result.fileName}" alt="Difference">
                                    </div>
                                </div>
                            `
                                : ""
                            }
                        </div>
                    `
                      )
                      .join("")}
                </div>
            </body>
            </html>
        `;

    await fs.writeFile(reportPath, html);
    console.log(`Report generated at: ${reportPath}`);
  }

  printSummary(results) {
    console.log("\nComparison Results:");
    console.log(`Total comparisons: ${results.totalComparisons}`);
    console.log(`Passed: ${results.passed}`);
    console.log(`Failed: ${results.failed}`);
  }
}

// Before running the comparison, verify directories exist
async function verifyDirectories() {
  const comparator = new ImageComparator();

  try {
    // Check if directories exist
    const v1Exists = await fs.pathExists(comparator.version1Path);
    const v2Exists = await fs.pathExists(comparator.version2Path);

    console.log("\nDirectory Check:");
    console.log("Version 1 Directory exists:", v1Exists);
    console.log("Version 2 Directory exists:", v2Exists);

    if (!v1Exists || !v2Exists) {
      console.error("\nError: One or both screenshot directories are missing!");
      console.log("\nPlease ensure your directory structure looks like this:");
      console.log("Kraken2/");
      console.log("├── screenshots/");
      console.log("│   ├── 4_5/");
      console.log("│   │   └── *.png");
      console.log("│   └── 4_7/");
      console.log("│       └── *.png");
      console.log("└── Resemble/");
      console.log("    ├── index.js");
      console.log("    └── package.json");
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error checking directories:", error);
    return false;
  }
}

// Update the testImage function to be more thorough
async function testImage(imagePath) {
  try {
    const image = await sharp(imagePath);
    const metadata = await image.metadata();

    console.log(`\nValidating image: ${path.basename(imagePath)}`);
    console.log("Format:", metadata.format);
    console.log("Dimensions:", `${metadata.width}x${metadata.height}`);
    console.log("Channels:", metadata.channels);
    console.log("Has Alpha:", metadata.hasAlpha);

    if (!metadata) {
      console.error(`Error: No metadata found for ${path.basename(imagePath)}`);
      return false;
    }

    if (metadata.format !== "png") {
      console.error(
        `Error: ${path.basename(imagePath)} is not a PNG file (found: ${
          metadata.format
        })`
      );
      return false;
    }

    // Additional validation
    if (metadata.width === 0 || metadata.height === 0) {
      console.error(
        `Error: ${path.basename(imagePath)} has invalid dimensions`
      );
      return false;
    }

    return true;
  } catch (error) {
    console.error(
      `Error validating ${path.basename(imagePath)}:`,
      error.message
    );
    console.error("Full error:", error);
    return false;
  }
}

// Run the verification and comparison
async function main() {
  const directoriesExist = await verifyDirectories();
  if (directoriesExist) {
    const comparator = new ImageComparator();
    await comparator.run();
  }
}

main();
