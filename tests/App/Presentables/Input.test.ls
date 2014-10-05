describe_ "Input Linker" ->
  specify "should be true" ->
    expect InputLinker({}, {}) .to.not.be.ok