describe_ "InputRVar should 2 way bind" ->
  specify "input events trigger a reactive response" ->
    r = { update : (v) -> expect v .to.equal "true" }
    i = input!!
    (inputRVar r, i)!
    i.value = "true"
    tinyTrigger i, 'input'
