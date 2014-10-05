module App.Presentables.ChartSelector where

import Control.Reactive
import Control.Monad.Eff
import Control.Monad.Eff.Exception
import Presentable
import Data.Maybe
import App.Presentables.Foreign

chartSelector :: forall k v a p e. 
  Linker a (chart :: (RVar v) | p) (reactive :: Reactive, err :: Exception | e)
chartSelector _ p@(Just {chart = r}) = do
  linker "InputLinker" Nothing $ Just {model : r}
  return p