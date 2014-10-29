module Data.Geometry.Rect where

import Data.Geometry
import Data.Geometry.Point
import Data.Geometry.Line
import Data.Function
import Math

data Rect a = Rect (Point a) (Point a)

instance showRect :: (Show a) => Show (Rect a) where
  show (Rect xy yx) = "Rect (" ++ show xy ++ ") (" ++ show yx ++ ")"

instance hasPointsRect :: HasPoints Rect where
  points (Rect a@(Point x y) b@(Point x' y')) = 
    [a, (Point x y'), b, (Point x' y)]

instance eqRect :: (Eq a) => Eq (Rect a) where
  (==) (Rect a b) (Rect a' b') = a == a' && b == b'
  (/=) x y = not $ x == y

instance areaRect :: Area (Rect Number) where 
  area (Rect (Point x y) (Point x' y')) = 
    let f a b = abs (a - b) in f x x' * f y y'

instance perimeterRect :: Perimeter (Rect Number) where
  perimeter (Rect (Point x y) (Point x' y')) = 
    let f a b = abs (a - b) * 2 in f x x' + f y y'

getTopLeft     (Rect (Point x y) (Point x' y')) = Point (x `min` x') (y `min` y')
getTopRight    (Rect (Point x y) (Point x' y')) = Point (x `max` x') (y `min` y')
getBottomRight (Rect (Point x y) (Point x' y')) = Point (x `max` x') (y `max` y')
getBottomLeft  (Rect (Point x y) (Point x' y')) = Point (x `min` x') (y `max` y')

getTopLine    r = Line (getTopLeft    r) (getTopRight    r)
getLeftLine   r = Line (getTopLeft    r) (getBottomLeft  r)
getBottomLine r = Line (getBottomLeft r) (getBottomRight r)
getRightLine  r = Line (getTopRight   r) (getBottomRight r)