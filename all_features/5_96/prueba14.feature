Feature: Editar la información de un post

@user1 @web
Scenario: Editar la información de un post exitosamente
  Given I navigate to page "<URL>"
  And I wait for 2 seconds
  When I enter login email "<USERNAME1>"
  And I wait for 1 seconds
  And I enter login password "<PASSWORD1>"
  And I wait for 2 seconds
  When I submit login
  And I wait for 2 seconds
  When I click on the posts option
  And I wait for 2 seconds
  And I click on the post "Nuevo Post de Prueba"
  And I wait for 2 seconds
  And I enter new title "Nuevo Post de Prueba Cambiado"
  And I wait for 2 seconds
  And I click update
  And I wait for 2 seconds
  Then I see the alert "Post updated"
