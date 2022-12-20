describe('empty spec', () => {
  context('Anonymous', () => {
    it('visits the explore page', () => {
      cy.visit('/explore')
    })
  })

  context('Authenticated', () => {
    beforeEach(() => {
      cy.login()
      cy.visit('/')
    })

    it('visits the about page', () => {
      cy.get('.user-banner-container .items-start svg').click()
      cy.contains('button', 'About').click()

      cy.contains('.dialog-header-container', 'About memos').should('be.visible')
    })
  })
})