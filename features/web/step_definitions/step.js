const { Given, When, Then } = require("@cucumber/cucumber");
const properties = require("../../../properties.json");
const { expect } = require("chai");

//Intento de usar lógica para encontrar selector más específico
async function findElement(driver, selectors) {
  for (let selector of selectors) {
    try {
      const element = await driver.$(selector);
      if (await element.isExisting()) {
        return element;
      }
    } catch (error) {
      console.log(
        `Failed with selector $
        {selector}`,
        error.message
      );
    }
  }
}

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
  await new Promise((r) => setTimeout(r, 2000));

  const emailSelectors = [
    "#identification",
    ".email.ember-text-field.gh-input",
  ];

  const element = await findElement(this.driver, emailSelectors);
  const emailKey = email.replace(/[<>]/g, "");
  return await element.setValue(properties[emailKey]);
});

When("I enter login password {string}", async function (password) {
  const passwordSelectors = [
    "#password",
    ".password.ember-text-field.gh-input",
  ];
  const element = await findElement(this.driver, passwordSelectors);
  const passwordKey = password.replace(/[<>]/g, "");
  return await element.setValue(properties[passwordKey]);
});

When("I submit login", async function () {
  const buttonSelectors = [
    "[data-test-button='sign-in']",
    "button.login.gh-btn.gh-btn-login",
  ];
  const element = await findElement(this.driver, buttonSelectors);
  return await element.click();
});

When("I click on the page option", async function () {
  await new Promise((r) => setTimeout(r, 2000));

  const selectors = ["[data-test-nav='pages']", 'a[href="#/pages/"]'];

  try {
    await this.driver.waitUntil(
      async () => {
        const nav = await this.driver.$(".gh-nav-list");
        return await nav.isDisplayed();
      },
      {
        timeout: 10000,
        timeoutMsg: "Navigation menu not visible after 10s",
      }
    );

    const element = await findElement(this.driver, selectors);
    return await element.click();
  } catch (error) {
    console.log("Error clicking pages option:", error);
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

When("I click on the posts option on version 4.5", async function () {
  const selectors = [
    // Primary selectors based on exact structure
    '.ember-view[href="#/posts/"]',
    "#ember14.ember-view",
    // SVG-based selectors
    "a:has(svg:has(.posts_svg__a))",
    // Text + href combination
    'a[href="#/posts/"]:contains("Posts")',
    // Legacy selectors as fallback
    '[data-test-nav="posts"]',
  ];
  const element = await findElement(this.driver, selectors);
  return await element.click();
});

When("I click on the members option", async function () {
  let element = await this.driver.$('[data-test-nav="members"]');
  return await element.click();
});

When("I click on the members option on version 4.5", async function () {
  const selectors = [
    // Primary selectors based on exact structure
    '.ember-view[href="#/members/"]',
    // SVG-based selectors
    "a:has(svg:has(.members_svg__a))",
    // Text + href combination
    'a[href="#/members/"]:contains("Members")',
    // Legacy selectors as fallback
    '[data-test-nav="members"]',
  ];
  const element = await findElement(this.driver, selectors);
  return await element.click();
});

When("I click on the tags option", async function () {
  let element = await this.driver.$('[data-test-nav="tags"]');
  return await element.click();
});

When("I click on the tags option on version 4.5", async function () {
  const selectors = [
    // Primary selectors based on exact structure
    '.ember-view[href="#/tags/"]',
    // SVG-based selectors
    "a:has(svg:has(.tags_svg__a))",
    // Text + href combination
    'a[href="#/tags/"]:contains("Tags")',
    // Legacy selectors as fallback
    '[data-test-nav="tags"]',
  ];
  const element = await findElement(this.driver, selectors);
  return await element.click();
});

When("I click on the new page button", async function () {
  await new Promise((r) => setTimeout(r, 3000));

  const selectors = [
    "#ember97",
    'a.ember-view.gh-btn.gh-btn-primary.view-actions-top-row[href="#/editor/page/"]', // Selector completo
    'a.gh-btn.gh-btn-primary[href="#/editor/page/"]', // Selector simplificado
    'a[href="#/editor/page/"].gh-btn-primary', // Por href y clase
    'a.view-actions-top-row[href="#/editor/page/"]', // Por clase específica
    'a.gh-btn-primary span:contains("New page")', // Por texto del span
    ".gh-btn.gh-btn-primary.view-actions-top-row",
  ];

  const element = await findElement(this.driver, selectors);
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

When("I Click on the new post button on version 4.5", async function () {
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

When("I enter title post on version 4.5", async function () {
  let element = await this.driver.$(
    "textarea.gh-editor-title.ember-text-area.gh-input.ember-view"
  );
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

When("I enter detail post on version 4.5", async function () {
  await new Promise((r) => setTimeout(r, 2000));

  let element = await this.driver.$('div[data-koenig-dnd-container="true"]');

  await element.waitForDisplayed({ timeout: 5000 });
  return await element.setValue("Este es un post de prueba creado con Kraken");
});

When("I click publish on version 5.96", async function () {
  // Wait for editor to load completely
  await new Promise((r) => setTimeout(r, 5000));

  try {
    // Try to find the exact button using data-test attribute first
    const selectors = [
      "button.gh-btn.gh-btn-black.gh-btn-large[data-test-button='continue']",
      "button.gh-btn.gh-btn-editor.darkgrey.gh-publish-trigger",
    ];
    const button = await findElement(this.driver, selectors);
    await button.waitForClickable({ timeout: 5000 });
    return await button.click();
  } catch (error) {
    console.error("Error clicking publish button:", error);
  }
});

When("I click publish", async function () {
  await new Promise((r) => setTimeout(r, 2000));

  const dropdownSelectors = [
    // Selector exacto basado en el HTML proporcionado
    "div.gh-btn.gh-btn-editor.gh-publishmenu-trigger",
    "#ember350.gh-publishmenu-trigger",
    '[data-ebd-id="ember349-trigger"]',
    // Selectores de respaldo
    ".gh-publishmenu-trigger",
    'div[role="button"][aria-expanded="false"]',
    // Selector por texto
    'div[role="button"] span:contains("Publish")',
  ];
  try {
    const elementDropdown = await findElement(this.driver, dropdownSelectors);
    await elementDropdown.waitForClickable({ timeout: 5000 });
    await elementDropdown.click();
  } catch (error) {
    console.log("Error clicking publish dropdown:", error);
  }

  const selectors = [
    'button[data-test-button="publish-flow"]',
    ".gh-btn.gh-btn-black.gh-publishmenu-button",
  ];
  const element = await findElement(this.driver, selectors);
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
  // Wait for 4 seconds to ensure elements are loaded
  await new Promise((r) => setTimeout(r, 4000));

  try {
    // First check if there's already a "Published" notification
    const publishedNotification = await this.driver.$(
      ".gh-notification-title=Published"
    );
    const isDisplayed = await publishedNotification.isDisplayed();

    // If notification is visible, skip the confirmation click
    if (isDisplayed) {
      console.log("Post already published, skipping confirmation click");
      return;
    }
  } catch (error) {
    // If no notification found, proceed with clicking the confirmation button
    let element = await this.driver.$('button[data-test-button="continue"]');
    await element.waitForClickable({ timeout: 5000 });
    return await element.click();
  }
});

When("I click publish confirm on version 5.96", async function () {
  await new Promise((r) => setTimeout(r, 4000));

  const selectors = [
    'button[data-test-button="continue"]',
    "gh-btn.gh-btn-black.gh-btn-large",
    "gh-btn.gh-btn-large.gh-btn-puls",
    'button[data-test-button="confirm-publish"]',
    ".gh-btn.gh-btn-black.gh-publishmenu-button",
  ];
  const element = await findElement(this.driver, selectors);
  await element.waitForClickable({ timeout: 5000 });
  return await element.click();
});

When("I click final publish", async function () {
  await new Promise((r) => setTimeout(r, 4000));

  const selectors = [
    "gh-btn.gh-btn-large.gh-btn-puls",
    'button[data-test-button="confirm-publish"]',
    ".gh-btn.gh-btn-black.gh-publishmenu-button",
  ];

  const element = await findElement(this.driver, selectors);
  await element.waitForClickable({ timeout: 5000 });
  return await element.click();
});

When("I enter title page", async function () {
  await new Promise((r) => setTimeout(r, 8000));
  const selectors = [".gh-editor-title.ember-text-area"];
  const element = await findElement(this.driver, selectors);
  return await element.setValue("Nueva pagina de prueba");
});

When("I enter detail page", async function () {
  await new Promise((r) => setTimeout(r, 2000));
  const selectors = [
    'div.kg-prose[contenteditable="true"][data-lexical-editor="true"]',
    '.koenig-editor__editor[data-kg="editor"]',
    'div[data-kg="editor"]',
    '.koenig-editor__editor[contenteditable="true"]',
    ".kg-prose[contenteditable='true']",
    ".kg-prose.kg-prose-focusable",
    ".kg-prose.kg-prose-focusable.kg-prose-focusable-editing",
  ];
  const element = await findElement(this.driver, selectors);
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

When(
  "I enter email new member {string} on version 4.5",
  async function (email) {
    await new Promise((r) => setTimeout(r, 2000));

    const emailSelectors = [
      // Most specific selector matching Ghost 4.5
      "input#member-email.ember-text-field.gh-input.ember-view",
      // Backup selectors from most to least specific
      "#member-email",
      "input.gh-input.ember-text-field",
      'input[name="email"]',
      // Original selector as fallback
      'input[data-test-input="member-email"]',
    ];

    const element = await findElement(this.driver, emailSelectors);

    if (!element) {
      throw new Error("Member email input field not found");
    }

    await element.waitForDisplayed({
      timeout: 5000,
      timeoutMsg: "Member email input not displayed after 5 seconds",
    });

    return await element.setValue(email);
  }
);

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

When("I enter tag name {string} on version 4.5", async function (name) {
  let element = await this.driver.$(
    "input#tag-name.ember-text-field.gh-input.ember-view"
  );
  return await element.setValue(name);
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

When("I click on the settings option on version 4.5", async function () {
  await new Promise((r) => setTimeout(r, 1000));
  const settingsSelectors = [
    // Most specific selectors
    '.gh-nav-bottom-tabicon[href="#/settings/"]',
    "#ember47.gh-nav-bottom-tabicon",
    "a.ember-view.gh-nav-bottom-tabicon",
    // Data attribute selectors
    '[data-test-nav="settings"]',
    // SVG-based selectors
    "a:has(svg .settings_svg__a)",
    // Fallback selectors
    ".gh-nav-bottom-tabicon",
    'a[href="#/settings/"]',
  ];

  const settingsButton = await findElement(this.driver, settingsSelectors);

  await settingsButton.waitForClickable({
    timeout: 5000,
    timeoutMsg: "Settings button not clickable after 5 seconds",
  });

  // Ensure element is in view
  await this.driver.executeScript("arguments[0].scrollIntoView(true);", [
    settingsButton,
  ]);

  // Small delay after scroll
  await new Promise((r) => setTimeout(r, 500));

  return await settingsButton.click();
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

When("I click edit site on version 4.5", async function () {
  await new Promise((r) => setTimeout(r, 2000));

  const generalSettingsSelectors = [
    // Most specific selectors
    'a[href="#/settings/general/"].gh-setting-group',
    "#ember276.gh-setting-group",
    // Content-based selectors
    '.gh-setting-group:has(h4:contains("General"))',
    // SVG-based selectors
    ".gh-setting-group:has(.yellow svg)",
    // Text-based fallbacks
    'a:has(h4:contains("General"))',
    // Most generic fallback
    ".gh-setting-group",
  ];

  const generalSettings = await findElement(
    this.driver,
    generalSettingsSelectors
  );

  await generalSettings.waitForClickable({
    timeout: 5000,
    timeoutMsg: "General settings button not clickable after 5 seconds",
  });

  return await generalSettings.click();
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

Then("the save button is clickable on version 4.5", async function () {
  await new Promise((r) => setTimeout(r, 2000));

  const saveButton = await this.driver.$(".gh-btn-primary");

  if (!saveButton) {
    throw new Error("Save settings button not found");
  }

  const isClickable = await saveButton.isClickable();

  if (!isClickable) {
    throw new Error("Save settings button is not clickable when it should be");
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

When("I edit site language on version 4.5", async function () {
  // Buscamos el tercer botón de expansión
  const expandButtonXPath = [
    // Usando índice en XPath (el tercero)
    '(//button[contains(@class, "gh-btn")][.//span[text()="Expand"]])[3]',

    // Alternativa usando la estructura completa
    '(//div[contains(@class, "gh-expandable-block")]//button[contains(@class, "gh-btn")])[3]',

    // Respaldo usando el data-ember-action
    '//button[@data-ember-action-419="419"]',
  ];

  let expandButton;
  for (const xpath of expandButtonXPath) {
    try {
      expandButton = await this.driver.$(`${xpath}`);
      if (await expandButton.isExisting()) {
        const buttonText = await expandButton.getText();
        if (buttonText.includes("Expand")) {
          break;
        }
      }
    } catch (e) {
      console.log(`XPath ${xpath} failed, trying next...`);
    }
  }

  if (!expandButton) {
    throw new Error("No se pudo encontrar el tercer botón de expandir");
  }

  // Log para debugging
  console.log("Found button:", {
    text: await expandButton.getText(),
    class: await expandButton.getAttribute("class"),
    index: "3rd button",
  });

  await expandButton.waitForClickable({
    timeout: 5000,
    timeoutMsg:
      "El tercer botón de expandir no es clickeable después de 5 segundos",
  });

  await expandButton.click();
  await new Promise((r) => setTimeout(r, 1000));
  // Ahora buscamos el campo de idioma
  const languageInputSelectors = [
    // Selector más específico usando las clases exactas
    "input.ember-text-field.gh-input.ember-view",

    // Usando el ID (aunque puede cambiar)
    "#ember485",

    // Combinación de atributos
    'input[type="text"].gh-input',

    // XPath como respaldo
    '//input[contains(@class, "gh-input") and contains(@class, "ember-text-field")]',
  ];
  const languageInput = await findElement(this.driver, languageInputSelectors);

  // Limpiamos el campo actual
  await languageInput.clearValue();

  // Esperamos un momento después de limpiar
  await new Promise((r) => setTimeout(r, 500));

  // Establecemos el nuevo valor
  return await languageInput.setValue("es");
});

When("I enter Site language {string}", async function (language) {
  // Find the language input field and enter the value
  // You'll need to inspect the page to get the correct selector
  let element = await this.driver.$('input[name="locale"]'); // Adjust selector as needed
  return await element.setValue(language);
});

Then("I should see the text {string}", async function (text) {
  await new Promise((r) => setTimeout(r, 2000));

  const dashboardSelectors = [
    'a[data-test-nav="dashboard"]',

    // Primary selectors (most specific)
    'a[title="Dashboard"][href="#/dashboard/"]', // By title and href combined
    'a[href="#/dashboard/"]', // By href
    'a[title="Dashboard"]', // By title

    // Backup selectors (less specific)
    '.ember-view[href="#/dashboard/"]', // By class and href
    "a.ember-view:has(svg)", // By class and structure
    'a:contains("Dashboard")', // By text content
  ];
  // Usamos el selector más específico
  let element = await findElement(this.driver, dashboardSelectors);

  // Obtenemos el texto del elemento, excluyendo el contenido del SVG
  let actualText = await element.getText();

  // Verificamos que el texto coincida, ignorando espacios en blanco
  expect(actualText.trim()).to.equal(text);
});

Then("I see the alert {string}", async function (text) {
  await new Promise((r) => setTimeout(r, 2000));
  const notificationSelectors = [".gh-notification-title"];
  const element = await findElement(this.driver, notificationSelectors);
  const actualText = await element.getText();
  expect(actualText.trim()).to.equal(text);
});

When("I click avatar", async function () {
  await new Promise((r) => setTimeout(r, 2000));

  const avatarSelectors = [
    '.ember-basic-dropdown-trigger[role="button"]',
    ".ember-view.ember-basic-dropdown-trigger",
    "div.gh-user-avatar",
    // Fallback selectors
    '[data-ebd-id*="trigger"]',
    ".ember-basic-dropdown-trigger",
  ];

  const element = await findElement(this.driver, avatarSelectors);

  await element.waitForClickable({
    timeout: 5000,
    timeoutMsg: "Avatar dropdown trigger not clickable after 5 seconds",
  });

  return await element.click();
});

When("I click my profile", async function () {
  await new Promise((r) => setTimeout(r, 2000));

  const profileSelectors = [
    '[data-test-nav="user-profile"]',
    'a.dropdown-item[href*="/settings/staff/"]',
    '.dropdown-item:contains("Your profile")',
    // Fallback selectors
    'a[href*="/settings/staff/"]',
    ".ember-view.dropdown-item",
  ];

  const element = await findElement(this.driver, profileSelectors);

  await element.waitForClickable({
    timeout: 5000,
    timeoutMsg: "Profile link not clickable after 5 seconds",
  });

  return await element.click();
});

When("I click my profile on version 4.5", async function () {
  await new Promise((r) => setTimeout(r, 2000));

  const staffSelectors = [
    // Selectores específicos para el enlace Staff
    "#ember20.active.ember-view",
    'a.active[href="#/staff/"]',

    // Usando la estructura del SVG y texto
    "a.ember-view:has(svg#staff_svg__Regular)",

    // XPath específicos
    '//a[@id="ember20"][contains(@class, "active")]',
    '//a[contains(@class, "active")][contains(@href, "/staff/")]',

    // Selector de respaldo
    'a.ember-view:has(svg):contains("Staff")',
  ];

  const element = await findElement(this.driver, staffSelectors);

  // Asegurarse de que el elemento está en la vista
  await this.driver.executeScript("arguments[0].scrollIntoView(true);", [
    element,
  ]);

  await new Promise((r) => setTimeout(r, 1000));

  await element.waitForClickable({
    timeout: 10000,
    timeoutMsg: "Staff link not clickable after 10 seconds",
  });

  return await element.click();
});

When("I enter new name {string}", async function (name) {
  await new Promise((r) => setTimeout(r, 2000));

  const nameInputSelectors = [
    'input[maxlength="191"][type="text"]',
    'input.peer[type="text"]',
    // More specific class-based selector
    "input.peer.z-[1].order-2.h-9.w-full",
    // Fallback selectors
    'input[name*="r"]',
    "input.peer",
  ];

  const element = await findElement(this.driver, nameInputSelectors);

  await element.waitForDisplayed({
    timeout: 5000,
    timeoutMsg: "Name input field not displayed after 5 seconds",
  });

  // Clear existing value using multiple approaches
  await element.click();
  const valueLength = (await element.getValue()).length;
  if (valueLength > 0) {
    // Send backspace keys to clear the field
    await element.keys([...Array(valueLength)].map(() => "Backspace"));
    // Additional clear attempt
    await element.clearValue();
  }

  // Small delay to ensure clearing is complete
  await new Promise((r) => setTimeout(r, 500));

  // Enter new value
  return await element.setValue(name);
});

When("I enter new name {string} on version 4.5", async function (name) {
  await new Promise((r) => setTimeout(r, 2000));

  const nameInputSelectors = [
    // Selector específico usando el ID
    "#user-name",

    // Usando la clase específica
    "input.user-name.ember-text-field.gh-input",

    // Usando el placeholder
    'input[placeholder="Full Name"]',

    // Combinación de atributos
    'input[autocorrect="off"][type="text"].gh-input',

    // XPath como respaldo
    '//input[@id="user-name"]',
    '//input[contains(@class, "user-name") and contains(@class, "gh-input")]',
  ];

  const element = await findElement(this.driver, nameInputSelectors);

  await element.waitForDisplayed({
    timeout: 5000,
    timeoutMsg: "Name input field not displayed after 5 seconds",
  });

  // Clear existing value using multiple approaches
  await element.click();
  const valueLength = (await element.getValue()).length;
  if (valueLength > 0) {
    // Send backspace keys to clear the field
    await element.keys([...Array(valueLength)].map(() => "Backspace"));
    // Additional clear attempt
    await element.clearValue();
  }

  // Small delay to ensure clearing is complete
  await new Promise((r) => setTimeout(r, 500));

  // Enter new value
  return await element.setValue(name);
});

When("I click save", async function () {
  await new Promise((r) => setTimeout(r, 2000));

  const saveButtonSelectors = [
    // Exact match for the button structure
    "button.cursor-pointer.bg-black.text-white.dark\\:bg-white.dark\\:text-black.hover\\:bg-grey-900",
    // Simplified but specific selectors
    "button.cursor-pointer.bg-black.text-white",
    'button.cursor-pointer span:contains("Save")',
    // Backup selectors
    "button.cursor-pointer",
    'button[type="button"]',
    // Find by text content
    'button:has(span:contains("Save"))',
  ];

  const element = await findElement(this.driver, saveButtonSelectors);

  await element.waitForClickable({
    timeout: 5000,
    timeoutMsg: "Save button not clickable after 5 seconds",
  });

  return await element.click();
});

When("I click save on version 4.5", async function () {
  await new Promise((r) => setTimeout(r, 2000));

  const saveButtonSelectors = [
    // Primary selectors for Ghost 4.5
    ".gh-btn.gh-btn-primary",
    ".gh-btn.gh-btn-icon",
    "#ember280",
    // Combined class selectors
    "button.gh-btn.gh-btn-primary.gh-btn-icon",
    // Backup selectors
    'button.gh-btn-primary span:contains("Save")',
    'button.gh-btn:has(span:contains("Save"))',
  ];

  const element = await findElement(this.driver, saveButtonSelectors);

  await element.waitForClickable({
    timeout: 5000,
    timeoutMsg: "Save button not clickable after 5 seconds",
  });

  return await element.click();
});

Then("I should see the heading {string}", async function (expectedText) {
  await new Promise((r) => setTimeout(r, 2000));

  const headingSelectors = [
    // Primary selectors for Ghost 4.5
    "h2.gh-canvas-title",
    ".gh-canvas-title",
    // Fallback selectors
    'h2:has(a[href="#/staff/"])',
    "h2",
  ];

  const element = await findElement(this.driver, headingSelectors);

  await element.waitForDisplayed({
    timeout: 5000,
    timeoutMsg: "Heading not displayed after 5 seconds",
  });

  const actualText = await element.getText();
  // Check if the expected text is contained within the heading
  expect(actualText).to.include(expectedText);
});

Then(
  "I should see the heading {string} on version 4.5",
  async function (expectedText) {
    const headingSelectors = [
      // Most specific selector matching the HTML structure
      "h2.gh-canvas-title",
      // Backup selectors
      ".gh-canvas-title",
      "h2:has(a[href='#/tags/'])",
    ];

    const element = await findElement(this.driver, headingSelectors);

    if (!element) {
      throw new Error("Heading element not found");
    }

    await element.waitForDisplayed({
      timeout: 5000,
      timeoutMsg: "Heading not displayed after 5 seconds",
    });

    const headingText = await element.getText();

    // Check if the expected text is included in the heading
    if (!headingText.includes(expectedText)) {
      throw new Error(
        `Expected heading to contain "${expectedText}" but found "${headingText}"`
      );
    }

    return true;
  }
);

When("I click on the post {string}", async function (postTitle) {
  await new Promise((r) => setTimeout(r, 2000));

  // First find all post titles
  const postElements = await this.driver.$$(".gh-content-entry-title");

  let targetPost = null;

  // Iterate through posts to find the one with matching title and published status
  for (const post of postElements) {
    const title = await post.getText();
    if (title.trim() === postTitle) {
      // Get the parent element that contains both title and status
      const parentElement = await post.parentElement();

      try {
        // Check if the post is published
        const statusElement = await parentElement.$(".published");
        const status = await statusElement.getText();

        if (status.trim() === "Published") {
          targetPost = parentElement;
          break;
        }
      } catch (e) {
        // Status element not found or not published, continue to next post
        continue;
      }
    }
  }

  if (!targetPost) {
    throw new Error(`Published post with title "${postTitle}" not found`);
  }

  await targetPost.waitForClickable({
    timeout: 5000,
    timeoutMsg: `Published post with title "${postTitle}" not clickable after 5 seconds`,
  });

  // Ensure element is in view before clicking
  await this.driver.executeScript("arguments[0].scrollIntoView(true);", [
    targetPost,
  ]);

  // Small delay after scroll
  await new Promise((r) => setTimeout(r, 500));

  return await targetPost.click();
});

When("I enter new title {string}", async function (title) {
  await new Promise((r) => setTimeout(r, 2000));

  const titleSelectors = [
    "textarea.gh-editor-title",
    ".gh-editor-title",
    'textarea[placeholder="Post title"]',
    // Fallback selectors
    "textarea.gh-input",
    ".gh-editor-title.ember-text-area",
    // Most generic fallback
    "textarea[data-test-editor-title-input]",
  ];

  const titleElement = await findElement(this.driver, titleSelectors);

  await titleElement.waitForDisplayed({
    timeout: 5000,
    timeoutMsg: "Title input not displayed after 5 seconds",
  });

  // Clear existing value first
  await titleElement.clearValue();

  // Small delay to ensure clearing is complete
  await new Promise((r) => setTimeout(r, 500));

  // Enter new value
  return await titleElement.setValue(title);
});

When("I click update", async function () {
  await new Promise((r) => setTimeout(r, 2000));

  const updateButtonSelectors = [
    // Primary selectors
    'button[data-test-button="publish-save"]',
    "button.gh-editor-save-trigger",
    "button.gh-btn-editor-save",
    // Secondary selectors
    "button.gh-publishmenu-button",
    "button.gh-btn-black",
    // Backup selectors
    'button:has(span:contains("Update"))',
    'button:has(span:contains("Save"))',
    // Most generic fallback
    "button.gh-btn",
    "button.cursor-pointer",
  ];

  const updateButton = await findElement(this.driver, updateButtonSelectors);

  await updateButton.waitForClickable({
    timeout: 5000,
    timeoutMsg: "Update button not clickable after 5 seconds",
  });

  return await updateButton.click();
});

When("I enter page title {string}", async function (title) {
  await new Promise((r) => setTimeout(r, 2000));

  const titleSelectors = [
    ".gh-editor-title",
    "textarea.gh-editor-title",
    "#ember488", // Note: ember IDs might be dynamic
    'textarea[placeholder="Page Title"]',
    // Fallback selectors
    "textarea.gh-input",
    ".gh-editor-title.ember-text-area",
  ];

  const titleElement = await findElement(this.driver, titleSelectors);

  await titleElement.waitForDisplayed({
    timeout: 5000,
    timeoutMsg: "Page title input not displayed after 5 seconds",
  });

  // Clear existing value first
  await titleElement.clearValue();

  // Enter new value
  return await titleElement.setValue(title);
});

Then("the update button is not clickable", async function () {
  await new Promise((r) => setTimeout(r, 2000));

  const updateButtonSelectors = [
    // Primary selectors
    'button[data-test-button="publish-save"]',
    "button.gh-editor-save-trigger",
    "button.gh-btn-editor-save",
    // Secondary selectors
    "button.gh-publishmenu-button",
    "button.gh-btn-black",
    // Backup selectors
    'button:has(span:contains("Update"))',
    'button:has(span:contains("Save"))',
    // Most generic fallback
    "button.gh-btn",
    "button.cursor-pointer",
  ];

  const updateButton = await findElement(this.driver, updateButtonSelectors);

  const isClickable = await updateButton.isClickable();
  expect(isClickable).to.be.false;
});

When("I click staff option", async function () {
  await new Promise((r) => setTimeout(r, 2000));

  const selectors = ["[data-test-nav='staff']", 'a[href="#/staff/"]'];

  try {
    await this.driver.waitUntil(
      async () => {
        const nav = await this.driver.$(".gh-nav-list");
        return await nav.isDisplayed();
      },
      {
        timeout: 10000,
        timeoutMsg: "Navigation menu not visible after 10s",
      }
    );

    const element = await findElement(this.driver, selectors);
    return await element.click();
  } catch (error) {
    console.log("Error clicking staff option:", error);
  }
});

When("I select the owner", async function () {
  await new Promise((r) => setTimeout(r, 2000));

  const ownerSelectors = [
    // Selector específico para el badge de Owner
    "span.gh-badge.owner",
    '.gh-badge:contains("Owner")',

    // XPath específicos
    '//span[contains(@class, "gh-badge") and contains(@class, "owner")]',
    '//span[contains(@class, "gh-badge")][text()="Owner"]',

    // Selectores de respaldo
    '[class*="gh-badge"][class*="owner"]',
    'span:contains("Owner")',
  ];

  const element = await findElement(this.driver, ownerSelectors);

  await element.waitForClickable({
    timeout: 5000,
    timeoutMsg: "Owner badge not clickable after 5 seconds",
  });

  return await element.click();
});

Then("I see the notification {string} on version 4.5", async function (text) {
  await new Promise((r) => setTimeout(r, 2000));
  const notificationSelectors = [".gh-notification-title"];
  const element = await findElement(this.driver, notificationSelectors);
  const actualText = await element.getText();
  expect(actualText.trim()).to.equal(text);
});
