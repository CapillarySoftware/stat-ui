module App.Presentables.Linkers.Chart where

import Graphics.Color 
import Graphics.Color.RGBA
import App.Presentables.Generators


type ChartInput   = { labels                  :: [String]
                    , datasets                :: [ChartDataSet] }

type ChartDataSet = { label                   :: String
                    , fillColor               :: Color
                    , strokeColor             :: Color
                    , pointColor              :: Color
                    , highlightFill           :: Color
                    , highlightStroke         :: Color
                    , "data"                  :: [Number] }

type ChartOptions = { scaleShowGridLines      :: Boolean
                    , scaleGridLineColor      :: Color
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
foreign import chart "chart" :: ChartInput -> Gen Chart 

grey = RGBA 220 220 220 1

chartJsDummy :: ChartInput
chartJsDummy = {
    labels   : ["Stat"]
  , datasets : [
      { label           : "Stat1"
      , fillColor       : show grey
      , strokeColor     : show grey
      , pointColor      : show grey
      , highlightFill   : show grey
      , highlightStroke : show grey
      , "data"          : [12, 15, 45, 32]
      }
    ]
  }

statChart = chart chartJsDummy