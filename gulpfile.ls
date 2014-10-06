require! <[
  express 
  run-sequence 
  js-string-escape
  gulp 
  gulp-if 
  gulp-karma
  gulp-concat 
  gulp-rename
  gulp-purescript 
  gulp-livescript
  gulp-filter
  gulp-file-include
]>

paths =
  prod:
    src: <[
      bower_components/chartjs/Chart.js
      bower_components/js-yaml/dist/js-yaml.js
      bower_components/socket.io-client/socket.io.js
      bower_components/purescript-*/src/**/*.purs
      bower_components/purescript-*/src/**/*.purs.hs
      presentable/src/**/*.purs
      src/**/*.ls      
      src/**/*.purs
    ]>
    dest: "public/js"

  test:
    src: <[
      bower_components/chai/chai.js
      bower_components/tiny-trigger/dist/tinytrigger.js
      bower_components/js-yaml/dist/js-yaml.js
      bower_components/socket.io-client/socket.io.js
      bower_components/purescript-*/src/**/*.purs
      bower_components/purescript-*/src/**/*.purs.hs
      presentable/src/**/*.purs
      src/**/*.ls
      src/**/*.purs
    ]>
    dest: "tmp"

options =
  prod:
    output: "App.js"
    main: true

  test:
    output: "Test.js"
    main: true
    externs: "extern.purs"

port   = 3333
server = express()

build = (k) -> ->

  x   = paths[k]
  o   = options[k]
  psc = gulp-purescript.psc o
  lsc = gulp-livescript bare : true
  fil = gulp-filter (file) ->
    if k is "test" 
    then not /Main.purs/.test file.path 
    else not /Test/ig.test file.path 

  psc.on "error" ({message}) ->
    console.error message
    psc.end()

  gulp.src x.src 
    .pipe fil 
    .pipe gulp-if /.purs/, psc
    .pipe gulp-if /.ls/,   lsc
    .pipe gulp-concat o.output
    .pipe gulp.dest x.dest

gulp.task "build:test", build "test"
gulp.task "build:prod", build "prod"
gulp.task "build:html" ->
  inc = gulp-file-include(
    prefix   : "@"
    basepath : "yaml"
    filters  : 
      escape : js-string-escape
  )

  gulp.src "yaml/html.html"
    .pipe inc
    .pipe gulp-rename "index.html"
    .pipe gulp.dest "public"

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

gulp.task "build" <[build:prod build:html]>
gulp.task "default" <[build watch serve]>
gulp.task "test" -> run-sequence "build:test" "test:unit"
