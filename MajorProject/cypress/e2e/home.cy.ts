describe("Home Page", () => {
  beforeEach(() => {
    cy.visit("http://localhost:8081/login");
    cy.wait(2000);
    cy.get('input[type="email"]').type("test3@test.com", { force: true });
    cy.get('input[type="password"]').type("Password", { force: true });
    cy.contains("Log In").click({ force: true });
    cy.url().should("include", "/home");
    cy.wait(2000);
  });

  it("should load the home page after login", () => {
    cy.contains("Day").should("exist");
    cy.contains("Period Tracking").should("exist");
    cy.contains("Journal").should("exist");
  });

  it("should select a different date and navigate back to today", () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const dayNumber = yesterday.getDate().toString();

    cy.contains("Today →").should("not.exist");
    cy.contains(dayNumber).first().click({ force: true });
    cy.wait(1000);
    cy.contains("Today →").should("be.visible");
    cy.contains("Today →").click({ force: true });
    cy.wait(1000);
    cy.contains("Today →").should("not.exist");
  });

  it("should select a flow level and log a period", () => {
    cy.contains("Medium").click({ force: true });
    cy.wait(500);
    cy.contains("Log Period").click({ force: true });
    cy.wait(3000);
    cy.contains("Period active since").should("exist");
  });

  it("should open the symptoms modal and log 3 symptoms", () => {
    cy.contains("Log more...").click({ force: true });
    cy.wait(2000);
    cy.contains("Log more symptoms").should("be.visible");
    cy.contains("Anxious").click({ force: true });
    cy.contains("Bloating").click({ force: true });
    cy.contains("Fatigue").click({ force: true });
    cy.wait(500);
    cy.contains("Save").click({ force: true });
    cy.wait(2000);
    cy.contains("Log more symptoms").should("not.exist");
  });

  it("should open the journal, select a mood and write an entry", () => {
    cy.contains("Open Journal").click({ force: true });
    cy.wait(2000);
    cy.url().should("include", "/journal");
    cy.contains("Great").click({ force: true });
    cy.wait(500);
    cy.get(
      'textarea, [placeholder="Write about how you\'re feeling today..."]',
    ).type("This is a test journal entry written by Cypress.", { force: true });
    cy.wait(500);
    cy.contains("Save Entry").click({ force: true });
    cy.wait(2000);
    cy.url().should("include", "/home");
    cy.contains("Journal saved").should("be.visible");
  });
});
