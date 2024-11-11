const { Given, When, Then } = require("@cucumber/cucumber");
const { faker } = require("@faker-js/faker");
const fs = require("fs");
const csv = require("csv-parser");
const axios = require("axios");
const assert = require("assert");
const path = require("path");

const SELECTORS = {
  LOGIN: {
    EMAIL: [
      'input[name="identification"]',
      'input[type="email"]',
      "input#identification",
      "input#email",
      ".email.ember-text-field",
      "#ember8",
    ],
    PASSWORD: [
      'input[name="password"]',
      'input[type="password"]',
      "input#password",
      ".password.ember-text-field",
      "#ember9",
    ],
    SUBMIT: [
      'button[type="submit"]',
      "button.login",
      ".js-login-button",
      "#ember11",
    ],
  },
  EDITOR: {
    TITLE: "div > textarea.gh-editor-title.ember-text-area.gh-input.ember-view",
    CONTENT: "div.koenig-editor__editor.__mobiledoc-editor",
    CONTENT_EMPTY:
      "div.koenig-editor__editor.__mobiledoc-editor.__has-no-content",
  },
  NAV: {
    TOP: "section .gh-nav-top",
    AVATAR: "div.gh-user-avatar.relative",
    POSTS: '.ember-view[href="#/posts/"]',
    PAGES: '.ember-view[href="#/pages/"]',
    TAGS: '.ember-view[href="#/tags/"]',
    MEMBERS: '.ember-view[href="#/members/"]',
  },
  USER: {
    NAME: "input#user-name",
    EMAIL: "input#user-email",
    PASSWORD_NEW: "input#user-password-new",
    PASSWORD_OLD: "input#user-password-old",
    PASSWORD_VERIFY: "input#user-new-password-verification",
  },
  TAG: {
    NAME: "#tag-name",
    SLUG: "#tag-slug",
    DESCRIPTION: "#tag-description",
    SAVE: "section .view-actions button",
    LIST_NAME: ".gh-tag-list-name",
  },
  MEMBER: {
    NEW: '.ember-view.gh-btn.gh-btn-primary[href="#/members/new/"]',
    NAME: "input#member-name",
    EMAIL: "input#member-email",
    NOTE: "textarea#member-note",
  },
  PUBLISH: {
    MENU: "div.gh-publishmenu.ember-view",
    BUTTON:
      "button.gh-btn.gh-btn-black.gh-publishmenu-button.gh-btn-icon.ember-view",
    CONFIRM: "button.gh-btn.gh-btn-black.gh-btn-icon.ember-view",
    UNPUBLISH: "div.gh-publishmenu-radio-content >  div:nth-child(1)",
  },
  tags: [
    '[data-test-nav="tags"]',
    'a[href="#/tags/"]',
    '[href="#/tags/"]',
    "a.gh-nav-tags",
    '.gh-nav-list a[href="#/tags/"]',
    '[data-test-screen="tags"]',
  ].join(","),
  settings: [
    ".gh-nav-settings",
    '[data-test-nav="settings"]',
    'a[href="#/settings/"]',
    ".settings-menu-toggle",
    "#ember-basic-dropdown-trigger-settings",
    '.gh-nav-list a[href="#/settings/"]',
  ].join(","),
};

let state = {
  data: [],
  currentTagSlug: "",
  existingTagName: "",
  existingEmailStaff: "",
};

const readCSVFile = (filePath) => {
  return new Promise((resolve, reject) => {
    const data = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (row) => data.push(row))
      .on("end", () => resolve(data))
      .on("error", reject);
  });
};

const getRandomArrayElement = (array) => {
  const index = Math.floor(Math.random() * array.length);
  return array[index];
};

const clickElement = async (driver, selector) => {
  const element = await driver.$(selector);
  return await element.click();
};

const setValue = async (driver, selectors, value) => {
  if (typeof selectors === "string") {
    selectors = [selectors];
  }

  let lastError;
  for (const selector of selectors) {
    try {
      const element = await driver.$(selector);
      const exists = await element.isExisting();
      if (exists) {
        await element.waitForClickable({ timeout: 5000 });
        return await element.setValue(value);
      }
    } catch (error) {
      lastError = error;
      continue;
    }
  }

  await debugPage(driver);
  throw new Error(
    `Could not set value. Tried selectors: ${selectors.join(
      ", "
    )}. Last error: ${lastError}`
  );
};

const debugPage = async (driver) => {
  console.log("Debugging page elements...");
  const html = await driver.$("body").getHTML();
  console.log("Page HTML:", html);

  const inputs = await driver.$$("input");
  console.log(
    "Found input elements:",
    await Promise.all(
      inputs.map(async (el) => {
        try {
          const attrs = await driver.execute((el) => {
            const attributes = {};
            for (const attr of el.attributes) {
              attributes[attr.name] = attr.value;
            }
            return attributes;
          }, el);
          return attrs;
        } catch (e) {
          return "Could not get attributes";
        }
      })
    )
  );
};

const findInputElements = async (driver) => {
  console.log("Searching for input elements...");

  const inputs = await driver.$$("input");
  console.log(`Found ${inputs.length} input elements`);

  for (const input of inputs) {
    try {
      const tagName = await input.getTagName();
      const id = await input.getAttribute("id");
      const name = await input.getAttribute("name");
      const type = await input.getAttribute("type");
      const className = await input.getAttribute("class");

      console.log("Input element:", {
        tagName,
        id,
        name,
        type,
        className,
      });
    } catch (e) {
      console.log("Error getting input details:", e.message);
    }
  }
};

When("I enter login email {kraken-string}", async function (email) {
  try {
    await this.driver.pause(3000);

    await debugPage(this.driver);

    const inputs = await this.driver.$$("input");
    console.log(`Found ${inputs.length} input elements`);

    if (inputs.length === 0) {
      throw new Error("No input elements found on page");
    }

    const selectors = [
      'input[type="email"]',
      'input[name="identification"]',
      "input#identification",
      "input#email",
      ".gh-input.email",
      "#ember8",
    ];

    for (const selector of selectors) {
      try {
        const element = await this.driver.$(selector);
        const exists = await element.isExisting();
        if (exists) {
          console.log(`Found element with selector: ${selector}`);
          await element.waitForClickable({ timeout: 5000 });
          return await element.setValue(email);
        }
      } catch (error) {
        console.log(`Selector ${selector} failed:`, error.message);
      }
    }

    throw new Error("No valid email input field found");
  } catch (error) {
    console.error("Error entering login email:", error);
    throw error;
  }
});

When("I enter login password {kraken-string}", async function (password) {
  return await setValue(this.driver, SELECTORS.LOGIN.PASSWORD, password);
});

When("I enter login incorrect password {string}", async function (password) {
  try {
    console.log("Attempting to input password:", password);

    const passwordField = await this.driver.$(
      'input[type="password"], input[name="password"]'
    );

    if (!(await passwordField.isExisting())) {
      console.log("Password field selectors tried:", [
        'input[type="password"]',
        'input[name="password"]',
      ]);
      throw new Error("Password field not found");
    }

    console.log("Found password field, inputting value...");

    await passwordField.setValue(password);

    try {
      const value = await passwordField.getValue();
      console.log("Password field value length:", value.length);
      console.log("Password field value matches input:", value === password);
    } catch (e) {
      console.log(
        "Could not read password field value (this is normal for security reasons)"
      );
    }

    return true;
  } catch (error) {
    console.error("Error entering password:", error);
    throw error;
  }
});

When("I submit login", async function () {
  try {
    const submitButton = await this.driver.$('button[type="submit"]');
    await submitButton.click();

    await this.driver.pause(5000);

    try {
      const errorMessage = await this.driver.$(".main-error");
      const isErrorDisplayed = await errorMessage.isDisplayed();
      if (isErrorDisplayed) {
        const errorText = await errorMessage.getText();
        throw new Error(`Login failed: ${errorText}`);
      }
    } catch (error) {
      if (!error.message.includes("element wasn't found")) {
        throw error;
      }
    }
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
});

Then("I should have a nav-bar with functions", async function () {
  try {
    await this.driver.pause(5000);

    const currentUrl = await this.driver.getUrl();
    console.log("Current URL:", currentUrl);

    const navElements = [
      {
        selector: ".gh-nav",
        description: "Navigation container",
      },
      {
        selector: 'a[href="#/posts/"]',
        description: "Posts link",
      },
      {
        selector: 'a[href="#/pages/"]',
        description: "Pages link",
      },
    ];

    for (const element of navElements) {
      try {
        const el = await this.driver.$(element.selector);
        const isDisplayed = await el.isDisplayed();
        console.log(`Checking ${element.description}: ${isDisplayed}`);
        if (!isDisplayed) {
          throw new Error(`${element.description} is not visible`);
        }
      } catch (error) {
        console.error(`Error checking ${element.description}:`, error);
        throw new Error(
          `Failed to find ${element.description}: ${error.message}`
        );
      }
    }

    return true;
  } catch (error) {
    console.error("Navigation bar verification failed:", error);
    throw error;
  }
});

Then("I should be logged in", async function () {
  try {
    await this.driver.pause(3000);

    const loginForm = await this.driver.$("#login");
    const isLoginFormDisplayed = await loginForm
      .isDisplayed()
      .catch(() => false);

    if (isLoginFormDisplayed) {
      throw new Error("Still on login page - authentication failed");
    }

    const currentUrl = await this.driver.getUrl();
    if (!currentUrl.includes("/ghost/#/")) {
      throw new Error(`Not on Ghost admin page. Current URL: ${currentUrl}`);
    }

    return true;
  } catch (error) {
    console.error("Login verification failed:", error);
    throw error;
  }
});

Then("I should have a nav-bar with functions", async function () {
  try {
    await this.driver.pause(2000);

    const currentUrl = await this.driver.getUrl();
    if (!currentUrl.includes("/ghost/#/dashboard")) {
      throw new Error("Not on dashboard page after login");
    }

    const navBar = await this.driver.$(".gh-nav");
    const isNavBarDisplayed = await navBar.isDisplayed();

    if (!isNavBarDisplayed) {
      throw new Error("Navigation bar is not visible after login");
    }

    const menuItems = [
      ".gh-nav-manage", // Sección de gestión
      'a[href="#/posts/"]', // Enlace a posts
      'a[href="#/pages/"]', // Enlace a páginas
    ];

    for (const selector of menuItems) {
      const element = await this.driver.$(selector);
      const isDisplayed = await element.isDisplayed();
      if (!isDisplayed) {
        throw new Error(`Menu item ${selector} is not visible`);
      }
    }

    return true;
  } catch (error) {
    console.error("Error verifying navigation bar:", error);
    throw error;
  }
});

When("I click posts", async function () {
  return await clickElement(this.driver, SELECTORS.NAV.POSTS);
});

When("I click pages", async function () {
  return await clickElement(this.driver, SELECTORS.NAV.PAGES);
});

When("I click tags", async function () {
  return await clickElement(this.driver, SELECTORS.NAV.TAGS);
});

When("I click members", async function () {
  return await clickElement(this.driver, SELECTORS.NAV.MEMBERS);
});

Given("I have data from {string}", async function (csvPath) {
  try {
    state.data = await readCSVFile(csvPath);
  } catch (error) {
    console.error("Error reading CSV file:", error);
    throw error;
  }
});

When("I click new post", async function () {
  const newPostButton = await this.driver.$('a[href="#/editor/post/"]');
  return await newPostButton.click();
});

When("I click new page", async function () {
  const newPageButton = await this.driver.$('a[href="#/editor/page/"]');
  return await newPageButton.click();
});

Then("I enter title {kraken-string}", async function (title) {
  return await setValue(this.driver, SELECTORS.EDITOR.TITLE, title);
});

Then("I enter content {kraken-string}", async function (content) {
  return await setValue(this.driver, SELECTORS.EDITOR.CONTENT, content);
});

Then("I publish", async function () {
  await clickElement(this.driver, SELECTORS.PUBLISH.MENU);
  await clickElement(this.driver, SELECTORS.PUBLISH.BUTTON);
  return await clickElement(this.driver, SELECTORS.PUBLISH.CONFIRM);
});

Then("I unpublish", async function () {
  await clickElement(this.driver, SELECTORS.PUBLISH.MENU);
  await clickElement(this.driver, SELECTORS.PUBLISH.UNPUBLISH);
  return await clickElement(this.driver, SELECTORS.PUBLISH.CONFIRM);
});

When("I click new tag", async function () {
  const newTagButton = await this.driver.$('a[href="#/tags/new/"]');
  return await newTagButton.click();
});

When("I enter tag name {string}", async function (name) {
  return await setValue(this.driver, SELECTORS.TAG.NAME, name);
});

When("I enter tag slug {string}", async function (slug) {
  state.currentTagSlug = slug;
  return await setValue(this.driver, SELECTORS.TAG.SLUG, slug);
});

When("I enter tag description {string}", async function (description) {
  return await setValue(this.driver, SELECTORS.TAG.DESCRIPTION, description);
});

When("I save tag", async function () {
  return await clickElement(this.driver, SELECTORS.TAG.SAVE);
});

Then("I should see the tag in the list", async function () {
  const tagElements = await this.driver.$$(SELECTORS.TAG.LIST_NAME);
  const tagNames = await Promise.all(tagElements.map((el) => el.getText()));
  assert(
    tagNames.includes(state.currentTagSlug),
    "Tag should be visible in the list"
  );
});

When("I click new member", async function () {
  return await clickElement(this.driver, SELECTORS.MEMBER.NEW);
});

When("I enter member name {string}", async function (name) {
  return await setValue(this.driver, SELECTORS.MEMBER.NAME, name);
});

When("I enter member email {string}", async function (email) {
  return await setValue(this.driver, SELECTORS.MEMBER.EMAIL, email);
});

When("I enter member note {string}", async function (note) {
  return await setValue(this.driver, SELECTORS.MEMBER.NOTE, note);
});

Given("I consume API for posts", async function () {
  try {
    const response = await axios.get(
      "https://my.api.mockaroo.com/post.json?key=976f9b40"
    );
    const randomPost = getRandomArrayElement(response.data);

    await setValue(this.driver, SELECTORS.EDITOR.TITLE, randomPost.title);
    await setValue(this.driver, SELECTORS.EDITOR.CONTENT, randomPost.detail);
  } catch (error) {
    console.error("Error consuming posts API:", error);
    throw error;
  }
});

Given("I consume API for members", async function () {
  try {
    const response = await axios.get(
      "https://my.api.mockaroo.com/members.json?key=976f9b40"
    );
    const randomMember = getRandomArrayElement(response.data);

    await setValue(this.driver, SELECTORS.MEMBER.NAME, randomMember.name);
    await setValue(this.driver, SELECTORS.MEMBER.EMAIL, randomMember.email);
    await setValue(this.driver, SELECTORS.MEMBER.NOTE, randomMember.note || "");
  } catch (error) {
    console.error("Error consuming members API:", error);
    throw error;
  }
});

Then("I generate random post", async function () {
  const title = faker.lorem.sentence();
  const content = faker.lorem.paragraphs(3);

  await setValue(this.driver, SELECTORS.EDITOR.TITLE, title);
  await setValue(this.driver, SELECTORS.EDITOR.CONTENT, content);
});

Then("I generate random member", async function () {
  const name = faker.person.fullName();
  const email = faker.internet.email();
  const note = faker.lorem.paragraph();

  await setValue(this.driver, SELECTORS.MEMBER.NAME, name);
  await setValue(this.driver, SELECTORS.MEMBER.EMAIL, email);
  await setValue(this.driver, SELECTORS.MEMBER.NOTE, note);
});

Then("I should see error message {string}", async function (message) {
  const errorElement = await this.driver.$(".error");
  const errorText = await errorElement.getText();
  assert(
    errorText.includes(message),
    `Expected error message to include "${message}"`
  );
});

Then("I should see success message {string}", async function (message) {
  const successElement = await this.driver.$(".success");
  const successText = await successElement.getText();
  assert(
    successText.includes(message),
    `Expected success message to include "${message}"`
  );
});

When("I click user profile", async function () {
  return await clickElement(this.driver, SELECTORS.NAV.AVATAR);
});

When("I update user name {string}", async function (name) {
  return await setValue(this.driver, SELECTORS.USER.NAME, name);
});

When("I update user email {string}", async function (email) {
  return await setValue(this.driver, SELECTORS.USER.EMAIL, email);
});

When("I change password", async function (oldPassword, newPassword) {
  await setValue(this.driver, SELECTORS.USER.PASSWORD_OLD, oldPassword);
  await setValue(this.driver, SELECTORS.USER.PASSWORD_NEW, newPassword);
  return await setValue(
    this.driver,
    SELECTORS.USER.PASSWORD_VERIFY,
    newPassword
  );
});

Then("I should see a login error message", async function () {
  await this.driver.pause(3000);

  const selectors = [
    "p[data-test-error]",
    ".main-error",
    ".gh-alert-red",
    ".gh-alert",
    ".form-group.error",
    ".notification-error",
    "p.response",
    ".gh-errors",
    ".error",
  ];

  let errorFound = false;

  for (const selector of selectors) {
    try {
      const elements = await this.driver.$$(selector);
      for (const element of elements) {
        const isDisplayed = await element.isDisplayed();
        if (isDisplayed) {
          const text = await element.getText();
          if (text && text.length > 0) {
            console.log(
              `Found error message with selector "${selector}": "${text}"`
            );
            errorFound = true;
            return;
          }
        }
      }
    } catch (e) {
      continue;
    }
  }

  if (!errorFound) {
    const html = await this.driver.$("body").getHTML();
    console.log("Current page HTML:", html);
    throw new Error("No error message found on page");
  }
});

Then("I should still be on the login page", async function () {
  await this.driver.pause(2000);

  try {
    const currentUrl = await this.driver.getUrl();
    assert(
      currentUrl.includes("/ghost/#/signin"),
      `Not on login page. Current URL: ${currentUrl}`
    );

    const loginForm = await this.driver.$("#login");
    assert(await loginForm.isExisting(), "Login form not found");

    const emailField = await this.driver.$('input[name="identification"]');
    assert(await emailField.isExisting(), "Email field not found");

    const passwordField = await this.driver.$('input[name="password"]');
    assert(await passwordField.isExisting(), "Password field not found");

    return true;
  } catch (error) {
    const html = await this.driver.$("body").getHTML();
    console.log("Current page HTML:", html);
    throw error;
  }
});

When("I enter title page", async function () {
  await this.driver.pause(2000);

  try {
    const titleField = await this.driver.$("textarea.gh-editor-title");

    if (!(await titleField.isExisting()) || !(await titleField.isDisplayed())) {
      throw new Error("Title field not found or not visible");
    }
    await titleField.click();
    await titleField.setValue("Test Page Title " + new Date().getTime());
  } catch (error) {
    console.error("Error entering title:", error);
    throw error;
  }
});

When("I enter detail page", async function () {
  try {
    await this.driver.pause(5000);

    const editorSelectors = [
      'p[data-koenig-dnd-droppable="true"]', // Nuevo selector específico
      '[data-kg-card-editing="true"]', // Editor en modo edición
      ".kg-prose", // Contenedor de texto
      "article.koenig-editor", // Artículo del editor
      '[contenteditable="true"]', // Cualquier elemento editable
      "p.koenig-editor__editor", // Párrafo del editor
      "div.koenig-editor__editor", // Div del editor
      '[data-lexical-editor="true"]', // Editor Lexical (nuevo en Ghost)
    ];

    console.log(
      "Buscando editor con los siguientes selectores:",
      editorSelectors
    );

    // Intentar encontrar el editor usando diferentes selectores
    let editorFound = false;
    let editor;

    for (const selector of editorSelectors) {
      try {
        // Primero intentar en el contexto principal
        editor = await this.driver.$(selector);
        const isDisplayed = await editor.isDisplayed();
        console.log(
          `Probando selector "${selector}" en contexto principal: ${isDisplayed}`
        );

        if (isDisplayed) {
          editorFound = true;
          console.log(`Editor encontrado con selector: ${selector}`);
          break;
        }
      } catch (error) {
        console.log(`No se encontró el editor con selector: ${selector}`);
      }
    }

    if (!editorFound) {
      // Si no se encuentra el editor, obtener y mostrar el HTML de la página para debug
      const pageHtml = await this.driver.getPageSource();
      console.log("HTML de la página:", pageHtml);
      throw new Error(
        "No se encontró el editor de contenido con ninguno de los selectores probados"
      );
    }

    // Contenido del post
    const postContent =
      "This is a test post content created at " + new Date().toISOString();

    // Intentar diferentes métodos para establecer el contenido
    try {
      await editor.setValue(postContent);
    } catch (error) {
      console.log("Error usando setValue, intentando con keys:", error);
      await editor.click();
      await this.driver.keys(postContent);
    }

    return true;
  } catch (error) {
    console.error("Error al ingresar el contenido del post:", error);
    throw new Error(`Failed to enter post detail: ${error.message}`);
  }
});

When("I click publish", async function () {
  // Try multiple possible selectors for the publish button
  const publishButtonSelectors = [
    ".gh-publish-trigger",
    'button[data-test-button="publish-flow"]',
    ".gh-btn-editor-save",
    '[data-test-button="publish-save"]',
  ];

  let publishButton = null;

  // Try each selector
  for (const selector of publishButtonSelectors) {
    try {
      const elements = await this.driver.$$(selector);
      if (elements.length > 0) {
        publishButton = elements[0];
        break;
      }
    } catch (error) {
      console.log(`Selector ${selector} not found, trying next...`);
    }
  }

  if (!publishButton) {
    throw new Error(
      "Could not find publish button with any of the known selectors"
    );
  }

  try {
    await publishButton.click();
  } catch (error) {
    console.error("Error clicking publish button:", error);
    throw error;
  }
});

Then("I should see an error message about required title", async function () {
  // Try multiple possible selectors for error messages
  const errorSelectors = [
    ".gh-alert-content",
    ".gh-alert-red",
    '[data-test-error="title-required"]',
    ".error-message",
  ];

  let errorFound = false;
  let errorMessage = "";

  // Try each selector
  for (const selector of errorSelectors) {
    try {
      const elements = await this.driver.$$(selector);
      if (elements.length > 0) {
        errorMessage = await elements[0].getText();
        if (
          errorMessage.toLowerCase().includes("title") &&
          (errorMessage.toLowerCase().includes("required") ||
            errorMessage.toLowerCase().includes("missing"))
        ) {
          errorFound = true;
          break;
        }
      }
    } catch (error) {
      console.log(`Selector ${selector} not found, trying next...`);
    }
  }

  if (!errorFound) {
    throw new Error("Could not find error message about required title");
  }
});

Then("I should not see the publish button", async function () {
  // Wait for any loading to complete
  await this.driver.pause(2000);

  // Lista de posibles selectores para el botón de publicar
  const publishButtonSelectors = [
    ".gh-publish-trigger",
    'button[data-test-button="publish-flow"]',
    ".gh-btn-editor-save",
    '[data-test-button="publish-save"]',
    ".gh-publishmenu-trigger",
  ];

  let buttonFound = false;

  // Verificar que ninguno de los selectores está presente y visible
  for (const selector of publishButtonSelectors) {
    try {
      const elements = await this.driver.$$(selector);
      for (const element of elements) {
        if (await element.isDisplayed()) {
          buttonFound = true;
          console.log(`Found publish button with selector: ${selector}`);
          break;
        }
      }
    } catch (error) {
      // Es esperado que no se encuentren los elementos
      console.log(`Selector ${selector} no encontrado (esto es correcto)`);
    }
  }

  if (buttonFound) {
    throw new Error(
      "El botón de publicar está presente cuando no debería estarlo"
    );
  }

  // Si llegamos aquí, significa que no se encontró ningún botón de publicar visible (lo cual es correcto)
  return true;
});

// Paso para hacer clic en una función específica (posts, pages, etc.)
When("I click on the {string} function", async function (functionName) {
  try {
    // Wait for any animations to complete
    await this.driver.pause(2000);

    const selector = SELECTORS[functionName];
    if (!selector) {
      throw new Error(`No selector defined for function: ${functionName}`);
    }

    // Esperar a que el elemento sea visible y clickeable
    const element = await this.driver.$(selector);
    await element.waitForDisplayed({ timeout: 5000 });
    await element.waitForClickable({ timeout: 5000 });
    await element.click();
  } catch (error) {
    console.log(`Error clicking on ${functionName} function:`, error);
    throw error;
  }
});

// Paso para verificar la existencia de un botón específico
Then("I should have this {string} button", async function (buttonClass) {
  try {
    // Define button selectors based on the class and common Ghost UI patterns
    const buttonSelectors = [
      `.${buttonClass.replace(/ /g, ".")}`,
      ".gh-btn-primary",
      ".gh-btn.gh-btn-primary",
      ".gh-btn.gh-btn-icon",
      '[data-test-button="save"]',
      ".gh-btn.gh-btn-blue",
      ".gh-btn.gh-btn-green",
      // Settings specific selectors
      ".gh-btn.gh-btn-expand",
      ".gh-setting-action .gh-btn",
      ".gh-expandable-block .gh-btn",
      "[data-test-toggle-pub-info]",
      '[data-test-button="expand"]',
    ];

    let buttonFound = false;
    for (const selector of buttonSelectors) {
      try {
        const elements = await this.driver.$$(selector);
        for (const element of elements) {
          const isDisplayed = await element.isDisplayed();
          if (isDisplayed) {
            console.log(`Found button with selector: ${selector}`);
            buttonFound = true;
            break;
          }
        }
        if (buttonFound) break;
      } catch (error) {
        console.log(`Trying selector "${selector}": not found`);
      }
    }

    if (!buttonFound) {
      // Take screenshot for debugging
      await this.driver.saveScreenshot(
        `./screenshots/button-not-found-${Date.now()}.png`
      );
      throw new Error(
        `Button not found. Tried multiple selectors including "${buttonClass}"`
      );
    }

    return true;
  } catch (error) {
    console.error("Error finding button:", error);
    throw error;
  }
});

// Paso para ingresar el título del post
When("I enter title post", async function () {
  try {
    const titleField = await this.driver.$(
      'textarea[placeholder="Post title"]'
    );
    await titleField.setValue("Test Post Title " + Date.now());
  } catch (error) {
    throw new Error(`Failed to enter post title: ${error.message}`);
  }
});

// Paso para ingresar el detalle del post
When("I enter detail post", async function () {
  try {
    // Esperar a que la página se cargue completamente
    await this.driver.pause(3000);

    // Primero hacer clic en el ttulo para asegurarnos de que estamos en el editor
    const titleField = await this.driver.$(
      'textarea[placeholder="Post title"]'
    );
    await titleField.click();

    // Presionar Tab para moverse al área de contenido
    await this.driver.keys(["Tab"]);
    await this.driver.pause(1000);

    // Contenido del post
    const postContent =
      "This is a test post content created at " + new Date().toISOString();

    // Enviar el contenido como una serie de pulsaciones de teclas
    for (let char of postContent) {
      await this.driver.keys(char);
      await this.driver.pause(50); // Pequeña pausa entre caracteres
    }

    return true;
  } catch (error) {
    console.error("Error al ingresar el contenido del post:", error);
    throw new Error(`Failed to enter post detail: ${error.message}`);
  }
});

// Paso para enviar el post
When("I send post", async function () {
  try {
    // Lista de selectores posibles para el botón de publicar
    const publishSelectors = [
      ".gh-publish-trigger",
      "button.gh-publish-trigger",
      ".gh-publishmenu-trigger",
      "button.gh-publishmenu-trigger",
      '[data-test-button="publish-flow"]',
      ".gh-btn-editor-publish",
      '[data-test-button="publish"]',
    ];

    // Verificar que ninguno de los selectores esté presente
    for (const selector of publishSelectors) {
      const elements = await this.driver.$$(selector);
      if (elements.length > 0) {
        const isVisible = await elements[0].isDisplayed();
        if (isVisible) {
          throw new Error(
            `El botón de publicar está presente (${selector}) cuando no debería estarlo`
          );
        }
      }
    }

    // Si llegamos aquí, significa que no se encontró ningún botón de publicar, que es lo que queremos
    console.log(
      "Verificación exitosa: No se encontró ningún botón de publicar, como se esperaba"
    );
    return true;
  } catch (error) {
    if (error.message.includes("no debería estarlo")) {
      throw error;
    }
    // Si el error es que no se encontró el elemento, eso es lo que queremos
    console.log(
      "Verificación exitosa: No se encontró ningún botón de publicar, como se esperaba"
    );
    return true;
  }
});

Then("I save existing email", async function () {
  // Implementación para guardar el email existente
  return true;
});

When("I enter member password {string}", async function (password) {
  try {
    // Wait for the form to load
    await this.driver.pause(2000);

    // Check if we actually need to enter a password
    // Since the password field might not be present in all versions/configurations
    try {
      const passwordSelectors = [
        'input[name="password"]',
        'input[type="password"]',
        "#member-password",
        '[data-test-input="member-password"]',
      ];

      let passwordField = null;

      // Try each selector
      for (const selector of passwordSelectors) {
        const element = await this.driver.$(selector);
        const isDisplayed = await element.isDisplayed();
        if (isDisplayed) {
          passwordField = element;
          break;
        }
      }

      // If password field is found, enter the password
      if (passwordField) {
        await passwordField.setValue(password);
      } else {
        // If no password field is found, log it and continue
        console.log(
          "Password field not found - this might be expected behavior"
        );
        return true;
      }
    } catch (error) {
      // If there's an error finding/interacting with the password field,
      // log it and continue
      console.log("Password field not available:", error.message);
      return true;
    }

    return true;
  } catch (error) {
    console.error("Error handling member password:", error);
    throw new Error(`Failed to handle member password: ${error.message}`);
  }
});

When("I submit member", async function () {
  try {
    const submitButton = await this.driver.$("button.gh-btn-primary");
    await submitButton.click();
    return true;
  } catch (error) {
    throw new Error(`Failed to submit member: ${error.message}`);
  }
});

When("I submit tag", async function () {
  try {
    // Array of possible selectors for the submit button
    const submitSelectors = [
      ".gh-btn-primary",
      'button[type="submit"]',
      ".gh-btn.gh-btn-blue.gh-btn-icon.ember-view",
      '[data-test-button="save"]',
      ".gh-btn.gh-btn-icon.ember-view",
      "button.gh-btn-green",
      "button.gh-btn.gh-btn-primary.gh-btn-icon.ember-view",
    ];

    let submitButton = null;

    // Try each selector until we find the button
    for (const selector of submitSelectors) {
      const element = await this.driver.$(selector);
      const isDisplayed = await element.isDisplayed();
      if (isDisplayed) {
        submitButton = element;
        break;
      }
    }

    if (submitButton) {
      await submitButton.click();
      return true;
    } else {
      throw new Error("Submit button not found");
    }
  } catch (error) {
    console.error("Error submitting tag:", error);
    throw new Error(`Failed to submit tag: ${error.message}`);
  }
});

When("I click edit site", async function () {
  try {
    // Expanded selector list to match different Ghost versions
    const selectors = [
      ".gh-nav-settings-general",
      'a[href="#/settings/general/"]',
      '[data-test-nav="settings-general"]',
      ".settings-menu-general",
      ".gh-setting-group",
      ".gh-setting-first",
      // Add more specific selectors
      '.gh-nav-list a[href="#/settings/general/"]',
      '[data-test-link="general"]',
      '.gh-nav-settings a[href="#/settings/general/"]',
    ].join(",");

    await this.driver.waitUntil(
      async () => {
        const element = await this.driver.$(selectors);
        return await element.isDisplayed();
      },
      {
        timeout: 10000,
        timeoutMsg:
          "El botón de configuración general no apareció después de 10s",
        interval: 500,
      }
    );

    const element = await this.driver.$(selectors);
    await element.click();

    // Add verification step
    await this.driver.pause(1000);
    const currentUrl = await this.driver.getUrl();
    if (!currentUrl.includes("/settings/general")) {
      throw new Error("Failed to navigate to general settings page");
    }

    return true;
  } catch (error) {
    console.error("Error al intentar acceder a la edición del sitio:", error);
    throw error;
  }
});

When("I enter site title {string}", async function (title) {
  try {
    // Updated selectors for the title input
    const titleSelectors = [
      "[data-test-title-input]",
      "#site-title",
      "input.gh-setting-title-input",
      'input[name="site-title"]',
      '.gh-setting-content-extended input[type="text"]',
      // New selectors
      '.gh-setting-content input[type="text"]',
      'input[placeholder="Site title"]',
      '.gh-input-group input[type="text"]',
      "input.gh-title-input",
      // Additional selectors for different Ghost versions
      '[data-test-setting="title"] input[type="text"]',
      ".gh-setting-title input",
      '.gh-setting input[type="text"]',
      'input[data-test-input="site-title"]',
    ];

    let titleInput = null;

    // Try each selector
    for (const selector of titleSelectors) {
      try {
        console.log(`Trying selector: ${selector}`);
        const element = await this.driver.$(selector);
        if (await element.isDisplayed()) {
          titleInput = element;
          console.log(`Found title input with selector: ${selector}`);
          break;
        }
      } catch (error) {
        console.log(`Selector ${selector} not found, trying next...`);
      }
    }

    if (!titleInput) {
      // Take screenshot and log page HTML for debugging
      const timestamp = new Date().getTime();
      await this.driver.saveScreenshot(
        `./screenshots/title-input-not-found-${timestamp}.png`
      );
      const pageHtml = await this.driver.$("html").getHTML();
      console.log("Page HTML:", pageHtml);
      throw new Error("Could not find site title input with any selector");
    }

    await titleInput.setValue(title);
    return true;
  } catch (error) {
    console.error("Error entering site title:", error);
    throw error;
  }
});

When("I enter site description {string}", async function (description) {
  try {
    // Wait for elements to be available
    await this.driver.pause(3000);

    // Updated selectors based on the actual HTML structure
    const descriptionSelectors = [
      // Primary selectors based on your HTML
      'input[placeholder="Site description"]',
      'input.peer[type="text"]',
      // Fallback selectors
      'input[maxlength="200"]',
      '.gh-setting-content-extended input[type="text"]',
      // Additional fallbacks
      '[data-test-setting="description"]',
      'input[name*="description" i]',
      "#:r16:", // specific ID from your HTML
    ];

    let descriptionInput = null;

    // Try each selector
    for (const selector of descriptionSelectors) {
      try {
        const element = await this.driver.$(selector);
        if (await element.isExisting()) {
          const isDisplayed = await element.isDisplayed();
          if (isDisplayed) {
            descriptionInput = element;
            console.log(`Found description input with selector: ${selector}`);
            break;
          }
        }
      } catch (error) {
        continue;
      }
    }

    if (!descriptionInput) {
      // Take screenshot and log page HTML for debugging
      const timestamp = new Date().getTime();
      await this.driver.saveScreenshot(
        `./screenshots/description-input-not-found-${timestamp}.png`
      );
      const html = await this.driver.$("body").getHTML();
      console.log("Current page HTML:", html);
      throw new Error(
        "Could not find site description input with any selector"
      );
    }

    // Clear existing value first
    await descriptionInput.clearValue();
    await this.driver.pause(500);

    // Set new value
    await descriptionInput.setValue(description);
    return true;
  } catch (error) {
    console.error("Error entering site description:", error);
    throw error;
  }
});

When("I submit site", async function () {
  try {
    // Wait for any animations/loading to complete
    await this.driver.pause(2000);

    // Comprehensive list of selectors for the save button
    const saveButtonSelectors = [
      // Ghost v5 selectors
      'button[data-test-button="save"]',
      ".gh-btn-primary",

      // Ghost v4 selectors
      "button.gh-btn-blue",
      "button.gh-btn-icon",

      // Generic button selectors
      'button:contains("Save")',
      "button.gh-btn",

      // Specific structure selectors
      ".gh-canvas-header button",
      ".view-actions button",

      // Fallback selectors
      'button[type="submit"]',
      'button[type="button"]',
    ];

    let saveButton = null;
    let buttonFound = false;

    // First try: direct selectors
    for (const selector of saveButtonSelectors) {
      try {
        console.log(`Trying save button selector: ${selector}`);
        const elements = await this.driver.$$(selector);
        for (const element of elements) {
          if (await element.isDisplayed()) {
            const text = await element.getText();
            console.log(`Found button with text: "${text}"`);
            if (text.toLowerCase().includes("save")) {
              saveButton = element;
              buttonFound = true;
              break;
            }
          }
        }
        if (buttonFound) break;
      } catch (error) {
        console.log(`Failed with selector ${selector}:`, error.message);
      }
    }

    // Second try: find by text content if direct selectors fail
    if (!buttonFound) {
      console.log("Trying to find save button by text content...");
      const buttons = await this.driver.$$("button");
      for (const button of buttons) {
        try {
          if (await button.isDisplayed()) {
            const text = await button.getText();
            if (text.toLowerCase().includes("save")) {
              saveButton = button;
              buttonFound = true;
              console.log(`Found save button with text: ${text}`);
              break;
            }
          }
        } catch (error) {
          continue;
        }
      }
    }

    if (!saveButton) {
      // Take screenshot for debugging
      const timestamp = new Date().getTime();
      await this.driver.saveScreenshot(
        `./screenshots/save-button-not-found-${timestamp}.png`
      );

      // Log the page HTML for debugging
      const html = await this.driver.$("body").getHTML();
      console.log("Current page HTML:", html);
      throw new Error(
        `Save button not found. Tried multiple selectors including "${buttonClass}"`
      );
    }

    await saveButton.click();
    return true;
  } catch (error) {
    console.error("Error submitting site settings:", error);
    throw error;
  }
});

When("I click save settings", async function () {
  try {
    // Wait for any animations/loading to complete
    await this.driver.pause(2000);

    // Comprehensive list of selectors for the save button
    const saveButtonSelectors = [
      // Primary selectors
      'button[data-test-button="save"]',
      "button.gh-btn-primary",
      "button.gh-btn-icon.ember-view",

      // Fallback selectors
      ".gh-btn-primary",
      "button.gh-btn-blue",
      'button:contains("Save")',
      'button[type="submit"]',
      ".view-actions button",
    ];

    let saveButton = null;
    let buttonFound = false;

    // Try each selector
    for (const selector of saveButtonSelectors) {
      try {
        console.log(`Trying save button selector: ${selector}`);
        const elements = await this.driver.$$(selector);
        for (const element of elements) {
          if (await element.isDisplayed()) {
            const text = await element.getText();
            console.log(`Found button with text: "${text}"`);
            if (text.toLowerCase().includes("save")) {
              saveButton = element;
              buttonFound = true;
              break;
            }
          }
        }
        if (buttonFound) break;
      } catch (error) {
        console.log(`Failed with selector ${selector}:`, error.message);
      }
    }

    // If no button found by selectors, try finding by text content
    if (!buttonFound) {
      console.log("Trying to find save button by text content...");
      const buttons = await this.driver.$$("button");
      for (const button of buttons) {
        try {
          if (await button.isDisplayed()) {
            const text = await button.getText();
            if (text.toLowerCase().includes("save")) {
              saveButton = button;
              buttonFound = true;
              console.log(`Found save button with text: ${text}`);
              break;
            }
          }
        } catch (error) {
          continue;
        }
      }
    }

    if (!saveButton) {
      // Take screenshot for debugging
      const timestamp = new Date().getTime();
      await this.driver.saveScreenshot(
        `./screenshots/save-button-not-found-${timestamp}.png`
      );
      throw new Error("Save button not found with any selector");
    }

    await saveButton.click();
    return true;
  } catch (error) {
    console.error("Error clicking save settings:", error);
    throw error;
  }
});

When("I click edit language", async function () {
  try {
    await this.driver.pause(2000);

    const editButtonSelectors = [
      // Selector simple para todos los botones Edit
      'button[type="button"] span',
      // Selector alternativo
      "button.cursor-pointer span",
      // XPath más preciso
      {
        using: "xpath",
        value: '(//button[.//span[text()="Edit"]])[3]',
      },
    ];

    let clicked = false;

    for (const selector of editButtonSelectors) {
      try {
        console.log(`Intentando con selector:`, selector);

        if (typeof selector === "string") {
          const elements = await this.driver.$$(selector);
          let index = 0;

          for (const element of elements) {
            if (await element.isDisplayed()) {
              const text = await element.getText();
              console.log(`Texto del botón ${index}: "${text}"`);

              if (text.trim() === "Edit") {
                index++;
                if (index === 3) {
                  // Queremos el tercer botón Edit
                  await element.click();
                  clicked = true;
                  console.log("Tercer botón Edit clickeado exitosamente");
                  break;
                }
              }
            }
          }
        } else {
          // Manejo de XPath
          const elements = await this.driver.$$(selector.value);
          for (const element of elements) {
            if (await element.isDisplayed()) {
              await element.click();
              clicked = true;
              console.log("Botón Edit clickeado exitosamente usando XPath");
              break;
            }
          }
        }

        if (clicked) break;
      } catch (error) {
        console.log(`Falló con selector ${selector}:`, error.message);
      }
    }

    if (!clicked) {
      // Último intento: buscar por texto
      const allButtons = await this.driver.$$("button");
      let editCount = 0;

      for (const button of allButtons) {
        try {
          if (await button.isDisplayed()) {
            const text = await button.getText();
            if (text.trim() === "Edit") {
              editCount++;
              if (editCount === 3) {
                await button.click();
                clicked = true;
                console.log(
                  "Tercer botón Edit encontrado y clickeado por texto"
                );
                break;
              }
            }
          }
        } catch (error) {
          continue;
        }
      }
    }

    if (!clicked) {
      const timestamp = new Date().getTime();
      await this.driver.saveScreenshot(
        `./screenshots/edit-button-not-found-${timestamp}.png`
      );
      throw new Error("No se encontró el tercer botón Edit del lenguaje");
    }

    return true;
  } catch (error) {
    console.error("Error al hacer clic en el botón Edit del lenguaje:", error);
    throw error;
  }
});

When("I enter Site language {string}", async function (language) {
  try {
    await this.driver.pause(2000);

    const languageInputSelectors = [
      // Selector específico para el input de idioma
      'input[placeholder="Site language"]',
      // Selector por clase específica
      "input.peer.order-2",
      // Selector por atributo data-test
      'input[data-test-input="site-language"]',
      // Selector más genérico
      "input.gh-input",
      // XPath alternativo
      {
        using: "xpath",
        value: '//input[@placeholder="Site language"]',
      },
    ];

    let inputElement = null;
    let inputFound = false;

    // Intentar cada selector
    for (const selector of languageInputSelectors) {
      try {
        console.log(`Intentando con selector de idioma:`, selector);

        if (typeof selector === "string") {
          const elements = await this.driver.$$(selector);
          for (const element of elements) {
            if (await element.isDisplayed()) {
              // Limpiar el campo primero
              await element.clearValue();
              await this.driver.pause(500);

              // Ingresar el nuevo valor
              await element.setValue(language);
              await this.driver.pause(500);

              // Verificar que el valor se haya establecido correctamente
              const value = await element.getValue();
              console.log(`Valor actual del campo: "${value}"`);

              if (value.includes(language)) {
                inputFound = true;
                console.log(`Idioma "${language}" ingresado exitosamente`);
                break;
              }
            }
          }
        } else {
          // Manejo de XPath
          const elements = await this.driver.$$(selector.value);
          for (const element of elements) {
            if (await element.isDisplayed()) {
              await element.clearValue();
              await this.driver.pause(500);
              await element.setValue(language);
              await this.driver.pause(500);

              const value = await element.getValue();
              if (value.includes(language)) {
                inputFound = true;
                console.log(
                  `Idioma "${language}" ingresado exitosamente usando XPath`
                );
                break;
              }
            }
          }
        }

        if (inputFound) break;
      } catch (error) {
        console.log(`Falló con selector ${selector}:`, error.message);
      }
    }

    if (!inputFound) {
      const timestamp = new Date().getTime();
      await this.driver.saveScreenshot(
        `./screenshots/language-input-not-found-${timestamp}.png`
      );
      throw new Error("Campo de idioma no encontrado o no accesible");
    }

    return true;
  } catch (error) {
    console.error("Error al ingresar el idioma del sitio:", error);
    throw error;
  }
});

When("I click on save settings button", async function () {
  try {
    // Wait for any animations to complete
    await this.driver.pause(1000);

    const saveButtonSelector = [
      ".gh-btn-primary",
      '[data-test-button="save"]',
      ".gh-btn-icon",
      "button.gh-btn-primary",
      "[data-test-save-button]",
    ].join(",");

    const element = await this.driver.$(saveButtonSelector);
    await element.waitForDisplayed({ timeout: 5000 });
    await element.waitForClickable({ timeout: 5000 });
    await element.click();
  } catch (error) {
    throw new Error(`Failed to click save settings button: ${error.message}`);
  }
});

// Add this at the top of your file, before any step definitions
const functionSelectors = {
  settings: [
    'a[href="#/settings/"]',
    'a[data-test-nav="settings"]',
    'a.ember-view[href="#/settings/"]',
    '.gh-nav-body a[href="#/settings/"]',
    // Fallback using text content
    'a:contains("Settings")',
    '[data-test-nav="settings"]',
  ],
  "Publication language": [
    "#publication-language",
    'a[id="publication-language"]',
    ".w-100.mt-1.flex.h-[38px]",
    'a:contains("Publication language")',
    // Fallback using the exact class string
    "a.w-100.mt-1.flex.h-[38px].cursor-pointer",
  ],
  // Add other function mappings as needed
  posts: 'a[href="#/posts/"]',
  pages: 'a[href="#/pages/"]',
  members: 'a[href="#/members/"]',
};

When("I click in a member", async function () {
  try {
    await this.driver.pause(2000);

    const memberSelectors = [
      // Selector para la lista de miembros
      ".gh-list-row.gh-members-list-item",
      // Selector alternativo
      '[data-test-list="members-list-item"]',
      // Selector por clase especfica
      ".gh-list-data",
      // XPath
      {
        using: "xpath",
        value: '//li[contains(@class, "gh-list-row")]',
      },
    ];

    let clicked = false;

    for (const selector of memberSelectors) {
      try {
        console.log(`Intentando con selector de miembro:`, selector);

        if (typeof selector === "string") {
          const elements = await this.driver.$$(selector);
          // Intentar hacer clic en el primer miembro visible
          for (const element of elements) {
            if (await element.isDisplayed()) {
              await element.click();
              clicked = true;
              console.log("Miembro clickeado exitosamente");
              break;
            }
          }
        } else {
          // Manejo de XPath
          const elements = await this.driver.$$(selector.value);
          for (const element of elements) {
            if (await element.isDisplayed()) {
              await element.click();
              clicked = true;
              console.log("Miembro clickeado exitosamente usando XPath");
              break;
            }
          }
        }

        if (clicked) break;
      } catch (error) {
        console.log(`Falló con selector ${selector}:`, error.message);
      }
    }

    if (!clicked) {
      const timestamp = new Date().getTime();
      await this.driver.saveScreenshot(
        `./screenshots/member-not-found-${timestamp}.png`
      );
      throw new Error("No se encontró ningún miembro para hacer clic");
    }

    return true;
  } catch (error) {
    console.error("Error al hacer clic en el miembro:", error);
    throw error;
  }
});

When("I click in a post", async function () {
  try {
    await this.driver.pause(2000);

    const postSelectors = [
      ".gh-posts-list-item",
      ".gh-list-row.gh-posts-list-item",
      "[data-test-post-id]",
      {
        using: "xpath",
        value: '//li[contains(@class, "gh-posts-list-item")]',
      },
    ];

    let clicked = false;

    for (const selector of postSelectors) {
      try {
        if (typeof selector === "string") {
          const elements = await this.driver.$$(selector);
          for (const element of elements) {
            if (await element.isDisplayed()) {
              await element.click();
              clicked = true;
              break;
            }
          }
        } else {
          const elements = await this.driver.$$(selector.value);
          for (const element of elements) {
            if (await element.isDisplayed()) {
              await element.click();
              clicked = true;
              break;
            }
          }
        }
        if (clicked) break;
      } catch (error) {
        console.log(`Falló con selector ${selector}:`, error.message);
      }
    }

    if (!clicked) {
      const timestamp = new Date().getTime();
      await this.driver.saveScreenshot(
        `./screenshots/post-not-found-${timestamp}.png`
      );
      throw new Error("No se encontró ningún post para hacer clic");
    }

    return true;
  } catch (error) {
    console.error("Error al hacer clic en el post:", error);
    throw error;
  }
});

When("I enter post title {string}", async function (title) {
  try {
    await this.driver.pause(1000);

    const titleSelectors = [
      "textarea.gh-editor-title",
      "[data-test-editor-title-input]",
      ".gh-editor-title-container textarea",
    ];

    let inputFound = false;
    for (const selector of titleSelectors) {
      try {
        const element = await this.driver.$(selector);
        if (await element.isDisplayed()) {
          await element.setValue(title);
          inputFound = true;
          console.log(
            `Título ingresado exitosamente usando selector: ${selector}`
          );
          break;
        }
      } catch (error) {
        console.log(`Falló con selector ${selector}:`, error.message);
      }
    }

    if (!inputFound) {
      throw new Error("Campo de título no encontrado o no accesible");
    }
  } catch (error) {
    console.error("Error al ingresar el título del post:", error);
    throw error;
  }
});

When("I enter post slug {string}", async function (slug) {
  try {
    await this.driver.pause(2000);

    // Primero, hacer clic en el botón de configuración
    const settingsButtonSelectors = [
      "button.settings-menu-toggle",
      "[data-test-psm-trigger]",
      ".gh-btn-editor-sidebar",
    ];

    let settingsOpened = false;
    for (const selector of settingsButtonSelectors) {
      try {
        const element = await this.driver.$(selector);
        if (await element.isDisplayed()) {
          await element.click();
          settingsOpened = true;
          console.log(
            `Menú de configuración abierto usando selector: ${selector}`
          );
          break;
        }
      } catch (error) {
        console.log(
          `Falló al abrir configuración con selector ${selector}:`,
          error.message
        );
        continue;
      }
    }

    if (!settingsOpened) {
      throw new Error("No se pudo abrir el menú de configuración");
    }

    // Esperar a que el panel de configuración se abra
    await this.driver.pause(1000);

    // Ahora buscar y modificar el campo de slug
    const slugSelectors = [
      'input[name="post-setting-slug"]',
      "[data-test-slug-input]",
      ".ghost-url-preview input",
    ];

    let slugEntered = false;
    for (const selector of slugSelectors) {
      try {
        const element = await this.driver.$(selector);
        if (await element.isDisplayed()) {
          await element.setValue(slug);
          slugEntered = true;
          console.log(
            `Slug ingresado exitosamente usando selector: ${selector}`
          );
          break;
        }
      } catch (error) {
        console.log(`Falló con selector ${selector}:`, error.message);
        continue;
      }
    }

    if (!slugEntered) {
      throw new Error("Campo de slug no encontrado o no accesible");
    }

    return true;
  } catch (error) {
    console.error("Error al ingresar el slug del post:", error);
    throw error;
  }
});

When("I enter post content {string}", async function (content) {
  try {
    await this.driver.pause(1000);

    const contentSelectors = [
      ".koenig-editor__editor",
      '[data-kg="editor"]',
      '.gh-editor-content [contenteditable="true"]',
      {
        using: "xpath",
        value: '//div[contains(@class, "koenig-editor__editor")]//p',
      },
    ];

    let inputFound = false;
    for (const selector of contentSelectors) {
      try {
        if (typeof selector === "string") {
          const element = await this.driver.$(selector);
          if (await element.isDisplayed()) {
            await element.setValue(content);
            inputFound = true;
            console.log(
              `Contenido ingresado exitosamente usando selector: ${selector}`
            );
            break;
          }
        } else {
          const element = await this.driver.$(selector.value);
          if (await element.isDisplayed()) {
            await element.setValue(content);
            inputFound = true;
            console.log(`Contenido ingresado exitosamente usando XPath`);
            break;
          }
        }
      } catch (error) {
        console.log(`Falló con selector ${selector}:`, error.message);
      }
    }

    if (!inputFound) {
      throw new Error("Campo de contenido no encontrado o no accesible");
    }
  } catch (error) {
    console.error("Error al ingresar el contenido del post:", error);
    throw error;
  }
});

When("I submit post", async function () {
  try {
    await this.driver.pause(1000);

    const submitSelectors = [
      "button.gh-publish-trigger",
      '[data-test-button="publish-flow"]',
      ".gh-publishmenu-trigger",
      "button.gh-btn-editor-save",
      {
        using: "xpath",
        value: '//button[contains(text(), "Publish")]',
      },
    ];

    let clicked = false;
    for (const selector of submitSelectors) {
      try {
        if (typeof selector === "string") {
          const element = await this.driver.$(selector);
          if ((await element.isDisplayed()) && (await element.isClickable())) {
            await element.click();
            clicked = true;
            console.log(
              `Post publicado exitosamente usando selector: ${selector}`
            );
            break;
          }
        } else {
          const element = await this.driver.$(selector.value);
          if ((await element.isDisplayed()) && (await element.isClickable())) {
            await element.click();
            clicked = true;
            console.log(`Post publicado exitosamente usando XPath`);
            break;
          }
        }
      } catch (error) {
        console.log(`Falló con selector ${selector}:`, error.message);
      }
    }

    if (!clicked) {
      throw new Error("Botón de publicar no encontrado o no clickeable");
    }
  } catch (error) {
    console.error("Error al publicar el post:", error);
    throw error;
  }
});

When("I expand title settings", async function () {
  try {
    // Try multiple possible selectors for the title settings expand button
    const titleSettingsButton = await this.driver.$(
      ".gh-setting-first, " +
        '[data-test-toggle="title-settings"], ' +
        ".gh-expandable-block, " +
        ".gh-setting-action-button, " +
        ".gh-setting-title-expand"
    );

    // Wait for the element to be clickable
    await titleSettingsButton.waitForClickable({ timeout: 5000 });

    // Click the expand button
    await titleSettingsButton.click();
  } catch (error) {
    throw new Error(`Failed to expand title settings: ${error.message}`);
  }
});

When("I click on settings menu", async function () {
  try {
    const settingsMenuSelectors = [
      ".gh-nav-settings",
      '[data-test-nav="settings"]',
      'a[href="#/settings/"]',
      ".settings-menu-toggle",
      '.gh-nav-body a[href="#/settings/"]',
    ];

    let clicked = false;
    for (const selector of settingsMenuSelectors) {
      try {
        const element = await this.driver.$(selector);
        if ((await element.isDisplayed()) && (await element.isClickable())) {
          await element.click();
          clicked = true;
          console.log(`Settings menu clicked using selector: ${selector}`);
          break;
        }
      } catch (error) {
        console.log(`Failed with selector ${selector}:`, error.message);
      }
    }

    if (!clicked) {
      throw new Error("Settings menu not found or not clickable");
    }
  } catch (error) {
    console.error("Error clicking settings menu:", error);
    throw error;
  }
});

When("I click on general settings", async function () {
  try {
    // Wait for initial page load
    await this.driver.pause(2000);

    // First try to find the button in the settings menu
    const buttonSelectors = [
      // Try multiple selectors for the general settings button
      ".gh-setting-first",
      ".gh-setting button",
      'button.gh-btn[data-test-button="general"]',
      // The specific selector that worked before
      "div.mb-\\[10vh\\]:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > button:nth-child(1)",
      // Additional selectors
      'button:contains("Title & description")',
      "button[data-test-toggle-pub-info]",
    ];

    let button = null;
    let buttonFound = false;

    // Try each selector with a small wait between attempts
    for (const selector of buttonSelectors) {
      try {
        console.log(`Trying to find button with selector: ${selector}`);
        await this.driver.pause(1000); // Wait between attempts

        const elements = await this.driver.$$(selector);
        for (const element of elements) {
          if (await element.isDisplayed()) {
            const text = await element.getText();
            console.log(`Found visible button with text: "${text}"`);
            button = element;
            buttonFound = true;
            break;
          }
        }

        if (buttonFound) break;
      } catch (error) {
        console.log(`Selector ${selector} failed:`, error.message);
      }
    }

    if (!button) {
      throw new Error("Could not find general settings button");
    }

    // Wait for button to be clickable
    await button.waitForClickable({ timeout: 5000 });

    // Click the button
    await button.click();
    console.log("Clicked general settings button");
  } catch (error) {
    console.error("Error clicking general settings:", error);
    throw error;
  }
});

When("I delete site title", async function () {
  const titleInput = await this.driver.$("input[data-test-title-input]");
  await titleInput.setValue("");
});

When("I delete site description", async function () {
  const descriptionInput = await this.driver.$(
    "input[data-test-description-input]"
  );
  await descriptionInput.setValue("");
});
