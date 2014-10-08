module Network.SocketIO where

import Control.Monad.Eff
import qualified Data.Function as F
import Data.Foreign.OOFFI

foreign import data SocketIO   :: *
foreign import data Socket     :: *
foreign import data Emit       :: !
foreign import data On         :: !
foreign import data Listen     :: !
foreign import data Connect    :: !
foreign import data Reconnect  :: !
foreign import data Disconnect :: !

type Url       = String
type EventName = String
type Epoch     = Number

foreign import getSocketSinglton """
  function getSocketSinglton(){
    if(window.Socket){ return window.Socket; }
    return window.Socket = io();
  }
  """ :: forall e. Eff (connect :: Connect | e) Socket

data Response d = Response d

(<:>) :: forall a b e. (Eff e a) -> b -> Eff e b
(<:>) f x = f >>= const (return x)

emit :: forall d e. String -> d -> Socket -> Eff (emit :: Emit | e) Socket
emit s d so = method2Eff "emit" so s d <:> so  

foreign import on_ """
  function on_(so, s, f){ return function(){
    so.on(s, function(d){ f(d)(); });
  }; }
  """ :: forall a b e. F.Fn3 Socket String (a -> Eff (on :: On | e) b) (Eff (on :: On | e) Socket)
  
on :: forall a b e. String -> (a -> Eff (on :: On | e) b) -> Socket -> Eff (on :: On | e) Socket
on s f so = F.runFn3 on_ so s f <:> so 

instance functorResponse :: Functor Response where
  (<$>) fn (Response d) = Response (fn d)

instance applyResponse :: Apply Response where 
  (<*>) (Response fn) x = fn <$> x

instance applicativeResponse :: Applicative Response where 
  pure = Response

instance bindResponse :: Bind Response where
  (>>=) (Response d) k = k d

instance monadResponse :: Monad Response

