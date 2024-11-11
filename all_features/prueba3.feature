Feature: Crear un post exitosamente

@user1 @web
Scenario: Con mi usuario de ghost quiero crear un post exitosamente
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
  And I enter title post
  And I wait for 2 seconds
  And I enter detail post
  And I wait for 2 seconds
  And I send post
  And I wait for 3 seconds
 