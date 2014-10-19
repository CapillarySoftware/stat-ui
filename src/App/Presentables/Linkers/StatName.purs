module App.Presentables.Linkers.StatName where

import Control.Reactive
import Control.Monad.Eff
import Data.Maybe
import Presentable
import App.Presentables.Generators
import App.Presentables.Binders
import App.Presentables.Binders.Input

statName :: forall k v a p e. 
  Linker a (statName :: (RVar v) | p) (reactive :: Reactive, gen :: GenElem | e)

statName _ p@(Just {statName = r}) = r <<:>> input >>| Nothing