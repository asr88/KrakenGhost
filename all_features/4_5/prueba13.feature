Feature: Editar nombre perfil

@user1 @web
Scenario: Verificar Edicion Nombre Perfil Exitosamente
  Given I navigate to page "<URL>"
   And I wait for 2 seconds
  When I enter login email "<USERNAME1>"
  And I wait for 1 seconds
  And I enter login password "<PASSWORD1>"
  And I wait for 1 seconds
  And I submit login  
  And I wait for 2 seconds
  And I click staff option
  And I wait for 7 seconds
  And I select the owner
  And I enter new name "Juan" on version 4.5
  And I wait for 2 seconds
  And I click save on version 4.5
  And I wait for 2 seconds
  Then I should see the heading "Juan" on version 4.5