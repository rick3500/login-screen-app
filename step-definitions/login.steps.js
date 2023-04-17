const { Given, When, Then } = require('cucumber');
const { expect } = require('chai');

Given('I am on the login screen', async function () {
  await this.browser.url
  ('/login');
});

When('I enter valid login credentials', async function () {
const emailInput = await this.browser.$('input[name="email"]');
const passwordInput = await this.browser.$('input[name="password"]');
await emailInput.setValue('user@example.com');
await passwordInput.setValue('password');
});

When('I enter invalid login credentials', async function () {
const emailInput = await this.browser.$('input[name="email"]');
const passwordInput = await this.browser.$('input[name="password"]');
await emailInput.setValue('invalid@example.com');
await passwordInput.setValue('invalid');
});

When('I submit the login form', async function () {
const loginButton = await this.browser.$('button[type="submit"]');
await loginButton.click();
});

Then('I should be logged in', async function () {
const message = await this.browser.$('body').getText();
expect(message).to.equal('Welcome!');
});

Then('I should see an error message', async function () {
const message = await this.browser.$('body').getText();
expect(message).to.equal('Invalid email or password');
});