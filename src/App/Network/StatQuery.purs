module App.Network.StatQuery where

import Control.Monad.Trans
import Control.Monad.Cont.Trans
import Control.Monad.Eff
import Control.Bind
import Network.SocketIO
import Debug.Foreign
import Data.Date

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
                   , startDate :: Milliseconds
                   , endDate   :: Milliseconds }

statEventName = "rawStat"

requestStat :: forall e. String -> Date -> Date -> Socket -> Eff (on :: On | e) Socket
requestStat n sd ed s = do 
  u <- getUUID
  emit statEventName { tracker : u, name : n, startDate : sd', endDate : ed' } s
  where 
  sd' = toEpochMilliseconds sd 
  ed' = toEpochMilliseconds ed






