#### Text Input

@input = -> _createAppend "input"
  
@inputGet = (r, i) --> !-> r.update  i.value
@inputSet = (r, i) --> !-> i.value = r.value

@inputBindLeft = (r, i) --> ->
  left = inputGet r, i
  left!
  i.addEventListener "input" left 
  return i

@inputBindRight = (r, i) --> ->
  right = inputSet r, i 
  right!
  r.subscribe right
  return i

_customInput = (type) ->
  i = input!
  i.setAttribute "type" type
  return i

#### Int Input

@inputInt = -> _customInput "number"

@inputIntGet = (r, i) --> !-> r.update  parseInt i.value
@inputIntSet = (r, i) --> !-> i.value = parseInt r.value

@inputIntBindLeft = (r, i) --> ->
  left = inputIntGet r, i
  left!
  i.addEventListener "input" left 
  return i

@inputIntBindRight = (r, i) --> ->
  right = inputIntSet r, i 
  right!
  r.subscribe right
  return i

