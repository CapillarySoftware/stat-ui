module App.Presentables.Linkers.StatChart where

import Graphics.Canvas
import Graphics.Color 
import Graphics.Color.RGBA
import Control.Monad.Eff
import Control.Reactive
import Control.Reactive.Resize
import Control.Bind
import Presentable 
import Data.Maybe
import Data.Moment
import Data.Moment.Parse
import Data.Array
import Data.Foreign.OOFFI

import App.Network.StatQuery
import App.Presentables.Generators
import App.Presentables.Generators.Chart

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

respond elem = do
  resize go  
  go
  where 
  go = do 
    removeAttribute "style" elem
    getWindowDimensions >>= flip setCanvasDimensions elem

preflight :: StatResponse -> ChartInput
preflight sr = let
    sr' = take 100 $ reverse sr
    ls {ts = ts}   = calendar $ parseUnix ts
    ds {value = v} = v
  in default{ labels   = ls <$> sr'
            , datasets = [ defaultSet{ "data" = ds <$> sr' } ] }

statChart :: forall a p e. Linker a (chartDataSet :: RVar StatResponse | p) 
  (gen :: GenElem, canvas :: Canvas, resize :: Resize, reactive :: Reactive | e)
statChart _ (Just {chartDataSet = d}) = getCanvasElementById "stage" 
  >>= respond 
  >>= getContext2D 
  >>= chart Line default opts
  >>= sub >>= const (return Nothing)
  where 
  sub c = subscribe d $ \d' -> do
    update (preflight d') c
    return unit