Feature: Login en Ghost 

@user1 @web @login @static-data
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

  @user1 @web @login @dynamic-data @faker
  Scenario: Login fallido con credenciales aleatorias
  Given I navigate to page "<URL>"
  When I enter random login credentials
  And I wait for 1 seconds   
  When I submit login
  And I wait for 3 seconds
  Then I should see the error text "There is no user with that email address."

