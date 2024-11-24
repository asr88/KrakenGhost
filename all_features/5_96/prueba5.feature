Feature:Crear un nuevo miembro 
@user1 @web
Scenario: Con mi usuario de ghost quiero crear un nuevo miembro exitosamente
  Given I navigate to page "<URL>"
  And I wait for 2 seconds
  When I enter login email "<USERNAME1>"
  And I wait for 1 seconds
  And I enter login password "<PASSWORD1>"
  And I wait for 1 seconds
  And I submit login
  And I wait for 5 seconds
  When I click on the members function
  And I wait for 1 seconds
  When I enter email new member "test@test.com"
  And I wait for 1 seconds
  When I click on save button
  And I wait for 1 seconds
  Then I see the member created
  

  @user1 @web @dynamic-data @faker @success
  Scenario: Con mi usuario de ghost quiero crear un nuevo miembro con datos aleatorios
  Given I navigate to page "<URL>"
  And I wait for 2 seconds
  When I enter login email "<USERNAME1>"
  And I wait for 1 seconds
  And I enter login password "<PASSWORD1>"
  And I wait for 1 seconds
  And I submit login
  And I wait for 5 seconds
  When I click on the members function
  And I wait for 1 seconds
  When I enter email new member with random info
  And I wait for 1 seconds
  When I click on save button
  And I wait for 1 seconds
  Then I see the member created
  

  @user1 @web @dynamic-data @faker @over_max_note
  Scenario: Con mi usuario de ghost quiero crear un nuevo miembro con datos aleatorios y que la nota supere lo permitido
  Given I navigate to page "<URL>"
  And I wait for 2 seconds
  When I enter login email "<USERNAME1>"
  And I wait for 1 seconds
  And I enter login password "<PASSWORD1>"
  And I wait for 1 seconds
  And I submit login
  And I wait for 5 seconds
  When I click on the members function
  And I wait for 1 seconds
  When I enter email new member with random info
  And I wait for 1 seconds
  When I enter member note with random info over_max_note
  When I click on save button
  And I wait for 1 seconds
  Then I should see the note validation error


  @user1 @web @dynamic-data @a-priori @empty_data
  Scenario: Con mi usuario de ghost quiero crear un nuevo miembro sin datos a priori
  Given I navigate to page "<URL>"
  And I wait for 2 seconds
  When I enter login email "<USERNAME1>"
  And I wait for 1 seconds
  And I enter login password "<PASSWORD1>"
  And I wait for 1 seconds
  And I submit login
  And I wait for 5 seconds
  When I click on the members function
  And I wait for 1 seconds
  When I enter email new member "email" from test data "empty_email_test"
  And I wait for 1 seconds
  When I click on save button
  And I wait for 1 seconds

@user1 @web @dynamic-data @a-priori @email_whitout_arroba
  Scenario: Con mi usuario de ghost quiero crear un nuevo miembro con email sin arroba a priori
  Given I navigate to page "<URL>"
  And I wait for 2 seconds
  When I enter login email "<USERNAME1>"
  And I wait for 1 seconds
  And I enter login password "<PASSWORD1>"
  And I wait for 1 seconds
  And I submit login
  And I wait for 5 seconds
  When I click on the members function
  And I wait for 1 seconds
  When I enter email new member "email" from test data "email_without_arroba"
  And I wait for 1 seconds
  When I click on save button
  And I wait for 1 seconds
  Then I should see the error text validation "Invalid Email."

  @user1 @web @dynamic-data @a-priori @email_whitout_dotcom
  Scenario: Con mi usuario de ghost quiero crear un nuevo miembro con el email sin punto com a priori
  Given I navigate to page "<URL>"
  And I wait for 2 seconds
  When I enter login email "<USERNAME1>"
  And I wait for 1 seconds
  And I enter login password "<PASSWORD1>"
  And I wait for 1 seconds
  And I submit login
  And I wait for 5 seconds
  When I click on the members function
  And I wait for 1 seconds
  When I enter email new member "email" from test data "email_without_dotcom"
  And I wait for 1 seconds
  When I click on save button
  And I wait for 1 seconds
  Then I should see the error text validation "Invalid Email."