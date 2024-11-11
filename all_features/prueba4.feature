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
  Then I should be logged in
  And I wait for 2 seconds
  When I click on the "posts" function
  And I wait for 2 seconds
  Then I should have this "new-post" button
  And I wait for 2 seconds
  When I click new post
  And I wait for 2 seconds
  Then I send post
  And I wait for 3 seconds
 