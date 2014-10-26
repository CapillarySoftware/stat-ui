module Data.Geometry.Point where

data Point a = Point a a

instance showPoint :: (Show a) => Show (Point a) where
  show (Point a b) = "Point " ++ show a ++ " " ++ show b

instance eqPoint :: (Eq a) => Eq (Point a) where
  (==) (Point a b) (Point a' b') = a == a' && b == b'
  (/=) x y = not $ x == y

instance semigroupPoint :: (Semigroup a) => Semigroup (Point a) where
  (<>) (Point a b) (Point a' b') = Point (a <> a') (b <> b')
