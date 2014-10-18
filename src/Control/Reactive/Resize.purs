module Control.Reactive.Resize where

import Control.Monad.Eff

foreign import data Resize :: !

foreign import resize
  "function resize(fn){\
  \   return function(){\
  \     return window.addEventListener('resize', fn);\
  \   };\
  \};" :: forall a e. Eff (resize :: Resize | e) a -> Eff (resize :: Resize | e) Unit

foreign import getWindowDimensions
  "function getWindowDimensions(){\
  \   return { width : document.body.clientWidth , height : document.body.clientHeight };\
  \};" :: forall e. Eff (resize :: Resize | e) {width :: Number, height :: Number}
