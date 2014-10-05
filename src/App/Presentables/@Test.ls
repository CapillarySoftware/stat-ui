@_tests    = []
@test      = ~> [ do t for t in @_tests ]
@describe_ = (s, f) -> @_tests.push -> describe s, f 