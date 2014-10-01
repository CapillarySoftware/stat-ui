module App.Network.StatQuery where

import Control.Monad.Trans
import Control.Monad.Cont.Trans
import Control.Monad.Eff
import Control.Bind
import Network.SocketIO
import Debug.Foreign

getSocket = getSocketSinglton "http://localhost:5000"

foreign import data UUID    :: *
foreign import data UUIDgen :: !

foreign import getUUID """
  function getUUID(){
    return function(){
      return uuid.v1();
    };
  }
  """ :: forall e. Eff (uuidGen :: UUIDgen | e) UUID

type Query p    = { "type" :: String
                  , params :: p }

newtype Envelope p = Envelope { id     :: UUID
                              , query  :: Query p }

type StatQuery = Query { name      :: String
                       , startDate :: Epoch 
                       , endDate   :: Epoch }

type EE e = Eff (uuidGen :: UUIDgen, emit :: Emit, connect :: Connect | e)

emitEnvelope :: forall e. EE e Socket
emitEnvelope = join $ f <$> getUUID <*> getSocket
  where f uu so = emit "StatQuery" {id : uu} so 

type RQ e = EE (on :: On | e)

runStatQuery :: forall a r e. Envelope StatQuery -> (Response r -> RQ e a) -> RQ e Socket
runStatQuery (Envelope env) fn = let e = "StatQuery"
  in getUUID >>= \uuid -> getSocket >>= emit e env{id = uuid} >>= on e fn


class Request a where 
  send :: forall a b r e. a -> (Response r -> RQ e b) -> RQ e Socket

-- instance requestEnvelope :: Request Envelope p where
--   send (Envelope p) = runStatQuery (Envelope p)

