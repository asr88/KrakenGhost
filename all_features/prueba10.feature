Feature: Editar el titulo y la descripcion del sitio

@user1 @web
Scenario: Editar el titulo y la descripcion del sitio sin datos
  Given I navigate to page "<URL>"
  And I wait for 2 seconds
  When I enter login email "<USERNAME1>"
  And I wait for 1 seconds
  And I enter login password "<PASSWORD1>"
  And I wait for 1 seconds
  And I submit login
  And I wait for 2 seconds

  When I click on settings menu
  And I wait for 1 seconds
  And I click on general settings
  And I wait for 1 seconds
  
  When I expand title settings
  And I wait for 1 seconds