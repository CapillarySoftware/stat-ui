module Main where

import Control.Monad.Eff

main = do
  Data.Geometry.Rect.Test.moo
  Control.Reactive.EqRVar.Test.moo
  App.Controller.Test.moo
  App.Presentables.Linkers.StatChart.Test.moo
  App.Presentables.Test.test
