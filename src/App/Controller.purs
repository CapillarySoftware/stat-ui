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

controller _ _ = do
  r  <- newRVar "moo"
  sr <- newRVar ([] :: StatResponse)

  subscribeStat $ writeRVar sr

  interval 1000 $ now >>= \n ->
    requestStat "stat8" (subtract (Hours 1) n) n 

  return $ Just { chart : r, chartDataSet : sr }