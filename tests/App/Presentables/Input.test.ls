describe_ "Input Linker" ->
  specify "should be true" ->
    expect InputLinker({}, {})! .to.be.an.instanceof PS.Data_Maybe.Nothing