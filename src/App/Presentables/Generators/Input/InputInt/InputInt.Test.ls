describe_ "Input Int Generator" ->
  specify "should return an input element" ->
    expect inputInt!.tagName .to.equal "INPUT"
    expect inputInt!.type .to.equal "number"

  specify "should return a new instance" ->
    expect inputInt! .to.not.equal inputInt!