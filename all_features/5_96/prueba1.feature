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
  When I click publish on version 5.96
  And I wait for 1 seconds
  When I click publish confirm on version 5.96
  And I wait for 1 seconds
  When I click final publish
  And I wait for 1 seconds
  Then I see the page created


@user1 @web @dynamic-data @faker @success
Scenario: Con mi usuario y contraseña de ghost quiero crear un sitio exitosamente con datos aleatorios
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
  When I enter title page with random info
  And I wait for 1 seconds
  When I enter detail page with random info
  And I wait for 1 seconds
  When I click publish on version 5.96
  And I wait for 1 seconds
  When I click publish confirm on version 5.96
  And I wait for 1 seconds
  When I click final publish
  And I wait for 1 seconds
  Then I see the page created

  @user1 @web @dynamic-data @faker @boundary @over_max_title
  Scenario: Con mi usuario y contraseña de ghost quiero crear un sitio con un titulo muy largo
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
  When I enter title page with random info over_max_title
  And I wait for 1 seconds
  When I enter detail page with random info
  And I wait for 1 seconds
  When I click publish on version 5.96
  And I wait for 1 seconds
  Then I should not see the publish button

  @user1 @web @dynamic-data @a-priori @boundary @empty-data
  Scenario: Con mi usuario y contraseña de ghost quiero crear un sitio con el titulo vacío
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
  When I enter page title "<title>" from test data "empty_title_test"
  And I wait for 1 seconds
  When I enter page content "<content>" from test data "emty_content_test"
  And I wait for 1 seconds
  Then I should not see the publish button
  