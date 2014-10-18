module App.Presentables.Linkers.StatChart where

import Graphics.Canvas
import Graphics.Color 
import Control.Monad.Eff
import Data.Maybe
import Presentable 
import App.Presentables.Generators
import App.Presentables.Generators.Chart

opts :: ChartOptions
opts = chartDefaults{ responsive = true }

statChart :: forall a p e. Linker a (chartDataSet :: ChartInput | p) (gen :: GenElem, canvas :: Canvas | e)
statChart _ (Just {chartDataSet = c}) = getCanvasElementById "stage" 
                                    >>= getContext2D 
                                    >>= chart Line c opts
                                    >>= const (return Nothing)