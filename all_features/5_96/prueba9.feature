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
  And I wait for 5 seconds
  When I click on the settings option
  And I wait for 1 seconds
  When I click edit site
  And I wait for 7 seconds
  And I enter site title "Why Not Ghost"
  And I wait for 1 seconds
  And I enter site description "Why Not Ghost is a blog about why not ghost"
  And I wait for 1 seconds
  And I click on save settings button
  And I wait for 1 seconds

