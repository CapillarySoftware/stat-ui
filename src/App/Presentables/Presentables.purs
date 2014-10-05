module App.Presentables where

import Presentable.ViewParser
import Presentable
import Data.Function
import Data.Maybe
import Control.Monad.Trans
import Control.Monad.Eff

foreign import linkerImpl """
  function linkerImpl(Nothing, Just, linkerName, mp, ma){
    return _returnEff(_maybe(window[linkerName](_unMaybe(mp), _unMaybe(ma))));
  } 
  """ :: forall a p e. Fn5 (Maybe p) (p -> Maybe p) String (Maybe p) (Maybe a) (Eff e (Maybe p))

linker :: forall a p e. String -> Linker a p e
linker = runFn5 linkerImpl Nothing Just

registerPresentables = register "Input" (linker "InputLinker" :: forall p e. Linker (foo :: String) p e)
                     $ emptyRegistery

