module App.Presentables.Linkers.StatChart where

import Graphics.Canvas
import Graphics.Color 
import Graphics.Color.RGBA
import Control.Monad.Eff
import Control.Reactive
import Control.Reactive.Resize
import Presentable 
import Data.Maybe

import App.Network.StatQuery
import App.Presentables.Generators
import App.Presentables.Generators.Chart

grey  = RGBA 16 16 16 1
tgrey = RGBA 220 220 220 0.2
white = RGBA 255 255 255 1

chartJsDummy :: ChartInput
chartJsDummy = {
    labels   : ["January", "February", "March", "April", "May", "June", "July"]
  , datasets : [
      { label           : "Stat1"
      , fillColor       : show tgrey
      , strokeColor     : show grey
      , pointColor      : show grey
      , pointStrokeColor: show white
      , highlightFill   : show white
      , highlightStroke : show grey
      , "data"          : [65, 59, 80, 81, 56, 55, 40]
      }
    ]
  }

opts :: ChartOptions
opts = chartDefaults{ responsive = true }

respond elem = do 
  resize go  
  go
  where go = getWindowDimensions >>= flip setCanvasDimensions elem

peek a = do
  a' <- a 
  Debug.Foreign.fprint a'
  return a'

-- statChart :: forall a p e. Linker a (chartDataSet :: RVar StatResponse | p) 
--   (gen :: GenElem, canvas :: Canvas, resize :: Resize, reactive :: Reactive | e)
statChart _ (Just {chartDataSet = d}) = 
  getCanvasElementById "stage" >>= respond 
  >>= getContext2D >>= chart Line chartJsDummy opts
  >>= sub >>= const (return Nothing)
  where 
  sub c = subscribe d $ \d' -> do 
    update chartJsDummy c
    return unit