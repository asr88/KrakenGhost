const Jimp = require("jimp");

async function testJimp() {
  try {
    console.log("Jimp version:", Jimp.version);
    console.log("Testing Jimp functionality...");

    // Test basic Jimp functionality
    const image = await Jimp.read("path/to/your/image.png");
    console.log("Image loaded successfully");
  } catch (error) {
    console.log("Error testing Jimp:");
    console.log("Message:", error.message);
    console.log("Stack:", error);
  }
}

testJimp();
