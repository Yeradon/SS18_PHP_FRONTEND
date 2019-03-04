import { browser, element, by } from 'protractor';

describe('ToDo Login Tests', () => {
  // e2e test case with karma, protractor and jasmine
  it('should display the login form', () => {
    browser.get('/');
    expect(element(by.name('user'))).toBeDefined();
    expect(element(by.name('password'))).toBeDefined();
    expect(element(by.name('submit'))).toBeDefined();
  });

  it('should display empty login form', () => {
    browser.get('/');
    expect(element(by.name('user')).getAttribute('value')).toBeFalsy();
    expect(element(by.name('user')).getAttribute('placeholder')).toBe(
      'Benutzername'
    );
    expect(element(by.name('password')).getAttribute('value')).toBeFalsy();
    expect(element(by.name('password')).getAttribute('placeholder')).toBe(
      'Passwort'
    );
  });

  it('should perform a login process', () => {
    const USER = 'hsolo';
    const PASSWD = 'sicheresPasswort';

    // find fields on page
    const txtUser = element(by.name('user'));
    const txtPasswd = element(by.name('password'));
    const btnSubmit = element(by.name('submit'));

    // fill input fields
    txtUser.sendKeys(USER);
    txtPasswd.sendKeys(PASSWD);

    // check inputs
    expect(txtUser.getAttribute('value')).toBe(USER);
    expect(txtPasswd.getAttribute('value')).toBe(PASSWD);

    // perform login by clicking submit button
    btnSubmit.click().then(() => {
      // wait until angular has finished all http-requests and finished rendering
      browser.waitForAngular();
      // check url
      expect(browser.driver.getCurrentUrl()).toMatch('/overview');
      // check header
      expect(element(by.css('section > h1')).getText()).toBe('Meine Übersicht');
    });
  });
});
