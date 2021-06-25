Feature: Canned response server available via OpenHIM

  Rule: Authorised clients should be able to access the canned response server through the OpenHIM

    Scenario: An authorised client makes a request to the canned server
      Given the OpenHIM and canned response server are running
      And an authorised client, Alice, exists in the OpenHIM
      When Alice makes a request to the OpenHIM on the template channel
      Then Alice is able to get the canned response
