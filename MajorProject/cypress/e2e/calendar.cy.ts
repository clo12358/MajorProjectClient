describe("Calendar Page", () => {
  beforeEach(() => {
    cy.visit("http://localhost:8081/login");
    cy.wait(2000);
    cy.get('input[type="email"]').type("test3@test.com", { force: true });
    cy.get('input[type="password"]').type("Password", { force: true });
    cy.contains("Log In").click({ force: true });
    cy.url().should("include", "/home");
    cy.wait(2000);
    cy.visit("http://localhost:8081/calendar");
    cy.wait(2000);
  });

  it("should load the calendar page", () => {
    cy.contains("Today").should("exist");
    cy.contains("Period Day").should("exist");
    cy.contains("Cycle Day").should("exist");
  });

  it("should show date info when a date is clicked", () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const dayNumber = yesterday.getDate().toString();
    const monthName = yesterday.toLocaleDateString("en-GB", { month: "long" });

    cy.contains(dayNumber).first().click({ force: true });
    cy.wait(1000);
    cy.contains(monthName).should("exist");
  });

  it("should show period data for a logged period date", () => {
    const today = new Date();
    const dayNumber = today.getDate().toString();

    cy.contains(dayNumber).first().click({ force: true });
    cy.wait(1000);
    cy.contains("flow").should("exist");
  });

  it("should show nothing logged message for a date with no data", () => {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 3);
    const dayNumber = futureDate.getDate().toString();

    cy.contains(dayNumber).first().click({ force: true });
    cy.wait(1000);
    cy.contains("Nothing logged for this date yet.").should("exist");
  });
});
