Feature: Editar el idioma de publicación

@user1 @web
Scenario: Editar el idioma de publicación exitosamente
  Given I navigate to page "<URL>"
  And I wait for 2 seconds
  When I enter login email "<USERNAME1>"
  And I wait for 1 seconds
  And I enter login password "<PASSWORD1>"
  And I wait for 1 seconds
  And I submit login  
  Then I wait for 2 seconds
  
  When I click on the "settings" function
  And I wait for 1 seconds

  When I click on the "Publication language" function
  And I wait for 1 seconds

  When I click edit language
  And I wait for 1 seconds
  And I enter Site language "Es"
  And I wait for 1 seconds
  And I click on save settings button
  And I wait for 1 seconds

