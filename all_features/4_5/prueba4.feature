Feature: Crear un post sin datos

@user1 @web
Scenario: Con mi usuario de ghost quiero verificar que no se puede publicar un post sin datos
  Given I navigate to page "<URL>"
  And I wait for 2 seconds
  When I enter login email "<USERNAME1>"
  And I wait for 1 seconds
  And I enter login password "<PASSWORD1>"
  And I wait for 1 seconds
  And I submit login
  And I wait for 5 seconds
  When I click on the posts option on version 4.5
  And I wait for 2 seconds
  When I Click on the new post button on version 4.5
  And I wait for 2 seconds
  Then I should not see the publish button
