Cypress.Commands.add('login', () => {
  const username = Cypress.env('username')
  const login = () => {
    cy.visit('/auth')
    cy.get('input[type="text"]')
      .clear()
      .type(username)
    cy.get('input[type="password"]')
      .clear()
      .type(Cypress.env('password'), { log: false })
    cy.contains('button', 'Sign in').click()
    cy.get('.home', { timeout: 10000 }).should('exist')
  }

  cy.session(username, login)
  cy.visit('/')
})
