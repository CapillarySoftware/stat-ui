module Data.Geometry.Dimension where

import Data.Geometry

data Dimension a = Dimension { width  :: a
                             , height :: a }

class HasDimension a where
  dimensions :: a -> Dimension Number

instance areaDimensions :: Area (Dimension Number) where
  area (Dimension { width = w, height = h }) = w * h

instance showDimension :: (Show a) => Show (Dimension a) where
  show (Dimension { width = w, height = h })
     = "Dimension { width  : " ++ show w ++ 
                 ", height : " ++ show h ++ "}"

instance functorDimension :: Functor Dimension where
  (<$>) f (Dimension { width = w,     height = h     }) 
         = Dimension { width : (f w), height : (f h) }

instance eqDimension :: (Eq a) => Eq (Dimension a) where
  (==) (Dimension { width = w,  height = h  }) 
       (Dimension { width = w', height = h' }) 
    = w == w' && h == h'
  (/=) x y = not $ x == y