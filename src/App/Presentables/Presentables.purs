module App.Presentables where

import Presentable
import Presentable.ViewParser
import Data.Function
import Data.Maybe
import qualified Data.Map as M
import Control.Monad.Trans
import Control.Monad.Eff
import Control.Monad.Eff.Exception
import Control.Reactive
import Debug.Trace

import App.Presentables.Generators
import App.Presentables.Foreign
import App.Presentables.Linkers.ChartSelector
import App.Presentables.Linkers.StatChart
import App.Controller

registerPresentables = emptyRegistery
                     # register "Controller"    controller
                     # register "ChartSelector" chartSelector
                     # register "Title"         (linker "TitleLinker")
                     # register "StatChart"     statChart
                     

