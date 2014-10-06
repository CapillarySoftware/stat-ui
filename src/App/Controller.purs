module App.Controller where

import Data.Maybe
import Control.Reactive
import Presentable
import Debug.Trace
import Graphics.Color.RGBA

import App.Presentables.Linkers.Chart

grey  = RGBA 220 220 220 1
tgrey = RGBA 220 220 220 0.2
white = RGBA 255 255 255 1

chartJsDummy :: ChartInput
chartJsDummy = {
    labels   : ["January", "February", "March", "April", "May", "June", "July"]
  , datasets : [
      { label           : "Stat1"
      , fillColor       : show tgrey
      , strokeColor     : show grey
      , pointColor      : show grey
      , pointStrokeColor: show white
      , highlightFill   : show white
      , highlightStroke : show grey
      , "data"          : [65, 59, 80, 81, 56, 55, 40]
      }
    ]
  }

controller _ _ = do
  r <- newRVar "moo"
  subscribe r \r' -> trace r'
  return $ Just { chart : r, chartDataSet : chartJsDummy }



