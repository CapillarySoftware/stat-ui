

describe_ "Inputs" ->
  
  describe "Generator" ->

    describe "Text" ->
    
        specify "should return an input element" ->
            expect input!.tagName .to.equal "INPUT"
            expect input!.type    .to.equal "text"

        specify "should return a new instance" ->
            expect input! .to.not.equal input!

    describe "Int" ->
        
        specify "should return an input element" ->
            expect inputInt!.tagName .to.equal "INPUT"
            expect inputInt!.type    .to.equal "number"

        specify "should return a new instance" ->
            expect inputInt! .to.not.equal inputInt!

  specify "should return a new instance" ->
    expect inputInt! .to.not.equal inputInt!

  describe "Binders" ->

    describe "Text" ->

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

    describe "Int" ->

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