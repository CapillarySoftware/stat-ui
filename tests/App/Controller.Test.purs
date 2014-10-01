module App.Controller.Test where

import App.Controller 

import Test.Mocha
import Test.Chai

test = describe "true dat" $ do

  it "ithTrue" $ expect ithTrue `toEqual` true 


