module App.Presentables.Binders.Input where

import Data.Maybe
import Control.Monad.Eff
import Control.Reactive

import App.Presentables.Binders

foreign import data Input    :: *
foreign import data InputInt :: *

--
-- —— Text Input ——
--

foreign import input "input" :: Gen Input

instance inputUIBindLeft :: UIBindRight Input where
  (:>>) r i = i >>= inputBindRight r
  (:>)  r i = i >>= inputSet r

instance inputUIBindRight :: UIBindLeft Input where
  (<<:) r i = i >>= inputBindLeft r
  (<:)  r i = i >>= inputGet r

type BindText r e = (RVar r) -> Input -> Eff (reactive :: Reactive | e) Input

foreign import inputBindLeft  "inputBindLeft"  :: forall r e. BindText r e
foreign import inputBindRight "inputBindRight" :: forall r e. BindText r e
foreign import inputGet       "inputGet"       :: forall r e. BindText r e
foreign import inputSet       "inputSet"       :: forall r e. BindText r e

--
-- —— Int Input ——
--

foreign import inputInt "inputInt" :: Gen InputInt

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