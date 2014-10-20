module App.Controller.Test where

import Data.Maybe
import Control.Reactive
import Test.Mocha
import Test.Chai
import App.Controller

moo = describe "Controller" do
  
  Just c <- controller Nothing Nothing
  
  it "stat8"        $ readRVar c.statName
    >>= \r -> expect r `toEqual` "stat8"

  it "lastN"        $ readRVar c.lastN
    >>= \r -> expect r `toEqual` 50

  it "statResponse" $ readRVar c.statResponse 
    >>= \r -> expect r `toDeepEqual` []