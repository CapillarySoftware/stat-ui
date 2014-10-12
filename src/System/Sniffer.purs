module System.Sniffer where

import Data.String.Regex

foreign import navigator :: {
    userAgent :: String
  }

ua = navigator.userAgent
i  :: RegexFlags
i  = { global     : false
     , ignoreCase : true
     , multiline  : false
     , sticky     : false
     , unicode    : false }

sniffMobile ua = let 
    mua s   = flip test ua $ regex s i
    iPhone  = mua "iPhone"
    iPod    = mua "iPod"   
    android = mua "Android"
    mobile  = mua "mobile"
  in (iPhone || iPod) || (android && mobile)

isMobile  = sniffMobile ua 
isDesktop = not isMobile