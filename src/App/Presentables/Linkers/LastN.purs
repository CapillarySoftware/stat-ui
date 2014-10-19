module App.Presentables.Linkers.LastN where

import Control.Reactive
import Control.Monad.Eff
import Data.Maybe
import Presentable
import App.Presentables.Generators
import App.Presentables.Binders
import App.Presentables.Binders.InputInt

lastN :: forall k v a p e. 
  Linker a (lastN :: (RVar v) | p) (reactive :: Reactive, gen :: GenElem | e)

lastN _ p@(Just { lastN = ln }) = ln <<:>> inputInt >>| Nothing