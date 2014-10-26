module Control.Reactive.EqRVar.Test where

import Test.Mocha
import Test.Chai

import Control.Monad.Eff
import Control.Monad.Eff.Ref
import Control.Monad.Eff.Random
import Control.Apply((*>))
import Control.Reactive
import Control.Reactive.EqRVar
import Math

rand = random >>= (*) 1000000 >>> ceil >>> return

testSubEq ex s = do
  i <- rand
  v <- newRVar i 
  r <- newRef false
  subscribeEq v <<< const $ writeRef r true
  writeRVar v $ i + s
  r' <- readRef r
  expect r' `toEqual` ex

moo = describe "EqRVar" do
  it "should see changes"             $ rand >>= testSubEq true
  it "should see not see non-changes" $ testSubEq false 0