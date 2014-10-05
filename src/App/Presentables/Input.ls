@InputLinker = (_, {model}) !->
  i = document.createElement "input"
  i.addEventListener "input" !-> model.update i.value
  document.body.appendChild i

