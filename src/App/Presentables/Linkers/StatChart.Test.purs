module App.Presentables.Linkers.StatChart.Test where

import Data.Array
import Data.Maybe
import Data.Moment
import Data.Moment.Parse

import Test.QuickCheck
import Test.Mocha
import Test.Chai

import App.Presentables.Linkers.StatChart
import App.Network.StatQuery

checkPreflight ts v = let p = preflight [Stat {ts : ts, value : v}]
  in case p.datasets !! 0 of 
    Just a -> a."data" == [v] && p.labels == [ts # parseUnix >>> calendar]
    _ -> false

moo = describe "StatChart" $ it "preflight" $ quickCheck checkPreflight