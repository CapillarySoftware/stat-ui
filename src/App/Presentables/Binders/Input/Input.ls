@inputGet = (r, i) --> !-> r.update i.value
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
