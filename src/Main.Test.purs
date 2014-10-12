module Main where

import Control.Monad.Eff

main = do
  App.Controller.Test.test
  App.Presentables.Test.test
