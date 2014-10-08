module App.Controller where

import Data.Maybe
import Control.Reactive
import Control.Reactive.Timer
import Presentable
import Network.SocketIO
import Debug.Trace
import Graphics.Color.RGBA
import Control.Monad.Eff
import Control.Bind(join)
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
    return uuid.v1();
  }
  """ :: forall e. Eff (uuidGen :: UUIDgen | e) UUID

listenForStat r = getSocketSinglton
  >>= on name (writeRVar r)
  >>= \s -> interval 1000 $ do
    uuid <- getUUID
    emit name uuid s 
  where name = "rawStats"

controller _ _ = do
  r <- newRVar "moo"  
  subscribe r \r' -> trace r'
  listenForStat r 
  return $ Just { chart : r, chartDataSet : chartJsDummy }



