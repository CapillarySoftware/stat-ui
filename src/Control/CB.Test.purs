module Control.Monad.CB.Test where

import Test.Mocha
import Test.Chai
-- import Test.QuickCheck
import Control.Monad.CB
import Control.Monad.Eff
import Control.Monad.Trans
import Control.Apply
import Debug.Foreign

foreign import data Foo :: !

foreign import callbackTrue """
  function callbackTrue(fn){
    fn(true);
  }
""" :: forall e. CB (foo :: Foo | e) Boolean

-- liftToEff :: forall m a e. (Monad m) => m a -> Eff e a
-- liftToEff ma = liftM1 return ma

-- test = do 
--   t <- callbackTrue 
    
