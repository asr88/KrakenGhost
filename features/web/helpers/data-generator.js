const { faker } = require("@faker-js/faker");

class DataGenerator {
  static generatePost() {
    return {
      title: faker.lorem.sentence(),
      content: faker.lorem.paragraphs(3),
      excerpt: faker.lorem.paragraph(),
      tags: faker.lorem.words(3).split(" "),
    };
  }

  static generateMember() {
    return {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      note: faker.lorem.sentence(),
    };
  }

  static generateTag() {
    return {
      name: faker.lorem.word(),
      slug: faker.helpers.slugify(faker.lorem.word()),
      description: faker.lorem.sentence(),
    };
  }

  static generateSettings() {
    return {
      siteTitle: faker.company.name(),
      siteDescription: faker.company.catchPhrase(),
    };
  }

  static generateValidUser() {
    return {
      email: "asr@hotmail.com",
      password: "contraseña123",
    };
  }

  static generateInvalidUser() {
    return {
      email: faker.internet.email(),
      password: faker.internet.password(),
    };
  }

  static generateInvalidCredentials() {
    return {
      invalidEmail: {
        email: "invalid.email@",
        password: "Pruebas12345!",
      },
      emptyEmail: {
        email: "",
        password: "Pruebas12345!",
      },
      emptyPassword: {
        email: "asr@hotmail.com",
        password: "",
      },
      invalidPassword: {
        email: "asr@hotmail.com",
        password: "wrong123!",
      },
    };
  }

  static generateRandomTitle() {
    return faker.lorem.sentence(3);
  }

  static generateRandomTitleOverMax() {
    return faker.lorem.sentence(300);
  }

  static generateRandomContent() {
    const paragraphs = faker.lorem.paragraphs(
      faker.number.int({ min: 2, max: 4 }),
      "\n\n"
    );

    return [
      faker.lorem.sentence(),
      "",
      paragraphs,
      "",
      `Written by ${faker.person.fullName()}`,
      `Last updated: ${faker.date.recent().toLocaleDateString()}`,
    ].join("\n");
  }
}

module.exports = DataGenerator;
