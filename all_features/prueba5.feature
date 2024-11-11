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
  
  When I click on the "members" function
  And I wait for 1 seconds
  Then I should have this "gh-btn gh-btn-green" button 
  Then I save existing email

  When I click new member
  And I wait for 1 seconds
  And I enter member name "test"
  And I wait for 1 seconds
  And I enter member email "test@test.com"
  And I wait for 1 seconds
  And I enter member password "test"
  And I wait for 1 seconds
  And I submit member 
  And I wait for 1 seconds
  