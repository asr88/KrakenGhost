Feature: crear un tag 

@user1 @web
Scenario: Crear tag sin datos
  Given I navigate to page "<URL>"
  And I wait for 2 seconds
  When I enter login email "<USERNAME1>"
  And I wait for 1 seconds
  And I enter login password "<PASSWORD1>"
  And I wait for 1 seconds
  And I submit login  
  When I click on the tags option
  And I wait for 1 seconds
  When I click new tag
  And I wait for 1 seconds
  When I click on save button
  And I wait for 1 seconds
  Then Should be a message on tags "You must specify a name for the tag."


      