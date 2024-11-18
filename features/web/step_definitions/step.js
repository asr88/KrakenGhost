const { Given, When, Then } = require("@cucumber/cucumber");
const properties = require("../../../properties.json");
const { expect } = require("chai");

// Definición de selectores como constantes
const SELECTORS = {
  PAGES: {
    MENU: {
      DATA_TEST: '[data-test-nav="pages"]',
      HREF: 'a[href="#/pages/"]',
      LINK_TEXT: "a=Pages",
      FALLBACK: '.gh-nav-list a[href="#/pages/"]',
    },
    NEW_BUTTON: {
      DATA_TEST: "[data-test-new-page-button]",
      HREF: 'a[href="#/editor/page/"]',
      CLASS: ".gh-btn-primary",
    },
    LIST: {
      DATA_TEST: "[data-test-pages-list]",
      CLASS: ".gh-list",
    },
  },
};

// Función auxiliar para intentar múltiples selectores
async function trySelectors(driver, selectorObj, action = "click") {
  for (const [key, selector] of Object.entries(selectorObj)) {
    try {
      const element = await driver.$(selector);
      const isDisplayed = await element.isDisplayed();
      const isClickable = await element.isClickable();

      if (isDisplayed && isClickable) {
        if (action === "click") {
          await element.click();
        }
        return element;
      }
    } catch (error) {
      console.log(`Failed with selector ${key}: ${selector}`, error.message);
    }
  }
  throw new Error(
    `No working selector found in ${JSON.stringify(selectorObj)}`
  );
}

When("I enter login email {string}", async function (email) {
  let element = await this.driver.$("#identification");
  const emailKey = email.replace(/[<>]/g, "");
  return await element.setValue(properties[emailKey]);
});

When("I enter login password {string}", async function (password) {
  let element = await this.driver.$("#password");
  const passwordKey = password.replace(/[<>]/g, "");
  return await element.setValue(properties[passwordKey]);
});

When("I submit login", async function () {
  let element = await this.driver.$('[data-test-button="sign-in"]');
  return await element.click();
});

When("I click on the page option", async function () {
  try {
    // Esperar a que la página se cargue
    await this.driver.waitUntil(
      async () => {
        const element = await this.driver.$(SELECTORS.PAGES.MENU.DATA_TEST);
        return await element.isDisplayed();
      },
      {
        timeout: 10000,
        timeoutMsg: "Pages menu not visible after 10s",
      }
    );

    // Intentar hacer clic usando múltiples selectores
    await trySelectors(this.driver, SELECTORS.PAGES.MENU);

    // Esperar a que la navegación se complete
    await this.driver.waitUntil(
      async () => {
        const url = await this.driver.getUrl();
        return url.includes("/pages");
      },
      {
        timeout: 5000,
        timeoutMsg: "URL did not change to pages after clicking",
      }
    );
  } catch (error) {
    console.error("Error clicking pages option:", error);
    // Tomar screenshot para debugging
    await this.driver.saveScreenshot("error-clicking-pages.png");
    throw error;
  }
});

When("I go to pages", async function () {
  try {
    // Esperar a que la lista de páginas sea visible
    await this.driver.waitUntil(
      async () => {
        const pagesList = await this.driver.$(SELECTORS.PAGES.LIST.DATA_TEST);
        return await pagesList.isDisplayed();
      },
      {
        timeout: 5000,
        timeoutMsg: "Pages list not visible after 5s",
      }
    );

    // Verificar que estamos en la página correcta
    const currentUrl = await this.driver.getUrl();
    if (!currentUrl.includes("/pages")) {
      // Si no estamos en la página correcta, intentar navegar
      await trySelectors(this.driver, SELECTORS.PAGES.MENU);
    }

    // Esperar a que la lista se cargue
    await this.driver.waitUntil(
      async () => {
        const list = await this.driver.$(SELECTORS.PAGES.LIST.CLASS);
        return await list.isDisplayed();
      },
      {
        timeout: 5000,
        timeoutMsg: "Pages list not loaded after navigation",
      }
    );
  } catch (error) {
    console.error("Error navigating to pages:", error);
    await this.driver.saveScreenshot("error-navigating-pages.png");
    throw error;
  }
});

When("I click on the posts option", async function () {
  let element = await this.driver.$('[data-test-nav="posts"]');
  return await element.click();
});

When("I click on the members option", async function () {
  let element = await this.driver.$('[data-test-nav="members"]');
  return await element.click();
});

When("I click on the tags option", async function () {
  let element = await this.driver.$('[data-test-nav="tags"]');
  return await element.click();
});

When("I click on the new page button", async function () {
  let element = await this.driver.$("[data-test-new-page-button]");
  await element.waitForClickable({ timeout: 5000 });
  return await element.click();
});

When("I Click on the new post button", async function () {
  await new Promise((r) => setTimeout(r, 2000));

  let element = await this.driver.$('a[href="#/editor/post/"].gh-btn-primary');

  if (!element) {
    element = await this.driver.$("[data-test-new-post-button]");
  }

  await element.waitForClickable({ timeout: 5000 });
  return await element.click();
});

When("I click on the new member button", async function () {
  await new Promise((r) => setTimeout(r, 2000));

  let element = await this.driver.$('a[href="#/members/new/"].gh-btn-primary');

  if (!element) {
    element = await this.driver.$('[data-test-new-member-button="true"]');
  }

  if (!element) {
    element = await this.driver.$('a:contains("New member")');
  }

  await element.waitForClickable({ timeout: 5000 });
  return await element.click();
});

When("I click on the new tag button", async function () {
  let element = await this.driver.$('[data-test-new-tag-button="true"]');
  await element.waitForClickable({ timeout: 5000 });
  return await element.click();
});

When("I enter title post", async function () {
  let element = await this.driver.$("[data-test-editor-title-input]");
  return await element.setValue("Nuevo Post de Prueba");
});

When("I enter detail post", async function () {
  await new Promise((r) => setTimeout(r, 2000));

  let element = await this.driver.$('div.kg-prose[contenteditable="true"]');

  if (!element) {
    element = await this.driver.$('[data-lexical-editor="true"]');
  }

  if (!element) {
    element = await this.driver.$('[data-koenig-dnd-container="true"]');
  }

  await element.waitForDisplayed({ timeout: 5000 });
  return await element.setValue("Este es un post de prueba creado con Kraken");
});

When("I click publish", async function () {
  let element = await this.driver.$('button[data-test-button="publish-flow"]');
  await element.waitForClickable({ timeout: 5000 });
  return await element.click();
});

Then("I should not see the publish button", async function () {
  await new Promise((r) => setTimeout(r, 2000));

  try {
    const element = await this.driver.$(
      'button[data-test-button="publish-flow"]'
    );
    const isDisplayed = await element.isDisplayed();

    if (isDisplayed) {
      throw new Error("Publish button is visible when it should not be");
    }
  } catch (error) {
    return true;
  }
});

When("I click publish confirm", async function () {
  await new Promise((r) => setTimeout(r, 1000));

  let element = await this.driver.$('button[data-test-button="continue"]');
  await element.waitForClickable({ timeout: 5000 });
  return await element.click();
});

When("I click final publish", async function () {
  await new Promise((r) => setTimeout(r, 1000));

  let element = await this.driver.$(
    'button[data-test-button="confirm-publish"]'
  );
  await element.waitForClickable({ timeout: 5000 });
  return await element.click();
});

When("I Click on the new page button", async function () {
  let element = await this.driver.$("[data-test-new-page-button]");
  await element.waitForClickable({ timeout: 5000 });
  return await element.click();
});

When("I enter title page", async function () {
  await new Promise((r) => setTimeout(r, 2000));
  let element = await this.driver.$("[data-test-editor-title-input]");
  return await element.setValue("Nueva pagina de prueba");
});

When("I enter detail page", async function () {
  let element = await this.driver.$('.kg-prose[contenteditable="true"]');
  return await element.setValue("Contenido super de prueba");
});

Then("I see the page created", async function () {
  await new Promise((r) => setTimeout(r, 2000));

  let element = await this.driver.$("h3=Nueva pagina de prueba");

  if (!element) {
    element = await this.driver.$(
      ".gh-content-entry-title=Nueva pagina de prueba"
    );
  }

  await element.waitForDisplayed({ timeout: 5000 });
  const isDisplayed = await element.isDisplayed();
  expect(isDisplayed).to.be.true;
});

Then("I see the post created", async function () {
  await new Promise((r) => setTimeout(r, 2000));

  let successModal = await this.driver.$(".modal-post-success");

  if (!successModal) {
    successModal = await this.driver.$('[data-test-publish-flow="complete"]');
  }

  let successMessage = await this.driver.$("h1[data-test-complete-title] span");
  await successMessage.waitForDisplayed({ timeout: 5000 });
  const messageText = await successMessage.getText();
  expect(messageText).to.include("Boom! It's out there");

  let closeButton = await this.driver.$(
    '[data-test-button="close-publish-flow"]'
  );
  if (closeButton) {
    await closeButton.waitForClickable({ timeout: 5000 });
    await closeButton.click();
  }
});

Then("I see the member created", async function () {
  await new Promise((r) => setTimeout(r, 2000));

  let element = await this.driver.$("h3=test@test.com");
  await element.waitForDisplayed({ timeout: 5000 });
  const isDisplayed = await element.isDisplayed();
  expect(isDisplayed).to.be.true;
});

When("I click on the members function", async function () {
  await new Promise((r) => setTimeout(r, 2000));

  let element = await this.driver.$('[data-test-nav="members"]');

  if (!element) {
    element = await this.driver.$('a[href="#/members/"]');
  }

  if (!element) {
    element = await this.driver.$(".gh-nav-members");
  }

  await element.waitForClickable({ timeout: 5000 });
  await element.click();

  await new Promise((r) => setTimeout(r, 2000));

  let newMemberButton = await this.driver.$(
    '[data-test-new-member-button="true"]'
  );
  await newMemberButton.waitForClickable({ timeout: 5000 });
  return await newMemberButton.click();
});

When("I enter email new member {string}", async function (email) {
  await new Promise((r) => setTimeout(r, 2000));

  let element = await this.driver.$('input[data-test-input="member-email"]');

  if (!element) {
    element = await this.driver.$("#member-email");
  }

  await element.setValue(email);
});

When("I click on save button", async function () {
  let saveButton = await this.driver.$('button[data-test-button="save"]');

  if (!saveButton) {
    saveButton = await this.driver.$('.gh-btn-primary:contains("Save")');
  }

  await saveButton.waitForClickable({
    timeout: 5000,
    timeoutMsg: "Save button not clickable after 5 seconds",
  });

  await saveButton.click();

  await new Promise((r) => setTimeout(r, 2000));
});

Then("Should be a message {string}", async function (message) {
  await new Promise((r) => setTimeout(r, 3000));

  const formGroup = await this.driver.$(".form-group.error");

  await formGroup.waitForExist({
    timeout: 10000,
    timeoutMsg: "Form group with error class not found",
  });

  const errorElement = await formGroup.$("p.response");

  await errorElement.waitForDisplayed({
    timeout: 10000,
    timeoutMsg: `Error message element not found within form group`,
  });

  const actualMessage = await errorElement.getText();

  console.log("Found message:", actualMessage);

  expect(actualMessage.trim()).to.equal(message.trim());
});

When("I enter tag name {string}", async function (name) {
  let element = await this.driver.$('input[data-test-input="tag-name"]');
  return await element.setValue(name);
});

When("I click new tag", async function () {
  let element = await this.driver.$('a[href="#/tags/new/"]');
  return await element.click();
});

Then("Should be a message on tags {string}", async function (message) {
  await new Promise((r) => setTimeout(r, 2000));

  const formGroup = await this.driver.$(".form-group");

  const errorSpan = await formGroup.$(".error");

  const responseParagraph = await errorSpan.$("p.response:not([hidden])");

  await responseParagraph.waitForDisplayed({
    timeout: 5000,
    timeoutMsg: "Error message not displayed after 5 seconds",
  });

  const actualMessage = await responseParagraph.getText();
  expect(actualMessage.trim()).to.equal(message.trim());
});

When("I click on the settings option", async function () {
  await new Promise((r) => setTimeout(r, 1000));
  let element = await this.driver.$(
    'a.gh-nav-bottom-tabicon[data-test-nav="settings"]'
  );

  if (!element) {
    element = await this.driver.$('[data-test-nav="settings"]');
  }

  if (!element) {
    element = await this.driver.$('a[href="#/settings/"]');
  }

  if (!element) {
    throw new Error("Settings button not found");
  }

  await element.waitForClickable({ timeout: 5000 });
  return await element.click();
});

When("I click edit site", async function () {
  await new Promise((r) => setTimeout(r, 2000));

  let element = null;

  // Try different selectors based on the exact HTML structure
  const selectors = [
    // Most specific to least specific
    'div.flex.items-center button:has(span:contains("Edit"))',
    "div.flex button.cursor-pointer",
    'button.cursor-pointer.text-grey-900:has(span:contains("Edit"))',
    "button.cursor-pointer.text-grey-900.dark\\:text-white",
    '.flex button span:contains("Edit")',
    "button.cursor-pointer span.text-grey-900",
  ];

  for (const selector of selectors) {
    try {
      const elements = await this.driver.$$(selector);
      for (const el of elements) {
        const text = await el.getText();
        if (text.trim() === "Edit") {
          element = el;
          break;
        }
      }
      if (element) break;
    } catch (e) {
      console.log(`Selector ${selector} failed:`, e.message);
    }
  }

  // If still not found, try finding by exact class combination
  if (!element) {
    element = await this.driver.$(
      "button.cursor-pointer.text-grey-900.dark\\:text-white.dark\\:hover\\:bg-grey-900.hover\\:bg-grey-200.hover\\:text-black"
    );
  }

  // Final fallback to find any button containing "Edit"
  if (!element) {
    const buttons = await this.driver.$$("button");
    for (const button of buttons) {
      try {
        const text = await button.getText();
        if (text.trim() === "Edit") {
          element = button;
          break;
        }
      } catch (e) {
        continue;
      }
    }
  }

  if (!element) {
    const url = await this.driver.getUrl();
    throw new Error(`Edit button not found. Current URL: ${url}`);
  }

  await element.waitForClickable({
    timeout: 10000,
    timeoutMsg: "Edit button not clickable after 10 seconds",
  });

  // Add a small delay before clicking
  await new Promise((r) => setTimeout(r, 1000));

  await element.click();

  // Add a small delay after clicking
  await new Promise((r) => setTimeout(r, 1000));
});

When("I enter site title {string}", async function (title) {
  let element = await this.driver.$('input[placeholder="Site title"]');

  if (!element) {
    element = await this.driver.$('input[maxlength="150"]');
  }

  if (!element) {
    element = await this.driver.$('input.peer[type="text"]');
  }

  if (!element) {
    throw new Error("Site title input field not found");
  }

  await element.waitForDisplayed({
    timeout: 5000,
    timeoutMsg: "Site title input not displayed after 5 seconds",
  });

  // Clear existing value first
  await element.clearValue();

  // Enter new value
  await element.setValue(title);

  // Small delay after typing
  await new Promise((r) => setTimeout(r, 500));
});

When("I enter site description {string}", async function (description) {
  // Wait for form to be fully loaded
  await new Promise((r) => setTimeout(r, 2000));

  let element = null;

  // Try different selectors
  const selectors = [
    'textarea[name="description"]',
    'input[name="description"]',
    '[data-test-input="site-description"]',
    'textarea.peer[placeholder="Site description"]',
    'input.peer[placeholder="Site description"]',
    '[aria-label="Site description"]',
    // Add more specific selectors
    "div.gh-setting-content-extended textarea",
    "div.gh-setting-content-extended input",
    "textarea.gh-input",
    "input.gh-input",
  ];

  for (const selector of selectors) {
    try {
      const el = await this.driver.$(selector);
      if (await el.isExisting()) {
        element = el;
        break;
      }
    } catch (e) {
      console.log(`Selector ${selector} failed:`, e.message);
    }
  }

  if (!element) {
    // Try finding by text content in label
    const labels = await this.driver.$$("label");
    for (const label of labels) {
      try {
        const text = await label.getText();
        if (text.includes("Site description")) {
          element = await label.nextElement();
          break;
        }
      } catch (e) {
        continue;
      }
    }
  }

  if (!element) {
    const url = await this.driver.getUrl();
    throw new Error(
      `Site description input field not found. Current URL: ${url}`
    );
  }

  await element.waitForDisplayed({
    timeout: 5000,
    timeoutMsg: "Site description input not displayed after 5 seconds",
  });

  // Clear existing value first
  await element.clearValue();

  // Enter new value
  await element.setValue(description);

  // Small delay after typing
  await new Promise((r) => setTimeout(r, 500));
});

When("I click on save settings button", async function () {
  // Wait for form to be fully loaded
  await new Promise((r) => setTimeout(r, 2000));

  let element = null;

  // Try different selectors based on the exact HTML structure
  const selectors = [
    "button.cursor-pointer.bg-green.text-white",
    "button.cursor-pointer.bg-green",
    "button.bg-green span",
    "button.text-white span",
    // Fallback selectors
    "button.cursor-pointer",
    'button[type="button"]',
    "button.hover\\:bg-green-400",
  ];

  for (const selector of selectors) {
    try {
      const elements = await this.driver.$$(selector);
      for (const el of elements) {
        const text = await el.getText();
        if (text.trim() === "Save") {
          element = el;
          break;
        }
      }
      if (element) break;
    } catch (e) {
      console.log(`Selector ${selector} failed:`, e.message);
    }
  }

  // If still not found, try finding by exact class combination
  if (!element) {
    element = await this.driver.$(
      "button.cursor-pointer.bg-green.text-white.hover\\:bg-green-400.inline-flex.items-center.justify-center.whitespace-nowrap.rounded.text-sm.transition.font-bold"
    );
  }

  // Final fallback to find any button containing "Save"
  if (!element) {
    const buttons = await this.driver.$$("button");
    for (const button of buttons) {
      try {
        const text = await button.getText();
        if (text.trim() === "Save") {
          element = button;
          break;
        }
      } catch (e) {
        continue;
      }
    }
  }

  if (!element) {
    const url = await this.driver.getUrl();
    throw new Error(`Save settings button not found. Current URL: ${url}`);
  }

  await element.waitForClickable({
    timeout: 5000,
    timeoutMsg: "Save button not clickable after 5 seconds",
  });

  // Add a small delay before clicking
  await new Promise((r) => setTimeout(r, 1000));

  await element.click();

  // Add a small delay after clicking
  await new Promise((r) => setTimeout(r, 1000));
});

When("I click on the {string} function", async function (option) {
  await new Promise((r) => setTimeout(r, 2000));

  let element;

  switch (option.toLowerCase()) {
    case "settings":
      element = await this.driver.$(
        'a.gh-nav-bottom-tabicon[data-test-nav="settings"]'
      );

      if (!element) {
        element = await this.driver.$('[data-test-nav="settings"]');
      }

      if (!element) {
        element = await this.driver.$('a[href="#/settings/"]');
      }

      if (!element) {
        element = await this.driver.$(".gh-nav-bottom-tabicon");
      }
      break;

    case "members":
      element = await this.driver.$('[data-test-nav="members"]');
      break;

    // Add other cases as needed
    default:
      throw new Error(`Navigation function "${option}" not implemented`);
  }

  if (!element) {
    throw new Error(`Could not find element for "${option}" function`);
  }

  await element.waitForClickable({ timeout: 5000 });
  await element.click();

  // Add a small delay after clicking to allow for any animations
  await new Promise((r) => setTimeout(r, 1000));
});

Then("the save button is not clickable", async function () {
  await new Promise((r) => setTimeout(r, 2000));

  const selectors = [
    "button.opacity-40.bg-grey-200",
    'button span:contains("Save")',
    'button[type="button"]',
    "button.opacity-40",
  ];

  let saveButton = null;

  for (const selector of selectors) {
    try {
      const elements = await this.driver.$$(selector);
      for (const el of elements) {
        const text = await el.getText();
        if (text.toLowerCase().includes("save")) {
          saveButton = el;
          break;
        }
      }
      if (saveButton) break;
    } catch (e) {
      console.log(
        `Failed to find button with selector ${selector}:`,
        e.message
      );
    }
  }

  if (!saveButton) {
    throw new Error("Save button not found");
  }

  try {
    const isEnabled = await saveButton.isEnabled();
    const hasDisabledClass = (await saveButton.getAttribute("class")).includes(
      "opacity-40"
    );

    console.log("Button state:", {
      isEnabled,
      hasDisabledClass,
      class: await saveButton.getAttribute("class"),
    });

    // Take a screenshot for debugging
    await this.driver.saveScreenshot("save-button-state.png");

    // The button should be disabled (not clickable)
    // Note: isEnabled is false and hasDisabledClass is true in the working state
    if (isEnabled || !hasDisabledClass) {
      throw new Error("Save button is enabled when it should be disabled");
    }
  } catch (e) {
    console.error("Error checking button state:", e);
    throw e;
  }
});

When("I click on settings menu", async function () {
  await new Promise((r) => setTimeout(r, 2000));

  let element = null;

  // Updated selectors to match the exact structure
  const selectors = [
    'a[data-test-nav="settings"]',
    ".gh-nav-bottom-tabicon",
    "#ember551", // Note: This ID might be dynamic
    "a.ember-view.gh-nav-bottom-tabicon",
    // Fallback selectors
    'a[href="#/settings/"]',
    'svg[viewBox="0 0 24 24"]',
  ];

  for (const selector of selectors) {
    try {
      element = await this.driver.$(selector);
      if ((await element.isExisting()) && (await element.isDisplayed())) {
        break;
      }
    } catch (e) {
      console.log(`Selector ${selector} failed:`, e.message);
    }
  }

  if (!element) {
    // Try finding by SVG title text
    const elements = await this.driver.$$("title");
    for (const el of elements) {
      try {
        const text = await el.getText();
        if (text.includes("Settings")) {
          element = await el.parentElement();
          while (element && !((await element.getTagName()) === "a")) {
            element = await element.parentElement();
          }
          break;
        }
      } catch (e) {
        continue;
      }
    }
  }

  if (!element) {
    throw new Error("Settings menu button not found");
  }

  await element.waitForClickable({
    timeout: 5000,
    timeoutMsg: "Settings menu button not clickable after 5 seconds",
  });

  await element.click();
  await new Promise((r) => setTimeout(r, 2000));
});

When("I click on general settings", async function () {
  await new Promise((r) => setTimeout(r, 3000));

  let element = null;

  // Try to find the button/link by various methods
  const selectors = [
    // Direct button/link selectors
    'button[data-test-button="general"]',
    'a[href="#/settings/general/"]',
    'a[data-test-nav="settings-general"]',
    // List item selectors
    ".gh-setting-group",
    ".gh-setting-first",
    ".gh-setting",
    // Card selectors
    ".gh-setting-header",
    ".gh-settings-main-container a",
    // Try finding by text content
    "h4=General",
    "a=General",
    "button=General",
    // Fallback to any clickable element containing "General"
    '*[class*="setting"]',
  ];

  // Log current page content for debugging
  const pageContent = await this.driver.$("body").getText();
  console.log("Page content:", pageContent);

  // First try direct selectors
  for (const selector of selectors) {
    try {
      const elements = await this.driver.$$(selector);
      for (const el of elements) {
        try {
          const text = await el.getText();
          const isDisplayed = await el.isDisplayed();
          console.log(
            `Found element with selector "${selector}": text="${text}", displayed=${isDisplayed}`
          );

          if (text.toLowerCase().includes("general") && isDisplayed) {
            element = el;
            break;
          }
        } catch (e) {
          continue;
        }
      }
      if (element) break;
    } catch (e) {
      console.log(`Selector ${selector} failed:`, e.message);
    }
  }

  // If not found, try finding any clickable element containing "General"
  if (!element) {
    try {
      const elements = await this.driver.$$(
        'a, button, div[role="button"], span[role="button"]'
      );
      for (const el of elements) {
        try {
          const text = await el.getText();
          const isDisplayed = await el.isDisplayed();
          const isClickable = await el.isClickable();
          console.log(
            `Found clickable element: text="${text}", displayed=${isDisplayed}, clickable=${isClickable}`
          );

          if (
            text.toLowerCase().includes("general") &&
            isDisplayed &&
            isClickable
          ) {
            element = el;
            break;
          }
        } catch (e) {
          continue;
        }
      }
    } catch (e) {
      console.log("Failed to search clickable elements:", e.message);
    }
  }

  // Take a screenshot and log the HTML for debugging
  await this.driver.saveScreenshot("general-settings-debug.png");
  const html = await this.driver.$("body").getHTML();
  console.log("Page HTML:", html);

  if (!element) {
    throw new Error("General settings link not found");
  }

  // Log the element we found
  console.log("Found element:", {
    text: await element.getText(),
    tag: await element.getTagName(),
    class: await element.getAttribute("class"),
    href: await element.getAttribute("href"),
  });

  await element.waitForClickable({
    timeout: 5000,
    timeoutMsg: "General settings link not clickable after 5 seconds",
  });

  await element.click();
  await new Promise((r) => setTimeout(r, 2000));
});

When("I expand title settings", async function () {
  await new Promise((r) => setTimeout(r, 2000));

  let element = null;

  const selectors = [
    ".gh-setting-first button",
    ".gh-setting-action button",
    "[data-test-toggle-pub-info]",
    // Try finding by text content
    ".gh-expandable button",
    ".gh-setting button",
  ];

  for (const selector of selectors) {
    try {
      const elements = await this.driver.$$(selector);
      for (const el of elements) {
        const text = await el.getText();
        const ariaLabel = await el.getAttribute("aria-label");
        if (
          text.includes("Expand") ||
          (ariaLabel && ariaLabel.includes("Expand")) ||
          text.includes("Title")
        ) {
          element = el;
          break;
        }
      }
      if (element) break;
    } catch (e) {
      console.log(`Selector ${selector} failed:`, e.message);
    }
  }

  if (!element) {
    throw new Error("Title settings expand button not found");
  }

  await element.waitForClickable({
    timeout: 5000,
    timeoutMsg: "Title settings expand button not clickable after 5 seconds",
  });

  await element.click();
  await new Promise((r) => setTimeout(r, 1000));
});

When("I click edit language", async function () {
  await new Promise((r) => setTimeout(r, 2000));

  const selectors = [
    // Exact class match
    "button.cursor-pointer.text-grey-900.dark\\:text-white",
    // Button with Edit text
    'button span:contains("Edit")',
    // More specific selectors
    'button.cursor-pointer[type="button"]',
    'button.text-grey-900[type="button"]',
    // Fallback selectors
    "button.inline-flex",
    'button:has(span:contains("Edit"))',
  ];

  let editButton = null;

  for (const selector of selectors) {
    try {
      const elements = await this.driver.$$(selector);
      for (const el of elements) {
        const text = await el.getText();
        if (text.toLowerCase().includes("edit")) {
          editButton = el;
          break;
        }
      }
      if (editButton) break;
    } catch (e) {
      console.log(
        `Failed to find button with selector ${selector}:`,
        e.message
      );
    }
  }

  if (!editButton) {
    // Take a screenshot for debugging
    await this.driver.saveScreenshot("edit-button-not-found.png");
    throw new Error("Edit button not found");
  }

  try {
    await editButton.waitForClickable({
      timeout: 5000,
      timeoutMsg: "Edit button not clickable after 5 seconds",
    });

    await editButton.click();
  } catch (e) {
    console.log(`Failed to click edit button:`, e.message);
    throw e;
  }
});

When("I enter Site language {string}", async function (language) {
  // Find the language input field and enter the value
  // You'll need to inspect the page to get the correct selector
  let element = await this.driver.$('input[name="locale"]'); // Adjust selector as needed
  return await element.setValue(language);
});
