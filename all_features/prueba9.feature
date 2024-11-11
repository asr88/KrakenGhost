Feature: Editar el titulo y la descripcion del sitio

@user1 @web
Scenario: Editar el titulo y la descripcion del sitio exitosamente
  Given I navigate to page "<URL>"
  And I wait for 2 seconds
  When I enter login email "<USERNAME1>"
  And I wait for 1 seconds
  And I enter login password "<PASSWORD1>"
  And I wait for 1 seconds
  And I submit login

  When I click on the "settings" function
  And I wait for 1 seconds

  When I click edit site
  And I wait for 7 seconds
  And I enter site title "test"
  And I wait for 1 seconds
  And I enter site description "test"
  And I wait for 1 seconds
  And I click on save settings button
  And I wait for 1 seconds

