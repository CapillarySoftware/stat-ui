module Control.Monad.CB where

import Data.Function
import Control.Monad.Eff

foreign import data Test :: !

newtype CB e a = CB (Eff e a)

foreign import bindCallback """
  function bindCallback(cb, fn){ cb()(fn); }
  """ :: forall a b e. Fn2 (CB e a) (a -> b) b

-- foreign import functorCallback """
--   function functorCallback(fn, cb){
--     return function(fnn){ fnn(cb(fn)); };
--   } """ :: forall a b. Fn2 (a -> b) (CB a) (CB b)

-- foreign import applyCallback """
--   function applyCallback(cbFn, cb){    
--     return function(fnn){      
--       cbFn(function(fn){
--         cb(function(a){ fnn(fn(a)); });
--       });
--     };
--   } """ :: forall a b. Fn2 (CB (a -> b)) (CB a) (CB b)

-- instance bindCB :: Bind CB where
--   (>>=) = runFn2 bindCallback

-- instance functorCB :: Functor CB where
--   (<$>) = runFn2 functorCallback

-- instance applyCB :: Apply CB where
--   (<*>) = runFn2 applyCallback