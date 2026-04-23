describe("Profile Page", () => {
  beforeEach(() => {
    cy.visit("http://localhost:8081/login");
    cy.wait(2000);
    cy.get('input[type="email"]').type("test3@test.com", { force: true });
    cy.get('input[type="password"]').type("Password", { force: true });
    cy.contains("Log In").click({ force: true });
    cy.url().should("include", "/home");
    cy.wait(2000);
    cy.visit("http://localhost:8081/profile");
    cy.wait(2000);
  });

  it("should load the profile page with user info", () => {
    cy.contains("Test").should("exist");
    cy.contains("test3@test.com").should("exist");
    cy.contains("Edit Profile").should("exist");
    cy.contains("Notifications").should("exist");
    cy.contains("Appearance").should("exist");
    cy.contains("Log Out").should("exist");
  });

  it("should toggle the appearance between dark and light mode", () => {
    cy.contains("Appearance").should("exist");
    cy.get('input[type="checkbox"]').eq(1).click({ force: true });
    cy.wait(2000);
    cy.get('input[type="checkbox"]').eq(1).click({ force: true });
    cy.wait(2000);
  });

  it("should navigate to edit profile and save changes", () => {
    cy.contains("Edit Profile").click({ force: true });
    cy.wait(2000);
    cy.url().should("include", "/edit-profile");

    cy.get('input[placeholder="Height"]')
      .clear({ force: true })
      .type("165", { force: true });

    cy.get('input[placeholder="Weight"]')
      .clear({ force: true })
      .type("60", { force: true });

    cy.contains("Save Changes").click({ force: true });
    cy.wait(3000);
    cy.url().should("include", "/profile");
    cy.contains("Profile updated successfully").should("exist");
  });

  it("should open the avatar picker and select an avatar", () => {
    cy.contains("Edit Profile").click({ force: true });
    cy.wait(2000);
    cy.url().should("include", "/edit-profile");

    cy.contains("Choose Avatar").click({ force: true });
    cy.wait(2000);
    cy.contains("Pick your avatar").should("be.visible");

    cy.get("img").eq(1).click({ force: true });
    cy.wait(1000);
    cy.contains("Pick your avatar").should("not.exist");
  });

  it("should log out successfully", () => {
    cy.contains("Log Out").click({ force: true });
    cy.wait(2000);
    cy.url().should("include", "/login");
  });
});
