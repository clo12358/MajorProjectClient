describe("Authentication", () => {
  beforeEach(() => {
    cy.visit("http://localhost:8081/login");
    cy.wait(2000);
  });

  it("should show error with wrong credentials", () => {
    cy.get('input[type="email"]').type("wrong@email.com", { force: true });
    cy.get('input[type="password"]').type("wrongpassword", { force: true });
    cy.contains("Log In").click({ force: true });
    cy.contains("incorrect").should("be.visible");
  });

  it("should log in successfully", () => {
    cy.get('input[type="email"]').type("test3@test.com", { force: true });
    cy.get('input[type="password"]').type("Password", { force: true });
    cy.contains("Log In").click({ force: true });
    cy.url().should("include", "/home");
  });

  it("should log out successfully", () => {
    cy.get('input[type="email"]').type("test3@test.com", { force: true });
    cy.get('input[type="password"]').type("Password", { force: true });
    cy.contains("Log In").click({ force: true });
    cy.url().should("include", "/home");
    cy.visit("http://localhost:8081/profile");
    cy.contains("Log Out").click({ force: true });
    cy.url().should("include", "/login");
  });
});
