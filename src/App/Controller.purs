module App.Controller where

import Data.Maybe
import Data.Moment
import Control.Reactive
import Control.Reactive.Timer
import Presentable
import Network.SocketIO
import Debug.Trace
import Graphics.Color.RGBA
import Control.Monad.Eff
import Control.Bind(join)
import Debug.Trace

import App.Network.StatQuery
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
  s <- getSocketSinglton
  n <- now 

  subscribeStat (writeRVar r) s
  interval 1000 $ requestStat "stat8" n n s

  return $ Just { chart : r, chartDataSet : chartJsDummy }



