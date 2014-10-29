module Data.Geometry where

class Area      g where area      :: g -> Number
class Perimeter g where perimeter :: g -> Number