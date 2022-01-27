import * as Cosmwasm from "../../hooks/cosmwasm"


describe('Home page', () => {
  it('it should have connet wallet button on home page', () => {
    cy.visit('http://localhost:3000/')

    cy.get('button').contains('Connect Wallet')
  })

  it('it should display a list of actions', () => {
    cy.visit('http://localhost:3000/')

    cy.get('h3').contains('Register')
    cy.get('h3').contains('Manage')
    cy.get('h3').contains('Explore')
  })
})

describe('wallet connect', () => {
  beforeEach(() => {
    const spyBase = {
      useSigningCosmWasmClient: Cosmwasm.useSigningCosmWasmClient
    }

    cy.stub(spyBase, 'useSigningCosmWasmClient').as('stubClient').returns(null)
  })

  it('it should show address if wallet connected', () => {

    cy.visit('http://localhost:3000/').then(() => {
      cy.get('@stubClient').should('have.been.called')
    })

  })
})
