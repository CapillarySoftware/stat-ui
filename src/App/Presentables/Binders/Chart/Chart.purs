module App.Presentables.Binders.Chart where

import Graphics.Canvas
import Graphics.Color 
import Control.Monad.Eff
import Data.Maybe
import Presentable 
import App.Presentables.Binders

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
                    , pointStrokeColor        :: String
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
                    , legendTemplate          :: String
                    , responsive              :: Boolean
                    , maintainAspectRatio     :: Boolean
                    , animation               :: Boolean }

chartDefaults :: ChartOptions
chartDefaults = { scaleShowGridLines      : true
                , scaleGridLineColor      : "rgba(0,0,0,0.05)"
                , scaleGridLineWidth      : 1
                , bezierCurve             : true
                , bezierCurveTension      : 0.4
                , pointDot                : true
                , pointDotRadius          : 4
                , pointDotStrokeWidth     : 1
                , pointHitDetectionRadius : 20
                , datasetStroke           : true
                , datasetStrokeWidth      : 2
                , datasetFill             : true
                , legendTemplate          : "<ul class='<%=name.toLowerCase()%>-legend'><% for (var i=0; i<datasets.length; i++){%><li><span style='background-color:<%=datasets[i].lineColor%>'></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>" 
                , responsive              : false
                , maintainAspectRatio     : true
                , animation               : true }

foreign import data Chart      :: *
foreign import chart_ "chart_" :: 
  forall e. Context2D -> String -> ChartInput -> ChartOptions -> Eff (gen :: GenElem | e) Chart 

chart :: forall e. ChartType -> ChartInput -> ChartOptions -> Context2D -> 
  Eff (gen :: GenElem, canvas :: Canvas | e) Chart
chart t i o c = chart_ c (show t) i o

foreign import updateChart_ "updateChart_" :: forall e. ChartInput -> Chart -> Eff (canvas :: Canvas | e) Chart
update = updateChart_