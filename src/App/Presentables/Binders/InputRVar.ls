@inputRVar = (r, i) --> ->
  i.value = r.value
  i.addEventListener "input" !-> r.update i.value
  return i
  

