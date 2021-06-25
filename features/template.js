'use strict'

const axios = require('axios')

const { AfterAll, Given, Then, When } = require('@cucumber/cucumber')
const { expect } = require('chai')

const OPENHIM_PROTOCOL = process.env.OPENHIM_PROTOCOL || 'http'
const OPENHIM_API_HOSTNAME = process.env.OPENHIM_API_HOSTNAME || 'localhost'
const OPENHIM_TRANSACTION_API_PORT =
  process.env.OPENHIM_TRANSACTION_API_PORT || '5001'
const OPENHIM_MEDIATOR_API_PORT =
  process.env.OPENHIM_MEDIATOR_API_PORT || '8080'
const BASIC_AUTH_HEADER =
  process.env.BASIC_AUTH_HEADER || 'Basic cm9vdEBvcGVuaGltLm9yZzppbnN0YW50MTAx'

Given('the OpenHIM is running', async function () {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0
  const checkOpenhimRunningOptions = {
    url: `https://${OPENHIM_API_HOSTNAME}:${OPENHIM_MEDIATOR_API_PORT}/heartbeat`,
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: BASIC_AUTH_HEADER
    }
  }

  const checkPatientExistsResponse = await axios(checkOpenhimRunningOptions)

  expect(checkPatientExistsResponse.status).to.eql(200)
})

Given('an authorised client, Alice, exists in the OpenHIM', async function () {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0
  const checkClientExistsOptions = {
    url: `https://${OPENHIM_API_HOSTNAME}:${OPENHIM_MEDIATOR_API_PORT}/clients`,
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: BASIC_AUTH_HEADER
    }
  }

  const checkClientExistsResponse = await axios(checkClientExistsOptions)

  let createClient = true

  for (const client of checkClientExistsResponse.data) {
    if (client.clientID === 'test-harness-client') {
      expect(client.name).to.eql('Alice')
      createClient = false
      break
    }
  }

  if (createClient) {
    console.log(`The test Harness Client does not exist. Creating Client...`)
    const options = {
      url: `https://${OPENHIM_API_HOSTNAME}:${OPENHIM_MEDIATOR_API_PORT}/clients`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: BASIC_AUTH_HEADER
      },
      data: {
        roles: ['instant'],
        clientID: 'test-harness-client',
        name: 'Alice',
        customTokenID: 'test-harness-token'
      }
    }

    const response = await axios(options)
    expect(response.status).to.eql(201)
  } else {
    console.log(`The Test Harness Client (Alice) already exists...`)
  }
})

When('Alice makes a request to the OpenHIM on the template channel', async function () {
  const templateRequestOptions = {
    url: `${OPENHIM_PROTOCOL}://${OPENHIM_API_HOSTNAME}:${OPENHIM_TRANSACTION_API_PORT}/template`,
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Custom test-harness-token`
    }
  }
  const templateRequestResponse = await axios(templateRequestOptions)
  expect(templateRequestResponse.status).to.eql(200)
  console.log(`Successful OpenHIM Template Channel Request`)
  this.setTo(templateRequestResponse.data)
})

Then('Alice is able to get the canned response', function () {
  expect(this.searchResults).equal('New config data from file COPIED into volume\n')
  console.log(`Correct response from server:\n${this.searchResults}`)
})

AfterAll(async function () {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0
  const checkClientExistsOptions = {
    url: `https://${OPENHIM_API_HOSTNAME}:${OPENHIM_MEDIATOR_API_PORT}/clients`,
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: BASIC_AUTH_HEADER
    }
  }

  const checkClientExistsResponse = await axios(checkClientExistsOptions)

  let clientObjectId
  // Previous test data should have been cleaned out
  for (const client of checkClientExistsResponse.data) {
    if (client.clientID === 'test-harness-client') {
      clientObjectId = client._id
      break
    }
  }

  if (clientObjectId) {
    console.log(`Deleting OpenHIM test Client record`)
    const deleteClientOptions = {
      url: `https://${OPENHIM_API_HOSTNAME}:${OPENHIM_MEDIATOR_API_PORT}/clients/${clientObjectId}`,
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: BASIC_AUTH_HEADER
      }
    }

    const deleteClientResponse = await axios(deleteClientOptions)
    expect(deleteClientResponse.status).to.eql(200)
  console.log(`Remove client (Alice) from OpenHIM`)
    
  }
})
