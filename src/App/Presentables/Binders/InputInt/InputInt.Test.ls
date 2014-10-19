describe_ "inputInt binders" ->

  specify "<<|" ->
    r = update : (v) -> if v then expect v .to.equal 3
    i = inputInt!
    (r `inputIntBindLeft` i)!
    i.value = '3'
    tinyTrigger i, 'input'

  specify "|>>" ->
    sub = null
    r   = subscribe : (f) -> sub := f
    i   = inputInt! 
    (r `inputIntBindRight` i)!
    r.value = 3
    sub!
    expect i.value .to.equal '3'

  specify "<|" ->
    r = update : (v) -> if v then expect v .to.equal 2
    i = inputInt!
    i.value = '2'
    (r `inputIntGet` i)!
    
  specify "|>" ->
    i   = inputInt! 
    r   = value : 3
    (r `inputIntSet` i)!    
    expect i.value .to.equal '3'
