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
  When I click on the posts option
  And I wait for 2 seconds
  When I Click on the new post button 
  And I wait for 2 seconds
  When I enter title post
  And I wait for 1 seconds
  When I enter detail post
  And I wait for 1 seconds
  When I click publish
  And I wait for 1 seconds
  When I click publish on version 5.96
  And I wait for 1 seconds
  When I click publish confirm on version 5.96
  And I wait for 1 seconds
  Then I see the post created
