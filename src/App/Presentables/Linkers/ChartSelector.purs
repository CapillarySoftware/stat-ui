module App.Presentables.Linkers.ChartSelector where

import Control.Reactive
import Control.Monad.Eff
import Data.Maybe
import Presentable
import App.Presentables.Generators
import App.Presentables.Binders

chartSelector :: forall k v a p e. 
  Linker a (chart :: (RVar v) | p) (reactive :: Reactive, gen :: GenElem | e)

chartSelector _ p@(Just {chart = r}) = r <||> input
                                   >>= const (return Nothing)