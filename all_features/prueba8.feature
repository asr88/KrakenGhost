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
  
  When I click on the "tags" function
  And I wait for 1 seconds
  Then I should have this "gh-btn gh-btn-green" button 

  When I click new tag
  And I wait for 1 seconds
  And I submit tag
  And I wait for 1 seconds

      