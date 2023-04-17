Feature: Login screen

Scenario: Successful login
  Given I am on the login screen
  When I enter valid login credentials
  And I submit the login form
  Then I should be logged in

Scenario: Failed login
  Given I am on the login screen
  When I enter invalid login credentials
  And I submit the login form
  Then I should see an error message
