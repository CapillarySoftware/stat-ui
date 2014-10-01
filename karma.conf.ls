module.exports = ({set}) -> set(
  frameworks : <[mocha chai]>
  files      : <[./tmp/Test.js]>
  browsers   : <[PhantomJS]>
  autoWatch  : true
  singleRun  : false
  plugins    : <[
    karma-mocha
    karma-chai
    karma-phantomjs-launcher
    karma-chrome-launcher
  ]>
)