module App.Controller where

import Data.Maybe
import Data.Moment
import Data.Moment.Duration
import Data.Moment.Manipulate
import Control.Reactive
import Control.Reactive.Timer
import Control.Reactive.EqRVar
import Control.Apply((*>))
import Control.Bind(join)
import Control.Monad.Eff.Ref
import Control.Monad.Eff
import Network.SocketIO
import Debug.Trace
import Presentable

import App.Network.StatQuery
import App.Presentables.Linkers.StatChart
import App.Presentables.Binders.Chart

subit :: forall eff a b. (Eq a) 
  => RVar a 
  -> Eff (reactive :: Reactive, ref :: Ref | eff) b 
  -> Eff (reactive :: Reactive, ref :: Ref | eff) Subscription
subit r f = subscribeEq r \_ -> f *> return unit  

controller _ _ = do
  sn <- newRVar "stat8"
  ln <- newRVar 50
  sr <- newRVar ([] :: StatResponse)

  let requestLastNStat' = join $ 
    requestLastNStat <$> readRVar sn <*> readRVar ln

  subscribeLastNStat <<< writeRVar $ sr

  interval 1000 requestLastNStat'
  subit sn      requestLastNStat'
  subit ln      requestLastNStat'

  return $ Just {statName : sn, lastN : ln, statResponse : sr }