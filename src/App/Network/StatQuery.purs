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

type StatResponse = [{ts :: Epoch, value :: Number}]

rawStats = "rawStats"

requestStat :: forall e. String -> Moment -> Moment -> Eff ( uuidGen :: UUIDgen
                                                           , connect :: Connect
                                                           , emit    :: Emit | e ) Socket
requestStat n sd ed = let go sr = emit rawStats (sr :: StatRequest)
  in getUUID >>= \u -> getSocketSinglton >>= go 
    { tracker : u, name : n, startDate : (epoch sd) / 1000, endDate : (epoch ed) / 1000 }

type OC e = Eff (on :: On, connect :: Connect | e)
subscribeStat :: forall b e. (StatResponse -> OC e b) -> OC e Socket
subscribeStat f = getSocketSinglton >>= on rawStats f 






