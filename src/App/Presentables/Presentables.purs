module App.Presentables where

import Presentable.ViewParser
import Presentable
import Data.Function
import Data.Maybe
import qualified Data.Map as M
import Control.Monad.Trans
import Control.Monad.Eff
import Control.Monad.Eff.Exception
import Control.Reactive

import App.Presentables.Foreign
import App.Presentables.Linkers.ChartSelector
import App.Controller

registerPresentables = emptyRegistery
                     # register "ChartSelector" chartSelector
                     # register "Title"         (linker "TitleLinker")
                     # register "Controller"    controller
                     

