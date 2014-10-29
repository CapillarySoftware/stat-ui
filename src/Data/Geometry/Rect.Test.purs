module Data.Geometry.Rect.Test where

import Control.Apply ((*>))

import Data.Geometry
import Data.Geometry.Rect
import Data.Geometry.Point
import Data.Geometry.Line

import Test.Mocha
import Test.Chai
import Test.QuickCheck

checkArea = quickCheck \x y -> 
  let 
    r    = Rect (Point 0 0) (Point x y) 
    r'   = Rect (Point x y) (Point 0 0)
    r''  = Rect (Point x 0) (Point 0 y)
    r''' = Rect (Point 0 y) (Point x 0)
  in   area r    == x * y
    && area r'   == x * y
    && area r''  == x * y
    && area r''' == x * y

checkPerimeter = quickCheck \x y -> 
  let r = Rect (Point 0 0) (Point x y) in perimeter r == x * 2 + y * 2

checkPoints = let ps = points $ Rect (Point 1 2) (Point 3 4) 
  in expect ps `toDeepEqual` [Point 1 2, Point 1 4, Point 3 4, Point 3 2]

checkEq = quickCheck \x -> 
  Rect (Point x x) (Point x x) == Rect (Point x x) (Point x x)       &&
  Rect (Point x x) (Point x x) /= Rect (Point x x) (Point x (x + 1)) 

moo = describe "Rect" do

  it "perimeter" checkPerimeter
  it "area"      checkArea 

  it "show" let r =               Rect (Point 1 2) (Point 3 4)
    in expect (show r) `toEqual` "Rect (Point 1 2) (Point 3 4)"

  it "hasPoints" checkPoints

