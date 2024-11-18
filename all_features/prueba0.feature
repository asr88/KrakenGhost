Feature: Login en Ghost

@user1 @web
Scenario: Con mi usuario y contraseña de ghost quiero iniciar sesión exitosamente
  Given I navigate to page "<URL>"
  And I wait for 2 seconds
  When I enter login email "<USERNAME1>"
  And I wait for 1 seconds
  And I enter login password "<PASSWORD1>"
  And I wait for 1 seconds
  And I submit login
  And I wait for 3 seconds
  Then I should see the text "Dashboard"