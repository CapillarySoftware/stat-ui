@inputRVar = (r, i) --> ->  
  i.value = model.value
  i.addEventListener "input" !-> model.update i.value
  return i
  

