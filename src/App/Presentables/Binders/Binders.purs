module App.Presentables.Binders where

import Control.Monad.Eff
import Control.Reactive
import App.Presentables.Generators

foreign import inputRVar "inputRVar" :: forall a e. (RVar a) -> Input -> Eff (reactive :: Reactive | e) Input