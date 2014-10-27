module Graphics.Color.RGBA where

data RGBA = RGBA Number Number Number Number

class Color a where 
  lighten :: a -> a
  darken  :: a -> a  

instance semigroupRGBA :: Semigroup RGBA where
  (<>) (RGBA r g b a) (RGBA r' g' b' a') = RGBA (avg r r') (avg g g') (avg b b') (avg a a')
    where avg x y = (x + y) / 2

instance showRGBA :: Show RGBA where
  show (RGBA r g b a) = 
    "rgba(" ++ c r ++ c g ++ c b ++ show a ++ ")"
    where c x = show x ++ ","