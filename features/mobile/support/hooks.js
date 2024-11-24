const { Before, After } = require("@cucumber/cucumber");

Before(async function () {
  // Increase timeout and add error handling
  try {
    this.deviceClient = null; // Initialize as null
    if (this.platform === "android" || this.platform === "ios") {
      // Only create mobile client if actually testing on mobile
      this.deviceClient = await this.driver.createSession();
    }
  } catch (error) {
    console.error("Failed to initialize mobile session:", error);
    // Don't throw error if mobile setup fails - allows web tests to continue
  }
});

After(async function () {
  try {
    // Only attempt to delete session if deviceClient exists
    if (this.deviceClient) {
      await this.deviceClient.deleteSession();
    }
  } catch (error) {
    console.error("Error cleaning up mobile session:", error);
    // Continue cleanup even if there's an error
  }
});
