@inputIntGet = (r, i) --> !-> r.update parseInt i.value
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