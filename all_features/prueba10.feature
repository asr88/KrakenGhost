Feature: Editar el titulo y la descripcion del sitio 
@user1 @web
Scenario: Editar el titulo y la descripcion del sitio sin cambiar datos
  Given I navigate to page "<URL>"
  And I wait for 2 seconds
  When I enter login email "<USERNAME1>"
  And I wait for 1 seconds
  And I enter login password "<PASSWORD1>"
  And I wait for 1 seconds
  And I submit login
  And I wait for 5 seconds
  When I click on the settings option
  And I wait for 1 seconds
  When I click edit site
  And I wait for 7 seconds
  Then the save button is not clickable