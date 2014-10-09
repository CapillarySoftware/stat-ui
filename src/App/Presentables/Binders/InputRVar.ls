@inputBindLeft = (r, i) --> ->
  left = !-> r.update i.value
  left!
  i.addEventListener "input" left 
  return i

@inputBindRight = (r, i) --> ->
  right = !-> i.value = r.value
  right!
  r.subscribe right
  return i
