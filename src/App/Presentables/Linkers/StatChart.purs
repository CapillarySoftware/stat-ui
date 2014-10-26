module App.Presentables.Linkers.StatChart where

import Graphics.Canvas
import Graphics.Color 
import Graphics.Color.RGBA
import Control.Monad.Eff
import Control.Monad.Eff.Ref
import Control.Reactive
import Control.Reactive.EqRVar
import Control.Reactive.Resize
import Control.Bind
import Control.Apply((*>))
import Data.Maybe
import Data.Moment
import Data.Moment.Parse
import Data.Foreign.OOFFI
import Presentable 

import App.Network.StatQuery
import App.Presentables.Binders
import App.Presentables.Binders.Chart

grey  = RGBA 16 16 16 1
tgrey = RGBA 220 220 220 0.2
white = RGBA 255 255 255 1

defaultSet = { label           : "Stat1"
             , fillColor       : show tgrey
             , strokeColor     : show grey
             , pointColor      : show grey
             , pointStrokeColor: show white
             , highlightFill   : show white
             , highlightStroke : show grey
             , "data"          : [] }

default :: ChartInput
default = { labels   : []
          , datasets : [defaultSet] }

opts :: ChartOptions
opts = chartDefaults{ animation = false, responsive = true, maintainAspectRatio = false }

removeAttribute :: forall e. String -> CanvasElement -> Eff (canvas :: Canvas | e) CanvasElement
removeAttribute = flip $ method1Eff "removeAttribute"

respond elem = let go = removeAttribute "style" elem *> 
    getWindowDimensions >>= flip setCanvasDimensions elem
  in resize go *> go

preflight :: StatResponse -> ChartInput
preflight sr = let
    ls (Stat {ts = ts})   = ts # parseUnix >>> calendar
    ds (Stat {value = v}) = v
  in default{ labels   = ls <$> sr
            , datasets = [ defaultSet{ "data" = ds <$> sr } ] }

statChart :: forall a p e. Linker a (statResponse :: RVar StatResponse | p) 
  (gen :: GenElem, canvas :: Canvas, resize :: Resize, reactive :: Reactive, ref :: Ref | e)
statChart _ (Just {statResponse = sr}) = getCanvasElementById "stage" 
  >>= respond 
  >>= getContext2D 
  >>= chart Line default opts
  >>= sub >>= const (return Nothing)
  where 
  sub c = subscribeEq sr $ \sr' -> do
    update (preflight sr') c
    return unit