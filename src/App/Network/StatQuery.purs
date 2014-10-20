module App.Network.StatQuery where

import Control.Monad.Trans
import Control.Monad.Cont.Trans
import Control.Monad.Eff
import Control.Bind
import Network.SocketIO
import Debug.Foreign
import Data.Moment
import Data.Moment.GetSet
import Data.Foreign
import Data.Foreign.Index
import Data.Foreign.Class
import Math

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

type LastNStatRequest = { tracker :: UUID
                        , name    :: StatName
                        , last    :: Number }                   

type StatResponse = [{ts :: Epoch, value :: Number}]

requestStat :: forall e. StatName -> Moment -> Moment -> Eff ( uuidGen :: UUIDgen
                                                             , connect :: Connect
                                                             , emit    :: Emit | e ) Socket
requestStat n sd ed = let unix x = floor $ epoch x / 1000
  in getUUID >>= \u -> getSocketSinglton >>= emit "rawStatsReq" 
    ({ tracker : u, name : n, startDate : unix sd, endDate : unix ed } :: StatRequest)

requestLastNStat :: forall e. StatName -> Number -> Eff ( uuidGen :: UUIDgen
                                                        , connect :: Connect
                                                        , emit    :: Emit | e ) Socket
requestLastNStat n l = getUUID >>= \u -> getSocketSinglton >>= emit "lastNRawStatsReq"
  ({ tracker : u, name : n, last : l } :: LastNStatRequest)

type OC e = Eff (on :: On, connect :: Connect | e)

subscribeStat :: forall b e. (StatResponse -> OC e b) -> OC e Socket
subscribeStat f = getSocketSinglton >>= on "rawStatsRes" f 

subscribeLastNStat :: forall b e. (StatResponse -> OC e b) -> OC e Socket
subscribeLastNStat f = getSocketSinglton >>= on "lastNRawStatsRes" f 






