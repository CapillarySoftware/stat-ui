module App.Network.StatQuery where

import Control.Monad.Trans
import Control.Monad.Cont.Trans
import Control.Monad.Eff
import Control.Bind
import Network.SocketIO
import Debug.Foreign
import Data.Moment
import Data.Moment.GetSet

foreign import data UUID    :: *
foreign import data UUIDgen :: !

foreign import getUUID """
  function getUUID(){
    return uuid.v1();
  }
  """ :: forall e. Eff (uuidGen :: UUIDgen | e) UUID

type StatName = String

type StatRequest = { tracker   :: UUID
                   , name      :: StatName
                   , startDate :: Epoch
                   , endDate   :: Epoch }

rawStat = "rawStat"

-- requestStat :: forall e. String -> Moment -> Moment -> Socket -> Eff ( uuidGen :: UUIDgen
--                                                                      , on      :: On
--                                                                      , emit    :: Emit | e ) Socket
requestStat n sd ed s = let
    -- go :: StatRequest -> forall e. Eff (emit :: Emit | e) Socket
    go sr = emit rawStat (sr :: StatRequest)
  in getUUID >>= \u -> getSocketSinglton >>= 
    go { tracker : u, name : n, startDate : (epoch sd), endDate : (epoch ed) }

subscribeStat :: forall a b e. (a -> Eff (on :: On | e) b) -> Socket -> Eff (on :: On | e) Socket
subscribeStat = on rawStat






