module Network.SocketIO where

import Control.Monad.Trans
import Control.Monad.Cont.Trans
import Control.Monad.Eff
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
  function getSocketSinglton(url){
    return function(){
      if(window.Socket){ return window.Socket; }
      return window.Socket = io.connect(url);
    };
  }
  """ :: forall e. String -> Eff (connect :: Connect | e) Socket

data Response d = Response d

emit :: forall d e. String -> d -> Socket -> Eff (emit :: Emit | e) Socket
emit s d so = method2Eff "emit" so s d

on :: forall a b e. String -> (Response a -> Eff (on :: On | e) b) -> Socket -> Eff (on :: On | e) Unit
on s f so = method2Eff "on" so s f

onCont :: forall a e. Socket -> String -> ContT Unit (Eff (on :: On | e)) (Response a)
onCont so s = cont so s # ContT
  where cont so s fn = on s fn so 

instance functorResponse :: Functor Response where
  (<$>) fn (Response d) = Response (fn d)

instance applyResponse :: Apply Response where 
  (<*>) (Response fn) x = fn <$> x

instance applicativeResponse :: Applicative Response where 
  pure = Response

instance bindResponse :: Bind Response where
  (>>=) (Response d) k = k d

instance monadResponse :: Monad Response

