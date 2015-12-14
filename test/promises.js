/**
 * These tests show a variety of ways that promises can be wrapped.
 *
 * If you're not used to arrow functions then please note that all of the
 * following are equivalent:
 *
 *  function() { return true; }
 *
 *  () => { return true; }
 *
 *  () => true;
 */

'use strict';

let chai = require('chai');
chai.use(require('chai-as-promised'));
chai.should();

require('..' /*webdriver-mocha*/);

describe('using promises', function() {
  this.timeout(15000);

  describe('different ways to control tests', () => {
    describe('return a promise (recommended)', () => {
      it('using a function', function() {

        /**
         * Another test may have navigated away from the homepage, so put it
         * back:
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

        return driver.get('http://markbirbeck.com/')
        .then(driver.getTitle)
          .then(title => title.should.equal('Mark Birbeck\'s Blog'))
      });

      describe('using an arrow function', () => {
        it('with code block', () => {
          return driver.get('http://markbirbeck.com/')
          .then(driver.getTitle)
            .then(title => title.should.equal('Mark Birbeck\'s Blog'))
        });

        it('with expression', () =>
          driver.get('http://markbirbeck.com/')
          .then(driver.getTitle)
            .then(title => title.should.equal('Mark Birbeck\'s Blog'))
        );
      });
    });

    describe('using done() (best avoided)', () => {
      it('using a function', function(done) {
        driver.get('http://markbirbeck.com/')
        .then(driver.getTitle)
          .then(title => title.should.eql('Mark Birbeck\'s Blog'))
        .then(() => done())
        .catch(error => done(error))
        ;
      });

      describe('using an arrow function', () => {
        it('with code block', done => {
          driver.get('http://markbirbeck.com/')
          .then(driver.getTitle)
            .then(title => title.should.eql('Mark Birbeck\'s Blog'))
          .then(() => done())
          .catch(error => done(error))
          ;
        });

        it('with expression', done =>
          driver.get('http://markbirbeck.com/')
          .then(driver.getTitle)
            .then(title => title.should.eql('Mark Birbeck\'s Blog'))
          .then(() => done())
          .catch(error => done(error))
        );
      });
    });
  });

  describe('different ways to test getTitle()', () => {
    describe('all in one, with chai-as-promised', () => {
      it('using a function', () =>
        driver.get('http://markbirbeck.com/')
        .then(function() {
          return driver.getTitle()
          .should.eventually.equal('Mark Birbeck\'s Blog')
          ;
        })
      );

      it('using an arrow function with code block', () =>
        driver.get('http://markbirbeck.com/')
        .then(() => {
          return driver.getTitle()
          .should.eventually.equal('Mark Birbeck\'s Blog')
          ;
        })
      );

      it('using an arrow function with expression', () =>
        driver.get('http://markbirbeck.com/')
        .then(() =>
          driver.getTitle()
          .should.eventually.equal('Mark Birbeck\'s Blog')
        )
      );

      it('using no function...don\'t do it! It\'s a false positive...it never fails!!', () =>
        driver.get('http://markbirbeck.com/')
        .then(
          driver.getTitle()
          .should.eventually.equal('This should fail...but doesn\'t!!!!!')
        )
      );
    });

    describe('split into two steps', () => {
      it('using Promise.resolve() (this works with WebDriver unmodified)', () =>
        driver.get('http://markbirbeck.com/')
        .then(() => Promise.resolve(driver.getTitle()))
          .then(title => title.should.equal('Mark Birbeck\'s Blog'))
      );

      it('using a function reference (this only works once WebDriver has been wrapped)', () =>
        driver.get('http://markbirbeck.com/')
        .then(driver.getTitle)
          .then(title => title.should.equal('Mark Birbeck\'s Blog'))
      );
    });
  });
});
