module App.Presentables.Binders where

import Data.Maybe
import Control.Monad.Eff
import Control.Reactive
import App.Presentables.Generators

type RE e i = Eff (reactive :: Reactive | e) i

infixr 8 <<:>>

class UIBindRight a where
  (:>>) :: forall r e. RVar r -> RE e a -> RE e a
  (:>)  :: forall r e. RVar r -> RE e a -> RE e a

class UIBindLeft a where
  (<<:) :: forall r e. RVar r -> RE e a -> RE e a
  (<:)  :: forall r e. RVar r -> RE e a -> RE e a

(<<:>>):: forall r e a. (UIBindRight a, UIBindLeft a) => RVar r -> RE e a -> RE e a
(<<:>>) r a = r <<: a >>= return # (:>>) r

(>>|) :: forall a b e. Eff e a -> b -> Eff e b
(>>|) a b = a >>= const (return b)