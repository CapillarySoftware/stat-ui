describe_ "Input Generator" ->
  specify "should return an input element" ->
    expect input!!.tagName .to.equal "INPUT"

  specify "should return a new instance" ->
    expect input!! .to.not.equal input!!