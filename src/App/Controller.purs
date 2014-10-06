module App.Controller where

import Data.Maybe
import Control.Reactive
import Presentable
import Debug.Trace

import App.Presentables.Linkers.Chart

chartJsDummy :: ChartInput
chartJsDummy = {
    labels   : ["Stat"]
  , datasets : [
      { label           : "Stat1"
      , fillColor       : show grey
      , strokeColor     : show grey
      , pointColor      : show grey
      , highlightFill   : show grey
      , highlightStroke : show grey
      , "data"          : [12, 15, 45, 32]
      }
    ]
  }

controller _ _ = do
  r <- newRVar "moo"
  subscribe r \r' -> trace r'
  return $ Just { chart : r, chartDataSet : chartJsDummy }



