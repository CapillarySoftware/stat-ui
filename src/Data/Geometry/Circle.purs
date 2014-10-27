module Data.Geometry.Circle where

import Data.Geometry
import Data.Geometry.Point
import Math

data Circle a = Circle (Point a) a 

instance showCircle :: (Show a) => Show (Circle a) where
  show (Circle p r) = "Circle (" ++ show p ++ ") " ++ show r

instance hasPointsCircle :: HasPoints Circle where
  points (Circle p _) = [p]

instance eqCircle :: (Eq a) => Eq (Circle a) where
  (==) (Circle p r) (Circle p' r') = p == p' && r == r'
  (/=) x y = not $ x == y

instance areaCircle :: Area (Circle Number) where
  area (Circle p r) = pi * r^2