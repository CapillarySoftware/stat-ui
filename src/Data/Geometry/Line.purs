module Data.Geometry.Line where

import Data.Geometry.Point
import Data.Geometry.Dimension

data Line a = Line (Point a) (Point a)

-- instance hasDimension :: HasDimension (Line Number) where
--   dimensions (Line a b) = Dimension { width : 0, height : (distance a b) }

instance showLine :: (Show a) => Show (Line a) where
  show (Line a b) = "Line (" ++ show a ++ ") (" ++ show b ++ ")"

instance functorLine :: Functor Line where
  (<$>) f (Line a b) = Line (f <$> a) (f <$> b)

instance hasPointsLine :: HasPoints Line where 
  points (Line a b) = [a,b]

instance eqLine :: (Eq a) => Eq (Line a) where
  (==) (Line a b) (Line a' b') = a == a' && b == b'
  (/=) x y = not $ x == y