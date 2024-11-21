Feature: Create Page in Ghost

@user1 @web
Scenario: Con mi usuario y contraseña de ghost quiero crear un sitio exitosamente
  Given I navigate to page "<URL>"
  And I wait for 2 seconds
  When I enter login email "<USERNAME1>"
  And I wait for 1 seconds
  And I enter login password "<PASSWORD1>"
  And I wait for 1 seconds
  And I submit login
  And I wait for 3 seconds
  When I click on the page option
  And I wait for 2 seconds
  When I click on the new page button
  And I wait for 2 seconds
  When I enter title page
  And I wait for 1 seconds
  When I enter detail page
  And I wait for 1 seconds
  When I click publish
  And I wait for 1 seconds
  Then I see the alert "Published"

  