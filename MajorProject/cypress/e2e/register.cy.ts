describe("Registration", () => {
  beforeEach(() => {
    cy.visit("http://localhost:8081/register");
    cy.wait(2000);
  });

  it("should show error if fields are empty", () => {
    cy.contains("Create Account").click({ force: true });
    cy.url().should("include", "/register");
  });

  it("should register successfully", () => {
    cy.get('input[type="text"]').type("Test User", { force: true });
    cy.get('input[type="email"]').type("test3@test.com", { force: true });
    cy.get('input[type="password"]').type("Password", { force: true });
    cy.contains("Create Account").click({ force: true });
    cy.url().should("include", "/home");
  });
});
