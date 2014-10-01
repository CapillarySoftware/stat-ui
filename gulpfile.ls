require! <[
  gulp 
  gulp-purescript 
  gulp-livescript 
  gulp-concat 
  gulp-if 
  express 
  run-sequence 
  gulp-karma
]>

paths =
  prod:
    src: <[
      bower_components/js-yaml/dist/js-yaml.js
      bower_components/socket.io-client/socket.io.js
      bower_components/purescript-*/src/**/*.purs
      bower_components/purescript-*/src/**/*.purs.hs
      presentable/src/**/*.purs
      src/**/*.purs
      src/**/*.ls
    ]>
    dest: "lib"

  test:
    src: <[
      bower_components/chai/chai.js
      bower_components/js-yaml/dist/js-yaml.js
      bower_components/socket.io-client/socket.io.js
      bower_components/purescript-*/src/**/*.purs
      bower_components/purescript-*/src/**/*.purs.hs
      presentable/src/**/*.purs
      src/**/*.ls
      src/**/*.purs
      tests/**/*.ls
      tests/**/*.purs
    ]>
    dest: "tmp"

options =
  prod:
    output: "Todo.js"
    main: true

  test:
    output: "Test.js"
    main: true
    runtimeTypeChecks: false
    externs: "extern.purs"

port   = 3333
server = express()

build = (k) -> ->

  x   = paths[k]
  o   = options[k]
  psc = gulp-purescript.psc o
  lsc = gulp-livescript bare : true

  psc.on "error" ({message}) ->
    console.error message
    psc.end()

  gulp.src x.src 
    .pipe gulp-if /.purs/, psc
    .pipe gulp-if /.ls/, lsc
    .pipe gulp-concat o.output
    .pipe gulp.dest x.dest

gulp.task "build:test", build "test"
gulp.task "build:prod", build "prod"

gulp.task "test:unit" ->
  gulp.src options.test.output .pipe gulp-karma(
    configFile : "./karma.conf.ls"
    noColors   : true
    action     : "run"
  )

gulp.task "watch" -> gulp.watch paths.prod.src, <[build:prod]>

gulp.task "serve" ->
  console.log "listening on port " + port
  server.use express.static "./public"
  server.listen port

gulp.task "doc" ->
  gulp.src "src/**/*.purs"
    .pipe purescript.docgen()
    .pipe gulp.dest "DocGen.md"

gulp.task "default" <[build:prod watch serve]>
gulp.task "test" -> run-sequence "build:test" "test:unit"
