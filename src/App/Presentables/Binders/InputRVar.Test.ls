describe_ "input binders" ->
  
  specify "left" ->
    r = { update : (v) -> if v then expect v .to.equal "true" }
    i = input!
    (r `inputBindLeft` i)!
    i.value = "true"
    tinyTrigger i, 'input'

  specify "right" ->
    sub = null
    r   = { subscribe : (f) -> sub := f }
    i   = input! 
    (r `inputBindRight` i)!
    r.value = "true"
    sub!
    expect i.value .to.equal "true"

    
