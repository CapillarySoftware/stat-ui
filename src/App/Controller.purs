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
import App.Presentables.Generators.Chart

subit r f = subscribe r \_ -> f >>= \_ -> return unit  

controller _ _ = do
  r            <- newRVar "moo"
  statName     <- newRVar "stat8"
  lastN        <- newRVar 50
  statResponse <- newRVar ([] :: StatResponse)

  let requestLastNStat' = join $ requestLastNStat <$> readRVar statName 
                                                  <*> readRVar lastN

  subscribeLastNStat <<< writeRVar $ statResponse

  interval 1000  requestLastNStat'
  subit statName requestLastNStat'
  subit lastN    requestLastNStat'

  return $ Just { chart : r, chartDataSet : statResponse }