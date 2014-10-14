stat-ui
=======

[![Build Status](https://travis-ci.org/CapillarySoftware/stat-ui.svg?branch=master)](https://travis-ci.org/CapillarySoftware/stat-ui)

## Usage

Edit `mein.conf` to be your conf! by replacing `root /Users/isaac/Projects/stat-ui/public;` with the path to your public folder in this project.

execute nginx against this conf

```
sudo nginx -c /path/to/mein.conf
```

install dependencies
```
npm install; bower install
```

then run 

```
gulp 
```

(this of assuming you have gulp globally installed)

## Tests

to execute tests run

```
gulp test
```
