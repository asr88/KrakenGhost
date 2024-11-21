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
  When I click on the members option on version 4.5
  And I wait for 1 seconds
  When I click on the new member button
  And I wait for 1 seconds
  When I enter email new member "test@test.com" on version 4.5
  And I wait for 1 seconds
  When I click save on version 4.5
  And I wait for 1 seconds
  Then I see the member created
  