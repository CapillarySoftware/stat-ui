module App.Presentables where

import Presentable
import Presentable.ViewParser

foreign import linker """
  function linker(linkerName){
    return function(p){
      return function(a){
        window[linkerName](p, a);
      };
    };
  } """ :: forall a p e. String -> Linker a p e

registerPresentables = register "input" (linker "InputLinker")
                     $ emptyRegistery

