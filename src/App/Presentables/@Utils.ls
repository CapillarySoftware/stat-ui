@_returnEff = (x) -> -> new x

@_unMaybe = ({value0}) -> value0 or undefined
@_maybe   = (x) ->
  {Just, Nothing} = PS.Data_Maybe
  if x and x isnt {} then Just x else Nothing

@_createAppend = (str) -> 
  document.body.appendChild document.createElement str