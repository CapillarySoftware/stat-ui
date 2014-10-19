module App.Presentables.Binders.InputInt where

import Data.Maybe
import Control.Monad.Eff
import Control.Reactive

import App.Presentables.Generators
import App.Presentables.Binders

instance inputIntUIBindLeft :: UIBindRight InputInt where
  (:>>) r i = i >>= inputIntBindRight r
  (:>)  r i = i >>= inputIntSet r

instance inputIntUIBindRight :: UIBindLeft InputInt where
  (<<:) r i = i >>= inputIntBindLeft r
  (<:)  r i = i >>= inputIntGet r

type Bind r e = (RVar r) -> InputInt -> Eff (reactive :: Reactive | e) InputInt

foreign import inputIntBindLeft  "inputIntBindLeft"  :: forall r e. Bind r e
foreign import inputIntBindRight "inputIntBindRight" :: forall r e. Bind r e
foreign import inputIntGet       "inputIntGet"       :: forall r e. Bind r e
foreign import inputIntSet       "inputIntSet"       :: forall r e. Bind r e