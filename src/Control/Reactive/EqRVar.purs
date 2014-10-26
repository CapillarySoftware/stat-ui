module Control.Reactive.EqRVar where

import Control.Apply((*>))
import Control.Reactive
import Control.Monad.Eff.Ref
import Control.Monad.Eff 

subscribeEq :: forall a eff. (Eq a) 
  => RVar a 
  -> (a -> Eff (reactive :: Reactive, ref :: Ref | eff) Unit) 
  -> Eff (reactive :: Reactive, ref :: Ref | eff) Subscription
subscribeEq a fn = do
  let fn' ref val = writeRef ref val *> fn val 
  v <- readRVar a
  s <- newRef v
  subscribe a \v' -> do
    s' <- readRef s
    if s' /= v' then fn' s v' else return unit
