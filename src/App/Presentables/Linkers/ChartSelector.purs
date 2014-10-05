module App.Presentables.Linkers.ChartSelector where

import Control.Reactive
import Control.Monad.Eff
import Control.Monad.Eff.Exception
import Presentable
import Data.Maybe
import App.Presentables.Foreign
import App.Presentables.Generators
import App.Presentables.Binders
import Debug.Foreign

chartSelector :: forall k v a p e. 
  Linker a (chart :: (RVar v) | p) (reactive :: Reactive, gen :: GenElem | e)

chartSelector _ p@(Just {chart = r}) =   
  input >>= inputRVar r >>= const (return p)