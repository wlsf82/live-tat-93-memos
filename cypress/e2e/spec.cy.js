describe('Memos', () => {
  context('Anonymous', () => {
    it('visits the explore page', () => {
      cy.visit('/explore')
      cy.contains('a', 'Sign in').should('exist')
      cy.get('.memos-wrapper .memo-container')
        .its('length')
        .should('be.above', 0)
    })

    context('Auth page', () => {
      beforeEach(() => cy.visit('/auth'))

      it('switches from English to Spanish', () => {
        const sloganEn = 'An open-source, self-hosted memo hub with knowledge management and socialization.'
        const sloganEs = 'Un código abierto, centro de notas autoalojado con la gestión del conocimiento y la socialización.'

        cy.get('.slogan-text')
          .as('slogan')
          .should('have.text', sloganEn)
        cy.get('.JoySelect-button')
          .first()
          .click()
        cy.contains('ul li', 'Español').click()
        cy.get('@slogan')
          .should('have.text', sloganEs)
      })

      it('switches from light to dark mode', () => {
        cy.visit('/auth')
        cy.get('body').should('have.css', 'background-color', 'rgba(0, 0, 0, 0)')
        cy.get('.JoySelect-button')
          .last()
          .click()
        cy.contains('ul li', 'Always dark').click()
        cy.get('body').should('have.css', 'background-color', 'rgb(39, 39, 42)')
      })
    })
  })

  context('Authenticated', () => {
    beforeEach(() => cy.login())

    it('opens the resources dialog', () => {
      cy.intercept('api/resource', { fixture: 'resources' }).as('getResources')
      cy.get('.user-banner-container svg').click()
      cy.contains('button', 'Resources').click()
      cy.wait('@getResources')

      cy.contains('.dialog-header-container', 'Resources').should('be.visible')
      cy.get('.dialog-container .resource-container').its('length').should('eq', 1)
    })

    it('opens the archived dialog', () => {
      cy.intercept('/api/memo?rowStatus=ARCHIVED', { fixture: 'archives' }).as('getArchives')
      cy.get('.user-banner-container svg').click()
      cy.contains('button', 'Archived').click()
      cy.wait('@getArchives')

      cy.contains('.dialog-header-container', 'Archived Memos').should('be.visible')
      cy.get('.dialog-container .archived').its('length').should('eq', 2)
    })

    it('opens the about dialog', () => {
      cy.get('.user-banner-container svg').click()
      cy.contains('button', 'About').click()

      cy.contains('.dialog-header-container', 'About memos').should('be.visible')
    })

    it('opens the daily review dialog', () => {
      cy.contains('button', 'Daily Review').click()
      cy.contains('.daily-review-dialog .title-text', 'Daily Review').should('be.visible')
      cy.get('.date-card-container .date-text').then($dateText1 => {
        const currentDate = $dateText1[0].innerText
        const currentDateAsNumber = parseInt(currentDate)
        cy.get('.daily-review-dialog .btn-text').eq(1).click()
        cy.get('.date-card-container .date-text').then($dateText2 => {
          const nextDate = $dateText2[0].innerText
          const nextDateAsNumber = parseInt(nextDate)
          expect(nextDateAsNumber).to.eq(currentDateAsNumber + 1)
        })
      })
    })
  })
})
