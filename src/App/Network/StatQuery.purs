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
    return function(){
      return uuid.v1();
    };
  }
  """ :: forall e. Eff (uuidGen :: UUIDgen | e) UUID

type StatName = String

type StatRequest = { tracker   :: UUID
                   , name      :: StatName
                   , startDate :: Epoch
                   , endDate   :: Epoch }

statEventName = "rawStat"

requestStat :: forall e. String -> Moment -> Moment -> Socket -> Eff (uuidGen :: UUIDgen, on :: On, emit :: Emit | e) Socket
requestStat n sd ed s = do 
  u <- getUUID
  emit statEventName 
    { tracker : u, name : n
    , startDate : (epoch sd), endDate : (epoch ed) }
    s

subscribeStat :: forall a b e. (a -> Eff (on :: On | e) b) -> Socket -> Eff (on :: On | e) Socket
subscribeStat = on statEventName






