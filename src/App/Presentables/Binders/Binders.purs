module App.Presentables.Binders where

import Data.Maybe
import Control.Monad.Eff
import Control.Reactive
import App.Presentables.Generators

type RE e i = Eff (reactive :: Reactive | e) i

infixr 10 <<:>>

class UIBind a where
  (:>>) :: forall r e. RVar r -> RE e a -> RE e a
  (<<:) :: forall r e. RVar r -> RE e a -> RE e a
  (:>)  :: forall r e. RVar r -> RE e a -> RE e a
  (<:)  :: forall r e. RVar r -> RE e a -> RE e a

(<<:>>):: forall r e a. (UIBind a) => RVar r -> RE e a -> RE e a
(<<:>>) r a = r <<: a >>= return # (:>>) r

instance inputUIBind :: UIBind Input where
  (:>>) r i = i >>= inputBindRight r
  (<<:) r i = i >>= inputBindLeft r
  (<:)  r i = i >>= inputGet r
  (:>)  r i = i >>= inputSet r

(>>|) :: forall a b e. Eff e a -> b -> Eff e b
(>>|) a b = a >>= const (return b)

type Bind r e = (RVar r) -> Input -> Eff (reactive :: Reactive | e) Input

foreign import inputBindLeft  "inputBindLeft"  :: forall r e. Bind r e
foreign import inputBindRight "inputBindRight" :: forall r e. Bind r e
foreign import inputGet       "inputGet"       :: forall r e. Bind r e
foreign import inputSet       "inputSet"       :: forall r e. Bind r e