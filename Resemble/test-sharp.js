const sharp = require("sharp");

async function testImageProcessing() {
  try {
    console.log("Testing Sharp functionality...");

    // Read and process an image
    const image = await sharp("./screenshot/4_5/Paso_1.png")
      .resize(800, 600) // optional: resize
      .toBuffer();

    console.log("Image processed successfully");

    // Optionally save the processed image
    await sharp(image).toFile("output.png");
  } catch (error) {
    console.log("Error processing image:");
    console.log("Message:", error.message);
    console.log("Stack:", error);
  }
}

testImageProcessing();
