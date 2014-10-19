module App.Presentables.Generators where

import Control.Monad.Eff

foreign import data GenElem  :: !
foreign import data Input    :: *
foreign import data InputInt :: *

type Gen a = forall e. Eff (gen :: GenElem | e) a

foreign import input    "input"    :: Gen Input
foreign import inputInt "inputInt" :: Gen InputInt