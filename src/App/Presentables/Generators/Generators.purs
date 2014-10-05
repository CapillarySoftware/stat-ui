module App.Presentables.Generators where

import Control.Monad.Eff

foreign import data GenElem :: !
foreign import data Input   :: *

foreign import input "input" :: forall e. Eff (gen :: GenElem | e) Input