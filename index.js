var webdriver = require('selenium-webdriver');
var driver = new webdriver.Builder()
  .forBrowser('phantomjs')
  .build();

['click', 'get', 'getTitle', 'quit'].forEach(name => {
  var savedFn = driver[name];

  /**
   * Don't try turning this into an arrow function until node supports rest
   * parameters (arrow functions don't get an `arguments` value):
   */

  driver[name] = function() {
    return Promise.resolve(savedFn.apply(driver, arguments));
  }
});

/**
 * Mocha gives us 'global' that we can add our stuff to:
 *
 * TODO: We might be able to make this more generic by testing for 'global'
 * as a way to tell if we're in Mocha.
 */

global.driver = driver;
global.By = webdriver.By;
global.until = webdriver.until;

/**
 * Since we created the driver, we should remove it:
 */

after(function(done) {
  driver.quit();
  done();
});

