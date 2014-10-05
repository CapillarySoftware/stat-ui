module App.Presentables where

import Presentable.ViewParser
import Presentable
import Data.Function
import Data.Maybe
import qualified Data.Map as M
import Control.Monad.Trans
import Control.Monad.Eff
import Control.Monad.Eff.Exception
import Control.Reactive
import App.Controller

foreign import linkerImpl """
  function linkerImpl(Nothing, Just, linkerName, ma, mp){
    return _returnEff(_maybe(window[linkerName](_unMaybe(ma), _unMaybe(mp))));
  } 
  """ :: forall a p e. Fn5 (Maybe p) (p -> Maybe p) String (Maybe a) (Maybe p) (Eff e (Maybe p))

linker :: forall a p e. String -> Linker a p e
linker = runFn5 linkerImpl Nothing Just

input :: forall k v a p e. Linker (model :: String, reactive :: (RVar v) | a) 
                                  (model :: M.Map String (RVar v) | p) 
                                  (reactive :: Reactive, err :: Exception | e)
input (Just a@{model = k}) p@(Just {model = m}) = linker "InputLinker" a' p
  where
  a' = Just a{ reactive = r }
  r  = case M.lookup k m of
    Nothing -> throwException <<< error $ k <> " not found on model"
    Just rv -> return rv 

registerPresentables = emptyRegistery
                     # register "Input" input
                     # register "Controller" controller
                     

