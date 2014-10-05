module App.Routes where

import Presentable.Router
import Presentable.ViewParser
import Data.Tuple
import App.Presentables

foreign import yaml "window.yaml = window.yaml || {};" :: 
  {
    index :: Yaml 
  }

rs = [ (Tuple {url:"/index", title:"home", "data":{}} yaml.index) ]

init = do
  route rs $ flip renderYaml $ registerPresentables
  initRoutes