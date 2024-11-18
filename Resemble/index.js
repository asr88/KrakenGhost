const fs = require("fs-extra");
const path = require("path");
const sharp = require("sharp");

class ImageComparator {
  constructor() {
    this.version1Path = path.join(__dirname, "./screenshot/4_5");
    this.version2Path = path.join(__dirname, "./screenshot/latest");
    this.resultPath = path.join(__dirname, "results");
    this.threshold = 0.1;

    console.log("Version 1 Path:", this.version1Path);
    console.log("Version 2 Path:", this.version2Path);
    console.log("Results Path:", this.resultPath);
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

  async run() {
    const comparisons = [];
    const files = await fs.readdir(this.version1Path);

    console.log("\n=== Starting Image Comparisons ===");
    console.log(`Found ${files.length} files in version 1 directory\n`);

    for (const file of files) {
      console.log("\n----------------------------------------");
      console.log(`Checking file: ${file}`);

      // Skip files that don't end with .png (case insensitive)
      if (!file.toLowerCase().endsWith(".png")) {
        console.log(`❌ Skipping ${file} - not a PNG file`);
        continue;
      }

      try {
        const img1Path = path.join(this.version1Path, file);
        const img2Path = path.join(this.version2Path, file);

        console.log("\nPaths to compare:");
        console.log(`Version 1: ${img1Path}`);
        console.log(`Version 2: ${img2Path}`);

        // Check if version 2 file exists
        if (!(await fs.pathExists(img2Path))) {
          console.log(
            `❌ Skipping comparison - File not found in version 2: ${file}`
          );
          continue;
        }

        // ... rest of the comparison code ...
      } catch (error) {
        console.error(`❌ Error processing ${file}: ${error.message}`);
      }
    }

    // ... rest of the function ...
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
    const testImagePath = path.join(comparator.version1Path, "Paso_1.png");
    await testImage(testImagePath);
    await comparator.run();
  }
}

main();
