module App.Controller where

import Data.Maybe
import Control.Reactive
import Control.Reactive.Timer
import Presentable
import Network.SocketIO
import Debug.Trace
import Graphics.Color.RGBA
import Control.Monad.Eff
import Debug.Trace

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

foreign import data UUID    :: *
foreign import data UUIDgen :: !

foreign import getUUID """
  function getUUID(){
    return function(){
      return uuid.v1();
    };
  }
  """ :: forall e. Eff (uuidGen :: UUIDgen | e) UUID

listenForStat r = getUUID >>= \uuid -> 
  getSocketSinglton "http://localhost:8080/socket" 
  >>= on   "stat" (writeRVar r)
  >>= emit "stat" uuid >>> interval 2000

controller _ _ = do
  r <- newRVar "moo"
  listenForStat r 
  subscribe r \r' -> trace r'
  return $ Just { chart : r, chartDataSet : chartJsDummy }



