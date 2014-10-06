module App.Presentables.Linkers.Chart where

import Graphics.Canvas
import Graphics.Color 
import Graphics.Color.RGBA
import Control.Monad.Eff
import Data.Maybe
import Presentable 
import App.Presentables.Generators

data ChartType    = Line
                  | Bar
                  | Radar
                  | PolarArea
                  | Pie 
                  | Doughnut

instance showChartType :: Show ChartType where
  show Line      = "Line"
  show Bar       = "Bar"
  show Radar     = "Radar"
  show PolarArea = "PolarArea"
  show Pie       = "Pie"
  show Doughnut  = "Doughnut"


type ChartInput   = { labels                  :: [String]
                    , datasets                :: [ChartDataSet] }

type ChartDataSet = { label                   :: String
                    , fillColor               :: String
                    , strokeColor             :: String
                    , pointColor              :: String
                    , highlightFill           :: String
                    , highlightStroke         :: String
                    , "data"                  :: [Number] }

type ChartOptions = { scaleShowGridLines      :: Boolean
                    , scaleGridLineColor      :: String
                    , scaleGridLineWidth      :: Number
                    , bezierCurve             :: Boolean
                    , bezierCurveTension      :: Number
                    , pointDot                :: Boolean
                    , pointDotRadius          :: Number
                    , pointDotStrokeWidth     :: Number
                    , pointHitDetectionRadius :: Number
                    , datasetStroke           :: Boolean
                    , datasetStrokeWidth      :: Number
                    , datasetFill             :: Boolean
                    , legendTemplate          :: String}

foreign import data Chart    :: *
foreign import chart_ "chart_" :: Context2D -> String -> ChartInput -> Gen Chart 

grey = RGBA 220 220 220 1

chart :: forall e. ChartType -> ChartInput -> Context2D -> Eff (gen :: GenElem, canvas :: Canvas | e) Chart
chart t i c = chart_ c (show t) i

statChart :: forall a p e. Linker a (chartDataSet :: ChartInput | p) (gen :: GenElem, canvas :: Canvas | e)
statChart _ (Just {chartDataSet = c}) = getCanvasElementById "stage" 
                                    >>= getContext2D 
                                    >>= chart Line c
                                    >>= const (return Nothing)