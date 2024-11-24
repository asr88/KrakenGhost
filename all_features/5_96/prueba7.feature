Feature: crear un tag 

@user1 @web
Scenario: Crear tag exitosamene
  Given I navigate to page "<URL>"
  And I wait for 2 seconds
  When I enter login email "<USERNAME1>"
  And I wait for 1 seconds
  And I enter login password "<PASSWORD1>"
  And I wait for 1 seconds
  And I submit login  
  And I wait for 5 seconds
  When I click on the tags option
  And I wait for 1 seconds
  When I click new tag
  And I wait for 1 seconds
  And I enter tag name "Prueba"
  And I wait for 1 seconds
  When I click on save button
  And I wait for 1 seconds

@user1 @web @dynamic-data @faker @success
Scenario: Crear tag exitosamene con datos aleatorios
  Given I navigate to page "<URL>"
  And I wait for 2 seconds
  When I enter login email "<USERNAME1>"
  And I wait for 1 seconds
  And I enter login password "<PASSWORD1>"
  And I wait for 1 seconds
  And I submit login  
  And I wait for 5 seconds
  When I click on the tags option
  And I wait for 1 seconds
  When I click new tag
  And I wait for 1 seconds
  When I enter tag name with random info
  And I wait for 1 seconds
  When I click on save button
  And I wait for 1 seconds

  @user1 @web @dynamic-data @faker @over_max_name
  Scenario: Crear tag error por mas de 191 caracteres en el nombre
  Given I navigate to page "<URL>"
  And I wait for 2 seconds
  When I enter login email "<USERNAME1>"
  And I wait for 1 seconds
  And I enter login password "<PASSWORD1>"
  And I wait for 1 seconds
  And I submit login  
  And I wait for 5 seconds
  When I click on the tags option
  And I wait for 1 seconds
  When I click new tag
  And I wait for 1 seconds
  When I enter tag name with random info over_max_name
  And I wait for 1 seconds
  When I click on save button
  And I wait for 1 seconds      
  Then Then I should see the error text validation tag "Tag names cannot be longer than 191 characters."

  @user1 @web @dynamic-data @faker @over_max_description
  Scenario: Crear tag error con descripción de mas de 500 caracteres
  Given I navigate to page "<URL>"
  And I wait for 2 seconds
  When I enter login email "<USERNAME1>"
  And I wait for 1 seconds
  And I enter login password "<PASSWORD1>"
  And I wait for 1 seconds
  And I submit login  
  And I wait for 5 seconds
  When I click on the tags option
  And I wait for 1 seconds
  When I click new tag
  And I wait for 1 seconds
  When I enter tag name with random info
  And I wait for 1 seconds
  When I enter the tag description with random info over_max_description
  When I click on save button
  And I wait for 1 seconds      
  Then I should see the retry button