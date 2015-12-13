'use strict';

let chai = require('chai');
chai.use(require('chai-as-promised'));
chai.should();

require('..' /*webdriver-mocha*/);

describe('check my blog', function() {
  this.timeout(10000);

  /**
   * Another test may have navigated away from the homepage, so put it back:
   */

  driver.get('http://markbirbeck.com/')
  .then(() => {
    return driver.wait(
      () => {
        return driver.getTitle()
        .then(title => title === 'Mark Birbeck\'s Blog')
        ;
      },
      10000
    )
  })
  ;

  describe('each test has its own promise', () => {
    it('should have the correct title', done =>
      driver.get('http://markbirbeck.com/')
      .then(
        driver.getTitle()
        .should.eventually.equal('Mark Birbeck\'s Blog')
      )
      .then(() => done())
    );

    it('should click link to open a specific blog post and then have the correct title', done =>
      driver.get('http://markbirbeck.com/')
      .then(
        driver.getTitle()
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
    );
  });

  describe('each test shares a promise', () => {
    let blog = driver.get('http://markbirbeck.com/');

    it('should have the correct title', done =>
      blog
      .then(
        driver.getTitle()
        .should.eventually.equal('Mark Birbeck\'s Blog')
      )
      .then(() => done())
    );

    it('should click link to open a specific blog post and then have the correct title', done =>
      blog
      .then(
        driver.getTitle()
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
    );
  });
});
