module Data.Geometry.Point where

--
-- —— Based on https://hackage.haskell.org/package/hgeometry-0.1.1.1/docs/src/Data-Geometry-Point.html ——
--

import Math

data Point a = Point a a

class HasPoints g where 
  points :: forall a. g a -> [Point a]

(|+|) :: Point Number -> Point Number -> Point Number
(|+|) (Point x y) (Point x' y') =  Point (x + x') (y + y')

(|-|) :: Point Number -> Point Number -> Point Number
(|-|) (Point x y) (Point x' y') =  Point (x - x') (y - y')

(|*|) :: Number -> Point Number -> Point Number
(|*|) s (Point x y) = Point (x * s) (y * s)

(|@|) :: Point Number -> Point Number -> Number
(|@|) (Point x y) (Point x' y') = x * x' + y * y'

getX (Point x _) = x
getY (Point _ y) = y 

instance functorPoint :: Functor Point where
  (<$>) f (Point x y) = Point (f x) (f y)

instance showPoint :: (Show a) => Show (Point a) where
  show (Point x y) = "Point " ++ show x ++ " " ++ show y

instance eqPoint :: (Eq a) => Eq (Point a) where
  (==) (Point x y) (Point x' y') = x == x' && y == y'
  (/=) x y = not $ x == y

instance semigroupPoint  :: Semigroup (Point Number) where
  (<>) (Point x y) (Point x' y') = Point (x + x' / 2) (y + y' / 2)

dist :: Point Number -> Point Number -> Number
dist p q = sqrt $ l22dist p q

l22dist :: Point Number -> Point Number -> Number
l22dist p q = let a = q |-| p in (getX a)^2 + (getY a)^2

distance :: Point Number -> Point Number -> Number
distance (Point x y) (Point x' y') = 
  let f a b = abs (a - b)^2 in sqrt $ f x x' + f y y'