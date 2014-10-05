module App.Presentables where

import Presentable.ViewParser
import Presentable
import Data.Function
import Data.Maybe
import Control.Monad.Trans
import Control.Monad.Eff

-- foreign import linker "" :: forall a p e. String -> Linker a p e 

foreign import linkerImpl """
  function linkerImpl(linkerName){
    return function(p){
      return function(a){
        return window[linkerName](p, a);
      };
    };
  } 
  """ :: forall x a p e. Maybe x -> (x -> Maybe x) -> String -> p -> a -> Maybe p

linker :: forall a p e. String -> Linker a p e
linker s (Just p) (Just a) = return $ linkerImpl Nothing Just s p a

registerPresentables = register "Input" (linker "InputLinker" :: forall p e. Linker (foo :: String) p e)
                     $ emptyRegistery

