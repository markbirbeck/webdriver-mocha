# webdriver-mocha

NOTE: This module is not quite ready! Only a few commands work, and it's hard-wired to use Phantomjs. More to follow though.

## Motivation

To use WebDriver within Mocha we currently have to use a different test-runner (such as [Protractor](http://www.protractortest.org/)) or we have to do this:

```javascript
require('chai').should();

var webdriver = require('selenium-webdriver'),
    By = webdriver.By,
    until = webdriver.until;

var driver = new webdriver.Builder()
    .forBrowser('firefox')
    .build();

describe('my blog', function() {
  it('should navigate to post', function(done) {
    driver.get('http://markbirbeck.com/')
    .then(() => driver.getTitle())
      .then((title) => title.should.equal('Mark Birbeck\'s Blog'))
    .then(() => driver.quit())
    .then(() => done())
    ;
  });
});
```

There are two improvements that we'd like to make:

* avoid having to nest every WebDriver command in a simple function;
* be able to use `driver`, `By` and `until` without having to repeat the declarations at the top of every test file.

### Nesting Commands and Returning Promises

In order to use WebDriver commands like `getTitle()` we need to nest them in a simple function:

```javascript
    .
    .
    .then(() => driver.getTitle())
      .then((title) => title.should.equal('Mark Birbeck\'s Blog'))
    .
    .
```

Ideally we should be able to use them more directly, like this:

```javascript
    .
    .
    .then(driver.getTitle)
      .then((title) => title.should.equal('Mark Birbeck\'s Blog'))
    .
    .
```

This should work, since WebDriver claims to return promises for commands...but it doesn't. The reason is probably because the type of promises being used in WebDriver are not compatible with other libraries. However, if we wrap the call with a more 'standard' promise we can get this to work:

```javascript
    .
    .
    .then(Promise.resolve(driver.getTitle()))
      .then((title) => title.should.equal('Mark Birbeck\'s Blog'))
    .
    .
```

To make this wrapping easier, the `webdriver-mocha` module wraps all of the WebDriver commands with 'proper' promises and therefore allows the more direct syntax.

Note that doing this wrapping also makes it possible to use `chai-as-promised`, which won't work with the promises that `WebDriver` is using.

### Easy Inclusion in Mocha

Rather than having to declare the imports and variables for WebDriver at the top of each test file we'd like to incude them as globals to Mocha. This module also facilitates that, making `driver`, `By` and `until` available.

Note that since this module takes responsibility for creating `driver` it also takes responsibility for calling `driver.quit()` when all tests are complete.

## An Example

The example we began with can now be expressed like this (note the addition of `chai-as-promised` and the removal of `driver.quit()`):

```javascript
var chai = require('chai');
chai.use(require('chai-as-promised'));
chai.should();

require('webdriver-mocha');

describe('my blog', function() {
  it('should navigate to post', function(done) {
    driver.get('http://markbirbeck.com/')
    .then(
      driver.getTitle
      .should.eventually.equal('Mark Birbeck\'s Blog')
    )
    .then(
      driver.findElement(
        By.linkText('A Mixin Approach to Material Design Lite Using Sass')
      ).click()
    )
    .then(
      driver.getTitle()
      .should.eventually.equal('A Mixin Approach to Material Design Lite Using Sass')
    )
    .then(() => done())
    ;
  });
});
```

Loading the `webdriver-mocha` module has given us:

* access to `driver`, `By` and `until` in exactly the same way as many snippets of code to be found on the web, making it easy to include them, and;
* the use of 'proper' promises on the commands, improving the integration with other libraries that use promises, such as `chai-as-promised`, and of course `mocha` itself.

## Using With Linting Tools

Be sure to add `driver`, `By` and `until` as globals in your linting tool. For example, for ESLint we have:

```json
{
  "env": {
    "mocha": true
  },
  "globals": {
    "driver": true,
    "By": true,
    "until": true
  }
}
```

See the two `.eslintrc` files in this project for an example.
