describe_ "input binders" ->

  specify "<<|" ->
    r = update : (v) -> if v then expect v .to.equal "true"
    i = input!
    (r `inputBindLeft` i)!
    i.value = "true"
    tinyTrigger i, 'input'

  specify "|>>" ->
    sub = null
    r   = subscribe : (f) -> sub := f
    i   = input! 
    (r `inputBindRight` i)!
    r.value = "true"
    sub!
    expect i.value .to.equal "true"

  specify "<|" ->
    r = update : (v) -> if v then expect v .to.equal "true"
    i = input!
    i.value = "true"
    (r `inputGet` i)!
    
  specify "|>" ->
    i   = input! 
    r   = value : "true"
    (r `inputSet` i)!    
    expect i.value .to.equal "true"    
