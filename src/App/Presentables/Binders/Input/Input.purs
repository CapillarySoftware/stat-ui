module App.Presentables.Binders.Input where

import Data.Maybe
import Control.Monad.Eff
import Control.Reactive

import App.Presentables.Generators
import App.Presentables.Binders

instance inputUIBindLeft :: UIBindRight Input where
  (:>>) r i = i >>= inputBindRight r
  (:>)  r i = i >>= inputSet r

instance inputUIBindRight :: UIBindLeft Input where
  (<<:) r i = i >>= inputBindLeft r
  (<:)  r i = i >>= inputGet r

type Bind r e = (RVar r) -> Input -> Eff (reactive :: Reactive | e) Input

foreign import inputBindLeft  "inputBindLeft"  :: forall r e. Bind r e
foreign import inputBindRight "inputBindRight" :: forall r e. Bind r e
foreign import inputGet       "inputGet"       :: forall r e. Bind r e
foreign import inputSet       "inputSet"       :: forall r e. Bind r e