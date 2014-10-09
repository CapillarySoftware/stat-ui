module App.Presentables.Binders where

import Control.Monad.Eff
import Control.Reactive
import App.Presentables.Generators

type RE e i = Eff (reactive :: Reactive | e) i

infixr 10 <||>

class UIBind a where
  (<||>) :: forall r e. RVar r -> RE e a -> RE e a
  (|>>)  :: forall r e. RVar r -> RE e a -> RE e a
  (<<|)  :: forall r e. RVar r -> RE e a -> RE e a
  -- (|>)    :: forall r. RVar r -> a -> a
  -- (<|)    :: forall r. RVar r -> a -> RE a

instance inputUIBind :: UIBind Input where
  (<||>) r a = do 
    r |>> a
    r <<| a 
  (<||>) r i = i >>= inputBindRight r
  (|>>)  r i = i >>= inputBindRight r 
  (<<|)  r i = i >>= inputBindRight r

type Bind r e = (RVar r) -> Input -> Eff (reactive :: Reactive | e) Input

foreign import inputBindLeft "inputBindLeft" :: forall r e. Bind r e
foreign import inputBindRight "inputBindRight" :: forall r e. Bind r e