module App.Routes where

import Presentable.Router
import Presentable.ViewParser
import Data.Tuple
import Data.Maybe
import App.Presentables

foreign import yaml "window.yaml = window.yaml || {};" :: 
  {
    index :: Yaml 
  }

rs = [ (Tuple {url:"/index", title:"home", "data":{}} yaml.index) ]

init = do
  registerPresentables # renderYaml Nothing >>> route rs
  initRoutes
  