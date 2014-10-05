module App.Presentables.Foreign where

import Control.Monad.Eff 
import Data.Function
import Data.Maybe
import Presentable

foreign import linkerImpl """
  function linkerImpl(Nothing, Just, linkerName, ma, mp){
    return _returnEff(_maybe(window[linkerName](_unMaybe(ma), _unMaybe(mp))));
  } 
  """ :: forall a p e. Fn5 (Maybe p) (p -> Maybe p) String (Maybe a) (Maybe p) (Eff e (Maybe p))

linker :: forall a p e. String -> Linker a p e
linker = runFn5 linkerImpl Nothing Just