# webdriver-mocha

NOTE: This module is not quite ready! Only a few commands work, and it's hard-wired to use Phantomjs. More to follow though.

## Motivation

To use [WebDriver](http://www.seleniumhq.org/projects/webdriver/) within [Mocha](http://mochajs.org/) we currently have to use a different test-runner (such as [Protractor](http://www.protractortest.org/)) or we have to do this:

```javascript
require('chai').should();

var webdriver = require('selenium-webdriver'),
    By = webdriver.By,
    until = webdriver.until;

var driver = new webdriver.Builder()
    .forBrowser('firefox')
    .build();

describe('my blog', () => {
  it('should navigate to post', done => {
    driver.get('http://markbirbeck.com/')
    .then(() => driver.getTitle())
      .then((title) => title.should.equal('Mark Birbeck\'s Blog'))
    .then(() => driver.quit())
    .then(() => done())
    .catch(error => done(error))
    ;
  });
});
```

(For more examples see [Writing Tests](https://code.google.com/p/selenium/wiki/WebDriverJs#Writing_Tests) and [Promises](https://code.google.com/p/selenium/wiki/WebDriverJs#Promises) in the [WebDriverJS User’s Guide](https://code.google.com/p/selenium/wiki/WebDriverJs).)

There are four improvements that we'd like to make:

* avoid having to nest every WebDriver command in a simple function (for example, ```() => driver.getTitle()```);
* be able to use promise-related libraries like [Chai as Promised](http://chaijs.com/plugins/chai-as-promised);
* be able to dispense with `done()` and `catch()` in Mocha by returning a promise;
* be able to use `driver`, `By` and `until` without having to repeat the declarations at the top of every test file.

### Using Promises

The first three points *should* all be possible, but since the promises that WebDriver returns are not 'compatible' with those used in other libraries -- such as Mocha and Chai as Promised -- they all fail.

For example, to use WebDriver commands like `getTitle()` we are obliged to nest them in a simple function:

```javascript
    .
    .
    .then(() => driver.getTitle())
      .then(title => title.should.equal('Mark Birbeck\'s Blog'))
    .
    .
```

However, what we *should* be able to do is simply pass a reference to the WebDriver function, like this:

```javascript
    .
    .
    .then(driver.getTitle)
      .then(title => title.should.equal('Mark Birbeck\'s Blog'))
    .
    .
```

Although WebDriver claims to return promises for commands the type of promises being used are not compatible with other libraries -- like Mocha -- and what should be a chain of promises turns out not to be (i.e., the promises are not being 'followed'). To get this to work we have to wrap calls to WebDriver functions with a more 'standard' promise:

```javascript
    .
    .
    .then(() => Promise.resolve(driver.getTitle()))
      .then(title => title.should.equal('Mark Birbeck\'s Blog'))
    .
    .
```

To make this wrapping easier, the `webdriver-mocha` module wraps all of the WebDriver commands with 'proper' promises and therefore allows the more direct syntax.

Note that doing this wrapping makes it possible to use Chai as Promised, which won't work with the promises that `WebDriver` is using. It also means that we can take advantage of a key benefit of Mocha which is that if a test returns a promise then Mocha will handle rejected promises. This means we can dispense with calling `done()` to terminate the test, and avoid the need to provide the `catch()` handler.

### Easy Inclusion in Mocha

Rather than having to declare the imports and variables for WebDriver at the top of each test file we'd like to incude them as globals to Mocha. This module also facilitates that, making `driver`, `By` and `until` available.

Note that since this module takes responsibility for creating `driver` it also takes responsibility for calling `driver.quit()` when all tests are complete.

## An Example

The example we began with can now be expressed like this:

```javascript
let chai = require('chai');
chai.use(require('chai-as-promised'));
chai.should();

require('webdriver-mocha');

describe('my blog', () => {
  it('should navigate to post', () => {
    return driver.get('http://markbirbeck.com/')
    .then(
      driver.getTitle()
      .should.eventually.equal('Mark Birbeck\'s Blog')
    )
    .then(() =>
      driver.findElement(
        By.linkText('A Mixin Approach to Material Design Lite Using Sass')
      ).click()
    )
    .then(
      driver.getTitle()
      .should.eventually.equal('A Mixin Approach to Material Design Lite Using Sass')
    )
    ;
  });
});
```

Note the addition of Chai as Promised, the removal of `driver.quit()`, and -- thanks to the `return` statement at the start of the test -- the omission of the two `done()` handlers.

Loading the `webdriver-mocha` module has given us:

* access to `driver`, `By` and `until` in exactly the same way as many snippets of code to be found on the web, making it easy to include them, and;
* the use of 'proper' promises on the commands, improving the integration with other libraries that use promises, such as Chai as Promised, and of course Mocha itself.

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
