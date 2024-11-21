Feature: Editar nombre perfil

@user1 @web
Scenario: Editar nombre perfil exitosamente
  Given I navigate to page "<URL>"
  And I wait for 2 seconds
  And I enter login email "<USERNAME1>"
  And I wait for 1 seconds
  And I enter login password "<PASSWORD1>"
  And I wait for 1 seconds
  And I submit login  
  And I wait for 2 seconds
  And I click avatar
  And I wait for 2 seconds
  And I click my profile
  And I wait for 7 seconds
  And I enter new name "Juan"
  And I wait for 2 seconds
  And I click save
  And I wait for 2 seconds
  Then I should see the heading "Juan"
