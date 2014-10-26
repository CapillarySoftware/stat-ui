module App.Controller where

import Data.Maybe
import Data.Moment
import Data.Moment.Duration
import Data.Moment.Manipulate
import Control.Reactive
import Control.Reactive.Timer
import Presentable
import Network.SocketIO
import Debug.Trace
import Control.Monad.Eff
import Control.Bind(join)
import Debug.Trace

import App.Network.StatQuery
import App.Presentables.Linkers.StatChart
import App.Presentables.Binders.Chart

subit r f = subscribe r \_ -> f >>= \_ -> return unit  

controller _ _ = do
  sn <- newRVar "stat8"
  ln <- newRVar 50
  sr <- newRVar ([] :: StatResponse)

  let requestLastNStat' = join $ requestLastNStat <$> readRVar sn 
                                                  <*> readRVar ln

  subscribeLastNStat <<< writeRVar $ sr

  interval 1000 requestLastNStat'
  subit sn      requestLastNStat'
  subit ln      requestLastNStat'

  return $ Just {statName : sn, lastN : ln, statResponse : sr }