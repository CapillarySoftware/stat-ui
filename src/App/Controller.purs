module App.Controller where

import Data.Maybe
import Control.Reactive
import Presentable
import Debug.Trace

controller _ _ = do
  r <- newRVar "moo"
  subscribe r \r' -> trace r'
  return $ Just { chart : r }



