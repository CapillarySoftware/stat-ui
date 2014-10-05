/* js-yaml 3.2.0 https://github.com/nodeca/js-yaml */!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.jsyaml=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
'use strict';


var yaml = _dereq_('./lib/js-yaml.js');


module.exports = yaml;

},{"./lib/js-yaml.js":2}],2:[function(_dereq_,module,exports){
'use strict';


var loader = _dereq_('./js-yaml/loader');
var dumper = _dereq_('./js-yaml/dumper');


function deprecated(name) {
  return function () {
    throw new Error('Function ' + name + ' is deprecated and cannot be used.');
  };
}


module.exports.Type                = _dereq_('./js-yaml/type');
module.exports.Schema              = _dereq_('./js-yaml/schema');
module.exports.FAILSAFE_SCHEMA     = _dereq_('./js-yaml/schema/failsafe');
module.exports.JSON_SCHEMA         = _dereq_('./js-yaml/schema/json');
module.exports.CORE_SCHEMA         = _dereq_('./js-yaml/schema/core');
module.exports.DEFAULT_SAFE_SCHEMA = _dereq_('./js-yaml/schema/default_safe');
module.exports.DEFAULT_FULL_SCHEMA = _dereq_('./js-yaml/schema/default_full');
module.exports.load                = loader.load;
module.exports.loadAll             = loader.loadAll;
module.exports.safeLoad            = loader.safeLoad;
module.exports.safeLoadAll         = loader.safeLoadAll;
module.exports.dump                = dumper.dump;
module.exports.safeDump            = dumper.safeDump;
module.exports.YAMLException       = _dereq_('./js-yaml/exception');

// Deprecared schema names from JS-YAML 2.0.x
module.exports.MINIMAL_SCHEMA = _dereq_('./js-yaml/schema/failsafe');
module.exports.SAFE_SCHEMA    = _dereq_('./js-yaml/schema/default_safe');
module.exports.DEFAULT_SCHEMA = _dereq_('./js-yaml/schema/default_full');

// Deprecated functions from JS-YAML 1.x.x
module.exports.scan           = deprecated('scan');
module.exports.parse          = deprecated('parse');
module.exports.compose        = deprecated('compose');
module.exports.addConstructor = deprecated('addConstructor');

},{"./js-yaml/dumper":4,"./js-yaml/exception":5,"./js-yaml/loader":6,"./js-yaml/schema":8,"./js-yaml/schema/core":9,"./js-yaml/schema/default_full":10,"./js-yaml/schema/default_safe":11,"./js-yaml/schema/failsafe":12,"./js-yaml/schema/json":13,"./js-yaml/type":14}],3:[function(_dereq_,module,exports){
'use strict';


function isNothing(subject) {
  return (undefined === subject) || (null === subject);
}


function isObject(subject) {
  return ('object' === typeof subject) && (null !== subject);
}


function toArray(sequence) {
  if (Array.isArray(sequence)) {
    return sequence;
  } else if (isNothing(sequence)) {
    return [];
  } else {
    return [ sequence ];
  }
}


function extend(target, source) {
  var index, length, key, sourceKeys;

  if (source) {
    sourceKeys = Object.keys(source);

    for (index = 0, length = sourceKeys.length; index < length; index += 1) {
      key = sourceKeys[index];
      target[key] = source[key];
    }
  }

  return target;
}


function repeat(string, count) {
  var result = '', cycle;

  for (cycle = 0; cycle < count; cycle += 1) {
    result += string;
  }

  return result;
}


function isNegativeZero(number) {
  return (0 === number) && (Number.NEGATIVE_INFINITY === 1 / number);
}


module.exports.isNothing      = isNothing;
module.exports.isObject       = isObject;
module.exports.toArray        = toArray;
module.exports.repeat         = repeat;
module.exports.isNegativeZero = isNegativeZero;
module.exports.extend         = extend;

},{}],4:[function(_dereq_,module,exports){
'use strict';


var common              = _dereq_('./common');
var YAMLException       = _dereq_('./exception');
var DEFAULT_FULL_SCHEMA = _dereq_('./schema/default_full');
var DEFAULT_SAFE_SCHEMA = _dereq_('./schema/default_safe');


var _toString       = Object.prototype.toString;
var _hasOwnProperty = Object.prototype.hasOwnProperty;


var CHAR_TAB                  = 0x09; /* Tab */
var CHAR_LINE_FEED            = 0x0A; /* LF */
var CHAR_CARRIAGE_RETURN      = 0x0D; /* CR */
var CHAR_SPACE                = 0x20; /* Space */
var CHAR_EXCLAMATION          = 0x21; /* ! */
var CHAR_DOUBLE_QUOTE         = 0x22; /* " */
var CHAR_SHARP                = 0x23; /* # */
var CHAR_PERCENT              = 0x25; /* % */
var CHAR_AMPERSAND            = 0x26; /* & */
var CHAR_SINGLE_QUOTE         = 0x27; /* ' */
var CHAR_ASTERISK             = 0x2A; /* * */
var CHAR_COMMA                = 0x2C; /* , */
var CHAR_MINUS                = 0x2D; /* - */
var CHAR_COLON                = 0x3A; /* : */
var CHAR_GREATER_THAN         = 0x3E; /* > */
var CHAR_QUESTION             = 0x3F; /* ? */
var CHAR_COMMERCIAL_AT        = 0x40; /* @ */
var CHAR_LEFT_SQUARE_BRACKET  = 0x5B; /* [ */
var CHAR_RIGHT_SQUARE_BRACKET = 0x5D; /* ] */
var CHAR_GRAVE_ACCENT         = 0x60; /* ` */
var CHAR_LEFT_CURLY_BRACKET   = 0x7B; /* { */
var CHAR_VERTICAL_LINE        = 0x7C; /* | */
var CHAR_RIGHT_CURLY_BRACKET  = 0x7D; /* } */


var ESCAPE_SEQUENCES = {};

ESCAPE_SEQUENCES[0x00]   = '\\0';
ESCAPE_SEQUENCES[0x07]   = '\\a';
ESCAPE_SEQUENCES[0x08]   = '\\b';
ESCAPE_SEQUENCES[0x09]   = '\\t';
ESCAPE_SEQUENCES[0x0A]   = '\\n';
ESCAPE_SEQUENCES[0x0B]   = '\\v';
ESCAPE_SEQUENCES[0x0C]   = '\\f';
ESCAPE_SEQUENCES[0x0D]   = '\\r';
ESCAPE_SEQUENCES[0x1B]   = '\\e';
ESCAPE_SEQUENCES[0x22]   = '\\"';
ESCAPE_SEQUENCES[0x5C]   = '\\\\';
ESCAPE_SEQUENCES[0x85]   = '\\N';
ESCAPE_SEQUENCES[0xA0]   = '\\_';
ESCAPE_SEQUENCES[0x2028] = '\\L';
ESCAPE_SEQUENCES[0x2029] = '\\P';


var DEPRECATED_BOOLEANS_SYNTAX = [
  'y', 'Y', 'yes', 'Yes', 'YES', 'on', 'On', 'ON',
  'n', 'N', 'no', 'No', 'NO', 'off', 'Off', 'OFF'
];


function compileStyleMap(schema, map) {
  var result, keys, index, length, tag, style, type;

  if (null === map) {
    return {};
  }

  result = {};
  keys = Object.keys(map);

  for (index = 0, length = keys.length; index < length; index += 1) {
    tag = keys[index];
    style = String(map[tag]);

    if ('!!' === tag.slice(0, 2)) {
      tag = 'tag:yaml.org,2002:' + tag.slice(2);
    }

    type = schema.compiledTypeMap[tag];

    if (type && _hasOwnProperty.call(type.styleAliases, style)) {
      style = type.styleAliases[style];
    }

    result[tag] = style;
  }

  return result;
}


function encodeHex(character) {
  var string, handle, length;

  string = character.toString(16).toUpperCase();

  if (character <= 0xFF) {
    handle = 'x';
    length = 2;
  } else if (character <= 0xFFFF) {
    handle = 'u';
    length = 4;
  } else if (character <= 0xFFFFFFFF) {
    handle = 'U';
    length = 8;
  } else {
    throw new YAMLException('code point within a string may not be greater than 0xFFFFFFFF');
  }

  return '\\' + handle + common.repeat('0', length - string.length) + string;
}


function State(options) {
  this.schema      = options['schema'] || DEFAULT_FULL_SCHEMA;
  this.indent      = Math.max(1, (options['indent'] || 2));
  this.skipInvalid = options['skipInvalid'] || false;
  this.flowLevel   = (common.isNothing(options['flowLevel']) ? -1 : options['flowLevel']);
  this.styleMap    = compileStyleMap(this.schema, options['styles'] || null);

  this.implicitTypes = this.schema.compiledImplicit;
  this.explicitTypes = this.schema.compiledExplicit;

  this.tag = null;
  this.result = '';
}


function generateNextLine(state, level) {
  return '\n' + common.repeat(' ', state.indent * level);
}

function testImplicitResolving(state, str) {
  var index, length, type;

  for (index = 0, length = state.implicitTypes.length; index < length; index += 1) {
    type = state.implicitTypes[index];

    if (type.resolve(str)) {
      return true;
    }
  }

  return false;
}

function writeScalar(state, object) {
  var isQuoted, checkpoint, position, length, character, first;

  state.dump = '';
  isQuoted = false;
  checkpoint = 0;
  first = object.charCodeAt(0) || 0;

  if (-1 !== DEPRECATED_BOOLEANS_SYNTAX.indexOf(object)) {
    // Ensure compatibility with YAML 1.0/1.1 loaders.
    isQuoted = true;
  } else if (0 === object.length) {
    // Quote empty string
    isQuoted = true;
  } else if (CHAR_SPACE    === first ||
             CHAR_SPACE    === object.charCodeAt(object.length - 1)) {
    isQuoted = true;
  } else if (CHAR_MINUS    === first ||
             CHAR_QUESTION === first) {
    // Don't check second symbol for simplicity
    isQuoted = true;
  }

  for (position = 0, length = object.length; position < length; position += 1) {
    character = object.charCodeAt(position);

    if (!isQuoted) {
      if (CHAR_TAB                  === character ||
          CHAR_LINE_FEED            === character ||
          CHAR_CARRIAGE_RETURN      === character ||
          CHAR_COMMA                === character ||
          CHAR_LEFT_SQUARE_BRACKET  === character ||
          CHAR_RIGHT_SQUARE_BRACKET === character ||
          CHAR_LEFT_CURLY_BRACKET   === character ||
          CHAR_RIGHT_CURLY_BRACKET  === character ||
          CHAR_SHARP                === character ||
          CHAR_AMPERSAND            === character ||
          CHAR_ASTERISK             === character ||
          CHAR_EXCLAMATION          === character ||
          CHAR_VERTICAL_LINE        === character ||
          CHAR_GREATER_THAN         === character ||
          CHAR_SINGLE_QUOTE         === character ||
          CHAR_DOUBLE_QUOTE         === character ||
          CHAR_PERCENT              === character ||
          CHAR_COMMERCIAL_AT        === character ||
          CHAR_COLON                === character ||
          CHAR_GRAVE_ACCENT         === character) {
        isQuoted = true;
      }
    }

    if (ESCAPE_SEQUENCES[character] ||
        !((0x00020 <= character && character <= 0x00007E) ||
          (0x00085 === character)                         ||
          (0x000A0 <= character && character <= 0x00D7FF) ||
          (0x0E000 <= character && character <= 0x00FFFD) ||
          (0x10000 <= character && character <= 0x10FFFF))) {
      state.dump += object.slice(checkpoint, position);
      state.dump += ESCAPE_SEQUENCES[character] || encodeHex(character);
      checkpoint = position + 1;
      isQuoted = true;
    }
  }

  if (checkpoint < position) {
    state.dump += object.slice(checkpoint, position);
  }

  if (!isQuoted && testImplicitResolving(state, state.dump)) {
    isQuoted = true;
  }

  if (isQuoted) {
    state.dump = '"' + state.dump + '"';
  }
}

function writeFlowSequence(state, level, object) {
  var _result = '',
      _tag    = state.tag,
      index,
      length;

  for (index = 0, length = object.length; index < length; index += 1) {
    // Write only valid elements.
    if (writeNode(state, level, object[index], false, false)) {
      if (0 !== index) {
        _result += ', ';
      }
      _result += state.dump;
    }
  }

  state.tag = _tag;
  state.dump = '[' + _result + ']';
}

function writeBlockSequence(state, level, object, compact) {
  var _result = '',
      _tag    = state.tag,
      index,
      length;

  for (index = 0, length = object.length; index < length; index += 1) {
    // Write only valid elements.
    if (writeNode(state, level + 1, object[index], true, true)) {
      if (!compact || 0 !== index) {
        _result += generateNextLine(state, level);
      }
      _result += '- ' + state.dump;
    }
  }

  state.tag = _tag;
  state.dump = _result || '[]'; // Empty sequence if no valid values.
}

function writeFlowMapping(state, level, object) {
  var _result       = '',
      _tag          = state.tag,
      objectKeyList = Object.keys(object),
      index,
      length,
      objectKey,
      objectValue,
      pairBuffer;

  for (index = 0, length = objectKeyList.length; index < length; index += 1) {
    pairBuffer = '';

    if (0 !== index) {
      pairBuffer += ', ';
    }

    objectKey = objectKeyList[index];
    objectValue = object[objectKey];

    if (!writeNode(state, level, objectKey, false, false)) {
      continue; // Skip this pair because of invalid key;
    }

    if (state.dump.length > 1024) {
      pairBuffer += '? ';
    }

    pairBuffer += state.dump + ': ';

    if (!writeNode(state, level, objectValue, false, false)) {
      continue; // Skip this pair because of invalid value.
    }

    pairBuffer += state.dump;

    // Both key and value are valid.
    _result += pairBuffer;
  }

  state.tag = _tag;
  state.dump = '{' + _result + '}';
}

function writeBlockMapping(state, level, object, compact) {
  var _result       = '',
      _tag          = state.tag,
      objectKeyList = Object.keys(object),
      index,
      length,
      objectKey,
      objectValue,
      explicitPair,
      pairBuffer;

  for (index = 0, length = objectKeyList.length; index < length; index += 1) {
    pairBuffer = '';

    if (!compact || 0 !== index) {
      pairBuffer += generateNextLine(state, level);
    }

    objectKey = objectKeyList[index];
    objectValue = object[objectKey];

    if (!writeNode(state, level + 1, objectKey, true, true)) {
      continue; // Skip this pair because of invalid key.
    }

    explicitPair = (null !== state.tag && '?' !== state.tag) ||
                   (state.dump && state.dump.length > 1024);

    if (explicitPair) {
      if (state.dump && CHAR_LINE_FEED === state.dump.charCodeAt(0)) {
        pairBuffer += '?';
      } else {
        pairBuffer += '? ';
      }
    }

    pairBuffer += state.dump;

    if (explicitPair) {
      pairBuffer += generateNextLine(state, level);
    }

    if (!writeNode(state, level + 1, objectValue, true, explicitPair)) {
      continue; // Skip this pair because of invalid value.
    }

    if (state.dump && CHAR_LINE_FEED === state.dump.charCodeAt(0)) {
      pairBuffer += ':';
    } else {
      pairBuffer += ': ';
    }

    pairBuffer += state.dump;

    // Both key and value are valid.
    _result += pairBuffer;
  }

  state.tag = _tag;
  state.dump = _result || '{}'; // Empty mapping if no valid pairs.
}

function detectType(state, object, explicit) {
  var _result, typeList, index, length, type, style;

  typeList = explicit ? state.explicitTypes : state.implicitTypes;

  for (index = 0, length = typeList.length; index < length; index += 1) {
    type = typeList[index];

    if ((type.instanceOf  || type.predicate) &&
        (!type.instanceOf || (('object' === typeof object) && (object instanceof type.instanceOf))) &&
        (!type.predicate  || type.predicate(object))) {

      state.tag = explicit ? type.tag : '?';

      if (type.represent) {
        style = state.styleMap[type.tag] || type.defaultStyle;

        if ('[object Function]' === _toString.call(type.represent)) {
          _result = type.represent(object, style);
        } else if (_hasOwnProperty.call(type.represent, style)) {
          _result = type.represent[style](object, style);
        } else {
          throw new YAMLException('!<' + type.tag + '> tag resolver accepts not "' + style + '" style');
        }

        state.dump = _result;
      }

      return true;
    }
  }

  return false;
}

// Serializes `object` and writes it to global `result`.
// Returns true on success, or false on invalid object.
//
function writeNode(state, level, object, block, compact) {
  state.tag = null;
  state.dump = object;

  if (!detectType(state, object, false)) {
    detectType(state, object, true);
  }

  var type = _toString.call(state.dump);

  if (block) {
    block = (0 > state.flowLevel || state.flowLevel > level);
  }

  if ((null !== state.tag && '?' !== state.tag) || (2 !== state.indent && level > 0)) {
    compact = false;
  }

  if ('[object Object]' === type) {
    if (block && (0 !== Object.keys(state.dump).length)) {
      writeBlockMapping(state, level, state.dump, compact);
    } else {
      writeFlowMapping(state, level, state.dump);
    }
  } else if ('[object Array]' === type) {
    if (block && (0 !== state.dump.length)) {
      writeBlockSequence(state, level, state.dump, compact);
    } else {
      writeFlowSequence(state, level, state.dump);
    }
  } else if ('[object String]' === type) {
    if ('?' !== state.tag) {
      writeScalar(state, state.dump);
    }
  } else if (state.skipInvalid) {
    return false;
  } else {
    throw new YAMLException('unacceptabe kind of an object to dump ' + type);
  }

  if (null !== state.tag && '?' !== state.tag) {
    state.dump = '!<' + state.tag + '> ' + state.dump;
  }
  return true;
}


function dump(input, options) {
  options = options || {};

  var state = new State(options);

  if (writeNode(state, 0, input, true, true)) {
    return state.dump + '\n';
  } else {
    return '';
  }
}


function safeDump(input, options) {
  return dump(input, common.extend({ schema: DEFAULT_SAFE_SCHEMA }, options));
}


module.exports.dump     = dump;
module.exports.safeDump = safeDump;

},{"./common":3,"./exception":5,"./schema/default_full":10,"./schema/default_safe":11}],5:[function(_dereq_,module,exports){
'use strict';


function YAMLException(reason, mark) {
  this.name    = 'YAMLException';
  this.reason  = reason;
  this.mark    = mark;
  this.message = this.toString(false);
}


YAMLException.prototype.toString = function toString(compact) {
  var result;

  result = 'JS-YAML: ' + (this.reason || '(unknown reason)');

  if (!compact && this.mark) {
    result += ' ' + this.mark.toString();
  }

  return result;
};


module.exports = YAMLException;

},{}],6:[function(_dereq_,module,exports){
'use strict';


var common              = _dereq_('./common');
var YAMLException       = _dereq_('./exception');
var Mark                = _dereq_('./mark');
var DEFAULT_SAFE_SCHEMA = _dereq_('./schema/default_safe');
var DEFAULT_FULL_SCHEMA = _dereq_('./schema/default_full');


var _hasOwnProperty = Object.prototype.hasOwnProperty;


var CONTEXT_FLOW_IN   = 1;
var CONTEXT_FLOW_OUT  = 2;
var CONTEXT_BLOCK_IN  = 3;
var CONTEXT_BLOCK_OUT = 4;


var CHOMPING_CLIP  = 1;
var CHOMPING_STRIP = 2;
var CHOMPING_KEEP  = 3;


var PATTERN_NON_PRINTABLE         = /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x84\x86-\x9F\uD800-\uDFFF\uFFFE\uFFFF]/;
var PATTERN_NON_ASCII_LINE_BREAKS = /[\x85\u2028\u2029]/;
var PATTERN_FLOW_INDICATORS       = /[,\[\]\{\}]/;
var PATTERN_TAG_HANDLE            = /^(?:!|!!|![a-z\-]+!)$/i;
var PATTERN_TAG_URI               = /^(?:!|[^,\[\]\{\}])(?:%[0-9a-f]{2}|[0-9a-z\-#;\/\?:@&=\+\$,_\.!~\*'\(\)\[\]])*$/i;


function is_EOL(c) {
  return (c === 0x0A/* LF */) || (c === 0x0D/* CR */);
}

function is_WHITE_SPACE(c) {
  return (c === 0x09/* Tab */) || (c === 0x20/* Space */);
}

function is_WS_OR_EOL(c) {
  return (c === 0x09/* Tab */) ||
         (c === 0x20/* Space */) ||
         (c === 0x0A/* LF */) ||
         (c === 0x0D/* CR */);
}

function is_FLOW_INDICATOR(c) {
  return 0x2C/* , */ === c ||
         0x5B/* [ */ === c ||
         0x5D/* ] */ === c ||
         0x7B/* { */ === c ||
         0x7D/* } */ === c;
}

function fromHexCode(c) {
  var lc;

  if ((0x30/* 0 */ <= c) && (c <= 0x39/* 9 */)) {
    return c - 0x30;
  }

  lc = c | 0x20;
  if ((0x61/* a */ <= lc) && (lc <= 0x66/* f */)) {
    return lc - 0x61 + 10;
  }

  return -1;
}

function escapedHexLen(c) {
  if (c === 0x78/* x */) { return 2; }
  if (c === 0x75/* u */) { return 4; }
  if (c === 0x55/* U */) { return 8; }
  return 0;
}

function fromDecimalCode(c) {
  if ((0x30/* 0 */ <= c) && (c <= 0x39/* 9 */)) {
    return c - 0x30;
  }

  return -1;
}

function simpleEscapeSequence(c) {
 return (c === 0x30/* 0 */) ? '\x00' :
        (c === 0x61/* a */) ? '\x07' :
        (c === 0x62/* b */) ? '\x08' :
        (c === 0x74/* t */) ? '\x09' :
        (c === 0x09/* Tab */) ? '\x09' :
        (c === 0x6E/* n */) ? '\x0A' :
        (c === 0x76/* v */) ? '\x0B' :
        (c === 0x66/* f */) ? '\x0C' :
        (c === 0x72/* r */) ? '\x0D' :
        (c === 0x65/* e */) ? '\x1B' :
        (c === 0x20/* Space */) ? ' ' :
        (c === 0x22/* " */) ? '\x22' :
        (c === 0x2F/* / */) ? '/' :
        (c === 0x5C/* \ */) ? '\x5C' :
        (c === 0x4E/* N */) ? '\x85' :
        (c === 0x5F/* _ */) ? '\xA0' :
        (c === 0x4C/* L */) ? '\u2028' :
        (c === 0x50/* P */) ? '\u2029' : '';
}

var simpleEscapeCheck = new Array(256); // integer, for fast access
var simpleEscapeMap = new Array(256);
for (var i = 0; i < 256; i++) {
  simpleEscapeCheck[i] = simpleEscapeSequence(i) ? 1 : 0;
  simpleEscapeMap[i] = simpleEscapeSequence(i);
}


function State(input, options) {
  this.input = input;

  this.filename  = options['filename']  || null;
  this.schema    = options['schema']    || DEFAULT_FULL_SCHEMA;
  this.onWarning = options['onWarning'] || null;
  this.legacy    = options['legacy']    || false;

  this.implicitTypes = this.schema.compiledImplicit;
  this.typeMap       = this.schema.compiledTypeMap;

  this.length     = input.length;
  this.position   = 0;
  this.line       = 0;
  this.lineStart  = 0;
  this.lineIndent = 0;

  this.documents = [];

  /*
  this.version;
  this.checkLineBreaks;
  this.tagMap;
  this.anchorMap;
  this.tag;
  this.anchor;
  this.kind;
  this.result;*/

}


function generateError(state, message) {
  return new YAMLException(
    message,
    new Mark(state.filename, state.input, state.position, state.line, (state.position - state.lineStart)));
}

function throwError(state, message) {
  throw generateError(state, message);
}

function throwWarning(state, message) {
  var error = generateError(state, message);

  if (state.onWarning) {
    state.onWarning.call(null, error);
  } else {
    throw error;
  }
}


var directiveHandlers = {

  'YAML': function handleYamlDirective(state, name, args) {

      var match, major, minor;

      if (null !== state.version) {
        throwError(state, 'duplication of %YAML directive');
      }

      if (1 !== args.length) {
        throwError(state, 'YAML directive accepts exactly one argument');
      }

      match = /^([0-9]+)\.([0-9]+)$/.exec(args[0]);

      if (null === match) {
        throwError(state, 'ill-formed argument of the YAML directive');
      }

      major = parseInt(match[1], 10);
      minor = parseInt(match[2], 10);

      if (1 !== major) {
        throwError(state, 'unacceptable YAML version of the document');
      }

      state.version = args[0];
      state.checkLineBreaks = (minor < 2);

      if (1 !== minor && 2 !== minor) {
        throwWarning(state, 'unsupported YAML version of the document');
      }
    },

  'TAG': function handleTagDirective(state, name, args) {

      var handle, prefix;

      if (2 !== args.length) {
        throwError(state, 'TAG directive accepts exactly two arguments');
      }

      handle = args[0];
      prefix = args[1];

      if (!PATTERN_TAG_HANDLE.test(handle)) {
        throwError(state, 'ill-formed tag handle (first argument) of the TAG directive');
      }

      if (_hasOwnProperty.call(state.tagMap, handle)) {
        throwError(state, 'there is a previously declared suffix for "' + handle + '" tag handle');
      }

      if (!PATTERN_TAG_URI.test(prefix)) {
        throwError(state, 'ill-formed tag prefix (second argument) of the TAG directive');
      }

      state.tagMap[handle] = prefix;
    }
};


function captureSegment(state, start, end, checkJson) {
  var _position, _length, _character, _result;

  if (start < end) {
    _result = state.input.slice(start, end);

    if (checkJson) {
      for (_position = 0, _length = _result.length;
           _position < _length;
           _position += 1) {
        _character = _result.charCodeAt(_position);
        if (!(0x09 === _character ||
              0x20 <= _character && _character <= 0x10FFFF)) {
          throwError(state, 'expected valid JSON character');
        }
      }
    }

    state.result += _result;
  }
}

function mergeMappings(state, destination, source) {
  var sourceKeys, key, index, quantity;

  if (!common.isObject(source)) {
    throwError(state, 'cannot merge mappings; the provided source object is unacceptable');
  }

  sourceKeys = Object.keys(source);

  for (index = 0, quantity = sourceKeys.length; index < quantity; index += 1) {
    key = sourceKeys[index];

    if (!_hasOwnProperty.call(destination, key)) {
      destination[key] = source[key];
    }
  }
}

function storeMappingPair(state, _result, keyTag, keyNode, valueNode) {
  var index, quantity;

  keyNode = String(keyNode);

  if (null === _result) {
    _result = {};
  }

  if ('tag:yaml.org,2002:merge' === keyTag) {
    if (Array.isArray(valueNode)) {
      for (index = 0, quantity = valueNode.length; index < quantity; index += 1) {
        mergeMappings(state, _result, valueNode[index]);
      }
    } else {
      mergeMappings(state, _result, valueNode);
    }
  } else {
    _result[keyNode] = valueNode;
  }

  return _result;
}

function readLineBreak(state) {
  var ch;

  ch = state.input.charCodeAt(state.position);

  if (0x0A/* LF */ === ch) {
    state.position++;
  } else if (0x0D/* CR */ === ch) {
    state.position++;
    if (0x0A/* LF */ === state.input.charCodeAt(state.position)) {
      state.position++;
    }
  } else {
    throwError(state, 'a line break is expected');
  }

  state.line += 1;
  state.lineStart = state.position;
}

function skipSeparationSpace(state, allowComments, checkIndent) {
  var lineBreaks = 0,
      ch = state.input.charCodeAt(state.position);

  while (0 !== ch) {
    while (is_WHITE_SPACE(ch)) {
      ch = state.input.charCodeAt(++state.position);
    }

    if (allowComments && 0x23/* # */ === ch) {
      do {
        ch = state.input.charCodeAt(++state.position);
      } while (ch !== 0x0A/* LF */ && ch !== 0x0D/* CR */ && 0 !== ch);
    }

    if (is_EOL(ch)) {
      readLineBreak(state);

      ch = state.input.charCodeAt(state.position);
      lineBreaks++;
      state.lineIndent = 0;

      while (0x20/* Space */ === ch) {
        state.lineIndent++;
        ch = state.input.charCodeAt(++state.position);
      }

      if (state.lineIndent < checkIndent) {
        throwWarning(state, 'deficient indentation');
      }
    } else {
      break;
    }
  }

  return lineBreaks;
}

function testDocumentSeparator(state) {
  var _position = state.position,
      ch;

  ch = state.input.charCodeAt(_position);

  // Condition state.position === state.lineStart is tested
  // in parent on each call, for efficiency. No needs to test here again.
  if ((0x2D/* - */ === ch || 0x2E/* . */ === ch) &&
      state.input.charCodeAt(_position + 1) === ch &&
      state.input.charCodeAt(_position+ 2) === ch) {

    _position += 3;

    ch = state.input.charCodeAt(_position);

    if (ch === 0 || is_WS_OR_EOL(ch)) {
      return true;
    }
  }

  return false;
}

function writeFoldedLines(state, count) {
  if (1 === count) {
    state.result += ' ';
  } else if (count > 1) {
    state.result += common.repeat('\n', count - 1);
  }
}


function readPlainScalar(state, nodeIndent, withinFlowCollection) {
  var preceding,
      following,
      captureStart,
      captureEnd,
      hasPendingContent,
      _line,
      _lineStart,
      _lineIndent,
      _kind = state.kind,
      _result = state.result,
      ch;

  ch = state.input.charCodeAt(state.position);

  if (is_WS_OR_EOL(ch)             ||
      is_FLOW_INDICATOR(ch)        ||
      0x23/* # */           === ch ||
      0x26/* & */           === ch ||
      0x2A/* * */           === ch ||
      0x21/* ! */           === ch ||
      0x7C/* | */           === ch ||
      0x3E/* > */           === ch ||
      0x27/* ' */           === ch ||
      0x22/* " */           === ch ||
      0x25/* % */           === ch ||
      0x40/* @ */           === ch ||
      0x60/* ` */           === ch) {
    return false;
  }

  if (0x3F/* ? */ === ch || 0x2D/* - */ === ch) {
    following = state.input.charCodeAt(state.position + 1);

    if (is_WS_OR_EOL(following) ||
        withinFlowCollection && is_FLOW_INDICATOR(following)) {
      return false;
    }
  }

  state.kind = 'scalar';
  state.result = '';
  captureStart = captureEnd = state.position;
  hasPendingContent = false;

  while (0 !== ch) {
    if (0x3A/* : */ === ch) {
      following = state.input.charCodeAt(state.position+1);

      if (is_WS_OR_EOL(following) ||
          withinFlowCollection && is_FLOW_INDICATOR(following)) {
        break;
      }

    } else if (0x23/* # */ === ch) {
      preceding = state.input.charCodeAt(state.position - 1);

      if (is_WS_OR_EOL(preceding)) {
        break;
      }

    } else if ((state.position === state.lineStart && testDocumentSeparator(state)) ||
               withinFlowCollection && is_FLOW_INDICATOR(ch)) {
      break;

    } else if (is_EOL(ch)) {
      _line = state.line;
      _lineStart = state.lineStart;
      _lineIndent = state.lineIndent;
      skipSeparationSpace(state, false, -1);

      if (state.lineIndent >= nodeIndent) {
        hasPendingContent = true;
        ch = state.input.charCodeAt(state.position);
        continue;
      } else {
        state.position = captureEnd;
        state.line = _line;
        state.lineStart = _lineStart;
        state.lineIndent = _lineIndent;
        break;
      }
    }

    if (hasPendingContent) {
      captureSegment(state, captureStart, captureEnd, false);
      writeFoldedLines(state, state.line - _line);
      captureStart = captureEnd = state.position;
      hasPendingContent = false;
    }

    if (!is_WHITE_SPACE(ch)) {
      captureEnd = state.position + 1;
    }

    ch = state.input.charCodeAt(++state.position);
  }

  captureSegment(state, captureStart, captureEnd, false);

  if (state.result) {
    return true;
  } else {
    state.kind = _kind;
    state.result = _result;
    return false;
  }
}

function readSingleQuotedScalar(state, nodeIndent) {
  var ch,
      captureStart, captureEnd;

  ch = state.input.charCodeAt(state.position);

  if (0x27/* ' */ !== ch) {
    return false;
  }

  state.kind = 'scalar';
  state.result = '';
  state.position++;
  captureStart = captureEnd = state.position;

  while (0 !== (ch = state.input.charCodeAt(state.position))) {
    if (0x27/* ' */ === ch) {
      captureSegment(state, captureStart, state.position, true);
      ch = state.input.charCodeAt(++state.position);

      if (0x27/* ' */ === ch) {
        captureStart = captureEnd = state.position;
        state.position++;
      } else {
        return true;
      }

    } else if (is_EOL(ch)) {
      captureSegment(state, captureStart, captureEnd, true);
      writeFoldedLines(state, skipSeparationSpace(state, false, nodeIndent));
      captureStart = captureEnd = state.position;

    } else if (state.position === state.lineStart && testDocumentSeparator(state)) {
      throwError(state, 'unexpected end of the document within a single quoted scalar');

    } else {
      state.position++;
      captureEnd = state.position;
    }
  }

  throwError(state, 'unexpected end of the stream within a single quoted scalar');
}

function readDoubleQuotedScalar(state, nodeIndent) {
  var captureStart,
      captureEnd,
      hexLength,
      hexResult,
      tmp, tmpEsc,
      ch;

  ch = state.input.charCodeAt(state.position);

  if (0x22/* " */ !== ch) {
    return false;
  }

  state.kind = 'scalar';
  state.result = '';
  state.position++;
  captureStart = captureEnd = state.position;

  while (0 !== (ch = state.input.charCodeAt(state.position))) {
    if (0x22/* " */ === ch) {
      captureSegment(state, captureStart, state.position, true);
      state.position++;
      return true;

    } else if (0x5C/* \ */ === ch) {
      captureSegment(state, captureStart, state.position, true);
      ch = state.input.charCodeAt(++state.position);

      if (is_EOL(ch)) {
        skipSeparationSpace(state, false, nodeIndent);

        //TODO: rework to inline fn with no type cast?
      } else if (ch < 256 && simpleEscapeCheck[ch]) {
        state.result += simpleEscapeMap[ch];
        state.position++;

      } else if ((tmp = escapedHexLen(ch)) > 0) {
        hexLength = tmp;
        hexResult = 0;

        for (; hexLength > 0; hexLength--) {
          ch = state.input.charCodeAt(++state.position);

          if ((tmp = fromHexCode(ch)) >= 0) {
            hexResult = (hexResult << 4) + tmp;

          } else {
            throwError(state, 'expected hexadecimal character');
          }
        }

        state.result += String.fromCharCode(hexResult);
        state.position++;

      } else {
        throwError(state, 'unknown escape sequence');
      }

      captureStart = captureEnd = state.position;

    } else if (is_EOL(ch)) {
      captureSegment(state, captureStart, captureEnd, true);
      writeFoldedLines(state, skipSeparationSpace(state, false, nodeIndent));
      captureStart = captureEnd = state.position;

    } else if (state.position === state.lineStart && testDocumentSeparator(state)) {
      throwError(state, 'unexpected end of the document within a double quoted scalar');

    } else {
      state.position++;
      captureEnd = state.position;
    }
  }

  throwError(state, 'unexpected end of the stream within a double quoted scalar');
}

function readFlowCollection(state, nodeIndent) {
  var readNext = true,
      _line,
      _tag     = state.tag,
      _result,
      following,
      terminator,
      isPair,
      isExplicitPair,
      isMapping,
      keyNode,
      keyTag,
      valueNode,
      ch;

  ch = state.input.charCodeAt(state.position);

  if (ch === 0x5B/* [ */) {
    terminator = 0x5D/* ] */;
    isMapping = false;
    _result = [];
  } else if (ch === 0x7B/* { */) {
    terminator = 0x7D/* } */;
    isMapping = true;
    _result = {};
  } else {
    return false;
  }

  if (null !== state.anchor) {
    state.anchorMap[state.anchor] = _result;
  }

  ch = state.input.charCodeAt(++state.position);

  while (0 !== ch) {
    skipSeparationSpace(state, true, nodeIndent);

    ch = state.input.charCodeAt(state.position);

    if (ch === terminator) {
      state.position++;
      state.tag = _tag;
      state.kind = isMapping ? 'mapping' : 'sequence';
      state.result = _result;
      return true;
    } else if (!readNext) {
      throwError(state, 'missed comma between flow collection entries');
    }

    keyTag = keyNode = valueNode = null;
    isPair = isExplicitPair = false;

    if (0x3F/* ? */ === ch) {
      following = state.input.charCodeAt(state.position + 1);

      if (is_WS_OR_EOL(following)) {
        isPair = isExplicitPair = true;
        state.position++;
        skipSeparationSpace(state, true, nodeIndent);
      }
    }

    _line = state.line;
    composeNode(state, nodeIndent, CONTEXT_FLOW_IN, false, true);
    keyTag = state.tag;
    keyNode = state.result;
    skipSeparationSpace(state, true, nodeIndent);

    ch = state.input.charCodeAt(state.position);

    if ((isExplicitPair || state.line === _line) && 0x3A/* : */ === ch) {
      isPair = true;
      ch = state.input.charCodeAt(++state.position);
      skipSeparationSpace(state, true, nodeIndent);
      composeNode(state, nodeIndent, CONTEXT_FLOW_IN, false, true);
      valueNode = state.result;
    }

    if (isMapping) {
      storeMappingPair(state, _result, keyTag, keyNode, valueNode);
    } else if (isPair) {
      _result.push(storeMappingPair(state, null, keyTag, keyNode, valueNode));
    } else {
      _result.push(keyNode);
    }

    skipSeparationSpace(state, true, nodeIndent);

    ch = state.input.charCodeAt(state.position);

    if (0x2C/* , */ === ch) {
      readNext = true;
      ch = state.input.charCodeAt(++state.position);
    } else {
      readNext = false;
    }
  }

  throwError(state, 'unexpected end of the stream within a flow collection');
}

function readBlockScalar(state, nodeIndent) {
  var captureStart,
      folding,
      chomping       = CHOMPING_CLIP,
      detectedIndent = false,
      textIndent     = nodeIndent,
      emptyLines     = 0,
      atMoreIndented = false,
      tmp,
      ch;

  ch = state.input.charCodeAt(state.position);

  if (ch === 0x7C/* | */) {
    folding = false;
  } else if (ch === 0x3E/* > */) {
    folding = true;
  } else {
    return false;
  }

  state.kind = 'scalar';
  state.result = '';

  while (0 !== ch) {
    ch = state.input.charCodeAt(++state.position);

    if (0x2B/* + */ === ch || 0x2D/* - */ === ch) {
      if (CHOMPING_CLIP === chomping) {
        chomping = (0x2B/* + */ === ch) ? CHOMPING_KEEP : CHOMPING_STRIP;
      } else {
        throwError(state, 'repeat of a chomping mode identifier');
      }

    } else if ((tmp = fromDecimalCode(ch)) >= 0) {
      if (tmp === 0) {
        throwError(state, 'bad explicit indentation width of a block scalar; it cannot be less than one');
      } else if (!detectedIndent) {
        textIndent = nodeIndent + tmp - 1;
        detectedIndent = true;
      } else {
        throwError(state, 'repeat of an indentation width identifier');
      }

    } else {
      break;
    }
  }

  if (is_WHITE_SPACE(ch)) {
    do { ch = state.input.charCodeAt(++state.position); }
    while (is_WHITE_SPACE(ch));

    if (0x23/* # */ === ch) {
      do { ch = state.input.charCodeAt(++state.position); }
      while (!is_EOL(ch) && (0 !== ch));
    }
  }

  while (0 !== ch) {
    readLineBreak(state);
    state.lineIndent = 0;

    ch = state.input.charCodeAt(state.position);

    while ((!detectedIndent || state.lineIndent < textIndent) &&
           (0x20/* Space */ === ch)) {
      state.lineIndent++;
      ch = state.input.charCodeAt(++state.position);
    }

    if (!detectedIndent && state.lineIndent > textIndent) {
      textIndent = state.lineIndent;
    }

    if (is_EOL(ch)) {
      emptyLines++;
      continue;
    }

    // End of the scalar.
    if (state.lineIndent < textIndent) {

      // Perform the chomping.
      if (chomping === CHOMPING_KEEP) {
        state.result += common.repeat('\n', emptyLines);
      } else if (chomping === CHOMPING_CLIP) {
        if (detectedIndent) { // i.e. only if the scalar is not empty.
          state.result += '\n';
        }
      }

      // Break this `while` cycle and go to the funciton's epilogue.
      break;
    }

    // Folded style: use fancy rules to handle line breaks.
    if (folding) {

      // Lines starting with white space characters (more-indented lines) are not folded.
      if (is_WHITE_SPACE(ch)) {
        atMoreIndented = true;
        state.result += common.repeat('\n', emptyLines + 1);

      // End of more-indented block.
      } else if (atMoreIndented) {
        atMoreIndented = false;
        state.result += common.repeat('\n', emptyLines + 1);

      // Just one line break - perceive as the same line.
      } else if (0 === emptyLines) {
        if (detectedIndent) { // i.e. only if we have already read some scalar content.
          state.result += ' ';
        }

      // Several line breaks - perceive as different lines.
      } else {
        state.result += common.repeat('\n', emptyLines);
      }

    // Literal style: just add exact number of line breaks between content lines.
    } else {

      // If current line isn't the first one - count line break from the last content line.
      if (detectedIndent) {
        state.result += common.repeat('\n', emptyLines + 1);

      // In case of the first content line - count only empty lines.
      } else {
        state.result += common.repeat('\n', emptyLines);
      }
    }

    detectedIndent = true;
    emptyLines = 0;
    captureStart = state.position;

    do { ch = state.input.charCodeAt(++state.position); }
    while (!is_EOL(ch) && (0 !== ch));

    captureSegment(state, captureStart, state.position, false);

    ch = state.input.charCodeAt(state.position);
  }

  return true;
}

function readBlockSequence(state, nodeIndent) {
  var _line,
      _tag      = state.tag,
      _result   = [],
      following,
      detected  = false,
      ch;

  if (null !== state.anchor) {
    state.anchorMap[state.anchor] = _result;
  }

  ch = state.input.charCodeAt(state.position);

  while (0 !== ch) {

    if (0x2D/* - */ !== ch) {
      break;
    }

    following = state.input.charCodeAt(state.position + 1);

    if (!is_WS_OR_EOL(following)) {
      break;
    }

    detected = true;
    state.position++;

    if (skipSeparationSpace(state, true, -1)) {
      if (state.lineIndent <= nodeIndent) {
        _result.push(null);
        ch = state.input.charCodeAt(state.position);
        continue;
      }
    }

    _line = state.line;
    composeNode(state, nodeIndent, CONTEXT_BLOCK_IN, false, true);
    _result.push(state.result);
    skipSeparationSpace(state, true, -1);

    ch = state.input.charCodeAt(state.position);

    if ((state.line === _line || state.lineIndent > nodeIndent) && (0 !== ch)) {
      throwError(state, 'bad indentation of a sequence entry');
    } else if (state.lineIndent < nodeIndent) {
      break;
    }
  }

  if (detected) {
    state.tag = _tag;
    state.kind = 'sequence';
    state.result = _result;
    return true;
  } else {
    return false;
  }
}

function readBlockMapping(state, nodeIndent, flowIndent) {
  var following,
      allowCompact,
      _line,
      _tag          = state.tag,
      _result       = {},
      keyTag        = null,
      keyNode       = null,
      valueNode     = null,
      atExplicitKey = false,
      detected      = false,
      ch;

  if (null !== state.anchor) {
    state.anchorMap[state.anchor] = _result;
  }

  ch = state.input.charCodeAt(state.position);

  while (0 !== ch) {
    following = state.input.charCodeAt(state.position + 1);
    _line = state.line; // Save the current line.

    //
    // Explicit notation case. There are two separate blocks:
    // first for the key (denoted by "?") and second for the value (denoted by ":")
    //
    if ((0x3F/* ? */ === ch || 0x3A/* : */  === ch) && is_WS_OR_EOL(following)) {

      if (0x3F/* ? */ === ch) {
        if (atExplicitKey) {
          storeMappingPair(state, _result, keyTag, keyNode, null);
          keyTag = keyNode = valueNode = null;
        }

        detected = true;
        atExplicitKey = true;
        allowCompact = true;

      } else if (atExplicitKey) {
        // i.e. 0x3A/* : */ === character after the explicit key.
        atExplicitKey = false;
        allowCompact = true;

      } else {
        throwError(state, 'incomplete explicit mapping pair; a key node is missed');
      }

      state.position += 1;
      ch = following;

    //
    // Implicit notation case. Flow-style node as the key first, then ":", and the value.
    //
    } else if (composeNode(state, flowIndent, CONTEXT_FLOW_OUT, false, true)) {

      if (state.line === _line) {
        ch = state.input.charCodeAt(state.position);

        while (is_WHITE_SPACE(ch)) {
          ch = state.input.charCodeAt(++state.position);
        }

        if (0x3A/* : */ === ch) {
          ch = state.input.charCodeAt(++state.position);

          if (!is_WS_OR_EOL(ch)) {
            throwError(state, 'a whitespace character is expected after the key-value separator within a block mapping');
          }

          if (atExplicitKey) {
            storeMappingPair(state, _result, keyTag, keyNode, null);
            keyTag = keyNode = valueNode = null;
          }

          detected = true;
          atExplicitKey = false;
          allowCompact = false;
          keyTag = state.tag;
          keyNode = state.result;

        } else if (detected) {
          throwError(state, 'can not read an implicit mapping pair; a colon is missed');

        } else {
          state.tag = _tag;
          return true; // Keep the result of `composeNode`.
        }

      } else if (detected) {
        throwError(state, 'can not read a block mapping entry; a multiline key may not be an implicit key');

      } else {
        state.tag = _tag;
        return true; // Keep the result of `composeNode`.
      }

    } else {
      break; // Reading is done. Go to the epilogue.
    }

    //
    // Common reading code for both explicit and implicit notations.
    //
    if (state.line === _line || state.lineIndent > nodeIndent) {
      if (composeNode(state, nodeIndent, CONTEXT_BLOCK_OUT, true, allowCompact)) {
        if (atExplicitKey) {
          keyNode = state.result;
        } else {
          valueNode = state.result;
        }
      }

      if (!atExplicitKey) {
        storeMappingPair(state, _result, keyTag, keyNode, valueNode);
        keyTag = keyNode = valueNode = null;
      }

      skipSeparationSpace(state, true, -1);
      ch = state.input.charCodeAt(state.position);
    }

    if (state.lineIndent > nodeIndent && (0 !== ch)) {
      throwError(state, 'bad indentation of a mapping entry');
    } else if (state.lineIndent < nodeIndent) {
      break;
    }
  }

  //
  // Epilogue.
  //

  // Special case: last mapping's node contains only the key in explicit notation.
  if (atExplicitKey) {
    storeMappingPair(state, _result, keyTag, keyNode, null);
  }

  // Expose the resulting mapping.
  if (detected) {
    state.tag = _tag;
    state.kind = 'mapping';
    state.result = _result;
  }

  return detected;
}

function readTagProperty(state) {
  var _position,
      isVerbatim = false,
      isNamed    = false,
      tagHandle,
      tagName,
      ch;

  ch = state.input.charCodeAt(state.position);

  if (0x21/* ! */ !== ch) {
    return false;
  }

  if (null !== state.tag) {
    throwError(state, 'duplication of a tag property');
  }

  ch = state.input.charCodeAt(++state.position);

  if (0x3C/* < */ === ch) {
    isVerbatim = true;
    ch = state.input.charCodeAt(++state.position);

  } else if (0x21/* ! */ === ch) {
    isNamed = true;
    tagHandle = '!!';
    ch = state.input.charCodeAt(++state.position);

  } else {
    tagHandle = '!';
  }

  _position = state.position;

  if (isVerbatim) {
    do { ch = state.input.charCodeAt(++state.position); }
    while (0 !== ch && 0x3E/* > */ !== ch);

    if (state.position < state.length) {
      tagName = state.input.slice(_position, state.position);
      ch = state.input.charCodeAt(++state.position);
    } else {
      throwError(state, 'unexpected end of the stream within a verbatim tag');
    }
  } else {
    while (0 !== ch && !is_WS_OR_EOL(ch)) {

      if (0x21/* ! */ === ch) {
        if (!isNamed) {
          tagHandle = state.input.slice(_position - 1, state.position + 1);

          if (!PATTERN_TAG_HANDLE.test(tagHandle)) {
            throwError(state, 'named tag handle cannot contain such characters');
          }

          isNamed = true;
          _position = state.position + 1;
        } else {
          throwError(state, 'tag suffix cannot contain exclamation marks');
        }
      }

      ch = state.input.charCodeAt(++state.position);
    }

    tagName = state.input.slice(_position, state.position);

    if (PATTERN_FLOW_INDICATORS.test(tagName)) {
      throwError(state, 'tag suffix cannot contain flow indicator characters');
    }
  }

  if (tagName && !PATTERN_TAG_URI.test(tagName)) {
    throwError(state, 'tag name cannot contain such characters: ' + tagName);
  }

  if (isVerbatim) {
    state.tag = tagName;

  } else if (_hasOwnProperty.call(state.tagMap, tagHandle)) {
    state.tag = state.tagMap[tagHandle] + tagName;

  } else if ('!' === tagHandle) {
    state.tag = '!' + tagName;

  } else if ('!!' === tagHandle) {
    state.tag = 'tag:yaml.org,2002:' + tagName;

  } else {
    throwError(state, 'undeclared tag handle "' + tagHandle + '"');
  }

  return true;
}

function readAnchorProperty(state) {
  var _position,
      ch;

  ch = state.input.charCodeAt(state.position);

  if (0x26/* & */ !== ch) {
    return false;
  }

  if (null !== state.anchor) {
    throwError(state, 'duplication of an anchor property');
  }

  ch = state.input.charCodeAt(++state.position);
  _position = state.position;

  while (0 !== ch && !is_WS_OR_EOL(ch) && !is_FLOW_INDICATOR(ch)) {
    ch = state.input.charCodeAt(++state.position);
  }

  if (state.position === _position) {
    throwError(state, 'name of an anchor node must contain at least one character');
  }

  state.anchor = state.input.slice(_position, state.position);
  return true;
}

function readAlias(state) {
  var _position, alias,
      len = state.length,
      input = state.input,
      ch;

  ch = state.input.charCodeAt(state.position);

  if (0x2A/* * */ !== ch) {
    return false;
  }

  ch = state.input.charCodeAt(++state.position);
  _position = state.position;

  while (0 !== ch && !is_WS_OR_EOL(ch) && !is_FLOW_INDICATOR(ch)) {
    ch = state.input.charCodeAt(++state.position);
  }

  if (state.position === _position) {
    throwError(state, 'name of an alias node must contain at least one character');
  }

  alias = state.input.slice(_position, state.position);

  if (!state.anchorMap.hasOwnProperty(alias)) {
    throwError(state, 'unidentified alias "' + alias + '"');
  }

  state.result = state.anchorMap[alias];
  skipSeparationSpace(state, true, -1);
  return true;
}

function composeNode(state, parentIndent, nodeContext, allowToSeek, allowCompact) {
  var allowBlockStyles,
      allowBlockScalars,
      allowBlockCollections,
      atNewLine  = false,
      isIndented = true,
      hasContent = false,
      typeIndex,
      typeQuantity,
      type,
      flowIndent,
      blockIndent,
      _result;

  state.tag    = null;
  state.anchor = null;
  state.kind   = null;
  state.result = null;

  allowBlockStyles = allowBlockScalars = allowBlockCollections =
    CONTEXT_BLOCK_OUT === nodeContext ||
    CONTEXT_BLOCK_IN  === nodeContext;

  if (allowToSeek) {
    if (skipSeparationSpace(state, true, -1)) {
      atNewLine = true;

      if (state.lineIndent === parentIndent) {
        isIndented = false;

      } else if (state.lineIndent > parentIndent) {
        isIndented = true;

      } else {
        return false;
      }
    }
  }

  if (isIndented) {
    while (readTagProperty(state) || readAnchorProperty(state)) {
      if (skipSeparationSpace(state, true, -1)) {
        atNewLine = true;

        if (state.lineIndent > parentIndent) {
          isIndented = true;
          allowBlockCollections = allowBlockStyles;

        } else if (state.lineIndent === parentIndent) {
          isIndented = false;
          allowBlockCollections = allowBlockStyles;

        } else {
          return true;
        }
      } else {
        allowBlockCollections = false;
      }
    }
  }

  if (allowBlockCollections) {
    allowBlockCollections = atNewLine || allowCompact;
  }

  if (isIndented || CONTEXT_BLOCK_OUT === nodeContext) {
    if (CONTEXT_FLOW_IN === nodeContext || CONTEXT_FLOW_OUT === nodeContext) {
      flowIndent = parentIndent;
    } else {
      flowIndent = parentIndent + 1;
    }

    blockIndent = state.position - state.lineStart;

    if (isIndented) {
      if (allowBlockCollections &&
          (readBlockSequence(state, blockIndent) ||
           readBlockMapping(state, blockIndent, flowIndent)) ||
          readFlowCollection(state, flowIndent)) {
        hasContent = true;
      } else {
        if ((allowBlockScalars && readBlockScalar(state, flowIndent)) ||
            readSingleQuotedScalar(state, flowIndent) ||
            readDoubleQuotedScalar(state, flowIndent)) {
          hasContent = true;

        } else if (readAlias(state)) {
          hasContent = true;

          if (null !== state.tag || null !== state.anchor) {
            throwError(state, 'alias node should not have any properties');
          }

        } else if (readPlainScalar(state, flowIndent, CONTEXT_FLOW_IN === nodeContext)) {
          hasContent = true;

          if (null === state.tag) {
            state.tag = '?';
          }
        }

        if (null !== state.anchor) {
          state.anchorMap[state.anchor] = state.result;
        }
      }
    } else {
      hasContent = allowBlockCollections && readBlockSequence(state, blockIndent);
    }
  }

  if (null !== state.tag && '!' !== state.tag) {
    if ('?' === state.tag) {
      for (typeIndex = 0, typeQuantity = state.implicitTypes.length;
           typeIndex < typeQuantity;
           typeIndex += 1) {
        type = state.implicitTypes[typeIndex];

        // Implicit resolving is not allowed for non-scalar types, and '?'
        // non-specific tag is only assigned to plain scalars. So, it isn't
        // needed to check for 'kind' conformity.

        if (type.resolve(state.result)) { // `state.result` updated in resolver if matched
          state.result = type.construct(state.result);
          state.tag = type.tag;
          break;
        }
      }
    } else if (_hasOwnProperty.call(state.typeMap, state.tag)) {
      type = state.typeMap[state.tag];

      if (null !== state.result && type.kind !== state.kind) {
        throwError(state, 'unacceptable node kind for !<' + state.tag + '> tag; it should be "' + type.kind + '", not "' + state.kind + '"');
      }

      if (!type.resolve(state.result)) { // `state.result` updated in resolver if matched
        throwError(state, 'cannot resolve a node with !<' + state.tag + '> explicit tag');
      } else {
        state.result = type.construct(state.result);
      }
    } else {
      throwWarning(state, 'unknown tag !<' + state.tag + '>');
    }
  }

  return null !== state.tag || null !== state.anchor || hasContent;
}

function readDocument(state) {
  var documentStart = state.position,
      _position,
      directiveName,
      directiveArgs,
      hasDirectives = false,
      ch;

  state.version = null;
  state.checkLineBreaks = state.legacy;
  state.tagMap = {};
  state.anchorMap = {};

  while (0 !== (ch = state.input.charCodeAt(state.position))) {
    skipSeparationSpace(state, true, -1);

    ch = state.input.charCodeAt(state.position);

    if (state.lineIndent > 0 || 0x25/* % */ !== ch) {
      break;
    }

    hasDirectives = true;
    ch = state.input.charCodeAt(++state.position);
    _position = state.position;

    while (0 !== ch && !is_WS_OR_EOL(ch)) {
      ch = state.input.charCodeAt(++state.position);
    }

    directiveName = state.input.slice(_position, state.position);
    directiveArgs = [];

    if (directiveName.length < 1) {
      throwError(state, 'directive name must not be less than one character in length');
    }

    while (0 !== ch) {
      while (is_WHITE_SPACE(ch)) {
        ch = state.input.charCodeAt(++state.position);
      }

      if (0x23/* # */ === ch) {
        do { ch = state.input.charCodeAt(++state.position); }
        while (0 !== ch && !is_EOL(ch));
        break;
      }

      if (is_EOL(ch)) {
        break;
      }

      _position = state.position;

      while (0 !== ch && !is_WS_OR_EOL(ch)) {
        ch = state.input.charCodeAt(++state.position);
      }

      directiveArgs.push(state.input.slice(_position, state.position));
    }

    if (0 !== ch) {
      readLineBreak(state);
    }

    if (_hasOwnProperty.call(directiveHandlers, directiveName)) {
      directiveHandlers[directiveName](state, directiveName, directiveArgs);
    } else {
      throwWarning(state, 'unknown document directive "' + directiveName + '"');
    }
  }

  skipSeparationSpace(state, true, -1);

  if (0 === state.lineIndent &&
      0x2D/* - */ === state.input.charCodeAt(state.position) &&
      0x2D/* - */ === state.input.charCodeAt(state.position + 1) &&
      0x2D/* - */ === state.input.charCodeAt(state.position + 2)) {
    state.position += 3;
    skipSeparationSpace(state, true, -1);

  } else if (hasDirectives) {
    throwError(state, 'directives end mark is expected');
  }

  composeNode(state, state.lineIndent - 1, CONTEXT_BLOCK_OUT, false, true);
  skipSeparationSpace(state, true, -1);

  if (state.checkLineBreaks &&
      PATTERN_NON_ASCII_LINE_BREAKS.test(state.input.slice(documentStart, state.position))) {
    throwWarning(state, 'non-ASCII line breaks are interpreted as content');
  }

  state.documents.push(state.result);

  if (state.position === state.lineStart && testDocumentSeparator(state)) {

    if (0x2E/* . */ === state.input.charCodeAt(state.position)) {
      state.position += 3;
      skipSeparationSpace(state, true, -1);
    }
    return;
  }

  if (state.position < (state.length - 1)) {
    throwError(state, 'end of the stream or a document separator is expected');
  } else {
    return;
  }
}


function loadDocuments(input, options) {
  input = String(input);
  options = options || {};

  if (0 !== input.length &&
      0x0A/* LF */ !== input.charCodeAt(input.length - 1) &&
      0x0D/* CR */ !== input.charCodeAt(input.length - 1)) {
    input += '\n';
  }

  var state = new State(input, options);

  if (PATTERN_NON_PRINTABLE.test(state.input)) {
    throwError(state, 'the stream contains non-printable characters');
  }

  // Use 0 as string terminator. That significantly simplifies bounds check.
  state.input += '\0';

  while (0x20/* Space */ === state.input.charCodeAt(state.position)) {
    state.lineIndent += 1;
  }

  while (state.position < (state.length - 1)) {
    readDocument(state);
  }

  return state.documents;
}


function loadAll(input, iterator, options) {
  var documents = loadDocuments(input, options), index, length;

  for (index = 0, length = documents.length; index < length; index += 1) {
    iterator(documents[index]);
  }
}


function load(input, options) {
  var documents = loadDocuments(input, options), index, length;

  if (0 === documents.length) {
    return undefined;
  } else if (1 === documents.length) {
    return documents[0];
  } else {
    throw new YAMLException('expected a single document in the stream, but found more');
  }
}


function safeLoadAll(input, output, options) {
  loadAll(input, output, common.extend({ schema: DEFAULT_SAFE_SCHEMA }, options));
}


function safeLoad(input, options) {
  return load(input, common.extend({ schema: DEFAULT_SAFE_SCHEMA }, options));
}


module.exports.loadAll     = loadAll;
module.exports.load        = load;
module.exports.safeLoadAll = safeLoadAll;
module.exports.safeLoad    = safeLoad;

},{"./common":3,"./exception":5,"./mark":7,"./schema/default_full":10,"./schema/default_safe":11}],7:[function(_dereq_,module,exports){
'use strict';


var common = _dereq_('./common');


function Mark(name, buffer, position, line, column) {
  this.name     = name;
  this.buffer   = buffer;
  this.position = position;
  this.line     = line;
  this.column   = column;
}


Mark.prototype.getSnippet = function getSnippet(indent, maxLength) {
  var head, start, tail, end, snippet;

  if (!this.buffer) {
    return null;
  }

  indent = indent || 4;
  maxLength = maxLength || 75;

  head = '';
  start = this.position;

  while (start > 0 && -1 === '\x00\r\n\x85\u2028\u2029'.indexOf(this.buffer.charAt(start - 1))) {
    start -= 1;
    if (this.position - start > (maxLength / 2 - 1)) {
      head = ' ... ';
      start += 5;
      break;
    }
  }

  tail = '';
  end = this.position;

  while (end < this.buffer.length && -1 === '\x00\r\n\x85\u2028\u2029'.indexOf(this.buffer.charAt(end))) {
    end += 1;
    if (end - this.position > (maxLength / 2 - 1)) {
      tail = ' ... ';
      end -= 5;
      break;
    }
  }

  snippet = this.buffer.slice(start, end);

  return common.repeat(' ', indent) + head + snippet + tail + '\n' +
         common.repeat(' ', indent + this.position - start + head.length) + '^';
};


Mark.prototype.toString = function toString(compact) {
  var snippet, where = '';

  if (this.name) {
    where += 'in "' + this.name + '" ';
  }

  where += 'at line ' + (this.line + 1) + ', column ' + (this.column + 1);

  if (!compact) {
    snippet = this.getSnippet();

    if (snippet) {
      where += ':\n' + snippet;
    }
  }

  return where;
};


module.exports = Mark;

},{"./common":3}],8:[function(_dereq_,module,exports){
'use strict';


var common        = _dereq_('./common');
var YAMLException = _dereq_('./exception');
var Type          = _dereq_('./type');


function compileList(schema, name, result) {
  var exclude = [];

  schema.include.forEach(function (includedSchema) {
    result = compileList(includedSchema, name, result);
  });

  schema[name].forEach(function (currentType) {
    result.forEach(function (previousType, previousIndex) {
      if (previousType.tag === currentType.tag) {
        exclude.push(previousIndex);
      }
    });

    result.push(currentType);
  });

  return result.filter(function (type, index) {
    return -1 === exclude.indexOf(index);
  });
}


function compileMap(/* lists... */) {
  var result = {}, index, length;

  function collectType(type) {
    result[type.tag] = type;
  }

  for (index = 0, length = arguments.length; index < length; index += 1) {
    arguments[index].forEach(collectType);
  }

  return result;
}


function Schema(definition) {
  this.include  = definition.include  || [];
  this.implicit = definition.implicit || [];
  this.explicit = definition.explicit || [];

  this.implicit.forEach(function (type) {
    if (type.loadKind && 'scalar' !== type.loadKind) {
      throw new YAMLException('There is a non-scalar type in the implicit list of a schema. Implicit resolving of such types is not supported.');
    }
  });

  this.compiledImplicit = compileList(this, 'implicit', []);
  this.compiledExplicit = compileList(this, 'explicit', []);
  this.compiledTypeMap  = compileMap(this.compiledImplicit, this.compiledExplicit);
}


Schema.DEFAULT = null;


Schema.create = function createSchema() {
  var schemas, types;

  switch (arguments.length) {
  case 1:
    schemas = Schema.DEFAULT;
    types = arguments[0];
    break;

  case 2:
    schemas = arguments[0];
    types = arguments[1];
    break;

  default:
    throw new YAMLException('Wrong number of arguments for Schema.create function');
  }

  schemas = common.toArray(schemas);
  types = common.toArray(types);

  if (!schemas.every(function (schema) { return schema instanceof Schema; })) {
    throw new YAMLException('Specified list of super schemas (or a single Schema object) contains a non-Schema object.');
  }

  if (!types.every(function (type) { return type instanceof Type; })) {
    throw new YAMLException('Specified list of YAML types (or a single Type object) contains a non-Type object.');
  }

  return new Schema({
    include: schemas,
    explicit: types
  });
};


module.exports = Schema;

},{"./common":3,"./exception":5,"./type":14}],9:[function(_dereq_,module,exports){
// Standard YAML's Core schema.
// http://www.yaml.org/spec/1.2/spec.html#id2804923
//
// NOTE: JS-YAML does not support schema-specific tag resolution restrictions.
// So, Core schema has no distinctions from JSON schema is JS-YAML.


'use strict';


var Schema = _dereq_('../schema');


module.exports = new Schema({
  include: [
    _dereq_('./json')
  ]
});

},{"../schema":8,"./json":13}],10:[function(_dereq_,module,exports){
// JS-YAML's default schema for `load` function.
// It is not described in the YAML specification.
//
// This schema is based on JS-YAML's default safe schema and includes
// JavaScript-specific types: !!js/undefined, !!js/regexp and !!js/function.
//
// Also this schema is used as default base schema at `Schema.create` function.


'use strict';


var Schema = _dereq_('../schema');


module.exports = Schema.DEFAULT = new Schema({
  include: [
    _dereq_('./default_safe')
  ],
  explicit: [
    _dereq_('../type/js/undefined'),
    _dereq_('../type/js/regexp'),
    _dereq_('../type/js/function')
  ]
});

},{"../schema":8,"../type/js/function":19,"../type/js/regexp":20,"../type/js/undefined":21,"./default_safe":11}],11:[function(_dereq_,module,exports){
// JS-YAML's default schema for `safeLoad` function.
// It is not described in the YAML specification.
//
// This schema is based on standard YAML's Core schema and includes most of
// extra types described at YAML tag repository. (http://yaml.org/type/)


'use strict';


var Schema = _dereq_('../schema');


module.exports = new Schema({
  include: [
    _dereq_('./core')
  ],
  implicit: [
    _dereq_('../type/timestamp'),
    _dereq_('../type/merge')
  ],
  explicit: [
    _dereq_('../type/binary'),
    _dereq_('../type/omap'),
    _dereq_('../type/pairs'),
    _dereq_('../type/set')
  ]
});

},{"../schema":8,"../type/binary":15,"../type/merge":23,"../type/omap":25,"../type/pairs":26,"../type/set":28,"../type/timestamp":30,"./core":9}],12:[function(_dereq_,module,exports){
// Standard YAML's Failsafe schema.
// http://www.yaml.org/spec/1.2/spec.html#id2802346


'use strict';


var Schema = _dereq_('../schema');


module.exports = new Schema({
  explicit: [
    _dereq_('../type/str'),
    _dereq_('../type/seq'),
    _dereq_('../type/map')
  ]
});

},{"../schema":8,"../type/map":22,"../type/seq":27,"../type/str":29}],13:[function(_dereq_,module,exports){
// Standard YAML's JSON schema.
// http://www.yaml.org/spec/1.2/spec.html#id2803231
//
// NOTE: JS-YAML does not support schema-specific tag resolution restrictions.
// So, this schema is not such strict as defined in the YAML specification.
// It allows numbers in binary notaion, use `Null` and `NULL` as `null`, etc.


'use strict';


var Schema = _dereq_('../schema');


module.exports = new Schema({
  include: [
    _dereq_('./failsafe')
  ],
  implicit: [
    _dereq_('../type/null'),
    _dereq_('../type/bool'),
    _dereq_('../type/int'),
    _dereq_('../type/float')
  ]
});

},{"../schema":8,"../type/bool":16,"../type/float":17,"../type/int":18,"../type/null":24,"./failsafe":12}],14:[function(_dereq_,module,exports){
'use strict';

var YAMLException = _dereq_('./exception');

var TYPE_CONSTRUCTOR_OPTIONS = [
  'kind',
  'resolve',
  'construct',
  'instanceOf',
  'predicate',
  'represent',
  'defaultStyle',
  'styleAliases'
];

var YAML_NODE_KINDS = [
  'scalar',
  'sequence',
  'mapping'
];

function compileStyleAliases(map) {
  var result = {};

  if (null !== map) {
    Object.keys(map).forEach(function (style) {
      map[style].forEach(function (alias) {
        result[String(alias)] = style;
      });
    });
  }

  return result;
}

function Type(tag, options) {
  options = options || {};

  Object.keys(options).forEach(function (name) {
    if (-1 === TYPE_CONSTRUCTOR_OPTIONS.indexOf(name)) {
      throw new YAMLException('Unknown option "' + name + '" is met in definition of "' + tag + '" YAML type.');
    }
  });

  // TODO: Add tag format check.
  this.tag          = tag;
  this.kind         = options['kind']         || null;
  this.resolve      = options['resolve']      || function () { return true; };
  this.construct    = options['construct']    || function (data) { return data; };
  this.instanceOf   = options['instanceOf']   || null;
  this.predicate    = options['predicate']    || null;
  this.represent    = options['represent']    || null;
  this.defaultStyle = options['defaultStyle'] || null;
  this.styleAliases = compileStyleAliases(options['styleAliases'] || null);

  if (-1 === YAML_NODE_KINDS.indexOf(this.kind)) {
    throw new YAMLException('Unknown kind "' + this.kind + '" is specified for "' + tag + '" YAML type.');
  }
}

module.exports = Type;

},{"./exception":5}],15:[function(_dereq_,module,exports){
// Modified from:
// https://raw.github.com/kanaka/noVNC/d890e8640f20fba3215ba7be8e0ff145aeb8c17c/include/base64.js

'use strict';

// A trick for browserified version.
// Since we make browserifier to ignore `buffer` module, NodeBuffer will be undefined
var NodeBuffer = _dereq_('buffer').Buffer;
var Type       = _dereq_('../type');

var BASE64_PADDING = '=';

var BASE64_BINTABLE = [
  -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
  -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
  -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 62, -1, -1, -1, 63,
  52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1, -1, -1,  0, -1, -1,
  -1,  0,  1,  2,  3,  4,  5,  6,  7,  8,  9, 10, 11, 12, 13, 14,
  15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, -1, -1, -1, -1, -1,
  -1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
  41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, -1, -1, -1, -1, -1
];

var BASE64_CHARTABLE =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'.split('');

function resolveYamlBinary(data) {
  var code, idx = 0, len = data.length, leftbits;

  leftbits = 0; // number of bits decoded, but yet to be appended

  // Convert one by one.
  for (idx = 0; idx < len; idx += 1) {
    code = data.charCodeAt(idx);

    // Skip LF(NL) || CR
    if (0x0A === code || 0x0D === code) { continue; }

    // Fail on illegal characters
    if (-1 === BASE64_BINTABLE[code & 0x7F]) {
      return false;
    }

    // update bitcount
    leftbits += 6;

    // If we have 8 or more bits, append 8 bits to the result
    if (leftbits >= 8) {
      leftbits -= 8;
    }
  }

  // If there are any bits left, the base64 string was corrupted
  if (leftbits) {
    return false;
  } else {
    return true;
  }
}

function constructYamlBinary(data) {
  var value, code, idx = 0, len = data.length, result = [], leftbits, leftdata;

  leftbits = 0; // number of bits decoded, but yet to be appended
  leftdata = 0; // bits decoded, but yet to be appended

  // Convert one by one.
  for (idx = 0; idx < len; idx += 1) {
    code = data.charCodeAt(idx);
    value = BASE64_BINTABLE[code & 0x7F];

    // Skip LF(NL) || CR
    if (0x0A === code || 0x0D === code) { continue; }

    // Collect data into leftdata, update bitcount
    leftdata = (leftdata << 6) | value;
    leftbits += 6;

    // If we have 8 or more bits, append 8 bits to the result
    if (leftbits >= 8) {
      leftbits -= 8;

      // Append if not padding.
      if (BASE64_PADDING !== data.charAt(idx)) {
        result.push((leftdata >> leftbits) & 0xFF);
      }

      leftdata &= (1 << leftbits) - 1;
    }
  }

  // Wrap into Buffer for NodeJS and leave Array for browser
  if (NodeBuffer) {
    return new NodeBuffer(result);
  }

  return result;
}

function representYamlBinary(object /*, style*/) {
  var result = '', index, length, rest;

  // Convert every three bytes to 4 ASCII characters.
  for (index = 0, length = object.length - 2; index < length; index += 3) {
    result += BASE64_CHARTABLE[object[index + 0] >> 2];
    result += BASE64_CHARTABLE[((object[index + 0] & 0x03) << 4) + (object[index + 1] >> 4)];
    result += BASE64_CHARTABLE[((object[index + 1] & 0x0F) << 2) + (object[index + 2] >> 6)];
    result += BASE64_CHARTABLE[object[index + 2] & 0x3F];
  }

  rest = object.length % 3;

  // Convert the remaining 1 or 2 bytes, padding out to 4 characters.
  if (0 !== rest) {
    index = object.length - rest;
    result += BASE64_CHARTABLE[object[index + 0] >> 2];

    if (2 === rest) {
      result += BASE64_CHARTABLE[((object[index + 0] & 0x03) << 4) + (object[index + 1] >> 4)];
      result += BASE64_CHARTABLE[(object[index + 1] & 0x0F) << 2];
      result += BASE64_PADDING;
    } else {
      result += BASE64_CHARTABLE[(object[index + 0] & 0x03) << 4];
      result += BASE64_PADDING + BASE64_PADDING;
    }
  }

  return result;
}

function isBinary(object) {
  return NodeBuffer && NodeBuffer.isBuffer(object);
}

module.exports = new Type('tag:yaml.org,2002:binary', {
  kind: 'scalar',
  resolve: resolveYamlBinary,
  construct: constructYamlBinary,
  predicate: isBinary,
  represent: representYamlBinary
});

},{"../type":14,"buffer":31}],16:[function(_dereq_,module,exports){
'use strict';

var Type = _dereq_('../type');

function resolveYamlBoolean(data) {
  var max = data.length;

  return (max === 4 && (data === 'true' || data === 'True' || data === 'TRUE')) ||
         (max === 5 && (data === 'false' || data === 'False' || data === 'FALSE'));
}

function constructYamlBoolean(data) {
  return data === 'true' ||
         data === 'True' ||
         data === 'TRUE';
}

function isBoolean(object) {
  return '[object Boolean]' === Object.prototype.toString.call(object);
}

module.exports = new Type('tag:yaml.org,2002:bool', {
  kind: 'scalar',
  resolve: resolveYamlBoolean,
  construct: constructYamlBoolean,
  predicate: isBoolean,
  represent: {
    lowercase: function (object) { return object ? 'true' : 'false'; },
    uppercase: function (object) { return object ? 'TRUE' : 'FALSE'; },
    camelcase: function (object) { return object ? 'True' : 'False'; }
  },
  defaultStyle: 'lowercase'
});

},{"../type":14}],17:[function(_dereq_,module,exports){
'use strict';

var common = _dereq_('../common');
var Type   = _dereq_('../type');

var YAML_FLOAT_PATTERN = new RegExp(
  '^(?:[-+]?(?:[0-9][0-9_]*)\\.[0-9_]*(?:[eE][-+][0-9]+)?' +
  '|\\.[0-9_]+(?:[eE][-+][0-9]+)?' +
  '|[-+]?[0-9][0-9_]*(?::[0-5]?[0-9])+\\.[0-9_]*' +
  '|[-+]?\\.(?:inf|Inf|INF)' +
  '|\\.(?:nan|NaN|NAN))$');

function resolveYamlFloat(data) {
  var value, sign, base, digits;

  if (!YAML_FLOAT_PATTERN.test(data)) {
    return false;
  }
  return true;
}

function constructYamlFloat(data) {
  var value, sign, base, digits;

  value  = data.replace(/_/g, '').toLowerCase();
  sign   = '-' === value[0] ? -1 : 1;
  digits = [];

  if (0 <= '+-'.indexOf(value[0])) {
    value = value.slice(1);
  }

  if ('.inf' === value) {
    return (1 === sign) ? Number.POSITIVE_INFINITY : Number.NEGATIVE_INFINITY;

  } else if ('.nan' === value) {
    return NaN;

  } else if (0 <= value.indexOf(':')) {
    value.split(':').forEach(function (v) {
      digits.unshift(parseFloat(v, 10));
    });

    value = 0.0;
    base = 1;

    digits.forEach(function (d) {
      value += d * base;
      base *= 60;
    });

    return sign * value;

  } else {
    return sign * parseFloat(value, 10);
  }
}

function representYamlFloat(object, style) {
  if (isNaN(object)) {
    switch (style) {
    case 'lowercase':
      return '.nan';
    case 'uppercase':
      return '.NAN';
    case 'camelcase':
      return '.NaN';
    }
  } else if (Number.POSITIVE_INFINITY === object) {
    switch (style) {
    case 'lowercase':
      return '.inf';
    case 'uppercase':
      return '.INF';
    case 'camelcase':
      return '.Inf';
    }
  } else if (Number.NEGATIVE_INFINITY === object) {
    switch (style) {
    case 'lowercase':
      return '-.inf';
    case 'uppercase':
      return '-.INF';
    case 'camelcase':
      return '-.Inf';
    }
  } else if (common.isNegativeZero(object)) {
    return '-0.0';
  } else {
    return object.toString(10);
  }
}

function isFloat(object) {
  return ('[object Number]' === Object.prototype.toString.call(object)) &&
         (0 !== object % 1 || common.isNegativeZero(object));
}

module.exports = new Type('tag:yaml.org,2002:float', {
  kind: 'scalar',
  resolve: resolveYamlFloat,
  construct: constructYamlFloat,
  predicate: isFloat,
  represent: representYamlFloat,
  defaultStyle: 'lowercase'
});

},{"../common":3,"../type":14}],18:[function(_dereq_,module,exports){
'use strict';

var common = _dereq_('../common');
var Type   = _dereq_('../type');

function isHexCode(c) {
  return ((0x30/* 0 */ <= c) && (c <= 0x39/* 9 */)) ||
         ((0x41/* A */ <= c) && (c <= 0x46/* F */)) ||
         ((0x61/* a */ <= c) && (c <= 0x66/* f */));
}

function isOctCode(c) {
  return ((0x30/* 0 */ <= c) && (c <= 0x37/* 7 */));
}

function isDecCode(c) {
  return ((0x30/* 0 */ <= c) && (c <= 0x39/* 9 */));
}

function resolveYamlInteger(data) {
  var max = data.length,
      index = 0,
      hasDigits = false,
      ch;

  if (!max) { return false; }

  ch = data[index];

  // sign
  if (ch === '-' || ch === '+') {
    ch = data[++index];
  }

  if (ch === '0') {
    // 0
    if (index+1 === max) { return true; }
    ch = data[++index];

    // base 2, base 8, base 16

    if (ch === 'b') {
      // base 2
      index++;

      for (; index < max; index++) {
        ch = data[index];
        if (ch === '_') { continue; }
        if (ch !== '0' && ch !== '1') {
          return false;
        }
        hasDigits = true;
      }
      return hasDigits;
    }


    if (ch === 'x') {
      // base 16
      index++;

      for (; index < max; index++) {
        ch = data[index];
        if (ch === '_') { continue; }
        if (!isHexCode(data.charCodeAt(index))) {
          return false;
        }
        hasDigits = true;
      }
      return hasDigits;
    }

    // base 8
    for (; index < max; index++) {
      ch = data[index];
      if (ch === '_') { continue; }
      if (!isOctCode(data.charCodeAt(index))) {
        return false;
      }
      hasDigits = true;
    }
    return hasDigits;
  }

  // base 10 (except 0) or base 60

  for (; index < max; index++) {
    ch = data[index];
    if (ch === '_') { continue; }
    if (ch === ':') { break; }
    if (!isDecCode(data.charCodeAt(index))) {
      return false;
    }
    hasDigits = true;
  }

  if (!hasDigits) { return false; }

  // if !base60 - done;
  if (ch !== ':') { return true; }

  // base60 almost not used, no needs to optimize
  return /^(:[0-5]?[0-9])+$/.test(data.slice(index));
}

function constructYamlInteger(data) {
  var value = data, sign = 1, ch, base, digits = [];

  if (value.indexOf('_') !== -1) {
    value = value.replace(/_/g, '');
  }

  ch = value[0];

  if (ch === '-' || ch === '+') {
    if (ch === '-') { sign = -1; }
    value = value.slice(1);
    ch = value[0];
  }

  if ('0' === value) {
    return 0;
  }

  if (ch === '0') {
    if (value[1] === 'b') {
      return sign * parseInt(value.slice(2), 2);
    }
    if (value[1] === 'x') {
      return sign * parseInt(value, 16);
    }
    return sign * parseInt(value, 8);

  }

  if (value.indexOf(':') !== -1) {
    value.split(':').forEach(function (v) {
      digits.unshift(parseInt(v, 10));
    });

    value = 0;
    base = 1;

    digits.forEach(function (d) {
      value += (d * base);
      base *= 60;
    });

    return sign * value;

  }

  return sign * parseInt(value, 10);
}

function isInteger(object) {
  return ('[object Number]' === Object.prototype.toString.call(object)) &&
         (0 === object % 1 && !common.isNegativeZero(object));
}

module.exports = new Type('tag:yaml.org,2002:int', {
  kind: 'scalar',
  resolve: resolveYamlInteger,
  construct: constructYamlInteger,
  predicate: isInteger,
  represent: {
    binary:      function (object) { return '0b' + object.toString(2); },
    octal:       function (object) { return '0'  + object.toString(8); },
    decimal:     function (object) { return        object.toString(10); },
    hexadecimal: function (object) { return '0x' + object.toString(16).toUpperCase(); }
  },
  defaultStyle: 'decimal',
  styleAliases: {
    binary:      [ 2,  'bin' ],
    octal:       [ 8,  'oct' ],
    decimal:     [ 10, 'dec' ],
    hexadecimal: [ 16, 'hex' ]
  }
});

},{"../common":3,"../type":14}],19:[function(_dereq_,module,exports){
'use strict';

var esprima;

// Browserified version does not have esprima
//
// 1. For node.js just require module as deps
// 2. For browser try to require mudule via external AMD system.
//    If not found - try to fallback to window.esprima. If not
//    found too - then fail to parse.
//
try {
  esprima = _dereq_('esprima');
} catch (_) {
  /*global window */
  if (typeof window !== 'undefined') { esprima = window.esprima; }
}

var Type = _dereq_('../../type');

function resolveJavascriptFunction(data) {
  try {
    var source = '(' + data + ')',
        ast    = esprima.parse(source, { range: true }),
        params = [],
        body;

    if ('Program'             !== ast.type         ||
        1                     !== ast.body.length  ||
        'ExpressionStatement' !== ast.body[0].type ||
        'FunctionExpression'  !== ast.body[0].expression.type) {
      return false;
    }

    return true;
  } catch (err) {
    return false;
  }
}

function constructJavascriptFunction(data) {
  /*jslint evil:true*/

  var source = '(' + data + ')',
      ast    = esprima.parse(source, { range: true }),
      params = [],
      body;

  if ('Program'             !== ast.type         ||
      1                     !== ast.body.length  ||
      'ExpressionStatement' !== ast.body[0].type ||
      'FunctionExpression'  !== ast.body[0].expression.type) {
    throw new Error('Failed to resolve function');
  }

  ast.body[0].expression.params.forEach(function (param) {
    params.push(param.name);
  });

  body = ast.body[0].expression.body.range;

  // Esprima's ranges include the first '{' and the last '}' characters on
  // function expressions. So cut them out.
  return new Function(params, source.slice(body[0]+1, body[1]-1));
}

function representJavascriptFunction(object /*, style*/) {
  return object.toString();
}

function isFunction(object) {
  return '[object Function]' === Object.prototype.toString.call(object);
}

module.exports = new Type('tag:yaml.org,2002:js/function', {
  kind: 'scalar',
  resolve: resolveJavascriptFunction,
  construct: constructJavascriptFunction,
  predicate: isFunction,
  represent: representJavascriptFunction
});

},{"../../type":14,"esprima":"Lkr711"}],20:[function(_dereq_,module,exports){
'use strict';

var Type = _dereq_('../../type');

function resolveJavascriptRegExp(data) {
  var regexp = data,
      tail   = /\/([gim]*)$/.exec(data),
      modifiers = '';

  // if regexp starts with '/' it can have modifiers and must be properly closed
  // `/foo/gim` - modifiers tail can be maximum 3 chars
  if ('/' === regexp[0]) {
    if (tail) {
      modifiers = tail[1];
    }

    if (modifiers.length > 3) { return false; }
    // if expression starts with /, is should be properly terminated
    if (regexp[regexp.length - modifiers.length - 1] !== '/') { return false; }

    regexp = regexp.slice(1, regexp.length - modifiers.length - 1);
  }

  try {
    var dummy = new RegExp(regexp, modifiers);
    return true;
  } catch (error) {
    return false;
  }
}

function constructJavascriptRegExp(data) {
  var regexp = data,
      tail   = /\/([gim]*)$/.exec(data),
      modifiers = '';

  // `/foo/gim` - tail can be maximum 4 chars
  if ('/' === regexp[0]) {
    if (tail) {
      modifiers = tail[1];
    }
    regexp = regexp.slice(1, regexp.length - modifiers.length - 1);
  }

  return new RegExp(regexp, modifiers);
}

function representJavascriptRegExp(object /*, style*/) {
  var result = '/' + object.source + '/';

  if (object.global) {
    result += 'g';
  }

  if (object.multiline) {
    result += 'm';
  }

  if (object.ignoreCase) {
    result += 'i';
  }

  return result;
}

function isRegExp(object) {
  return '[object RegExp]' === Object.prototype.toString.call(object);
}

module.exports = new Type('tag:yaml.org,2002:js/regexp', {
  kind: 'scalar',
  resolve: resolveJavascriptRegExp,
  construct: constructJavascriptRegExp,
  predicate: isRegExp,
  represent: representJavascriptRegExp
});

},{"../../type":14}],21:[function(_dereq_,module,exports){
'use strict';

var Type = _dereq_('../../type');

function resolveJavascriptUndefined() {
  return true;
}

function constructJavascriptUndefined() {
  return undefined;
}

function representJavascriptUndefined() {
  return '';
}

function isUndefined(object) {
  return 'undefined' === typeof object;
}

module.exports = new Type('tag:yaml.org,2002:js/undefined', {
  kind: 'scalar',
  resolve: resolveJavascriptUndefined,
  construct: constructJavascriptUndefined,
  predicate: isUndefined,
  represent: representJavascriptUndefined
});

},{"../../type":14}],22:[function(_dereq_,module,exports){
'use strict';

var Type = _dereq_('../type');

module.exports = new Type('tag:yaml.org,2002:map', {
  kind: 'mapping'
});

},{"../type":14}],23:[function(_dereq_,module,exports){
'use strict';

var Type = _dereq_('../type');

function resolveYamlMerge(data) {
  return '<<' === data;
}

module.exports = new Type('tag:yaml.org,2002:merge', {
  kind: 'scalar',
  resolve: resolveYamlMerge,
});

},{"../type":14}],24:[function(_dereq_,module,exports){
'use strict';

var Type = _dereq_('../type');

function resolveYamlNull(data) {
  var max = data.length;

  return (max === 1 && data === '~') ||
         (max === 4 && (data === 'null' || data === 'Null' || data === 'NULL'));
}

function constructYamlNull() {
  return null;
}

function isNull(object) {
  return null === object;
}

module.exports = new Type('tag:yaml.org,2002:null', {
  kind: 'scalar',
  resolve: resolveYamlNull,
  construct: constructYamlNull,
  predicate: isNull,
  represent: {
    canonical: function () { return '~';    },
    lowercase: function () { return 'null'; },
    uppercase: function () { return 'NULL'; },
    camelcase: function () { return 'Null'; }
  },
  defaultStyle: 'lowercase'
});

},{"../type":14}],25:[function(_dereq_,module,exports){
'use strict';

var Type = _dereq_('../type');

var _hasOwnProperty = Object.prototype.hasOwnProperty;
var _toString       = Object.prototype.toString;

function resolveYamlOmap(data) {
  var objectKeys = [], index, length, pair, pairKey, pairHasKey,
      object = data;

  for (index = 0, length = object.length; index < length; index += 1) {
    pair = object[index];
    pairHasKey = false;

    if ('[object Object]' !== _toString.call(pair)) {
      return false;
    }

    for (pairKey in pair) {
      if (_hasOwnProperty.call(pair, pairKey)) {
        if (!pairHasKey) {
          pairHasKey = true;
        } else {
          return false;
        }
      }
    }

    if (!pairHasKey) {
      return false;
    }

    if (-1 === objectKeys.indexOf(pairKey)) {
      objectKeys.push(pairKey);
    } else {
      return false;
    }
  }

  return true;
}

module.exports = new Type('tag:yaml.org,2002:omap', {
  kind: 'sequence',
  resolve: resolveYamlOmap
});

},{"../type":14}],26:[function(_dereq_,module,exports){
'use strict';

var Type = _dereq_('../type');

var _toString = Object.prototype.toString;

function resolveYamlPairs(data) {
  var index, length, pair, keys, result,
      object = data;

  result = new Array(object.length);

  for (index = 0, length = object.length; index < length; index += 1) {
    pair = object[index];

    if ('[object Object]' !== _toString.call(pair)) {
      return false;
    }

    keys = Object.keys(pair);

    if (1 !== keys.length) {
      return false;
    }

    result[index] = [ keys[0], pair[keys[0]] ];
  }

  return true;
}

function constructYamlPairs(data) {
  var index, length, pair, keys, result,
      object = data;

  result = new Array(object.length);

  for (index = 0, length = object.length; index < length; index += 1) {
    pair = object[index];

    keys = Object.keys(pair);

    result[index] = [ keys[0], pair[keys[0]] ];
  }

  return result;
}

module.exports = new Type('tag:yaml.org,2002:pairs', {
  kind: 'sequence',
  resolve: resolveYamlPairs,
  construct: constructYamlPairs
});

},{"../type":14}],27:[function(_dereq_,module,exports){
'use strict';

var Type = _dereq_('../type');

module.exports = new Type('tag:yaml.org,2002:seq', {
  kind: 'sequence'
});

},{"../type":14}],28:[function(_dereq_,module,exports){
'use strict';

var Type = _dereq_('../type');

var _hasOwnProperty = Object.prototype.hasOwnProperty;

function resolveYamlSet(data) {
  var key, object = data;

  for (key in object) {
    if (_hasOwnProperty.call(object, key)) {
      if (null !== object[key]) {
        return false;
      }
    }
  }

  return true;
}

module.exports = new Type('tag:yaml.org,2002:set', {
  kind: 'mapping',
  resolve: resolveYamlSet
});

},{"../type":14}],29:[function(_dereq_,module,exports){
'use strict';

var Type = _dereq_('../type');

module.exports = new Type('tag:yaml.org,2002:str', {
  kind: 'scalar'
});

},{"../type":14}],30:[function(_dereq_,module,exports){
'use strict';

var Type = _dereq_('../type');

var YAML_TIMESTAMP_REGEXP = new RegExp(
  '^([0-9][0-9][0-9][0-9])'          + // [1] year
  '-([0-9][0-9]?)'                   + // [2] month
  '-([0-9][0-9]?)'                   + // [3] day
  '(?:(?:[Tt]|[ \\t]+)'              + // ...
  '([0-9][0-9]?)'                    + // [4] hour
  ':([0-9][0-9])'                    + // [5] minute
  ':([0-9][0-9])'                    + // [6] second
  '(?:\\.([0-9]*))?'                 + // [7] fraction
  '(?:[ \\t]*(Z|([-+])([0-9][0-9]?)' + // [8] tz [9] tz_sign [10] tz_hour
  '(?::([0-9][0-9]))?))?)?$');         // [11] tz_minute

function resolveYamlTimestamp(data) {
  var match, year, month, day, hour, minute, second, fraction = 0,
      delta = null, tz_hour, tz_minute, date;

  match = YAML_TIMESTAMP_REGEXP.exec(data);

  if (null === match) {
    return false;
  }

  return true;
}

function constructYamlTimestamp(data) {
  var match, year, month, day, hour, minute, second, fraction = 0,
      delta = null, tz_hour, tz_minute, date;

  match = YAML_TIMESTAMP_REGEXP.exec(data);

  if (null === match) {
    throw new Error('Date resolve error');
  }

  // match: [1] year [2] month [3] day

  year = +(match[1]);
  month = +(match[2]) - 1; // JS month starts with 0
  day = +(match[3]);

  if (!match[4]) { // no hour
    return new Date(Date.UTC(year, month, day));
  }

  // match: [4] hour [5] minute [6] second [7] fraction

  hour = +(match[4]);
  minute = +(match[5]);
  second = +(match[6]);

  if (match[7]) {
    fraction = match[7].slice(0, 3);
    while (fraction.length < 3) { // milli-seconds
      fraction += '0';
    }
    fraction = +fraction;
  }

  // match: [8] tz [9] tz_sign [10] tz_hour [11] tz_minute

  if (match[9]) {
    tz_hour = +(match[10]);
    tz_minute = +(match[11] || 0);
    delta = (tz_hour * 60 + tz_minute) * 60000; // delta in mili-seconds
    if ('-' === match[9]) {
      delta = -delta;
    }
  }

  date = new Date(Date.UTC(year, month, day, hour, minute, second, fraction));

  if (delta) {
    date.setTime(date.getTime() - delta);
  }

  return date;
}

function representYamlTimestamp(object /*, style*/) {
  return object.toISOString();
}

module.exports = new Type('tag:yaml.org,2002:timestamp', {
  kind: 'scalar',
  resolve: resolveYamlTimestamp,
  construct: constructYamlTimestamp,
  instanceOf: Date,
  represent: representYamlTimestamp
});

},{"../type":14}],31:[function(_dereq_,module,exports){

},{}]},{},[1])
(1)
});
!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.io=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){

module.exports = _dereq_('./lib/');

},{"./lib/":2}],2:[function(_dereq_,module,exports){

/**
 * Module dependencies.
 */

var url = _dereq_('./url');
var parser = _dereq_('socket.io-parser');
var Manager = _dereq_('./manager');
var debug = _dereq_('debug')('socket.io-client');

/**
 * Module exports.
 */

module.exports = exports = lookup;

/**
 * Managers cache.
 */

var cache = exports.managers = {};

/**
 * Looks up an existing `Manager` for multiplexing.
 * If the user summons:
 *
 *   `io('http://localhost/a');`
 *   `io('http://localhost/b');`
 *
 * We reuse the existing instance based on same scheme/port/host,
 * and we initialize sockets for each namespace.
 *
 * @api public
 */

function lookup(uri, opts) {
  if (typeof uri == 'object') {
    opts = uri;
    uri = undefined;
  }

  opts = opts || {};

  var parsed = url(uri);
  var source = parsed.source;
  var id = parsed.id;
  var io;

  if (opts.forceNew || opts['force new connection'] || false === opts.multiplex) {
    debug('ignoring socket cache for %s', source);
    io = Manager(source, opts);
  } else {
    if (!cache[id]) {
      debug('new io instance for %s', source);
      cache[id] = Manager(source, opts);
    }
    io = cache[id];
  }

  return io.socket(parsed.path);
}

/**
 * Protocol version.
 *
 * @api public
 */

exports.protocol = parser.protocol;

/**
 * `connect`.
 *
 * @param {String} uri
 * @api public
 */

exports.connect = lookup;

/**
 * Expose constructors for standalone build.
 *
 * @api public
 */

exports.Manager = _dereq_('./manager');
exports.Socket = _dereq_('./socket');

},{"./manager":3,"./socket":5,"./url":6,"debug":9,"socket.io-parser":40}],3:[function(_dereq_,module,exports){

/**
 * Module dependencies.
 */

var url = _dereq_('./url');
var eio = _dereq_('engine.io-client');
var Socket = _dereq_('./socket');
var Emitter = _dereq_('component-emitter');
var parser = _dereq_('socket.io-parser');
var on = _dereq_('./on');
var bind = _dereq_('component-bind');
var object = _dereq_('object-component');
var debug = _dereq_('debug')('socket.io-client:manager');

/**
 * Module exports
 */

module.exports = Manager;

/**
 * `Manager` constructor.
 *
 * @param {String} engine instance or engine uri/opts
 * @param {Object} options
 * @api public
 */

function Manager(uri, opts){
  if (!(this instanceof Manager)) return new Manager(uri, opts);
  if (uri && ('object' == typeof uri)) {
    opts = uri;
    uri = undefined;
  }
  opts = opts || {};

  opts.path = opts.path || '/socket.io';
  this.nsps = {};
  this.subs = [];
  this.opts = opts;
  this.reconnection(opts.reconnection !== false);
  this.reconnectionAttempts(opts.reconnectionAttempts || Infinity);
  this.reconnectionDelay(opts.reconnectionDelay || 1000);
  this.reconnectionDelayMax(opts.reconnectionDelayMax || 5000);
  this.timeout(null == opts.timeout ? 20000 : opts.timeout);
  this.readyState = 'closed';
  this.uri = uri;
  this.connected = 0;
  this.attempts = 0;
  this.encoding = false;
  this.packetBuffer = [];
  this.encoder = new parser.Encoder();
  this.decoder = new parser.Decoder();
  this.autoConnect = opts.autoConnect !== false;
  if (this.autoConnect) this.open();
}

/**
 * Propagate given event to sockets and emit on `this`
 *
 * @api private
 */

Manager.prototype.emitAll = function() {
  this.emit.apply(this, arguments);
  for (var nsp in this.nsps) {
    this.nsps[nsp].emit.apply(this.nsps[nsp], arguments);
  }
};

/**
 * Mix in `Emitter`.
 */

Emitter(Manager.prototype);

/**
 * Sets the `reconnection` config.
 *
 * @param {Boolean} true/false if it should automatically reconnect
 * @return {Manager} self or value
 * @api public
 */

Manager.prototype.reconnection = function(v){
  if (!arguments.length) return this._reconnection;
  this._reconnection = !!v;
  return this;
};

/**
 * Sets the reconnection attempts config.
 *
 * @param {Number} max reconnection attempts before giving up
 * @return {Manager} self or value
 * @api public
 */

Manager.prototype.reconnectionAttempts = function(v){
  if (!arguments.length) return this._reconnectionAttempts;
  this._reconnectionAttempts = v;
  return this;
};

/**
 * Sets the delay between reconnections.
 *
 * @param {Number} delay
 * @return {Manager} self or value
 * @api public
 */

Manager.prototype.reconnectionDelay = function(v){
  if (!arguments.length) return this._reconnectionDelay;
  this._reconnectionDelay = v;
  return this;
};

/**
 * Sets the maximum delay between reconnections.
 *
 * @param {Number} delay
 * @return {Manager} self or value
 * @api public
 */

Manager.prototype.reconnectionDelayMax = function(v){
  if (!arguments.length) return this._reconnectionDelayMax;
  this._reconnectionDelayMax = v;
  return this;
};

/**
 * Sets the connection timeout. `false` to disable
 *
 * @return {Manager} self or value
 * @api public
 */

Manager.prototype.timeout = function(v){
  if (!arguments.length) return this._timeout;
  this._timeout = v;
  return this;
};

/**
 * Starts trying to reconnect if reconnection is enabled and we have not
 * started reconnecting yet
 *
 * @api private
 */

Manager.prototype.maybeReconnectOnOpen = function() {
  // Only try to reconnect if it's the first time we're connecting
  if (!this.openReconnect && !this.reconnecting && this._reconnection && this.attempts === 0) {
    // keeps reconnection from firing twice for the same reconnection loop
    this.openReconnect = true;
    this.reconnect();
  }
};


/**
 * Sets the current transport `socket`.
 *
 * @param {Function} optional, callback
 * @return {Manager} self
 * @api public
 */

Manager.prototype.open =
Manager.prototype.connect = function(fn){
  debug('readyState %s', this.readyState);
  if (~this.readyState.indexOf('open')) return this;

  debug('opening %s', this.uri);
  this.engine = eio(this.uri, this.opts);
  var socket = this.engine;
  var self = this;
  this.readyState = 'opening';

  // emit `open`
  var openSub = on(socket, 'open', function() {
    self.onopen();
    fn && fn();
  });

  // emit `connect_error`
  var errorSub = on(socket, 'error', function(data){
    debug('connect_error');
    self.cleanup();
    self.readyState = 'closed';
    self.emitAll('connect_error', data);
    if (fn) {
      var err = new Error('Connection error');
      err.data = data;
      fn(err);
    }

    self.maybeReconnectOnOpen();
  });

  // emit `connect_timeout`
  if (false !== this._timeout) {
    var timeout = this._timeout;
    debug('connect attempt will timeout after %d', timeout);

    // set timer
    var timer = setTimeout(function(){
      debug('connect attempt timed out after %d', timeout);
      openSub.destroy();
      socket.close();
      socket.emit('error', 'timeout');
      self.emitAll('connect_timeout', timeout);
    }, timeout);

    this.subs.push({
      destroy: function(){
        clearTimeout(timer);
      }
    });
  }

  this.subs.push(openSub);
  this.subs.push(errorSub);

  return this;
};

/**
 * Called upon transport open.
 *
 * @api private
 */

Manager.prototype.onopen = function(){
  debug('open');

  // clear old subs
  this.cleanup();

  // mark as open
  this.readyState = 'open';
  this.emit('open');

  // add new subs
  var socket = this.engine;
  this.subs.push(on(socket, 'data', bind(this, 'ondata')));
  this.subs.push(on(this.decoder, 'decoded', bind(this, 'ondecoded')));
  this.subs.push(on(socket, 'error', bind(this, 'onerror')));
  this.subs.push(on(socket, 'close', bind(this, 'onclose')));
};

/**
 * Called with data.
 *
 * @api private
 */

Manager.prototype.ondata = function(data){
  this.decoder.add(data);
};

/**
 * Called when parser fully decodes a packet.
 *
 * @api private
 */

Manager.prototype.ondecoded = function(packet) {
  this.emit('packet', packet);
};

/**
 * Called upon socket error.
 *
 * @api private
 */

Manager.prototype.onerror = function(err){
  debug('error', err);
  this.emitAll('error', err);
};

/**
 * Creates a new socket for the given `nsp`.
 *
 * @return {Socket}
 * @api public
 */

Manager.prototype.socket = function(nsp){
  var socket = this.nsps[nsp];
  if (!socket) {
    socket = new Socket(this, nsp);
    this.nsps[nsp] = socket;
    var self = this;
    socket.on('connect', function(){
      self.connected++;
    });
  }
  return socket;
};

/**
 * Called upon a socket close.
 *
 * @param {Socket} socket
 */

Manager.prototype.destroy = function(socket){
  --this.connected || this.close();
};

/**
 * Writes a packet.
 *
 * @param {Object} packet
 * @api private
 */

Manager.prototype.packet = function(packet){
  debug('writing packet %j', packet);
  var self = this;

  if (!self.encoding) {
    // encode, then write to engine with result
    self.encoding = true;
    this.encoder.encode(packet, function(encodedPackets) {
      for (var i = 0; i < encodedPackets.length; i++) {
        self.engine.write(encodedPackets[i]);
      }
      self.encoding = false;
      self.processPacketQueue();
    });
  } else { // add packet to the queue
    self.packetBuffer.push(packet);
  }
};

/**
 * If packet buffer is non-empty, begins encoding the
 * next packet in line.
 *
 * @api private
 */

Manager.prototype.processPacketQueue = function() {
  if (this.packetBuffer.length > 0 && !this.encoding) {
    var pack = this.packetBuffer.shift();
    this.packet(pack);
  }
};

/**
 * Clean up transport subscriptions and packet buffer.
 *
 * @api private
 */

Manager.prototype.cleanup = function(){
  var sub;
  while (sub = this.subs.shift()) sub.destroy();

  this.packetBuffer = [];
  this.encoding = false;

  this.decoder.destroy();
};

/**
 * Close the current socket.
 *
 * @api private
 */

Manager.prototype.close =
Manager.prototype.disconnect = function(){
  this.skipReconnect = true;
  this.engine.close();
};

/**
 * Called upon engine close.
 *
 * @api private
 */

Manager.prototype.onclose = function(reason){
  debug('close');
  this.cleanup();
  this.readyState = 'closed';
  this.emit('close', reason);
  if (this._reconnection && !this.skipReconnect) {
    this.reconnect();
  }
};

/**
 * Attempt a reconnection.
 *
 * @api private
 */

Manager.prototype.reconnect = function(){
  if (this.reconnecting) return this;

  var self = this;
  this.attempts++;

  if (this.attempts > this._reconnectionAttempts) {
    debug('reconnect failed');
    this.emitAll('reconnect_failed');
    this.reconnecting = false;
  } else {
    var delay = this.attempts * this.reconnectionDelay();
    delay = Math.min(delay, this.reconnectionDelayMax());
    debug('will wait %dms before reconnect attempt', delay);

    this.reconnecting = true;
    var timer = setTimeout(function(){
      debug('attempting reconnect');
      self.emitAll('reconnect_attempt', self.attempts);
      self.emitAll('reconnecting', self.attempts);
      self.open(function(err){
        if (err) {
          debug('reconnect attempt error');
          self.reconnecting = false;
          self.reconnect();
          self.emitAll('reconnect_error', err.data);
        } else {
          debug('reconnect success');
          self.onreconnect();
        }
      });
    }, delay);

    this.subs.push({
      destroy: function(){
        clearTimeout(timer);
      }
    });
  }
};

/**
 * Called upon successful reconnect.
 *
 * @api private
 */

Manager.prototype.onreconnect = function(){
  var attempt = this.attempts;
  this.attempts = 0;
  this.reconnecting = false;
  this.emitAll('reconnect', attempt);
};

},{"./on":4,"./socket":5,"./url":6,"component-bind":7,"component-emitter":8,"debug":9,"engine.io-client":10,"object-component":37,"socket.io-parser":40}],4:[function(_dereq_,module,exports){

/**
 * Module exports.
 */

module.exports = on;

/**
 * Helper for subscriptions.
 *
 * @param {Object|EventEmitter} obj with `Emitter` mixin or `EventEmitter`
 * @param {String} event name
 * @param {Function} callback
 * @api public
 */

function on(obj, ev, fn) {
  obj.on(ev, fn);
  return {
    destroy: function(){
      obj.removeListener(ev, fn);
    }
  };
}

},{}],5:[function(_dereq_,module,exports){

/**
 * Module dependencies.
 */

var parser = _dereq_('socket.io-parser');
var Emitter = _dereq_('component-emitter');
var toArray = _dereq_('to-array');
var on = _dereq_('./on');
var bind = _dereq_('component-bind');
var debug = _dereq_('debug')('socket.io-client:socket');
var hasBin = _dereq_('has-binary');
var indexOf = _dereq_('indexof');

/**
 * Module exports.
 */

module.exports = exports = Socket;

/**
 * Internal events (blacklisted).
 * These events can't be emitted by the user.
 *
 * @api private
 */

var events = {
  connect: 1,
  connect_error: 1,
  connect_timeout: 1,
  disconnect: 1,
  error: 1,
  reconnect: 1,
  reconnect_attempt: 1,
  reconnect_failed: 1,
  reconnect_error: 1,
  reconnecting: 1
};

/**
 * Shortcut to `Emitter#emit`.
 */

var emit = Emitter.prototype.emit;

/**
 * `Socket` constructor.
 *
 * @api public
 */

function Socket(io, nsp){
  this.io = io;
  this.nsp = nsp;
  this.json = this; // compat
  this.ids = 0;
  this.acks = {};
  if (this.io.autoConnect) this.open();
  this.receiveBuffer = [];
  this.sendBuffer = [];
  this.connected = false;
  this.disconnected = true;
  this.subEvents();
}

/**
 * Mix in `Emitter`.
 */

Emitter(Socket.prototype);

/**
 * Subscribe to open, close and packet events
 *
 * @api private
 */

Socket.prototype.subEvents = function() {
  var io = this.io;
  this.subs = [
    on(io, 'open', bind(this, 'onopen')),
    on(io, 'packet', bind(this, 'onpacket')),
    on(io, 'close', bind(this, 'onclose'))
  ];
};

/**
 * Called upon engine `open`.
 *
 * @api private
 */

Socket.prototype.open =
Socket.prototype.connect = function(){
  if (this.connected) return this;

  this.io.open(); // ensure open
  if ('open' == this.io.readyState) this.onopen();
  return this;
};

/**
 * Sends a `message` event.
 *
 * @return {Socket} self
 * @api public
 */

Socket.prototype.send = function(){
  var args = toArray(arguments);
  args.unshift('message');
  this.emit.apply(this, args);
  return this;
};

/**
 * Override `emit`.
 * If the event is in `events`, it's emitted normally.
 *
 * @param {String} event name
 * @return {Socket} self
 * @api public
 */

Socket.prototype.emit = function(ev){
  if (events.hasOwnProperty(ev)) {
    emit.apply(this, arguments);
    return this;
  }

  var args = toArray(arguments);
  var parserType = parser.EVENT; // default
  if (hasBin(args)) { parserType = parser.BINARY_EVENT; } // binary
  var packet = { type: parserType, data: args };

  // event ack callback
  if ('function' == typeof args[args.length - 1]) {
    debug('emitting packet with ack id %d', this.ids);
    this.acks[this.ids] = args.pop();
    packet.id = this.ids++;
  }

  if (this.connected) {
    this.packet(packet);
  } else {
    this.sendBuffer.push(packet);
  }

  return this;
};

/**
 * Sends a packet.
 *
 * @param {Object} packet
 * @api private
 */

Socket.prototype.packet = function(packet){
  packet.nsp = this.nsp;
  this.io.packet(packet);
};

/**
 * "Opens" the socket.
 *
 * @api private
 */

Socket.prototype.onopen = function(){
  debug('transport is open - connecting');

  // write connect packet if necessary
  if ('/' != this.nsp) {
    this.packet({ type: parser.CONNECT });
  }
};

/**
 * Called upon engine `close`.
 *
 * @param {String} reason
 * @api private
 */

Socket.prototype.onclose = function(reason){
  debug('close (%s)', reason);
  this.connected = false;
  this.disconnected = true;
  this.emit('disconnect', reason);
};

/**
 * Called with socket packet.
 *
 * @param {Object} packet
 * @api private
 */

Socket.prototype.onpacket = function(packet){
  if (packet.nsp != this.nsp) return;

  switch (packet.type) {
    case parser.CONNECT:
      this.onconnect();
      break;

    case parser.EVENT:
      this.onevent(packet);
      break;

    case parser.BINARY_EVENT:
      this.onevent(packet);
      break;

    case parser.ACK:
      this.onack(packet);
      break;

    case parser.BINARY_ACK:
      this.onack(packet);
      break;

    case parser.DISCONNECT:
      this.ondisconnect();
      break;

    case parser.ERROR:
      this.emit('error', packet.data);
      break;
  }
};

/**
 * Called upon a server event.
 *
 * @param {Object} packet
 * @api private
 */

Socket.prototype.onevent = function(packet){
  var args = packet.data || [];
  debug('emitting event %j', args);

  if (null != packet.id) {
    debug('attaching ack callback to event');
    args.push(this.ack(packet.id));
  }

  if (this.connected) {
    emit.apply(this, args);
  } else {
    this.receiveBuffer.push(args);
  }
};

/**
 * Produces an ack callback to emit with an event.
 *
 * @api private
 */

Socket.prototype.ack = function(id){
  var self = this;
  var sent = false;
  return function(){
    // prevent double callbacks
    if (sent) return;
    sent = true;
    var args = toArray(arguments);
    debug('sending ack %j', args);

    var type = hasBin(args) ? parser.BINARY_ACK : parser.ACK;
    self.packet({
      type: type,
      id: id,
      data: args
    });
  };
};

/**
 * Called upon a server acknowlegement.
 *
 * @param {Object} packet
 * @api private
 */

Socket.prototype.onack = function(packet){
  debug('calling ack %s with %j', packet.id, packet.data);
  var fn = this.acks[packet.id];
  fn.apply(this, packet.data);
  delete this.acks[packet.id];
};

/**
 * Called upon server connect.
 *
 * @api private
 */

Socket.prototype.onconnect = function(){
  this.connected = true;
  this.disconnected = false;
  this.emit('connect');
  this.emitBuffered();
};

/**
 * Emit buffered events (received and emitted).
 *
 * @api private
 */

Socket.prototype.emitBuffered = function(){
  var i;
  for (i = 0; i < this.receiveBuffer.length; i++) {
    emit.apply(this, this.receiveBuffer[i]);
  }
  this.receiveBuffer = [];

  for (i = 0; i < this.sendBuffer.length; i++) {
    this.packet(this.sendBuffer[i]);
  }
  this.sendBuffer = [];
};

/**
 * Called upon server disconnect.
 *
 * @api private
 */

Socket.prototype.ondisconnect = function(){
  debug('server disconnect (%s)', this.nsp);
  this.destroy();
  this.onclose('io server disconnect');
};

/**
 * Called upon forced client/server side disconnections,
 * this method ensures the manager stops tracking us and
 * that reconnections don't get triggered for this.
 *
 * @api private.
 */

Socket.prototype.destroy = function(){
  // clean subscriptions to avoid reconnections
  for (var i = 0; i < this.subs.length; i++) {
    this.subs[i].destroy();
  }

  this.io.destroy(this);
};

/**
 * Disconnects the socket manually.
 *
 * @return {Socket} self
 * @api public
 */

Socket.prototype.close =
Socket.prototype.disconnect = function(){
  if (!this.connected) return this;

  debug('performing disconnect (%s)', this.nsp);
  this.packet({ type: parser.DISCONNECT });

  // remove socket from pool
  this.destroy();

  // fire events
  this.onclose('io client disconnect');
  return this;
};

},{"./on":4,"component-bind":7,"component-emitter":8,"debug":9,"has-binary":32,"indexof":36,"socket.io-parser":40,"to-array":44}],6:[function(_dereq_,module,exports){
(function (global){

/**
 * Module dependencies.
 */

var parseuri = _dereq_('parseuri');
var debug = _dereq_('debug')('socket.io-client:url');

/**
 * Module exports.
 */

module.exports = url;

/**
 * URL parser.
 *
 * @param {String} url
 * @param {Object} An object meant to mimic window.location.
 *                 Defaults to window.location.
 * @api public
 */

function url(uri, loc){
  var obj = uri;

  // default to window.location
  var loc = loc || global.location;
  if (null == uri) uri = loc.protocol + '//' + loc.hostname;

  // relative path support
  if ('string' == typeof uri) {
    if ('/' == uri.charAt(0)) {
      if ('undefined' != typeof loc) {
        uri = loc.hostname + uri;
      }
    }

    if (!/^(https?|wss?):\/\//.test(uri)) {
      debug('protocol-less url %s', uri);
      if ('undefined' != typeof loc) {
        uri = loc.protocol + '//' + uri;
      } else {
        uri = 'https://' + uri;
      }
    }

    // parse
    debug('parse %s', uri);
    obj = parseuri(uri);
  }

  // make sure we treat `localhost:80` and `localhost` equally
  if (!obj.port) {
    if (/^(http|ws)$/.test(obj.protocol)) {
      obj.port = '80';
    }
    else if (/^(http|ws)s$/.test(obj.protocol)) {
      obj.port = '443';
    }
  }

  obj.path = obj.path || '/';

  // define unique id
  obj.id = obj.protocol + '://' + obj.host + ':' + obj.port;
  // define href
  obj.href = obj.protocol + '://' + obj.host + (loc && loc.port == obj.port ? '' : (':' + obj.port));

  return obj;
}

}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"debug":9,"parseuri":38}],7:[function(_dereq_,module,exports){
/**
 * Slice reference.
 */

var slice = [].slice;

/**
 * Bind `obj` to `fn`.
 *
 * @param {Object} obj
 * @param {Function|String} fn or string
 * @return {Function}
 * @api public
 */

module.exports = function(obj, fn){
  if ('string' == typeof fn) fn = obj[fn];
  if ('function' != typeof fn) throw new Error('bind() requires a function');
  var args = slice.call(arguments, 2);
  return function(){
    return fn.apply(obj, args.concat(slice.call(arguments)));
  }
};

},{}],8:[function(_dereq_,module,exports){

/**
 * Expose `Emitter`.
 */

module.exports = Emitter;

/**
 * Initialize a new `Emitter`.
 *
 * @api public
 */

function Emitter(obj) {
  if (obj) return mixin(obj);
};

/**
 * Mixin the emitter properties.
 *
 * @param {Object} obj
 * @return {Object}
 * @api private
 */

function mixin(obj) {
  for (var key in Emitter.prototype) {
    obj[key] = Emitter.prototype[key];
  }
  return obj;
}

/**
 * Listen on the given `event` with `fn`.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.on =
Emitter.prototype.addEventListener = function(event, fn){
  this._callbacks = this._callbacks || {};
  (this._callbacks[event] = this._callbacks[event] || [])
    .push(fn);
  return this;
};

/**
 * Adds an `event` listener that will be invoked a single
 * time then automatically removed.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.once = function(event, fn){
  var self = this;
  this._callbacks = this._callbacks || {};

  function on() {
    self.off(event, on);
    fn.apply(this, arguments);
  }

  on.fn = fn;
  this.on(event, on);
  return this;
};

/**
 * Remove the given callback for `event` or all
 * registered callbacks.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.off =
Emitter.prototype.removeListener =
Emitter.prototype.removeAllListeners =
Emitter.prototype.removeEventListener = function(event, fn){
  this._callbacks = this._callbacks || {};

  // all
  if (0 == arguments.length) {
    this._callbacks = {};
    return this;
  }

  // specific event
  var callbacks = this._callbacks[event];
  if (!callbacks) return this;

  // remove all handlers
  if (1 == arguments.length) {
    delete this._callbacks[event];
    return this;
  }

  // remove specific handler
  var cb;
  for (var i = 0; i < callbacks.length; i++) {
    cb = callbacks[i];
    if (cb === fn || cb.fn === fn) {
      callbacks.splice(i, 1);
      break;
    }
  }
  return this;
};

/**
 * Emit `event` with the given args.
 *
 * @param {String} event
 * @param {Mixed} ...
 * @return {Emitter}
 */

Emitter.prototype.emit = function(event){
  this._callbacks = this._callbacks || {};
  var args = [].slice.call(arguments, 1)
    , callbacks = this._callbacks[event];

  if (callbacks) {
    callbacks = callbacks.slice(0);
    for (var i = 0, len = callbacks.length; i < len; ++i) {
      callbacks[i].apply(this, args);
    }
  }

  return this;
};

/**
 * Return array of callbacks for `event`.
 *
 * @param {String} event
 * @return {Array}
 * @api public
 */

Emitter.prototype.listeners = function(event){
  this._callbacks = this._callbacks || {};
  return this._callbacks[event] || [];
};

/**
 * Check if this emitter has `event` handlers.
 *
 * @param {String} event
 * @return {Boolean}
 * @api public
 */

Emitter.prototype.hasListeners = function(event){
  return !! this.listeners(event).length;
};

},{}],9:[function(_dereq_,module,exports){

/**
 * Expose `debug()` as the module.
 */

module.exports = debug;

/**
 * Create a debugger with the given `name`.
 *
 * @param {String} name
 * @return {Type}
 * @api public
 */

function debug(name) {
  if (!debug.enabled(name)) return function(){};

  return function(fmt){
    fmt = coerce(fmt);

    var curr = new Date;
    var ms = curr - (debug[name] || curr);
    debug[name] = curr;

    fmt = name
      + ' '
      + fmt
      + ' +' + debug.humanize(ms);

    // This hackery is required for IE8
    // where `console.log` doesn't have 'apply'
    window.console
      && console.log
      && Function.prototype.apply.call(console.log, console, arguments);
  }
}

/**
 * The currently active debug mode names.
 */

debug.names = [];
debug.skips = [];

/**
 * Enables a debug mode by name. This can include modes
 * separated by a colon and wildcards.
 *
 * @param {String} name
 * @api public
 */

debug.enable = function(name) {
  try {
    localStorage.debug = name;
  } catch(e){}

  var split = (name || '').split(/[\s,]+/)
    , len = split.length;

  for (var i = 0; i < len; i++) {
    name = split[i].replace('*', '.*?');
    if (name[0] === '-') {
      debug.skips.push(new RegExp('^' + name.substr(1) + '$'));
    }
    else {
      debug.names.push(new RegExp('^' + name + '$'));
    }
  }
};

/**
 * Disable debug output.
 *
 * @api public
 */

debug.disable = function(){
  debug.enable('');
};

/**
 * Humanize the given `ms`.
 *
 * @param {Number} m
 * @return {String}
 * @api private
 */

debug.humanize = function(ms) {
  var sec = 1000
    , min = 60 * 1000
    , hour = 60 * min;

  if (ms >= hour) return (ms / hour).toFixed(1) + 'h';
  if (ms >= min) return (ms / min).toFixed(1) + 'm';
  if (ms >= sec) return (ms / sec | 0) + 's';
  return ms + 'ms';
};

/**
 * Returns true if the given mode name is enabled, false otherwise.
 *
 * @param {String} name
 * @return {Boolean}
 * @api public
 */

debug.enabled = function(name) {
  for (var i = 0, len = debug.skips.length; i < len; i++) {
    if (debug.skips[i].test(name)) {
      return false;
    }
  }
  for (var i = 0, len = debug.names.length; i < len; i++) {
    if (debug.names[i].test(name)) {
      return true;
    }
  }
  return false;
};

/**
 * Coerce `val`.
 */

function coerce(val) {
  if (val instanceof Error) return val.stack || val.message;
  return val;
}

// persist

try {
  if (window.localStorage) debug.enable(localStorage.debug);
} catch(e){}

},{}],10:[function(_dereq_,module,exports){

module.exports =  _dereq_('./lib/');

},{"./lib/":11}],11:[function(_dereq_,module,exports){

module.exports = _dereq_('./socket');

/**
 * Exports parser
 *
 * @api public
 *
 */
module.exports.parser = _dereq_('engine.io-parser');

},{"./socket":12,"engine.io-parser":21}],12:[function(_dereq_,module,exports){
(function (global){
/**
 * Module dependencies.
 */

var transports = _dereq_('./transports');
var Emitter = _dereq_('component-emitter');
var debug = _dereq_('debug')('engine.io-client:socket');
var index = _dereq_('indexof');
var parser = _dereq_('engine.io-parser');
var parseuri = _dereq_('parseuri');
var parsejson = _dereq_('parsejson');
var parseqs = _dereq_('parseqs');

/**
 * Module exports.
 */

module.exports = Socket;

/**
 * Noop function.
 *
 * @api private
 */

function noop(){}

/**
 * Socket constructor.
 *
 * @param {String|Object} uri or options
 * @param {Object} options
 * @api public
 */

function Socket(uri, opts){
  if (!(this instanceof Socket)) return new Socket(uri, opts);

  opts = opts || {};

  if (uri && 'object' == typeof uri) {
    opts = uri;
    uri = null;
  }

  if (uri) {
    uri = parseuri(uri);
    opts.host = uri.host;
    opts.secure = uri.protocol == 'https' || uri.protocol == 'wss';
    opts.port = uri.port;
    if (uri.query) opts.query = uri.query;
  }

  this.secure = null != opts.secure ? opts.secure :
    (global.location && 'https:' == location.protocol);

  if (opts.host) {
    var pieces = opts.host.split(':');
    opts.hostname = pieces.shift();
    if (pieces.length) opts.port = pieces.pop();
  }

  this.agent = opts.agent || false;
  this.hostname = opts.hostname ||
    (global.location ? location.hostname : 'localhost');
  this.port = opts.port || (global.location && location.port ?
       location.port :
       (this.secure ? 443 : 80));
  this.query = opts.query || {};
  if ('string' == typeof this.query) this.query = parseqs.decode(this.query);
  this.upgrade = false !== opts.upgrade;
  this.path = (opts.path || '/engine.io').replace(/\/$/, '') + '/';
  this.forceJSONP = !!opts.forceJSONP;
  this.jsonp = false !== opts.jsonp;
  this.forceBase64 = !!opts.forceBase64;
  this.enablesXDR = !!opts.enablesXDR;
  this.timestampParam = opts.timestampParam || 't';
  this.timestampRequests = opts.timestampRequests;
  this.transports = opts.transports || ['polling', 'websocket'];
  this.readyState = '';
  this.writeBuffer = [];
  this.callbackBuffer = [];
  this.policyPort = opts.policyPort || 843;
  this.rememberUpgrade = opts.rememberUpgrade || false;
  this.open();
  this.binaryType = null;
  this.onlyBinaryUpgrades = opts.onlyBinaryUpgrades;
}

Socket.priorWebsocketSuccess = false;

/**
 * Mix in `Emitter`.
 */

Emitter(Socket.prototype);

/**
 * Protocol version.
 *
 * @api public
 */

Socket.protocol = parser.protocol; // this is an int

/**
 * Expose deps for legacy compatibility
 * and standalone browser access.
 */

Socket.Socket = Socket;
Socket.Transport = _dereq_('./transport');
Socket.transports = _dereq_('./transports');
Socket.parser = _dereq_('engine.io-parser');

/**
 * Creates transport of the given type.
 *
 * @param {String} transport name
 * @return {Transport}
 * @api private
 */

Socket.prototype.createTransport = function (name) {
  debug('creating transport "%s"', name);
  var query = clone(this.query);

  // append engine.io protocol identifier
  query.EIO = parser.protocol;

  // transport name
  query.transport = name;

  // session id if we already have one
  if (this.id) query.sid = this.id;

  var transport = new transports[name]({
    agent: this.agent,
    hostname: this.hostname,
    port: this.port,
    secure: this.secure,
    path: this.path,
    query: query,
    forceJSONP: this.forceJSONP,
    jsonp: this.jsonp,
    forceBase64: this.forceBase64,
    enablesXDR: this.enablesXDR,
    timestampRequests: this.timestampRequests,
    timestampParam: this.timestampParam,
    policyPort: this.policyPort,
    socket: this
  });

  return transport;
};

function clone (obj) {
  var o = {};
  for (var i in obj) {
    if (obj.hasOwnProperty(i)) {
      o[i] = obj[i];
    }
  }
  return o;
}

/**
 * Initializes transport to use and starts probe.
 *
 * @api private
 */
Socket.prototype.open = function () {
  var transport;
  if (this.rememberUpgrade && Socket.priorWebsocketSuccess && this.transports.indexOf('websocket') != -1) {
    transport = 'websocket';
  } else if (0 == this.transports.length) {
    // Emit error on next tick so it can be listened to
    var self = this;
    setTimeout(function() {
      self.emit('error', 'No transports available');
    }, 0);
    return;
  } else {
    transport = this.transports[0];
  }
  this.readyState = 'opening';

  // Retry with the next transport if the transport is disabled (jsonp: false)
  var transport;
  try {
    transport = this.createTransport(transport);
  } catch (e) {
    this.transports.shift();
    this.open();
    return;
  }

  transport.open();
  this.setTransport(transport);
};

/**
 * Sets the current transport. Disables the existing one (if any).
 *
 * @api private
 */

Socket.prototype.setTransport = function(transport){
  debug('setting transport %s', transport.name);
  var self = this;

  if (this.transport) {
    debug('clearing existing transport %s', this.transport.name);
    this.transport.removeAllListeners();
  }

  // set up transport
  this.transport = transport;

  // set up transport listeners
  transport
  .on('drain', function(){
    self.onDrain();
  })
  .on('packet', function(packet){
    self.onPacket(packet);
  })
  .on('error', function(e){
    self.onError(e);
  })
  .on('close', function(){
    self.onClose('transport close');
  });
};

/**
 * Probes a transport.
 *
 * @param {String} transport name
 * @api private
 */

Socket.prototype.probe = function (name) {
  debug('probing transport "%s"', name);
  var transport = this.createTransport(name, { probe: 1 })
    , failed = false
    , self = this;

  Socket.priorWebsocketSuccess = false;

  function onTransportOpen(){
    if (self.onlyBinaryUpgrades) {
      var upgradeLosesBinary = !this.supportsBinary && self.transport.supportsBinary;
      failed = failed || upgradeLosesBinary;
    }
    if (failed) return;

    debug('probe transport "%s" opened', name);
    transport.send([{ type: 'ping', data: 'probe' }]);
    transport.once('packet', function (msg) {
      if (failed) return;
      if ('pong' == msg.type && 'probe' == msg.data) {
        debug('probe transport "%s" pong', name);
        self.upgrading = true;
        self.emit('upgrading', transport);
        Socket.priorWebsocketSuccess = 'websocket' == transport.name;

        debug('pausing current transport "%s"', self.transport.name);
        self.transport.pause(function () {
          if (failed) return;
          if ('closed' == self.readyState || 'closing' == self.readyState) {
            return;
          }
          debug('changing transport and sending upgrade packet');

          cleanup();

          self.setTransport(transport);
          transport.send([{ type: 'upgrade' }]);
          self.emit('upgrade', transport);
          transport = null;
          self.upgrading = false;
          self.flush();
        });
      } else {
        debug('probe transport "%s" failed', name);
        var err = new Error('probe error');
        err.transport = transport.name;
        self.emit('upgradeError', err);
      }
    });
  }

  function freezeTransport() {
    if (failed) return;

    // Any callback called by transport should be ignored since now
    failed = true;

    cleanup();

    transport.close();
    transport = null;
  }

  //Handle any error that happens while probing
  function onerror(err) {
    var error = new Error('probe error: ' + err);
    error.transport = transport.name;

    freezeTransport();

    debug('probe transport "%s" failed because of error: %s', name, err);

    self.emit('upgradeError', error);
  }

  function onTransportClose(){
    onerror("transport closed");
  }

  //When the socket is closed while we're probing
  function onclose(){
    onerror("socket closed");
  }

  //When the socket is upgraded while we're probing
  function onupgrade(to){
    if (transport && to.name != transport.name) {
      debug('"%s" works - aborting "%s"', to.name, transport.name);
      freezeTransport();
    }
  }

  //Remove all listeners on the transport and on self
  function cleanup(){
    transport.removeListener('open', onTransportOpen);
    transport.removeListener('error', onerror);
    transport.removeListener('close', onTransportClose);
    self.removeListener('close', onclose);
    self.removeListener('upgrading', onupgrade);
  }

  transport.once('open', onTransportOpen);
  transport.once('error', onerror);
  transport.once('close', onTransportClose);

  this.once('close', onclose);
  this.once('upgrading', onupgrade);

  transport.open();

};

/**
 * Called when connection is deemed open.
 *
 * @api public
 */

Socket.prototype.onOpen = function () {
  debug('socket open');
  this.readyState = 'open';
  Socket.priorWebsocketSuccess = 'websocket' == this.transport.name;
  this.emit('open');
  this.flush();

  // we check for `readyState` in case an `open`
  // listener already closed the socket
  if ('open' == this.readyState && this.upgrade && this.transport.pause) {
    debug('starting upgrade probes');
    for (var i = 0, l = this.upgrades.length; i < l; i++) {
      this.probe(this.upgrades[i]);
    }
  }
};

/**
 * Handles a packet.
 *
 * @api private
 */

Socket.prototype.onPacket = function (packet) {
  if ('opening' == this.readyState || 'open' == this.readyState) {
    debug('socket receive: type "%s", data "%s"', packet.type, packet.data);

    this.emit('packet', packet);

    // Socket is live - any packet counts
    this.emit('heartbeat');

    switch (packet.type) {
      case 'open':
        this.onHandshake(parsejson(packet.data));
        break;

      case 'pong':
        this.setPing();
        break;

      case 'error':
        var err = new Error('server error');
        err.code = packet.data;
        this.emit('error', err);
        break;

      case 'message':
        this.emit('data', packet.data);
        this.emit('message', packet.data);
        break;
    }
  } else {
    debug('packet received with socket readyState "%s"', this.readyState);
  }
};

/**
 * Called upon handshake completion.
 *
 * @param {Object} handshake obj
 * @api private
 */

Socket.prototype.onHandshake = function (data) {
  this.emit('handshake', data);
  this.id = data.sid;
  this.transport.query.sid = data.sid;
  this.upgrades = this.filterUpgrades(data.upgrades);
  this.pingInterval = data.pingInterval;
  this.pingTimeout = data.pingTimeout;
  this.onOpen();
  // In case open handler closes socket
  if  ('closed' == this.readyState) return;
  this.setPing();

  // Prolong liveness of socket on heartbeat
  this.removeListener('heartbeat', this.onHeartbeat);
  this.on('heartbeat', this.onHeartbeat);
};

/**
 * Resets ping timeout.
 *
 * @api private
 */

Socket.prototype.onHeartbeat = function (timeout) {
  clearTimeout(this.pingTimeoutTimer);
  var self = this;
  self.pingTimeoutTimer = setTimeout(function () {
    if ('closed' == self.readyState) return;
    self.onClose('ping timeout');
  }, timeout || (self.pingInterval + self.pingTimeout));
};

/**
 * Pings server every `this.pingInterval` and expects response
 * within `this.pingTimeout` or closes connection.
 *
 * @api private
 */

Socket.prototype.setPing = function () {
  var self = this;
  clearTimeout(self.pingIntervalTimer);
  self.pingIntervalTimer = setTimeout(function () {
    debug('writing ping packet - expecting pong within %sms', self.pingTimeout);
    self.ping();
    self.onHeartbeat(self.pingTimeout);
  }, self.pingInterval);
};

/**
* Sends a ping packet.
*
* @api public
*/

Socket.prototype.ping = function () {
  this.sendPacket('ping');
};

/**
 * Called on `drain` event
 *
 * @api private
 */

Socket.prototype.onDrain = function() {
  for (var i = 0; i < this.prevBufferLen; i++) {
    if (this.callbackBuffer[i]) {
      this.callbackBuffer[i]();
    }
  }

  this.writeBuffer.splice(0, this.prevBufferLen);
  this.callbackBuffer.splice(0, this.prevBufferLen);

  // setting prevBufferLen = 0 is very important
  // for example, when upgrading, upgrade packet is sent over,
  // and a nonzero prevBufferLen could cause problems on `drain`
  this.prevBufferLen = 0;

  if (this.writeBuffer.length == 0) {
    this.emit('drain');
  } else {
    this.flush();
  }
};

/**
 * Flush write buffers.
 *
 * @api private
 */

Socket.prototype.flush = function () {
  if ('closed' != this.readyState && this.transport.writable &&
    !this.upgrading && this.writeBuffer.length) {
    debug('flushing %d packets in socket', this.writeBuffer.length);
    this.transport.send(this.writeBuffer);
    // keep track of current length of writeBuffer
    // splice writeBuffer and callbackBuffer on `drain`
    this.prevBufferLen = this.writeBuffer.length;
    this.emit('flush');
  }
};

/**
 * Sends a message.
 *
 * @param {String} message.
 * @param {Function} callback function.
 * @return {Socket} for chaining.
 * @api public
 */

Socket.prototype.write =
Socket.prototype.send = function (msg, fn) {
  this.sendPacket('message', msg, fn);
  return this;
};

/**
 * Sends a packet.
 *
 * @param {String} packet type.
 * @param {String} data.
 * @param {Function} callback function.
 * @api private
 */

Socket.prototype.sendPacket = function (type, data, fn) {
  var packet = { type: type, data: data };
  this.emit('packetCreate', packet);
  this.writeBuffer.push(packet);
  this.callbackBuffer.push(fn);
  this.flush();
};

/**
 * Closes the connection.
 *
 * @api private
 */

Socket.prototype.close = function () {
  if ('opening' == this.readyState || 'open' == this.readyState) {
    this.onClose('forced close');
    debug('socket closing - telling transport to close');
    this.transport.close();
  }

  return this;
};

/**
 * Called upon transport error
 *
 * @api private
 */

Socket.prototype.onError = function (err) {
  debug('socket error %j', err);
  Socket.priorWebsocketSuccess = false;
  this.emit('error', err);
  this.onClose('transport error', err);
};

/**
 * Called upon transport close.
 *
 * @api private
 */

Socket.prototype.onClose = function (reason, desc) {
  if ('opening' == this.readyState || 'open' == this.readyState) {
    debug('socket close with reason: "%s"', reason);
    var self = this;

    // clear timers
    clearTimeout(this.pingIntervalTimer);
    clearTimeout(this.pingTimeoutTimer);

    // clean buffers in next tick, so developers can still
    // grab the buffers on `close` event
    setTimeout(function() {
      self.writeBuffer = [];
      self.callbackBuffer = [];
      self.prevBufferLen = 0;
    }, 0);

    // stop event from firing again for transport
    this.transport.removeAllListeners('close');

    // ensure transport won't stay open
    this.transport.close();

    // ignore further transport communication
    this.transport.removeAllListeners();

    // set ready state
    this.readyState = 'closed';

    // clear session id
    this.id = null;

    // emit close event
    this.emit('close', reason, desc);
  }
};

/**
 * Filters upgrades, returning only those matching client transports.
 *
 * @param {Array} server upgrades
 * @api private
 *
 */

Socket.prototype.filterUpgrades = function (upgrades) {
  var filteredUpgrades = [];
  for (var i = 0, j = upgrades.length; i<j; i++) {
    if (~index(this.transports, upgrades[i])) filteredUpgrades.push(upgrades[i]);
  }
  return filteredUpgrades;
};

}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./transport":13,"./transports":14,"component-emitter":8,"debug":9,"engine.io-parser":21,"indexof":36,"parsejson":28,"parseqs":29,"parseuri":30}],13:[function(_dereq_,module,exports){
/**
 * Module dependencies.
 */

var parser = _dereq_('engine.io-parser');
var Emitter = _dereq_('component-emitter');

/**
 * Module exports.
 */

module.exports = Transport;

/**
 * Transport abstract constructor.
 *
 * @param {Object} options.
 * @api private
 */

function Transport (opts) {
  this.path = opts.path;
  this.hostname = opts.hostname;
  this.port = opts.port;
  this.secure = opts.secure;
  this.query = opts.query;
  this.timestampParam = opts.timestampParam;
  this.timestampRequests = opts.timestampRequests;
  this.readyState = '';
  this.agent = opts.agent || false;
  this.socket = opts.socket;
  this.enablesXDR = opts.enablesXDR;
}

/**
 * Mix in `Emitter`.
 */

Emitter(Transport.prototype);

/**
 * A counter used to prevent collisions in the timestamps used
 * for cache busting.
 */

Transport.timestamps = 0;

/**
 * Emits an error.
 *
 * @param {String} str
 * @return {Transport} for chaining
 * @api public
 */

Transport.prototype.onError = function (msg, desc) {
  var err = new Error(msg);
  err.type = 'TransportError';
  err.description = desc;
  this.emit('error', err);
  return this;
};

/**
 * Opens the transport.
 *
 * @api public
 */

Transport.prototype.open = function () {
  if ('closed' == this.readyState || '' == this.readyState) {
    this.readyState = 'opening';
    this.doOpen();
  }

  return this;
};

/**
 * Closes the transport.
 *
 * @api private
 */

Transport.prototype.close = function () {
  if ('opening' == this.readyState || 'open' == this.readyState) {
    this.doClose();
    this.onClose();
  }

  return this;
};

/**
 * Sends multiple packets.
 *
 * @param {Array} packets
 * @api private
 */

Transport.prototype.send = function(packets){
  if ('open' == this.readyState) {
    this.write(packets);
  } else {
    throw new Error('Transport not open');
  }
};

/**
 * Called upon open
 *
 * @api private
 */

Transport.prototype.onOpen = function () {
  this.readyState = 'open';
  this.writable = true;
  this.emit('open');
};

/**
 * Called with data.
 *
 * @param {String} data
 * @api private
 */

Transport.prototype.onData = function(data){
  var packet = parser.decodePacket(data, this.socket.binaryType);
  this.onPacket(packet);
};

/**
 * Called with a decoded packet.
 */

Transport.prototype.onPacket = function (packet) {
  this.emit('packet', packet);
};

/**
 * Called upon close.
 *
 * @api private
 */

Transport.prototype.onClose = function () {
  this.readyState = 'closed';
  this.emit('close');
};

},{"component-emitter":8,"engine.io-parser":21}],14:[function(_dereq_,module,exports){
(function (global){
/**
 * Module dependencies
 */

var XMLHttpRequest = _dereq_('xmlhttprequest');
var XHR = _dereq_('./polling-xhr');
var JSONP = _dereq_('./polling-jsonp');
var websocket = _dereq_('./websocket');

/**
 * Export transports.
 */

exports.polling = polling;
exports.websocket = websocket;

/**
 * Polling transport polymorphic constructor.
 * Decides on xhr vs jsonp based on feature detection.
 *
 * @api private
 */

function polling(opts){
  var xhr;
  var xd = false;
  var xs = false;
  var jsonp = false !== opts.jsonp;

  if (global.location) {
    var isSSL = 'https:' == location.protocol;
    var port = location.port;

    // some user agents have empty `location.port`
    if (!port) {
      port = isSSL ? 443 : 80;
    }

    xd = opts.hostname != location.hostname || port != opts.port;
    xs = opts.secure != isSSL;
  }

  opts.xdomain = xd;
  opts.xscheme = xs;
  xhr = new XMLHttpRequest(opts);

  if ('open' in xhr && !opts.forceJSONP) {
    return new XHR(opts);
  } else {
    if (!jsonp) throw new Error('JSONP disabled');
    return new JSONP(opts);
  }
}

}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./polling-jsonp":15,"./polling-xhr":16,"./websocket":18,"xmlhttprequest":19}],15:[function(_dereq_,module,exports){
(function (global){

/**
 * Module requirements.
 */

var Polling = _dereq_('./polling');
var inherit = _dereq_('component-inherit');

/**
 * Module exports.
 */

module.exports = JSONPPolling;

/**
 * Cached regular expressions.
 */

var rNewline = /\n/g;
var rEscapedNewline = /\\n/g;

/**
 * Global JSONP callbacks.
 */

var callbacks;

/**
 * Callbacks count.
 */

var index = 0;

/**
 * Noop.
 */

function empty () { }

/**
 * JSONP Polling constructor.
 *
 * @param {Object} opts.
 * @api public
 */

function JSONPPolling (opts) {
  Polling.call(this, opts);

  this.query = this.query || {};

  // define global callbacks array if not present
  // we do this here (lazily) to avoid unneeded global pollution
  if (!callbacks) {
    // we need to consider multiple engines in the same page
    if (!global.___eio) global.___eio = [];
    callbacks = global.___eio;
  }

  // callback identifier
  this.index = callbacks.length;

  // add callback to jsonp global
  var self = this;
  callbacks.push(function (msg) {
    self.onData(msg);
  });

  // append to query string
  this.query.j = this.index;

  // prevent spurious errors from being emitted when the window is unloaded
  if (global.document && global.addEventListener) {
    global.addEventListener('beforeunload', function () {
      if (self.script) self.script.onerror = empty;
    });
  }
}

/**
 * Inherits from Polling.
 */

inherit(JSONPPolling, Polling);

/*
 * JSONP only supports binary as base64 encoded strings
 */

JSONPPolling.prototype.supportsBinary = false;

/**
 * Closes the socket.
 *
 * @api private
 */

JSONPPolling.prototype.doClose = function () {
  if (this.script) {
    this.script.parentNode.removeChild(this.script);
    this.script = null;
  }

  if (this.form) {
    this.form.parentNode.removeChild(this.form);
    this.form = null;
  }

  Polling.prototype.doClose.call(this);
};

/**
 * Starts a poll cycle.
 *
 * @api private
 */

JSONPPolling.prototype.doPoll = function () {
  var self = this;
  var script = document.createElement('script');

  if (this.script) {
    this.script.parentNode.removeChild(this.script);
    this.script = null;
  }

  script.async = true;
  script.src = this.uri();
  script.onerror = function(e){
    self.onError('jsonp poll error',e);
  };

  var insertAt = document.getElementsByTagName('script')[0];
  insertAt.parentNode.insertBefore(script, insertAt);
  this.script = script;

  var isUAgecko = 'undefined' != typeof navigator && /gecko/i.test(navigator.userAgent);
  
  if (isUAgecko) {
    setTimeout(function () {
      var iframe = document.createElement('iframe');
      document.body.appendChild(iframe);
      document.body.removeChild(iframe);
    }, 100);
  }
};

/**
 * Writes with a hidden iframe.
 *
 * @param {String} data to send
 * @param {Function} called upon flush.
 * @api private
 */

JSONPPolling.prototype.doWrite = function (data, fn) {
  var self = this;

  if (!this.form) {
    var form = document.createElement('form');
    var area = document.createElement('textarea');
    var id = this.iframeId = 'eio_iframe_' + this.index;
    var iframe;

    form.className = 'socketio';
    form.style.position = 'absolute';
    form.style.top = '-1000px';
    form.style.left = '-1000px';
    form.target = id;
    form.method = 'POST';
    form.setAttribute('accept-charset', 'utf-8');
    area.name = 'd';
    form.appendChild(area);
    document.body.appendChild(form);

    this.form = form;
    this.area = area;
  }

  this.form.action = this.uri();

  function complete () {
    initIframe();
    fn();
  }

  function initIframe () {
    if (self.iframe) {
      try {
        self.form.removeChild(self.iframe);
      } catch (e) {
        self.onError('jsonp polling iframe removal error', e);
      }
    }

    try {
      // ie6 dynamic iframes with target="" support (thanks Chris Lambacher)
      var html = '<iframe src="javascript:0" name="'+ self.iframeId +'">';
      iframe = document.createElement(html);
    } catch (e) {
      iframe = document.createElement('iframe');
      iframe.name = self.iframeId;
      iframe.src = 'javascript:0';
    }

    iframe.id = self.iframeId;

    self.form.appendChild(iframe);
    self.iframe = iframe;
  }

  initIframe();

  // escape \n to prevent it from being converted into \r\n by some UAs
  // double escaping is required for escaped new lines because unescaping of new lines can be done safely on server-side
  data = data.replace(rEscapedNewline, '\\\n');
  this.area.value = data.replace(rNewline, '\\n');

  try {
    this.form.submit();
  } catch(e) {}

  if (this.iframe.attachEvent) {
    this.iframe.onreadystatechange = function(){
      if (self.iframe.readyState == 'complete') {
        complete();
      }
    };
  } else {
    this.iframe.onload = complete;
  }
};

}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./polling":17,"component-inherit":20}],16:[function(_dereq_,module,exports){
(function (global){
/**
 * Module requirements.
 */

var XMLHttpRequest = _dereq_('xmlhttprequest');
var Polling = _dereq_('./polling');
var Emitter = _dereq_('component-emitter');
var inherit = _dereq_('component-inherit');
var debug = _dereq_('debug')('engine.io-client:polling-xhr');

/**
 * Module exports.
 */

module.exports = XHR;
module.exports.Request = Request;

/**
 * Empty function
 */

function empty(){}

/**
 * XHR Polling constructor.
 *
 * @param {Object} opts
 * @api public
 */

function XHR(opts){
  Polling.call(this, opts);

  if (global.location) {
    var isSSL = 'https:' == location.protocol;
    var port = location.port;

    // some user agents have empty `location.port`
    if (!port) {
      port = isSSL ? 443 : 80;
    }

    this.xd = opts.hostname != global.location.hostname ||
      port != opts.port;
    this.xs = opts.secure != isSSL;
  }
}

/**
 * Inherits from Polling.
 */

inherit(XHR, Polling);

/**
 * XHR supports binary
 */

XHR.prototype.supportsBinary = true;

/**
 * Creates a request.
 *
 * @param {String} method
 * @api private
 */

XHR.prototype.request = function(opts){
  opts = opts || {};
  opts.uri = this.uri();
  opts.xd = this.xd;
  opts.xs = this.xs;
  opts.agent = this.agent || false;
  opts.supportsBinary = this.supportsBinary;
  opts.enablesXDR = this.enablesXDR;
  return new Request(opts);
};

/**
 * Sends data.
 *
 * @param {String} data to send.
 * @param {Function} called upon flush.
 * @api private
 */

XHR.prototype.doWrite = function(data, fn){
  var isBinary = typeof data !== 'string' && data !== undefined;
  var req = this.request({ method: 'POST', data: data, isBinary: isBinary });
  var self = this;
  req.on('success', fn);
  req.on('error', function(err){
    self.onError('xhr post error', err);
  });
  this.sendXhr = req;
};

/**
 * Starts a poll cycle.
 *
 * @api private
 */

XHR.prototype.doPoll = function(){
  debug('xhr poll');
  var req = this.request();
  var self = this;
  req.on('data', function(data){
    self.onData(data);
  });
  req.on('error', function(err){
    self.onError('xhr poll error', err);
  });
  this.pollXhr = req;
};

/**
 * Request constructor
 *
 * @param {Object} options
 * @api public
 */

function Request(opts){
  this.method = opts.method || 'GET';
  this.uri = opts.uri;
  this.xd = !!opts.xd;
  this.xs = !!opts.xs;
  this.async = false !== opts.async;
  this.data = undefined != opts.data ? opts.data : null;
  this.agent = opts.agent;
  this.isBinary = opts.isBinary;
  this.supportsBinary = opts.supportsBinary;
  this.enablesXDR = opts.enablesXDR;
  this.create();
}

/**
 * Mix in `Emitter`.
 */

Emitter(Request.prototype);

/**
 * Creates the XHR object and sends the request.
 *
 * @api private
 */

Request.prototype.create = function(){
  var xhr = this.xhr = new XMLHttpRequest({ agent: this.agent, xdomain: this.xd, xscheme: this.xs, enablesXDR: this.enablesXDR });
  var self = this;

  try {
    debug('xhr open %s: %s', this.method, this.uri);
    xhr.open(this.method, this.uri, this.async);
    if (this.supportsBinary) {
      // This has to be done after open because Firefox is stupid
      // http://stackoverflow.com/questions/13216903/get-binary-data-with-xmlhttprequest-in-a-firefox-extension
      xhr.responseType = 'arraybuffer';
    }

    if ('POST' == this.method) {
      try {
        if (this.isBinary) {
          xhr.setRequestHeader('Content-type', 'application/octet-stream');
        } else {
          xhr.setRequestHeader('Content-type', 'text/plain;charset=UTF-8');
        }
      } catch (e) {}
    }

    // ie6 check
    if ('withCredentials' in xhr) {
      xhr.withCredentials = true;
    }

    if (this.hasXDR()) {
      xhr.onload = function(){
        self.onLoad();
      };
      xhr.onerror = function(){
        self.onError(xhr.responseText);
      };
    } else {
      xhr.onreadystatechange = function(){
        if (4 != xhr.readyState) return;
        if (200 == xhr.status || 1223 == xhr.status) {
          self.onLoad();
        } else {
          // make sure the `error` event handler that's user-set
          // does not throw in the same tick and gets caught here
          setTimeout(function(){
            self.onError(xhr.status);
          }, 0);
        }
      };
    }

    debug('xhr data %s', this.data);
    xhr.send(this.data);
  } catch (e) {
    // Need to defer since .create() is called directly fhrom the constructor
    // and thus the 'error' event can only be only bound *after* this exception
    // occurs.  Therefore, also, we cannot throw here at all.
    setTimeout(function() {
      self.onError(e);
    }, 0);
    return;
  }

  if (global.document) {
    this.index = Request.requestsCount++;
    Request.requests[this.index] = this;
  }
};

/**
 * Called upon successful response.
 *
 * @api private
 */

Request.prototype.onSuccess = function(){
  this.emit('success');
  this.cleanup();
};

/**
 * Called if we have data.
 *
 * @api private
 */

Request.prototype.onData = function(data){
  this.emit('data', data);
  this.onSuccess();
};

/**
 * Called upon error.
 *
 * @api private
 */

Request.prototype.onError = function(err){
  this.emit('error', err);
  this.cleanup();
};

/**
 * Cleans up house.
 *
 * @api private
 */

Request.prototype.cleanup = function(){
  if ('undefined' == typeof this.xhr || null === this.xhr) {
    return;
  }
  // xmlhttprequest
  if (this.hasXDR()) {
    this.xhr.onload = this.xhr.onerror = empty;
  } else {
    this.xhr.onreadystatechange = empty;
  }

  try {
    this.xhr.abort();
  } catch(e) {}

  if (global.document) {
    delete Request.requests[this.index];
  }

  this.xhr = null;
};

/**
 * Called upon load.
 *
 * @api private
 */

Request.prototype.onLoad = function(){
  var data;
  try {
    var contentType;
    try {
      contentType = this.xhr.getResponseHeader('Content-Type');
    } catch (e) {}
    if (contentType === 'application/octet-stream') {
      data = this.xhr.response;
    } else {
      if (!this.supportsBinary) {
        data = this.xhr.responseText;
      } else {
        data = 'ok';
      }
    }
  } catch (e) {
    this.onError(e);
  }
  if (null != data) {
    this.onData(data);
  }
};

/**
 * Check if it has XDomainRequest.
 *
 * @api private
 */

Request.prototype.hasXDR = function(){
  return 'undefined' !== typeof global.XDomainRequest && !this.xs && this.enablesXDR;
};

/**
 * Aborts the request.
 *
 * @api public
 */

Request.prototype.abort = function(){
  this.cleanup();
};

/**
 * Aborts pending requests when unloading the window. This is needed to prevent
 * memory leaks (e.g. when using IE) and to ensure that no spurious error is
 * emitted.
 */

if (global.document) {
  Request.requestsCount = 0;
  Request.requests = {};
  if (global.attachEvent) {
    global.attachEvent('onunload', unloadHandler);
  } else if (global.addEventListener) {
    global.addEventListener('beforeunload', unloadHandler);
  }
}

function unloadHandler() {
  for (var i in Request.requests) {
    if (Request.requests.hasOwnProperty(i)) {
      Request.requests[i].abort();
    }
  }
}

}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./polling":17,"component-emitter":8,"component-inherit":20,"debug":9,"xmlhttprequest":19}],17:[function(_dereq_,module,exports){
/**
 * Module dependencies.
 */

var Transport = _dereq_('../transport');
var parseqs = _dereq_('parseqs');
var parser = _dereq_('engine.io-parser');
var inherit = _dereq_('component-inherit');
var debug = _dereq_('debug')('engine.io-client:polling');

/**
 * Module exports.
 */

module.exports = Polling;

/**
 * Is XHR2 supported?
 */

var hasXHR2 = (function() {
  var XMLHttpRequest = _dereq_('xmlhttprequest');
  var xhr = new XMLHttpRequest({ agent: this.agent, xdomain: false });
  return null != xhr.responseType;
})();

/**
 * Polling interface.
 *
 * @param {Object} opts
 * @api private
 */

function Polling(opts){
  var forceBase64 = (opts && opts.forceBase64);
  if (!hasXHR2 || forceBase64) {
    this.supportsBinary = false;
  }
  Transport.call(this, opts);
}

/**
 * Inherits from Transport.
 */

inherit(Polling, Transport);

/**
 * Transport name.
 */

Polling.prototype.name = 'polling';

/**
 * Opens the socket (triggers polling). We write a PING message to determine
 * when the transport is open.
 *
 * @api private
 */

Polling.prototype.doOpen = function(){
  this.poll();
};

/**
 * Pauses polling.
 *
 * @param {Function} callback upon buffers are flushed and transport is paused
 * @api private
 */

Polling.prototype.pause = function(onPause){
  var pending = 0;
  var self = this;

  this.readyState = 'pausing';

  function pause(){
    debug('paused');
    self.readyState = 'paused';
    onPause();
  }

  if (this.polling || !this.writable) {
    var total = 0;

    if (this.polling) {
      debug('we are currently polling - waiting to pause');
      total++;
      this.once('pollComplete', function(){
        debug('pre-pause polling complete');
        --total || pause();
      });
    }

    if (!this.writable) {
      debug('we are currently writing - waiting to pause');
      total++;
      this.once('drain', function(){
        debug('pre-pause writing complete');
        --total || pause();
      });
    }
  } else {
    pause();
  }
};

/**
 * Starts polling cycle.
 *
 * @api public
 */

Polling.prototype.poll = function(){
  debug('polling');
  this.polling = true;
  this.doPoll();
  this.emit('poll');
};

/**
 * Overloads onData to detect payloads.
 *
 * @api private
 */

Polling.prototype.onData = function(data){
  var self = this;
  debug('polling got data %s', data);
  var callback = function(packet, index, total) {
    // if its the first message we consider the transport open
    if ('opening' == self.readyState) {
      self.onOpen();
    }

    // if its a close packet, we close the ongoing requests
    if ('close' == packet.type) {
      self.onClose();
      return false;
    }

    // otherwise bypass onData and handle the message
    self.onPacket(packet);
  };

  // decode payload
  parser.decodePayload(data, this.socket.binaryType, callback);

  // if an event did not trigger closing
  if ('closed' != this.readyState) {
    // if we got data we're not polling
    this.polling = false;
    this.emit('pollComplete');

    if ('open' == this.readyState) {
      this.poll();
    } else {
      debug('ignoring poll - transport state "%s"', this.readyState);
    }
  }
};

/**
 * For polling, send a close packet.
 *
 * @api private
 */

Polling.prototype.doClose = function(){
  var self = this;

  function close(){
    debug('writing close packet');
    self.write([{ type: 'close' }]);
  }

  if ('open' == this.readyState) {
    debug('transport open - closing');
    close();
  } else {
    // in case we're trying to close while
    // handshaking is in progress (GH-164)
    debug('transport not open - deferring close');
    this.once('open', close);
  }
};

/**
 * Writes a packets payload.
 *
 * @param {Array} data packets
 * @param {Function} drain callback
 * @api private
 */

Polling.prototype.write = function(packets){
  var self = this;
  this.writable = false;
  var callbackfn = function() {
    self.writable = true;
    self.emit('drain');
  };

  var self = this;
  parser.encodePayload(packets, this.supportsBinary, function(data) {
    self.doWrite(data, callbackfn);
  });
};

/**
 * Generates uri for connection.
 *
 * @api private
 */

Polling.prototype.uri = function(){
  var query = this.query || {};
  var schema = this.secure ? 'https' : 'http';
  var port = '';

  // cache busting is forced
  if (false !== this.timestampRequests) {
    query[this.timestampParam] = +new Date + '-' + Transport.timestamps++;
  }

  if (!this.supportsBinary && !query.sid) {
    query.b64 = 1;
  }

  query = parseqs.encode(query);

  // avoid port if default for schema
  if (this.port && (('https' == schema && this.port != 443) ||
     ('http' == schema && this.port != 80))) {
    port = ':' + this.port;
  }

  // prepend ? to query
  if (query.length) {
    query = '?' + query;
  }

  return schema + '://' + this.hostname + port + this.path + query;
};

},{"../transport":13,"component-inherit":20,"debug":9,"engine.io-parser":21,"parseqs":29,"xmlhttprequest":19}],18:[function(_dereq_,module,exports){
/**
 * Module dependencies.
 */

var Transport = _dereq_('../transport');
var parser = _dereq_('engine.io-parser');
var parseqs = _dereq_('parseqs');
var inherit = _dereq_('component-inherit');
var debug = _dereq_('debug')('engine.io-client:websocket');

/**
 * `ws` exposes a WebSocket-compatible interface in
 * Node, or the `WebSocket` or `MozWebSocket` globals
 * in the browser.
 */

var WebSocket = _dereq_('ws');

/**
 * Module exports.
 */

module.exports = WS;

/**
 * WebSocket transport constructor.
 *
 * @api {Object} connection options
 * @api public
 */

function WS(opts){
  var forceBase64 = (opts && opts.forceBase64);
  if (forceBase64) {
    this.supportsBinary = false;
  }
  Transport.call(this, opts);
}

/**
 * Inherits from Transport.
 */

inherit(WS, Transport);

/**
 * Transport name.
 *
 * @api public
 */

WS.prototype.name = 'websocket';

/*
 * WebSockets support binary
 */

WS.prototype.supportsBinary = true;

/**
 * Opens socket.
 *
 * @api private
 */

WS.prototype.doOpen = function(){
  if (!this.check()) {
    // let probe timeout
    return;
  }

  var self = this;
  var uri = this.uri();
  var protocols = void(0);
  var opts = { agent: this.agent };

  this.ws = new WebSocket(uri, protocols, opts);

  if (this.ws.binaryType === undefined) {
    this.supportsBinary = false;
  }

  this.ws.binaryType = 'arraybuffer';
  this.addEventListeners();
};

/**
 * Adds event listeners to the socket
 *
 * @api private
 */

WS.prototype.addEventListeners = function(){
  var self = this;

  this.ws.onopen = function(){
    self.onOpen();
  };
  this.ws.onclose = function(){
    self.onClose();
  };
  this.ws.onmessage = function(ev){
    self.onData(ev.data);
  };
  this.ws.onerror = function(e){
    self.onError('websocket error', e);
  };
};

/**
 * Override `onData` to use a timer on iOS.
 * See: https://gist.github.com/mloughran/2052006
 *
 * @api private
 */

if ('undefined' != typeof navigator
  && /iPad|iPhone|iPod/i.test(navigator.userAgent)) {
  WS.prototype.onData = function(data){
    var self = this;
    setTimeout(function(){
      Transport.prototype.onData.call(self, data);
    }, 0);
  };
}

/**
 * Writes data to socket.
 *
 * @param {Array} array of packets.
 * @api private
 */

WS.prototype.write = function(packets){
  var self = this;
  this.writable = false;
  // encodePacket efficient as it uses WS framing
  // no need for encodePayload
  for (var i = 0, l = packets.length; i < l; i++) {
    parser.encodePacket(packets[i], this.supportsBinary, function(data) {
      //Sometimes the websocket has already been closed but the browser didn't
      //have a chance of informing us about it yet, in that case send will
      //throw an error
      try {
        self.ws.send(data);
      } catch (e){
        debug('websocket closed before onclose event');
      }
    });
  }

  function ondrain() {
    self.writable = true;
    self.emit('drain');
  }
  // fake drain
  // defer to next tick to allow Socket to clear writeBuffer
  setTimeout(ondrain, 0);
};

/**
 * Called upon close
 *
 * @api private
 */

WS.prototype.onClose = function(){
  Transport.prototype.onClose.call(this);
};

/**
 * Closes socket.
 *
 * @api private
 */

WS.prototype.doClose = function(){
  if (typeof this.ws !== 'undefined') {
    this.ws.close();
  }
};

/**
 * Generates uri for connection.
 *
 * @api private
 */

WS.prototype.uri = function(){
  var query = this.query || {};
  var schema = this.secure ? 'wss' : 'ws';
  var port = '';

  // avoid port if default for schema
  if (this.port && (('wss' == schema && this.port != 443)
    || ('ws' == schema && this.port != 80))) {
    port = ':' + this.port;
  }

  // append timestamp to URI
  if (this.timestampRequests) {
    query[this.timestampParam] = +new Date;
  }

  // communicate binary support capabilities
  if (!this.supportsBinary) {
    query.b64 = 1;
  }

  query = parseqs.encode(query);

  // prepend ? to query
  if (query.length) {
    query = '?' + query;
  }

  return schema + '://' + this.hostname + port + this.path + query;
};

/**
 * Feature detection for WebSocket.
 *
 * @return {Boolean} whether this transport is available.
 * @api public
 */

WS.prototype.check = function(){
  return !!WebSocket && !('__initialize' in WebSocket && this.name === WS.prototype.name);
};

},{"../transport":13,"component-inherit":20,"debug":9,"engine.io-parser":21,"parseqs":29,"ws":31}],19:[function(_dereq_,module,exports){
// browser shim for xmlhttprequest module
var hasCORS = _dereq_('has-cors');

module.exports = function(opts) {
  var xdomain = opts.xdomain;

  // scheme must be same when usign XDomainRequest
  // http://blogs.msdn.com/b/ieinternals/archive/2010/05/13/xdomainrequest-restrictions-limitations-and-workarounds.aspx
  var xscheme = opts.xscheme;

  // XDomainRequest has a flow of not sending cookie, therefore it should be disabled as a default.
  // https://github.com/Automattic/engine.io-client/pull/217
  var enablesXDR = opts.enablesXDR;

  // Use XDomainRequest for IE8 if enablesXDR is true
  // because loading bar keeps flashing when using jsonp-polling
  // https://github.com/yujiosaka/socke.io-ie8-loading-example
  try {
    if ('undefined' != typeof XDomainRequest && !xscheme && enablesXDR) {
      return new XDomainRequest();
    }
  } catch (e) { }

  // XMLHttpRequest can be disabled on IE
  try {
    if ('undefined' != typeof XMLHttpRequest && (!xdomain || hasCORS)) {
      return new XMLHttpRequest();
    }
  } catch (e) { }

  if (!xdomain) {
    try {
      return new ActiveXObject('Microsoft.XMLHTTP');
    } catch(e) { }
  }
}

},{"has-cors":34}],20:[function(_dereq_,module,exports){

module.exports = function(a, b){
  var fn = function(){};
  fn.prototype = b.prototype;
  a.prototype = new fn;
  a.prototype.constructor = a;
};
},{}],21:[function(_dereq_,module,exports){
(function (global){
/**
 * Module dependencies.
 */

var keys = _dereq_('./keys');
var sliceBuffer = _dereq_('arraybuffer.slice');
var base64encoder = _dereq_('base64-arraybuffer');
var after = _dereq_('after');
var utf8 = _dereq_('utf8');

/**
 * Check if we are running an android browser. That requires us to use
 * ArrayBuffer with polling transports...
 *
 * http://ghinda.net/jpeg-blob-ajax-android/
 */

var isAndroid = navigator.userAgent.match(/Android/i);

/**
 * Current protocol version.
 */

exports.protocol = 3;

/**
 * Packet types.
 */

var packets = exports.packets = {
    open:     0    // non-ws
  , close:    1    // non-ws
  , ping:     2
  , pong:     3
  , message:  4
  , upgrade:  5
  , noop:     6
};

var packetslist = keys(packets);

/**
 * Premade error packet.
 */

var err = { type: 'error', data: 'parser error' };

/**
 * Create a blob api even for blob builder when vendor prefixes exist
 */

var Blob = _dereq_('blob');

/**
 * Encodes a packet.
 *
 *     <packet type id> [ <data> ]
 *
 * Example:
 *
 *     5hello world
 *     3
 *     4
 *
 * Binary is encoded in an identical principle
 *
 * @api private
 */

exports.encodePacket = function (packet, supportsBinary, utf8encode, callback) {
  if ('function' == typeof supportsBinary) {
    callback = supportsBinary;
    supportsBinary = false;
  }

  if ('function' == typeof utf8encode) {
    callback = utf8encode;
    utf8encode = null;
  }

  var data = (packet.data === undefined)
    ? undefined
    : packet.data.buffer || packet.data;

  if (global.ArrayBuffer && data instanceof ArrayBuffer) {
    return encodeArrayBuffer(packet, supportsBinary, callback);
  } else if (Blob && data instanceof global.Blob) {
    return encodeBlob(packet, supportsBinary, callback);
  }

  // Sending data as a utf-8 string
  var encoded = packets[packet.type];

  // data fragment is optional
  if (undefined !== packet.data) {
    encoded += utf8encode ? utf8.encode(String(packet.data)) : String(packet.data);
  }

  return callback('' + encoded);

};

/**
 * Encode packet helpers for binary types
 */

function encodeArrayBuffer(packet, supportsBinary, callback) {
  if (!supportsBinary) {
    return exports.encodeBase64Packet(packet, callback);
  }

  var data = packet.data;
  var contentArray = new Uint8Array(data);
  var resultBuffer = new Uint8Array(1 + data.byteLength);

  resultBuffer[0] = packets[packet.type];
  for (var i = 0; i < contentArray.length; i++) {
    resultBuffer[i+1] = contentArray[i];
  }

  return callback(resultBuffer.buffer);
}

function encodeBlobAsArrayBuffer(packet, supportsBinary, callback) {
  if (!supportsBinary) {
    return exports.encodeBase64Packet(packet, callback);
  }

  var fr = new FileReader();
  fr.onload = function() {
    packet.data = fr.result;
    exports.encodePacket(packet, supportsBinary, true, callback);
  };
  return fr.readAsArrayBuffer(packet.data);
}

function encodeBlob(packet, supportsBinary, callback) {
  if (!supportsBinary) {
    return exports.encodeBase64Packet(packet, callback);
  }

  if (isAndroid) {
    return encodeBlobAsArrayBuffer(packet, supportsBinary, callback);
  }

  var length = new Uint8Array(1);
  length[0] = packets[packet.type];
  var blob = new Blob([length.buffer, packet.data]);

  return callback(blob);
}

/**
 * Encodes a packet with binary data in a base64 string
 *
 * @param {Object} packet, has `type` and `data`
 * @return {String} base64 encoded message
 */

exports.encodeBase64Packet = function(packet, callback) {
  var message = 'b' + exports.packets[packet.type];
  if (Blob && packet.data instanceof Blob) {
    var fr = new FileReader();
    fr.onload = function() {
      var b64 = fr.result.split(',')[1];
      callback(message + b64);
    };
    return fr.readAsDataURL(packet.data);
  }

  var b64data;
  try {
    b64data = String.fromCharCode.apply(null, new Uint8Array(packet.data));
  } catch (e) {
    // iPhone Safari doesn't let you apply with typed arrays
    var typed = new Uint8Array(packet.data);
    var basic = new Array(typed.length);
    for (var i = 0; i < typed.length; i++) {
      basic[i] = typed[i];
    }
    b64data = String.fromCharCode.apply(null, basic);
  }
  message += global.btoa(b64data);
  return callback(message);
};

/**
 * Decodes a packet. Changes format to Blob if requested.
 *
 * @return {Object} with `type` and `data` (if any)
 * @api private
 */

exports.decodePacket = function (data, binaryType, utf8decode) {
  // String data
  if (typeof data == 'string' || data === undefined) {
    if (data.charAt(0) == 'b') {
      return exports.decodeBase64Packet(data.substr(1), binaryType);
    }

    if (utf8decode) {
      try {
        data = utf8.decode(data);
      } catch (e) {
        return err;
      }
    }
    var type = data.charAt(0);

    if (Number(type) != type || !packetslist[type]) {
      return err;
    }

    if (data.length > 1) {
      return { type: packetslist[type], data: data.substring(1) };
    } else {
      return { type: packetslist[type] };
    }
  }

  var asArray = new Uint8Array(data);
  var type = asArray[0];
  var rest = sliceBuffer(data, 1);
  if (Blob && binaryType === 'blob') {
    rest = new Blob([rest]);
  }
  return { type: packetslist[type], data: rest };
};

/**
 * Decodes a packet encoded in a base64 string
 *
 * @param {String} base64 encoded message
 * @return {Object} with `type` and `data` (if any)
 */

exports.decodeBase64Packet = function(msg, binaryType) {
  var type = packetslist[msg.charAt(0)];
  if (!global.ArrayBuffer) {
    return { type: type, data: { base64: true, data: msg.substr(1) } };
  }

  var data = base64encoder.decode(msg.substr(1));

  if (binaryType === 'blob' && Blob) {
    data = new Blob([data]);
  }

  return { type: type, data: data };
};

/**
 * Encodes multiple messages (payload).
 *
 *     <length>:data
 *
 * Example:
 *
 *     11:hello world2:hi
 *
 * If any contents are binary, they will be encoded as base64 strings. Base64
 * encoded strings are marked with a b before the length specifier
 *
 * @param {Array} packets
 * @api private
 */

exports.encodePayload = function (packets, supportsBinary, callback) {
  if (typeof supportsBinary == 'function') {
    callback = supportsBinary;
    supportsBinary = null;
  }

  if (supportsBinary) {
    if (Blob && !isAndroid) {
      return exports.encodePayloadAsBlob(packets, callback);
    }

    return exports.encodePayloadAsArrayBuffer(packets, callback);
  }

  if (!packets.length) {
    return callback('0:');
  }

  function setLengthHeader(message) {
    return message.length + ':' + message;
  }

  function encodeOne(packet, doneCallback) {
    exports.encodePacket(packet, supportsBinary, true, function(message) {
      doneCallback(null, setLengthHeader(message));
    });
  }

  map(packets, encodeOne, function(err, results) {
    return callback(results.join(''));
  });
};

/**
 * Async array map using after
 */

function map(ary, each, done) {
  var result = new Array(ary.length);
  var next = after(ary.length, done);

  var eachWithIndex = function(i, el, cb) {
    each(el, function(error, msg) {
      result[i] = msg;
      cb(error, result);
    });
  };

  for (var i = 0; i < ary.length; i++) {
    eachWithIndex(i, ary[i], next);
  }
}

/*
 * Decodes data when a payload is maybe expected. Possible binary contents are
 * decoded from their base64 representation
 *
 * @param {String} data, callback method
 * @api public
 */

exports.decodePayload = function (data, binaryType, callback) {
  if (typeof data != 'string') {
    return exports.decodePayloadAsBinary(data, binaryType, callback);
  }

  if (typeof binaryType === 'function') {
    callback = binaryType;
    binaryType = null;
  }

  var packet;
  if (data == '') {
    // parser error - ignoring payload
    return callback(err, 0, 1);
  }

  var length = ''
    , n, msg;

  for (var i = 0, l = data.length; i < l; i++) {
    var chr = data.charAt(i);

    if (':' != chr) {
      length += chr;
    } else {
      if ('' == length || (length != (n = Number(length)))) {
        // parser error - ignoring payload
        return callback(err, 0, 1);
      }

      msg = data.substr(i + 1, n);

      if (length != msg.length) {
        // parser error - ignoring payload
        return callback(err, 0, 1);
      }

      if (msg.length) {
        packet = exports.decodePacket(msg, binaryType, true);

        if (err.type == packet.type && err.data == packet.data) {
          // parser error in individual packet - ignoring payload
          return callback(err, 0, 1);
        }

        var ret = callback(packet, i + n, l);
        if (false === ret) return;
      }

      // advance cursor
      i += n;
      length = '';
    }
  }

  if (length != '') {
    // parser error - ignoring payload
    return callback(err, 0, 1);
  }

};

/**
 * Encodes multiple messages (payload) as binary.
 *
 * <1 = binary, 0 = string><number from 0-9><number from 0-9>[...]<number
 * 255><data>
 *
 * Example:
 * 1 3 255 1 2 3, if the binary contents are interpreted as 8 bit integers
 *
 * @param {Array} packets
 * @return {ArrayBuffer} encoded payload
 * @api private
 */

exports.encodePayloadAsArrayBuffer = function(packets, callback) {
  if (!packets.length) {
    return callback(new ArrayBuffer(0));
  }

  function encodeOne(packet, doneCallback) {
    exports.encodePacket(packet, true, true, function(data) {
      return doneCallback(null, data);
    });
  }

  map(packets, encodeOne, function(err, encodedPackets) {
    var totalLength = encodedPackets.reduce(function(acc, p) {
      var len;
      if (typeof p === 'string'){
        len = p.length;
      } else {
        len = p.byteLength;
      }
      return acc + len.toString().length + len + 2; // string/binary identifier + separator = 2
    }, 0);

    var resultArray = new Uint8Array(totalLength);

    var bufferIndex = 0;
    encodedPackets.forEach(function(p) {
      var isString = typeof p === 'string';
      var ab = p;
      if (isString) {
        var view = new Uint8Array(p.length);
        for (var i = 0; i < p.length; i++) {
          view[i] = p.charCodeAt(i);
        }
        ab = view.buffer;
      }

      if (isString) { // not true binary
        resultArray[bufferIndex++] = 0;
      } else { // true binary
        resultArray[bufferIndex++] = 1;
      }

      var lenStr = ab.byteLength.toString();
      for (var i = 0; i < lenStr.length; i++) {
        resultArray[bufferIndex++] = parseInt(lenStr[i]);
      }
      resultArray[bufferIndex++] = 255;

      var view = new Uint8Array(ab);
      for (var i = 0; i < view.length; i++) {
        resultArray[bufferIndex++] = view[i];
      }
    });

    return callback(resultArray.buffer);
  });
};

/**
 * Encode as Blob
 */

exports.encodePayloadAsBlob = function(packets, callback) {
  function encodeOne(packet, doneCallback) {
    exports.encodePacket(packet, true, true, function(encoded) {
      var binaryIdentifier = new Uint8Array(1);
      binaryIdentifier[0] = 1;
      if (typeof encoded === 'string') {
        var view = new Uint8Array(encoded.length);
        for (var i = 0; i < encoded.length; i++) {
          view[i] = encoded.charCodeAt(i);
        }
        encoded = view.buffer;
        binaryIdentifier[0] = 0;
      }

      var len = (encoded instanceof ArrayBuffer)
        ? encoded.byteLength
        : encoded.size;

      var lenStr = len.toString();
      var lengthAry = new Uint8Array(lenStr.length + 1);
      for (var i = 0; i < lenStr.length; i++) {
        lengthAry[i] = parseInt(lenStr[i]);
      }
      lengthAry[lenStr.length] = 255;

      if (Blob) {
        var blob = new Blob([binaryIdentifier.buffer, lengthAry.buffer, encoded]);
        doneCallback(null, blob);
      }
    });
  }

  map(packets, encodeOne, function(err, results) {
    return callback(new Blob(results));
  });
};

/*
 * Decodes data when a payload is maybe expected. Strings are decoded by
 * interpreting each byte as a key code for entries marked to start with 0. See
 * description of encodePayloadAsBinary
 *
 * @param {ArrayBuffer} data, callback method
 * @api public
 */

exports.decodePayloadAsBinary = function (data, binaryType, callback) {
  if (typeof binaryType === 'function') {
    callback = binaryType;
    binaryType = null;
  }

  var bufferTail = data;
  var buffers = [];

  var numberTooLong = false;
  while (bufferTail.byteLength > 0) {
    var tailArray = new Uint8Array(bufferTail);
    var isString = tailArray[0] === 0;
    var msgLength = '';

    for (var i = 1; ; i++) {
      if (tailArray[i] == 255) break;

      if (msgLength.length > 310) {
        numberTooLong = true;
        break;
      }

      msgLength += tailArray[i];
    }

    if(numberTooLong) return callback(err, 0, 1);

    bufferTail = sliceBuffer(bufferTail, 2 + msgLength.length);
    msgLength = parseInt(msgLength);

    var msg = sliceBuffer(bufferTail, 0, msgLength);
    if (isString) {
      try {
        msg = String.fromCharCode.apply(null, new Uint8Array(msg));
      } catch (e) {
        // iPhone Safari doesn't let you apply to typed arrays
        var typed = new Uint8Array(msg);
        msg = '';
        for (var i = 0; i < typed.length; i++) {
          msg += String.fromCharCode(typed[i]);
        }
      }
    }

    buffers.push(msg);
    bufferTail = sliceBuffer(bufferTail, msgLength);
  }

  var total = buffers.length;
  buffers.forEach(function(buffer, i) {
    callback(exports.decodePacket(buffer, binaryType, true), i, total);
  });
};

}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./keys":22,"after":23,"arraybuffer.slice":24,"base64-arraybuffer":25,"blob":26,"utf8":27}],22:[function(_dereq_,module,exports){

/**
 * Gets the keys for an object.
 *
 * @return {Array} keys
 * @api private
 */

module.exports = Object.keys || function keys (obj){
  var arr = [];
  var has = Object.prototype.hasOwnProperty;

  for (var i in obj) {
    if (has.call(obj, i)) {
      arr.push(i);
    }
  }
  return arr;
};

},{}],23:[function(_dereq_,module,exports){
module.exports = after

function after(count, callback, err_cb) {
    var bail = false
    err_cb = err_cb || noop
    proxy.count = count

    return (count === 0) ? callback() : proxy

    function proxy(err, result) {
        if (proxy.count <= 0) {
            throw new Error('after called too many times')
        }
        --proxy.count

        // after first error, rest are passed to err_cb
        if (err) {
            bail = true
            callback(err)
            // future error callbacks will go to error handler
            callback = err_cb
        } else if (proxy.count === 0 && !bail) {
            callback(null, result)
        }
    }
}

function noop() {}

},{}],24:[function(_dereq_,module,exports){
/**
 * An abstraction for slicing an arraybuffer even when
 * ArrayBuffer.prototype.slice is not supported
 *
 * @api public
 */

module.exports = function(arraybuffer, start, end) {
  var bytes = arraybuffer.byteLength;
  start = start || 0;
  end = end || bytes;

  if (arraybuffer.slice) { return arraybuffer.slice(start, end); }

  if (start < 0) { start += bytes; }
  if (end < 0) { end += bytes; }
  if (end > bytes) { end = bytes; }

  if (start >= bytes || start >= end || bytes === 0) {
    return new ArrayBuffer(0);
  }

  var abv = new Uint8Array(arraybuffer);
  var result = new Uint8Array(end - start);
  for (var i = start, ii = 0; i < end; i++, ii++) {
    result[ii] = abv[i];
  }
  return result.buffer;
};

},{}],25:[function(_dereq_,module,exports){
/*
 * base64-arraybuffer
 * https://github.com/niklasvh/base64-arraybuffer
 *
 * Copyright (c) 2012 Niklas von Hertzen
 * Licensed under the MIT license.
 */
(function(chars){
  "use strict";

  exports.encode = function(arraybuffer) {
    var bytes = new Uint8Array(arraybuffer),
    i, len = bytes.length, base64 = "";

    for (i = 0; i < len; i+=3) {
      base64 += chars[bytes[i] >> 2];
      base64 += chars[((bytes[i] & 3) << 4) | (bytes[i + 1] >> 4)];
      base64 += chars[((bytes[i + 1] & 15) << 2) | (bytes[i + 2] >> 6)];
      base64 += chars[bytes[i + 2] & 63];
    }

    if ((len % 3) === 2) {
      base64 = base64.substring(0, base64.length - 1) + "=";
    } else if (len % 3 === 1) {
      base64 = base64.substring(0, base64.length - 2) + "==";
    }

    return base64;
  };

  exports.decode =  function(base64) {
    var bufferLength = base64.length * 0.75,
    len = base64.length, i, p = 0,
    encoded1, encoded2, encoded3, encoded4;

    if (base64[base64.length - 1] === "=") {
      bufferLength--;
      if (base64[base64.length - 2] === "=") {
        bufferLength--;
      }
    }

    var arraybuffer = new ArrayBuffer(bufferLength),
    bytes = new Uint8Array(arraybuffer);

    for (i = 0; i < len; i+=4) {
      encoded1 = chars.indexOf(base64[i]);
      encoded2 = chars.indexOf(base64[i+1]);
      encoded3 = chars.indexOf(base64[i+2]);
      encoded4 = chars.indexOf(base64[i+3]);

      bytes[p++] = (encoded1 << 2) | (encoded2 >> 4);
      bytes[p++] = ((encoded2 & 15) << 4) | (encoded3 >> 2);
      bytes[p++] = ((encoded3 & 3) << 6) | (encoded4 & 63);
    }

    return arraybuffer;
  };
})("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/");

},{}],26:[function(_dereq_,module,exports){
(function (global){
/**
 * Create a blob builder even when vendor prefixes exist
 */

var BlobBuilder = global.BlobBuilder
  || global.WebKitBlobBuilder
  || global.MSBlobBuilder
  || global.MozBlobBuilder;

/**
 * Check if Blob constructor is supported
 */

var blobSupported = (function() {
  try {
    var b = new Blob(['hi']);
    return b.size == 2;
  } catch(e) {
    return false;
  }
})();

/**
 * Check if BlobBuilder is supported
 */

var blobBuilderSupported = BlobBuilder
  && BlobBuilder.prototype.append
  && BlobBuilder.prototype.getBlob;

function BlobBuilderConstructor(ary, options) {
  options = options || {};

  var bb = new BlobBuilder();
  for (var i = 0; i < ary.length; i++) {
    bb.append(ary[i]);
  }
  return (options.type) ? bb.getBlob(options.type) : bb.getBlob();
};

module.exports = (function() {
  if (blobSupported) {
    return global.Blob;
  } else if (blobBuilderSupported) {
    return BlobBuilderConstructor;
  } else {
    return undefined;
  }
})();

}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],27:[function(_dereq_,module,exports){
(function (global){
/*! http://mths.be/utf8js v2.0.0 by @mathias */
;(function(root) {

	// Detect free variables `exports`
	var freeExports = typeof exports == 'object' && exports;

	// Detect free variable `module`
	var freeModule = typeof module == 'object' && module &&
		module.exports == freeExports && module;

	// Detect free variable `global`, from Node.js or Browserified code,
	// and use it as `root`
	var freeGlobal = typeof global == 'object' && global;
	if (freeGlobal.global === freeGlobal || freeGlobal.window === freeGlobal) {
		root = freeGlobal;
	}

	/*--------------------------------------------------------------------------*/

	var stringFromCharCode = String.fromCharCode;

	// Taken from http://mths.be/punycode
	function ucs2decode(string) {
		var output = [];
		var counter = 0;
		var length = string.length;
		var value;
		var extra;
		while (counter < length) {
			value = string.charCodeAt(counter++);
			if (value >= 0xD800 && value <= 0xDBFF && counter < length) {
				// high surrogate, and there is a next character
				extra = string.charCodeAt(counter++);
				if ((extra & 0xFC00) == 0xDC00) { // low surrogate
					output.push(((value & 0x3FF) << 10) + (extra & 0x3FF) + 0x10000);
				} else {
					// unmatched surrogate; only append this code unit, in case the next
					// code unit is the high surrogate of a surrogate pair
					output.push(value);
					counter--;
				}
			} else {
				output.push(value);
			}
		}
		return output;
	}

	// Taken from http://mths.be/punycode
	function ucs2encode(array) {
		var length = array.length;
		var index = -1;
		var value;
		var output = '';
		while (++index < length) {
			value = array[index];
			if (value > 0xFFFF) {
				value -= 0x10000;
				output += stringFromCharCode(value >>> 10 & 0x3FF | 0xD800);
				value = 0xDC00 | value & 0x3FF;
			}
			output += stringFromCharCode(value);
		}
		return output;
	}

	/*--------------------------------------------------------------------------*/

	function createByte(codePoint, shift) {
		return stringFromCharCode(((codePoint >> shift) & 0x3F) | 0x80);
	}

	function encodeCodePoint(codePoint) {
		if ((codePoint & 0xFFFFFF80) == 0) { // 1-byte sequence
			return stringFromCharCode(codePoint);
		}
		var symbol = '';
		if ((codePoint & 0xFFFFF800) == 0) { // 2-byte sequence
			symbol = stringFromCharCode(((codePoint >> 6) & 0x1F) | 0xC0);
		}
		else if ((codePoint & 0xFFFF0000) == 0) { // 3-byte sequence
			symbol = stringFromCharCode(((codePoint >> 12) & 0x0F) | 0xE0);
			symbol += createByte(codePoint, 6);
		}
		else if ((codePoint & 0xFFE00000) == 0) { // 4-byte sequence
			symbol = stringFromCharCode(((codePoint >> 18) & 0x07) | 0xF0);
			symbol += createByte(codePoint, 12);
			symbol += createByte(codePoint, 6);
		}
		symbol += stringFromCharCode((codePoint & 0x3F) | 0x80);
		return symbol;
	}

	function utf8encode(string) {
		var codePoints = ucs2decode(string);

		// console.log(JSON.stringify(codePoints.map(function(x) {
		// 	return 'U+' + x.toString(16).toUpperCase();
		// })));

		var length = codePoints.length;
		var index = -1;
		var codePoint;
		var byteString = '';
		while (++index < length) {
			codePoint = codePoints[index];
			byteString += encodeCodePoint(codePoint);
		}
		return byteString;
	}

	/*--------------------------------------------------------------------------*/

	function readContinuationByte() {
		if (byteIndex >= byteCount) {
			throw Error('Invalid byte index');
		}

		var continuationByte = byteArray[byteIndex] & 0xFF;
		byteIndex++;

		if ((continuationByte & 0xC0) == 0x80) {
			return continuationByte & 0x3F;
		}

		// If we end up here, it’s not a continuation byte
		throw Error('Invalid continuation byte');
	}

	function decodeSymbol() {
		var byte1;
		var byte2;
		var byte3;
		var byte4;
		var codePoint;

		if (byteIndex > byteCount) {
			throw Error('Invalid byte index');
		}

		if (byteIndex == byteCount) {
			return false;
		}

		// Read first byte
		byte1 = byteArray[byteIndex] & 0xFF;
		byteIndex++;

		// 1-byte sequence (no continuation bytes)
		if ((byte1 & 0x80) == 0) {
			return byte1;
		}

		// 2-byte sequence
		if ((byte1 & 0xE0) == 0xC0) {
			var byte2 = readContinuationByte();
			codePoint = ((byte1 & 0x1F) << 6) | byte2;
			if (codePoint >= 0x80) {
				return codePoint;
			} else {
				throw Error('Invalid continuation byte');
			}
		}

		// 3-byte sequence (may include unpaired surrogates)
		if ((byte1 & 0xF0) == 0xE0) {
			byte2 = readContinuationByte();
			byte3 = readContinuationByte();
			codePoint = ((byte1 & 0x0F) << 12) | (byte2 << 6) | byte3;
			if (codePoint >= 0x0800) {
				return codePoint;
			} else {
				throw Error('Invalid continuation byte');
			}
		}

		// 4-byte sequence
		if ((byte1 & 0xF8) == 0xF0) {
			byte2 = readContinuationByte();
			byte3 = readContinuationByte();
			byte4 = readContinuationByte();
			codePoint = ((byte1 & 0x0F) << 0x12) | (byte2 << 0x0C) |
				(byte3 << 0x06) | byte4;
			if (codePoint >= 0x010000 && codePoint <= 0x10FFFF) {
				return codePoint;
			}
		}

		throw Error('Invalid UTF-8 detected');
	}

	var byteArray;
	var byteCount;
	var byteIndex;
	function utf8decode(byteString) {
		byteArray = ucs2decode(byteString);
		byteCount = byteArray.length;
		byteIndex = 0;
		var codePoints = [];
		var tmp;
		while ((tmp = decodeSymbol()) !== false) {
			codePoints.push(tmp);
		}
		return ucs2encode(codePoints);
	}

	/*--------------------------------------------------------------------------*/

	var utf8 = {
		'version': '2.0.0',
		'encode': utf8encode,
		'decode': utf8decode
	};

	// Some AMD build optimizers, like r.js, check for specific condition patterns
	// like the following:
	if (
		typeof define == 'function' &&
		typeof define.amd == 'object' &&
		define.amd
	) {
		define(function() {
			return utf8;
		});
	}	else if (freeExports && !freeExports.nodeType) {
		if (freeModule) { // in Node.js or RingoJS v0.8.0+
			freeModule.exports = utf8;
		} else { // in Narwhal or RingoJS v0.7.0-
			var object = {};
			var hasOwnProperty = object.hasOwnProperty;
			for (var key in utf8) {
				hasOwnProperty.call(utf8, key) && (freeExports[key] = utf8[key]);
			}
		}
	} else { // in Rhino or a web browser
		root.utf8 = utf8;
	}

}(this));

}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],28:[function(_dereq_,module,exports){
(function (global){
/**
 * JSON parse.
 *
 * @see Based on jQuery#parseJSON (MIT) and JSON2
 * @api private
 */

var rvalidchars = /^[\],:{}\s]*$/;
var rvalidescape = /\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g;
var rvalidtokens = /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g;
var rvalidbraces = /(?:^|:|,)(?:\s*\[)+/g;
var rtrimLeft = /^\s+/;
var rtrimRight = /\s+$/;

module.exports = function parsejson(data) {
  if ('string' != typeof data || !data) {
    return null;
  }

  data = data.replace(rtrimLeft, '').replace(rtrimRight, '');

  // Attempt to parse using the native JSON parser first
  if (global.JSON && JSON.parse) {
    return JSON.parse(data);
  }

  if (rvalidchars.test(data.replace(rvalidescape, '@')
      .replace(rvalidtokens, ']')
      .replace(rvalidbraces, ''))) {
    return (new Function('return ' + data))();
  }
};
}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],29:[function(_dereq_,module,exports){
/**
 * Compiles a querystring
 * Returns string representation of the object
 *
 * @param {Object}
 * @api private
 */

exports.encode = function (obj) {
  var str = '';

  for (var i in obj) {
    if (obj.hasOwnProperty(i)) {
      if (str.length) str += '&';
      str += encodeURIComponent(i) + '=' + encodeURIComponent(obj[i]);
    }
  }

  return str;
};

/**
 * Parses a simple querystring into an object
 *
 * @param {String} qs
 * @api private
 */

exports.decode = function(qs){
  var qry = {};
  var pairs = qs.split('&');
  for (var i = 0, l = pairs.length; i < l; i++) {
    var pair = pairs[i].split('=');
    qry[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1]);
  }
  return qry;
};

},{}],30:[function(_dereq_,module,exports){
/**
 * Parses an URI
 *
 * @author Steven Levithan <stevenlevithan.com> (MIT license)
 * @api private
 */

var re = /^(?:(?![^:@]+:[^:@\/]*@)(http|https|ws|wss):\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?((?:[a-f0-9]{0,4}:){2,7}[a-f0-9]{0,4}|[^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/;

var parts = [
    'source', 'protocol', 'authority', 'userInfo', 'user', 'password', 'host', 'port', 'relative', 'path', 'directory', 'file', 'query', 'anchor'
];

module.exports = function parseuri(str) {
    var src = str,
        b = str.indexOf('['),
        e = str.indexOf(']');

    if (b != -1 && e != -1) {
        str = str.substring(0, b) + str.substring(b, e).replace(/:/g, ';') + str.substring(e, str.length);
    }

    var m = re.exec(str || ''),
        uri = {},
        i = 14;

    while (i--) {
        uri[parts[i]] = m[i] || '';
    }

    if (b != -1 && e != -1) {
        uri.source = src;
        uri.host = uri.host.substring(1, uri.host.length - 1).replace(/;/g, ':');
        uri.authority = uri.authority.replace('[', '').replace(']', '').replace(/;/g, ':');
        uri.ipv6uri = true;
    }

    return uri;
};

},{}],31:[function(_dereq_,module,exports){

/**
 * Module dependencies.
 */

var global = (function() { return this; })();

/**
 * WebSocket constructor.
 */

var WebSocket = global.WebSocket || global.MozWebSocket;

/**
 * Module exports.
 */

module.exports = WebSocket ? ws : null;

/**
 * WebSocket constructor.
 *
 * The third `opts` options object gets ignored in web browsers, since it's
 * non-standard, and throws a TypeError if passed to the constructor.
 * See: https://github.com/einaros/ws/issues/227
 *
 * @param {String} uri
 * @param {Array} protocols (optional)
 * @param {Object) opts (optional)
 * @api public
 */

function ws(uri, protocols, opts) {
  var instance;
  if (protocols) {
    instance = new WebSocket(uri, protocols);
  } else {
    instance = new WebSocket(uri);
  }
  return instance;
}

if (WebSocket) ws.prototype = WebSocket.prototype;

},{}],32:[function(_dereq_,module,exports){
(function (global){

/*
 * Module requirements.
 */

var isArray = _dereq_('isarray');

/**
 * Module exports.
 */

module.exports = hasBinary;

/**
 * Checks for binary data.
 *
 * Right now only Buffer and ArrayBuffer are supported..
 *
 * @param {Object} anything
 * @api public
 */

function hasBinary(data) {

  function _hasBinary(obj) {
    if (!obj) return false;

    if ( (global.Buffer && global.Buffer.isBuffer(obj)) ||
         (global.ArrayBuffer && obj instanceof ArrayBuffer) ||
         (global.Blob && obj instanceof Blob) ||
         (global.File && obj instanceof File)
        ) {
      return true;
    }

    if (isArray(obj)) {
      for (var i = 0; i < obj.length; i++) {
          if (_hasBinary(obj[i])) {
              return true;
          }
      }
    } else if (obj && 'object' == typeof obj) {
      if (obj.toJSON) {
        obj = obj.toJSON();
      }

      for (var key in obj) {
        if (obj.hasOwnProperty(key) && _hasBinary(obj[key])) {
          return true;
        }
      }
    }

    return false;
  }

  return _hasBinary(data);
}

}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"isarray":33}],33:[function(_dereq_,module,exports){
module.exports = Array.isArray || function (arr) {
  return Object.prototype.toString.call(arr) == '[object Array]';
};

},{}],34:[function(_dereq_,module,exports){

/**
 * Module dependencies.
 */

var global = _dereq_('global');

/**
 * Module exports.
 *
 * Logic borrowed from Modernizr:
 *
 *   - https://github.com/Modernizr/Modernizr/blob/master/feature-detects/cors.js
 */

try {
  module.exports = 'XMLHttpRequest' in global &&
    'withCredentials' in new global.XMLHttpRequest();
} catch (err) {
  // if XMLHttp support is disabled in IE then it will throw
  // when trying to create
  module.exports = false;
}

},{"global":35}],35:[function(_dereq_,module,exports){

/**
 * Returns `this`. Execute this without a "context" (i.e. without it being
 * attached to an object of the left-hand side), and `this` points to the
 * "global" scope of the current JS execution.
 */

module.exports = (function () { return this; })();

},{}],36:[function(_dereq_,module,exports){

var indexOf = [].indexOf;

module.exports = function(arr, obj){
  if (indexOf) return arr.indexOf(obj);
  for (var i = 0; i < arr.length; ++i) {
    if (arr[i] === obj) return i;
  }
  return -1;
};
},{}],37:[function(_dereq_,module,exports){

/**
 * HOP ref.
 */

var has = Object.prototype.hasOwnProperty;

/**
 * Return own keys in `obj`.
 *
 * @param {Object} obj
 * @return {Array}
 * @api public
 */

exports.keys = Object.keys || function(obj){
  var keys = [];
  for (var key in obj) {
    if (has.call(obj, key)) {
      keys.push(key);
    }
  }
  return keys;
};

/**
 * Return own values in `obj`.
 *
 * @param {Object} obj
 * @return {Array}
 * @api public
 */

exports.values = function(obj){
  var vals = [];
  for (var key in obj) {
    if (has.call(obj, key)) {
      vals.push(obj[key]);
    }
  }
  return vals;
};

/**
 * Merge `b` into `a`.
 *
 * @param {Object} a
 * @param {Object} b
 * @return {Object} a
 * @api public
 */

exports.merge = function(a, b){
  for (var key in b) {
    if (has.call(b, key)) {
      a[key] = b[key];
    }
  }
  return a;
};

/**
 * Return length of `obj`.
 *
 * @param {Object} obj
 * @return {Number}
 * @api public
 */

exports.length = function(obj){
  return exports.keys(obj).length;
};

/**
 * Check if `obj` is empty.
 *
 * @param {Object} obj
 * @return {Boolean}
 * @api public
 */

exports.isEmpty = function(obj){
  return 0 == exports.length(obj);
};
},{}],38:[function(_dereq_,module,exports){
/**
 * Parses an URI
 *
 * @author Steven Levithan <stevenlevithan.com> (MIT license)
 * @api private
 */

var re = /^(?:(?![^:@]+:[^:@\/]*@)(http|https|ws|wss):\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?((?:[a-f0-9]{0,4}:){2,7}[a-f0-9]{0,4}|[^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/;

var parts = [
    'source', 'protocol', 'authority', 'userInfo', 'user', 'password', 'host'
  , 'port', 'relative', 'path', 'directory', 'file', 'query', 'anchor'
];

module.exports = function parseuri(str) {
  var m = re.exec(str || '')
    , uri = {}
    , i = 14;

  while (i--) {
    uri[parts[i]] = m[i] || '';
  }

  return uri;
};

},{}],39:[function(_dereq_,module,exports){
(function (global){
/*global Blob,File*/

/**
 * Module requirements
 */

var isArray = _dereq_('isarray');
var isBuf = _dereq_('./is-buffer');

/**
 * Replaces every Buffer | ArrayBuffer in packet with a numbered placeholder.
 * Anything with blobs or files should be fed through removeBlobs before coming
 * here.
 *
 * @param {Object} packet - socket.io event packet
 * @return {Object} with deconstructed packet and list of buffers
 * @api public
 */

exports.deconstructPacket = function(packet){
  var buffers = [];
  var packetData = packet.data;

  function _deconstructPacket(data) {
    if (!data) return data;

    if (isBuf(data)) {
      var placeholder = { _placeholder: true, num: buffers.length };
      buffers.push(data);
      return placeholder;
    } else if (isArray(data)) {
      var newData = new Array(data.length);
      for (var i = 0; i < data.length; i++) {
        newData[i] = _deconstructPacket(data[i]);
      }
      return newData;
    } else if ('object' == typeof data && !(data instanceof Date)) {
      var newData = {};
      for (var key in data) {
        newData[key] = _deconstructPacket(data[key]);
      }
      return newData;
    }
    return data;
  }

  var pack = packet;
  pack.data = _deconstructPacket(packetData);
  pack.attachments = buffers.length; // number of binary 'attachments'
  return {packet: pack, buffers: buffers};
};

/**
 * Reconstructs a binary packet from its placeholder packet and buffers
 *
 * @param {Object} packet - event packet with placeholders
 * @param {Array} buffers - binary buffers to put in placeholder positions
 * @return {Object} reconstructed packet
 * @api public
 */

exports.reconstructPacket = function(packet, buffers) {
  var curPlaceHolder = 0;

  function _reconstructPacket(data) {
    if (data && data._placeholder) {
      var buf = buffers[data.num]; // appropriate buffer (should be natural order anyway)
      return buf;
    } else if (isArray(data)) {
      for (var i = 0; i < data.length; i++) {
        data[i] = _reconstructPacket(data[i]);
      }
      return data;
    } else if (data && 'object' == typeof data) {
      for (var key in data) {
        data[key] = _reconstructPacket(data[key]);
      }
      return data;
    }
    return data;
  }

  packet.data = _reconstructPacket(packet.data);
  packet.attachments = undefined; // no longer useful
  return packet;
};

/**
 * Asynchronously removes Blobs or Files from data via
 * FileReader's readAsArrayBuffer method. Used before encoding
 * data as msgpack. Calls callback with the blobless data.
 *
 * @param {Object} data
 * @param {Function} callback
 * @api private
 */

exports.removeBlobs = function(data, callback) {
  function _removeBlobs(obj, curKey, containingObject) {
    if (!obj) return obj;

    // convert any blob
    if ((global.Blob && obj instanceof Blob) ||
        (global.File && obj instanceof File)) {
      pendingBlobs++;

      // async filereader
      var fileReader = new FileReader();
      fileReader.onload = function() { // this.result == arraybuffer
        if (containingObject) {
          containingObject[curKey] = this.result;
        }
        else {
          bloblessData = this.result;
        }

        // if nothing pending its callback time
        if(! --pendingBlobs) {
          callback(bloblessData);
        }
      };

      fileReader.readAsArrayBuffer(obj); // blob -> arraybuffer
    } else if (isArray(obj)) { // handle array
      for (var i = 0; i < obj.length; i++) {
        _removeBlobs(obj[i], i, obj);
      }
    } else if (obj && 'object' == typeof obj && !isBuf(obj)) { // and object
      for (var key in obj) {
        _removeBlobs(obj[key], key, obj);
      }
    }
  }

  var pendingBlobs = 0;
  var bloblessData = data;
  _removeBlobs(bloblessData);
  if (!pendingBlobs) {
    callback(bloblessData);
  }
};

}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./is-buffer":41,"isarray":42}],40:[function(_dereq_,module,exports){

/**
 * Module dependencies.
 */

var debug = _dereq_('debug')('socket.io-parser');
var json = _dereq_('json3');
var isArray = _dereq_('isarray');
var Emitter = _dereq_('component-emitter');
var binary = _dereq_('./binary');
var isBuf = _dereq_('./is-buffer');

/**
 * Protocol version.
 *
 * @api public
 */

exports.protocol = 4;

/**
 * Packet types.
 *
 * @api public
 */

exports.types = [
  'CONNECT',
  'DISCONNECT',
  'EVENT',
  'BINARY_EVENT',
  'ACK',
  'BINARY_ACK',
  'ERROR'
];

/**
 * Packet type `connect`.
 *
 * @api public
 */

exports.CONNECT = 0;

/**
 * Packet type `disconnect`.
 *
 * @api public
 */

exports.DISCONNECT = 1;

/**
 * Packet type `event`.
 *
 * @api public
 */

exports.EVENT = 2;

/**
 * Packet type `ack`.
 *
 * @api public
 */

exports.ACK = 3;

/**
 * Packet type `error`.
 *
 * @api public
 */

exports.ERROR = 4;

/**
 * Packet type 'binary event'
 *
 * @api public
 */

exports.BINARY_EVENT = 5;

/**
 * Packet type `binary ack`. For acks with binary arguments.
 *
 * @api public
 */

exports.BINARY_ACK = 6;

/**
 * Encoder constructor.
 *
 * @api public
 */

exports.Encoder = Encoder;

/**
 * Decoder constructor.
 *
 * @api public
 */

exports.Decoder = Decoder;

/**
 * A socket.io Encoder instance
 *
 * @api public
 */

function Encoder() {}

/**
 * Encode a packet as a single string if non-binary, or as a
 * buffer sequence, depending on packet type.
 *
 * @param {Object} obj - packet object
 * @param {Function} callback - function to handle encodings (likely engine.write)
 * @return Calls callback with Array of encodings
 * @api public
 */

Encoder.prototype.encode = function(obj, callback){
  debug('encoding packet %j', obj);

  if (exports.BINARY_EVENT == obj.type || exports.BINARY_ACK == obj.type) {
    encodeAsBinary(obj, callback);
  }
  else {
    var encoding = encodeAsString(obj);
    callback([encoding]);
  }
};

/**
 * Encode packet as string.
 *
 * @param {Object} packet
 * @return {String} encoded
 * @api private
 */

function encodeAsString(obj) {
  var str = '';
  var nsp = false;

  // first is type
  str += obj.type;

  // attachments if we have them
  if (exports.BINARY_EVENT == obj.type || exports.BINARY_ACK == obj.type) {
    str += obj.attachments;
    str += '-';
  }

  // if we have a namespace other than `/`
  // we append it followed by a comma `,`
  if (obj.nsp && '/' != obj.nsp) {
    nsp = true;
    str += obj.nsp;
  }

  // immediately followed by the id
  if (null != obj.id) {
    if (nsp) {
      str += ',';
      nsp = false;
    }
    str += obj.id;
  }

  // json data
  if (null != obj.data) {
    if (nsp) str += ',';
    str += json.stringify(obj.data);
  }

  debug('encoded %j as %s', obj, str);
  return str;
}

/**
 * Encode packet as 'buffer sequence' by removing blobs, and
 * deconstructing packet into object with placeholders and
 * a list of buffers.
 *
 * @param {Object} packet
 * @return {Buffer} encoded
 * @api private
 */

function encodeAsBinary(obj, callback) {

  function writeEncoding(bloblessData) {
    var deconstruction = binary.deconstructPacket(bloblessData);
    var pack = encodeAsString(deconstruction.packet);
    var buffers = deconstruction.buffers;

    buffers.unshift(pack); // add packet info to beginning of data list
    callback(buffers); // write all the buffers
  }

  binary.removeBlobs(obj, writeEncoding);
}

/**
 * A socket.io Decoder instance
 *
 * @return {Object} decoder
 * @api public
 */

function Decoder() {
  this.reconstructor = null;
}

/**
 * Mix in `Emitter` with Decoder.
 */

Emitter(Decoder.prototype);

/**
 * Decodes an ecoded packet string into packet JSON.
 *
 * @param {String} obj - encoded packet
 * @return {Object} packet
 * @api public
 */

Decoder.prototype.add = function(obj) {
  var packet;
  if ('string' == typeof obj) {
    packet = decodeString(obj);
    if (exports.BINARY_EVENT == packet.type || exports.BINARY_ACK == packet.type) { // binary packet's json
      this.reconstructor = new BinaryReconstructor(packet);

      // no attachments, labeled binary but no binary data to follow
      if (this.reconstructor.reconPack.attachments == 0) {
        this.emit('decoded', packet);
      }
    } else { // non-binary full packet
      this.emit('decoded', packet);
    }
  }
  else if (isBuf(obj) || obj.base64) { // raw binary data
    if (!this.reconstructor) {
      throw new Error('got binary data when not reconstructing a packet');
    } else {
      packet = this.reconstructor.takeBinaryData(obj);
      if (packet) { // received final buffer
        this.reconstructor = null;
        this.emit('decoded', packet);
      }
    }
  }
  else {
    throw new Error('Unknown type: ' + obj);
  }
};

/**
 * Decode a packet String (JSON data)
 *
 * @param {String} str
 * @return {Object} packet
 * @api private
 */

function decodeString(str) {
  var p = {};
  var i = 0;

  // look up type
  p.type = Number(str.charAt(0));
  if (null == exports.types[p.type]) return error();

  // look up attachments if type binary
  if (exports.BINARY_EVENT == p.type || exports.BINARY_ACK == p.type) {
    p.attachments = '';
    while (str.charAt(++i) != '-') {
      p.attachments += str.charAt(i);
    }
    p.attachments = Number(p.attachments);
  }

  // look up namespace (if any)
  if ('/' == str.charAt(i + 1)) {
    p.nsp = '';
    while (++i) {
      var c = str.charAt(i);
      if (',' == c) break;
      p.nsp += c;
      if (i + 1 == str.length) break;
    }
  } else {
    p.nsp = '/';
  }

  // look up id
  var next = str.charAt(i + 1);
  if ('' != next && Number(next) == next) {
    p.id = '';
    while (++i) {
      var c = str.charAt(i);
      if (null == c || Number(c) != c) {
        --i;
        break;
      }
      p.id += str.charAt(i);
      if (i + 1 == str.length) break;
    }
    p.id = Number(p.id);
  }

  // look up json data
  if (str.charAt(++i)) {
    try {
      p.data = json.parse(str.substr(i));
    } catch(e){
      return error();
    }
  }

  debug('decoded %s as %j', str, p);
  return p;
}

/**
 * Deallocates a parser's resources
 *
 * @api public
 */

Decoder.prototype.destroy = function() {
  if (this.reconstructor) {
    this.reconstructor.finishedReconstruction();
  }
};

/**
 * A manager of a binary event's 'buffer sequence'. Should
 * be constructed whenever a packet of type BINARY_EVENT is
 * decoded.
 *
 * @param {Object} packet
 * @return {BinaryReconstructor} initialized reconstructor
 * @api private
 */

function BinaryReconstructor(packet) {
  this.reconPack = packet;
  this.buffers = [];
}

/**
 * Method to be called when binary data received from connection
 * after a BINARY_EVENT packet.
 *
 * @param {Buffer | ArrayBuffer} binData - the raw binary data received
 * @return {null | Object} returns null if more binary data is expected or
 *   a reconstructed packet object if all buffers have been received.
 * @api private
 */

BinaryReconstructor.prototype.takeBinaryData = function(binData) {
  this.buffers.push(binData);
  if (this.buffers.length == this.reconPack.attachments) { // done with buffer list
    var packet = binary.reconstructPacket(this.reconPack, this.buffers);
    this.finishedReconstruction();
    return packet;
  }
  return null;
};

/**
 * Cleans up binary packet reconstruction variables.
 *
 * @api private
 */

BinaryReconstructor.prototype.finishedReconstruction = function() {
  this.reconPack = null;
  this.buffers = [];
};

function error(data){
  return {
    type: exports.ERROR,
    data: 'parser error'
  };
}

},{"./binary":39,"./is-buffer":41,"component-emitter":8,"debug":9,"isarray":42,"json3":43}],41:[function(_dereq_,module,exports){
(function (global){

module.exports = isBuf;

/**
 * Returns true if obj is a buffer or an arraybuffer.
 *
 * @api private
 */

function isBuf(obj) {
  return (global.Buffer && global.Buffer.isBuffer(obj)) ||
         (global.ArrayBuffer && obj instanceof ArrayBuffer);
}

}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],42:[function(_dereq_,module,exports){
module.exports=_dereq_(33)
},{}],43:[function(_dereq_,module,exports){
/*! JSON v3.2.6 | http://bestiejs.github.io/json3 | Copyright 2012-2013, Kit Cambridge | http://kit.mit-license.org */
;(function (window) {
  // Convenience aliases.
  var getClass = {}.toString, isProperty, forEach, undef;

  // Detect the `define` function exposed by asynchronous module loaders. The
  // strict `define` check is necessary for compatibility with `r.js`.
  var isLoader = typeof define === "function" && define.amd;

  // Detect native implementations.
  var nativeJSON = typeof JSON == "object" && JSON;

  // Set up the JSON 3 namespace, preferring the CommonJS `exports` object if
  // available.
  var JSON3 = typeof exports == "object" && exports && !exports.nodeType && exports;

  if (JSON3 && nativeJSON) {
    // Explicitly delegate to the native `stringify` and `parse`
    // implementations in CommonJS environments.
    JSON3.stringify = nativeJSON.stringify;
    JSON3.parse = nativeJSON.parse;
  } else {
    // Export for web browsers, JavaScript engines, and asynchronous module
    // loaders, using the global `JSON` object if available.
    JSON3 = window.JSON = nativeJSON || {};
  }

  // Test the `Date#getUTC*` methods. Based on work by @Yaffle.
  var isExtended = new Date(-3509827334573292);
  try {
    // The `getUTCFullYear`, `Month`, and `Date` methods return nonsensical
    // results for certain dates in Opera >= 10.53.
    isExtended = isExtended.getUTCFullYear() == -109252 && isExtended.getUTCMonth() === 0 && isExtended.getUTCDate() === 1 &&
      // Safari < 2.0.2 stores the internal millisecond time value correctly,
      // but clips the values returned by the date methods to the range of
      // signed 32-bit integers ([-2 ** 31, 2 ** 31 - 1]).
      isExtended.getUTCHours() == 10 && isExtended.getUTCMinutes() == 37 && isExtended.getUTCSeconds() == 6 && isExtended.getUTCMilliseconds() == 708;
  } catch (exception) {}

  // Internal: Determines whether the native `JSON.stringify` and `parse`
  // implementations are spec-compliant. Based on work by Ken Snyder.
  function has(name) {
    if (has[name] !== undef) {
      // Return cached feature test result.
      return has[name];
    }

    var isSupported;
    if (name == "bug-string-char-index") {
      // IE <= 7 doesn't support accessing string characters using square
      // bracket notation. IE 8 only supports this for primitives.
      isSupported = "a"[0] != "a";
    } else if (name == "json") {
      // Indicates whether both `JSON.stringify` and `JSON.parse` are
      // supported.
      isSupported = has("json-stringify") && has("json-parse");
    } else {
      var value, serialized = '{"a":[1,true,false,null,"\\u0000\\b\\n\\f\\r\\t"]}';
      // Test `JSON.stringify`.
      if (name == "json-stringify") {
        var stringify = JSON3.stringify, stringifySupported = typeof stringify == "function" && isExtended;
        if (stringifySupported) {
          // A test function object with a custom `toJSON` method.
          (value = function () {
            return 1;
          }).toJSON = value;
          try {
            stringifySupported =
              // Firefox 3.1b1 and b2 serialize string, number, and boolean
              // primitives as object literals.
              stringify(0) === "0" &&
              // FF 3.1b1, b2, and JSON 2 serialize wrapped primitives as object
              // literals.
              stringify(new Number()) === "0" &&
              stringify(new String()) == '""' &&
              // FF 3.1b1, 2 throw an error if the value is `null`, `undefined`, or
              // does not define a canonical JSON representation (this applies to
              // objects with `toJSON` properties as well, *unless* they are nested
              // within an object or array).
              stringify(getClass) === undef &&
              // IE 8 serializes `undefined` as `"undefined"`. Safari <= 5.1.7 and
              // FF 3.1b3 pass this test.
              stringify(undef) === undef &&
              // Safari <= 5.1.7 and FF 3.1b3 throw `Error`s and `TypeError`s,
              // respectively, if the value is omitted entirely.
              stringify() === undef &&
              // FF 3.1b1, 2 throw an error if the given value is not a number,
              // string, array, object, Boolean, or `null` literal. This applies to
              // objects with custom `toJSON` methods as well, unless they are nested
              // inside object or array literals. YUI 3.0.0b1 ignores custom `toJSON`
              // methods entirely.
              stringify(value) === "1" &&
              stringify([value]) == "[1]" &&
              // Prototype <= 1.6.1 serializes `[undefined]` as `"[]"` instead of
              // `"[null]"`.
              stringify([undef]) == "[null]" &&
              // YUI 3.0.0b1 fails to serialize `null` literals.
              stringify(null) == "null" &&
              // FF 3.1b1, 2 halts serialization if an array contains a function:
              // `[1, true, getClass, 1]` serializes as "[1,true,],". FF 3.1b3
              // elides non-JSON values from objects and arrays, unless they
              // define custom `toJSON` methods.
              stringify([undef, getClass, null]) == "[null,null,null]" &&
              // Simple serialization test. FF 3.1b1 uses Unicode escape sequences
              // where character escape codes are expected (e.g., `\b` => `\u0008`).
              stringify({ "a": [value, true, false, null, "\x00\b\n\f\r\t"] }) == serialized &&
              // FF 3.1b1 and b2 ignore the `filter` and `width` arguments.
              stringify(null, value) === "1" &&
              stringify([1, 2], null, 1) == "[\n 1,\n 2\n]" &&
              // JSON 2, Prototype <= 1.7, and older WebKit builds incorrectly
              // serialize extended years.
              stringify(new Date(-8.64e15)) == '"-271821-04-20T00:00:00.000Z"' &&
              // The milliseconds are optional in ES 5, but required in 5.1.
              stringify(new Date(8.64e15)) == '"+275760-09-13T00:00:00.000Z"' &&
              // Firefox <= 11.0 incorrectly serializes years prior to 0 as negative
              // four-digit years instead of six-digit years. Credits: @Yaffle.
              stringify(new Date(-621987552e5)) == '"-000001-01-01T00:00:00.000Z"' &&
              // Safari <= 5.1.5 and Opera >= 10.53 incorrectly serialize millisecond
              // values less than 1000. Credits: @Yaffle.
              stringify(new Date(-1)) == '"1969-12-31T23:59:59.999Z"';
          } catch (exception) {
            stringifySupported = false;
          }
        }
        isSupported = stringifySupported;
      }
      // Test `JSON.parse`.
      if (name == "json-parse") {
        var parse = JSON3.parse;
        if (typeof parse == "function") {
          try {
            // FF 3.1b1, b2 will throw an exception if a bare literal is provided.
            // Conforming implementations should also coerce the initial argument to
            // a string prior to parsing.
            if (parse("0") === 0 && !parse(false)) {
              // Simple parsing test.
              value = parse(serialized);
              var parseSupported = value["a"].length == 5 && value["a"][0] === 1;
              if (parseSupported) {
                try {
                  // Safari <= 5.1.2 and FF 3.1b1 allow unescaped tabs in strings.
                  parseSupported = !parse('"\t"');
                } catch (exception) {}
                if (parseSupported) {
                  try {
                    // FF 4.0 and 4.0.1 allow leading `+` signs and leading
                    // decimal points. FF 4.0, 4.0.1, and IE 9-10 also allow
                    // certain octal literals.
                    parseSupported = parse("01") !== 1;
                  } catch (exception) {}
                }
                if (parseSupported) {
                  try {
                    // FF 4.0, 4.0.1, and Rhino 1.7R3-R4 allow trailing decimal
                    // points. These environments, along with FF 3.1b1 and 2,
                    // also allow trailing commas in JSON objects and arrays.
                    parseSupported = parse("1.") !== 1;
                  } catch (exception) {}
                }
              }
            }
          } catch (exception) {
            parseSupported = false;
          }
        }
        isSupported = parseSupported;
      }
    }
    return has[name] = !!isSupported;
  }

  if (!has("json")) {
    // Common `[[Class]]` name aliases.
    var functionClass = "[object Function]";
    var dateClass = "[object Date]";
    var numberClass = "[object Number]";
    var stringClass = "[object String]";
    var arrayClass = "[object Array]";
    var booleanClass = "[object Boolean]";

    // Detect incomplete support for accessing string characters by index.
    var charIndexBuggy = has("bug-string-char-index");

    // Define additional utility methods if the `Date` methods are buggy.
    if (!isExtended) {
      var floor = Math.floor;
      // A mapping between the months of the year and the number of days between
      // January 1st and the first of the respective month.
      var Months = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
      // Internal: Calculates the number of days between the Unix epoch and the
      // first day of the given month.
      var getDay = function (year, month) {
        return Months[month] + 365 * (year - 1970) + floor((year - 1969 + (month = +(month > 1))) / 4) - floor((year - 1901 + month) / 100) + floor((year - 1601 + month) / 400);
      };
    }

    // Internal: Determines if a property is a direct property of the given
    // object. Delegates to the native `Object#hasOwnProperty` method.
    if (!(isProperty = {}.hasOwnProperty)) {
      isProperty = function (property) {
        var members = {}, constructor;
        if ((members.__proto__ = null, members.__proto__ = {
          // The *proto* property cannot be set multiple times in recent
          // versions of Firefox and SeaMonkey.
          "toString": 1
        }, members).toString != getClass) {
          // Safari <= 2.0.3 doesn't implement `Object#hasOwnProperty`, but
          // supports the mutable *proto* property.
          isProperty = function (property) {
            // Capture and break the object's prototype chain (see section 8.6.2
            // of the ES 5.1 spec). The parenthesized expression prevents an
            // unsafe transformation by the Closure Compiler.
            var original = this.__proto__, result = property in (this.__proto__ = null, this);
            // Restore the original prototype chain.
            this.__proto__ = original;
            return result;
          };
        } else {
          // Capture a reference to the top-level `Object` constructor.
          constructor = members.constructor;
          // Use the `constructor` property to simulate `Object#hasOwnProperty` in
          // other environments.
          isProperty = function (property) {
            var parent = (this.constructor || constructor).prototype;
            return property in this && !(property in parent && this[property] === parent[property]);
          };
        }
        members = null;
        return isProperty.call(this, property);
      };
    }

    // Internal: A set of primitive types used by `isHostType`.
    var PrimitiveTypes = {
      'boolean': 1,
      'number': 1,
      'string': 1,
      'undefined': 1
    };

    // Internal: Determines if the given object `property` value is a
    // non-primitive.
    var isHostType = function (object, property) {
      var type = typeof object[property];
      return type == 'object' ? !!object[property] : !PrimitiveTypes[type];
    };

    // Internal: Normalizes the `for...in` iteration algorithm across
    // environments. Each enumerated key is yielded to a `callback` function.
    forEach = function (object, callback) {
      var size = 0, Properties, members, property;

      // Tests for bugs in the current environment's `for...in` algorithm. The
      // `valueOf` property inherits the non-enumerable flag from
      // `Object.prototype` in older versions of IE, Netscape, and Mozilla.
      (Properties = function () {
        this.valueOf = 0;
      }).prototype.valueOf = 0;

      // Iterate over a new instance of the `Properties` class.
      members = new Properties();
      for (property in members) {
        // Ignore all properties inherited from `Object.prototype`.
        if (isProperty.call(members, property)) {
          size++;
        }
      }
      Properties = members = null;

      // Normalize the iteration algorithm.
      if (!size) {
        // A list of non-enumerable properties inherited from `Object.prototype`.
        members = ["valueOf", "toString", "toLocaleString", "propertyIsEnumerable", "isPrototypeOf", "hasOwnProperty", "constructor"];
        // IE <= 8, Mozilla 1.0, and Netscape 6.2 ignore shadowed non-enumerable
        // properties.
        forEach = function (object, callback) {
          var isFunction = getClass.call(object) == functionClass, property, length;
          var hasProperty = !isFunction && typeof object.constructor != 'function' && isHostType(object, 'hasOwnProperty') ? object.hasOwnProperty : isProperty;
          for (property in object) {
            // Gecko <= 1.0 enumerates the `prototype` property of functions under
            // certain conditions; IE does not.
            if (!(isFunction && property == "prototype") && hasProperty.call(object, property)) {
              callback(property);
            }
          }
          // Manually invoke the callback for each non-enumerable property.
          for (length = members.length; property = members[--length]; hasProperty.call(object, property) && callback(property));
        };
      } else if (size == 2) {
        // Safari <= 2.0.4 enumerates shadowed properties twice.
        forEach = function (object, callback) {
          // Create a set of iterated properties.
          var members = {}, isFunction = getClass.call(object) == functionClass, property;
          for (property in object) {
            // Store each property name to prevent double enumeration. The
            // `prototype` property of functions is not enumerated due to cross-
            // environment inconsistencies.
            if (!(isFunction && property == "prototype") && !isProperty.call(members, property) && (members[property] = 1) && isProperty.call(object, property)) {
              callback(property);
            }
          }
        };
      } else {
        // No bugs detected; use the standard `for...in` algorithm.
        forEach = function (object, callback) {
          var isFunction = getClass.call(object) == functionClass, property, isConstructor;
          for (property in object) {
            if (!(isFunction && property == "prototype") && isProperty.call(object, property) && !(isConstructor = property === "constructor")) {
              callback(property);
            }
          }
          // Manually invoke the callback for the `constructor` property due to
          // cross-environment inconsistencies.
          if (isConstructor || isProperty.call(object, (property = "constructor"))) {
            callback(property);
          }
        };
      }
      return forEach(object, callback);
    };

    // Public: Serializes a JavaScript `value` as a JSON string. The optional
    // `filter` argument may specify either a function that alters how object and
    // array members are serialized, or an array of strings and numbers that
    // indicates which properties should be serialized. The optional `width`
    // argument may be either a string or number that specifies the indentation
    // level of the output.
    if (!has("json-stringify")) {
      // Internal: A map of control characters and their escaped equivalents.
      var Escapes = {
        92: "\\\\",
        34: '\\"',
        8: "\\b",
        12: "\\f",
        10: "\\n",
        13: "\\r",
        9: "\\t"
      };

      // Internal: Converts `value` into a zero-padded string such that its
      // length is at least equal to `width`. The `width` must be <= 6.
      var leadingZeroes = "000000";
      var toPaddedString = function (width, value) {
        // The `|| 0` expression is necessary to work around a bug in
        // Opera <= 7.54u2 where `0 == -0`, but `String(-0) !== "0"`.
        return (leadingZeroes + (value || 0)).slice(-width);
      };

      // Internal: Double-quotes a string `value`, replacing all ASCII control
      // characters (characters with code unit values between 0 and 31) with
      // their escaped equivalents. This is an implementation of the
      // `Quote(value)` operation defined in ES 5.1 section 15.12.3.
      var unicodePrefix = "\\u00";
      var quote = function (value) {
        var result = '"', index = 0, length = value.length, isLarge = length > 10 && charIndexBuggy, symbols;
        if (isLarge) {
          symbols = value.split("");
        }
        for (; index < length; index++) {
          var charCode = value.charCodeAt(index);
          // If the character is a control character, append its Unicode or
          // shorthand escape sequence; otherwise, append the character as-is.
          switch (charCode) {
            case 8: case 9: case 10: case 12: case 13: case 34: case 92:
              result += Escapes[charCode];
              break;
            default:
              if (charCode < 32) {
                result += unicodePrefix + toPaddedString(2, charCode.toString(16));
                break;
              }
              result += isLarge ? symbols[index] : charIndexBuggy ? value.charAt(index) : value[index];
          }
        }
        return result + '"';
      };

      // Internal: Recursively serializes an object. Implements the
      // `Str(key, holder)`, `JO(value)`, and `JA(value)` operations.
      var serialize = function (property, object, callback, properties, whitespace, indentation, stack) {
        var value, className, year, month, date, time, hours, minutes, seconds, milliseconds, results, element, index, length, prefix, result;
        try {
          // Necessary for host object support.
          value = object[property];
        } catch (exception) {}
        if (typeof value == "object" && value) {
          className = getClass.call(value);
          if (className == dateClass && !isProperty.call(value, "toJSON")) {
            if (value > -1 / 0 && value < 1 / 0) {
              // Dates are serialized according to the `Date#toJSON` method
              // specified in ES 5.1 section 15.9.5.44. See section 15.9.1.15
              // for the ISO 8601 date time string format.
              if (getDay) {
                // Manually compute the year, month, date, hours, minutes,
                // seconds, and milliseconds if the `getUTC*` methods are
                // buggy. Adapted from @Yaffle's `date-shim` project.
                date = floor(value / 864e5);
                for (year = floor(date / 365.2425) + 1970 - 1; getDay(year + 1, 0) <= date; year++);
                for (month = floor((date - getDay(year, 0)) / 30.42); getDay(year, month + 1) <= date; month++);
                date = 1 + date - getDay(year, month);
                // The `time` value specifies the time within the day (see ES
                // 5.1 section 15.9.1.2). The formula `(A % B + B) % B` is used
                // to compute `A modulo B`, as the `%` operator does not
                // correspond to the `modulo` operation for negative numbers.
                time = (value % 864e5 + 864e5) % 864e5;
                // The hours, minutes, seconds, and milliseconds are obtained by
                // decomposing the time within the day. See section 15.9.1.10.
                hours = floor(time / 36e5) % 24;
                minutes = floor(time / 6e4) % 60;
                seconds = floor(time / 1e3) % 60;
                milliseconds = time % 1e3;
              } else {
                year = value.getUTCFullYear();
                month = value.getUTCMonth();
                date = value.getUTCDate();
                hours = value.getUTCHours();
                minutes = value.getUTCMinutes();
                seconds = value.getUTCSeconds();
                milliseconds = value.getUTCMilliseconds();
              }
              // Serialize extended years correctly.
              value = (year <= 0 || year >= 1e4 ? (year < 0 ? "-" : "+") + toPaddedString(6, year < 0 ? -year : year) : toPaddedString(4, year)) +
                "-" + toPaddedString(2, month + 1) + "-" + toPaddedString(2, date) +
                // Months, dates, hours, minutes, and seconds should have two
                // digits; milliseconds should have three.
                "T" + toPaddedString(2, hours) + ":" + toPaddedString(2, minutes) + ":" + toPaddedString(2, seconds) +
                // Milliseconds are optional in ES 5.0, but required in 5.1.
                "." + toPaddedString(3, milliseconds) + "Z";
            } else {
              value = null;
            }
          } else if (typeof value.toJSON == "function" && ((className != numberClass && className != stringClass && className != arrayClass) || isProperty.call(value, "toJSON"))) {
            // Prototype <= 1.6.1 adds non-standard `toJSON` methods to the
            // `Number`, `String`, `Date`, and `Array` prototypes. JSON 3
            // ignores all `toJSON` methods on these objects unless they are
            // defined directly on an instance.
            value = value.toJSON(property);
          }
        }
        if (callback) {
          // If a replacement function was provided, call it to obtain the value
          // for serialization.
          value = callback.call(object, property, value);
        }
        if (value === null) {
          return "null";
        }
        className = getClass.call(value);
        if (className == booleanClass) {
          // Booleans are represented literally.
          return "" + value;
        } else if (className == numberClass) {
          // JSON numbers must be finite. `Infinity` and `NaN` are serialized as
          // `"null"`.
          return value > -1 / 0 && value < 1 / 0 ? "" + value : "null";
        } else if (className == stringClass) {
          // Strings are double-quoted and escaped.
          return quote("" + value);
        }
        // Recursively serialize objects and arrays.
        if (typeof value == "object") {
          // Check for cyclic structures. This is a linear search; performance
          // is inversely proportional to the number of unique nested objects.
          for (length = stack.length; length--;) {
            if (stack[length] === value) {
              // Cyclic structures cannot be serialized by `JSON.stringify`.
              throw TypeError();
            }
          }
          // Add the object to the stack of traversed objects.
          stack.push(value);
          results = [];
          // Save the current indentation level and indent one additional level.
          prefix = indentation;
          indentation += whitespace;
          if (className == arrayClass) {
            // Recursively serialize array elements.
            for (index = 0, length = value.length; index < length; index++) {
              element = serialize(index, value, callback, properties, whitespace, indentation, stack);
              results.push(element === undef ? "null" : element);
            }
            result = results.length ? (whitespace ? "[\n" + indentation + results.join(",\n" + indentation) + "\n" + prefix + "]" : ("[" + results.join(",") + "]")) : "[]";
          } else {
            // Recursively serialize object members. Members are selected from
            // either a user-specified list of property names, or the object
            // itself.
            forEach(properties || value, function (property) {
              var element = serialize(property, value, callback, properties, whitespace, indentation, stack);
              if (element !== undef) {
                // According to ES 5.1 section 15.12.3: "If `gap` {whitespace}
                // is not the empty string, let `member` {quote(property) + ":"}
                // be the concatenation of `member` and the `space` character."
                // The "`space` character" refers to the literal space
                // character, not the `space` {width} argument provided to
                // `JSON.stringify`.
                results.push(quote(property) + ":" + (whitespace ? " " : "") + element);
              }
            });
            result = results.length ? (whitespace ? "{\n" + indentation + results.join(",\n" + indentation) + "\n" + prefix + "}" : ("{" + results.join(",") + "}")) : "{}";
          }
          // Remove the object from the traversed object stack.
          stack.pop();
          return result;
        }
      };

      // Public: `JSON.stringify`. See ES 5.1 section 15.12.3.
      JSON3.stringify = function (source, filter, width) {
        var whitespace, callback, properties, className;
        if (typeof filter == "function" || typeof filter == "object" && filter) {
          if ((className = getClass.call(filter)) == functionClass) {
            callback = filter;
          } else if (className == arrayClass) {
            // Convert the property names array into a makeshift set.
            properties = {};
            for (var index = 0, length = filter.length, value; index < length; value = filter[index++], ((className = getClass.call(value)), className == stringClass || className == numberClass) && (properties[value] = 1));
          }
        }
        if (width) {
          if ((className = getClass.call(width)) == numberClass) {
            // Convert the `width` to an integer and create a string containing
            // `width` number of space characters.
            if ((width -= width % 1) > 0) {
              for (whitespace = "", width > 10 && (width = 10); whitespace.length < width; whitespace += " ");
            }
          } else if (className == stringClass) {
            whitespace = width.length <= 10 ? width : width.slice(0, 10);
          }
        }
        // Opera <= 7.54u2 discards the values associated with empty string keys
        // (`""`) only if they are used directly within an object member list
        // (e.g., `!("" in { "": 1})`).
        return serialize("", (value = {}, value[""] = source, value), callback, properties, whitespace, "", []);
      };
    }

    // Public: Parses a JSON source string.
    if (!has("json-parse")) {
      var fromCharCode = String.fromCharCode;

      // Internal: A map of escaped control characters and their unescaped
      // equivalents.
      var Unescapes = {
        92: "\\",
        34: '"',
        47: "/",
        98: "\b",
        116: "\t",
        110: "\n",
        102: "\f",
        114: "\r"
      };

      // Internal: Stores the parser state.
      var Index, Source;

      // Internal: Resets the parser state and throws a `SyntaxError`.
      var abort = function() {
        Index = Source = null;
        throw SyntaxError();
      };

      // Internal: Returns the next token, or `"$"` if the parser has reached
      // the end of the source string. A token may be a string, number, `null`
      // literal, or Boolean literal.
      var lex = function () {
        var source = Source, length = source.length, value, begin, position, isSigned, charCode;
        while (Index < length) {
          charCode = source.charCodeAt(Index);
          switch (charCode) {
            case 9: case 10: case 13: case 32:
              // Skip whitespace tokens, including tabs, carriage returns, line
              // feeds, and space characters.
              Index++;
              break;
            case 123: case 125: case 91: case 93: case 58: case 44:
              // Parse a punctuator token (`{`, `}`, `[`, `]`, `:`, or `,`) at
              // the current position.
              value = charIndexBuggy ? source.charAt(Index) : source[Index];
              Index++;
              return value;
            case 34:
              // `"` delimits a JSON string; advance to the next character and
              // begin parsing the string. String tokens are prefixed with the
              // sentinel `@` character to distinguish them from punctuators and
              // end-of-string tokens.
              for (value = "@", Index++; Index < length;) {
                charCode = source.charCodeAt(Index);
                if (charCode < 32) {
                  // Unescaped ASCII control characters (those with a code unit
                  // less than the space character) are not permitted.
                  abort();
                } else if (charCode == 92) {
                  // A reverse solidus (`\`) marks the beginning of an escaped
                  // control character (including `"`, `\`, and `/`) or Unicode
                  // escape sequence.
                  charCode = source.charCodeAt(++Index);
                  switch (charCode) {
                    case 92: case 34: case 47: case 98: case 116: case 110: case 102: case 114:
                      // Revive escaped control characters.
                      value += Unescapes[charCode];
                      Index++;
                      break;
                    case 117:
                      // `\u` marks the beginning of a Unicode escape sequence.
                      // Advance to the first character and validate the
                      // four-digit code point.
                      begin = ++Index;
                      for (position = Index + 4; Index < position; Index++) {
                        charCode = source.charCodeAt(Index);
                        // A valid sequence comprises four hexdigits (case-
                        // insensitive) that form a single hexadecimal value.
                        if (!(charCode >= 48 && charCode <= 57 || charCode >= 97 && charCode <= 102 || charCode >= 65 && charCode <= 70)) {
                          // Invalid Unicode escape sequence.
                          abort();
                        }
                      }
                      // Revive the escaped character.
                      value += fromCharCode("0x" + source.slice(begin, Index));
                      break;
                    default:
                      // Invalid escape sequence.
                      abort();
                  }
                } else {
                  if (charCode == 34) {
                    // An unescaped double-quote character marks the end of the
                    // string.
                    break;
                  }
                  charCode = source.charCodeAt(Index);
                  begin = Index;
                  // Optimize for the common case where a string is valid.
                  while (charCode >= 32 && charCode != 92 && charCode != 34) {
                    charCode = source.charCodeAt(++Index);
                  }
                  // Append the string as-is.
                  value += source.slice(begin, Index);
                }
              }
              if (source.charCodeAt(Index) == 34) {
                // Advance to the next character and return the revived string.
                Index++;
                return value;
              }
              // Unterminated string.
              abort();
            default:
              // Parse numbers and literals.
              begin = Index;
              // Advance past the negative sign, if one is specified.
              if (charCode == 45) {
                isSigned = true;
                charCode = source.charCodeAt(++Index);
              }
              // Parse an integer or floating-point value.
              if (charCode >= 48 && charCode <= 57) {
                // Leading zeroes are interpreted as octal literals.
                if (charCode == 48 && ((charCode = source.charCodeAt(Index + 1)), charCode >= 48 && charCode <= 57)) {
                  // Illegal octal literal.
                  abort();
                }
                isSigned = false;
                // Parse the integer component.
                for (; Index < length && ((charCode = source.charCodeAt(Index)), charCode >= 48 && charCode <= 57); Index++);
                // Floats cannot contain a leading decimal point; however, this
                // case is already accounted for by the parser.
                if (source.charCodeAt(Index) == 46) {
                  position = ++Index;
                  // Parse the decimal component.
                  for (; position < length && ((charCode = source.charCodeAt(position)), charCode >= 48 && charCode <= 57); position++);
                  if (position == Index) {
                    // Illegal trailing decimal.
                    abort();
                  }
                  Index = position;
                }
                // Parse exponents. The `e` denoting the exponent is
                // case-insensitive.
                charCode = source.charCodeAt(Index);
                if (charCode == 101 || charCode == 69) {
                  charCode = source.charCodeAt(++Index);
                  // Skip past the sign following the exponent, if one is
                  // specified.
                  if (charCode == 43 || charCode == 45) {
                    Index++;
                  }
                  // Parse the exponential component.
                  for (position = Index; position < length && ((charCode = source.charCodeAt(position)), charCode >= 48 && charCode <= 57); position++);
                  if (position == Index) {
                    // Illegal empty exponent.
                    abort();
                  }
                  Index = position;
                }
                // Coerce the parsed value to a JavaScript number.
                return +source.slice(begin, Index);
              }
              // A negative sign may only precede numbers.
              if (isSigned) {
                abort();
              }
              // `true`, `false`, and `null` literals.
              if (source.slice(Index, Index + 4) == "true") {
                Index += 4;
                return true;
              } else if (source.slice(Index, Index + 5) == "false") {
                Index += 5;
                return false;
              } else if (source.slice(Index, Index + 4) == "null") {
                Index += 4;
                return null;
              }
              // Unrecognized token.
              abort();
          }
        }
        // Return the sentinel `$` character if the parser has reached the end
        // of the source string.
        return "$";
      };

      // Internal: Parses a JSON `value` token.
      var get = function (value) {
        var results, hasMembers;
        if (value == "$") {
          // Unexpected end of input.
          abort();
        }
        if (typeof value == "string") {
          if ((charIndexBuggy ? value.charAt(0) : value[0]) == "@") {
            // Remove the sentinel `@` character.
            return value.slice(1);
          }
          // Parse object and array literals.
          if (value == "[") {
            // Parses a JSON array, returning a new JavaScript array.
            results = [];
            for (;; hasMembers || (hasMembers = true)) {
              value = lex();
              // A closing square bracket marks the end of the array literal.
              if (value == "]") {
                break;
              }
              // If the array literal contains elements, the current token
              // should be a comma separating the previous element from the
              // next.
              if (hasMembers) {
                if (value == ",") {
                  value = lex();
                  if (value == "]") {
                    // Unexpected trailing `,` in array literal.
                    abort();
                  }
                } else {
                  // A `,` must separate each array element.
                  abort();
                }
              }
              // Elisions and leading commas are not permitted.
              if (value == ",") {
                abort();
              }
              results.push(get(value));
            }
            return results;
          } else if (value == "{") {
            // Parses a JSON object, returning a new JavaScript object.
            results = {};
            for (;; hasMembers || (hasMembers = true)) {
              value = lex();
              // A closing curly brace marks the end of the object literal.
              if (value == "}") {
                break;
              }
              // If the object literal contains members, the current token
              // should be a comma separator.
              if (hasMembers) {
                if (value == ",") {
                  value = lex();
                  if (value == "}") {
                    // Unexpected trailing `,` in object literal.
                    abort();
                  }
                } else {
                  // A `,` must separate each object member.
                  abort();
                }
              }
              // Leading commas are not permitted, object property names must be
              // double-quoted strings, and a `:` must separate each property
              // name and value.
              if (value == "," || typeof value != "string" || (charIndexBuggy ? value.charAt(0) : value[0]) != "@" || lex() != ":") {
                abort();
              }
              results[value.slice(1)] = get(lex());
            }
            return results;
          }
          // Unexpected token encountered.
          abort();
        }
        return value;
      };

      // Internal: Updates a traversed object member.
      var update = function(source, property, callback) {
        var element = walk(source, property, callback);
        if (element === undef) {
          delete source[property];
        } else {
          source[property] = element;
        }
      };

      // Internal: Recursively traverses a parsed JSON object, invoking the
      // `callback` function for each value. This is an implementation of the
      // `Walk(holder, name)` operation defined in ES 5.1 section 15.12.2.
      var walk = function (source, property, callback) {
        var value = source[property], length;
        if (typeof value == "object" && value) {
          // `forEach` can't be used to traverse an array in Opera <= 8.54
          // because its `Object#hasOwnProperty` implementation returns `false`
          // for array indices (e.g., `![1, 2, 3].hasOwnProperty("0")`).
          if (getClass.call(value) == arrayClass) {
            for (length = value.length; length--;) {
              update(value, length, callback);
            }
          } else {
            forEach(value, function (property) {
              update(value, property, callback);
            });
          }
        }
        return callback.call(source, property, value);
      };

      // Public: `JSON.parse`. See ES 5.1 section 15.12.2.
      JSON3.parse = function (source, callback) {
        var result, value;
        Index = 0;
        Source = "" + source;
        result = get(lex());
        // If a JSON string contains multiple tokens, it is invalid.
        if (lex() != "$") {
          abort();
        }
        // Reset the parser state.
        Index = Source = null;
        return callback && getClass.call(callback) == functionClass ? walk((value = {}, value[""] = result, value), "", callback) : result;
      };
    }
  }

  // Export for asynchronous module loaders.
  if (isLoader) {
    define(function () {
      return JSON3;
    });
  }
}(this));

},{}],44:[function(_dereq_,module,exports){
module.exports = toArray

function toArray(list, index) {
    var array = []

    index = index || 0

    for (var i = index || 0; i < list.length; i++) {
        array[i - index] = list[i]
    }

    return array
}

},{}]},{},[1])
(1)
});

this._returnEff = function(x){
  return function(){
    return new x;
  };
};
this._unMaybe = function(arg$){
  var value0;
  value0 = arg$.value0;
  return value0 || undefined;
};
this._maybe = function(x){
  var ref$, Just, Nothing;
  ref$ = PS.Data_Maybe, Just = ref$.Just, Nothing = ref$.Nothing;
  if (x && x !== {}) {
    return Just(x);
  } else {
    return Nothing;
  }
};

this.TitleLinker = function(arg$, arg1$){
  var title, chart, t;
  title = arg$.title;
  chart = arg1$.chart;
  t = document.createElement("h1");
  t.innerHTML = title;
  chart.subscribe(function(v){
    return t.innerHTML = v;
  });
  document.body.appendChild(t);
};
this.inputRVar = curry$(function(r, i){
  return function(){
    i.value = model.value;
    i.addEventListener("input", function(){
      model.update(i.value);
    });
    return i;
  };
});
function curry$(f, bound){
  var context,
  _curry = function(args) {
    return f.length > 1 ? function(){
      var params = args ? args.concat() : [];
      context = bound ? context || this : this;
      return params.push.apply(params, arguments) <
          f.length && arguments.length ?
        _curry.call(context, params) : f.apply(context, params);
    } : f;
  };
  return _curry();
}
this.input = function(){
  return function(){
    var i;
    i = document.createElement("input");
    document.body.appendChild(i);
    return i;
  };
};
// Generated by psc version 0.5.6.2
var PS = PS || {};
PS.Prelude = (function () {
    "use strict";
    var Unit = {
        create: function (value) {
            return value;
        }
    };
    function LT() {

    };
    LT.value = new LT();
    function GT() {

    };
    GT.value = new GT();
    function EQ() {

    };
    EQ.value = new EQ();
    function Semigroupoid($less$less$less) {
        this["<<<"] = $less$less$less;
    };
    function Category(__superclass_Prelude$dotSemigroupoid_0, id) {
        this["__superclass_Prelude.Semigroupoid_0"] = __superclass_Prelude$dotSemigroupoid_0;
        this.id = id;
    };
    function Show(show) {
        this.show = show;
    };
    function Functor($less$dollar$greater) {
        this["<$>"] = $less$dollar$greater;
    };
    function Apply($less$times$greater, __superclass_Prelude$dotFunctor_0) {
        this["<*>"] = $less$times$greater;
        this["__superclass_Prelude.Functor_0"] = __superclass_Prelude$dotFunctor_0;
    };
    function Applicative(__superclass_Prelude$dotApply_0, pure) {
        this["__superclass_Prelude.Apply_0"] = __superclass_Prelude$dotApply_0;
        this.pure = pure;
    };
    function Bind($greater$greater$eq, __superclass_Prelude$dotApply_0) {
        this[">>="] = $greater$greater$eq;
        this["__superclass_Prelude.Apply_0"] = __superclass_Prelude$dotApply_0;
    };
    function Monad(__superclass_Prelude$dotApplicative_0, __superclass_Prelude$dotBind_1) {
        this["__superclass_Prelude.Applicative_0"] = __superclass_Prelude$dotApplicative_0;
        this["__superclass_Prelude.Bind_1"] = __superclass_Prelude$dotBind_1;
    };
    function Num($percent, $times, $plus, $minus, $div, negate) {
        this["%"] = $percent;
        this["*"] = $times;
        this["+"] = $plus;
        this["-"] = $minus;
        this["/"] = $div;
        this.negate = negate;
    };
    function Eq($div$eq, $eq$eq) {
        this["/="] = $div$eq;
        this["=="] = $eq$eq;
    };
    function Ord(__superclass_Prelude$dotEq_0, compare) {
        this["__superclass_Prelude.Eq_0"] = __superclass_Prelude$dotEq_0;
        this.compare = compare;
    };
    function Bits($amp, $up, complement, shl, shr, zshr, $bar) {
        this["&"] = $amp;
        this["^"] = $up;
        this.complement = complement;
        this.shl = shl;
        this.shr = shr;
        this.zshr = zshr;
        this["|"] = $bar;
    };
    function BoolLike($amp$amp, not, $bar$bar) {
        this["&&"] = $amp$amp;
        this.not = not;
        this["||"] = $bar$bar;
    };
    function Semigroup($less$greater) {
        this["<>"] = $less$greater;
    };
    function cons(e) {  return function(l) {    return [e].concat(l);  };};
    function showStringImpl(s) {  return JSON.stringify(s);};
    function showNumberImpl(n) {  return n.toString();};
    function showArrayImpl(f) {  return function(xs) {    var ss = [];    for (var i = 0, l = xs.length; i < l; i++) {      ss[i] = f(xs[i]);    }    return '[' + ss.join(',') + ']';  };};
    function numAdd(n1) {  return function(n2) {    return n1 + n2;  };};
    function numSub(n1) {  return function(n2) {    return n1 - n2;  };};
    function numMul(n1) {  return function(n2) {    return n1 * n2;  };};
    function numDiv(n1) {  return function(n2) {    return n1 / n2;  };};
    function numMod(n1) {  return function(n2) {    return n1 % n2;  };};
    function numNegate(n) {  return -n;};
    function refEq(r1) {  return function(r2) {    return r1 === r2;  };};
    function refIneq(r1) {  return function(r2) {    return r1 !== r2;  };};
    function eqArrayImpl(f) {  return function(xs) {    return function(ys) {      if (xs.length !== ys.length) return false;      for (var i = 0; i < xs.length; i++) {        if (!f(xs[i])(ys[i])) return false;      }      return true;    };  };};
    function unsafeCompareImpl(lt) {  return function(eq) {    return function(gt) {      return function(x) {        return function(y) {          return x < y ? lt : x > y ? gt : eq;        };      };    };  };};
    function numShl(n1) {  return function(n2) {    return n1 << n2;  };};
    function numShr(n1) {  return function(n2) {    return n1 >> n2;  };};
    function numZshr(n1) {  return function(n2) {    return n1 >>> n2;  };};
    function numAnd(n1) {  return function(n2) {    return n1 & n2;  };};
    function numOr(n1) {  return function(n2) {    return n1 | n2;  };};
    function numXor(n1) {  return function(n2) {    return n1 ^ n2;  };};
    function numComplement(n) {  return ~n;};
    function boolAnd(b1) {  return function(b2) {    return b1 && b2;  };};
    function boolOr(b1) {  return function(b2) {    return b1 || b2;  };};
    function boolNot(b) {  return !b;};
    function concatString(s1) {  return function(s2) {    return s1 + s2;  };};
    var $bar$bar = function (dict) {
        return dict["||"];
    };
    var $bar = function (dict) {
        return dict["|"];
    };
    var $up = function (dict) {
        return dict["^"];
    };
    var $greater$greater$eq = function (dict) {
        return dict[">>="];
    };
    var $eq$eq = function (dict) {
        return dict["=="];
    };
    var $less$greater = function (dict) {
        return dict["<>"];
    };
    var $less$less$less = function (dict) {
        return dict["<<<"];
    };
    var $greater$greater$greater = function (__dict_Semigroupoid_0) {
        return function (f) {
            return function (g) {
                return $less$less$less(__dict_Semigroupoid_0)(g)(f);
            };
        };
    };
    var $less$times$greater = function (dict) {
        return dict["<*>"];
    };
    var $less$dollar$greater = function (dict) {
        return dict["<$>"];
    };
    var $colon = cons;
    var $div$eq = function (dict) {
        return dict["/="];
    };
    var $div = function (dict) {
        return dict["/"];
    };
    var $minus = function (dict) {
        return dict["-"];
    };
    var $plus$plus = function (__dict_Semigroup_1) {
        return $less$greater(__dict_Semigroup_1);
    };
    var $plus = function (dict) {
        return dict["+"];
    };
    var $times = function (dict) {
        return dict["*"];
    };
    var $amp$amp = function (dict) {
        return dict["&&"];
    };
    var $amp = function (dict) {
        return dict["&"];
    };
    var $percent = function (dict) {
        return dict["%"];
    };
    var $dollar = function (f) {
        return function (x) {
            return f(x);
        };
    };
    var $hash = function (x) {
        return function (f) {
            return f(x);
        };
    };
    var zshr = function (dict) {
        return dict.zshr;
    };
    var unsafeCompare = unsafeCompareImpl(LT.value)(EQ.value)(GT.value);
    var unit = {};
    var shr = function (dict) {
        return dict.shr;
    };
    var showUnit = function () {
        return new Show(function (_85) {
            return "Unit {}";
        });
    };
    var showString = function () {
        return new Show(showStringImpl);
    };
    var showOrdering = function () {
        return new Show(function (_93) {
            if (_93 instanceof LT) {
                return "LT";
            };
            if (_93 instanceof GT) {
                return "GT";
            };
            if (_93 instanceof EQ) {
                return "EQ";
            };
            throw new Error("Failed pattern match");
        });
    };
    var showNumber = function () {
        return new Show(showNumberImpl);
    };
    var showBoolean = function () {
        return new Show(function (_86) {
            if (_86) {
                return "true";
            };
            if (!_86) {
                return "false";
            };
            throw new Error("Failed pattern match");
        });
    };
    var show = function (dict) {
        return dict.show;
    };
    var showArray = function (__dict_Show_2) {
        return new Show(showArrayImpl(show(__dict_Show_2)));
    };
    var shl = function (dict) {
        return dict.shl;
    };
    var semigroupoidArr = function () {
        return new Semigroupoid(function (f) {
            return function (g) {
                return function (x) {
                    return f(g(x));
                };
            };
        });
    };
    var semigroupUnit = function () {
        return new Semigroup(function (_100) {
            return function (_101) {
                return {};
            };
        });
    };
    var semigroupString = function () {
        return new Semigroup(concatString);
    };
    var semigroupArr = function (__dict_Semigroup_3) {
        return new Semigroup(function (f) {
            return function (g) {
                return function (x) {
                    return $less$greater(__dict_Semigroup_3)(f(x))(g(x));
                };
            };
        });
    };
    var pure = function (dict) {
        return dict.pure;
    };
    var $$return = function (__dict_Monad_4) {
        return pure(__dict_Monad_4["__superclass_Prelude.Applicative_0"]());
    };
    var numNumber = function () {
        return new Num(numMod, numMul, numAdd, numSub, numDiv, numNegate);
    };
    var not = function (dict) {
        return dict.not;
    };
    var negate = function (dict) {
        return dict.negate;
    };
    var liftM1 = function (__dict_Monad_5) {
        return function (f) {
            return function (a) {
                return $greater$greater$eq(__dict_Monad_5["__superclass_Prelude.Bind_1"]())(a)(function (_0) {
                    return $$return(__dict_Monad_5)(f(_0));
                });
            };
        };
    };
    var liftA1 = function (__dict_Applicative_6) {
        return function (f) {
            return function (a) {
                return $less$times$greater(__dict_Applicative_6["__superclass_Prelude.Apply_0"]())(pure(__dict_Applicative_6)(f))(a);
            };
        };
    };
    var id = function (dict) {
        return dict.id;
    };
    var functorArr = function () {
        return new Functor($less$less$less(semigroupoidArr()));
    };
    var flip = function (f) {
        return function (b) {
            return function (a) {
                return f(a)(b);
            };
        };
    };
    var eqUnit = function () {
        return new Eq(function (_89) {
            return function (_90) {
                return false;
            };
        }, function (_87) {
            return function (_88) {
                return true;
            };
        });
    };
    var ordUnit = function () {
        return new Ord(eqUnit, function (_94) {
            return function (_95) {
                return EQ.value;
            };
        });
    };
    var eqString = function () {
        return new Eq(refIneq, refEq);
    };
    var ordString = function () {
        return new Ord(eqString, unsafeCompare);
    };
    var eqNumber = function () {
        return new Eq(refIneq, refEq);
    };
    var ordNumber = function () {
        return new Ord(eqNumber, unsafeCompare);
    };
    var eqBoolean = function () {
        return new Eq(refIneq, refEq);
    };
    var ordBoolean = function () {
        return new Ord(eqBoolean, function (_96) {
            return function (_97) {
                if (!_96 && !_97) {
                    return EQ.value;
                };
                if (!_96 && _97) {
                    return LT.value;
                };
                if (_96 && _97) {
                    return EQ.value;
                };
                if (_96 && !_97) {
                    return GT.value;
                };
                throw new Error("Failed pattern match");
            };
        });
    };
    var $$const = function (_81) {
        return function (_82) {
            return _81;
        };
    };
    var $$void = function (__dict_Functor_8) {
        return function (fa) {
            return $less$dollar$greater(__dict_Functor_8)($$const(unit))(fa);
        };
    };
    var complement = function (dict) {
        return dict.complement;
    };
    var compare = function (dict) {
        return dict.compare;
    };
    var $less = function (__dict_Ord_10) {
        return function (a1) {
            return function (a2) {
                var _494 = compare(__dict_Ord_10)(a1)(a2);
                if (_494 instanceof LT) {
                    return true;
                };
                return false;
            };
        };
    };
    var $less$eq = function (__dict_Ord_11) {
        return function (a1) {
            return function (a2) {
                var _495 = compare(__dict_Ord_11)(a1)(a2);
                if (_495 instanceof GT) {
                    return false;
                };
                return true;
            };
        };
    };
    var $greater = function (__dict_Ord_12) {
        return function (a1) {
            return function (a2) {
                var _496 = compare(__dict_Ord_12)(a1)(a2);
                if (_496 instanceof GT) {
                    return true;
                };
                return false;
            };
        };
    };
    var $greater$eq = function (__dict_Ord_13) {
        return function (a1) {
            return function (a2) {
                var _497 = compare(__dict_Ord_13)(a1)(a2);
                if (_497 instanceof LT) {
                    return false;
                };
                return true;
            };
        };
    };
    var categoryArr = function () {
        return new Category(semigroupoidArr, function (x) {
            return x;
        });
    };
    var boolLikeBoolean = function () {
        return new BoolLike(boolAnd, boolNot, boolOr);
    };
    var eqArray = function (__dict_Eq_7) {
        return new Eq(function (xs) {
            return function (ys) {
                return not(boolLikeBoolean())($eq$eq(eqArray(__dict_Eq_7))(xs)(ys));
            };
        }, function (xs) {
            return function (ys) {
                return eqArrayImpl($eq$eq(__dict_Eq_7))(xs)(ys);
            };
        });
    };
    var ordArray = function (__dict_Ord_9) {
        return new Ord(function () {
            return eqArray(__dict_Ord_9["__superclass_Prelude.Eq_0"]());
        }, function (_98) {
            return function (_99) {
                if (_98.length === 0 && _99.length === 0) {
                    return EQ.value;
                };
                if (_98.length === 0) {
                    return LT.value;
                };
                if (_99.length === 0) {
                    return GT.value;
                };
                if (_98.length >= 1) {
                    var _504 = _98.slice(1);
                    if (_99.length >= 1) {
                        var _502 = _99.slice(1);
                        var _500 = compare(__dict_Ord_9)(_98[0])(_99[0]);
                        if (_500 instanceof EQ) {
                            return compare(ordArray(__dict_Ord_9))(_504)(_502);
                        };
                        return _500;
                    };
                };
                throw new Error("Failed pattern match");
            };
        });
    };
    var eqOrdering = function () {
        return new Eq(function (x) {
            return function (y) {
                return not(boolLikeBoolean())($eq$eq(eqOrdering())(x)(y));
            };
        }, function (_91) {
            return function (_92) {
                if (_91 instanceof LT && _92 instanceof LT) {
                    return true;
                };
                if (_91 instanceof GT && _92 instanceof GT) {
                    return true;
                };
                if (_91 instanceof EQ && _92 instanceof EQ) {
                    return true;
                };
                return false;
            };
        });
    };
    var bitsNumber = function () {
        return new Bits(numAnd, numXor, numComplement, numShl, numShr, numZshr, numOr);
    };
    var asTypeOf = function (_83) {
        return function (_84) {
            return _83;
        };
    };
    var applyArr = function () {
        return new Apply(function (f) {
            return function (g) {
                return function (x) {
                    return f(x)(g(x));
                };
            };
        }, functorArr);
    };
    var bindArr = function () {
        return new Bind(function (m) {
            return function (f) {
                return function (x) {
                    return f(m(x))(x);
                };
            };
        }, applyArr);
    };
    var applicativeArr = function () {
        return new Applicative(applyArr, $$const);
    };
    var monadArr = function () {
        return new Monad(applicativeArr, bindArr);
    };
    var ap = function (__dict_Monad_14) {
        return function (f) {
            return function (a) {
                return $greater$greater$eq(__dict_Monad_14["__superclass_Prelude.Bind_1"]())(f)(function (_2) {
                    return $greater$greater$eq(__dict_Monad_14["__superclass_Prelude.Bind_1"]())(a)(function (_1) {
                        return $$return(__dict_Monad_14)(_2(_1));
                    });
                });
            };
        };
    };
    return {
        Unit: Unit, 
        LT: LT, 
        GT: GT, 
        EQ: EQ, 
        Semigroup: Semigroup, 
        BoolLike: BoolLike, 
        Bits: Bits, 
        Ord: Ord, 
        Eq: Eq, 
        Num: Num, 
        Monad: Monad, 
        Bind: Bind, 
        Applicative: Applicative, 
        Apply: Apply, 
        Functor: Functor, 
        Show: Show, 
        Category: Category, 
        Semigroupoid: Semigroupoid, 
        unit: unit, 
        "++": $plus$plus, 
        "<>": $less$greater, 
        not: not, 
        "||": $bar$bar, 
        "&&": $amp$amp, 
        complement: complement, 
        zshr: zshr, 
        shr: shr, 
        shl: shl, 
        "^": $up, 
        "|": $bar, 
        "&": $amp, 
        ">=": $greater$eq, 
        "<=": $less$eq, 
        ">": $greater, 
        "<": $less, 
        compare: compare, 
        refIneq: refIneq, 
        refEq: refEq, 
        "/=": $div$eq, 
        "==": $eq$eq, 
        negate: negate, 
        "%": $percent, 
        "/": $div, 
        "*": $times, 
        "-": $minus, 
        "+": $plus, 
        ap: ap, 
        liftM1: liftM1, 
        "return": $$return, 
        ">>=": $greater$greater$eq, 
        liftA1: liftA1, 
        pure: pure, 
        "<*>": $less$times$greater, 
        "void": $$void, 
        "<$>": $less$dollar$greater, 
        show: show, 
        cons: cons, 
        ":": $colon, 
        "#": $hash, 
        "$": $dollar, 
        id: id, 
        ">>>": $greater$greater$greater, 
        "<<<": $less$less$less, 
        asTypeOf: asTypeOf, 
        "const": $$const, 
        flip: flip, 
        semigroupoidArr: semigroupoidArr, 
        categoryArr: categoryArr, 
        showUnit: showUnit, 
        showString: showString, 
        showBoolean: showBoolean, 
        showNumber: showNumber, 
        showArray: showArray, 
        functorArr: functorArr, 
        applyArr: applyArr, 
        applicativeArr: applicativeArr, 
        bindArr: bindArr, 
        monadArr: monadArr, 
        numNumber: numNumber, 
        eqUnit: eqUnit, 
        eqString: eqString, 
        eqNumber: eqNumber, 
        eqBoolean: eqBoolean, 
        eqArray: eqArray, 
        eqOrdering: eqOrdering, 
        showOrdering: showOrdering, 
        ordUnit: ordUnit, 
        ordBoolean: ordBoolean, 
        ordNumber: ordNumber, 
        ordString: ordString, 
        ordArray: ordArray, 
        bitsNumber: bitsNumber, 
        boolLikeBoolean: boolLikeBoolean, 
        semigroupUnit: semigroupUnit, 
        semigroupString: semigroupString, 
        semigroupArr: semigroupArr
    };
})();
var PS = PS || {};
PS.Prelude_Unsafe = (function () {
    "use strict";
    var Prelude = PS.Prelude;
    function unsafeIndex(xs) {  return function(n) {    return xs[n];  };};
    return {
        unsafeIndex: unsafeIndex
    };
})();
var PS = PS || {};
PS.Math = (function () {
    "use strict";
    var Prelude = PS.Prelude;
    var abs = Math.abs;;
    var acos = Math.acos;;
    var asin = Math.asin;;
    var atan = Math.atan;;
    function atan2(y){  return function (x) {    return Math.atan2(y, x);  };};
    var ceil = Math.ceil;;
    var cos = Math.cos;;
    var exp = Math.exp;;
    var floor = Math.floor;;
    var log = Math.log;;
    function max(n1){  return function(n2) {    return Math.max(n1, n2);  }};
    function min(n1){  return function(n2) {    return Math.min(n1, n2);  }};
    function pow(n){  return function(p) {    return Math.pow(n, p);  }};
    var round = Math.round;;
    var sin = Math.sin;;
    var sqrt = Math.sqrt;;
    var tan = Math.tan;;
    var e       = Math.E;;
    var ln2     = Math.LN2;;
    var ln10    = Math.LN10;;
    var log2e   = Math.LOG2E;;
    var log10e  = Math.LOG10E;;
    var pi      = Math.PI;;
    var sqrt1_2 = Math.SQRT1_2;;
    var sqrt2   = Math.SQRT2;;
    return {
        sqrt2: sqrt2, 
        sqrt1_2: sqrt1_2, 
        pi: pi, 
        log10e: log10e, 
        log2e: log2e, 
        ln10: ln10, 
        ln2: ln2, 
        e: e, 
        tan: tan, 
        sqrt: sqrt, 
        sin: sin, 
        round: round, 
        pow: pow, 
        min: min, 
        max: max, 
        log: log, 
        floor: floor, 
        exp: exp, 
        cos: cos, 
        ceil: ceil, 
        atan2: atan2, 
        atan: atan, 
        asin: asin, 
        acos: acos, 
        abs: abs
    };
})();
var PS = PS || {};
PS.Data_String = (function () {
    "use strict";
    var Prelude = PS.Prelude;
    function charAt(i) {  return function(s) {    return s.charAt(i);   };};
    function charCodeAt(i) {  return function(s) {    return s.charCodeAt(i);   };};
    function fromCharCode(n) {  return String.fromCharCode(n);};
    function indexOf(x) {  return function(s) {    return s.indexOf(x);  }; };
    function indexOf$prime(x) {  return function(startAt) {    return function(s) {      return s.indexOf(x, startAt);    };   }; };
    function lastIndexOf(x) {  return function(s) {    return s.lastIndexOf(x);  };};
    function lastIndexOf$prime(x) {  return function(startAt) {    return function(s) {      return s.lastIndexOf(x, startAt);    };   }; };
    function length(s) {  return s.length;};
    function localeCompare(s1) {  return function(s2) {    return s1.localeCompare(s2);  };};
    function replace(s1) {  return function(s2) {    return function(s3) {      return s3.replace(s1, s2);    };  };};
    function take(n) {  return function(s) {    return s.substr(0, n);  };};
    function drop(n) {  return function(s) {    return s.substr(n);  };};
    function split(sep) {  return function(s) {    return s.split(sep);  };};
    function toLower(s) {  return s.toLowerCase();};
    function toUpper(s) {  return s.toUpperCase();};
    function trim(s) {  return s.trim();};
    function joinWith (s) {  return function (xs) {    return xs.join(s);  };};
    return {
        joinWith: joinWith, 
        trim: trim, 
        toUpper: toUpper, 
        toLower: toLower, 
        split: split, 
        drop: drop, 
        take: take, 
        replace: replace, 
        localeCompare: localeCompare, 
        length: length, 
        "lastIndexOf'": lastIndexOf$prime, 
        lastIndexOf: lastIndexOf, 
        "indexOf'": indexOf$prime, 
        indexOf: indexOf, 
        fromCharCode: fromCharCode, 
        charCodeAt: charCodeAt, 
        charAt: charAt
    };
})();
var PS = PS || {};
PS.Data_String_Regex = (function () {
    "use strict";
    var Prelude = PS.Prelude;
    var Data_String = PS.Data_String;
    function showRegex$prime(r){  return '' + r;};
    function regex$prime(s1) {  return function(s2) {    return new RegExp(s1, s2);  };};
    function source(r) {  return r.source;};
    function flags(r) {  return {    multiline: r.multiline,    ignoreCase: r.ignoreCase,    global: r.global,    sticky: !!r.sticky,    unicode: !!r.unicode  };};
    function test(r) {  return function (s) {    return r.test(s);  };};
    function match(r) {  return function (s) {    return s.match(r);   };};
    function replace(r) {  return function(s1) {    return function(s2) {      return s2.replace(r, s1);    };  };};
    function replace$prime(r) {  return function(f) {    return function(s2) {      return s2.replace(r, function (match) {        return f(match)(Array.prototype.splice.call(arguments, 1, arguments.length - 3));      });    };  };};
    function search(r) {  return function (s) {    return s.search(r);  };};
    var showRegex = function () {
        return new Prelude.Show(showRegex$prime);
    };
    var renderFlags = function (flags_1) {
        return (flags_1.global ? "g" : "") + ((flags_1.ignoreCase ? "i" : "") + ((flags_1.multiline ? "m" : "") + ((flags_1.sticky ? "y" : "") + (flags_1.unicode ? "u" : ""))));
    };
    var regex = function (source_1) {
        return function (flags_1) {
            return regex$prime(source_1)(renderFlags(flags_1));
        };
    };
    var parseFlags = function (s) {
        return {
            global: Data_String.indexOf("g")(s) >= 0, 
            ignoreCase: Data_String.indexOf("i")(s) >= 0, 
            multiline: Data_String.indexOf("m")(s) >= 0, 
            sticky: Data_String.indexOf("y")(s) >= 0, 
            unicode: Data_String.indexOf("u")(s) >= 0
        };
    };
    return {
        search: search, 
        "replace'": replace$prime, 
        replace: replace, 
        match: match, 
        test: test, 
        parseFlags: parseFlags, 
        renderFlags: renderFlags, 
        flags: flags, 
        source: source, 
        regex: regex, 
        showRegex: showRegex
    };
})();
var PS = PS || {};
PS.Data_Function = (function () {
    "use strict";
    var Prelude = PS.Prelude;
    function mkFn0(fn) {  return function() {    return fn({});  };};
    function mkFn1(fn) {  return function(a) {    return fn(a);  };};
    function mkFn2(fn) {  return function(a, b) {    return fn(a)(b);  };};
    function mkFn3(fn) {  return function(a, b, c) {    return fn(a)(b)(c);  };};
    function mkFn4(fn) {  return function(a, b, c, d) {    return fn(a)(b)(c)(d);  };};
    function mkFn5(fn) {  return function(a, b, c, d, e) {    return fn(a)(b)(c)(d)(e);  };};
    function mkFn6(fn) {  return function(a, b, c, d, e, f) {    return fn(a)(b)(c)(d)(e)(f);  };};
    function mkFn7(fn) {  return function(a, b, c, d, e, f, g) {    return fn(a)(b)(c)(d)(e)(f)(g);  };};
    function mkFn8(fn) {  return function(a, b, c, d, e, f, g, h) {    return fn(a)(b)(c)(d)(e)(f)(g)(h);  };};
    function mkFn9(fn) {  return function(a, b, c, d, e, f, g, h, i) {    return fn(a)(b)(c)(d)(e)(f)(g)(h)(i);  };};
    function mkFn10(fn) {  return function(a, b, c, d, e, f, g, h, i, j) {    return fn(a)(b)(c)(d)(e)(f)(g)(h)(i)(j);  };};
    function runFn0(fn) {  return fn();};
    function runFn1(fn) {  return function(a) {    return fn(a);  };};
    function runFn2(fn) {  return function(a) {    return function(b) {      return fn(a, b);    };  };};
    function runFn3(fn) {  return function(a) {    return function(b) {      return function(c) {        return fn(a, b, c);      };    };  };};
    function runFn4(fn) {  return function(a) {    return function(b) {      return function(c) {        return function(d) {          return fn(a, b, c, d);        };      };    };  };};
    function runFn5(fn) {  return function(a) {    return function(b) {      return function(c) {        return function(d) {          return function(e) {            return fn(a, b, c, d, e);          };        };      };    };  };};
    function runFn6(fn) {  return function(a) {    return function(b) {      return function(c) {        return function(d) {          return function(e) {            return function(f) {              return fn(a, b, c, d, e, f);            };          };        };      };    };  };};
    function runFn7(fn) {  return function(a) {    return function(b) {      return function(c) {        return function(d) {          return function(e) {            return function(f) {              return function(g) {                return fn(a, b, c, d, e, f, g);              };            };          };        };      };    };  };};
    function runFn8(fn) {  return function(a) {    return function(b) {      return function(c) {        return function(d) {          return function(e) {            return function(f) {              return function(g) {                return function(h) {                  return fn(a, b, c, d, e, f, g, h);                };              };            };          };        };      };    };  };};
    function runFn9(fn) {  return function(a) {    return function(b) {      return function(c) {        return function(d) {          return function(e) {            return function(f) {              return function(g) {                return function(h) {                  return function(i) {                    return fn(a, b, c, d, e, f, g, h, i);                  };                };              };            };          };        };      };    };  };};
    function runFn10(fn) {  return function(a) {    return function(b) {      return function(c) {        return function(d) {          return function(e) {            return function(f) {              return function(g) {                return function(h) {                  return function(i) {                    return function(j) {                      return fn(a, b, c, d, e, f, g, h, i, j);                    };                  };                };              };            };          };        };      };    };  };};
    var on = function (f) {
        return function (g) {
            return function (x) {
                return function (y) {
                    return f(g(x))(g(y));
                };
            };
        };
    };
    return {
        runFn10: runFn10, 
        runFn9: runFn9, 
        runFn8: runFn8, 
        runFn7: runFn7, 
        runFn6: runFn6, 
        runFn5: runFn5, 
        runFn4: runFn4, 
        runFn3: runFn3, 
        runFn2: runFn2, 
        runFn1: runFn1, 
        runFn0: runFn0, 
        mkFn10: mkFn10, 
        mkFn9: mkFn9, 
        mkFn8: mkFn8, 
        mkFn7: mkFn7, 
        mkFn6: mkFn6, 
        mkFn5: mkFn5, 
        mkFn4: mkFn4, 
        mkFn3: mkFn3, 
        mkFn2: mkFn2, 
        mkFn1: mkFn1, 
        mkFn0: mkFn0, 
        on: on
    };
})();
var PS = PS || {};
PS.Data_Foreign_EasyFFI = (function () {
    "use strict";
    var Prelude = PS.Prelude;
    function unsafeForeignProcedure(args) {  return function (stmt) {    return Function(wrap(args.slice()))();    function wrap() {      return !args.length ? stmt : 'return function (' + args.shift() + ') { ' + wrap() + ' };';    }  };};
    var unsafeForeignFunction = function (args) {
        return function (expr) {
            return unsafeForeignProcedure(args)("return " + (expr + ";"));
        };
    };
    return {
        unsafeForeignProcedure: unsafeForeignProcedure, 
        unsafeForeignFunction: unsafeForeignFunction
    };
})();
var PS = PS || {};
PS.Data_Eq = (function () {
    "use strict";
    var Prelude = PS.Prelude;
    var Ref = {
        create: function (value) {
            return value;
        }
    };
    var liftRef = function (_102) {
        return function (_103) {
            return function (_104) {
                return _102(_103)(_104);
            };
        };
    };
    var functorRef = function () {
        return new Prelude.Functor(function (_105) {
            return function (_106) {
                return _105(_106);
            };
        });
    };
    var eqRef = function () {
        return new Prelude.Eq(liftRef(Prelude.refIneq), liftRef(Prelude.refEq));
    };
    return {
        Ref: Ref, 
        liftRef: liftRef, 
        eqRef: eqRef, 
        functorRef: functorRef
    };
})();
var PS = PS || {};
PS.Control_Monad_Trans = (function () {
    "use strict";
    var Prelude = PS.Prelude;
    function MonadTrans(lift) {
        this.lift = lift;
    };
    var lift = function (dict) {
        return dict.lift;
    };
    return {
        MonadTrans: MonadTrans, 
        lift: lift
    };
})();
var PS = PS || {};
PS.Control_Monad_Error = (function () {
    "use strict";
    var Prelude = PS.Prelude;
    function Error(noMsg, strMsg) {
        this.noMsg = noMsg;
        this.strMsg = strMsg;
    };
    var strMsg = function (dict) {
        return dict.strMsg;
    };
    var noMsg = function (dict) {
        return dict.noMsg;
    };
    var errorString = function () {
        return new Error("", Prelude.id(Prelude.categoryArr()));
    };
    return {
        Error: Error, 
        strMsg: strMsg, 
        noMsg: noMsg, 
        errorString: errorString
    };
})();
var PS = PS || {};
PS.Control_Monad_Eff = (function () {
    "use strict";
    var Prelude = PS.Prelude;
    function returnE(a) {  return function() {    return a;  };};
    function bindE(a) {  return function(f) {    return function() {      return f(a())();    };  };};
    function runPure(f) {  return f();};
    function untilE(f) {  return function() {    while (!f());    return {};  };};
    function whileE(f) {  return function(a) {    return function() {      while (f()) {        a();      }      return {};    };  };};
    function forE(lo) {  return function(hi) {    return function(f) {      return function() {        for (var i = lo; i < hi; i++) {          f(i)();        }      };    };  };};
    function foreachE(as) {  return function(f) {    return function() {      for (var i = 0; i < as.length; i++) {        f(as[i])();      }    };  };};
    var applicativeEff = function () {
        return new Prelude.Applicative(applyEff, returnE);
    };
    var applyEff = function () {
        return new Prelude.Apply(Prelude.ap(monadEff()), functorEff);
    };
    var monadEff = function () {
        return new Prelude.Monad(applicativeEff, bindEff);
    };
    var bindEff = function () {
        return new Prelude.Bind(bindE, applyEff);
    };
    var functorEff = function () {
        return new Prelude.Functor(Prelude.liftA1(applicativeEff()));
    };
    return {
        foreachE: foreachE, 
        forE: forE, 
        whileE: whileE, 
        untilE: untilE, 
        runPure: runPure, 
        bindE: bindE, 
        returnE: returnE, 
        functorEff: functorEff, 
        applyEff: applyEff, 
        applicativeEff: applicativeEff, 
        bindEff: bindEff, 
        monadEff: monadEff
    };
})();
var PS = PS || {};
PS.Control_Monad_Eff_Exception = (function () {
    "use strict";
    var Prelude = PS.Prelude;
    function showErrorImpl(err) {  return err.stack ? err.stack : err.toString();};
    function error(msg) {  return new Error(msg);};;
    function message(e) {  return e.message;};
    function throwException(e) {  return function() {    throw e;  };};
    function catchException(c) {  return function(t) {    return function() {      try {        return t();      } catch(e) {        if (e instanceof Error || {}.toString.call(e) === '[object Error]') {          return c(e)();        } else {          return c(new Error(e.toString()))();        }      }    };  };};
    var showError = function () {
        return new Prelude.Show(showErrorImpl);
    };
    return {
        catchException: catchException, 
        throwException: throwException, 
        message: message, 
        error: error, 
        showErrorImpl: showErrorImpl, 
        showError: showError
    };
})();
var PS = PS || {};
PS.Control_Monad_Eff_Random = (function () {
    "use strict";
    var Prelude = PS.Prelude;
    function random() {  return Math.random();};
    return {
        random: random
    };
})();
var PS = PS || {};
PS.Control_Monad_Eff_Ref = (function () {
    "use strict";
    var Prelude = PS.Prelude;
    function newRef(val) {  return function () {    return { value: val };  };};
    function readRef(ref) {  return function() {    return ref.value;  };};
    function modifyRef(ref) {  return function(f) {    return function() {      ref.value = f(ref.value);      return {};    };  };};
    function writeRef(ref) {  return function(val) {    return function() {      ref.value = val;      return {};    };  };};
    return {
        writeRef: writeRef, 
        modifyRef: modifyRef, 
        readRef: readRef, 
        newRef: newRef
    };
})();
var PS = PS || {};
PS.Control_Monad_Eff_Ref_Unsafe = (function () {
    "use strict";
    var Prelude = PS.Prelude;
    function unsafeRunRef(f) {  return f;};
    return {
        unsafeRunRef: unsafeRunRef
    };
})();
var PS = PS || {};
PS.Control_Monad_Eff_Unsafe = (function () {
    "use strict";
    var Prelude = PS.Prelude;
    function unsafeInterleaveEff(f) {  return f;};
    return {
        unsafeInterleaveEff: unsafeInterleaveEff
    };
})();
var PS = PS || {};
PS.Control_Monad_ST = (function () {
    "use strict";
    var Prelude = PS.Prelude;
    function newSTRef(val) {  return function() {    return { value: val };  };};
    function readSTRef(ref) {  return function() {    return ref.value;  };};
    function modifySTRef(ref) {  return function(f) {    return function() {      return ref.value = f(ref.value);    };  };};
    function writeSTRef(ref) {  return function(a) {    return function() {      return ref.value = a;    };  };};
    function newSTArray(len) {  return function(a) {    return function() {      var arr = [];      for (var i = 0; i < len; i++) {        arr[i] = a;      };      return arr;    };  };};
    function peekSTArray(arr) {  return function(i) {    return function() {      return arr[i];    };  };};
    function pokeSTArray(arr) {  return function(i) {    return function(a) {      return function() {        return arr[i] = a;      };    };  };};
    function runST(f) {  return f;};
    function runSTArray(f) {  return f;};
    return {
        runSTArray: runSTArray, 
        runST: runST, 
        pokeSTArray: pokeSTArray, 
        peekSTArray: peekSTArray, 
        newSTArray: newSTArray, 
        writeSTRef: writeSTRef, 
        modifySTRef: modifySTRef, 
        readSTRef: readSTRef, 
        newSTRef: newSTRef
    };
})();
var PS = PS || {};
PS.Control_Reactive_Timer = (function () {
    "use strict";
    var Prelude = PS.Prelude;
    function timeout(time) {  var env = typeof global !== 'undefined' ? global : window;  return function(fn) {    return function() {      return env.setTimeout(fn, time);    };  };};
    function clearTimeout(timer) {  var env = typeof global !== 'undefined' ? global : window;  return function() {    return env.clearTimeout(timer);  };};
    function interval(time) {  var env = typeof global !== 'undefined' ? global : window;  return function(fn) {    return function() {      return env.setInterval(fn, time);    };  };};
    function clearInterval(timer) {  var env = typeof global !== 'undefined' ? global : window;  return function() {    return env.clearInterval(timer);  };};
    return {
        clearInterval: clearInterval, 
        interval: interval, 
        clearTimeout: clearTimeout, 
        timeout: timeout
    };
})();
var PS = PS || {};
PS.Data_Foreign_OOFFI = (function () {
    "use strict";
    var Prelude = PS.Prelude;
    var Data_Function = PS.Data_Function;
    function method0Impl(fnName, o){  return o[fnName]();};
    function method0EffImpl(fnName, o){  return function(){    return o[fnName]();  };};
    function method1Impl(fnName, o, a){  return o[fnName](a);};
    function method1EffImpl(fnName, o, a){  return function(){    return o[fnName](a);  };};
    function method2Impl(fnName, o, a, b){  return o[fnName](a, b);};
    function method2EffImpl(fnName, o, a, b){  return function(){    return o[fnName](a, b);  };};
    function method3Impl(fnName, o, a, b, c){  return o[fnName](a, b, c);};
    function method3EffImpl(fnName, o, a, b, c){  return function(){    return o[fnName](a, b, c);  };};
    function method4Impl(fnName, o, a, b, c, e){  return o[fnName](a, b, c, e);};
    function method4EffImpl(fnName, o, a, b, c, e){  return function(){    return o[fnName](a, b, c, e);  };};
    function method5Impl(fnName, o, a, b, c, e, f){  return o[fnName](a, b, c, e, f);};
    function method5EffImpl(fnName, o, a, b, c, e, f){  return function(){    return o[fnName](a, b, c, e, f);  };};
    function getterImpl(propName, o){  return function(){    return o[propName];  };};
    function modifierImpl(propName, o, fn){  return function(){    o[propName] = fn(o[propName]);    return o[propName];  };};
    function setterImpl(propName, o, v){  return function(){    o[propName] = v;    return v;  };};
    var setter = Data_Function.runFn3(setterImpl);
    var modifier = Data_Function.runFn3(modifierImpl);
    var method5Eff = Data_Function.runFn7(method5EffImpl);
    var method5 = Data_Function.runFn7(method5Impl);
    var method4Eff = Data_Function.runFn6(method4EffImpl);
    var method4 = Data_Function.runFn6(method4Impl);
    var method3Eff = Data_Function.runFn5(method3EffImpl);
    var method3 = Data_Function.runFn5(method3Impl);
    var method2Eff = Data_Function.runFn4(method2EffImpl);
    var method2 = Data_Function.runFn4(method2Impl);
    var method1Eff = Data_Function.runFn3(method1EffImpl);
    var method1 = Data_Function.runFn3(method1Impl);
    var method0Eff = Data_Function.runFn2(method0EffImpl);
    var method0 = Data_Function.runFn2(method0Impl);
    var getter = Data_Function.runFn2(getterImpl);
    return {
        setter: setter, 
        modifier: modifier, 
        getter: getter, 
        method5Eff: method5Eff, 
        method5: method5, 
        method4Eff: method4Eff, 
        method4: method4, 
        method3Eff: method3Eff, 
        method3: method3, 
        method2Eff: method2Eff, 
        method2: method2, 
        method1Eff: method1Eff, 
        method1: method1, 
        method0Eff: method0Eff, 
        method0: method0
    };
})();
var PS = PS || {};
PS.Debug_Trace = (function () {
    "use strict";
    var Prelude = PS.Prelude;
    function trace(s) {  return function() {    console.log(s);    return {};  };};
    var print = function (__dict_Show_15) {
        return function (o) {
            return trace(Prelude.show(__dict_Show_15)(o));
        };
    };
    return {
        print: print, 
        trace: trace
    };
})();
var PS = PS || {};
PS.Debug_Foreign = (function () {
    "use strict";
    var Prelude = PS.Prelude;
    var Data_Foreign_EasyFFI = PS.Data_Foreign_EasyFFI;
    var ftrace = Data_Foreign_EasyFFI.unsafeForeignProcedure([ "x", "" ])("console.log(JSON.stringify(x))");
    var fprint = Data_Foreign_EasyFFI.unsafeForeignProcedure([ "x", "" ])("console.log(x)");
    return {
        ftrace: ftrace, 
        fprint: fprint
    };
})();
var PS = PS || {};
PS.Debug_Foreign_Evil = (function () {
    "use strict";
    var Prelude = PS.Prelude;
    var Data_Foreign_EasyFFI = PS.Data_Foreign_EasyFFI;
    var Control_Monad_Eff = PS.Control_Monad_Eff;
    var Debug_Foreign = PS.Debug_Foreign;
    var evil = Data_Foreign_EasyFFI.unsafeForeignFunction([ "x", "" ])("eval(x)");
    var fpeek = function (x) {
        return Prelude[">>="](Control_Monad_Eff.bindEff())(evil(x))(Debug_Foreign.fprint);
    };
    return {
        fpeek: fpeek, 
        evil: evil
    };
})();
var PS = PS || {};
PS.Network_SocketIO = (function () {
    "use strict";
    var Prelude = PS.Prelude;
    var Control_Monad_Eff = PS.Control_Monad_Eff;
    var Data_Foreign_OOFFI = PS.Data_Foreign_OOFFI;
    function Response(value0) {
        this.value0 = value0;
    };
    Response.create = function (value0) {
        return new Response(value0);
    };
    
  function getSocketSinglton(url){
    return function(){
      if(window.Socket){ return window.Socket; }
      return window.Socket = io.connect(url);
    };
  }
  ;
    var $less$colon$greater = function (f) {
        return function (x) {
            return function __do() {
                var _ = f();
                return x;
            };
        };
    };
    var on = function (s) {
        return function (f) {
            return function (so) {
                return $less$colon$greater(Data_Foreign_OOFFI.method2Eff("on")(so)(s)(f))(so);
            };
        };
    };
    var functorResponse = function () {
        return new Prelude.Functor(function (_107) {
            return function (_108) {
                return new Response(_107(_108.value0));
            };
        });
    };
    var emit = function (s) {
        return function (d) {
            return function (so) {
                return $less$colon$greater(Data_Foreign_OOFFI.method2Eff("emit")(so)(s)(d))(so);
            };
        };
    };
    var applyResponse = function () {
        return new Prelude.Apply(function (_109) {
            return function (_110) {
                return Prelude["<$>"](functorResponse())(_109.value0)(_110);
            };
        }, functorResponse);
    };
    var bindResponse = function () {
        return new Prelude.Bind(function (_111) {
            return function (_112) {
                return _112(_111.value0);
            };
        }, applyResponse);
    };
    var applicativeResponse = function () {
        return new Prelude.Applicative(applyResponse, Response.create);
    };
    var monadResponse = function () {
        return new Prelude.Monad(applicativeResponse, bindResponse);
    };
    return {
        Response: Response, 
        on: on, 
        emit: emit, 
        "<:>": $less$colon$greater, 
        getSocketSinglton: getSocketSinglton, 
        functorResponse: functorResponse, 
        applyResponse: applyResponse, 
        applicativeResponse: applicativeResponse, 
        bindResponse: bindResponse, 
        monadResponse: monadResponse
    };
})();
var PS = PS || {};
PS.Test_Chai = (function () {
    "use strict";
    var Prelude = PS.Prelude;
    var Data_Foreign_EasyFFI = PS.Data_Foreign_EasyFFI;
    function Expect() {

    };
    Expect.value = new Expect();
    function Error() {

    };
    Error.value = new Error();
    var toThrow = Data_Foreign_EasyFFI.unsafeForeignProcedure([ "expect", "", "" ])("expect.to.throw(Error)");
    var toNotThrow = Data_Foreign_EasyFFI.unsafeForeignProcedure([ "expect", "", "" ])("expect.to.not.throw(Error)");
    var expect = Data_Foreign_EasyFFI.unsafeForeignFunction([ "source" ])("chai.expect(source)");
    var bindExpectation = function (x) {
        return Data_Foreign_EasyFFI.unsafeForeignProcedure([ "expect", "target", "" ])("expect." + (x + "(target)"));
    };
    var toBeAbove = bindExpectation("to.be.above");
    var toBeAtLeast = bindExpectation("to.be.at.least");
    var toBeAtMost = bindExpectation("to.be.at.most");
    var toBeBelow = bindExpectation("to.be.below");
    var toDeepEqual = bindExpectation("to.deep.equal");
    var toEql = bindExpectation("to.eql");
    var toEqual = bindExpectation("to.equal");
    var toInclude = bindExpectation("to.include");
    var toNotBeAbove = bindExpectation("to.not.be.above");
    var toNotBeAtLeast = bindExpectation("to.not.be.at.least");
    var toNotBeAtMost = bindExpectation("to.not.be.at.most");
    var toNotBeBelow = bindExpectation("to.not.be.below");
    var toNotDeepEqual = bindExpectation("to.not.deep.equal");
    var toNotEql = bindExpectation("to.not.eql");
    var toNotEqual = bindExpectation("to.not.equal");
    var toNotInclude = bindExpectation("to.not.include");
    return {
        Expect: Expect, 
        Error: Error, 
        toNotThrow: toNotThrow, 
        toThrow: toThrow, 
        toNotInclude: toNotInclude, 
        toInclude: toInclude, 
        toNotBeAtMost: toNotBeAtMost, 
        toBeAtMost: toBeAtMost, 
        toNotBeBelow: toNotBeBelow, 
        toBeBelow: toBeBelow, 
        toNotBeAtLeast: toNotBeAtLeast, 
        toBeAtLeast: toBeAtLeast, 
        toNotBeAbove: toNotBeAbove, 
        toBeAbove: toBeAbove, 
        toNotEql: toNotEql, 
        toEql: toEql, 
        toNotDeepEqual: toNotDeepEqual, 
        toDeepEqual: toDeepEqual, 
        toNotEqual: toNotEqual, 
        toEqual: toEqual, 
        expect: expect
    };
})();
var PS = PS || {};
PS.Test_Mocha = (function () {
    "use strict";
    var Prelude = PS.Prelude;
    var Data_Foreign_EasyFFI = PS.Data_Foreign_EasyFFI;
    function DoneToken() {

    };
    DoneToken.value = new DoneToken();
    function itAsync(d) {                              return function (fn) {                            return function(){                               return window.it(d, function(done){              return fn(done)();                           });                                          };                                          };                                         };
    function itIs(d){ return function(){d();} };
    function itIsNot(d){ return function(){}; };
    var itSkip = Data_Foreign_EasyFFI.unsafeForeignProcedure([ "description", "fn", "" ])("window.it.skip(description, fn);");
    var itOnly = Data_Foreign_EasyFFI.unsafeForeignProcedure([ "description", "fn", "" ])("window.it.only(description, fn);");
    var it = Data_Foreign_EasyFFI.unsafeForeignProcedure([ "description", "fn", "" ])("window.it(description, fn);");
    var describeSkip = Data_Foreign_EasyFFI.unsafeForeignProcedure([ "description", "fn", "" ])("window.describe.skip(description, fn);");
    var describeOnly = Data_Foreign_EasyFFI.unsafeForeignProcedure([ "description", "fn", "" ])("window.describe.only(description, fn);");
    var describe = Data_Foreign_EasyFFI.unsafeForeignProcedure([ "description", "fn", "" ])("window.describe(description, fn);");
    var beforeEach = Data_Foreign_EasyFFI.unsafeForeignProcedure([ "fn", "" ])("window.beforeEach(fn);");
    var before = Data_Foreign_EasyFFI.unsafeForeignProcedure([ "fn", "" ])("window.before(fn);");
    var afterEach = Data_Foreign_EasyFFI.unsafeForeignProcedure([ "fn", "" ])("window.afterEach(fn);");
    var after = Data_Foreign_EasyFFI.unsafeForeignProcedure([ "fn", "" ])("window.after(fn);");
    return {
        DoneToken: DoneToken, 
        afterEach: afterEach, 
        after: after, 
        beforeEach: beforeEach, 
        before: before, 
        describeOnly: describeOnly, 
        describeSkip: describeSkip, 
        describe: describe, 
        itOnly: itOnly, 
        itSkip: itSkip, 
        itAsync: itAsync, 
        it: it, 
        itIsNot: itIsNot, 
        itIs: itIs
    };
})();
var PS = PS || {};
PS.Control_Monad_Cont_Trans = (function () {
    "use strict";
    var Prelude = PS.Prelude;
    var Control_Monad_Trans = PS.Control_Monad_Trans;
    var ContT = {
        create: function (value) {
            return value;
        }
    };
    var runContT = function (_113) {
        return function (_114) {
            return _113(_114);
        };
    };
    var withContT = function (f) {
        return function (m) {
            return function (k) {
                return runContT(m)(f(k));
            };
        };
    };
    var monadTransContT = function () {
        return new Control_Monad_Trans.MonadTrans(function (__dict_Monad_16) {
            return function (m) {
                return function (k) {
                    return Prelude[">>="](__dict_Monad_16["__superclass_Prelude.Bind_1"]())(m)(k);
                };
            };
        });
    };
    var mapContT = function (f) {
        return function (m) {
            return function (k) {
                return f(runContT(m)(k));
            };
        };
    };
    var functorContT = function (__dict_Monad_18) {
        return new Prelude.Functor(function (f) {
            return function (m) {
                return function (k) {
                    return runContT(m)(function (a) {
                        return k(f(a));
                    });
                };
            };
        });
    };
    var callCC = function (f) {
        return function (k) {
            return runContT(f(function (a) {
                return function (_) {
                    return k(a);
                };
            }))(k);
        };
    };
    var applyContT = function (__dict_Functor_20) {
        return function (__dict_Monad_21) {
            return new Prelude.Apply(function (f) {
                return function (v) {
                    return function (k) {
                        return runContT(f)(function (g) {
                            return runContT(v)(function (a) {
                                return k(g(a));
                            });
                        });
                    };
                };
            }, function () {
                return functorContT(__dict_Monad_21);
            });
        };
    };
    var bindContT = function (__dict_Monad_19) {
        return new Prelude.Bind(function (m) {
            return function (k) {
                return function (k$prime) {
                    return runContT(m)(function (a) {
                        return runContT(k(a))(k$prime);
                    });
                };
            };
        }, function () {
            return applyContT(((__dict_Monad_19["__superclass_Prelude.Applicative_0"]())["__superclass_Prelude.Apply_0"]())["__superclass_Prelude.Functor_0"]())(__dict_Monad_19);
        });
    };
    var applicativeContT = function (__dict_Functor_22) {
        return function (__dict_Monad_23) {
            return new Prelude.Applicative(function () {
                return applyContT(__dict_Functor_22)(__dict_Monad_23);
            }, function (a) {
                return function (k) {
                    return k(a);
                };
            });
        };
    };
    var monadContT = function (__dict_Monad_17) {
        return new Prelude.Monad(function () {
            return applicativeContT(((__dict_Monad_17["__superclass_Prelude.Applicative_0"]())["__superclass_Prelude.Apply_0"]())["__superclass_Prelude.Functor_0"]())(__dict_Monad_17);
        }, function () {
            return bindContT(__dict_Monad_17);
        });
    };
    return {
        ContT: ContT, 
        callCC: callCC, 
        withContT: withContT, 
        mapContT: mapContT, 
        runContT: runContT, 
        functorContT: functorContT, 
        applyContT: applyContT, 
        applicativeContT: applicativeContT, 
        bindContT: bindContT, 
        monadContT: monadContT, 
        monadTransContT: monadTransContT
    };
})();
var PS = PS || {};
PS.Control_Monad_CB = (function () {
    "use strict";
    var Prelude = PS.Prelude;
    var CB = {
        create: function (value) {
            return value;
        }
    };
    
  function bindCallback(cb, fn){ cb()(fn); }
  ;
    return {
        CB: CB, 
        bindCallback: bindCallback
    };
})();
var PS = PS || {};
PS.Control_Monad = (function () {
    "use strict";
    var Prelude = PS.Prelude;
    var when = function (__dict_Monad_24) {
        return function (_120) {
            return function (_121) {
                if (_120) {
                    return _121;
                };
                if (!_120) {
                    return Prelude["return"](__dict_Monad_24)(Prelude.unit);
                };
                throw new Error("Failed pattern match");
            };
        };
    };
    var unless = function (__dict_Monad_25) {
        return function (_122) {
            return function (_123) {
                if (!_122) {
                    return _123;
                };
                if (_122) {
                    return Prelude["return"](__dict_Monad_25)(Prelude.unit);
                };
                throw new Error("Failed pattern match");
            };
        };
    };
    var replicateM = function (__dict_Monad_26) {
        return function (_115) {
            return function (_116) {
                if (_115 === 0) {
                    return Prelude["return"](__dict_Monad_26)([  ]);
                };
                return Prelude[">>="](__dict_Monad_26["__superclass_Prelude.Bind_1"]())(_116)(function (_4) {
                    return Prelude[">>="](__dict_Monad_26["__superclass_Prelude.Bind_1"]())(replicateM(__dict_Monad_26)(_115 - 1)(_116))(function (_3) {
                        return Prelude["return"](__dict_Monad_26)(Prelude[":"](_4)(_3));
                    });
                });
            };
        };
    };
    var foldM = function (__dict_Monad_27) {
        return function (_117) {
            return function (_118) {
                return function (_119) {
                    if (_119.length === 0) {
                        return Prelude["return"](__dict_Monad_27)(_118);
                    };
                    if (_119.length >= 1) {
                        var _539 = _119.slice(1);
                        return Prelude[">>="](__dict_Monad_27["__superclass_Prelude.Bind_1"]())(_117(_118)(_119[0]))(function (a$prime) {
                            return foldM(__dict_Monad_27)(_117)(a$prime)(_539);
                        });
                    };
                    throw new Error("Failed pattern match");
                };
            };
        };
    };
    return {
        unless: unless, 
        when: when, 
        foldM: foldM, 
        replicateM: replicateM
    };
})();
var PS = PS || {};
PS.Control_Lazy = (function () {
    "use strict";
    var Prelude = PS.Prelude;
    function Lazy(defer) {
        this.defer = defer;
    };
    function Lazy1(defer1) {
        this.defer1 = defer1;
    };
    function Lazy2(defer2) {
        this.defer2 = defer2;
    };
    var defer2 = function (dict) {
        return dict.defer2;
    };
    var fix2 = function (__dict_Lazy2_28) {
        return function (f) {
            return defer2(__dict_Lazy2_28)(function (_) {
                return f(fix2(__dict_Lazy2_28)(f));
            });
        };
    };
    var defer1 = function (dict) {
        return dict.defer1;
    };
    var fix1 = function (__dict_Lazy1_29) {
        return function (f) {
            return defer1(__dict_Lazy1_29)(function (_) {
                return f(fix1(__dict_Lazy1_29)(f));
            });
        };
    };
    var defer = function (dict) {
        return dict.defer;
    };
    var fix = function (__dict_Lazy_30) {
        return function (f) {
            return defer(__dict_Lazy_30)(function (_) {
                return f(fix(__dict_Lazy_30)(f));
            });
        };
    };
    return {
        Lazy2: Lazy2, 
        Lazy1: Lazy1, 
        Lazy: Lazy, 
        fix2: fix2, 
        fix1: fix1, 
        fix: fix, 
        defer2: defer2, 
        defer1: defer1, 
        defer: defer
    };
})();
var PS = PS || {};
PS.Control_Extend = (function () {
    "use strict";
    var Prelude = PS.Prelude;
    function Extend($less$less$eq, __superclass_Prelude$dotFunctor_0) {
        this["<<="] = $less$less$eq;
        this["__superclass_Prelude.Functor_0"] = __superclass_Prelude$dotFunctor_0;
    };
    var $less$less$eq = function (dict) {
        return dict["<<="];
    };
    var $eq$less$eq = function (__dict_Extend_31) {
        return function (f) {
            return function (g) {
                return function (w) {
                    return f($less$less$eq(__dict_Extend_31)(g)(w));
                };
            };
        };
    };
    var $eq$greater$eq = function (__dict_Extend_32) {
        return function (f) {
            return function (g) {
                return function (w) {
                    return g($less$less$eq(__dict_Extend_32)(f)(w));
                };
            };
        };
    };
    var $eq$greater$greater = function (__dict_Extend_33) {
        return function (w) {
            return function (f) {
                return $less$less$eq(__dict_Extend_33)(f)(w);
            };
        };
    };
    var extendArr = function (__dict_Semigroup_34) {
        return new Extend(function (f) {
            return function (g) {
                return function (w) {
                    return f(function (w$prime) {
                        return g(Prelude["<>"](__dict_Semigroup_34)(w)(w$prime));
                    });
                };
            };
        }, Prelude.functorArr);
    };
    var duplicate = function (__dict_Extend_35) {
        return function (w) {
            return $less$less$eq(__dict_Extend_35)(Prelude.id(Prelude.categoryArr()))(w);
        };
    };
    return {
        Extend: Extend, 
        duplicate: duplicate, 
        "=<=": $eq$less$eq, 
        "=>=": $eq$greater$eq, 
        "=>>": $eq$greater$greater, 
        "<<=": $less$less$eq, 
        extendArr: extendArr
    };
})();
var PS = PS || {};
PS.Control_Comonad = (function () {
    "use strict";
    var Prelude = PS.Prelude;
    function Comonad(__superclass_Control$dotExtend$dotExtend_0, extract) {
        this["__superclass_Control.Extend.Extend_0"] = __superclass_Control$dotExtend$dotExtend_0;
        this.extract = extract;
    };
    var extract = function (dict) {
        return dict.extract;
    };
    return {
        Comonad: Comonad, 
        extract: extract
    };
})();
var PS = PS || {};
PS.Control_Monad_Identity = (function () {
    "use strict";
    var Prelude = PS.Prelude;
    var Control_Extend = PS.Control_Extend;
    var Control_Comonad = PS.Control_Comonad;
    var Identity = {
        create: function (value) {
            return value;
        }
    };
    var runIdentity = function (_124) {
        return _124;
    };
    var functorIdentity = function () {
        return new Prelude.Functor(function (f) {
            return function (m) {
                return Identity.create(f(runIdentity(m)));
            };
        });
    };
    var extendIdentity = function () {
        return new Control_Extend.Extend(function (f) {
            return function (m) {
                return Identity.create(f(m));
            };
        }, functorIdentity);
    };
    var comonadIdentity = function () {
        return new Control_Comonad.Comonad(extendIdentity, function (_127) {
            return _127;
        });
    };
    var applyIdentity = function () {
        return new Prelude.Apply(function (_125) {
            return function (_126) {
                return Identity.create(_125(_126));
            };
        }, functorIdentity);
    };
    var bindIdentity = function () {
        return new Prelude.Bind(function (m) {
            return function (f) {
                return f(runIdentity(m));
            };
        }, applyIdentity);
    };
    var applicativeIdentity = function () {
        return new Prelude.Applicative(applyIdentity, Identity.create);
    };
    var monadIdentity = function () {
        return new Prelude.Monad(applicativeIdentity, bindIdentity);
    };
    return {
        Identity: Identity, 
        runIdentity: runIdentity, 
        functorIdentity: functorIdentity, 
        applyIdentity: applyIdentity, 
        applicativeIdentity: applicativeIdentity, 
        bindIdentity: bindIdentity, 
        monadIdentity: monadIdentity, 
        extendIdentity: extendIdentity, 
        comonadIdentity: comonadIdentity
    };
})();
var PS = PS || {};
PS.Control_Bind = (function () {
    "use strict";
    var Prelude = PS.Prelude;
    var $greater$eq$greater = function (__dict_Bind_36) {
        return function (f) {
            return function (g) {
                return function (a) {
                    return Prelude[">>="](__dict_Bind_36)(f(a))(g);
                };
            };
        };
    };
    var $eq$less$less = function (__dict_Bind_37) {
        return function (f) {
            return function (m) {
                return Prelude[">>="](__dict_Bind_37)(m)(f);
            };
        };
    };
    var $less$eq$less = function (__dict_Bind_38) {
        return function (f) {
            return function (g) {
                return function (a) {
                    return $eq$less$less(__dict_Bind_38)(f)(g(a));
                };
            };
        };
    };
    var join = function (__dict_Bind_39) {
        return function (m) {
            return Prelude[">>="](__dict_Bind_39)(m)(Prelude.id(Prelude.categoryArr()));
        };
    };
    var ifM = function (__dict_Bind_40) {
        return function (cond) {
            return function (t) {
                return function (f) {
                    return Prelude[">>="](__dict_Bind_40)(cond)(function (cond$prime) {
                        return cond$prime ? t : f;
                    });
                };
            };
        };
    };
    return {
        ifM: ifM, 
        join: join, 
        "<=<": $less$eq$less, 
        ">=>": $greater$eq$greater, 
        "=<<": $eq$less$less
    };
})();
var PS = PS || {};
PS.Control_Apply = (function () {
    "use strict";
    var Prelude = PS.Prelude;
    var $less$times = function (__dict_Apply_41) {
        return function (a) {
            return function (b) {
                return Prelude["<*>"](__dict_Apply_41)(Prelude["<$>"](__dict_Apply_41["__superclass_Prelude.Functor_0"]())(Prelude["const"])(a))(b);
            };
        };
    };
    var $times$greater = function (__dict_Apply_42) {
        return function (a) {
            return function (b) {
                return Prelude["<*>"](__dict_Apply_42)(Prelude["<$>"](__dict_Apply_42["__superclass_Prelude.Functor_0"]())(Prelude["const"](Prelude.id(Prelude.categoryArr())))(a))(b);
            };
        };
    };
    var lift5 = function (__dict_Apply_43) {
        return function (f) {
            return function (a) {
                return function (b) {
                    return function (c) {
                        return function (d) {
                            return function (e) {
                                return Prelude["<*>"](__dict_Apply_43)(Prelude["<*>"](__dict_Apply_43)(Prelude["<*>"](__dict_Apply_43)(Prelude["<*>"](__dict_Apply_43)(Prelude["<$>"](__dict_Apply_43["__superclass_Prelude.Functor_0"]())(f)(a))(b))(c))(d))(e);
                            };
                        };
                    };
                };
            };
        };
    };
    var lift4 = function (__dict_Apply_44) {
        return function (f) {
            return function (a) {
                return function (b) {
                    return function (c) {
                        return function (d) {
                            return Prelude["<*>"](__dict_Apply_44)(Prelude["<*>"](__dict_Apply_44)(Prelude["<*>"](__dict_Apply_44)(Prelude["<$>"](__dict_Apply_44["__superclass_Prelude.Functor_0"]())(f)(a))(b))(c))(d);
                        };
                    };
                };
            };
        };
    };
    var lift3 = function (__dict_Apply_45) {
        return function (f) {
            return function (a) {
                return function (b) {
                    return function (c) {
                        return Prelude["<*>"](__dict_Apply_45)(Prelude["<*>"](__dict_Apply_45)(Prelude["<$>"](__dict_Apply_45["__superclass_Prelude.Functor_0"]())(f)(a))(b))(c);
                    };
                };
            };
        };
    };
    var lift2 = function (__dict_Apply_46) {
        return function (f) {
            return function (a) {
                return function (b) {
                    return Prelude["<*>"](__dict_Apply_46)(Prelude["<$>"](__dict_Apply_46["__superclass_Prelude.Functor_0"]())(f)(a))(b);
                };
            };
        };
    };
    var forever = function (__dict_Apply_47) {
        return function (a) {
            return $times$greater(__dict_Apply_47)(a)(forever(__dict_Apply_47)(a));
        };
    };
    return {
        forever: forever, 
        lift5: lift5, 
        lift4: lift4, 
        lift3: lift3, 
        lift2: lift2, 
        "*>": $times$greater, 
        "<*": $less$times
    };
})();
var PS = PS || {};
PS.Control_Alt = (function () {
    "use strict";
    var Prelude = PS.Prelude;
    function Alt($less$bar$greater, __superclass_Prelude$dotFunctor_0) {
        this["<|>"] = $less$bar$greater;
        this["__superclass_Prelude.Functor_0"] = __superclass_Prelude$dotFunctor_0;
    };
    var $less$bar$greater = function (dict) {
        return dict["<|>"];
    };
    return {
        Alt: Alt, 
        "<|>": $less$bar$greater
    };
})();
var PS = PS || {};
PS.Control_Plus = (function () {
    "use strict";
    var Prelude = PS.Prelude;
    function Plus(__superclass_Control$dotAlt$dotAlt_0, empty) {
        this["__superclass_Control.Alt.Alt_0"] = __superclass_Control$dotAlt$dotAlt_0;
        this.empty = empty;
    };
    var empty = function (dict) {
        return dict.empty;
    };
    return {
        Plus: Plus, 
        empty: empty
    };
})();
var PS = PS || {};
PS.Control_Alternative = (function () {
    "use strict";
    var Prelude = PS.Prelude;
    var Control_Alt = PS.Control_Alt;
    var Control_Lazy = PS.Control_Lazy;
    function Alternative(__superclass_Control$dotPlus$dotPlus_1, __superclass_Prelude$dotApplicative_0) {
        this["__superclass_Control.Plus.Plus_1"] = __superclass_Control$dotPlus$dotPlus_1;
        this["__superclass_Prelude.Applicative_0"] = __superclass_Prelude$dotApplicative_0;
    };
    var many = function (__dict_Alternative_48) {
        return function (__dict_Lazy1_49) {
            return function (v) {
                return Control_Alt["<|>"]((__dict_Alternative_48["__superclass_Control.Plus.Plus_1"]())["__superclass_Control.Alt.Alt_0"]())(some(__dict_Alternative_48)(__dict_Lazy1_49)(v))(Prelude.pure(__dict_Alternative_48["__superclass_Prelude.Applicative_0"]())([  ]));
            };
        };
    };
    var some = function (__dict_Alternative_50) {
        return function (__dict_Lazy1_51) {
            return function (v) {
                return Prelude["<*>"]((__dict_Alternative_50["__superclass_Prelude.Applicative_0"]())["__superclass_Prelude.Apply_0"]())(Prelude["<$>"](((__dict_Alternative_50["__superclass_Control.Plus.Plus_1"]())["__superclass_Control.Alt.Alt_0"]())["__superclass_Prelude.Functor_0"]())(Prelude[":"])(v))(Control_Lazy.defer1(__dict_Lazy1_51)(function (_) {
                    return many(__dict_Alternative_50)(__dict_Lazy1_51)(v);
                }));
            };
        };
    };
    return {
        Alternative: Alternative, 
        many: many, 
        some: some
    };
})();
var PS = PS || {};
PS.Control_MonadPlus = (function () {
    "use strict";
    var Prelude = PS.Prelude;
    var Control_Plus = PS.Control_Plus;
    function MonadPlus(__superclass_Control$dotAlternative$dotAlternative_1, __superclass_Prelude$dotMonad_0) {
        this["__superclass_Control.Alternative.Alternative_1"] = __superclass_Control$dotAlternative$dotAlternative_1;
        this["__superclass_Prelude.Monad_0"] = __superclass_Prelude$dotMonad_0;
    };
    var guard = function (__dict_MonadPlus_52) {
        return function (_128) {
            if (_128) {
                return Prelude["return"](__dict_MonadPlus_52["__superclass_Prelude.Monad_0"]())(Prelude.unit);
            };
            if (!_128) {
                return Control_Plus.empty((__dict_MonadPlus_52["__superclass_Control.Alternative.Alternative_1"]())["__superclass_Control.Plus.Plus_1"]());
            };
            throw new Error("Failed pattern match");
        };
    };
    return {
        MonadPlus: MonadPlus, 
        guard: guard
    };
})();
var PS = PS || {};
PS.Control_Monad_Reader_Trans = (function () {
    "use strict";
    var Prelude = PS.Prelude;
    var Control_Monad_Trans = PS.Control_Monad_Trans;
    var Control_Alt = PS.Control_Alt;
    var Control_Plus = PS.Control_Plus;
    var Control_Alternative = PS.Control_Alternative;
    var Control_MonadPlus = PS.Control_MonadPlus;
    var ReaderT = {
        create: function (value) {
            return value;
        }
    };
    var runReaderT = function (_129) {
        return _129;
    };
    var withReaderT = function (f) {
        return function (m) {
            return ReaderT.create(Prelude["<<<"](Prelude.semigroupoidArr())(runReaderT(m))(f));
        };
    };
    var mapReaderT = function (f) {
        return function (m) {
            return ReaderT.create(Prelude["<<<"](Prelude.semigroupoidArr())(f)(runReaderT(m)));
        };
    };
    var liftReaderT = function (m) {
        return Prelude["const"](m);
    };
    var monadTransReaderT = function () {
        return new Control_Monad_Trans.MonadTrans(function (__dict_Monad_55) {
            return liftReaderT;
        });
    };
    var liftCatchReader = function ($$catch) {
        return function (m) {
            return function (h) {
                return ReaderT.create(function (r) {
                    return $$catch(runReaderT(m)(r))(function (e) {
                        return runReaderT(h(e))(r);
                    });
                });
            };
        };
    };
    var liftCallCCReader = function (callCC) {
        return function (f) {
            return ReaderT.create(function (r) {
                return callCC(function (c) {
                    return runReaderT(f(function (a) {
                        return ReaderT.create(Prelude["const"](c(a)));
                    }))(r);
                });
            });
        };
    };
    var functorReaderT = function (__dict_Functor_57) {
        return new Prelude.Functor(function (f) {
            return mapReaderT(Prelude["<$>"](__dict_Functor_57)(f));
        });
    };
    var applyReaderT = function (__dict_Applicative_59) {
        return new Prelude.Apply(function (f) {
            return function (v) {
                return function (r) {
                    return Prelude["<*>"](__dict_Applicative_59["__superclass_Prelude.Apply_0"]())(runReaderT(f)(r))(runReaderT(v)(r));
                };
            };
        }, function () {
            return functorReaderT((__dict_Applicative_59["__superclass_Prelude.Apply_0"]())["__superclass_Prelude.Functor_0"]());
        });
    };
    var bindReaderT = function (__dict_Monad_58) {
        return new Prelude.Bind(function (m) {
            return function (k) {
                return function (r) {
                    return Prelude[">>="](__dict_Monad_58["__superclass_Prelude.Bind_1"]())(runReaderT(m)(r))(function (_5) {
                        return runReaderT(k(_5))(r);
                    });
                };
            };
        }, function () {
            return applyReaderT(__dict_Monad_58["__superclass_Prelude.Applicative_0"]());
        });
    };
    var applicativeReaderT = function (__dict_Applicative_60) {
        return new Prelude.Applicative(function () {
            return applyReaderT(__dict_Applicative_60);
        }, Prelude["<<<"](Prelude.semigroupoidArr())(liftReaderT)(Prelude.pure(__dict_Applicative_60)));
    };
    var monadReaderT = function (__dict_Monad_53) {
        return new Prelude.Monad(function () {
            return applicativeReaderT(__dict_Monad_53["__superclass_Prelude.Applicative_0"]());
        }, function () {
            return bindReaderT(__dict_Monad_53);
        });
    };
    var altReaderT = function (__dict_Alt_62) {
        return new Control_Alt.Alt(function (m) {
            return function (n) {
                return function (r) {
                    return Control_Alt["<|>"](__dict_Alt_62)(runReaderT(m)(r))(runReaderT(n)(r));
                };
            };
        }, function () {
            return functorReaderT(__dict_Alt_62["__superclass_Prelude.Functor_0"]());
        });
    };
    var plusReaderT = function (__dict_Plus_56) {
        return new Control_Plus.Plus(function () {
            return altReaderT(__dict_Plus_56["__superclass_Control.Alt.Alt_0"]());
        }, liftReaderT(Control_Plus.empty(__dict_Plus_56)));
    };
    var alternativeReaderT = function (__dict_Alternative_61) {
        return new Control_Alternative.Alternative(function () {
            return plusReaderT(__dict_Alternative_61["__superclass_Control.Plus.Plus_1"]());
        }, function () {
            return applicativeReaderT(__dict_Alternative_61["__superclass_Prelude.Applicative_0"]());
        });
    };
    var monadPlusReaderT = function (__dict_MonadPlus_54) {
        return new Control_MonadPlus.MonadPlus(function () {
            return alternativeReaderT(__dict_MonadPlus_54["__superclass_Control.Alternative.Alternative_1"]());
        }, function () {
            return monadReaderT(__dict_MonadPlus_54["__superclass_Prelude.Monad_0"]());
        });
    };
    return {
        ReaderT: ReaderT, 
        liftCallCCReader: liftCallCCReader, 
        liftCatchReader: liftCatchReader, 
        liftReaderT: liftReaderT, 
        mapReaderT: mapReaderT, 
        withReaderT: withReaderT, 
        runReaderT: runReaderT, 
        functorReaderT: functorReaderT, 
        applyReaderT: applyReaderT, 
        applicativeReaderT: applicativeReaderT, 
        altReaderT: altReaderT, 
        plusReaderT: plusReaderT, 
        alternativeReaderT: alternativeReaderT, 
        bindReaderT: bindReaderT, 
        monadReaderT: monadReaderT, 
        monadPlusReaderT: monadPlusReaderT, 
        monadTransReaderT: monadTransReaderT
    };
})();
var PS = PS || {};
PS.Control_Monad_Reader = (function () {
    "use strict";
    var Prelude = PS.Prelude;
    var Control_Monad_Reader_Trans = PS.Control_Monad_Reader_Trans;
    var Control_Monad_Identity = PS.Control_Monad_Identity;
    var withReader = Control_Monad_Reader_Trans.withReaderT;
    var runReader = function (m) {
        return Prelude["<<<"](Prelude.semigroupoidArr())(Control_Monad_Identity.runIdentity)(Control_Monad_Reader_Trans.runReaderT(m));
    };
    var mapReader = function (f) {
        return Control_Monad_Reader_Trans.mapReaderT(Prelude["<<<"](Prelude.semigroupoidArr())(Control_Monad_Identity.Identity.create)(Prelude["<<<"](Prelude.semigroupoidArr())(f)(Control_Monad_Identity.runIdentity)));
    };
    return {
        mapReader: mapReader, 
        withReader: withReader, 
        runReader: runReader
    };
})();
var PS = PS || {};
PS.Data_Either = (function () {
    "use strict";
    var Prelude = PS.Prelude;
    var Control_Alt = PS.Control_Alt;
    function Left(value0) {
        this.value0 = value0;
    };
    Left.create = function (value0) {
        return new Left(value0);
    };
    function Right(value0) {
        this.value0 = value0;
    };
    Right.create = function (value0) {
        return new Right(value0);
    };
    var showEither = function (__dict_Show_63) {
        return function (__dict_Show_64) {
            return new Prelude.Show(function (_139) {
                if (_139 instanceof Left) {
                    return "Left (" + (Prelude.show(__dict_Show_63)(_139.value0) + ")");
                };
                if (_139 instanceof Right) {
                    return "Right (" + (Prelude.show(__dict_Show_64)(_139.value0) + ")");
                };
                throw new Error("Failed pattern match");
            });
        };
    };
    var functorEither = function () {
        return new Prelude.Functor(function (_133) {
            return function (_134) {
                if (_134 instanceof Left) {
                    return new Left(_134.value0);
                };
                if (_134 instanceof Right) {
                    return new Right(_133(_134.value0));
                };
                throw new Error("Failed pattern match");
            };
        });
    };
    var eqEither = function (__dict_Eq_67) {
        return function (__dict_Eq_68) {
            return new Prelude.Eq(function (a) {
                return function (b) {
                    return !Prelude["=="](eqEither(__dict_Eq_67)(__dict_Eq_68))(a)(b);
                };
            }, function (_140) {
                return function (_141) {
                    if (_140 instanceof Left && _141 instanceof Left) {
                        return Prelude["=="](__dict_Eq_67)(_140.value0)(_141.value0);
                    };
                    if (_140 instanceof Right && _141 instanceof Right) {
                        return Prelude["=="](__dict_Eq_68)(_140.value0)(_141.value0);
                    };
                    return false;
                };
            });
        };
    };
    var ordEither = function (__dict_Ord_65) {
        return function (__dict_Ord_66) {
            return new Prelude.Ord(function () {
                return eqEither(__dict_Ord_65["__superclass_Prelude.Eq_0"]())(__dict_Ord_66["__superclass_Prelude.Eq_0"]());
            }, function (_142) {
                return function (_143) {
                    if (_142 instanceof Left && _143 instanceof Left) {
                        return Prelude.compare(__dict_Ord_65)(_142.value0)(_143.value0);
                    };
                    if (_142 instanceof Right && _143 instanceof Right) {
                        return Prelude.compare(__dict_Ord_66)(_142.value0)(_143.value0);
                    };
                    if (_142 instanceof Left) {
                        return Prelude.LT.value;
                    };
                    if (_143 instanceof Left) {
                        return Prelude.GT.value;
                    };
                    throw new Error("Failed pattern match");
                };
            });
        };
    };
    var either = function (_130) {
        return function (_131) {
            return function (_132) {
                if (_132 instanceof Left) {
                    return _130(_132.value0);
                };
                if (_132 instanceof Right) {
                    return _131(_132.value0);
                };
                throw new Error("Failed pattern match");
            };
        };
    };
    var isLeft = either(Prelude["const"](true))(Prelude["const"](false));
    var isRight = either(Prelude["const"](false))(Prelude["const"](true));
    var applyEither = function () {
        return new Prelude.Apply(function (_135) {
            return function (_136) {
                if (_135 instanceof Left) {
                    return new Left(_135.value0);
                };
                if (_135 instanceof Right) {
                    return Prelude["<$>"](functorEither())(_135.value0)(_136);
                };
                throw new Error("Failed pattern match");
            };
        }, functorEither);
    };
    var bindEither = function () {
        return new Prelude.Bind(either(function (e) {
            return function (_) {
                return new Left(e);
            };
        })(function (a) {
            return function (f) {
                return f(a);
            };
        }), applyEither);
    };
    var applicativeEither = function () {
        return new Prelude.Applicative(applyEither, Right.create);
    };
    var monadEither = function () {
        return new Prelude.Monad(applicativeEither, bindEither);
    };
    var altEither = function () {
        return new Control_Alt.Alt(function (_137) {
            return function (_138) {
                if (_137 instanceof Left) {
                    return _138;
                };
                return _137;
            };
        }, functorEither);
    };
    return {
        Left: Left, 
        Right: Right, 
        isRight: isRight, 
        isLeft: isLeft, 
        either: either, 
        functorEither: functorEither, 
        applyEither: applyEither, 
        applicativeEither: applicativeEither, 
        altEither: altEither, 
        bindEither: bindEither, 
        monadEither: monadEither, 
        showEither: showEither, 
        eqEither: eqEither, 
        ordEither: ordEither
    };
})();
var PS = PS || {};
PS.Data_Maybe = (function () {
    "use strict";
    var Prelude = PS.Prelude;
    var Control_Extend = PS.Control_Extend;
    var Control_Alt = PS.Control_Alt;
    var Control_Plus = PS.Control_Plus;
    var Control_Alternative = PS.Control_Alternative;
    var Control_MonadPlus = PS.Control_MonadPlus;
    function Nothing() {

    };
    Nothing.value = new Nothing();
    function Just(value0) {
        this.value0 = value0;
    };
    Just.create = function (value0) {
        return new Just(value0);
    };
    var showMaybe = function (__dict_Show_69) {
        return new Prelude.Show(function (_159) {
            if (_159 instanceof Just) {
                return "Just (" + (Prelude.show(__dict_Show_69)(_159.value0) + ")");
            };
            if (_159 instanceof Nothing) {
                return "Nothing";
            };
            throw new Error("Failed pattern match");
        });
    };
    var semigroupMaybe = function (__dict_Semigroup_70) {
        return new Prelude.Semigroup(function (_157) {
            return function (_158) {
                if (_157 instanceof Nothing) {
                    return _158;
                };
                if (_158 instanceof Nothing) {
                    return _157;
                };
                if (_157 instanceof Just && _158 instanceof Just) {
                    return new Just(Prelude["<>"](__dict_Semigroup_70)(_157.value0)(_158.value0));
                };
                throw new Error("Failed pattern match");
            };
        });
    };
    var maybe = function (_144) {
        return function (_145) {
            return function (_146) {
                if (_146 instanceof Nothing) {
                    return _144;
                };
                if (_146 instanceof Just) {
                    return _145(_146.value0);
                };
                throw new Error("Failed pattern match");
            };
        };
    };
    var isNothing = maybe(true)(Prelude["const"](false));
    var isJust = maybe(false)(Prelude["const"](true));
    var functorMaybe = function () {
        return new Prelude.Functor(function (_147) {
            return function (_148) {
                if (_148 instanceof Just) {
                    return new Just(_147(_148.value0));
                };
                return Nothing.value;
            };
        });
    };
    var fromMaybe = function (a) {
        return maybe(a)(Prelude.id(Prelude.categoryArr()));
    };
    var extendMaybe = function () {
        return new Control_Extend.Extend(function (_155) {
            return function (_156) {
                if (_156 instanceof Nothing) {
                    return Nothing.value;
                };
                return Just.create(_155(_156));
            };
        }, functorMaybe);
    };
    var eqMaybe = function (__dict_Eq_72) {
        return new Prelude.Eq(function (a) {
            return function (b) {
                return !Prelude["=="](eqMaybe(__dict_Eq_72))(a)(b);
            };
        }, function (_160) {
            return function (_161) {
                if (_160 instanceof Nothing && _161 instanceof Nothing) {
                    return true;
                };
                if (_160 instanceof Just && _161 instanceof Just) {
                    return Prelude["=="](__dict_Eq_72)(_160.value0)(_161.value0);
                };
                return false;
            };
        });
    };
    var ordMaybe = function (__dict_Ord_71) {
        return new Prelude.Ord(function () {
            return eqMaybe(__dict_Ord_71["__superclass_Prelude.Eq_0"]());
        }, function (_162) {
            return function (_163) {
                if (_162 instanceof Just && _163 instanceof Just) {
                    return Prelude.compare(__dict_Ord_71)(_162.value0)(_163.value0);
                };
                if (_162 instanceof Nothing && _163 instanceof Nothing) {
                    return Prelude.EQ.value;
                };
                if (_162 instanceof Nothing) {
                    return Prelude.LT.value;
                };
                if (_163 instanceof Nothing) {
                    return Prelude.GT.value;
                };
                throw new Error("Failed pattern match");
            };
        });
    };
    var applyMaybe = function () {
        return new Prelude.Apply(function (_149) {
            return function (_150) {
                if (_149 instanceof Just) {
                    return Prelude["<$>"](functorMaybe())(_149.value0)(_150);
                };
                if (_149 instanceof Nothing) {
                    return Nothing.value;
                };
                throw new Error("Failed pattern match");
            };
        }, functorMaybe);
    };
    var bindMaybe = function () {
        return new Prelude.Bind(function (_153) {
            return function (_154) {
                if (_153 instanceof Just) {
                    return _154(_153.value0);
                };
                if (_153 instanceof Nothing) {
                    return Nothing.value;
                };
                throw new Error("Failed pattern match");
            };
        }, applyMaybe);
    };
    var applicativeMaybe = function () {
        return new Prelude.Applicative(applyMaybe, Just.create);
    };
    var monadMaybe = function () {
        return new Prelude.Monad(applicativeMaybe, bindMaybe);
    };
    var altMaybe = function () {
        return new Control_Alt.Alt(function (_151) {
            return function (_152) {
                if (_151 instanceof Nothing) {
                    return _152;
                };
                return _151;
            };
        }, functorMaybe);
    };
    var plusMaybe = function () {
        return new Control_Plus.Plus(altMaybe, Nothing.value);
    };
    var alternativeMaybe = function () {
        return new Control_Alternative.Alternative(plusMaybe, applicativeMaybe);
    };
    var monadPlusMaybe = function () {
        return new Control_MonadPlus.MonadPlus(alternativeMaybe, monadMaybe);
    };
    return {
        Nothing: Nothing, 
        Just: Just, 
        isNothing: isNothing, 
        isJust: isJust, 
        fromMaybe: fromMaybe, 
        maybe: maybe, 
        functorMaybe: functorMaybe, 
        applyMaybe: applyMaybe, 
        applicativeMaybe: applicativeMaybe, 
        altMaybe: altMaybe, 
        plusMaybe: plusMaybe, 
        alternativeMaybe: alternativeMaybe, 
        bindMaybe: bindMaybe, 
        monadMaybe: monadMaybe, 
        monadPlusMaybe: monadPlusMaybe, 
        extendMaybe: extendMaybe, 
        semigroupMaybe: semigroupMaybe, 
        showMaybe: showMaybe, 
        eqMaybe: eqMaybe, 
        ordMaybe: ordMaybe
    };
})();
var PS = PS || {};
PS.Data_Array = (function () {
    "use strict";
    var Prelude = PS.Prelude;
    var Data_Maybe = PS.Data_Maybe;
    var Prelude_Unsafe = PS.Prelude_Unsafe;
    var Control_Alt = PS.Control_Alt;
    var Control_Plus = PS.Control_Plus;
    var Control_Alternative = PS.Control_Alternative;
    var Control_MonadPlus = PS.Control_MonadPlus;
    function snoc(l) {  return function (e) {    var l1 = l.slice();    l1.push(e);     return l1;  };};
    function length (xs) {  return xs.length;};
    function findIndex (f) {  return function (arr) {    for (var i = 0, l = arr.length; i < l; i++) {      if (f(arr[i])) {        return i;      }    }    return -1;  };};
    function findLastIndex (f) {  return function (arr) {    for (var i = arr.length - 1; i >= 0; i--) {      if (f(arr[i])) {        return i;      }    }    return -1;  };};
    function append (l1) {  return function (l2) {    return l1.concat(l2);  };};
    function concat (xss) {  var result = [];  for (var i = 0, l = xss.length; i < l; i++) {    result.push.apply(result, xss[i]);  }  return result;};
    function reverse (l) {  return l.slice().reverse();};
    function drop (n) {  return function (l) {    return l.slice(n);  };};
    function slice (s) {  return function (e) {    return function (l) {      return l.slice(s, e);    };  };};
    function insertAt (index) {  return function (a) {    return function (l) {      var l1 = l.slice();      l1.splice(index, 0, a);      return l1;    };   };};
    function deleteAt (index) {  return function (n) {    return function (l) {      var l1 = l.slice();      l1.splice(index, n);      return l1;    };   };};
    function updateAt (index) {  return function (a) {    return function (l) {      var i = ~~index;      if (i < 0 || i >= l.length) return l;      var l1 = l.slice();      l1[i] = a;      return l1;    };   };};
    function concatMap (f) {  return function (arr) {    var result = [];    for (var i = 0, l = arr.length; i < l; i++) {      Array.prototype.push.apply(result, f(arr[i]));    }    return result;  };};
    function map (f) {  return function (arr) {    var l = arr.length;    var result = new Array(l);    for (var i = 0; i < l; i++) {      result[i] = f(arr[i]);    }    return result;  };};
    function filter (f) {  return function (arr) {    var n = 0;    var result = [];    for (var i = 0, l = arr.length; i < l; i++) {      if (f(arr[i])) {        result[n++] = arr[i];      }    }    return result;  };};
    function range (start) {  return function (end) {    var i = ~~start, e = ~~end;    var step = i > e ? -1 : 1;    var result = [i], n = 1;    while (i !== e) {      i += step;      result[n++] = i;    }    return result;  };};
    function zipWith (f) {  return function (xs) {    return function (ys) {      var l = xs.length < ys.length ? xs.length : ys.length;      var result = new Array(l);      for (var i = 0; i < l; i++) {        result[i] = f(xs[i])(ys[i]);      }      return result;    };  };};
    function sortJS (f) {  return function (l) {    return l.slice().sort(function (x, y) {      return f(x)(y);    });  };};
    var $dot$dot = range;
    var $bang$bang = function (xs) {
        return function (n) {
            var isInt = function (n_1) {
                return n_1 !== ~~n_1;
            };
            return n < 0 || (n >= length(xs) || isInt(n)) ? Data_Maybe.Nothing.value : new Data_Maybe.Just(xs[n]);
        };
    };
    var take = function (n) {
        return slice(0)(n);
    };
    var tail = function (_166) {
        if (_166.length >= 1) {
            var _613 = _166.slice(1);
            return new Data_Maybe.Just(_613);
        };
        return Data_Maybe.Nothing.value;
    };
    var span = (function () {
        var go = function (__copy__182) {
            return function (__copy__183) {
                return function (__copy__184) {
                    var _182 = __copy__182;
                    var _183 = __copy__183;
                    var _184 = __copy__184;
                    tco: while (true) {
                        if (_184.length >= 1) {
                            var _618 = _184.slice(1);
                            if (_183(_184[0])) {
                                var __tco__182 = Prelude[":"](_184[0])(_182);
                                var __tco__183 = _183;
                                _182 = __tco__182;
                                _183 = __tco__183;
                                _184 = _618;
                                continue tco;
                            };
                        };
                        return {
                            init: reverse(_182), 
                            rest: _184
                        };
                    };
                };
            };
        };
        return go([  ]);
    })();
    var sortBy = function (comp) {
        return function (xs) {
            var comp$prime = function (x) {
                return function (y) {
                    var _619 = comp(x)(y);
                    if (_619 instanceof Prelude.GT) {
                        return 1;
                    };
                    if (_619 instanceof Prelude.EQ) {
                        return 0;
                    };
                    if (_619 instanceof Prelude.LT) {
                        return -1;
                    };
                    throw new Error("Failed pattern match");
                };
            };
            return sortJS(comp$prime)(xs);
        };
    };
    var sort = function (__dict_Ord_73) {
        return function (xs) {
            return sortBy(Prelude.compare(__dict_Ord_73))(xs);
        };
    };
    var singleton = function (a) {
        return [ a ];
    };
    var semigroupArray = function () {
        return new Prelude.Semigroup(append);
    };
    var $$null = function (_168) {
        if (_168.length === 0) {
            return true;
        };
        return false;
    };
    var nubBy = function (_175) {
        return function (_176) {
            if (_176.length === 0) {
                return [  ];
            };
            if (_176.length >= 1) {
                var _624 = _176.slice(1);
                return Prelude[":"](_176[0])(nubBy(_175)(filter(function (y) {
                    return !_175(_176[0])(y);
                })(_624)));
            };
            throw new Error("Failed pattern match");
        };
    };
    var nub = function (__dict_Eq_74) {
        return nubBy(Prelude["=="](__dict_Eq_74));
    };
    var mapMaybe = function (f) {
        return concatMap(Prelude["<<<"](Prelude.semigroupoidArr())(Data_Maybe.maybe([  ])(singleton))(f));
    };
    var last = function (__copy__165) {
        var _165 = __copy__165;
        tco: while (true) {
            if (_165.length >= 1) {
                var _627 = _165.slice(1);
                if (_627.length === 0) {
                    return new Data_Maybe.Just(_165[0]);
                };
            };
            if (_165.length >= 1) {
                var _629 = _165.slice(1);
                _165 = _629;
                continue tco;
            };
            return Data_Maybe.Nothing.value;
        };
    };
    var intersectBy = function (_172) {
        return function (_173) {
            return function (_174) {
                if (_173.length === 0) {
                    return [  ];
                };
                if (_174.length === 0) {
                    return [  ];
                };
                var el = function (x) {
                    return findIndex(_172(x))(_174) >= 0;
                };
                return filter(el)(_173);
            };
        };
    };
    var intersect = function (__dict_Eq_75) {
        return intersectBy(Prelude["=="](__dict_Eq_75));
    };
    var init = function (_167) {
        if (_167.length === 0) {
            return Data_Maybe.Nothing.value;
        };
        return new Data_Maybe.Just(slice(0)(length(_167) - 1)(_167));
    };
    var head = function (_164) {
        if (_164.length >= 1) {
            var _636 = _164.slice(1);
            return new Data_Maybe.Just(_164[0]);
        };
        return Data_Maybe.Nothing.value;
    };
    var groupBy = (function () {
        var go = function (__copy__179) {
            return function (__copy__180) {
                return function (__copy__181) {
                    var _179 = __copy__179;
                    var _180 = __copy__180;
                    var _181 = __copy__181;
                    tco: while (true) {
                        if (_181.length === 0) {
                            return reverse(_179);
                        };
                        if (_181.length >= 1) {
                            var _641 = _181.slice(1);
                            var sp = span(_180(_181[0]))(_641);
                            var __tco__179 = Prelude[":"](Prelude[":"](_181[0])(sp.init))(_179);
                            var __tco__180 = _180;
                            _179 = __tco__179;
                            _180 = __tco__180;
                            _181 = sp.rest;
                            continue tco;
                        };
                        throw new Error("Failed pattern match");
                    };
                };
            };
        };
        return go([  ]);
    })();
    var group = function (__dict_Eq_76) {
        return function (xs) {
            return groupBy(Prelude["=="](__dict_Eq_76))(xs);
        };
    };
    var group$prime = function (__dict_Ord_77) {
        return Prelude["<<<"](Prelude.semigroupoidArr())(group(__dict_Ord_77["__superclass_Prelude.Eq_0"]()))(sort(__dict_Ord_77));
    };
    var functorArray = function () {
        return new Prelude.Functor(map);
    };
    var elemLastIndex = function (__dict_Eq_78) {
        return function (x) {
            return findLastIndex(Prelude["=="](__dict_Eq_78)(x));
        };
    };
    var elemIndex = function (__dict_Eq_79) {
        return function (x) {
            return findIndex(Prelude["=="](__dict_Eq_79)(x));
        };
    };
    var deleteBy = function (_169) {
        return function (_170) {
            return function (_171) {
                if (_171.length === 0) {
                    return [  ];
                };
                var _645 = findIndex(_169(_170))(_171);
                if (_645 < 0) {
                    return _171;
                };
                return deleteAt(_645)(1)(_171);
            };
        };
    };
    var $$delete = function (__dict_Eq_80) {
        return deleteBy(Prelude["=="](__dict_Eq_80));
    };
    var $bslash$bslash = function (__dict_Eq_81) {
        return function (xs) {
            return function (ys) {
                var go = function (__copy__177) {
                    return function (__copy__178) {
                        var _177 = __copy__177;
                        var _178 = __copy__178;
                        tco: while (true) {
                            if (_178.length === 0) {
                                return _177;
                            };
                            if (_177.length === 0) {
                                return [  ];
                            };
                            if (_178.length >= 1) {
                                var _649 = _178.slice(1);
                                var __tco__177 = $$delete(__dict_Eq_81)(_178[0])(_177);
                                _177 = __tco__177;
                                _178 = _649;
                                continue tco;
                            };
                            throw new Error("Failed pattern match");
                        };
                    };
                };
                return go(xs)(ys);
            };
        };
    };
    var catMaybes = concatMap(Data_Maybe.maybe([  ])(singleton));
    var applicativeArray = function () {
        return new Prelude.Applicative(applyArray, singleton);
    };
    var applyArray = function () {
        return new Prelude.Apply(Prelude.ap(monadArray()), functorArray);
    };
    var monadArray = function () {
        return new Prelude.Monad(applicativeArray, bindArray);
    };
    var bindArray = function () {
        return new Prelude.Bind(Prelude.flip(concatMap), applyArray);
    };
    var altArray = function () {
        return new Control_Alt.Alt(append, functorArray);
    };
    var plusArray = function () {
        return new Control_Plus.Plus(altArray, [  ]);
    };
    var alternativeArray = function () {
        return new Control_Alternative.Alternative(plusArray, applicativeArray);
    };
    var monadPlusArray = function () {
        return new Control_MonadPlus.MonadPlus(alternativeArray, monadArray);
    };
    return {
        span: span, 
        groupBy: groupBy, 
        "group'": group$prime, 
        group: group, 
        sortBy: sortBy, 
        sort: sort, 
        nubBy: nubBy, 
        nub: nub, 
        zipWith: zipWith, 
        range: range, 
        filter: filter, 
        concatMap: concatMap, 
        intersect: intersect, 
        intersectBy: intersectBy, 
        "\\\\": $bslash$bslash, 
        "delete": $$delete, 
        deleteBy: deleteBy, 
        updateAt: updateAt, 
        deleteAt: deleteAt, 
        insertAt: insertAt, 
        take: take, 
        drop: drop, 
        reverse: reverse, 
        concat: concat, 
        append: append, 
        elemLastIndex: elemLastIndex, 
        elemIndex: elemIndex, 
        findLastIndex: findLastIndex, 
        findIndex: findIndex, 
        length: length, 
        catMaybes: catMaybes, 
        mapMaybe: mapMaybe, 
        map: map, 
        "null": $$null, 
        init: init, 
        tail: tail, 
        last: last, 
        head: head, 
        singleton: singleton, 
        snoc: snoc, 
        "..": $dot$dot, 
        "!!": $bang$bang, 
        functorArray: functorArray, 
        applyArray: applyArray, 
        applicativeArray: applicativeArray, 
        bindArray: bindArray, 
        monadArray: monadArray, 
        semigroupArray: semigroupArray, 
        altArray: altArray, 
        plusArray: plusArray, 
        alternativeArray: alternativeArray, 
        monadPlusArray: monadPlusArray
    };
})();
var PS = PS || {};
PS.Data_Foreign = (function () {
    "use strict";
    var Prelude = PS.Prelude;
    var Data_Either = PS.Data_Either;
    var Data_Function = PS.Data_Function;
    function TypeMismatch(value0, value1) {
        this.value0 = value0;
        this.value1 = value1;
    };
    TypeMismatch.create = function (value0) {
        return function (value1) {
            return new TypeMismatch(value0, value1);
        };
    };
    function ErrorAtIndex(value0, value1) {
        this.value0 = value0;
        this.value1 = value1;
    };
    ErrorAtIndex.create = function (value0) {
        return function (value1) {
            return new ErrorAtIndex(value0, value1);
        };
    };
    function ErrorAtProperty(value0, value1) {
        this.value0 = value0;
        this.value1 = value1;
    };
    ErrorAtProperty.create = function (value0) {
        return function (value1) {
            return new ErrorAtProperty(value0, value1);
        };
    };
    function JSONError(value0) {
        this.value0 = value0;
    };
    JSONError.create = function (value0) {
        return new JSONError(value0);
    };
    function parseJSONImpl(left, right, str) {  try {    return right(JSON.parse(str));  } catch (e) {    return left(e.toString());  } };
    function toForeign(value) {  return value;};
    function unsafeFromForeign(value) {  return value;};
    function typeOf(value) {  return typeof value;};
    function tagOf(value) {  return Object.prototype.toString.call(value).slice(8, -1);};
    function isNull(value) {  return value === null;};
    function isUndefined(value) {  return value === undefined;};
    function isArray(value) {  return Array.isArray(value);};
    var unsafeReadPrim = function (_185) {
        return function (_186) {
            if (tagOf(_186) === _185) {
                return Prelude.pure(Data_Either.applicativeEither())(unsafeFromForeign(_186));
            };
            return new Data_Either.Left(new TypeMismatch(_185, tagOf(_186)));
        };
    };
    var showForeignError = function () {
        return new Prelude.Show(function (_188) {
            if (_188 instanceof TypeMismatch) {
                return "Type mismatch: expected " + (_188.value0 + (", found " + _188.value1));
            };
            if (_188 instanceof ErrorAtIndex) {
                return "Error at array index " + (Prelude.show(Prelude.showNumber())(_188.value0) + (": " + Prelude.show(showForeignError())(_188.value1)));
            };
            if (_188 instanceof ErrorAtProperty) {
                return "Error at property " + (Prelude.show(Prelude.showString())(_188.value0) + (": " + Prelude.show(showForeignError())(_188.value1)));
            };
            if (_188 instanceof JSONError) {
                return "JSON error: " + _188.value0;
            };
            throw new Error("Failed pattern match");
        });
    };
    var readString = unsafeReadPrim("String");
    var readNumber = unsafeReadPrim("Number");
    var readBoolean = unsafeReadPrim("Boolean");
    var readArray = function (_187) {
        if (isArray(_187)) {
            return Prelude.pure(Data_Either.applicativeEither())(unsafeFromForeign(_187));
        };
        return new Data_Either.Left(new TypeMismatch("array", tagOf(_187)));
    };
    var parseJSON = function (json) {
        return parseJSONImpl(Prelude["<<<"](Prelude.semigroupoidArr())(Data_Either.Left.create)(JSONError.create), Data_Either.Right.create, json);
    };
    return {
        TypeMismatch: TypeMismatch, 
        ErrorAtIndex: ErrorAtIndex, 
        ErrorAtProperty: ErrorAtProperty, 
        JSONError: JSONError, 
        readArray: readArray, 
        readNumber: readNumber, 
        readBoolean: readBoolean, 
        readString: readString, 
        isArray: isArray, 
        isUndefined: isUndefined, 
        isNull: isNull, 
        tagOf: tagOf, 
        typeOf: typeOf, 
        unsafeFromForeign: unsafeFromForeign, 
        toForeign: toForeign, 
        parseJSON: parseJSON, 
        showForeignError: showForeignError
    };
})();
var PS = PS || {};
PS.Data_Foreign_Index = (function () {
    "use strict";
    var Prelude = PS.Prelude;
    var Data_Function = PS.Data_Function;
    var Data_Either = PS.Data_Either;
    var Data_Foreign = PS.Data_Foreign;
    function Index($bang, errorAt, hasOwnProperty, hasProperty) {
        this["!"] = $bang;
        this.errorAt = errorAt;
        this.hasOwnProperty = hasOwnProperty;
        this.hasProperty = hasProperty;
    };
    function unsafeReadPropImpl(f, s, key, value) {   if (value && typeof value === 'object') {    return s(value[key]);  } else {    return f;  }};
    function unsafeHasOwnProperty(prop, value) {  return value.hasOwnProperty(prop);};
    function unsafeHasProperty(prop, value) {  return prop in value;};
    var $bang = function (dict) {
        return dict["!"];
    };
    var unsafeReadProp = function (k) {
        return function (value) {
            return unsafeReadPropImpl(new Data_Either.Left(new Data_Foreign.TypeMismatch("object", Data_Foreign.typeOf(value))), Prelude.pure(Data_Either.applicativeEither()), k, value);
        };
    };
    var prop = unsafeReadProp;
    var index = unsafeReadProp;
    var hasPropertyImpl = function (_191) {
        return function (_192) {
            if (Data_Foreign.isNull(_192)) {
                return false;
            };
            if (Data_Foreign.isUndefined(_192)) {
                return false;
            };
            if (Data_Foreign.typeOf(_192) === "object" || Data_Foreign.typeOf(_192) === "function") {
                return unsafeHasProperty(_191, _192);
            };
            return false;
        };
    };
    var hasProperty = function (dict) {
        return dict.hasProperty;
    };
    var hasOwnPropertyImpl = function (_189) {
        return function (_190) {
            if (Data_Foreign.isNull(_190)) {
                return false;
            };
            if (Data_Foreign.isUndefined(_190)) {
                return false;
            };
            if (Data_Foreign.typeOf(_190) === "object" || Data_Foreign.typeOf(_190) === "function") {
                return unsafeHasOwnProperty(_189, _190);
            };
            return false;
        };
    };
    var indexNumber = function () {
        return new Index(Prelude.flip(index), Data_Foreign.ErrorAtIndex.create, hasOwnPropertyImpl, hasPropertyImpl);
    };
    var indexString = function () {
        return new Index(Prelude.flip(prop), Data_Foreign.ErrorAtProperty.create, hasOwnPropertyImpl, hasPropertyImpl);
    };
    var hasOwnProperty = function (dict) {
        return dict.hasOwnProperty;
    };
    var errorAt = function (dict) {
        return dict.errorAt;
    };
    return {
        Index: Index, 
        errorAt: errorAt, 
        hasOwnProperty: hasOwnProperty, 
        hasProperty: hasProperty, 
        "!": $bang, 
        index: index, 
        prop: prop, 
        indexString: indexString, 
        indexNumber: indexNumber
    };
})();
var PS = PS || {};
PS.Data_Foreign_Keys = (function () {
    "use strict";
    var Prelude = PS.Prelude;
    var Data_Foreign = PS.Data_Foreign;
    var Data_Either = PS.Data_Either;
    function unsafeKeys(value) {   return Object.keys(value);};
    var keys = function (_193) {
        if (Data_Foreign.isNull(_193)) {
            return Data_Either.Left.create(new Data_Foreign.TypeMismatch("object", "null"));
        };
        if (Data_Foreign.isUndefined(_193)) {
            return Data_Either.Left.create(new Data_Foreign.TypeMismatch("object", "undefined"));
        };
        if (Data_Foreign.typeOf(_193) === "object") {
            return Data_Either.Right.create(unsafeKeys(_193));
        };
        return Data_Either.Left.create(new Data_Foreign.TypeMismatch("object", Data_Foreign.typeOf(_193)));
    };
    return {
        keys: keys
    };
})();
var PS = PS || {};
PS.Data_Foreign_Null = (function () {
    "use strict";
    var Prelude = PS.Prelude;
    var Data_Foreign = PS.Data_Foreign;
    var Data_Either = PS.Data_Either;
    var Data_Maybe = PS.Data_Maybe;
    var Null = {
        create: function (value) {
            return value;
        }
    };
    var runNull = function (_194) {
        return _194;
    };
    var readNull = function (_195) {
        return function (_196) {
            if (Data_Foreign.isNull(_196)) {
                return Prelude.pure(Data_Either.applicativeEither())(Data_Maybe.Nothing.value);
            };
            return Prelude["<$>"](Data_Either.functorEither())(Prelude["<<<"](Prelude.semigroupoidArr())(Null.create)(Data_Maybe.Just.create))(_195(_196));
        };
    };
    return {
        Null: Null, 
        readNull: readNull, 
        runNull: runNull
    };
})();
var PS = PS || {};
PS.Data_Foreign_NullOrUndefined = (function () {
    "use strict";
    var Prelude = PS.Prelude;
    var Data_Foreign = PS.Data_Foreign;
    var Data_Either = PS.Data_Either;
    var Data_Maybe = PS.Data_Maybe;
    var NullOrUndefined = {
        create: function (value) {
            return value;
        }
    };
    var runNullOrUndefined = function (_197) {
        return _197;
    };
    var readNullOrUndefined = function (_198) {
        return function (_199) {
            if (Data_Foreign.isNull(_199) || Data_Foreign.isUndefined(_199)) {
                return Prelude.pure(Data_Either.applicativeEither())(Data_Maybe.Nothing.value);
            };
            return Prelude["<$>"](Data_Either.functorEither())(Prelude["<<<"](Prelude.semigroupoidArr())(NullOrUndefined.create)(Data_Maybe.Just.create))(_198(_199));
        };
    };
    return {
        NullOrUndefined: NullOrUndefined, 
        readNullOrUndefined: readNullOrUndefined, 
        runNullOrUndefined: runNullOrUndefined
    };
})();
var PS = PS || {};
PS.Data_Foreign_Undefined = (function () {
    "use strict";
    var Prelude = PS.Prelude;
    var Data_Foreign = PS.Data_Foreign;
    var Data_Either = PS.Data_Either;
    var Data_Maybe = PS.Data_Maybe;
    var Undefined = {
        create: function (value) {
            return value;
        }
    };
    var runUndefined = function (_200) {
        return _200;
    };
    var readUndefined = function (_201) {
        return function (_202) {
            if (Data_Foreign.isUndefined(_202)) {
                return Prelude.pure(Data_Either.applicativeEither())(Data_Maybe.Nothing.value);
            };
            return Prelude["<$>"](Data_Either.functorEither())(Prelude["<<<"](Prelude.semigroupoidArr())(Undefined.create)(Data_Maybe.Just.create))(_201(_202));
        };
    };
    return {
        Undefined: Undefined, 
        readUndefined: readUndefined, 
        runUndefined: runUndefined
    };
})();
var PS = PS || {};
PS.Data_Maybe_Unsafe = (function () {
    "use strict";
    var Prelude = PS.Prelude;
    var Data_Maybe = PS.Data_Maybe;
    var fromJust = function (_203) {
        if (_203 instanceof Data_Maybe.Just) {
            return _203.value0;
        };
        throw new Error("Failed pattern match");
    };
    return {
        fromJust: fromJust
    };
})();
var PS = PS || {};
PS.Data_Array_Unsafe = (function () {
    "use strict";
    var Prelude = PS.Prelude;
    var Prelude_Unsafe = PS.Prelude_Unsafe;
    var Data_Array = PS.Data_Array;
    var Data_Maybe_Unsafe = PS.Data_Maybe_Unsafe;
    var tail = function (_205) {
        if (_205.length >= 1) {
            var _679 = _205.slice(1);
            return _679;
        };
        throw new Error("Failed pattern match");
    };
    var last = function (xs) {
        return xs[Data_Array.length(xs) - 1];
    };
    var init = Prelude["<<<"](Prelude.semigroupoidArr())(Data_Maybe_Unsafe.fromJust)(Data_Array.init);
    var head = function (_204) {
        if (_204.length >= 1) {
            var _682 = _204.slice(1);
            return _204[0];
        };
        throw new Error("Failed pattern match");
    };
    return {
        init: init, 
        last: last, 
        tail: tail, 
        head: head
    };
})();
var PS = PS || {};
PS.Data_Monoid = (function () {
    "use strict";
    var Prelude = PS.Prelude;
    var Data_Maybe = PS.Data_Maybe;
    var Data_Array = PS.Data_Array;
    function Monoid(__superclass_Prelude$dotSemigroup_0, mempty) {
        this["__superclass_Prelude.Semigroup_0"] = __superclass_Prelude$dotSemigroup_0;
        this.mempty = mempty;
    };
    var monoidUnit = function () {
        return new Monoid(Prelude.semigroupUnit, Prelude.unit);
    };
    var monoidString = function () {
        return new Monoid(Prelude.semigroupString, "");
    };
    var monoidMaybe = function (__dict_Semigroup_82) {
        return new Monoid(function () {
            return Data_Maybe.semigroupMaybe(__dict_Semigroup_82);
        }, Data_Maybe.Nothing.value);
    };
    var monoidArray = function () {
        return new Monoid(Data_Array.semigroupArray, [  ]);
    };
    var mempty = function (dict) {
        return dict.mempty;
    };
    var monoidArr = function (__dict_Monoid_83) {
        return new Monoid(function () {
            return Prelude.semigroupArr(__dict_Monoid_83["__superclass_Prelude.Semigroup_0"]());
        }, Prelude["const"](mempty(__dict_Monoid_83)));
    };
    return {
        Monoid: Monoid, 
        mempty: mempty, 
        monoidString: monoidString, 
        monoidArray: monoidArray, 
        monoidUnit: monoidUnit, 
        monoidArr: monoidArr, 
        monoidMaybe: monoidMaybe
    };
})();
var PS = PS || {};
PS.Control_Reactive = (function () {
    "use strict";
    var Prelude = PS.Prelude;
    var Control_Monad_Eff = PS.Control_Monad_Eff;
    var Data_Monoid = PS.Data_Monoid;
    var Control_Monad_Eff_Ref_Unsafe = PS.Control_Monad_Eff_Ref_Unsafe;
    var Control_Monad_Eff_Ref = PS.Control_Monad_Eff_Ref;
    function Subscription(value0) {
        this.value0 = value0;
    };
    Subscription.create = function (value0) {
        return new Subscription(value0);
    };
    function Inserted(value0, value1) {
        this.value0 = value0;
        this.value1 = value1;
    };
    Inserted.create = function (value0) {
        return function (value1) {
            return new Inserted(value0, value1);
        };
    };
    function Updated(value0, value1) {
        this.value0 = value0;
        this.value1 = value1;
    };
    Updated.create = function (value0) {
        return function (value1) {
            return new Updated(value0, value1);
        };
    };
    function Removed(value0) {
        this.value0 = value0;
    };
    Removed.create = function (value0) {
        return new Removed(value0);
    };
    function Computed(value0) {
        this.value0 = value0;
    };
    Computed.create = function (value0) {
        return new Computed(value0);
    };
    function newRVar(value) {  return function() {    return (function () {      function RVar(value) {        var self = this;        self.value = value;        self.listeners = [];        self.subscribe = function (listener) {          this.listeners.push(listener);          return new Subscription(function() {            for (var i = 0; i < self.listeners.length; i++) {              if (self.listeners[i] === listener) {                self.listeners.splice(i, 1);                break;              }            }          });        };        self.update = function (value) {          self.value = value;          for (var i = 0; i < self.listeners.length; i++) {            self.listeners[i](value);          }        };      };      return new RVar(value);    })();  };};
    function newRArray() {    return (function () {      function RArray() {        var self = this;        self.values = [];        self.listeners = [];        self.subscribe = function (listener) {          this.listeners.push(listener);          return new Subscription(function() {            for (var i = 0; i < self.listeners.length; i++) {              if (self.listeners[i] === listener) {                self.listeners.splice(i, 1);                break;              }            }          });        };        self.insert = function (value, index) {          self.values.splice(index, 0, value);          for (var i = 0; i < self.listeners.length; i++) {            self.listeners[i](Inserted(value)(index));          }        };        self.remove = function (index) {          self.values.splice(index, 1);          for (var i = 0; i < self.listeners.length; i++) {            self.listeners[i](Removed(index));          }        };        self.update = function (value, index) {          self.values[index] = index;          for (var i = 0; i < self.listeners.length; i++) {            self.listeners[i](Updated(value)(index));          }        };      };      return new RArray();    })();};
    function readRVar(ref) {  return function() {    return ref.value;  };};
    function readRArray(arr) {  return function() {    return arr.values;  };};
    function writeRVar(ref) {  return function (value) {    return function() {      ref.update(value);    };  };};
    function peekRArray(arr) {  return function(i) {    return arr.values[i];  };};
    function insertRArray(arr) {  return function (value) {    return function(index) {      return function() {        arr.insert(value, index);      };    };  };};
    function removeRArray(arr) {  return function(index) {    return function() {      arr.remove(index);    };  };};
    function updateRArray(arr) {  return function (value) {    return function(index) {      return function() {        arr.update(value, index);      };    };  };};
    function subscribe(ref) {  return function(f) {    return function() {      return ref.subscribe(function(value) {        f(value)();      });    };  };};
    function subscribeArray(arr) {  return function(f) {    return function() {      return arr.subscribe(function(value) {        f(value)();      });    };  };};
    var toComputedArray = function (arr) {
        return new Computed({
            read: readRArray(arr), 
            subscribe: function (f) {
                return subscribeArray(arr)(function (_) {
                    return Prelude[">>="](Control_Monad_Eff.bindEff())(readRArray(arr))(f);
                });
            }
        });
    };
    var toComputed = function (ref) {
        return new Computed({
            read: readRVar(ref), 
            subscribe: subscribe(ref)
        });
    };
    var subscribeComputed = function (_207) {
        return function (_208) {
            return _207.value0.subscribe(_208);
        };
    };
    var showArrayChange = function (__dict_Show_84) {
        return new Prelude.Show(function (_211) {
            if (_211 instanceof Inserted) {
                return "Inserted " + (Prelude.show(__dict_Show_84)(_211.value0) + (" at " + Prelude.show(Prelude.showNumber())(_211.value1)));
            };
            if (_211 instanceof Updated) {
                return "Updated " + (Prelude.show(Prelude.showNumber())(_211.value1) + (" to " + Prelude.show(__dict_Show_84)(_211.value0)));
            };
            if (_211 instanceof Removed) {
                return "Removed at index " + Prelude.show(Prelude.showNumber())(_211.value0);
            };
            throw new Error("Failed pattern match");
        });
    };
    var semigroupSubscription = function () {
        return new Prelude.Semigroup(function (_209) {
            return function (_210) {
                return new Subscription(function __do() {
                    _209.value0();
                    return _210.value0();
                });
            };
        });
    };
    var readComputed = function (_206) {
        return _206.value0.read;
    };
    var monoidSubscription = function () {
        return new Data_Monoid.Monoid(semigroupSubscription, new Subscription(Prelude["return"](Control_Monad_Eff.monadEff())(Prelude.unit)));
    };
    var modifyRVar = function (v) {
        return function (f) {
            return function __do() {
                var _6 = readRVar(v)();
                return writeRVar(v)(f(_6))();
            };
        };
    };
    var applicativeComputed = function () {
        return new Prelude.Applicative(applyComputed, function (a) {
            return new Computed({
                read: Prelude.pure(Control_Monad_Eff.applicativeEff())(a), 
                subscribe: function (_) {
                    return Prelude.pure(Control_Monad_Eff.applicativeEff())(Data_Monoid.mempty(monoidSubscription()));
                }
            });
        });
    };
    var applyComputed = function () {
        return new Prelude.Apply(function (_214) {
            return function (_215) {
                return new Computed({
                    read: function __do() {
                        var _16 = _214.value0.read();
                        var _15 = _215.value0.read();
                        return _16(_15);
                    }, 
                    subscribe: function (ob) {
                        return function __do() {
                            var _20 = _214.value0.subscribe(function (f$prime) {
                                return function __do() {
                                    var _17 = _215.value0.read();
                                    return ob(f$prime(_17))();
                                };
                            })();
                            var _19 = _215.value0.subscribe(function (x$prime) {
                                return function __do() {
                                    var _18 = _214.value0.read();
                                    return ob(_18(x$prime))();
                                };
                            })();
                            return Prelude["<>"](semigroupSubscription())(_20)(_19);
                        };
                    }
                });
            };
        }, functorComputed);
    };
    var functorComputed = function () {
        return new Prelude.Functor(Prelude.liftA1(applicativeComputed()));
    };
    var bindComputed = function () {
        return new Prelude.Bind(function (_212) {
            return function (_213) {
                return new Computed({
                    read: function __do() {
                        var _7 = _212.value0.read();
                        return (function () {
                            var _712 = _213(_7);
                            return _712.value0.read;
                        })()();
                    }, 
                    subscribe: function (ob) {
                        return function __do() {
                            var _14 = _212.value0.read();
                            return (function () {
                                var _715 = _213(_14);
                                return function __do() {
                                    var _13 = _715.value0.subscribe(ob)();
                                    var _12 = Control_Monad_Eff_Ref_Unsafe.unsafeRunRef(Control_Monad_Eff_Ref.newRef(_13))();
                                    var _11 = _212.value0.subscribe(function (a$prime) {
                                        return function __do() {
                                            var _9 = Control_Monad_Eff_Ref_Unsafe.unsafeRunRef(Control_Monad_Eff_Ref.readRef(_12))();
                                            _9.value0();
                                            var _719 = _213(a$prime);
                                            Prelude[">>="](Control_Monad_Eff.bindEff())(_719.value0.read)(ob)();
                                            var _8 = _719.value0.subscribe(ob)();
                                            return Control_Monad_Eff_Ref_Unsafe.unsafeRunRef(Control_Monad_Eff_Ref.writeRef(_12)(_8))();
                                        };
                                    })();
                                    return Prelude["<>"](semigroupSubscription())(_11)(new Subscription(function __do() {
                                        var _10 = Control_Monad_Eff_Ref_Unsafe.unsafeRunRef(Control_Monad_Eff_Ref.readRef(_12))();
                                        return _10.value0();
                                    }));
                                };
                            })()();
                        };
                    }
                });
            };
        }, applyComputed);
    };
    var monadComputed = function () {
        return new Prelude.Monad(applicativeComputed, bindComputed);
    };
    return {
        Computed: Computed, 
        Inserted: Inserted, 
        Updated: Updated, 
        Removed: Removed, 
        Subscription: Subscription, 
        subscribeComputed: subscribeComputed, 
        readComputed: readComputed, 
        toComputedArray: toComputedArray, 
        toComputed: toComputed, 
        modifyRVar: modifyRVar, 
        subscribeArray: subscribeArray, 
        subscribe: subscribe, 
        updateRArray: updateRArray, 
        removeRArray: removeRArray, 
        insertRArray: insertRArray, 
        peekRArray: peekRArray, 
        writeRVar: writeRVar, 
        readRArray: readRArray, 
        readRVar: readRVar, 
        newRArray: newRArray, 
        newRVar: newRVar, 
        semigroupSubscription: semigroupSubscription, 
        monoidSubscription: monoidSubscription, 
        showArrayChange: showArrayChange, 
        bindComputed: bindComputed, 
        applicativeComputed: applicativeComputed, 
        applyComputed: applyComputed, 
        functorComputed: functorComputed, 
        monadComputed: monadComputed
    };
})();
var PS = PS || {};
PS.Control_Reactive_Event = (function () {
    "use strict";
    var Prelude = PS.Prelude;
    var Data_Foreign_EasyFFI = PS.Data_Foreign_EasyFFI;
    var Control_Monad_Eff = PS.Control_Monad_Eff;
    function Event(value0, value1) {
        this.value0 = value0;
        this.value1 = value1;
    };
    Event.create = function (value0) {
        return function (value1) {
            return new Event(value0, value1);
        };
    };
       var CustomEvent;                                                                  CustomEvent = function(event, params) {                                              var evt;                                                                           params = params || {                                                                 bubbles: false,                                                                    cancelable: false,                                                                 detail: undefined                                                                };                                                                                 evt = document.createEvent('CustomEvent');                                         evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);      return evt;                                                                      };                                                                                 CustomEvent.prototype = window.Event.prototype;                                    window.CustomEvent = CustomEvent;                                                  function customEventPolyFill(){                                                      console.log('This function was born depricated. Welcome to the future.');        };;
    function emitOn_(n){                     return function(d){                      return function(o){                     return function(){                        var e = new CustomEvent(n,d);          o.dispatchEvent(e);                    return o;                           };                                    };                                   };                                    };
    function subscribeEventedOn_(n){            return function(fn){                          return function(obj){                         return function(){                           var fnE = function (event) {                 return fn(event)();                      };                                         obj.addEventListener(n, fnE);              return function(){                           obj.removeEventListener(n, fnE);          };                                       };                                       };                                      };                                       };
    function unsubscribe(sub){    return function(){           sub();                   };                       };
    var unwrapEventName = function (_221) {
        return _221.value0;
    };
    var unwrapEventDetail = function (_220) {
        return _220.value1.detail;
    };
    var newEvent = function (n) {
        return function (d) {
            return new Event(n, {
                bubbles: true, 
                cancelable: false, 
                detail: d
            });
        };
    };
    var subscribeEventedOn = function (n) {
        return function (f) {
            return function (o) {
                return subscribeEventedOn_(n)(function (e) {
                    return f(newEvent(e.type)(e.detail));
                })(o);
            };
        };
    };
    var getWindow = Data_Foreign_EasyFFI.unsafeForeignFunction([ "" ])("window");
    var subscribeEvented = function (n) {
        return function (f) {
            return Prelude[">>="](Control_Monad_Eff.bindEff())(getWindow)(subscribeEventedOn(n)(f));
        };
    };
    var eventNMap = function (_218) {
        return function (_219) {
            return new Event(_218(_219.value0), _219.value1);
        };
    };
    var eventDMap = function (_216) {
        return function (_217) {
            return Event.create(_217.value0)((function () {
                var _740 = {};
                for (var _741 in _217.value1) {
                    if (_217.value1.hasOwnProperty(_741)) {
                        _740[_741] = _217.value1[_741];
                    };
                };
                _740.detail = _216(_217.value1.detail);
                return _740;
            })());
        };
    };
    var emitOn = function (_222) {
        return function (_223) {
            return emitOn_(_222.value0)(_222.value1)(_223);
        };
    };
    var emit = function (ev) {
        return Prelude[">>="](Control_Monad_Eff.bindEff())(getWindow)(emitOn(ev));
    };
    return {
        Event: Event, 
        unsubscribe: unsubscribe, 
        subscribeEvented: subscribeEvented, 
        emit: emit, 
        subscribeEventedOn: subscribeEventedOn, 
        emitOn: emitOn, 
        unwrapEventName: unwrapEventName, 
        unwrapEventDetail: unwrapEventDetail, 
        getWindow: getWindow, 
        eventNMap: eventNMap, 
        eventDMap: eventDMap, 
        newEvent: newEvent
    };
})();
var PS = PS || {};
PS.History = (function () {
    "use strict";
    var Prelude = PS.Prelude;
    var Control_Reactive_Event = PS.Control_Reactive_Event;
    var Data_Foreign_EasyFFI = PS.Data_Foreign_EasyFFI;
    var Control_Monad_Eff = PS.Control_Monad_Eff;
    var statechange = "statechange";
    var subscribeStateChange = Control_Reactive_Event.subscribeEvented(statechange);
    var stateUpdaterNative = function (x) {
        return Data_Foreign_EasyFFI.unsafeForeignProcedure([ "d", "title", "url", "" ])(x + "(d,title,url)");
    };
    var replaceState$prime = stateUpdaterNative("window.history.replaceState");
    var pushState$prime = stateUpdaterNative("window.history.pushState");
    var goState_ = Data_Foreign_EasyFFI.unsafeForeignProcedure([ "\u0394", "" ])("window.history.go(\u0394)");
    var goForward_ = Data_Foreign_EasyFFI.unsafeForeignFunction([ "" ])("window.history.forward()");
    var goBack_ = Data_Foreign_EasyFFI.unsafeForeignFunction([ "" ])("window.history.back()");
    var getUrl = Data_Foreign_EasyFFI.unsafeForeignFunction([ "" ])("location.pathname");
    var getTitle = Data_Foreign_EasyFFI.unsafeForeignFunction([ "" ])("document.title");
    var getData = Data_Foreign_EasyFFI.unsafeForeignFunction([ "" ])("window.history.state");
    var getState = function __do() {
        var _23 = getData();
        var _22 = getTitle();
        var _21 = getUrl();
        return {
            title: _22, 
            url: _21, 
            data: _23
        };
    };
    var emitStateChange = function (s) {
        return Control_Reactive_Event.emit(Control_Reactive_Event.newEvent(statechange)({
            state: s
        }));
    };
    var goBack = function __do() {
        emitStateChange("back")();
        return goBack_();
    };
    var goForward = function __do() {
        emitStateChange("forward")();
        return goForward_();
    };
    var goState = function (x) {
        return function __do() {
            emitStateChange("goState(" + (Prelude.show(Prelude.showNumber())(x) + ")"))();
            return goState_(x)();
        };
    };
    var pushState = function (s) {
        return function __do() {
            emitStateChange(s)();
            return pushState$prime(s.data)(s.title)(s.url)();
        };
    };
    var replaceState = function (s) {
        return function __do() {
            emitStateChange(s)();
            return replaceState$prime(s.data)(s.title)(s.url)();
        };
    };
    return {
        subscribeStateChange: subscribeStateChange, 
        goState: goState, 
        goForward: goForward, 
        goBack: goBack, 
        replaceState: replaceState, 
        pushState: pushState, 
        getState: getState
    };
})();
var PS = PS || {};
PS.Data_Monoid_All = (function () {
    "use strict";
    var Prelude = PS.Prelude;
    var Data_Monoid = PS.Data_Monoid;
    var All = {
        create: function (value) {
            return value;
        }
    };
    var showAll = function () {
        return new Prelude.Show(function (_229) {
            return "All (" + (Prelude.show(Prelude.showBoolean())(_229) + ")");
        });
    };
    var semigroupAll = function () {
        return new Prelude.Semigroup(function (_230) {
            return function (_231) {
                return _230 && _231;
            };
        });
    };
    var runAll = function (_224) {
        return _224;
    };
    var monoidAll = function () {
        return new Data_Monoid.Monoid(semigroupAll, true);
    };
    var eqAll = function () {
        return new Prelude.Eq(function (_227) {
            return function (_228) {
                return _227 !== _228;
            };
        }, function (_225) {
            return function (_226) {
                return _225 === _226;
            };
        });
    };
    return {
        All: All, 
        runAll: runAll, 
        eqAll: eqAll, 
        showAll: showAll, 
        semigroupAll: semigroupAll, 
        monoidAll: monoidAll
    };
})();
var PS = PS || {};
PS.Data_Monoid_Any = (function () {
    "use strict";
    var Prelude = PS.Prelude;
    var Data_Monoid = PS.Data_Monoid;
    var Any = {
        create: function (value) {
            return value;
        }
    };
    var showAny = function () {
        return new Prelude.Show(function (_237) {
            return "Any (" + (Prelude.show(Prelude.showBoolean())(_237) + ")");
        });
    };
    var semigroupAny = function () {
        return new Prelude.Semigroup(function (_238) {
            return function (_239) {
                return _238 || _239;
            };
        });
    };
    var runAny = function (_232) {
        return _232;
    };
    var monoidAny = function () {
        return new Data_Monoid.Monoid(semigroupAny, false);
    };
    var eqAny = function () {
        return new Prelude.Eq(function (_235) {
            return function (_236) {
                return _235 !== _236;
            };
        }, function (_233) {
            return function (_234) {
                return _233 === _234;
            };
        });
    };
    return {
        Any: Any, 
        runAny: runAny, 
        eqAny: eqAny, 
        showAny: showAny, 
        semigroupAny: semigroupAny, 
        monoidAny: monoidAny
    };
})();
var PS = PS || {};
PS.Data_Monoid_Dual = (function () {
    "use strict";
    var Prelude = PS.Prelude;
    var Data_Monoid = PS.Data_Monoid;
    var Dual = {
        create: function (value) {
            return value;
        }
    };
    var showDual = function (__dict_Show_85) {
        return new Prelude.Show(function (_247) {
            return "Dual (" + (Prelude.show(__dict_Show_85)(_247) + ")");
        });
    };
    var semigroupDual = function (__dict_Semigroup_86) {
        return new Prelude.Semigroup(function (_248) {
            return function (_249) {
                return Prelude["<>"](__dict_Semigroup_86)(_249)(_248);
            };
        });
    };
    var runDual = function (_240) {
        return _240;
    };
    var monoidDual = function (__dict_Monoid_88) {
        return new Data_Monoid.Monoid(function () {
            return semigroupDual(__dict_Monoid_88["__superclass_Prelude.Semigroup_0"]());
        }, Data_Monoid.mempty(__dict_Monoid_88));
    };
    var eqDual = function (__dict_Eq_89) {
        return new Prelude.Eq(function (_243) {
            return function (_244) {
                return Prelude["/="](__dict_Eq_89)(_243)(_244);
            };
        }, function (_241) {
            return function (_242) {
                return Prelude["=="](__dict_Eq_89)(_241)(_242);
            };
        });
    };
    var ordDual = function (__dict_Ord_87) {
        return new Prelude.Ord(function () {
            return eqDual(__dict_Ord_87["__superclass_Prelude.Eq_0"]());
        }, function (_245) {
            return function (_246) {
                return Prelude.compare(__dict_Ord_87)(_245)(_246);
            };
        });
    };
    return {
        Dual: Dual, 
        runDual: runDual, 
        eqDual: eqDual, 
        ordDual: ordDual, 
        showDual: showDual, 
        semigroupDual: semigroupDual, 
        monoidDual: monoidDual
    };
})();
var PS = PS || {};
PS.Data_Monoid_Endo = (function () {
    "use strict";
    var Prelude = PS.Prelude;
    var Data_Monoid = PS.Data_Monoid;
    var Endo = {
        create: function (value) {
            return value;
        }
    };
    var semigroupEndo = function () {
        return new Prelude.Semigroup(function (_251) {
            return function (_252) {
                return Prelude["<<<"](Prelude.semigroupoidArr())(_251)(_252);
            };
        });
    };
    var runEndo = function (_250) {
        return _250;
    };
    var monoidEndo = function () {
        return new Data_Monoid.Monoid(semigroupEndo, Prelude.id(Prelude.categoryArr()));
    };
    return {
        Endo: Endo, 
        runEndo: runEndo, 
        semigroupEndo: semigroupEndo, 
        monoidEndo: monoidEndo
    };
})();
var PS = PS || {};
PS.Data_Monoid_Product = (function () {
    "use strict";
    var Prelude = PS.Prelude;
    var Data_Monoid = PS.Data_Monoid;
    var Product = {
        create: function (value) {
            return value;
        }
    };
    var showProduct = function () {
        return new Prelude.Show(function (_260) {
            return "Product (" + (Prelude.show(Prelude.showNumber())(_260) + ")");
        });
    };
    var semigroupProduct = function () {
        return new Prelude.Semigroup(function (_261) {
            return function (_262) {
                return _261 * _262;
            };
        });
    };
    var runProduct = function (_253) {
        return _253;
    };
    var monoidProduct = function () {
        return new Data_Monoid.Monoid(semigroupProduct, 1);
    };
    var eqProduct = function () {
        return new Prelude.Eq(function (_256) {
            return function (_257) {
                return _256 !== _257;
            };
        }, function (_254) {
            return function (_255) {
                return _254 === _255;
            };
        });
    };
    var ordProduct = function () {
        return new Prelude.Ord(eqProduct, function (_258) {
            return function (_259) {
                return Prelude.compare(Prelude.ordNumber())(_258)(_259);
            };
        });
    };
    return {
        Product: Product, 
        runProduct: runProduct, 
        eqProduct: eqProduct, 
        ordProduct: ordProduct, 
        showProduct: showProduct, 
        semigroupProduct: semigroupProduct, 
        monoidProduct: monoidProduct
    };
})();
var PS = PS || {};
PS.Data_Monoid_Sum = (function () {
    "use strict";
    var Prelude = PS.Prelude;
    var Data_Monoid = PS.Data_Monoid;
    var Sum = {
        create: function (value) {
            return value;
        }
    };
    var showSum = function () {
        return new Prelude.Show(function (_270) {
            return "Sum (" + (Prelude.show(Prelude.showNumber())(_270) + ")");
        });
    };
    var semigroupSum = function () {
        return new Prelude.Semigroup(function (_271) {
            return function (_272) {
                return _271 + _272;
            };
        });
    };
    var runSum = function (_263) {
        return _263;
    };
    var monoidSum = function () {
        return new Data_Monoid.Monoid(semigroupSum, 0);
    };
    var eqSum = function () {
        return new Prelude.Eq(function (_266) {
            return function (_267) {
                return _266 !== _267;
            };
        }, function (_264) {
            return function (_265) {
                return _264 === _265;
            };
        });
    };
    var ordSum = function () {
        return new Prelude.Ord(eqSum, function (_268) {
            return function (_269) {
                return Prelude.compare(Prelude.ordNumber())(_268)(_269);
            };
        });
    };
    return {
        Sum: Sum, 
        runSum: runSum, 
        eqSum: eqSum, 
        ordSum: ordSum, 
        showSum: showSum, 
        semigroupSum: semigroupSum, 
        monoidSum: monoidSum
    };
})();
var PS = PS || {};
PS.Data_Tuple = (function () {
    "use strict";
    var Prelude = PS.Prelude;
    var Data_Array = PS.Data_Array;
    var Data_Monoid = PS.Data_Monoid;
    function Tuple(value0, value1) {
        this.value0 = value0;
        this.value1 = value1;
    };
    Tuple.create = function (value0) {
        return function (value1) {
            return new Tuple(value0, value1);
        };
    };
    var zip = Data_Array.zipWith(Tuple.create);
    var unzip = function (_277) {
        if (_277.length >= 1) {
            var _807 = _277.slice(1);
            var _801 = unzip(_807);
            return new Tuple(Prelude[":"]((_277[0]).value0)(_801.value0), Prelude[":"]((_277[0]).value1)(_801.value1));
        };
        if (_277.length === 0) {
            return new Tuple([  ], [  ]);
        };
        throw new Error("Failed pattern match");
    };
    var uncurry = function (_275) {
        return function (_276) {
            return _275(_276.value0)(_276.value1);
        };
    };
    var swap = function (_278) {
        return new Tuple(_278.value1, _278.value0);
    };
    var snd = function (_274) {
        return _274.value1;
    };
    var showTuple = function (__dict_Show_90) {
        return function (__dict_Show_91) {
            return new Prelude.Show(function (_279) {
                return "Tuple (" + (Prelude.show(__dict_Show_90)(_279.value0) + (") (" + (Prelude.show(__dict_Show_91)(_279.value1) + ")")));
            });
        };
    };
    var functorTuple = function () {
        return new Prelude.Functor(function (_284) {
            return function (_285) {
                return new Tuple(_285.value0, _284(_285.value1));
            };
        });
    };
    var fst = function (_273) {
        return _273.value0;
    };
    var eqTuple = function (__dict_Eq_95) {
        return function (__dict_Eq_96) {
            return new Prelude.Eq(function (t1) {
                return function (t2) {
                    return !Prelude["=="](eqTuple(__dict_Eq_95)(__dict_Eq_96))(t1)(t2);
                };
            }, function (_280) {
                return function (_281) {
                    return Prelude["=="](__dict_Eq_95)(_280.value0)(_281.value0) && Prelude["=="](__dict_Eq_96)(_280.value1)(_281.value1);
                };
            });
        };
    };
    var ordTuple = function (__dict_Ord_92) {
        return function (__dict_Ord_93) {
            return new Prelude.Ord(function () {
                return eqTuple(__dict_Ord_92["__superclass_Prelude.Eq_0"]())(__dict_Ord_93["__superclass_Prelude.Eq_0"]());
            }, function (_282) {
                return function (_283) {
                    var _836 = Prelude.compare(__dict_Ord_92)(_282.value0)(_283.value0);
                    if (_836 instanceof Prelude.EQ) {
                        return Prelude.compare(__dict_Ord_93)(_282.value1)(_283.value1);
                    };
                    return _836;
                };
            });
        };
    };
    var curry = function (f) {
        return function (a) {
            return function (b) {
                return f(new Tuple(a, b));
            };
        };
    };
    var applyTuple = function (__dict_Semigroup_98) {
        return new Prelude.Apply(function (_286) {
            return function (_287) {
                return new Tuple(Prelude["<>"](__dict_Semigroup_98)(_286.value0)(_287.value0), _286.value1(_287.value1));
            };
        }, functorTuple);
    };
    var bindTuple = function (__dict_Semigroup_97) {
        return new Prelude.Bind(function (_288) {
            return function (_289) {
                var _849 = _289(_288.value1);
                return new Tuple(Prelude["<>"](__dict_Semigroup_97)(_288.value0)(_849.value0), _849.value1);
            };
        }, function () {
            return applyTuple(__dict_Semigroup_97);
        });
    };
    var applicativeTuple = function (__dict_Monoid_99) {
        return new Prelude.Applicative(function () {
            return applyTuple(__dict_Monoid_99["__superclass_Prelude.Semigroup_0"]());
        }, Tuple.create(Data_Monoid.mempty(__dict_Monoid_99)));
    };
    var monadTuple = function (__dict_Monoid_94) {
        return new Prelude.Monad(function () {
            return applicativeTuple(__dict_Monoid_94);
        }, function () {
            return bindTuple(__dict_Monoid_94["__superclass_Prelude.Semigroup_0"]());
        });
    };
    return {
        Tuple: Tuple, 
        swap: swap, 
        unzip: unzip, 
        zip: zip, 
        uncurry: uncurry, 
        curry: curry, 
        snd: snd, 
        fst: fst, 
        showTuple: showTuple, 
        eqTuple: eqTuple, 
        ordTuple: ordTuple, 
        functorTuple: functorTuple, 
        applyTuple: applyTuple, 
        applicativeTuple: applicativeTuple, 
        bindTuple: bindTuple, 
        monadTuple: monadTuple
    };
})();
var PS = PS || {};
PS.Control_Monad_Error_Trans = (function () {
    "use strict";
    var Prelude = PS.Prelude;
    var Control_Monad_Trans = PS.Control_Monad_Trans;
    var Data_Either = PS.Data_Either;
    var Data_Tuple = PS.Data_Tuple;
    var Control_Apply = PS.Control_Apply;
    var Control_Alt = PS.Control_Alt;
    var Control_Plus = PS.Control_Plus;
    var Control_Monad_Error = PS.Control_Monad_Error;
    var Control_Alternative = PS.Control_Alternative;
    var Control_MonadPlus = PS.Control_MonadPlus;
    var ErrorT = {
        create: function (value) {
            return value;
        }
    };
    var runErrorT = function (_290) {
        return _290;
    };
    var monadTransErrorT = function (__dict_Error_102) {
        return new Control_Monad_Trans.MonadTrans(function (__dict_Monad_103) {
            return function (m) {
                return ErrorT.create(Prelude[">>="](__dict_Monad_103["__superclass_Prelude.Bind_1"]())(m)(function (_25) {
                    return Prelude["return"](__dict_Monad_103)(new Data_Either.Right(_25));
                }));
            };
        });
    };
    var mapErrorT = function (f) {
        return function (m) {
            return ErrorT.create(f(runErrorT(m)));
        };
    };
    var liftPassError = function (__dict_Monad_108) {
        return function (pass) {
            return mapErrorT(function (m) {
                return pass(Prelude[">>="](__dict_Monad_108["__superclass_Prelude.Bind_1"]())(m)(function (_27) {
                    return Prelude["return"](__dict_Monad_108)((function () {
                        if (_27 instanceof Data_Either.Left) {
                            return new Data_Tuple.Tuple(new Data_Either.Left(_27.value0), Prelude.id(Prelude.categoryArr()));
                        };
                        if (_27 instanceof Data_Either.Right) {
                            return new Data_Tuple.Tuple(new Data_Either.Right(_27.value0.value0), _27.value0.value1);
                        };
                        throw new Error("Failed pattern match");
                    })());
                }));
            });
        };
    };
    var liftListenError = function (__dict_Monad_109) {
        return function (listen) {
            return mapErrorT(function (m) {
                return Prelude[">>="](__dict_Monad_109["__superclass_Prelude.Bind_1"]())(listen(m))(function (_26) {
                    return Prelude["return"](__dict_Monad_109)(Prelude["<$>"](Data_Either.functorEither())(function (r) {
                        return new Data_Tuple.Tuple(r, _26.value1);
                    })(_26.value0));
                });
            });
        };
    };
    var liftCallCCError = function (callCC) {
        return function (f) {
            return ErrorT.create(callCC(function (c) {
                return runErrorT(f(function (a) {
                    return ErrorT.create(c(new Data_Either.Right(a)));
                }));
            }));
        };
    };
    var functorErrorT = function (__dict_Functor_110) {
        return new Prelude.Functor(function (f) {
            return Prelude["<<<"](Prelude.semigroupoidArr())(ErrorT.create)(Prelude["<<<"](Prelude.semigroupoidArr())(Prelude["<$>"](__dict_Functor_110)(Prelude["<$>"](Data_Either.functorEither())(f)))(runErrorT));
        });
    };
    var applyErrorT = function (__dict_Apply_113) {
        return new Prelude.Apply(function (_291) {
            return function (_292) {
                return ErrorT.create(Prelude["<*>"](__dict_Apply_113)(Prelude["<$>"](__dict_Apply_113["__superclass_Prelude.Functor_0"]())(Control_Apply.lift2(Data_Either.applyEither())(Prelude["$"]))(_291))(_292));
            };
        }, function () {
            return functorErrorT(__dict_Apply_113["__superclass_Prelude.Functor_0"]());
        });
    };
    var bindErrorT = function (__dict_Monad_111) {
        return function (__dict_Error_112) {
            return new Prelude.Bind(function (m) {
                return function (f) {
                    return ErrorT.create(Prelude[">>="](__dict_Monad_111["__superclass_Prelude.Bind_1"]())(runErrorT(m))(function (_24) {
                        if (_24 instanceof Data_Either.Left) {
                            return Prelude["return"](__dict_Monad_111)(new Data_Either.Left(_24.value0));
                        };
                        if (_24 instanceof Data_Either.Right) {
                            return runErrorT(f(_24.value0));
                        };
                        throw new Error("Failed pattern match");
                    }));
                };
            }, function () {
                return applyErrorT((__dict_Monad_111["__superclass_Prelude.Applicative_0"]())["__superclass_Prelude.Apply_0"]());
            });
        };
    };
    var applicativeErrorT = function (__dict_Applicative_114) {
        return new Prelude.Applicative(function () {
            return applyErrorT(__dict_Applicative_114["__superclass_Prelude.Apply_0"]());
        }, function (a) {
            return ErrorT.create(Prelude.pure(__dict_Applicative_114)(new Data_Either.Right(a)));
        });
    };
    var monadErrorT = function (__dict_Monad_106) {
        return function (__dict_Error_107) {
            return new Prelude.Monad(function () {
                return applicativeErrorT(__dict_Monad_106["__superclass_Prelude.Applicative_0"]());
            }, function () {
                return bindErrorT(__dict_Monad_106)(__dict_Error_107);
            });
        };
    };
    var altErrorT = function (__dict_Monad_117) {
        return function (__dict_Error_118) {
            return new Control_Alt.Alt(function (x) {
                return function (y) {
                    return ErrorT.create(Prelude[">>="](__dict_Monad_117["__superclass_Prelude.Bind_1"]())(runErrorT(x))(function (e) {
                        if (e instanceof Data_Either.Left) {
                            return runErrorT(y);
                        };
                        return Prelude["return"](__dict_Monad_117)(e);
                    }));
                };
            }, function () {
                return functorErrorT(((__dict_Monad_117["__superclass_Prelude.Applicative_0"]())["__superclass_Prelude.Apply_0"]())["__superclass_Prelude.Functor_0"]());
            });
        };
    };
    var plusErrorT = function (__dict_Monad_100) {
        return function (__dict_Error_101) {
            return new Control_Plus.Plus(function () {
                return altErrorT(__dict_Monad_100)(__dict_Error_101);
            }, Prelude["return"](__dict_Monad_100)(Data_Either.Left.create(Control_Monad_Error.strMsg(__dict_Error_101)("No alternative"))));
        };
    };
    var alternativeErrorT = function (__dict_Monad_115) {
        return function (__dict_Error_116) {
            return new Control_Alternative.Alternative(function () {
                return plusErrorT(__dict_Monad_115)(__dict_Error_116);
            }, function () {
                return applicativeErrorT(__dict_Monad_115["__superclass_Prelude.Applicative_0"]());
            });
        };
    };
    var monadPlusErrorT = function (__dict_Monad_104) {
        return function (__dict_Error_105) {
            return new Control_MonadPlus.MonadPlus(function () {
                return alternativeErrorT(__dict_Monad_104)(__dict_Error_105);
            }, function () {
                return monadErrorT(__dict_Monad_104)(__dict_Error_105);
            });
        };
    };
    return {
        ErrorT: ErrorT, 
        liftCallCCError: liftCallCCError, 
        liftPassError: liftPassError, 
        liftListenError: liftListenError, 
        mapErrorT: mapErrorT, 
        runErrorT: runErrorT, 
        functorErrorT: functorErrorT, 
        applyErrorT: applyErrorT, 
        applicativeErrorT: applicativeErrorT, 
        altErrorT: altErrorT, 
        plusErrorT: plusErrorT, 
        alternativeErrorT: alternativeErrorT, 
        bindErrorT: bindErrorT, 
        monadErrorT: monadErrorT, 
        monadPlusErrorT: monadPlusErrorT, 
        monadTransErrorT: monadTransErrorT
    };
})();
var PS = PS || {};
PS.Control_Monad_Maybe_Trans = (function () {
    "use strict";
    var Prelude = PS.Prelude;
    var Control_Monad_Trans = PS.Control_Monad_Trans;
    var Data_Maybe = PS.Data_Maybe;
    var Data_Tuple = PS.Data_Tuple;
    var MaybeT = {
        create: function (value) {
            return value;
        }
    };
    var runMaybeT = function (_293) {
        return _293;
    };
    var monadTransMaybeT = function () {
        return new Control_Monad_Trans.MonadTrans(function (__dict_Monad_119) {
            return Prelude["<<<"](Prelude.semigroupoidArr())(MaybeT.create)(Prelude.liftM1(__dict_Monad_119)(Data_Maybe.Just.create));
        });
    };
    var mapMaybeT = function (f) {
        return Prelude["<<<"](Prelude.semigroupoidArr())(MaybeT.create)(Prelude["<<<"](Prelude.semigroupoidArr())(f)(runMaybeT));
    };
    var liftPassMaybe = function (__dict_Monad_121) {
        return function (pass) {
            return mapMaybeT(function (m) {
                return pass(Prelude[">>="](__dict_Monad_121["__superclass_Prelude.Bind_1"]())(m)(function (_30) {
                    return Prelude["return"](__dict_Monad_121)((function () {
                        if (_30 instanceof Data_Maybe.Nothing) {
                            return new Data_Tuple.Tuple(Data_Maybe.Nothing.value, Prelude.id(Prelude.categoryArr()));
                        };
                        if (_30 instanceof Data_Maybe.Just) {
                            return new Data_Tuple.Tuple(new Data_Maybe.Just(_30.value0.value0), _30.value0.value1);
                        };
                        throw new Error("Failed pattern match");
                    })());
                }));
            });
        };
    };
    var liftListenMaybe = function (__dict_Monad_122) {
        return function (listen) {
            return mapMaybeT(function (m) {
                return Prelude[">>="](__dict_Monad_122["__superclass_Prelude.Bind_1"]())(listen(m))(function (_29) {
                    return Prelude["return"](__dict_Monad_122)(Prelude["<$>"](Data_Maybe.functorMaybe())(function (r) {
                        return new Data_Tuple.Tuple(r, _29.value1);
                    })(_29.value0));
                });
            });
        };
    };
    var liftCatchMaybe = function ($$catch) {
        return function (m) {
            return function (h) {
                return MaybeT.create($$catch(runMaybeT(m))(Prelude["<<<"](Prelude.semigroupoidArr())(runMaybeT)(h)));
            };
        };
    };
    var liftCallCCMaybe = function (callCC) {
        return function (f) {
            return MaybeT.create(callCC(function (c) {
                return runMaybeT(f(function (a) {
                    return MaybeT.create(c(new Data_Maybe.Just(a)));
                }));
            }));
        };
    };
    var applicativeMaybeT = function (__dict_Monad_126) {
        return new Prelude.Applicative(function () {
            return applyMaybeT(__dict_Monad_126);
        }, Prelude["<<<"](Prelude.semigroupoidArr())(MaybeT.create)(Prelude["<<<"](Prelude.semigroupoidArr())(Prelude.pure(__dict_Monad_126["__superclass_Prelude.Applicative_0"]()))(Data_Maybe.Just.create)));
    };
    var applyMaybeT = function (__dict_Monad_125) {
        return new Prelude.Apply(Prelude.ap(monadMaybeT(__dict_Monad_125)), function () {
            return functorMaybeT(__dict_Monad_125);
        });
    };
    var monadMaybeT = function (__dict_Monad_120) {
        return new Prelude.Monad(function () {
            return applicativeMaybeT(__dict_Monad_120);
        }, function () {
            return bindMaybeT(__dict_Monad_120);
        });
    };
    var bindMaybeT = function (__dict_Monad_124) {
        return new Prelude.Bind(function (x) {
            return function (f) {
                return MaybeT.create(Prelude[">>="](__dict_Monad_124["__superclass_Prelude.Bind_1"]())(runMaybeT(x))(function (_28) {
                    if (_28 instanceof Data_Maybe.Nothing) {
                        return Prelude["return"](__dict_Monad_124)(Data_Maybe.Nothing.value);
                    };
                    if (_28 instanceof Data_Maybe.Just) {
                        return runMaybeT(f(_28.value0));
                    };
                    throw new Error("Failed pattern match");
                }));
            };
        }, function () {
            return applyMaybeT(__dict_Monad_124);
        });
    };
    var functorMaybeT = function (__dict_Monad_123) {
        return new Prelude.Functor(Prelude.liftA1(applicativeMaybeT(__dict_Monad_123)));
    };
    return {
        MaybeT: MaybeT, 
        liftCallCCMaybe: liftCallCCMaybe, 
        liftPassMaybe: liftPassMaybe, 
        liftListenMaybe: liftListenMaybe, 
        liftCatchMaybe: liftCatchMaybe, 
        mapMaybeT: mapMaybeT, 
        runMaybeT: runMaybeT, 
        functorMaybeT: functorMaybeT, 
        applyMaybeT: applyMaybeT, 
        applicativeMaybeT: applicativeMaybeT, 
        bindMaybeT: bindMaybeT, 
        monadMaybeT: monadMaybeT, 
        monadTransMaybeT: monadTransMaybeT
    };
})();
var PS = PS || {};
PS.Control_Monad_RWS_Trans = (function () {
    "use strict";
    var Prelude = PS.Prelude;
    var Data_Tuple = PS.Data_Tuple;
    var Control_Monad_Trans = PS.Control_Monad_Trans;
    var Data_Monoid = PS.Data_Monoid;
    var RWST = {
        create: function (value) {
            return value;
        }
    };
    var runRWST = function (_296) {
        return _296;
    };
    var withRWST = function (f) {
        return function (m) {
            return function (r) {
                return function (s) {
                    return Data_Tuple.uncurry(runRWST(m))(f(r)(s));
                };
            };
        };
    };
    var mkSee = function (__dict_Monoid_129) {
        return function (s) {
            return function (a) {
                return function (w) {
                    return {
                        state: s, 
                        result: a, 
                        log: w
                    };
                };
            };
        };
    };
    var monadTransRWST = function (__dict_Monoid_130) {
        return new Control_Monad_Trans.MonadTrans(function (__dict_Monad_131) {
            return function (m) {
                return function (_) {
                    return function (s) {
                        return Prelude[">>="](__dict_Monad_131["__superclass_Prelude.Bind_1"]())(m)(function (a) {
                            return Prelude["return"](__dict_Monad_131)(mkSee(__dict_Monoid_130)(s)(a)(Data_Monoid.mempty(__dict_Monoid_130)));
                        });
                    };
                };
            };
        });
    };
    var mapRWST = function (f) {
        return function (m) {
            return function (r) {
                return function (s) {
                    return f(runRWST(m)(r)(s));
                };
            };
        };
    };
    var functorRWST = function (__dict_Functor_132) {
        return new Prelude.Functor(function (f) {
            return function (m) {
                return function (r) {
                    return function (s) {
                        return Prelude["<$>"](__dict_Functor_132)(function (see) {
                            var _886 = {};
                            for (var _887 in see) {
                                if (see.hasOwnProperty(_887)) {
                                    _886[_887] = see[_887];
                                };
                            };
                            _886.result = f(see.result);
                            return _886;
                        })(runRWST(m)(r)(s));
                    };
                };
            };
        });
    };
    var execRWST = function (__dict_Monad_133) {
        return function (m) {
            return function (r) {
                return function (s) {
                    return Prelude[">>="](__dict_Monad_133["__superclass_Prelude.Bind_1"]())(runRWST(m)(r)(s))(function (see) {
                        return Prelude["return"](__dict_Monad_133)(new Data_Tuple.Tuple(see.state, see.log));
                    });
                };
            };
        };
    };
    var evalRWST = function (__dict_Monad_134) {
        return function (m) {
            return function (r) {
                return function (s) {
                    return Prelude[">>="](__dict_Monad_134["__superclass_Prelude.Bind_1"]())(runRWST(m)(r)(s))(function (see) {
                        return Prelude["return"](__dict_Monad_134)(new Data_Tuple.Tuple(see.result, see.log));
                    });
                };
            };
        };
    };
    var applyRWST = function (__dict_Apply_137) {
        return function (__dict_Semigroup_138) {
            return new Prelude.Apply(function (f) {
                return function (m) {
                    return function (r) {
                        return function (s) {
                            return Prelude["<*>"](__dict_Apply_137)(Prelude["<$>"](__dict_Apply_137["__superclass_Prelude.Functor_0"]())(function (_294) {
                                return function (see) {
                                    var _889 = {};
                                    for (var _890 in see) {
                                        if (see.hasOwnProperty(_890)) {
                                            _889[_890] = see[_890];
                                        };
                                    };
                                    _889.result = _294.result(see.result);
                                    _889.log = Prelude["<>"](__dict_Semigroup_138)(_294.log)(see.log);
                                    return _889;
                                };
                            })(runRWST(f)(r)(s)))(runRWST(m)(r)(s));
                        };
                    };
                };
            }, function () {
                return functorRWST(__dict_Apply_137["__superclass_Prelude.Functor_0"]());
            });
        };
    };
    var bindRWST = function (__dict_Bind_135) {
        return function (__dict_Semigroup_136) {
            return new Prelude.Bind(function (m) {
                return function (f) {
                    return function (r) {
                        return function (s) {
                            return Prelude[">>="](__dict_Bind_135)(runRWST(m)(r)(s))(function (_295) {
                                return Prelude["<$>"]((__dict_Bind_135["__superclass_Prelude.Apply_0"]())["__superclass_Prelude.Functor_0"]())(function (see$prime) {
                                    var _894 = {};
                                    for (var _895 in see$prime) {
                                        if (see$prime.hasOwnProperty(_895)) {
                                            _894[_895] = see$prime[_895];
                                        };
                                    };
                                    _894.log = Prelude["<>"](__dict_Semigroup_136)(_295.log)(see$prime.log);
                                    return _894;
                                })(runRWST(f(_295.result))(r)(_295.state));
                            });
                        };
                    };
                };
            }, function () {
                return applyRWST(__dict_Bind_135["__superclass_Prelude.Apply_0"]())(__dict_Semigroup_136);
            });
        };
    };
    var applicativeRWST = function (__dict_Applicative_139) {
        return function (__dict_Monoid_140) {
            return new Prelude.Applicative(function () {
                return applyRWST(__dict_Applicative_139["__superclass_Prelude.Apply_0"]())(__dict_Monoid_140["__superclass_Prelude.Semigroup_0"]());
            }, function (a) {
                return function (_) {
                    return function (s) {
                        return Prelude.pure(__dict_Applicative_139)(mkSee(__dict_Monoid_140)(s)(a)(Data_Monoid.mempty(__dict_Monoid_140)));
                    };
                };
            });
        };
    };
    var monadRWST = function (__dict_Monad_127) {
        return function (__dict_Monoid_128) {
            return new Prelude.Monad(function () {
                return applicativeRWST(__dict_Monad_127["__superclass_Prelude.Applicative_0"]())(__dict_Monoid_128);
            }, function () {
                return bindRWST(__dict_Monad_127["__superclass_Prelude.Bind_1"]())(__dict_Monoid_128["__superclass_Prelude.Semigroup_0"]());
            });
        };
    };
    return {
        RWST: RWST, 
        withRWST: withRWST, 
        mapRWST: mapRWST, 
        execRWST: execRWST, 
        evalRWST: evalRWST, 
        runRWST: runRWST, 
        mkSee: mkSee, 
        functorRWST: functorRWST, 
        applyRWST: applyRWST, 
        bindRWST: bindRWST, 
        applicativeRWST: applicativeRWST, 
        monadRWST: monadRWST, 
        monadTransRWST: monadTransRWST
    };
})();
var PS = PS || {};
PS.Control_Monad_RWS = (function () {
    "use strict";
    var Prelude = PS.Prelude;
    var Data_Tuple = PS.Data_Tuple;
    var Control_Monad_RWS_Trans = PS.Control_Monad_RWS_Trans;
    var Data_Monoid = PS.Data_Monoid;
    var Control_Monad_Identity = PS.Control_Monad_Identity;
    var writer = function (__dict_Applicative_141) {
        return function (_300) {
            return function (_) {
                return function (s) {
                    return Prelude.pure(__dict_Applicative_141)({
                        state: s, 
                        result: _300.value0, 
                        log: _300.value1
                    });
                };
            };
        };
    };
    var withRWS = Control_Monad_RWS_Trans.withRWST;
    var tell = function (__dict_Applicative_142) {
        return function (w) {
            return writer(__dict_Applicative_142)(new Data_Tuple.Tuple(Prelude.unit, w));
        };
    };
    var state = function (__dict_Applicative_143) {
        return function (__dict_Monoid_144) {
            return function (f) {
                return function (_) {
                    return function (s) {
                        var _902 = f(s);
                        return Prelude.pure(__dict_Applicative_143)(Control_Monad_RWS_Trans.mkSee(__dict_Monoid_144)(_902.value1)(_902.value0)(Data_Monoid.mempty(__dict_Monoid_144)));
                    };
                };
            };
        };
    };
    var rws = function (f) {
        return function (r) {
            return function (s) {
                return Prelude["return"](Control_Monad_Identity.monadIdentity())(f(r)(s));
            };
        };
    };
    var runRWS = function (m) {
        return function (r) {
            return function (s) {
                return Control_Monad_Identity.runIdentity(Control_Monad_RWS_Trans.runRWST(m)(r)(s));
            };
        };
    };
    var reader = function (__dict_Applicative_145) {
        return function (__dict_Monoid_146) {
            return function (f) {
                return function (r) {
                    return function (s) {
                        return Prelude.pure(__dict_Applicative_145)(Control_Monad_RWS_Trans.mkSee(__dict_Monoid_146)(s)(f(r))(Data_Monoid.mempty(__dict_Monoid_146)));
                    };
                };
            };
        };
    };
    var put = function (__dict_Applicative_147) {
        return function (__dict_Monoid_148) {
            return function (s) {
                return state(__dict_Applicative_147)(__dict_Monoid_148)(function (_) {
                    return new Data_Tuple.Tuple(Prelude.unit, s);
                });
            };
        };
    };
    var pass = function (__dict_Monad_149) {
        return function (m) {
            return function (r) {
                return function (s) {
                    return Prelude[">>="](__dict_Monad_149["__superclass_Prelude.Bind_1"]())(Control_Monad_RWS_Trans.runRWST(m)(r)(s))(function (_298) {
                        return Prelude.pure(__dict_Monad_149["__superclass_Prelude.Applicative_0"]())({
                            state: _298.state, 
                            result: _298.result.value0, 
                            log: _298.result.value1(_298.log)
                        });
                    });
                };
            };
        };
    };
    var modify = function (__dict_Applicative_150) {
        return function (__dict_Monoid_151) {
            return function (f) {
                return state(__dict_Applicative_150)(__dict_Monoid_151)(function (s) {
                    return new Data_Tuple.Tuple(Prelude.unit, f(s));
                });
            };
        };
    };
    var mapRWS = function (f) {
        return Control_Monad_RWS_Trans.mapRWST(Prelude[">>>"](Prelude.semigroupoidArr())(Control_Monad_Identity.runIdentity)(Prelude[">>>"](Prelude.semigroupoidArr())(f)(Control_Monad_Identity.Identity.create)));
    };
    var local = function (f) {
        return function (m) {
            return function (r) {
                return function (s) {
                    return Control_Monad_RWS_Trans.runRWST(m)(f(r))(s);
                };
            };
        };
    };
    var listens = function (__dict_Monad_152) {
        return function (f) {
            return function (m) {
                return function (r) {
                    return function (s) {
                        return Prelude[">>="](__dict_Monad_152["__superclass_Prelude.Bind_1"]())(Control_Monad_RWS_Trans.runRWST(m)(r)(s))(function (_299) {
                            return Prelude.pure(__dict_Monad_152["__superclass_Prelude.Applicative_0"]())({
                                state: _299.state, 
                                result: new Data_Tuple.Tuple(_299.result, f(_299.log)), 
                                log: _299.log
                            });
                        });
                    };
                };
            };
        };
    };
    var listen = function (__dict_Monad_153) {
        return function (m) {
            return function (r) {
                return function (s) {
                    return Prelude[">>="](__dict_Monad_153["__superclass_Prelude.Bind_1"]())(Control_Monad_RWS_Trans.runRWST(m)(r)(s))(function (_297) {
                        return Prelude.pure(__dict_Monad_153["__superclass_Prelude.Applicative_0"]())({
                            state: _297.state, 
                            result: new Data_Tuple.Tuple(_297.result, _297.log), 
                            log: _297.log
                        });
                    });
                };
            };
        };
    };
    var gets = function (__dict_Applicative_154) {
        return function (__dict_Monoid_155) {
            return function (f) {
                return state(__dict_Applicative_154)(__dict_Monoid_155)(function (s) {
                    return new Data_Tuple.Tuple(f(s), s);
                });
            };
        };
    };
    var get = function (__dict_Applicative_156) {
        return function (__dict_Monoid_157) {
            return state(__dict_Applicative_156)(__dict_Monoid_157)(function (s) {
                return new Data_Tuple.Tuple(s, s);
            });
        };
    };
    var execRWS = function (m) {
        return function (r) {
            return function (s) {
                return Control_Monad_Identity.runIdentity(Control_Monad_RWS_Trans.execRWST(Control_Monad_Identity.monadIdentity())(m)(r)(s));
            };
        };
    };
    var evalRWS = function (m) {
        return function (r) {
            return function (s) {
                return Control_Monad_Identity.runIdentity(Control_Monad_RWS_Trans.evalRWST(Control_Monad_Identity.monadIdentity())(m)(r)(s));
            };
        };
    };
    var censor = function (__dict_Monad_158) {
        return function (f) {
            return function (m) {
                return function (r) {
                    return function (s) {
                        return Prelude[">>="](__dict_Monad_158["__superclass_Prelude.Bind_1"]())(Control_Monad_RWS_Trans.runRWST(m)(r)(s))(function (see) {
                            return Prelude.pure(__dict_Monad_158["__superclass_Prelude.Applicative_0"]())((function () {
                                var _919 = {};
                                for (var _920 in see) {
                                    if (see.hasOwnProperty(_920)) {
                                        _919[_920] = see[_920];
                                    };
                                };
                                _919.log = f(see.log);
                                return _919;
                            })());
                        });
                    };
                };
            };
        };
    };
    var ask = function (__dict_Applicative_159) {
        return function (__dict_Monoid_160) {
            return function (r) {
                return function (s) {
                    return Prelude.pure(__dict_Applicative_159)(Control_Monad_RWS_Trans.mkSee(__dict_Monoid_160)(s)(r)(Data_Monoid.mempty(__dict_Monoid_160)));
                };
            };
        };
    };
    return {
        modify: modify, 
        put: put, 
        gets: gets, 
        get: get, 
        state: state, 
        censor: censor, 
        listens: listens, 
        tell: tell, 
        pass: pass, 
        listen: listen, 
        writer: writer, 
        reader: reader, 
        local: local, 
        ask: ask, 
        withRWS: withRWS, 
        mapRWS: mapRWS, 
        execRWS: execRWS, 
        evalRWS: evalRWS, 
        runRWS: runRWS, 
        rws: rws
    };
})();
var PS = PS || {};
PS.Control_Monad_State_Trans = (function () {
    "use strict";
    var Prelude = PS.Prelude;
    var Control_Monad_Trans = PS.Control_Monad_Trans;
    var Data_Tuple = PS.Data_Tuple;
    var Control_Lazy = PS.Control_Lazy;
    var Control_Alt = PS.Control_Alt;
    var Control_Plus = PS.Control_Plus;
    var Control_Alternative = PS.Control_Alternative;
    var Control_MonadPlus = PS.Control_MonadPlus;
    var StateT = {
        create: function (value) {
            return value;
        }
    };
    var runStateT = function (_303) {
        return _303;
    };
    var withStateT = function (f) {
        return function (s) {
            return StateT.create(Prelude["<<<"](Prelude.semigroupoidArr())(runStateT(s))(f));
        };
    };
    var monadTransStateT = function () {
        return new Control_Monad_Trans.MonadTrans(function (__dict_Monad_163) {
            return function (m) {
                return function (s) {
                    return Prelude[">>="](__dict_Monad_163["__superclass_Prelude.Bind_1"]())(m)(function (_32) {
                        return Prelude["return"](__dict_Monad_163)(new Data_Tuple.Tuple(_32, s));
                    });
                };
            };
        });
    };
    var mapStateT = function (f) {
        return function (m) {
            return StateT.create(Prelude["<<<"](Prelude.semigroupoidArr())(f)(runStateT(m)));
        };
    };
    var liftPassState = function (__dict_Monad_166) {
        return function (pass) {
            return function (m) {
                return StateT.create(function (s) {
                    return pass(Prelude[">>="](__dict_Monad_166["__superclass_Prelude.Bind_1"]())(runStateT(m)(s))(function (_34) {
                        return Prelude["return"](__dict_Monad_166)(new Data_Tuple.Tuple(new Data_Tuple.Tuple(_34.value0.value0, _34.value1), _34.value0.value1));
                    }));
                });
            };
        };
    };
    var liftListenState = function (__dict_Monad_167) {
        return function (listen) {
            return function (m) {
                return StateT.create(function (s) {
                    return Prelude[">>="](__dict_Monad_167["__superclass_Prelude.Bind_1"]())(listen(runStateT(m)(s)))(function (_33) {
                        return Prelude["return"](__dict_Monad_167)(new Data_Tuple.Tuple(new Data_Tuple.Tuple(_33.value0.value0, _33.value1), _33.value0.value1));
                    });
                });
            };
        };
    };
    var liftCatchState = function ($$catch) {
        return function (m) {
            return function (h) {
                return StateT.create(function (s) {
                    return $$catch(runStateT(m)(s))(function (e) {
                        return runStateT(h(e))(s);
                    });
                });
            };
        };
    };
    var liftCallCCState$prime = function (callCC) {
        return function (f) {
            return StateT.create(function (s) {
                return callCC(function (c) {
                    return runStateT(f(function (a) {
                        return StateT.create(function (s$prime) {
                            return c(new Data_Tuple.Tuple(a, s$prime));
                        });
                    }))(s);
                });
            });
        };
    };
    var liftCallCCState = function (callCC) {
        return function (f) {
            return StateT.create(function (s) {
                return callCC(function (c) {
                    return runStateT(f(function (a) {
                        return StateT.create(function (_) {
                            return c(new Data_Tuple.Tuple(a, s));
                        });
                    }))(s);
                });
            });
        };
    };
    var lazy1StateT = function () {
        return new Control_Lazy.Lazy1(function (f) {
            return StateT.create(function (s) {
                return runStateT(f(Prelude.unit))(s);
            });
        });
    };
    var execStateT = function (__dict_Monad_169) {
        return function (m) {
            return function (s) {
                return Prelude[">>="](__dict_Monad_169["__superclass_Prelude.Bind_1"]())(runStateT(m)(s))(function (_302) {
                    return Prelude["return"](__dict_Monad_169)(_302.value1);
                });
            };
        };
    };
    var evalStateT = function (__dict_Monad_170) {
        return function (m) {
            return function (s) {
                return Prelude[">>="](__dict_Monad_170["__superclass_Prelude.Bind_1"]())(runStateT(m)(s))(function (_301) {
                    return Prelude["return"](__dict_Monad_170)(_301.value0);
                });
            };
        };
    };
    var applicativeStateT = function (__dict_Monad_173) {
        return new Prelude.Applicative(function () {
            return applyStateT(__dict_Monad_173);
        }, function (a) {
            return StateT.create(function (s) {
                return Prelude["return"](__dict_Monad_173)(new Data_Tuple.Tuple(a, s));
            });
        });
    };
    var applyStateT = function (__dict_Monad_172) {
        return new Prelude.Apply(Prelude.ap(monadStateT(__dict_Monad_172)), function () {
            return functorStateT(__dict_Monad_172);
        });
    };
    var monadStateT = function (__dict_Monad_164) {
        return new Prelude.Monad(function () {
            return applicativeStateT(__dict_Monad_164);
        }, function () {
            return bindStateT(__dict_Monad_164);
        });
    };
    var bindStateT = function (__dict_Monad_171) {
        return new Prelude.Bind(function (_304) {
            return function (_305) {
                return function (s) {
                    return Prelude[">>="](__dict_Monad_171["__superclass_Prelude.Bind_1"]())(_304(s))(function (_31) {
                        return runStateT(_305(_31.value0))(_31.value1);
                    });
                };
            };
        }, function () {
            return applyStateT(__dict_Monad_171);
        });
    };
    var functorStateT = function (__dict_Monad_168) {
        return new Prelude.Functor(Prelude.liftM1(monadStateT(__dict_Monad_168)));
    };
    var altStateT = function (__dict_Monad_176) {
        return function (__dict_Alt_177) {
            return new Control_Alt.Alt(function (x) {
                return function (y) {
                    return StateT.create(function (s) {
                        return Control_Alt["<|>"](__dict_Alt_177)(runStateT(x)(s))(runStateT(y)(s));
                    });
                };
            }, function () {
                return functorStateT(__dict_Monad_176);
            });
        };
    };
    var plusStateT = function (__dict_Monad_161) {
        return function (__dict_Plus_162) {
            return new Control_Plus.Plus(function () {
                return altStateT(__dict_Monad_161)(__dict_Plus_162["__superclass_Control.Alt.Alt_0"]());
            }, StateT.create(function (_) {
                return Control_Plus.empty(__dict_Plus_162);
            }));
        };
    };
    var alternativeStateT = function (__dict_Monad_174) {
        return function (__dict_Alternative_175) {
            return new Control_Alternative.Alternative(function () {
                return plusStateT(__dict_Monad_174)(__dict_Alternative_175["__superclass_Control.Plus.Plus_1"]());
            }, function () {
                return applicativeStateT(__dict_Monad_174);
            });
        };
    };
    var monadPlusStateT = function (__dict_MonadPlus_165) {
        return new Control_MonadPlus.MonadPlus(function () {
            return alternativeStateT(__dict_MonadPlus_165["__superclass_Prelude.Monad_0"]())(__dict_MonadPlus_165["__superclass_Control.Alternative.Alternative_1"]());
        }, function () {
            return monadStateT(__dict_MonadPlus_165["__superclass_Prelude.Monad_0"]());
        });
    };
    return {
        StateT: StateT, 
        "liftCallCCState'": liftCallCCState$prime, 
        liftCallCCState: liftCallCCState, 
        liftPassState: liftPassState, 
        liftListenState: liftListenState, 
        liftCatchState: liftCatchState, 
        withStateT: withStateT, 
        mapStateT: mapStateT, 
        execStateT: execStateT, 
        evalStateT: evalStateT, 
        runStateT: runStateT, 
        functorStateT: functorStateT, 
        applyStateT: applyStateT, 
        applicativeStateT: applicativeStateT, 
        altStateT: altStateT, 
        plusStateT: plusStateT, 
        alternativeStateT: alternativeStateT, 
        bindStateT: bindStateT, 
        monadStateT: monadStateT, 
        monadPlusStateT: monadPlusStateT, 
        monadTransStateT: monadTransStateT, 
        lazy1StateT: lazy1StateT
    };
})();
var PS = PS || {};
PS.Control_Monad_State = (function () {
    "use strict";
    var Prelude = PS.Prelude;
    var Control_Monad_State_Trans = PS.Control_Monad_State_Trans;
    var Control_Monad_Identity = PS.Control_Monad_Identity;
    var Data_Tuple = PS.Data_Tuple;
    var withState = Control_Monad_State_Trans.withStateT;
    var runState = function (s) {
        return Prelude["<<<"](Prelude.semigroupoidArr())(Control_Monad_Identity.runIdentity)(Control_Monad_State_Trans.runStateT(s));
    };
    var mapState = function (f) {
        return Control_Monad_State_Trans.mapStateT(Prelude["<<<"](Prelude.semigroupoidArr())(Control_Monad_Identity.Identity.create)(Prelude["<<<"](Prelude.semigroupoidArr())(f)(Control_Monad_Identity.runIdentity)));
    };
    var execState = function (m) {
        return function (s) {
            return Data_Tuple.snd(runState(m)(s));
        };
    };
    var evalState = function (m) {
        return function (s) {
            return Data_Tuple.fst(runState(m)(s));
        };
    };
    return {
        withState: withState, 
        mapState: mapState, 
        execState: execState, 
        evalState: evalState, 
        runState: runState
    };
})();
var PS = PS || {};
PS.Control_Monad_Writer_Trans = (function () {
    "use strict";
    var Prelude = PS.Prelude;
    var Control_Monad_Trans = PS.Control_Monad_Trans;
    var Data_Tuple = PS.Data_Tuple;
    var Data_Monoid = PS.Data_Monoid;
    var Control_Alt = PS.Control_Alt;
    var Control_Plus = PS.Control_Plus;
    var Control_Alternative = PS.Control_Alternative;
    var Control_MonadPlus = PS.Control_MonadPlus;
    var WriterT = {
        create: function (value) {
            return value;
        }
    };
    var runWriterT = function (_307) {
        return _307;
    };
    var monadTransWriterT = function (__dict_Monoid_182) {
        return new Control_Monad_Trans.MonadTrans(function (__dict_Monad_183) {
            return function (m) {
                return WriterT.create(Prelude[">>="](__dict_Monad_183["__superclass_Prelude.Bind_1"]())(m)(function (_37) {
                    return Prelude["return"](__dict_Monad_183)(new Data_Tuple.Tuple(_37, Data_Monoid.mempty(__dict_Monoid_182)));
                }));
            };
        });
    };
    var mapWriterT = function (f) {
        return function (m) {
            return WriterT.create(f(runWriterT(m)));
        };
    };
    var liftCatchWriter = function ($$catch) {
        return function (m) {
            return function (h) {
                return WriterT.create($$catch(runWriterT(m))(function (e) {
                    return runWriterT(h(e));
                }));
            };
        };
    };
    var liftCallCCWriter = function (__dict_Monoid_186) {
        return function (callCC) {
            return function (f) {
                return WriterT.create(callCC(function (c) {
                    return runWriterT(f(function (a) {
                        return WriterT.create(c(new Data_Tuple.Tuple(a, Data_Monoid.mempty(__dict_Monoid_186))));
                    }));
                }));
            };
        };
    };
    var functorWriterT = function (__dict_Functor_187) {
        return new Prelude.Functor(function (f) {
            return mapWriterT(Prelude["<$>"](__dict_Functor_187)(function (_306) {
                return new Data_Tuple.Tuple(f(_306.value0), _306.value1);
            }));
        });
    };
    var applyWriterT = function (__dict_Monoid_190) {
        return function (__dict_Apply_191) {
            return new Prelude.Apply(function (f) {
                return function (v) {
                    return WriterT.create((function () {
                        var k = function (_308) {
                            return function (_309) {
                                return new Data_Tuple.Tuple(_308.value0(_309.value0), Prelude["<>"](__dict_Monoid_190["__superclass_Prelude.Semigroup_0"]())(_308.value1)(_309.value1));
                            };
                        };
                        return Prelude["<*>"](__dict_Apply_191)(Prelude["<$>"](__dict_Apply_191["__superclass_Prelude.Functor_0"]())(k)(runWriterT(f)))(runWriterT(v));
                    })());
                };
            }, function () {
                return functorWriterT(__dict_Apply_191["__superclass_Prelude.Functor_0"]());
            });
        };
    };
    var bindWriterT = function (__dict_Monoid_188) {
        return function (__dict_Monad_189) {
            return new Prelude.Bind(function (m) {
                return function (k) {
                    return WriterT.create(Prelude[">>="](__dict_Monad_189["__superclass_Prelude.Bind_1"]())(runWriterT(m))(function (_36) {
                        return Prelude[">>="](__dict_Monad_189["__superclass_Prelude.Bind_1"]())(runWriterT(k(_36.value0)))(function (_35) {
                            return Prelude["return"](__dict_Monad_189)(new Data_Tuple.Tuple(_35.value0, Prelude["<>"](__dict_Monoid_188["__superclass_Prelude.Semigroup_0"]())(_36.value1)(_35.value1)));
                        });
                    }));
                };
            }, function () {
                return applyWriterT(__dict_Monoid_188)((__dict_Monad_189["__superclass_Prelude.Applicative_0"]())["__superclass_Prelude.Apply_0"]());
            });
        };
    };
    var applicativeWriterT = function (__dict_Monoid_192) {
        return function (__dict_Applicative_193) {
            return new Prelude.Applicative(function () {
                return applyWriterT(__dict_Monoid_192)(__dict_Applicative_193["__superclass_Prelude.Apply_0"]());
            }, function (a) {
                return WriterT.create(Prelude.pure(__dict_Applicative_193)(new Data_Tuple.Tuple(a, Data_Monoid.mempty(__dict_Monoid_192))));
            });
        };
    };
    var monadWriterT = function (__dict_Monoid_180) {
        return function (__dict_Monad_181) {
            return new Prelude.Monad(function () {
                return applicativeWriterT(__dict_Monoid_180)(__dict_Monad_181["__superclass_Prelude.Applicative_0"]());
            }, function () {
                return bindWriterT(__dict_Monoid_180)(__dict_Monad_181);
            });
        };
    };
    var altWriterT = function (__dict_Monoid_196) {
        return function (__dict_Alt_197) {
            return new Control_Alt.Alt(function (m) {
                return function (n) {
                    return WriterT.create(Control_Alt["<|>"](__dict_Alt_197)(runWriterT(m))(runWriterT(n)));
                };
            }, function () {
                return functorWriterT(__dict_Alt_197["__superclass_Prelude.Functor_0"]());
            });
        };
    };
    var plusWriterT = function (__dict_Monoid_178) {
        return function (__dict_Plus_179) {
            return new Control_Plus.Plus(function () {
                return altWriterT(__dict_Monoid_178)(__dict_Plus_179["__superclass_Control.Alt.Alt_0"]());
            }, Control_Plus.empty(__dict_Plus_179));
        };
    };
    var alternativeWriterT = function (__dict_Monoid_194) {
        return function (__dict_Alternative_195) {
            return new Control_Alternative.Alternative(function () {
                return plusWriterT(__dict_Monoid_194)(__dict_Alternative_195["__superclass_Control.Plus.Plus_1"]());
            }, function () {
                return applicativeWriterT(__dict_Monoid_194)(__dict_Alternative_195["__superclass_Prelude.Applicative_0"]());
            });
        };
    };
    var monadPlusWriterT = function (__dict_Monoid_184) {
        return function (__dict_MonadPlus_185) {
            return new Control_MonadPlus.MonadPlus(function () {
                return alternativeWriterT(__dict_Monoid_184)(__dict_MonadPlus_185["__superclass_Control.Alternative.Alternative_1"]());
            }, function () {
                return monadWriterT(__dict_Monoid_184)(__dict_MonadPlus_185["__superclass_Prelude.Monad_0"]());
            });
        };
    };
    return {
        WriterT: WriterT, 
        liftCallCCWriter: liftCallCCWriter, 
        liftCatchWriter: liftCatchWriter, 
        mapWriterT: mapWriterT, 
        runWriterT: runWriterT, 
        functorWriterT: functorWriterT, 
        applyWriterT: applyWriterT, 
        applicativeWriterT: applicativeWriterT, 
        altWriterT: altWriterT, 
        plusWriterT: plusWriterT, 
        alternativeWriterT: alternativeWriterT, 
        bindWriterT: bindWriterT, 
        monadWriterT: monadWriterT, 
        monadPlusWriterT: monadPlusWriterT, 
        monadTransWriterT: monadTransWriterT
    };
})();
var PS = PS || {};
PS.Control_Monad_Cont_Class = (function () {
    "use strict";
    var Prelude = PS.Prelude;
    var Control_Monad_Cont_Trans = PS.Control_Monad_Cont_Trans;
    var Control_Monad_Error_Trans = PS.Control_Monad_Error_Trans;
    var Control_Monad_Maybe_Trans = PS.Control_Monad_Maybe_Trans;
    var Control_Monad_Reader_Trans = PS.Control_Monad_Reader_Trans;
    var Control_Monad_State_Trans = PS.Control_Monad_State_Trans;
    var Control_Monad_Writer_Trans = PS.Control_Monad_Writer_Trans;
    function MonadCont(callCC) {
        this.callCC = callCC;
    };
    var monadContContT = function (__dict_Monad_198) {
        return new MonadCont(Control_Monad_Cont_Trans.callCC);
    };
    var callCC = function (dict) {
        return dict.callCC;
    };
    var monadContErrorT = function (__dict_Error_199) {
        return function (__dict_MonadCont_200) {
            return new MonadCont(Control_Monad_Error_Trans.liftCallCCError(callCC(__dict_MonadCont_200)));
        };
    };
    var monadContMaybeT = function (__dict_MonadCont_201) {
        return new MonadCont(Control_Monad_Maybe_Trans.liftCallCCMaybe(callCC(__dict_MonadCont_201)));
    };
    var monadContReaderT = function (__dict_MonadCont_202) {
        return new MonadCont(Control_Monad_Reader_Trans.liftCallCCReader(callCC(__dict_MonadCont_202)));
    };
    var monadContStateT = function (__dict_MonadCont_203) {
        return new MonadCont(Control_Monad_State_Trans["liftCallCCState'"](callCC(__dict_MonadCont_203)));
    };
    var monadWriterT = function (__dict_Monoid_204) {
        return function (__dict_MonadCont_205) {
            return new MonadCont(Control_Monad_Writer_Trans.liftCallCCWriter(__dict_Monoid_204)(callCC(__dict_MonadCont_205)));
        };
    };
    return {
        MonadCont: MonadCont, 
        callCC: callCC, 
        monadContContT: monadContContT, 
        monadContErrorT: monadContErrorT, 
        monadContMaybeT: monadContMaybeT, 
        monadContReaderT: monadContReaderT, 
        monadContStateT: monadContStateT, 
        monadWriterT: monadWriterT
    };
})();
var PS = PS || {};
PS.Control_Monad_Error_Class = (function () {
    "use strict";
    var Prelude = PS.Prelude;
    var Control_Monad_Error_Trans = PS.Control_Monad_Error_Trans;
    var Data_Either = PS.Data_Either;
    var Control_Monad_Trans = PS.Control_Monad_Trans;
    var Control_Monad_Maybe_Trans = PS.Control_Monad_Maybe_Trans;
    var Control_Monad_Reader_Trans = PS.Control_Monad_Reader_Trans;
    var Control_Monad_State_Trans = PS.Control_Monad_State_Trans;
    var Control_Monad_Writer_Trans = PS.Control_Monad_Writer_Trans;
    function MonadError(catchError, throwError) {
        this.catchError = catchError;
        this.throwError = throwError;
    };
    var throwError = function (dict) {
        return dict.throwError;
    };
    var monadErrorErrorT = function (__dict_Monad_206) {
        return function (__dict_Error_207) {
            return new MonadError(function (m) {
                return function (h) {
                    return Control_Monad_Error_Trans.ErrorT.create(Prelude[">>="](__dict_Monad_206["__superclass_Prelude.Bind_1"]())(Control_Monad_Error_Trans.runErrorT(m))(function (_38) {
                        if (_38 instanceof Data_Either.Left) {
                            return Control_Monad_Error_Trans.runErrorT(h(_38.value0));
                        };
                        if (_38 instanceof Data_Either.Right) {
                            return Prelude["return"](__dict_Monad_206)(new Data_Either.Right(_38.value0));
                        };
                        throw new Error("Failed pattern match");
                    }));
                };
            }, function (e) {
                return Control_Monad_Error_Trans.ErrorT.create(Prelude["return"](__dict_Monad_206)(new Data_Either.Left(e)));
            });
        };
    };
    var monadErrorError = function (__dict_Error_208) {
        return new MonadError(function (_310) {
            return function (_311) {
                if (_310 instanceof Data_Either.Left) {
                    return _311(_310.value0);
                };
                if (_310 instanceof Data_Either.Right) {
                    return new Data_Either.Right(_310.value0);
                };
                throw new Error("Failed pattern match");
            };
        }, Data_Either.Left.create);
    };
    var catchError = function (dict) {
        return dict.catchError;
    };
    var monadErrorMaybeT = function (__dict_Monad_209) {
        return function (__dict_MonadError_210) {
            return new MonadError(Control_Monad_Maybe_Trans.liftCatchMaybe(catchError(__dict_MonadError_210)), function (e) {
                return Control_Monad_Trans.lift(Control_Monad_Maybe_Trans.monadTransMaybeT())(__dict_Monad_209)(throwError(__dict_MonadError_210)(e));
            });
        };
    };
    var monadErrorReaderT = function (__dict_Monad_211) {
        return function (__dict_MonadError_212) {
            return new MonadError(Control_Monad_Reader_Trans.liftCatchReader(catchError(__dict_MonadError_212)), function (e) {
                return Control_Monad_Trans.lift(Control_Monad_Reader_Trans.monadTransReaderT())(__dict_Monad_211)(throwError(__dict_MonadError_212)(e));
            });
        };
    };
    var monadErrorStateT = function (__dict_Monad_213) {
        return function (__dict_MonadError_214) {
            return new MonadError(Control_Monad_State_Trans.liftCatchState(catchError(__dict_MonadError_214)), function (e) {
                return Control_Monad_Trans.lift(Control_Monad_State_Trans.monadTransStateT())(__dict_Monad_213)(throwError(__dict_MonadError_214)(e));
            });
        };
    };
    var monadErrorWriterT = function (__dict_Monad_215) {
        return function (__dict_Monoid_216) {
            return function (__dict_MonadError_217) {
                return new MonadError(Control_Monad_Writer_Trans.liftCatchWriter(catchError(__dict_MonadError_217)), function (e) {
                    return Control_Monad_Trans.lift(Control_Monad_Writer_Trans.monadTransWriterT(__dict_Monoid_216))(__dict_Monad_215)(throwError(__dict_MonadError_217)(e));
                });
            };
        };
    };
    return {
        MonadError: MonadError, 
        catchError: catchError, 
        throwError: throwError, 
        monadErrorError: monadErrorError, 
        monadErrorErrorT: monadErrorErrorT, 
        monadErrorMaybeT: monadErrorMaybeT, 
        monadErrorReaderT: monadErrorReaderT, 
        monadErrorWriterT: monadErrorWriterT, 
        monadErrorStateT: monadErrorStateT
    };
})();
var PS = PS || {};
PS.Control_Monad_Reader_Class = (function () {
    "use strict";
    var Prelude = PS.Prelude;
    var Control_Monad_Reader_Trans = PS.Control_Monad_Reader_Trans;
    var Control_Monad_RWS = PS.Control_Monad_RWS;
    var Control_Monad_Trans = PS.Control_Monad_Trans;
    var Control_Monad_Error_Trans = PS.Control_Monad_Error_Trans;
    var Control_Monad_Maybe_Trans = PS.Control_Monad_Maybe_Trans;
    var Control_Monad_State_Trans = PS.Control_Monad_State_Trans;
    var Control_Monad_Writer_Trans = PS.Control_Monad_Writer_Trans;
    function MonadReader(ask, local) {
        this.ask = ask;
        this.local = local;
    };
    var monadReaderReaderT = function (__dict_Monad_218) {
        return new MonadReader(Prelude["return"](__dict_Monad_218), Control_Monad_Reader_Trans.withReaderT);
    };
    var monadReaderRWST = function (__dict_Monad_219) {
        return function (__dict_Monoid_220) {
            return new MonadReader(Control_Monad_RWS.ask(__dict_Monad_219["__superclass_Prelude.Applicative_0"]())(__dict_Monoid_220), Control_Monad_RWS.local);
        };
    };
    var monadReaderFun = function () {
        return new MonadReader(Prelude.id(Prelude.categoryArr()), Prelude[">>>"](Prelude.semigroupoidArr()));
    };
    var local = function (dict) {
        return dict.local;
    };
    var ask = function (dict) {
        return dict.ask;
    };
    var monadReaderErrorT = function (__dict_Monad_221) {
        return function (__dict_Error_222) {
            return function (__dict_MonadReader_223) {
                return new MonadReader(Control_Monad_Trans.lift(Control_Monad_Error_Trans.monadTransErrorT(__dict_Error_222))(__dict_Monad_221)(ask(__dict_MonadReader_223)), function (f) {
                    return Control_Monad_Error_Trans.mapErrorT(local(__dict_MonadReader_223)(f));
                });
            };
        };
    };
    var monadReaderMaybeT = function (__dict_Monad_224) {
        return function (__dict_MonadReader_225) {
            return new MonadReader(Control_Monad_Trans.lift(Control_Monad_Maybe_Trans.monadTransMaybeT())(__dict_Monad_224)(ask(__dict_MonadReader_225)), function (f) {
                return Control_Monad_Maybe_Trans.mapMaybeT(local(__dict_MonadReader_225)(f));
            });
        };
    };
    var monadReaderStateT = function (__dict_Monad_226) {
        return function (__dict_MonadReader_227) {
            return new MonadReader(Control_Monad_Trans.lift(Control_Monad_State_Trans.monadTransStateT())(__dict_Monad_226)(ask(__dict_MonadReader_227)), function (f) {
                return Control_Monad_State_Trans.mapStateT(local(__dict_MonadReader_227)(f));
            });
        };
    };
    var monadReaderWriterT = function (__dict_Monad_228) {
        return function (__dict_Monoid_229) {
            return function (__dict_MonadReader_230) {
                return new MonadReader(Control_Monad_Trans.lift(Control_Monad_Writer_Trans.monadTransWriterT(__dict_Monoid_229))(__dict_Monad_228)(ask(__dict_MonadReader_230)), function (f) {
                    return Control_Monad_Writer_Trans.mapWriterT(local(__dict_MonadReader_230)(f));
                });
            };
        };
    };
    var reader = function (__dict_Monad_231) {
        return function (__dict_MonadReader_232) {
            return function (f) {
                return Prelude[">>="](__dict_Monad_231["__superclass_Prelude.Bind_1"]())(ask(__dict_MonadReader_232))(Prelude["<<<"](Prelude.semigroupoidArr())(Prelude["return"](__dict_Monad_231))(f));
            };
        };
    };
    return {
        MonadReader: MonadReader, 
        reader: reader, 
        local: local, 
        ask: ask, 
        monadReaderFun: monadReaderFun, 
        monadReaderReaderT: monadReaderReaderT, 
        monadReaderErrorT: monadReaderErrorT, 
        monadReaderMaybeT: monadReaderMaybeT, 
        monadReaderWriterT: monadReaderWriterT, 
        monadReaderStateT: monadReaderStateT, 
        monadReaderRWST: monadReaderRWST
    };
})();
var PS = PS || {};
PS.Control_Monad_State_Class = (function () {
    "use strict";
    var Prelude = PS.Prelude;
    var Data_Tuple = PS.Data_Tuple;
    var Control_Monad_Trans = PS.Control_Monad_Trans;
    var Control_Monad_Writer_Trans = PS.Control_Monad_Writer_Trans;
    var Control_Monad_State_Trans = PS.Control_Monad_State_Trans;
    var Control_Monad_Reader_Trans = PS.Control_Monad_Reader_Trans;
    var Control_Monad_RWS = PS.Control_Monad_RWS;
    var Control_Monad_Maybe_Trans = PS.Control_Monad_Maybe_Trans;
    var Control_Monad_Error_Trans = PS.Control_Monad_Error_Trans;
    function MonadState(state) {
        this.state = state;
    };
    var state = function (dict) {
        return dict.state;
    };
    var put = function (__dict_Monad_233) {
        return function (__dict_MonadState_234) {
            return function (s) {
                return state(__dict_MonadState_234)(function (_) {
                    return new Data_Tuple.Tuple(Prelude.unit, s);
                });
            };
        };
    };
    var monadStateWriterT = function (__dict_Monad_235) {
        return function (__dict_Monoid_236) {
            return function (__dict_MonadState_237) {
                return new MonadState(function (f) {
                    return Control_Monad_Trans.lift(Control_Monad_Writer_Trans.monadTransWriterT(__dict_Monoid_236))(__dict_Monad_235)(state(__dict_MonadState_237)(f));
                });
            };
        };
    };
    var monadStateStateT1 = function (__dict_Monad_238) {
        return function (__dict_MonadState_239) {
            return new MonadState(function (f) {
                return Control_Monad_Trans.lift(Control_Monad_State_Trans.monadTransStateT())(__dict_Monad_238)(state(__dict_MonadState_239)(f));
            });
        };
    };
    var monadStateStateT = function (__dict_Monad_240) {
        return new MonadState(function (f) {
            return Control_Monad_State_Trans.StateT.create(Prelude["<<<"](Prelude.semigroupoidArr())(Prelude["return"](__dict_Monad_240))(f));
        });
    };
    var monadStateReaderT = function (__dict_Monad_241) {
        return function (__dict_MonadState_242) {
            return new MonadState(function (f) {
                return Control_Monad_Trans.lift(Control_Monad_Reader_Trans.monadTransReaderT())(__dict_Monad_241)(state(__dict_MonadState_242)(f));
            });
        };
    };
    var monadStateRWST = function (__dict_Monad_243) {
        return function (__dict_Monoid_244) {
            return new MonadState(Control_Monad_RWS.state(__dict_Monad_243["__superclass_Prelude.Applicative_0"]())(__dict_Monoid_244));
        };
    };
    var monadStateMaybeT = function (__dict_Monad_245) {
        return function (__dict_MonadState_246) {
            return new MonadState(function (f) {
                return Control_Monad_Trans.lift(Control_Monad_Maybe_Trans.monadTransMaybeT())(__dict_Monad_245)(state(__dict_MonadState_246)(f));
            });
        };
    };
    var monadStateErrorT = function (__dict_Monad_247) {
        return function (__dict_Error_248) {
            return function (__dict_MonadState_249) {
                return new MonadState(function (f) {
                    return Control_Monad_Trans.lift(Control_Monad_Error_Trans.monadTransErrorT(__dict_Error_248))(__dict_Monad_247)(state(__dict_MonadState_249)(f));
                });
            };
        };
    };
    var modify = function (__dict_Monad_250) {
        return function (__dict_MonadState_251) {
            return function (f) {
                return state(__dict_MonadState_251)(function (s) {
                    return new Data_Tuple.Tuple(Prelude.unit, f(s));
                });
            };
        };
    };
    var gets = function (__dict_Monad_252) {
        return function (__dict_MonadState_253) {
            return function (f) {
                return state(__dict_MonadState_253)(function (s) {
                    return new Data_Tuple.Tuple(f(s), s);
                });
            };
        };
    };
    var get = function (__dict_Monad_254) {
        return function (__dict_MonadState_255) {
            return state(__dict_MonadState_255)(function (s) {
                return new Data_Tuple.Tuple(s, s);
            });
        };
    };
    return {
        MonadState: MonadState, 
        modify: modify, 
        put: put, 
        gets: gets, 
        get: get, 
        state: state, 
        monadStateStateT: monadStateStateT, 
        monadStateStateT1: monadStateStateT1, 
        monadStateErrorT: monadStateErrorT, 
        monadStateMaybeT: monadStateMaybeT, 
        monadStateReaderT: monadStateReaderT, 
        monadStateWriterT: monadStateWriterT, 
        monadStateRWST: monadStateRWST
    };
})();
var PS = PS || {};
PS.Control_Monad_Writer = (function () {
    "use strict";
    var Prelude = PS.Prelude;
    var Control_Monad_Identity = PS.Control_Monad_Identity;
    var Control_Monad_Writer_Trans = PS.Control_Monad_Writer_Trans;
    var Data_Tuple = PS.Data_Tuple;
    var runWriter = Prelude["<<<"](Prelude.semigroupoidArr())(Control_Monad_Identity.runIdentity)(Control_Monad_Writer_Trans.runWriterT);
    var mapWriter = function (f) {
        return Control_Monad_Writer_Trans.mapWriterT(Prelude["<<<"](Prelude.semigroupoidArr())(Control_Monad_Identity.Identity.create)(Prelude["<<<"](Prelude.semigroupoidArr())(f)(Control_Monad_Identity.runIdentity)));
    };
    var execWriter = function (m) {
        return Data_Tuple.snd(runWriter(m));
    };
    return {
        mapWriter: mapWriter, 
        execWriter: execWriter, 
        runWriter: runWriter
    };
})();
var PS = PS || {};
PS.Control_Monad_Writer_Class = (function () {
    "use strict";
    var Prelude = PS.Prelude;
    var Data_Tuple = PS.Data_Tuple;
    var Control_Monad_Writer_Trans = PS.Control_Monad_Writer_Trans;
    var Control_Monad_RWS = PS.Control_Monad_RWS;
    var Control_Monad_Trans = PS.Control_Monad_Trans;
    var Control_Monad_Error_Trans = PS.Control_Monad_Error_Trans;
    var Control_Monad_Maybe_Trans = PS.Control_Monad_Maybe_Trans;
    var Control_Monad_Reader_Trans = PS.Control_Monad_Reader_Trans;
    var Control_Monad_State_Trans = PS.Control_Monad_State_Trans;
    function MonadWriter(listen, pass, writer) {
        this.listen = listen;
        this.pass = pass;
        this.writer = writer;
    };
    var writer = function (dict) {
        return dict.writer;
    };
    var tell = function (__dict_Monoid_256) {
        return function (__dict_Monad_257) {
            return function (__dict_MonadWriter_258) {
                return function (w) {
                    return writer(__dict_MonadWriter_258)(new Data_Tuple.Tuple(Prelude.unit, w));
                };
            };
        };
    };
    var pass = function (dict) {
        return dict.pass;
    };
    var monadWriterWriterT = function (__dict_Monoid_259) {
        return function (__dict_Monad_260) {
            return new MonadWriter(function (m) {
                return Control_Monad_Writer_Trans.WriterT.create(Prelude[">>="](__dict_Monad_260["__superclass_Prelude.Bind_1"]())(Control_Monad_Writer_Trans.runWriterT(m))(function (_41) {
                    return Prelude["return"](__dict_Monad_260)(new Data_Tuple.Tuple(new Data_Tuple.Tuple(_41.value0, _41.value1), _41.value1));
                }));
            }, function (m) {
                return Control_Monad_Writer_Trans.WriterT.create(Prelude[">>="](__dict_Monad_260["__superclass_Prelude.Bind_1"]())(Control_Monad_Writer_Trans.runWriterT(m))(function (_42) {
                    return Prelude["return"](__dict_Monad_260)(new Data_Tuple.Tuple(_42.value0.value0, _42.value0.value1(_42.value1)));
                }));
            }, Prelude["<<<"](Prelude.semigroupoidArr())(Control_Monad_Writer_Trans.WriterT.create)(Prelude["return"](__dict_Monad_260)));
        };
    };
    var monadWriterRWST = function (__dict_Monad_261) {
        return function (__dict_Monoid_262) {
            return new MonadWriter(Control_Monad_RWS.listen(__dict_Monad_261), Control_Monad_RWS.pass(__dict_Monad_261), Control_Monad_RWS.writer(__dict_Monad_261["__superclass_Prelude.Applicative_0"]()));
        };
    };
    var listen = function (dict) {
        return dict.listen;
    };
    var listens = function (__dict_Monoid_263) {
        return function (__dict_Monad_264) {
            return function (__dict_MonadWriter_265) {
                return function (f) {
                    return function (m) {
                        return Prelude[">>="](__dict_Monad_264["__superclass_Prelude.Bind_1"]())(listen(__dict_MonadWriter_265)(m))(function (_39) {
                            return Prelude["return"](__dict_Monad_264)(new Data_Tuple.Tuple(_39.value0, f(_39.value1)));
                        });
                    };
                };
            };
        };
    };
    var monadWriterErrorT = function (__dict_Monad_266) {
        return function (__dict_Error_267) {
            return function (__dict_MonadWriter_268) {
                return new MonadWriter(Control_Monad_Error_Trans.liftListenError(__dict_Monad_266)(listen(__dict_MonadWriter_268)), Control_Monad_Error_Trans.liftPassError(__dict_Monad_266)(pass(__dict_MonadWriter_268)), function (wd) {
                    return Control_Monad_Trans.lift(Control_Monad_Error_Trans.monadTransErrorT(__dict_Error_267))(__dict_Monad_266)(writer(__dict_MonadWriter_268)(wd));
                });
            };
        };
    };
    var monadWriterMaybeT = function (__dict_Monad_269) {
        return function (__dict_MonadWriter_270) {
            return new MonadWriter(Control_Monad_Maybe_Trans.liftListenMaybe(__dict_Monad_269)(listen(__dict_MonadWriter_270)), Control_Monad_Maybe_Trans.liftPassMaybe(__dict_Monad_269)(pass(__dict_MonadWriter_270)), function (wd) {
                return Control_Monad_Trans.lift(Control_Monad_Maybe_Trans.monadTransMaybeT())(__dict_Monad_269)(writer(__dict_MonadWriter_270)(wd));
            });
        };
    };
    var monadWriterReaderT = function (__dict_Monad_271) {
        return function (__dict_MonadWriter_272) {
            return new MonadWriter(Control_Monad_Reader_Trans.mapReaderT(listen(__dict_MonadWriter_272)), Control_Monad_Reader_Trans.mapReaderT(pass(__dict_MonadWriter_272)), function (wd) {
                return Control_Monad_Trans.lift(Control_Monad_Reader_Trans.monadTransReaderT())(__dict_Monad_271)(writer(__dict_MonadWriter_272)(wd));
            });
        };
    };
    var monadWriterStateT = function (__dict_Monad_273) {
        return function (__dict_MonadWriter_274) {
            return new MonadWriter(Control_Monad_State_Trans.liftListenState(__dict_Monad_273)(listen(__dict_MonadWriter_274)), Control_Monad_State_Trans.liftPassState(__dict_Monad_273)(pass(__dict_MonadWriter_274)), function (wd) {
                return Control_Monad_Trans.lift(Control_Monad_State_Trans.monadTransStateT())(__dict_Monad_273)(writer(__dict_MonadWriter_274)(wd));
            });
        };
    };
    var censor = function (__dict_Monoid_275) {
        return function (__dict_Monad_276) {
            return function (__dict_MonadWriter_277) {
                return function (f) {
                    return function (m) {
                        return pass(__dict_MonadWriter_277)(Prelude[">>="](__dict_Monad_276["__superclass_Prelude.Bind_1"]())(m)(function (_40) {
                            return Prelude["return"](__dict_Monad_276)(new Data_Tuple.Tuple(_40, f));
                        }));
                    };
                };
            };
        };
    };
    return {
        MonadWriter: MonadWriter, 
        censor: censor, 
        listens: listens, 
        tell: tell, 
        pass: pass, 
        listen: listen, 
        writer: writer, 
        monadWriterWriterT: monadWriterWriterT, 
        monadWriterErrorT: monadWriterErrorT, 
        monadWriterMaybeT: monadWriterMaybeT, 
        monadWriterStateT: monadWriterStateT, 
        monadWriterReaderT: monadWriterReaderT, 
        monadWriterRWST: monadWriterRWST
    };
})();
var PS = PS || {};
PS.Control_Monad_RWS_Class = (function () {
    "use strict";
    var Prelude = PS.Prelude;
    var Control_Monad_RWS_Trans = PS.Control_Monad_RWS_Trans;
    var Control_Monad_Reader_Class = PS.Control_Monad_Reader_Class;
    var Control_Monad_Writer_Class = PS.Control_Monad_Writer_Class;
    var Control_Monad_State_Class = PS.Control_Monad_State_Class;
    var Control_Monad_Maybe_Trans = PS.Control_Monad_Maybe_Trans;
    var Control_Monad_Error_Trans = PS.Control_Monad_Error_Trans;
    function MonadRWS(__superclass_Control$dotMonad$dotReader$dotClass$dotMonadReader_2, __superclass_Control$dotMonad$dotState$dotClass$dotMonadState_4, __superclass_Control$dotMonad$dotWriter$dotClass$dotMonadWriter_3, __superclass_Data$dotMonoid$dotMonoid_1, __superclass_Prelude$dotMonad_0) {
        this["__superclass_Control.Monad.Reader.Class.MonadReader_2"] = __superclass_Control$dotMonad$dotReader$dotClass$dotMonadReader_2;
        this["__superclass_Control.Monad.State.Class.MonadState_4"] = __superclass_Control$dotMonad$dotState$dotClass$dotMonadState_4;
        this["__superclass_Control.Monad.Writer.Class.MonadWriter_3"] = __superclass_Control$dotMonad$dotWriter$dotClass$dotMonadWriter_3;
        this["__superclass_Data.Monoid.Monoid_1"] = __superclass_Data$dotMonoid$dotMonoid_1;
        this["__superclass_Prelude.Monad_0"] = __superclass_Prelude$dotMonad_0;
    };
    var monadRWSRWST = function (__dict_Monad_278) {
        return function (__dict_Monoid_279) {
            return new MonadRWS(function () {
                return Control_Monad_Reader_Class.monadReaderRWST(__dict_Monad_278)(__dict_Monoid_279);
            }, function () {
                return Control_Monad_State_Class.monadStateRWST(__dict_Monad_278)(__dict_Monoid_279);
            }, function () {
                return Control_Monad_Writer_Class.monadWriterRWST(__dict_Monad_278)(__dict_Monoid_279);
            }, function () {
                return __dict_Monoid_279;
            }, function () {
                return Control_Monad_RWS_Trans.monadRWST(__dict_Monad_278)(__dict_Monoid_279);
            });
        };
    };
    var monadRWSMaybeT = function (__dict_Monad_280) {
        return function (__dict_Monoid_281) {
            return function (__dict_MonadRWS_282) {
                return function (__dict_MonadReader_283) {
                    return function (__dict_MonadWriter_284) {
                        return function (__dict_MonadState_285) {
                            return new MonadRWS(function () {
                                return Control_Monad_Reader_Class.monadReaderMaybeT(__dict_Monad_280)(__dict_MonadReader_283);
                            }, function () {
                                return Control_Monad_State_Class.monadStateMaybeT(__dict_Monad_280)(__dict_MonadState_285);
                            }, function () {
                                return Control_Monad_Writer_Class.monadWriterMaybeT(__dict_Monad_280)(__dict_MonadWriter_284);
                            }, function () {
                                return __dict_Monoid_281;
                            }, function () {
                                return Control_Monad_Maybe_Trans.monadMaybeT(__dict_Monad_280);
                            });
                        };
                    };
                };
            };
        };
    };
    var monadRWSErrorT = function (__dict_Monad_286) {
        return function (__dict_Monoid_287) {
            return function (__dict_MonadRWS_288) {
                return function (__dict_MonadReader_289) {
                    return function (__dict_MonadWriter_290) {
                        return function (__dict_MonadState_291) {
                            return function (__dict_Error_292) {
                                return new MonadRWS(function () {
                                    return Control_Monad_Reader_Class.monadReaderErrorT(__dict_Monad_286)(__dict_Error_292)(__dict_MonadReader_289);
                                }, function () {
                                    return Control_Monad_State_Class.monadStateErrorT(__dict_Monad_286)(__dict_Error_292)(__dict_MonadState_291);
                                }, function () {
                                    return Control_Monad_Writer_Class.monadWriterErrorT(__dict_Monad_286)(__dict_Error_292)(__dict_MonadWriter_290);
                                }, function () {
                                    return __dict_Monoid_287;
                                }, function () {
                                    return Control_Monad_Error_Trans.monadErrorT(__dict_Monad_286)(__dict_Error_292);
                                });
                            };
                        };
                    };
                };
            };
        };
    };
    return {
        MonadRWS: MonadRWS, 
        monadRWSRWST: monadRWSRWST, 
        monadRWSErrorT: monadRWSErrorT, 
        monadRWSMaybeT: monadRWSMaybeT
    };
})();
var PS = PS || {};
PS.Data_Monoid_First = (function () {
    "use strict";
    var Prelude = PS.Prelude;
    var Data_Maybe = PS.Data_Maybe;
    var Data_Monoid = PS.Data_Monoid;
    var First = {
        create: function (value) {
            return value;
        }
    };
    var showFirst = function (__dict_Show_293) {
        return new Prelude.Show(function (_319) {
            return "First (" + (Prelude.show(Data_Maybe.showMaybe(__dict_Show_293))(_319) + ")");
        });
    };
    var semigroupFirst = function () {
        return new Prelude.Semigroup(function (_320) {
            return function (_321) {
                if (_320 instanceof Data_Maybe.Just) {
                    return _320;
                };
                return _321;
            };
        });
    };
    var runFirst = function (_312) {
        return _312;
    };
    var monoidFirst = function () {
        return new Data_Monoid.Monoid(semigroupFirst, Data_Maybe.Nothing.value);
    };
    var eqFirst = function (__dict_Eq_295) {
        return new Prelude.Eq(function (_315) {
            return function (_316) {
                return Prelude["/="](Data_Maybe.eqMaybe(__dict_Eq_295))(_315)(_316);
            };
        }, function (_313) {
            return function (_314) {
                return Prelude["=="](Data_Maybe.eqMaybe(__dict_Eq_295))(_313)(_314);
            };
        });
    };
    var ordFirst = function (__dict_Ord_294) {
        return new Prelude.Ord(function () {
            return eqFirst(__dict_Ord_294["__superclass_Prelude.Eq_0"]());
        }, function (_317) {
            return function (_318) {
                return Prelude.compare(Data_Maybe.ordMaybe(__dict_Ord_294))(_317)(_318);
            };
        });
    };
    return {
        First: First, 
        runFirst: runFirst, 
        eqFirst: eqFirst, 
        ordFirst: ordFirst, 
        showFirst: showFirst, 
        semigroupFirst: semigroupFirst, 
        monoidFirst: monoidFirst
    };
})();
var PS = PS || {};
PS.Data_Foldable = (function () {
    "use strict";
    var Prelude = PS.Prelude;
    var Control_Apply = PS.Control_Apply;
    var Data_Monoid = PS.Data_Monoid;
    var Data_Tuple = PS.Data_Tuple;
    var Data_Eq = PS.Data_Eq;
    var Data_Maybe = PS.Data_Maybe;
    var Data_Either = PS.Data_Either;
    var Data_Monoid_First = PS.Data_Monoid_First;
    function Foldable(foldMap, foldl, foldr) {
        this.foldMap = foldMap;
        this.foldl = foldl;
        this.foldr = foldr;
    };
    function foldrArray(f) {  return function(z) {    return function(xs) {      var acc = z;      for (var i = xs.length - 1; i >= 0; --i) {        acc = f(xs[i])(acc);      }      return acc;    }  }};
    function foldlArray(f) {  return function(z) {    return function(xs) {      var acc = z;      for (var i = 0, len = xs.length; i < len; ++i) {        acc = f(acc)(xs[i]);      }      return acc;    }  }};
    var foldr = function (dict) {
        return dict.foldr;
    };
    var traverse_ = function (__dict_Applicative_296) {
        return function (__dict_Foldable_297) {
            return function (f) {
                return foldr(__dict_Foldable_297)(Prelude["<<<"](Prelude.semigroupoidArr())(Control_Apply["*>"](__dict_Applicative_296["__superclass_Prelude.Apply_0"]()))(f))(Prelude.pure(__dict_Applicative_296)(Prelude.unit));
            };
        };
    };
    var for_ = function (__dict_Applicative_298) {
        return function (__dict_Foldable_299) {
            return Prelude.flip(traverse_(__dict_Applicative_298)(__dict_Foldable_299));
        };
    };
    var sequence_ = function (__dict_Applicative_300) {
        return function (__dict_Foldable_301) {
            return traverse_(__dict_Applicative_300)(__dict_Foldable_301)(Prelude.id(Prelude.categoryArr()));
        };
    };
    var foldl = function (dict) {
        return dict.foldl;
    };
    var mconcat = function (__dict_Foldable_302) {
        return function (__dict_Monoid_303) {
            return foldl(__dict_Foldable_302)(Prelude["<>"](__dict_Monoid_303["__superclass_Prelude.Semigroup_0"]()))(Data_Monoid.mempty(__dict_Monoid_303));
        };
    };
    var or = function (__dict_Foldable_304) {
        return foldl(__dict_Foldable_304)(Prelude["||"](Prelude.boolLikeBoolean()))(false);
    };
    var product = function (__dict_Foldable_305) {
        return foldl(__dict_Foldable_305)(Prelude["*"](Prelude.numNumber()))(1);
    };
    var sum = function (__dict_Foldable_306) {
        return foldl(__dict_Foldable_306)(Prelude["+"](Prelude.numNumber()))(0);
    };
    var foldableTuple = function () {
        return new Foldable(function (__dict_Monoid_307) {
            return function (_353) {
                return function (_354) {
                    return _353(_354.value1);
                };
            };
        }, function (_350) {
            return function (_351) {
                return function (_352) {
                    return _350(_351)(_352.value1);
                };
            };
        }, function (_347) {
            return function (_348) {
                return function (_349) {
                    return _347(_349.value1)(_348);
                };
            };
        });
    };
    var foldableRef = function () {
        return new Foldable(function (__dict_Monoid_308) {
            return function (_345) {
                return function (_346) {
                    return _345(_346);
                };
            };
        }, function (_342) {
            return function (_343) {
                return function (_344) {
                    return _342(_343)(_344);
                };
            };
        }, function (_339) {
            return function (_340) {
                return function (_341) {
                    return _339(_341)(_340);
                };
            };
        });
    };
    var foldableMaybe = function () {
        return new Foldable(function (__dict_Monoid_309) {
            return function (_337) {
                return function (_338) {
                    if (_338 instanceof Data_Maybe.Nothing) {
                        return Data_Monoid.mempty(__dict_Monoid_309);
                    };
                    if (_338 instanceof Data_Maybe.Just) {
                        return _337(_338.value0);
                    };
                    throw new Error("Failed pattern match");
                };
            };
        }, function (_334) {
            return function (_335) {
                return function (_336) {
                    if (_336 instanceof Data_Maybe.Nothing) {
                        return _335;
                    };
                    if (_336 instanceof Data_Maybe.Just) {
                        return _334(_335)(_336.value0);
                    };
                    throw new Error("Failed pattern match");
                };
            };
        }, function (_331) {
            return function (_332) {
                return function (_333) {
                    if (_333 instanceof Data_Maybe.Nothing) {
                        return _332;
                    };
                    if (_333 instanceof Data_Maybe.Just) {
                        return _331(_333.value0)(_332);
                    };
                    throw new Error("Failed pattern match");
                };
            };
        });
    };
    var foldableEither = function () {
        return new Foldable(function (__dict_Monoid_310) {
            return function (_329) {
                return function (_330) {
                    if (_330 instanceof Data_Either.Left) {
                        return Data_Monoid.mempty(__dict_Monoid_310);
                    };
                    if (_330 instanceof Data_Either.Right) {
                        return _329(_330.value0);
                    };
                    throw new Error("Failed pattern match");
                };
            };
        }, function (_326) {
            return function (_327) {
                return function (_328) {
                    if (_328 instanceof Data_Either.Left) {
                        return _327;
                    };
                    if (_328 instanceof Data_Either.Right) {
                        return _326(_327)(_328.value0);
                    };
                    throw new Error("Failed pattern match");
                };
            };
        }, function (_323) {
            return function (_324) {
                return function (_325) {
                    if (_325 instanceof Data_Either.Left) {
                        return _324;
                    };
                    if (_325 instanceof Data_Either.Right) {
                        return _323(_325.value0)(_324);
                    };
                    throw new Error("Failed pattern match");
                };
            };
        });
    };
    var foldableArray = function () {
        return new Foldable(function (__dict_Monoid_311) {
            return function (f) {
                return function (xs) {
                    return foldr(foldableArray())(function (x) {
                        return function (acc) {
                            return Prelude["<>"](__dict_Monoid_311["__superclass_Prelude.Semigroup_0"]())(f(x))(acc);
                        };
                    })(Data_Monoid.mempty(__dict_Monoid_311))(xs);
                };
            };
        }, function (f) {
            return function (z) {
                return function (xs) {
                    return foldlArray(f)(z)(xs);
                };
            };
        }, function (f) {
            return function (z) {
                return function (xs) {
                    return foldrArray(f)(z)(xs);
                };
            };
        });
    };
    var foldMap = function (dict) {
        return dict.foldMap;
    };
    var lookup = function (__dict_Eq_312) {
        return function (__dict_Foldable_313) {
            return function (a) {
                return function (f) {
                    return Data_Monoid_First.runFirst(foldMap(__dict_Foldable_313)(Data_Monoid_First.monoidFirst())(function (_322) {
                        return Prelude["=="](__dict_Eq_312)(a)(_322.value0) ? new Data_Maybe.Just(_322.value1) : Data_Maybe.Nothing.value;
                    })(f));
                };
            };
        };
    };
    var fold = function (__dict_Foldable_314) {
        return function (__dict_Monoid_315) {
            return foldMap(__dict_Foldable_314)(__dict_Monoid_315)(Prelude.id(Prelude.categoryArr()));
        };
    };
    var find = function (__dict_Foldable_316) {
        return function (p) {
            return function (f) {
                var _1042 = foldMap(__dict_Foldable_316)(Data_Monoid.monoidArray())(function (x) {
                    return p(x) ? [ x ] : [  ];
                })(f);
                if (_1042.length >= 1) {
                    var _1044 = _1042.slice(1);
                    return new Data_Maybe.Just(_1042[0]);
                };
                if (_1042.length === 0) {
                    return Data_Maybe.Nothing.value;
                };
                throw new Error("Failed pattern match");
            };
        };
    };
    var any = function (__dict_Foldable_317) {
        return function (p) {
            return Prelude["<<<"](Prelude.semigroupoidArr())(or(foldableArray()))(foldMap(__dict_Foldable_317)(Data_Monoid.monoidArray())(function (x) {
                return [ p(x) ];
            }));
        };
    };
    var elem = function (__dict_Eq_318) {
        return function (__dict_Foldable_319) {
            return Prelude["<<<"](Prelude.semigroupoidArr())(any(__dict_Foldable_319))(Prelude["=="](__dict_Eq_318));
        };
    };
    var notElem = function (__dict_Eq_320) {
        return function (__dict_Foldable_321) {
            return function (x) {
                return Prelude["<<<"](Prelude.semigroupoidArr())(Prelude.not(Prelude.boolLikeBoolean()))(elem(__dict_Eq_320)(__dict_Foldable_321)(x));
            };
        };
    };
    var and = function (__dict_Foldable_322) {
        return foldl(__dict_Foldable_322)(Prelude["&&"](Prelude.boolLikeBoolean()))(true);
    };
    var all = function (__dict_Foldable_323) {
        return function (p) {
            return Prelude["<<<"](Prelude.semigroupoidArr())(and(foldableArray()))(foldMap(__dict_Foldable_323)(Data_Monoid.monoidArray())(function (x) {
                return [ p(x) ];
            }));
        };
    };
    return {
        Foldable: Foldable, 
        foldlArray: foldlArray, 
        foldrArray: foldrArray, 
        lookup: lookup, 
        find: find, 
        notElem: notElem, 
        elem: elem, 
        product: product, 
        sum: sum, 
        all: all, 
        any: any, 
        or: or, 
        and: and, 
        mconcat: mconcat, 
        sequence_: sequence_, 
        for_: for_, 
        traverse_: traverse_, 
        fold: fold, 
        foldMap: foldMap, 
        foldl: foldl, 
        foldr: foldr, 
        foldableArray: foldableArray, 
        foldableEither: foldableEither, 
        foldableMaybe: foldableMaybe, 
        foldableRef: foldableRef, 
        foldableTuple: foldableTuple
    };
})();
var PS = PS || {};
PS.Data_Map = (function () {
    "use strict";
    var Prelude = PS.Prelude;
    var Data_Array = PS.Data_Array;
    var Data_Tuple = PS.Data_Tuple;
    var Data_Maybe = PS.Data_Maybe;
    var Data_Foldable = PS.Data_Foldable;
    function Leaf() {

    };
    Leaf.value = new Leaf();
    function Two(value0, value1, value2, value3) {
        this.value0 = value0;
        this.value1 = value1;
        this.value2 = value2;
        this.value3 = value3;
    };
    Two.create = function (value0) {
        return function (value1) {
            return function (value2) {
                return function (value3) {
                    return new Two(value0, value1, value2, value3);
                };
            };
        };
    };
    function Three(value0, value1, value2, value3, value4, value5, value6) {
        this.value0 = value0;
        this.value1 = value1;
        this.value2 = value2;
        this.value3 = value3;
        this.value4 = value4;
        this.value5 = value5;
        this.value6 = value6;
    };
    Three.create = function (value0) {
        return function (value1) {
            return function (value2) {
                return function (value3) {
                    return function (value4) {
                        return function (value5) {
                            return function (value6) {
                                return new Three(value0, value1, value2, value3, value4, value5, value6);
                            };
                        };
                    };
                };
            };
        };
    };
    function TwoLeft(value0, value1, value2) {
        this.value0 = value0;
        this.value1 = value1;
        this.value2 = value2;
    };
    TwoLeft.create = function (value0) {
        return function (value1) {
            return function (value2) {
                return new TwoLeft(value0, value1, value2);
            };
        };
    };
    function TwoRight(value0, value1, value2) {
        this.value0 = value0;
        this.value1 = value1;
        this.value2 = value2;
    };
    TwoRight.create = function (value0) {
        return function (value1) {
            return function (value2) {
                return new TwoRight(value0, value1, value2);
            };
        };
    };
    function ThreeLeft(value0, value1, value2, value3, value4, value5) {
        this.value0 = value0;
        this.value1 = value1;
        this.value2 = value2;
        this.value3 = value3;
        this.value4 = value4;
        this.value5 = value5;
    };
    ThreeLeft.create = function (value0) {
        return function (value1) {
            return function (value2) {
                return function (value3) {
                    return function (value4) {
                        return function (value5) {
                            return new ThreeLeft(value0, value1, value2, value3, value4, value5);
                        };
                    };
                };
            };
        };
    };
    function ThreeMiddle(value0, value1, value2, value3, value4, value5) {
        this.value0 = value0;
        this.value1 = value1;
        this.value2 = value2;
        this.value3 = value3;
        this.value4 = value4;
        this.value5 = value5;
    };
    ThreeMiddle.create = function (value0) {
        return function (value1) {
            return function (value2) {
                return function (value3) {
                    return function (value4) {
                        return function (value5) {
                            return new ThreeMiddle(value0, value1, value2, value3, value4, value5);
                        };
                    };
                };
            };
        };
    };
    function ThreeRight(value0, value1, value2, value3, value4, value5) {
        this.value0 = value0;
        this.value1 = value1;
        this.value2 = value2;
        this.value3 = value3;
        this.value4 = value4;
        this.value5 = value5;
    };
    ThreeRight.create = function (value0) {
        return function (value1) {
            return function (value2) {
                return function (value3) {
                    return function (value4) {
                        return function (value5) {
                            return new ThreeRight(value0, value1, value2, value3, value4, value5);
                        };
                    };
                };
            };
        };
    };
    function KickUp(value0, value1, value2, value3) {
        this.value0 = value0;
        this.value1 = value1;
        this.value2 = value2;
        this.value3 = value3;
    };
    KickUp.create = function (value0) {
        return function (value1) {
            return function (value2) {
                return function (value3) {
                    return new KickUp(value0, value1, value2, value3);
                };
            };
        };
    };
    var values = function (_365) {
        if (_365 instanceof Leaf) {
            return [  ];
        };
        if (_365 instanceof Two) {
            return Prelude["++"](Data_Array.semigroupArray())(values(_365.value0))(Prelude["++"](Data_Array.semigroupArray())([ _365.value2 ])(values(_365.value3)));
        };
        if (_365 instanceof Three) {
            return Prelude["++"](Data_Array.semigroupArray())(values(_365.value0))(Prelude["++"](Data_Array.semigroupArray())([ _365.value2 ])(Prelude["++"](Data_Array.semigroupArray())(values(_365.value3))(Prelude["++"](Data_Array.semigroupArray())([ _365.value5 ])(values(_365.value6)))));
        };
        throw new Error("Failed pattern match");
    };
    var toList = function (_363) {
        if (_363 instanceof Leaf) {
            return [  ];
        };
        if (_363 instanceof Two) {
            return Prelude["++"](Data_Array.semigroupArray())(toList(_363.value0))(Prelude["++"](Data_Array.semigroupArray())([ new Data_Tuple.Tuple(_363.value1, _363.value2) ])(toList(_363.value3)));
        };
        if (_363 instanceof Three) {
            return Prelude["++"](Data_Array.semigroupArray())(toList(_363.value0))(Prelude["++"](Data_Array.semigroupArray())([ new Data_Tuple.Tuple(_363.value1, _363.value2) ])(Prelude["++"](Data_Array.semigroupArray())(toList(_363.value3))(Prelude["++"](Data_Array.semigroupArray())([ new Data_Tuple.Tuple(_363.value4, _363.value5) ])(toList(_363.value6)))));
        };
        throw new Error("Failed pattern match");
    };
    var singleton = function (k) {
        return function (v) {
            return new Two(Leaf.value, k, v, Leaf.value);
        };
    };
    var showTree = function (__dict_Show_324) {
        return function (__dict_Show_325) {
            return function (_357) {
                if (_357 instanceof Leaf) {
                    return "Leaf";
                };
                if (_357 instanceof Two) {
                    return "Two (" + (showTree(__dict_Show_324)(__dict_Show_325)(_357.value0) + (") (" + (Prelude.show(__dict_Show_324)(_357.value1) + (") (" + (Prelude.show(__dict_Show_325)(_357.value2) + (") (" + (showTree(__dict_Show_324)(__dict_Show_325)(_357.value3) + ")")))))));
                };
                if (_357 instanceof Three) {
                    return "Three (" + (showTree(__dict_Show_324)(__dict_Show_325)(_357.value0) + (") (" + (Prelude.show(__dict_Show_324)(_357.value1) + (") (" + (Prelude.show(__dict_Show_325)(_357.value2) + (") (" + (showTree(__dict_Show_324)(__dict_Show_325)(_357.value3) + (") (" + (Prelude.show(__dict_Show_324)(_357.value4) + (") (" + (Prelude.show(__dict_Show_325)(_357.value5) + (") (" + (showTree(__dict_Show_324)(__dict_Show_325)(_357.value6) + ")")))))))))))));
                };
                throw new Error("Failed pattern match");
            };
        };
    };
    var showMap = function (__dict_Show_326) {
        return function (__dict_Show_327) {
            return new Prelude.Show(function (m) {
                return "fromList " + Prelude.show(Prelude.showArray(Data_Tuple.showTuple(__dict_Show_326)(__dict_Show_327)))(toList(m));
            });
        };
    };
    var lookup = function (__copy___dict_Ord_328) {
        return function (__copy__359) {
            return function (__copy__360) {
                var __dict_Ord_328 = __copy___dict_Ord_328;
                var _359 = __copy__359;
                var _360 = __copy__360;
                tco: while (true) {
                    if (_360 instanceof Leaf) {
                        return Data_Maybe.Nothing.value;
                    };
                    if (_360 instanceof Two && Prelude["=="](__dict_Ord_328["__superclass_Prelude.Eq_0"]())(_359)(_360.value1)) {
                        return new Data_Maybe.Just(_360.value2);
                    };
                    if (_360 instanceof Two && Prelude["<"](__dict_Ord_328)(_359)(_360.value1)) {
                        var __tco___dict_Ord_328 = __dict_Ord_328;
                        var __tco__359 = _359;
                        var __tco__360 = _360.value0;
                        __dict_Ord_328 = __tco___dict_Ord_328;
                        _359 = __tco__359;
                        _360 = __tco__360;
                        continue tco;
                    };
                    if (_360 instanceof Two) {
                        var __tco___dict_Ord_328 = __dict_Ord_328;
                        var __tco__359 = _359;
                        var __tco__360 = _360.value3;
                        __dict_Ord_328 = __tco___dict_Ord_328;
                        _359 = __tco__359;
                        _360 = __tco__360;
                        continue tco;
                    };
                    if (_360 instanceof Three && Prelude["=="](__dict_Ord_328["__superclass_Prelude.Eq_0"]())(_359)(_360.value1)) {
                        return new Data_Maybe.Just(_360.value2);
                    };
                    if (_360 instanceof Three && Prelude["=="](__dict_Ord_328["__superclass_Prelude.Eq_0"]())(_359)(_360.value4)) {
                        return new Data_Maybe.Just(_360.value5);
                    };
                    if (_360 instanceof Three && Prelude["<"](__dict_Ord_328)(_359)(_360.value1)) {
                        var __tco___dict_Ord_328 = __dict_Ord_328;
                        var __tco__359 = _359;
                        var __tco__360 = _360.value0;
                        __dict_Ord_328 = __tco___dict_Ord_328;
                        _359 = __tco__359;
                        _360 = __tco__360;
                        continue tco;
                    };
                    if (_360 instanceof Three && (Prelude["<"](__dict_Ord_328)(_360.value1)(_359) && Prelude["<="](__dict_Ord_328)(_359)(_360.value4))) {
                        var __tco___dict_Ord_328 = __dict_Ord_328;
                        var __tco__359 = _359;
                        var __tco__360 = _360.value3;
                        __dict_Ord_328 = __tco___dict_Ord_328;
                        _359 = __tco__359;
                        _360 = __tco__360;
                        continue tco;
                    };
                    if (_360 instanceof Three) {
                        var __tco___dict_Ord_328 = __dict_Ord_328;
                        var __tco__359 = _359;
                        var __tco__360 = _360.value6;
                        __dict_Ord_328 = __tco___dict_Ord_328;
                        _359 = __tco__359;
                        _360 = __tco__360;
                        continue tco;
                    };
                    throw new Error("Failed pattern match");
                };
            };
        };
    };
    var member = function (__dict_Ord_329) {
        return function (k) {
            return function (m) {
                return Data_Maybe.isJust(lookup(__dict_Ord_329)(k)(m));
            };
        };
    };
    var keys = function (_364) {
        if (_364 instanceof Leaf) {
            return [  ];
        };
        if (_364 instanceof Two) {
            return Prelude["++"](Data_Array.semigroupArray())(keys(_364.value0))(Prelude["++"](Data_Array.semigroupArray())([ _364.value1 ])(keys(_364.value3)));
        };
        if (_364 instanceof Three) {
            return Prelude["++"](Data_Array.semigroupArray())(keys(_364.value0))(Prelude["++"](Data_Array.semigroupArray())([ _364.value1 ])(Prelude["++"](Data_Array.semigroupArray())(keys(_364.value3))(Prelude["++"](Data_Array.semigroupArray())([ _364.value4 ])(keys(_364.value6)))));
        };
        throw new Error("Failed pattern match");
    };
    var isEmpty = function (_358) {
        if (_358 instanceof Leaf) {
            return true;
        };
        return false;
    };
    var functorMap = function () {
        return new Prelude.Functor(function (_366) {
            return function (_367) {
                if (_367 instanceof Leaf) {
                    return Leaf.value;
                };
                if (_367 instanceof Two) {
                    return new Two(Prelude["<$>"](functorMap())(_366)(_367.value0), _367.value1, _366(_367.value2), Prelude["<$>"](functorMap())(_366)(_367.value3));
                };
                if (_367 instanceof Three) {
                    return new Three(Prelude["<$>"](functorMap())(_366)(_367.value0), _367.value1, _366(_367.value2), Prelude["<$>"](functorMap())(_366)(_367.value3), _367.value4, _366(_367.value5), Prelude["<$>"](functorMap())(_366)(_367.value6));
                };
                throw new Error("Failed pattern match");
            };
        });
    };
    var map = Prelude["<$>"](functorMap());
    var fromZipper = function (__copy___dict_Ord_330) {
        return function (__copy__361) {
            return function (__copy__362) {
                var __dict_Ord_330 = __copy___dict_Ord_330;
                var _361 = __copy__361;
                var _362 = __copy__362;
                tco: while (true) {
                    if (_361.length === 0) {
                        return _362;
                    };
                    if (_361.length >= 1) {
                        var _1162 = _361.slice(1);
                        if (_361[0] instanceof TwoLeft) {
                            var __tco___dict_Ord_330 = __dict_Ord_330;
                            var __tco__362 = new Two(_362, (_361[0]).value0, (_361[0]).value1, (_361[0]).value2);
                            __dict_Ord_330 = __tco___dict_Ord_330;
                            _361 = _1162;
                            _362 = __tco__362;
                            continue tco;
                        };
                    };
                    if (_361.length >= 1) {
                        var _1167 = _361.slice(1);
                        if (_361[0] instanceof TwoRight) {
                            var __tco___dict_Ord_330 = __dict_Ord_330;
                            var __tco__362 = new Two((_361[0]).value0, (_361[0]).value1, (_361[0]).value2, _362);
                            __dict_Ord_330 = __tco___dict_Ord_330;
                            _361 = _1167;
                            _362 = __tco__362;
                            continue tco;
                        };
                    };
                    if (_361.length >= 1) {
                        var _1175 = _361.slice(1);
                        if (_361[0] instanceof ThreeLeft) {
                            var __tco___dict_Ord_330 = __dict_Ord_330;
                            var __tco__362 = new Three(_362, (_361[0]).value0, (_361[0]).value1, (_361[0]).value2, (_361[0]).value3, (_361[0]).value4, (_361[0]).value5);
                            __dict_Ord_330 = __tco___dict_Ord_330;
                            _361 = _1175;
                            _362 = __tco__362;
                            continue tco;
                        };
                    };
                    if (_361.length >= 1) {
                        var _1183 = _361.slice(1);
                        if (_361[0] instanceof ThreeMiddle) {
                            var __tco___dict_Ord_330 = __dict_Ord_330;
                            var __tco__362 = new Three((_361[0]).value0, (_361[0]).value1, (_361[0]).value2, _362, (_361[0]).value3, (_361[0]).value4, (_361[0]).value5);
                            __dict_Ord_330 = __tco___dict_Ord_330;
                            _361 = _1183;
                            _362 = __tco__362;
                            continue tco;
                        };
                    };
                    if (_361.length >= 1) {
                        var _1191 = _361.slice(1);
                        if (_361[0] instanceof ThreeRight) {
                            var __tco___dict_Ord_330 = __dict_Ord_330;
                            var __tco__362 = new Three((_361[0]).value0, (_361[0]).value1, (_361[0]).value2, (_361[0]).value3, (_361[0]).value4, (_361[0]).value5, _362);
                            __dict_Ord_330 = __tco___dict_Ord_330;
                            _361 = _1191;
                            _362 = __tco__362;
                            continue tco;
                        };
                    };
                    throw new Error("Failed pattern match");
                };
            };
        };
    };
    var insert = function (__dict_Ord_331) {
        var up = function (__copy___dict_Ord_332) {
            return function (__copy__373) {
                return function (__copy__374) {
                    var __dict_Ord_332 = __copy___dict_Ord_332;
                    var _373 = __copy__373;
                    var _374 = __copy__374;
                    tco: while (true) {
                        if (_373.length === 0) {
                            return new Two(_374.value0, _374.value1, _374.value2, _374.value3);
                        };
                        if (_373.length >= 1) {
                            var _1206 = _373.slice(1);
                            if (_373[0] instanceof TwoLeft) {
                                return fromZipper(__dict_Ord_332)(_1206)(new Three(_374.value0, _374.value1, _374.value2, _374.value3, (_373[0]).value0, (_373[0]).value1, (_373[0]).value2));
                            };
                        };
                        if (_373.length >= 1) {
                            var _1215 = _373.slice(1);
                            if (_373[0] instanceof TwoRight) {
                                return fromZipper(__dict_Ord_332)(_1215)(new Three((_373[0]).value0, (_373[0]).value1, (_373[0]).value2, _374.value0, _374.value1, _374.value2, _374.value3));
                            };
                        };
                        if (_373.length >= 1) {
                            var _1227 = _373.slice(1);
                            if (_373[0] instanceof ThreeLeft) {
                                var __tco___dict_Ord_332 = __dict_Ord_332;
                                var __tco__374 = new KickUp(new Two(_374.value0, _374.value1, _374.value2, _374.value3), (_373[0]).value0, (_373[0]).value1, new Two((_373[0]).value2, (_373[0]).value3, (_373[0]).value4, (_373[0]).value5));
                                __dict_Ord_332 = __tco___dict_Ord_332;
                                _373 = _1227;
                                _374 = __tco__374;
                                continue tco;
                            };
                        };
                        if (_373.length >= 1) {
                            var _1239 = _373.slice(1);
                            if (_373[0] instanceof ThreeMiddle) {
                                var __tco___dict_Ord_332 = __dict_Ord_332;
                                var __tco__374 = new KickUp(new Two((_373[0]).value0, (_373[0]).value1, (_373[0]).value2, _374.value0), _374.value1, _374.value2, new Two(_374.value3, (_373[0]).value3, (_373[0]).value4, (_373[0]).value5));
                                __dict_Ord_332 = __tco___dict_Ord_332;
                                _373 = _1239;
                                _374 = __tco__374;
                                continue tco;
                            };
                        };
                        if (_373.length >= 1) {
                            var _1251 = _373.slice(1);
                            if (_373[0] instanceof ThreeRight) {
                                var __tco___dict_Ord_332 = __dict_Ord_332;
                                var __tco__374 = new KickUp(new Two((_373[0]).value0, (_373[0]).value1, (_373[0]).value2, (_373[0]).value3), (_373[0]).value4, (_373[0]).value5, new Two(_374.value0, _374.value1, _374.value2, _374.value3));
                                __dict_Ord_332 = __tco___dict_Ord_332;
                                _373 = _1251;
                                _374 = __tco__374;
                                continue tco;
                            };
                        };
                        throw new Error("Failed pattern match");
                    };
                };
            };
        };
        var down = function (__copy___dict_Ord_333) {
            return function (__copy__369) {
                return function (__copy__370) {
                    return function (__copy__371) {
                        return function (__copy__372) {
                            var __dict_Ord_333 = __copy___dict_Ord_333;
                            var _369 = __copy__369;
                            var _370 = __copy__370;
                            var _371 = __copy__371;
                            var _372 = __copy__372;
                            tco: while (true) {
                                if (_372 instanceof Leaf) {
                                    return up(__dict_Ord_333)(_369)(new KickUp(Leaf.value, _370, _371, Leaf.value));
                                };
                                if (_372 instanceof Two && Prelude["=="](__dict_Ord_333["__superclass_Prelude.Eq_0"]())(_370)(_372.value1)) {
                                    return fromZipper(__dict_Ord_333)(_369)(new Two(_372.value0, _370, _371, _372.value3));
                                };
                                if (_372 instanceof Two && Prelude["<"](__dict_Ord_333)(_370)(_372.value1)) {
                                    var __tco___dict_Ord_333 = __dict_Ord_333;
                                    var __tco__369 = Prelude[":"](new TwoLeft(_372.value1, _372.value2, _372.value3))(_369);
                                    var __tco__370 = _370;
                                    var __tco__371 = _371;
                                    var __tco__372 = _372.value0;
                                    __dict_Ord_333 = __tco___dict_Ord_333;
                                    _369 = __tco__369;
                                    _370 = __tco__370;
                                    _371 = __tco__371;
                                    _372 = __tco__372;
                                    continue tco;
                                };
                                if (_372 instanceof Two) {
                                    var __tco___dict_Ord_333 = __dict_Ord_333;
                                    var __tco__369 = Prelude[":"](new TwoRight(_372.value0, _372.value1, _372.value2))(_369);
                                    var __tco__370 = _370;
                                    var __tco__371 = _371;
                                    var __tco__372 = _372.value3;
                                    __dict_Ord_333 = __tco___dict_Ord_333;
                                    _369 = __tco__369;
                                    _370 = __tco__370;
                                    _371 = __tco__371;
                                    _372 = __tco__372;
                                    continue tco;
                                };
                                if (_372 instanceof Three && Prelude["=="](__dict_Ord_333["__superclass_Prelude.Eq_0"]())(_370)(_372.value1)) {
                                    return fromZipper(__dict_Ord_333)(_369)(new Three(_372.value0, _370, _371, _372.value3, _372.value4, _372.value5, _372.value6));
                                };
                                if (_372 instanceof Three && Prelude["=="](__dict_Ord_333["__superclass_Prelude.Eq_0"]())(_370)(_372.value4)) {
                                    return fromZipper(__dict_Ord_333)(_369)(new Three(_372.value0, _372.value1, _372.value2, _372.value3, _370, _371, _372.value6));
                                };
                                if (_372 instanceof Three && Prelude["<"](__dict_Ord_333)(_370)(_372.value1)) {
                                    var __tco___dict_Ord_333 = __dict_Ord_333;
                                    var __tco__369 = Prelude[":"](new ThreeLeft(_372.value1, _372.value2, _372.value3, _372.value4, _372.value5, _372.value6))(_369);
                                    var __tco__370 = _370;
                                    var __tco__371 = _371;
                                    var __tco__372 = _372.value0;
                                    __dict_Ord_333 = __tco___dict_Ord_333;
                                    _369 = __tco__369;
                                    _370 = __tco__370;
                                    _371 = __tco__371;
                                    _372 = __tco__372;
                                    continue tco;
                                };
                                if (_372 instanceof Three && (Prelude["<"](__dict_Ord_333)(_372.value1)(_370) && Prelude["<="](__dict_Ord_333)(_370)(_372.value4))) {
                                    var __tco___dict_Ord_333 = __dict_Ord_333;
                                    var __tco__369 = Prelude[":"](new ThreeMiddle(_372.value0, _372.value1, _372.value2, _372.value4, _372.value5, _372.value6))(_369);
                                    var __tco__370 = _370;
                                    var __tco__371 = _371;
                                    var __tco__372 = _372.value3;
                                    __dict_Ord_333 = __tco___dict_Ord_333;
                                    _369 = __tco__369;
                                    _370 = __tco__370;
                                    _371 = __tco__371;
                                    _372 = __tco__372;
                                    continue tco;
                                };
                                if (_372 instanceof Three) {
                                    var __tco___dict_Ord_333 = __dict_Ord_333;
                                    var __tco__369 = Prelude[":"](new ThreeRight(_372.value0, _372.value1, _372.value2, _372.value3, _372.value4, _372.value5))(_369);
                                    var __tco__370 = _370;
                                    var __tco__371 = _371;
                                    var __tco__372 = _372.value6;
                                    __dict_Ord_333 = __tco___dict_Ord_333;
                                    _369 = __tco__369;
                                    _370 = __tco__370;
                                    _371 = __tco__371;
                                    _372 = __tco__372;
                                    continue tco;
                                };
                                throw new Error("Failed pattern match");
                            };
                        };
                    };
                };
            };
        };
        return down(__dict_Ord_331)([  ]);
    };
    var union = function (__dict_Ord_334) {
        return function (m1) {
            return function (m2) {
                return Data_Foldable.foldl(Data_Foldable.foldableArray())(function (m) {
                    return function (_356) {
                        return insert(__dict_Ord_334)(_356.value0)(_356.value1)(m);
                    };
                })(m2)(toList(m1));
            };
        };
    };
    var eqMap = function (__dict_Eq_335) {
        return function (__dict_Eq_336) {
            return new Prelude.Eq(function (m1) {
                return function (m2) {
                    return !Prelude["=="](eqMap(__dict_Eq_335)(__dict_Eq_336))(m1)(m2);
                };
            }, function (m1) {
                return function (m2) {
                    return Prelude["=="](Prelude.eqArray(Data_Tuple.eqTuple(__dict_Eq_335)(__dict_Eq_336)))(toList(m1))(toList(m2));
                };
            });
        };
    };
    var empty = Leaf.value;
    var fromList = function (__dict_Ord_337) {
        return Data_Foldable.foldl(Data_Foldable.foldableArray())(function (m) {
            return function (_355) {
                return insert(__dict_Ord_337)(_355.value0)(_355.value1)(m);
            };
        })(empty);
    };
    var unions = function (__dict_Ord_338) {
        return Data_Foldable.foldl(Data_Foldable.foldableArray())(union(__dict_Ord_338))(empty);
    };
    var $$delete = function (__dict_Ord_339) {
        var up = function (__copy___dict_Ord_340) {
            return function (__copy__378) {
                return function (__copy__379) {
                    var __dict_Ord_340 = __copy___dict_Ord_340;
                    var _378 = __copy__378;
                    var _379 = __copy__379;
                    tco: while (true) {
                        if (_378.length === 0) {
                            return _379;
                        };
                        if (_378.length >= 1) {
                            var _1315 = _378.slice(1);
                            if (_378[0] instanceof TwoLeft && ((_378[0]).value2 instanceof Leaf && _379 instanceof Leaf)) {
                                return fromZipper(__dict_Ord_340)(_1315)(new Two(Leaf.value, (_378[0]).value0, (_378[0]).value1, Leaf.value));
                            };
                        };
                        if (_378.length >= 1) {
                            var _1320 = _378.slice(1);
                            if (_378[0] instanceof TwoRight && ((_378[0]).value0 instanceof Leaf && _379 instanceof Leaf)) {
                                return fromZipper(__dict_Ord_340)(_1320)(new Two(Leaf.value, (_378[0]).value1, (_378[0]).value2, Leaf.value));
                            };
                        };
                        if (_378.length >= 1) {
                            var _1329 = _378.slice(1);
                            if (_378[0] instanceof TwoLeft && (_378[0]).value2 instanceof Two) {
                                var __tco___dict_Ord_340 = __dict_Ord_340;
                                var __tco__379 = new Three(_379, (_378[0]).value0, (_378[0]).value1, (_378[0]).value2.value0, (_378[0]).value2.value1, (_378[0]).value2.value2, (_378[0]).value2.value3);
                                __dict_Ord_340 = __tco___dict_Ord_340;
                                _378 = _1329;
                                _379 = __tco__379;
                                continue tco;
                            };
                        };
                        if (_378.length >= 1) {
                            var _1338 = _378.slice(1);
                            if (_378[0] instanceof TwoRight && (_378[0]).value0 instanceof Two) {
                                var __tco___dict_Ord_340 = __dict_Ord_340;
                                var __tco__379 = new Three((_378[0]).value0.value0, (_378[0]).value0.value1, (_378[0]).value0.value2, (_378[0]).value0.value3, (_378[0]).value1, (_378[0]).value2, _379);
                                __dict_Ord_340 = __tco___dict_Ord_340;
                                _378 = _1338;
                                _379 = __tco__379;
                                continue tco;
                            };
                        };
                        if (_378.length >= 1) {
                            var _1350 = _378.slice(1);
                            if (_378[0] instanceof TwoLeft && (_378[0]).value2 instanceof Three) {
                                return fromZipper(__dict_Ord_340)(_1350)(new Two(new Two(_379, (_378[0]).value0, (_378[0]).value1, (_378[0]).value2.value0), (_378[0]).value2.value1, (_378[0]).value2.value2, new Two((_378[0]).value2.value3, (_378[0]).value2.value4, (_378[0]).value2.value5, (_378[0]).value2.value6)));
                            };
                        };
                        if (_378.length >= 1) {
                            var _1362 = _378.slice(1);
                            if (_378[0] instanceof TwoRight && (_378[0]).value0 instanceof Three) {
                                return fromZipper(__dict_Ord_340)(_1362)(new Two(new Two((_378[0]).value0.value0, (_378[0]).value0.value1, (_378[0]).value0.value2, (_378[0]).value0.value3), (_378[0]).value0.value4, (_378[0]).value0.value5, new Two((_378[0]).value0.value6, (_378[0]).value1, (_378[0]).value2, _379)));
                            };
                        };
                        if (_378.length >= 1) {
                            var _1370 = _378.slice(1);
                            if (_378[0] instanceof ThreeLeft && ((_378[0]).value2 instanceof Leaf && ((_378[0]).value5 instanceof Leaf && _379 instanceof Leaf))) {
                                return fromZipper(__dict_Ord_340)(_1370)(new Three(Leaf.value, (_378[0]).value0, (_378[0]).value1, Leaf.value, (_378[0]).value3, (_378[0]).value4, Leaf.value));
                            };
                        };
                        if (_378.length >= 1) {
                            var _1378 = _378.slice(1);
                            if (_378[0] instanceof ThreeMiddle && ((_378[0]).value0 instanceof Leaf && ((_378[0]).value5 instanceof Leaf && _379 instanceof Leaf))) {
                                return fromZipper(__dict_Ord_340)(_1378)(new Three(Leaf.value, (_378[0]).value1, (_378[0]).value2, Leaf.value, (_378[0]).value3, (_378[0]).value4, Leaf.value));
                            };
                        };
                        if (_378.length >= 1) {
                            var _1386 = _378.slice(1);
                            if (_378[0] instanceof ThreeRight && ((_378[0]).value0 instanceof Leaf && ((_378[0]).value3 instanceof Leaf && _379 instanceof Leaf))) {
                                return fromZipper(__dict_Ord_340)(_1386)(new Three(Leaf.value, (_378[0]).value1, (_378[0]).value2, Leaf.value, (_378[0]).value4, (_378[0]).value5, Leaf.value));
                            };
                        };
                        if (_378.length >= 1) {
                            var _1398 = _378.slice(1);
                            if (_378[0] instanceof ThreeLeft && (_378[0]).value2 instanceof Two) {
                                return fromZipper(__dict_Ord_340)(_1398)(new Two(new Three(_379, (_378[0]).value0, (_378[0]).value1, (_378[0]).value2.value0, (_378[0]).value2.value1, (_378[0]).value2.value2, (_378[0]).value2.value3), (_378[0]).value3, (_378[0]).value4, (_378[0]).value5));
                            };
                        };
                        if (_378.length >= 1) {
                            var _1410 = _378.slice(1);
                            if (_378[0] instanceof ThreeMiddle && (_378[0]).value0 instanceof Two) {
                                return fromZipper(__dict_Ord_340)(_1410)(new Two(new Three((_378[0]).value0.value0, (_378[0]).value0.value1, (_378[0]).value0.value2, (_378[0]).value0.value3, (_378[0]).value1, (_378[0]).value2, _379), (_378[0]).value3, (_378[0]).value4, (_378[0]).value5));
                            };
                        };
                        if (_378.length >= 1) {
                            var _1422 = _378.slice(1);
                            if (_378[0] instanceof ThreeMiddle && (_378[0]).value5 instanceof Two) {
                                return fromZipper(__dict_Ord_340)(_1422)(new Two((_378[0]).value0, (_378[0]).value1, (_378[0]).value2, new Three(_379, (_378[0]).value3, (_378[0]).value4, (_378[0]).value5.value0, (_378[0]).value5.value1, (_378[0]).value5.value2, (_378[0]).value5.value3)));
                            };
                        };
                        if (_378.length >= 1) {
                            var _1434 = _378.slice(1);
                            if (_378[0] instanceof ThreeRight && (_378[0]).value3 instanceof Two) {
                                return fromZipper(__dict_Ord_340)(_1434)(new Two((_378[0]).value0, (_378[0]).value1, (_378[0]).value2, new Three((_378[0]).value3.value0, (_378[0]).value3.value1, (_378[0]).value3.value2, (_378[0]).value3.value3, (_378[0]).value4, (_378[0]).value5, _379)));
                            };
                        };
                        if (_378.length >= 1) {
                            var _1449 = _378.slice(1);
                            if (_378[0] instanceof ThreeLeft && (_378[0]).value2 instanceof Three) {
                                return fromZipper(__dict_Ord_340)(_1449)(new Three(new Two(_379, (_378[0]).value0, (_378[0]).value1, (_378[0]).value2.value0), (_378[0]).value2.value1, (_378[0]).value2.value2, new Two((_378[0]).value2.value3, (_378[0]).value2.value4, (_378[0]).value2.value5, (_378[0]).value2.value6), (_378[0]).value3, (_378[0]).value4, (_378[0]).value5));
                            };
                        };
                        if (_378.length >= 1) {
                            var _1464 = _378.slice(1);
                            if (_378[0] instanceof ThreeMiddle && (_378[0]).value0 instanceof Three) {
                                return fromZipper(__dict_Ord_340)(_1464)(new Three(new Two((_378[0]).value0.value0, (_378[0]).value0.value1, (_378[0]).value0.value2, (_378[0]).value0.value3), (_378[0]).value0.value4, (_378[0]).value0.value5, new Two((_378[0]).value0.value6, (_378[0]).value1, (_378[0]).value2, _379), (_378[0]).value3, (_378[0]).value4, (_378[0]).value5));
                            };
                        };
                        if (_378.length >= 1) {
                            var _1479 = _378.slice(1);
                            if (_378[0] instanceof ThreeMiddle && (_378[0]).value5 instanceof Three) {
                                return fromZipper(__dict_Ord_340)(_1479)(new Three((_378[0]).value0, (_378[0]).value1, (_378[0]).value2, new Two(_379, (_378[0]).value3, (_378[0]).value4, (_378[0]).value5.value0), (_378[0]).value5.value1, (_378[0]).value5.value2, new Two((_378[0]).value5.value3, (_378[0]).value5.value4, (_378[0]).value5.value5, (_378[0]).value5.value6)));
                            };
                        };
                        if (_378.length >= 1) {
                            var _1494 = _378.slice(1);
                            if (_378[0] instanceof ThreeRight && (_378[0]).value3 instanceof Three) {
                                return fromZipper(__dict_Ord_340)(_1494)(new Three((_378[0]).value0, (_378[0]).value1, (_378[0]).value2, new Two((_378[0]).value3.value0, (_378[0]).value3.value1, (_378[0]).value3.value2, (_378[0]).value3.value3), (_378[0]).value3.value4, (_378[0]).value3.value5, new Two((_378[0]).value3.value6, (_378[0]).value4, (_378[0]).value5, _379)));
                            };
                        };
                        throw new Error("Failed pattern match");
                    };
                };
            };
        };
        var removeMaxNode = function (__copy___dict_Ord_341) {
            return function (__copy__381) {
                return function (__copy__382) {
                    var __dict_Ord_341 = __copy___dict_Ord_341;
                    var _381 = __copy__381;
                    var _382 = __copy__382;
                    tco: while (true) {
                        if (_382 instanceof Two && (_382.value0 instanceof Leaf && _382.value3 instanceof Leaf)) {
                            return up(__dict_Ord_341)(_381)(Leaf.value);
                        };
                        if (_382 instanceof Two) {
                            var __tco___dict_Ord_341 = __dict_Ord_341;
                            var __tco__381 = Prelude[":"](new TwoRight(_382.value0, _382.value1, _382.value2))(_381);
                            var __tco__382 = _382.value3;
                            __dict_Ord_341 = __tco___dict_Ord_341;
                            _381 = __tco__381;
                            _382 = __tco__382;
                            continue tco;
                        };
                        if (_382 instanceof Three && (_382.value0 instanceof Leaf && (_382.value3 instanceof Leaf && _382.value6 instanceof Leaf))) {
                            return up(__dict_Ord_341)(Prelude[":"](new TwoRight(Leaf.value, _382.value1, _382.value2))(_381))(Leaf.value);
                        };
                        if (_382 instanceof Three) {
                            var __tco___dict_Ord_341 = __dict_Ord_341;
                            var __tco__381 = Prelude[":"](new ThreeRight(_382.value0, _382.value1, _382.value2, _382.value3, _382.value4, _382.value5))(_381);
                            var __tco__382 = _382.value6;
                            __dict_Ord_341 = __tco___dict_Ord_341;
                            _381 = __tco__381;
                            _382 = __tco__382;
                            continue tco;
                        };
                        throw new Error("Failed pattern match");
                    };
                };
            };
        };
        var maxNode = function (__copy___dict_Ord_342) {
            return function (__copy__380) {
                var __dict_Ord_342 = __copy___dict_Ord_342;
                var _380 = __copy__380;
                tco: while (true) {
                    if (_380 instanceof Two && _380.value3 instanceof Leaf) {
                        return {
                            key: _380.value1, 
                            value: _380.value2
                        };
                    };
                    if (_380 instanceof Two) {
                        var __tco___dict_Ord_342 = __dict_Ord_342;
                        var __tco__380 = _380.value3;
                        __dict_Ord_342 = __tco___dict_Ord_342;
                        _380 = __tco__380;
                        continue tco;
                    };
                    if (_380 instanceof Three && _380.value6 instanceof Leaf) {
                        return {
                            key: _380.value4, 
                            value: _380.value5
                        };
                    };
                    if (_380 instanceof Three) {
                        var __tco___dict_Ord_342 = __dict_Ord_342;
                        var __tco__380 = _380.value6;
                        __dict_Ord_342 = __tco___dict_Ord_342;
                        _380 = __tco__380;
                        continue tco;
                    };
                    throw new Error("Failed pattern match");
                };
            };
        };
        var down = function (__copy___dict_Ord_343) {
            return function (__copy__375) {
                return function (__copy__376) {
                    return function (__copy__377) {
                        var __dict_Ord_343 = __copy___dict_Ord_343;
                        var _375 = __copy__375;
                        var _376 = __copy__376;
                        var _377 = __copy__377;
                        tco: while (true) {
                            if (_377 instanceof Leaf) {
                                return fromZipper(__dict_Ord_343)(_375)(Leaf.value);
                            };
                            if (_377 instanceof Two && (_377.value0 instanceof Leaf && (_377.value3 instanceof Leaf && Prelude["=="](__dict_Ord_343["__superclass_Prelude.Eq_0"]())(_376)(_377.value1)))) {
                                return up(__dict_Ord_343)(_375)(Leaf.value);
                            };
                            if (_377 instanceof Two && Prelude["=="](__dict_Ord_343["__superclass_Prelude.Eq_0"]())(_376)(_377.value1)) {
                                var max = maxNode(__dict_Ord_343)(_377.value0);
                                return removeMaxNode(__dict_Ord_343)(Prelude[":"](new TwoLeft(max.key, max.value, _377.value3))(_375))(_377.value0);
                            };
                            if (_377 instanceof Two && Prelude["<"](__dict_Ord_343)(_376)(_377.value1)) {
                                var __tco___dict_Ord_343 = __dict_Ord_343;
                                var __tco__375 = Prelude[":"](new TwoLeft(_377.value1, _377.value2, _377.value3))(_375);
                                var __tco__376 = _376;
                                var __tco__377 = _377.value0;
                                __dict_Ord_343 = __tco___dict_Ord_343;
                                _375 = __tco__375;
                                _376 = __tco__376;
                                _377 = __tco__377;
                                continue tco;
                            };
                            if (_377 instanceof Two) {
                                var __tco___dict_Ord_343 = __dict_Ord_343;
                                var __tco__375 = Prelude[":"](new TwoRight(_377.value0, _377.value1, _377.value2))(_375);
                                var __tco__376 = _376;
                                var __tco__377 = _377.value3;
                                __dict_Ord_343 = __tco___dict_Ord_343;
                                _375 = __tco__375;
                                _376 = __tco__376;
                                _377 = __tco__377;
                                continue tco;
                            };
                            if (_377 instanceof Three && (_377.value0 instanceof Leaf && (_377.value3 instanceof Leaf && (_377.value6 instanceof Leaf && Prelude["=="](__dict_Ord_343["__superclass_Prelude.Eq_0"]())(_376)(_377.value1))))) {
                                return fromZipper(__dict_Ord_343)(_375)(new Two(Leaf.value, _377.value4, _377.value5, Leaf.value));
                            };
                            if (_377 instanceof Three && (_377.value0 instanceof Leaf && (_377.value3 instanceof Leaf && (_377.value6 instanceof Leaf && Prelude["=="](__dict_Ord_343["__superclass_Prelude.Eq_0"]())(_376)(_377.value4))))) {
                                return fromZipper(__dict_Ord_343)(_375)(new Two(Leaf.value, _377.value1, _377.value2, Leaf.value));
                            };
                            if (_377 instanceof Three && Prelude["=="](__dict_Ord_343["__superclass_Prelude.Eq_0"]())(_376)(_377.value1)) {
                                var max = maxNode(__dict_Ord_343)(_377.value0);
                                return removeMaxNode(__dict_Ord_343)(Prelude[":"](new ThreeLeft(max.key, max.value, _377.value3, _377.value4, _377.value5, _377.value6))(_375))(_377.value0);
                            };
                            if (_377 instanceof Three && Prelude["=="](__dict_Ord_343["__superclass_Prelude.Eq_0"]())(_376)(_377.value4)) {
                                var max = maxNode(__dict_Ord_343)(_377.value3);
                                return removeMaxNode(__dict_Ord_343)(Prelude[":"](new ThreeMiddle(_377.value0, _377.value1, _377.value2, max.key, max.value, _377.value6))(_375))(_377.value3);
                            };
                            if (_377 instanceof Three && Prelude["<"](__dict_Ord_343)(_376)(_377.value1)) {
                                var __tco___dict_Ord_343 = __dict_Ord_343;
                                var __tco__375 = Prelude[":"](new ThreeLeft(_377.value1, _377.value2, _377.value3, _377.value4, _377.value5, _377.value6))(_375);
                                var __tco__376 = _376;
                                var __tco__377 = _377.value0;
                                __dict_Ord_343 = __tco___dict_Ord_343;
                                _375 = __tco__375;
                                _376 = __tco__376;
                                _377 = __tco__377;
                                continue tco;
                            };
                            if (_377 instanceof Three && (Prelude["<"](__dict_Ord_343)(_377.value1)(_376) && Prelude["<"](__dict_Ord_343)(_376)(_377.value4))) {
                                var __tco___dict_Ord_343 = __dict_Ord_343;
                                var __tco__375 = Prelude[":"](new ThreeMiddle(_377.value0, _377.value1, _377.value2, _377.value4, _377.value5, _377.value6))(_375);
                                var __tco__376 = _376;
                                var __tco__377 = _377.value3;
                                __dict_Ord_343 = __tco___dict_Ord_343;
                                _375 = __tco__375;
                                _376 = __tco__376;
                                _377 = __tco__377;
                                continue tco;
                            };
                            if (_377 instanceof Three) {
                                var __tco___dict_Ord_343 = __dict_Ord_343;
                                var __tco__375 = Prelude[":"](new ThreeRight(_377.value0, _377.value1, _377.value2, _377.value3, _377.value4, _377.value5))(_375);
                                var __tco__376 = _376;
                                var __tco__377 = _377.value6;
                                __dict_Ord_343 = __tco___dict_Ord_343;
                                _375 = __tco__375;
                                _376 = __tco__376;
                                _377 = __tco__377;
                                continue tco;
                            };
                            throw new Error("Failed pattern match");
                        };
                    };
                };
            };
        };
        return down(__dict_Ord_339)([  ]);
    };
    var checkValid = function (tree) {
        var allHeights = function (_368) {
            if (_368 instanceof Leaf) {
                return [ 0 ];
            };
            if (_368 instanceof Two) {
                return Data_Array.map(function (n) {
                    return n + 1;
                })(Prelude["++"](Data_Array.semigroupArray())(allHeights(_368.value0))(allHeights(_368.value3)));
            };
            if (_368 instanceof Three) {
                return Data_Array.map(function (n) {
                    return n + 1;
                })(Prelude["++"](Data_Array.semigroupArray())(allHeights(_368.value0))(Prelude["++"](Data_Array.semigroupArray())(allHeights(_368.value3))(allHeights(_368.value6))));
            };
            throw new Error("Failed pattern match");
        };
        return Data_Array.length(Data_Array.nub(Prelude.eqNumber())(allHeights(tree))) === 1;
    };
    var alter = function (__dict_Ord_344) {
        return function (f) {
            return function (k) {
                return function (m) {
                    var _1622 = f(lookup(__dict_Ord_344)(k)(m));
                    if (_1622 instanceof Data_Maybe.Nothing) {
                        return $$delete(__dict_Ord_344)(k)(m);
                    };
                    if (_1622 instanceof Data_Maybe.Just) {
                        return insert(__dict_Ord_344)(k)(_1622.value0)(m);
                    };
                    throw new Error("Failed pattern match");
                };
            };
        };
    };
    var update = function (__dict_Ord_345) {
        return function (f) {
            return function (k) {
                return function (m) {
                    return alter(__dict_Ord_345)(Data_Maybe.maybe(Data_Maybe.Nothing.value)(f))(k)(m);
                };
            };
        };
    };
    return {
        map: map, 
        unions: unions, 
        union: union, 
        values: values, 
        keys: keys, 
        update: update, 
        alter: alter, 
        member: member, 
        "delete": $$delete, 
        fromList: fromList, 
        toList: toList, 
        lookup: lookup, 
        insert: insert, 
        checkValid: checkValid, 
        singleton: singleton, 
        isEmpty: isEmpty, 
        empty: empty, 
        showTree: showTree, 
        eqMap: eqMap, 
        showMap: showMap, 
        functorMap: functorMap
    };
})();
var PS = PS || {};
PS.Data_Monoid_Last = (function () {
    "use strict";
    var Prelude = PS.Prelude;
    var Data_Maybe = PS.Data_Maybe;
    var Data_Monoid = PS.Data_Monoid;
    var Last = {
        create: function (value) {
            return value;
        }
    };
    var showLast = function (__dict_Show_346) {
        return new Prelude.Show(function (_390) {
            return "Last (" + (Prelude.show(Data_Maybe.showMaybe(__dict_Show_346))(_390) + ")");
        });
    };
    var semigroupLast = function () {
        return new Prelude.Semigroup(function (_391) {
            return function (_392) {
                if (_392 instanceof Data_Maybe.Just) {
                    return _392;
                };
                if (_392 instanceof Data_Maybe.Nothing) {
                    return _391;
                };
                throw new Error("Failed pattern match");
            };
        });
    };
    var runLast = function (_383) {
        return _383;
    };
    var monoidLast = function () {
        return new Data_Monoid.Monoid(semigroupLast, Data_Maybe.Nothing.value);
    };
    var eqLast = function (__dict_Eq_348) {
        return new Prelude.Eq(function (_386) {
            return function (_387) {
                return Prelude["/="](Data_Maybe.eqMaybe(__dict_Eq_348))(_386)(_387);
            };
        }, function (_384) {
            return function (_385) {
                return Prelude["=="](Data_Maybe.eqMaybe(__dict_Eq_348))(_384)(_385);
            };
        });
    };
    var ordLast = function (__dict_Ord_347) {
        return new Prelude.Ord(function () {
            return eqLast(__dict_Ord_347["__superclass_Prelude.Eq_0"]());
        }, function (_388) {
            return function (_389) {
                return Prelude.compare(Data_Maybe.ordMaybe(__dict_Ord_347))(_388)(_389);
            };
        });
    };
    return {
        Last: Last, 
        runLast: runLast, 
        eqLast: eqLast, 
        ordLast: ordLast, 
        showLast: showLast, 
        semigroupLast: semigroupLast, 
        monoidLast: monoidLast
    };
})();
var PS = PS || {};
PS.Data_Set = (function () {
    "use strict";
    var Data_Map = PS.Data_Map;
    var Data_Array = PS.Data_Array;
    var Data_Tuple = PS.Data_Tuple;
    var Prelude = PS.Prelude;
    var Data_Foldable = PS.Data_Foldable;
    function Set(value0) {
        this.value0 = value0;
    };
    Set.create = function (value0) {
        return new Set(value0);
    };
    var union = function (__dict_Ord_349) {
        return function (_402) {
            return function (_403) {
                return new Set(Data_Map.union(__dict_Ord_349)(_402.value0)(_403.value0));
            };
        };
    };
    var toList = function (_401) {
        return Data_Array.map(Data_Tuple.fst)(Data_Map.toList(_401.value0));
    };
    var singleton = function (a) {
        return new Set(Data_Map.singleton(a)(Prelude.unit));
    };
    var showSet = function (__dict_Show_350) {
        return new Prelude.Show(function (s) {
            return "fromList " + Prelude.show(Prelude.showArray(__dict_Show_350))(toList(s));
        });
    };
    var member = function (__dict_Ord_351) {
        return function (_395) {
            return function (_396) {
                return Data_Map.member(__dict_Ord_351)(_395)(_396.value0);
            };
        };
    };
    var isEmpty = function (_393) {
        return Data_Map.isEmpty(_393.value0);
    };
    var insert = function (__dict_Ord_352) {
        return function (_397) {
            return function (_398) {
                return new Set(Data_Map.insert(__dict_Ord_352)(_397)(Prelude.unit)(_398.value0));
            };
        };
    };
    var eqSet = function (__dict_Eq_353) {
        return new Prelude.Eq(function (_406) {
            return function (_407) {
                return Prelude["/="](Data_Map.eqMap(__dict_Eq_353)(Prelude.eqUnit()))(_406.value0)(_407.value0);
            };
        }, function (_404) {
            return function (_405) {
                return Prelude["=="](Data_Map.eqMap(__dict_Eq_353)(Prelude.eqUnit()))(_404.value0)(_405.value0);
            };
        });
    };
    var empty = new Set(Data_Map.empty);
    var fromList = function (__dict_Ord_354) {
        return Data_Foldable.foldl(Data_Foldable.foldableArray())(function (m) {
            return function (a) {
                return insert(__dict_Ord_354)(a)(m);
            };
        })(empty);
    };
    var unions = function (__dict_Ord_355) {
        return Data_Foldable.foldl(Data_Foldable.foldableArray())(union(__dict_Ord_355))(empty);
    };
    var $$delete = function (__dict_Ord_356) {
        return function (_399) {
            return function (_400) {
                return new Set(Data_Map["delete"](__dict_Ord_356)(_399)(_400.value0));
            };
        };
    };
    var checkValid = function (_394) {
        return Data_Map.checkValid(_394.value0);
    };
    return {
        unions: unions, 
        union: union, 
        fromList: fromList, 
        toList: toList, 
        "delete": $$delete, 
        member: member, 
        insert: insert, 
        checkValid: checkValid, 
        singleton: singleton, 
        isEmpty: isEmpty, 
        empty: empty, 
        eqSet: eqSet, 
        showSet: showSet
    };
})();
var PS = PS || {};
PS.Data_StrMap = (function () {
    "use strict";
    var Data_Function = PS.Data_Function;
    var Data_Maybe = PS.Data_Maybe;
    var Prelude = PS.Prelude;
    var Data_Foldable = PS.Data_Foldable;
    var Data_Tuple = PS.Data_Tuple;
    var Data_Array = PS.Data_Array;
    function _foldStrMap(m, z0, f) {  var z = z0;  for (var k in m) {    if (m.hasOwnProperty(k)) z = f(z)(k)(m[k]);  }  return z;};
    function _fmapStrMap(m0, f) {  var m = {};  for (var k in m0) {    if (m0.hasOwnProperty(k)) m[k] = f(m0[k]);  }  return m;};
    function _foldSCStrMap(m, z0, f, fromMaybe) {    var z = z0;                              for (var k in m) {                         if (m.hasOwnProperty(k)) {                 var maybeR = f(z)(k)(m[k]);              var r = fromMaybe(null)(maybeR);         if (r === null) return z;                else z = r;                            }                                      }                                       return z;                              };
    var empty = {};;
    function size(m) {  var s = 0;  for (var k in m) {    if (m.hasOwnProperty(k)) ++s;  }  return s;};
    function _lookup(m, k, yes, no) {                 if (m[k] !== undefined) return yes(m[k]);      else return no;                             };
    function _cloneStrMap(m0) {   var m = {};   for (var k in m0) {    if (m0.hasOwnProperty(k)) m[k] = m0[k];  }  return m;};
    function _unsafeInsertStrMap(m, k, v) {     m[k] = v;                                return m;                             };
    function _unsafeDeleteStrMap(m, k) {    delete m[k];                         return m;                         };
    var lookup = function (k) {
        return function (m) {
            return _lookup(m, k, Data_Maybe.Just.create, Data_Maybe.Nothing.value);
        };
    };
    var member = function (k) {
        return function (m) {
            return Data_Maybe.isJust(lookup(k)(m));
        };
    };
    var isEmpty = function (m) {
        return size(m) === 0;
    };
    var insert = function (k) {
        return function (v) {
            return function (m) {
                return _unsafeInsertStrMap(_cloneStrMap(m), k, v);
            };
        };
    };
    var singleton = function (k) {
        return function (v) {
            return insert(k)(v)(empty);
        };
    };
    var functorStrMap = function () {
        return new Prelude.Functor(function (f) {
            return function (m) {
                return _fmapStrMap(m, f);
            };
        });
    };
    var map = Prelude["<$>"](functorStrMap());
    var fromList = Data_Foldable.foldl(Data_Foldable.foldableArray())(function (m) {
        return function (_408) {
            return insert(_408.value0)(_408.value1)(m);
        };
    })(empty);
    var foldMaybe = function (f) {
        return function (z) {
            return function (m) {
                return _foldSCStrMap(m, z, f, Data_Maybe.fromMaybe);
            };
        };
    };
    var isSubmap = function (__dict_Eq_357) {
        return function (m1) {
            return function (m2) {
                var f = function (acc) {
                    return function (k) {
                        return function (v) {
                            return !acc ? Data_Maybe.Nothing.value : Data_Maybe.Just.create(acc && Data_Maybe.maybe(false)(function (v0) {
    return Prelude["=="](__dict_Eq_357)(v0)(v);
})(lookup(k)(m2)));
                        };
                    };
                };
                return foldMaybe(f)(true)(m1);
            };
        };
    };
    var fold = function (f) {
        return function (z) {
            return function (m) {
                return _foldStrMap(m, z, f);
            };
        };
    };
    var keys = function (m) {
        var f = function (acc) {
            return function (k) {
                return function (v) {
                    return Prelude["++"](Data_Array.semigroupArray())(acc)([ k ]);
                };
            };
        };
        return fold(f)([  ])(m);
    };
    var toList = function (m) {
        var f = function (acc) {
            return function (k) {
                return function (v) {
                    return Prelude["++"](Data_Array.semigroupArray())(acc)([ new Data_Tuple.Tuple(k, v) ]);
                };
            };
        };
        return fold(f)([  ])(m);
    };
    var showStrMap = function (__dict_Show_358) {
        return new Prelude.Show(function (m) {
            return "fromList " + Prelude.show(Prelude.showArray(Data_Tuple.showTuple(Prelude.showString())(__dict_Show_358)))(toList(m));
        });
    };
    var union = function (m1) {
        return function (m2) {
            return Data_Foldable.foldl(Data_Foldable.foldableArray())(function (m) {
                return function (_409) {
                    return insert(_409.value0)(_409.value1)(m);
                };
            })(m2)(toList(m1));
        };
    };
    var unions = Data_Foldable.foldl(Data_Foldable.foldableArray())(union)(empty);
    var values = function (m) {
        var f = function (acc) {
            return function (k) {
                return function (v) {
                    return Prelude["++"](Data_Array.semigroupArray())(acc)([ v ]);
                };
            };
        };
        return fold(f)([  ])(m);
    };
    var eqStrMap = function (__dict_Eq_359) {
        return new Prelude.Eq(function (m1) {
            return function (m2) {
                return !Prelude["=="](eqStrMap(__dict_Eq_359))(m1)(m2);
            };
        }, function (m1) {
            return function (m2) {
                return isSubmap(__dict_Eq_359)(m1)(m2) && isSubmap(__dict_Eq_359)(m2)(m1);
            };
        });
    };
    var $$delete = function (k) {
        return function (m) {
            return _unsafeDeleteStrMap(_cloneStrMap(m), k);
        };
    };
    var alter = function (f) {
        return function (k) {
            return function (m) {
                var _1668 = f(lookup(k)(m));
                if (_1668 instanceof Data_Maybe.Nothing) {
                    return $$delete(k)(m);
                };
                if (_1668 instanceof Data_Maybe.Just) {
                    return insert(k)(_1668.value0)(m);
                };
                throw new Error("Failed pattern match");
            };
        };
    };
    var update = function (f) {
        return function (k) {
            return function (m) {
                return alter(Data_Maybe.maybe(Data_Maybe.Nothing.value)(f))(k)(m);
            };
        };
    };
    return {
        foldMaybe: foldMaybe, 
        fold: fold, 
        isSubmap: isSubmap, 
        map: map, 
        unions: unions, 
        union: union, 
        values: values, 
        keys: keys, 
        update: update, 
        alter: alter, 
        member: member, 
        "delete": $$delete, 
        fromList: fromList, 
        toList: toList, 
        lookup: lookup, 
        insert: insert, 
        singleton: singleton, 
        isEmpty: isEmpty, 
        empty: empty, 
        functorStrMap: functorStrMap, 
        eqStrMap: eqStrMap, 
        showStrMap: showStrMap
    };
})();
var PS = PS || {};
PS.Data_Traversable = (function () {
    "use strict";
    var Data_Tuple = PS.Data_Tuple;
    var Prelude = PS.Prelude;
    var Data_Foldable = PS.Data_Foldable;
    var Data_Eq = PS.Data_Eq;
    var Data_Maybe = PS.Data_Maybe;
    var Data_Either = PS.Data_Either;
    var Data_Array = PS.Data_Array;
    function Traversable(__superclass_Data$dotFoldable$dotFoldable_1, __superclass_Prelude$dotFunctor_0, sequence, traverse) {
        this["__superclass_Data.Foldable.Foldable_1"] = __superclass_Data$dotFoldable$dotFoldable_1;
        this["__superclass_Prelude.Functor_0"] = __superclass_Prelude$dotFunctor_0;
        this.sequence = sequence;
        this.traverse = traverse;
    };
    var traverse = function (dict) {
        return dict.traverse;
    };
    var traversableTuple = function () {
        return new Traversable(Data_Foldable.foldableTuple, Data_Tuple.functorTuple, function (__dict_Applicative_361) {
            return function (_424) {
                return Prelude["<$>"]((__dict_Applicative_361["__superclass_Prelude.Apply_0"]())["__superclass_Prelude.Functor_0"]())(Data_Tuple.Tuple.create(_424.value0))(_424.value1);
            };
        }, function (__dict_Applicative_360) {
            return function (_422) {
                return function (_423) {
                    return Prelude["<$>"]((__dict_Applicative_360["__superclass_Prelude.Apply_0"]())["__superclass_Prelude.Functor_0"]())(Data_Tuple.Tuple.create(_423.value0))(_422(_423.value1));
                };
            };
        });
    };
    var traversableRef = function () {
        return new Traversable(Data_Foldable.foldableRef, Data_Eq.functorRef, function (__dict_Applicative_363) {
            return function (_418) {
                return Prelude["<$>"]((__dict_Applicative_363["__superclass_Prelude.Apply_0"]())["__superclass_Prelude.Functor_0"]())(Data_Eq.Ref.create)(_418);
            };
        }, function (__dict_Applicative_362) {
            return function (_416) {
                return function (_417) {
                    return Prelude["<$>"]((__dict_Applicative_362["__superclass_Prelude.Apply_0"]())["__superclass_Prelude.Functor_0"]())(Data_Eq.Ref.create)(_416(_417));
                };
            };
        });
    };
    var traversableMaybe = function () {
        return new Traversable(Data_Foldable.foldableMaybe, Data_Maybe.functorMaybe, function (__dict_Applicative_365) {
            return function (_421) {
                if (_421 instanceof Data_Maybe.Nothing) {
                    return Prelude.pure(__dict_Applicative_365)(Data_Maybe.Nothing.value);
                };
                if (_421 instanceof Data_Maybe.Just) {
                    return Prelude["<$>"]((__dict_Applicative_365["__superclass_Prelude.Apply_0"]())["__superclass_Prelude.Functor_0"]())(Data_Maybe.Just.create)(_421.value0);
                };
                throw new Error("Failed pattern match");
            };
        }, function (__dict_Applicative_364) {
            return function (_419) {
                return function (_420) {
                    if (_420 instanceof Data_Maybe.Nothing) {
                        return Prelude.pure(__dict_Applicative_364)(Data_Maybe.Nothing.value);
                    };
                    if (_420 instanceof Data_Maybe.Just) {
                        return Prelude["<$>"]((__dict_Applicative_364["__superclass_Prelude.Apply_0"]())["__superclass_Prelude.Functor_0"]())(Data_Maybe.Just.create)(_419(_420.value0));
                    };
                    throw new Error("Failed pattern match");
                };
            };
        });
    };
    var traversableEither = function () {
        return new Traversable(Data_Foldable.foldableEither, Data_Either.functorEither, function (__dict_Applicative_367) {
            return function (_415) {
                if (_415 instanceof Data_Either.Left) {
                    return Prelude.pure(__dict_Applicative_367)(new Data_Either.Left(_415.value0));
                };
                if (_415 instanceof Data_Either.Right) {
                    return Prelude["<$>"]((__dict_Applicative_367["__superclass_Prelude.Apply_0"]())["__superclass_Prelude.Functor_0"]())(Data_Either.Right.create)(_415.value0);
                };
                throw new Error("Failed pattern match");
            };
        }, function (__dict_Applicative_366) {
            return function (_413) {
                return function (_414) {
                    if (_414 instanceof Data_Either.Left) {
                        return Prelude.pure(__dict_Applicative_366)(new Data_Either.Left(_414.value0));
                    };
                    if (_414 instanceof Data_Either.Right) {
                        return Prelude["<$>"]((__dict_Applicative_366["__superclass_Prelude.Apply_0"]())["__superclass_Prelude.Functor_0"]())(Data_Either.Right.create)(_413(_414.value0));
                    };
                    throw new Error("Failed pattern match");
                };
            };
        });
    };
    var sequence = function (dict) {
        return dict.sequence;
    };
    var traversableArray = function () {
        return new Traversable(Data_Foldable.foldableArray, Data_Array.functorArray, function (__dict_Applicative_369) {
            return function (_412) {
                if (_412.length === 0) {
                    return Prelude.pure(__dict_Applicative_369)([  ]);
                };
                if (_412.length >= 1) {
                    var _1694 = _412.slice(1);
                    return Prelude["<*>"](__dict_Applicative_369["__superclass_Prelude.Apply_0"]())(Prelude["<$>"]((__dict_Applicative_369["__superclass_Prelude.Apply_0"]())["__superclass_Prelude.Functor_0"]())(Prelude[":"])(_412[0]))(sequence(traversableArray())(__dict_Applicative_369)(_1694));
                };
                throw new Error("Failed pattern match");
            };
        }, function (__dict_Applicative_368) {
            return function (_410) {
                return function (_411) {
                    if (_411.length === 0) {
                        return Prelude.pure(__dict_Applicative_368)([  ]);
                    };
                    if (_411.length >= 1) {
                        var _1698 = _411.slice(1);
                        return Prelude["<*>"](__dict_Applicative_368["__superclass_Prelude.Apply_0"]())(Prelude["<$>"]((__dict_Applicative_368["__superclass_Prelude.Apply_0"]())["__superclass_Prelude.Functor_0"]())(Prelude[":"])(_410(_411[0])))(traverse(traversableArray())(__dict_Applicative_368)(_410)(_1698));
                    };
                    throw new Error("Failed pattern match");
                };
            };
        });
    };
    var zipWithA = function (__dict_Applicative_370) {
        return function (f) {
            return function (xs) {
                return function (ys) {
                    return sequence(traversableArray())(__dict_Applicative_370)(Data_Array.zipWith(f)(xs)(ys));
                };
            };
        };
    };
    var $$for = function (__dict_Applicative_371) {
        return function (__dict_Traversable_372) {
            return function (x) {
                return function (f) {
                    return traverse(__dict_Traversable_372)(__dict_Applicative_371)(f)(x);
                };
            };
        };
    };
    return {
        Traversable: Traversable, 
        zipWithA: zipWithA, 
        "for": $$for, 
        sequence: sequence, 
        traverse: traverse, 
        traversableArray: traversableArray, 
        traversableEither: traversableEither, 
        traversableRef: traversableRef, 
        traversableMaybe: traversableMaybe, 
        traversableTuple: traversableTuple
    };
})();
var PS = PS || {};
PS.Data_Foreign_Class = (function () {
    "use strict";
    var Prelude = PS.Prelude;
    var Data_Foreign = PS.Data_Foreign;
    var Data_Either = PS.Data_Either;
    var Data_Foreign_Index = PS.Data_Foreign_Index;
    var Data_Foreign_Undefined = PS.Data_Foreign_Undefined;
    var Data_Foreign_NullOrUndefined = PS.Data_Foreign_NullOrUndefined;
    var Data_Foreign_Null = PS.Data_Foreign_Null;
    var Data_Traversable = PS.Data_Traversable;
    var Data_Array = PS.Data_Array;
    function IsForeign(read) {
        this.read = read;
    };
    var stringIsForeign = function () {
        return new IsForeign(Data_Foreign.readString);
    };
    var read = function (dict) {
        return dict.read;
    };
    var readJSON = function (__dict_IsForeign_373) {
        return function (json) {
            return Prelude[">>="](Data_Either.bindEither())(Data_Foreign.parseJSON(json))(read(__dict_IsForeign_373));
        };
    };
    var readWith = function (__dict_IsForeign_374) {
        return function (f) {
            return function (value) {
                return Data_Either.either(Prelude["<<<"](Prelude.semigroupoidArr())(Data_Either.Left.create)(f))(Data_Either.Right.create)(read(__dict_IsForeign_374)(value));
            };
        };
    };
    var readProp = function (__dict_IsForeign_375) {
        return function (__dict_Index_376) {
            return function (prop) {
                return function (value) {
                    return Prelude[">>="](Data_Either.bindEither())(Data_Foreign_Index["!"](__dict_Index_376)(value)(prop))(readWith(__dict_IsForeign_375)(Data_Foreign_Index.errorAt(__dict_Index_376)(prop)));
                };
            };
        };
    };
    var undefinedIsForeign = function (__dict_IsForeign_377) {
        return new IsForeign(Data_Foreign_Undefined.readUndefined(read(__dict_IsForeign_377)));
    };
    var numberIsForeign = function () {
        return new IsForeign(Data_Foreign.readNumber);
    };
    var nullOrUndefinedIsForeign = function (__dict_IsForeign_378) {
        return new IsForeign(Data_Foreign_NullOrUndefined.readNullOrUndefined(read(__dict_IsForeign_378)));
    };
    var nullIsForeign = function (__dict_IsForeign_379) {
        return new IsForeign(Data_Foreign_Null.readNull(read(__dict_IsForeign_379)));
    };
    var booleanIsForeign = function () {
        return new IsForeign(Data_Foreign.readBoolean);
    };
    var arrayIsForeign = function (__dict_IsForeign_380) {
        return new IsForeign(function (value) {
            var readElement = function (i) {
                return function (value_1) {
                    return readWith(__dict_IsForeign_380)(Data_Foreign.ErrorAtIndex.create(i))(value_1);
                };
            };
            var readElements = function (arr) {
                return Data_Traversable.sequence(Data_Traversable.traversableArray())(Data_Either.applicativeEither())(Data_Array.zipWith(readElement)(Data_Array.range(0)(Data_Array.length(arr)))(arr));
            };
            return Prelude[">>="](Data_Either.bindEither())(Data_Foreign.readArray(value))(readElements);
        });
    };
    return {
        IsForeign: IsForeign, 
        readProp: readProp, 
        readWith: readWith, 
        readJSON: readJSON, 
        read: read, 
        stringIsForeign: stringIsForeign, 
        booleanIsForeign: booleanIsForeign, 
        numberIsForeign: numberIsForeign, 
        arrayIsForeign: arrayIsForeign, 
        nullIsForeign: nullIsForeign, 
        undefinedIsForeign: undefinedIsForeign, 
        nullOrUndefinedIsForeign: nullOrUndefinedIsForeign
    };
})();
var PS = PS || {};
PS.Data_Graph = (function () {
    "use strict";
    var Prelude = PS.Prelude;
    var Data_Maybe = PS.Data_Maybe;
    var Math = PS.Math;
    var Control_Monad_Eff = PS.Control_Monad_Eff;
    var Control_Monad_ST = PS.Control_Monad_ST;
    var Data_Map = PS.Data_Map;
    var Data_Foldable = PS.Data_Foldable;
    var Data_Traversable = PS.Data_Traversable;
    var Control_Monad = PS.Control_Monad;
    var Data_Array = PS.Data_Array;
    function AcyclicSCC(value0) {
        this.value0 = value0;
    };
    AcyclicSCC.create = function (value0) {
        return new AcyclicSCC(value0);
    };
    function CyclicSCC(value0) {
        this.value0 = value0;
    };
    CyclicSCC.create = function (value0) {
        return new CyclicSCC(value0);
    };
    function Edge(value0, value1) {
        this.value0 = value0;
        this.value1 = value1;
    };
    Edge.create = function (value0) {
        return function (value1) {
            return new Edge(value0, value1);
        };
    };
    function Graph(value0, value1) {
        this.value0 = value0;
        this.value1 = value1;
    };
    Graph.create = function (value0) {
        return function (value1) {
            return new Graph(value0, value1);
        };
    };
    var vertices = function (_427) {
        if (_427 instanceof AcyclicSCC) {
            return [ _427.value0 ];
        };
        if (_427 instanceof CyclicSCC) {
            return _427.value0;
        };
        throw new Error("Failed pattern match");
    };
    var showSCC = function (__dict_Show_381) {
        return new Prelude.Show(function (_437) {
            if (_437 instanceof AcyclicSCC) {
                return "AcyclicSCC (" + (Prelude.show(__dict_Show_381)(_437.value0) + ")");
            };
            if (_437 instanceof CyclicSCC) {
                return "CyclicSCC " + Prelude.show(Prelude.showArray(__dict_Show_381))(_437.value0);
            };
            throw new Error("Failed pattern match");
        });
    };
    var popUntil = function (__copy___dict_Eq_382) {
        return function (__copy__431) {
            return function (__copy__432) {
                return function (__copy__433) {
                    return function (__copy__434) {
                        var __dict_Eq_382 = __copy___dict_Eq_382;
                        var _431 = __copy__431;
                        var _432 = __copy__432;
                        var _433 = __copy__433;
                        var _434 = __copy__434;
                        tco: while (true) {
                            if (_433.length === 0) {
                                return {
                                    path: [  ], 
                                    component: _434
                                };
                            };
                            if (_433.length >= 1) {
                                var _1710 = _433.slice(1);
                                if (Prelude["=="](__dict_Eq_382)(_431(_432))(_431(_433[0]))) {
                                    return {
                                        path: _1710, 
                                        component: Prelude[":"](_433[0])(_434)
                                    };
                                };
                            };
                            if (_433.length >= 1) {
                                var _1712 = _433.slice(1);
                                var __tco___dict_Eq_382 = __dict_Eq_382;
                                var __tco__431 = _431;
                                var __tco__432 = _432;
                                var __tco__434 = Prelude[":"](_433[0])(_434);
                                __dict_Eq_382 = __tco___dict_Eq_382;
                                _431 = __tco__431;
                                _432 = __tco__432;
                                _433 = _1712;
                                _434 = __tco__434;
                                continue tco;
                            };
                            throw new Error("Failed pattern match");
                        };
                    };
                };
            };
        };
    };
    var maybeMin = function (_435) {
        return function (_436) {
            if (_436 instanceof Data_Maybe.Nothing) {
                return new Data_Maybe.Just(_435);
            };
            if (_436 instanceof Data_Maybe.Just) {
                return Data_Maybe.Just.create(Math.min(_435)(_436.value0));
            };
            throw new Error("Failed pattern match");
        };
    };
    var scc$prime = function (__dict_Eq_383) {
        return function (__dict_Ord_384) {
            return function (_428) {
                return function (_429) {
                    return function (_430) {
                        return Control_Monad_Eff.runPure(function __do() {
                            var _58 = {
                                value: 0
                            };
                            var _57 = {
                                value: [  ]
                            };
                            var _56 = {
                                value: Data_Map.empty
                            };
                            var _55 = {
                                value: Data_Map.empty
                            };
                            var _54 = {
                                value: [  ]
                            };
                            return (function () {
                                var lowlinkOfKey = function (k) {
                                    return function __do() {
                                        return Data_Map.lookup(__dict_Ord_384)(k)(_55.value);
                                    };
                                };
                                var lowlinkOf = function (v) {
                                    return lowlinkOfKey(_428(v));
                                };
                                var isCycle = function (k) {
                                    return Data_Foldable.any(Data_Foldable.foldableArray())(function (_426) {
                                        return Prelude["=="](__dict_Eq_383)(_426.value0)(k) && Prelude["=="](__dict_Eq_383)(_426.value1)(k);
                                    })(_430.value1);
                                };
                                var makeComponent = function (_441) {
                                    if (_441.length === 1 && !isCycle(_428(_441[0]))) {
                                        return new AcyclicSCC(_441[0]);
                                    };
                                    return new CyclicSCC(_441);
                                };
                                var indexOfKey = function (k) {
                                    return function __do() {
                                        return Data_Map.lookup(__dict_Ord_384)(k)(_56.value);
                                    };
                                };
                                var strongConnect = function (k) {
                                    var v = _429(k);
                                    return function __do() {
                                        var _53 = _58.value;
                                        _56.value = Data_Map.insert(__dict_Ord_384)(k)(_53)(_56.value);
                                        _55.value = Data_Map.insert(__dict_Ord_384)(k)(_53)(_55.value);
                                        _58.value = _53 + 1;
                                        _57.value = Prelude[":"](v)(_57.value);
                                        Data_Traversable["for"](Control_Monad_Eff.applicativeEff())(Data_Traversable.traversableArray())(_430.value1)(function (_425) {
                                            return Control_Monad.when(Control_Monad_Eff.monadEff())(Prelude["=="](__dict_Eq_383)(k)(_425.value0))(function __do() {
                                                var _49 = indexOfKey(_425.value1)();
                                                return (function () {
                                                    if (_49 instanceof Data_Maybe.Nothing) {
                                                        var w = _429(_425.value1);
                                                        return function __do() {
                                                            strongConnect(_425.value1)();
                                                            var _46 = lowlinkOfKey(_425.value1)();
                                                            return Data_Foldable.for_(Control_Monad_Eff.applicativeEff())(Data_Foldable.foldableMaybe())(_46)(function (lowlink) {
                                                                return Control_Monad_ST.modifySTRef(_55)(Data_Map.alter(__dict_Ord_384)(maybeMin(lowlink))(k));
                                                            })();
                                                        };
                                                    };
                                                    return Control_Monad.when(Control_Monad_Eff.monadEff())(Data_Foldable.elem(__dict_Eq_383)(Data_Foldable.foldableArray())(_425.value1)(Data_Array.map(_428)(_57.value)))(function __do() {
                                                        var _47 = indexOfKey(_425.value1)();
                                                        return Data_Foldable.for_(Control_Monad_Eff.applicativeEff())(Data_Foldable.foldableMaybe())(_47)(function (index_1) {
                                                            return Control_Monad_ST.modifySTRef(_55)(Data_Map.alter(__dict_Ord_384)(maybeMin(index_1))(k));
                                                        })();
                                                    });
                                                })()();
                                            });
                                        })();
                                        var _52 = indexOfKey(k)();
                                        var _51 = lowlinkOfKey(k)();
                                        return Control_Monad.when(Control_Monad_Eff.monadEff())(Prelude["=="](Data_Maybe.eqMaybe(Prelude.eqNumber()))(_52)(_51))(function __do() {
                                            var _50 = _57.value;
                                            return (function () {
                                                var newPath = popUntil(__dict_Eq_383)(_428)(v)(_50)([  ]);
                                                return function __do() {
                                                    _54.value = Prelude.flip(Prelude["++"](Data_Array.semigroupArray()))([ makeComponent(newPath.component) ])(_54.value);
                                                    _57.value = newPath.path;
                                                    return Prelude.unit;
                                                };
                                            })()();
                                        })();
                                    };
                                };
                                var indexOf = function (v) {
                                    return indexOfKey(_428(v));
                                };
                                var go = function (_440) {
                                    if (_440.length === 0) {
                                        return Control_Monad_ST.readSTRef(_54);
                                    };
                                    if (_440.length >= 1) {
                                        var _1746 = _440.slice(1);
                                        return function __do() {
                                            var _45 = indexOf(_440[0])();
                                            Control_Monad.when(Control_Monad_Eff.monadEff())(Data_Maybe.isNothing(_45))(strongConnect(_428(_440[0])))();
                                            return go(_1746)();
                                        };
                                    };
                                    throw new Error("Failed pattern match");
                                };
                                return go(_430.value0);
                            })()();
                        });
                    };
                };
            };
        };
    };
    var scc = function (__dict_Eq_385) {
        return function (__dict_Ord_386) {
            return scc$prime(__dict_Eq_385)(__dict_Ord_386)(Prelude.id(Prelude.categoryArr()))(Prelude.id(Prelude.categoryArr()));
        };
    };
    var topSort$prime = function (__dict_Eq_387) {
        return function (__dict_Ord_388) {
            return function (makeKey) {
                return function (makeVert) {
                    return Prelude["<<<"](Prelude.semigroupoidArr())(Data_Array.reverse)(Prelude["<<<"](Prelude.semigroupoidArr())(Data_Array.concatMap(vertices))(scc$prime(__dict_Eq_387)(__dict_Ord_388)(makeKey)(makeVert)));
                };
            };
        };
    };
    var topSort = function (__dict_Eq_389) {
        return function (__dict_Ord_390) {
            return topSort$prime(__dict_Eq_389)(__dict_Ord_390)(Prelude.id(Prelude.categoryArr()))(Prelude.id(Prelude.categoryArr()));
        };
    };
    var eqSCC = function (__dict_Eq_391) {
        return new Prelude.Eq(function (scc1) {
            return function (scc2) {
                return !Prelude["=="](eqSCC(__dict_Eq_391))(scc1)(scc2);
            };
        }, function (_438) {
            return function (_439) {
                if (_438 instanceof AcyclicSCC && _439 instanceof AcyclicSCC) {
                    return Prelude["=="](__dict_Eq_391)(_438.value0)(_439.value0);
                };
                if (_438 instanceof CyclicSCC && _439 instanceof CyclicSCC) {
                    return Prelude["=="](Prelude.eqArray(__dict_Eq_391))(_438.value0)(_439.value0);
                };
                return false;
            };
        });
    };
    return {
        AcyclicSCC: AcyclicSCC, 
        CyclicSCC: CyclicSCC, 
        Graph: Graph, 
        Edge: Edge, 
        "topSort'": topSort$prime, 
        topSort: topSort, 
        "scc'": scc$prime, 
        scc: scc, 
        vertices: vertices, 
        showSCC: showSCC, 
        eqSCC: eqSCC
    };
})();
var PS = PS || {};
PS.Presentable = (function () {
    "use strict";
    var Prelude = PS.Prelude;
    function Presentable(value0, value1, value2) {
        this.value0 = value0;
        this.value1 = value1;
        this.value2 = value2;
    };
    Presentable.create = function (value0) {
        return function (value1) {
            return function (value2) {
                return new Presentable(value0, value1, value2);
            };
        };
    };
    return {
        Presentable: Presentable
    };
})();
var PS = PS || {};
PS.Presentable_Router = (function () {
    "use strict";
    var Prelude = PS.Prelude;
    var Control_Monad_Eff = PS.Control_Monad_Eff;
    var History = PS.History;
    var Control_Reactive_Event = PS.Control_Reactive_Event;
    var Data_Array = PS.Data_Array;
    var Data_Maybe = PS.Data_Maybe;
    var Control_Monad_Eff_Exception = PS.Control_Monad_Eff_Exception;
    var Data_Tuple = PS.Data_Tuple;
    var initRoutes = Prelude[">>="](Control_Monad_Eff.bindEff())(History.getState)(History.pushState);
    var extractUrl = function (e) {
        return (Control_Reactive_Event.unwrapEventDetail(e)).state.url;
    };
    var defaultRoute = function (rs) {
        var _1755 = Data_Array.head(rs);
        if (_1755 instanceof Data_Maybe.Nothing) {
            return Control_Monad_Eff_Exception.throwException(Control_Monad_Eff_Exception.error("Your Routes are empty"));
        };
        if (_1755 instanceof Data_Maybe.Just) {
            return Prelude["return"](Control_Monad_Eff.monadEff())(Data_Tuple.fst(_1755.value0));
        };
        throw new Error("Failed pattern match");
    };
    var route = function (rs) {
        return function (f) {
            return History.subscribeStateChange(function (e) {
                return Prelude[">>="](Control_Monad_Eff.bindEff())(defaultRoute(rs))(function (d) {
                    var _1757 = Data_Array.filter(function (x) {
                        return (Data_Tuple.fst(x)).url === extractUrl(e);
                    })(rs);
                    if (_1757.length === 0) {
                        return History.pushState(d);
                    };
                    if (_1757.length >= 1) {
                        var _1759 = _1757.slice(1);
                        return f(Data_Tuple.snd(_1757[0]));
                    };
                    throw new Error("Failed pattern match");
                });
            });
        };
    };
    return {
        initRoutes: initRoutes, 
        route: route
    };
})();
var PS = PS || {};
PS.Presentable_ViewParser = (function () {
    "use strict";
    var Prelude = PS.Prelude;
    var Control_Monad_Eff_Exception = PS.Control_Monad_Eff_Exception;
    var Presentable = PS.Presentable;
    var Data_Maybe = PS.Data_Maybe;
    var Control_Monad_Eff = PS.Control_Monad_Eff;
    var Data_Traversable = PS.Data_Traversable;
    var Data_Foldable = PS.Data_Foldable;
    var Data_Map = PS.Data_Map;
    var Data_Foreign = PS.Data_Foreign;
    var Data_Function = PS.Data_Function;
    var Data_Either = PS.Data_Either;
    function isString(x){ return (typeof x === 'string');};
    function getNameImpl(x){ return Object.keys(x)[0]; };
    function getAttributesImpl(Just, Nothing, x){ if(!isString(x) && x[getName(x)] && x[getName(x)].attributes){   return Just(x[getName(x)].attributes); }else{ return Nothing; }};
    function getChildrenImpl(Just, Nothing, x){ if(!isString(x) && x[getName(x)] && x[getName(x)].children){   return Just(x[getName(x)].children); }else{ return Nothing; }};
    function parseYaml (left, right, yaml){   try{ return right(jsyaml.safeLoad(yaml)); }   catch(e){ return left(e.toString()); }};
    var $$throw = Prelude["<<<"](Prelude.semigroupoidArr())(Control_Monad_Eff_Exception.throwException)(Control_Monad_Eff_Exception.error);
    var render = function (topParent) {
        return function (ns) {
            var r = function (_444) {
                return function (_445) {
                    if (_445.value2 instanceof Data_Maybe.Nothing) {
                        return _445.value0(_445.value1)(_444);
                    };
                    if (_445.value2 instanceof Data_Maybe.Just) {
                        return function __do() {
                            var _59 = r(_444)(new Presentable.Presentable(_445.value0, _445.value1, Data_Maybe.Nothing.value))();
                            Data_Traversable.traverse(Data_Traversable.traversableArray())(Control_Monad_Eff.applicativeEff())(r(_59))(_445.value2.value0)();
                            return _59;
                        };
                    };
                    throw new Error("Failed pattern match");
                };
            };
            return Data_Foldable.traverse_(Control_Monad_Eff.applicativeEff())(Data_Foldable.foldableArray())(r(topParent))(ns);
        };
    };
    var register = Data_Map.insert(Prelude.ordString());
    var getName = function (node) {
        return isString(node) ? Data_Foreign.unsafeFromForeign(node) : getNameImpl(node);
    };
    var getChildren = Data_Function.runFn3(getChildrenImpl)(Data_Maybe.Just.create)(Data_Maybe.Nothing.value);
    var getAttributes = Data_Function.runFn3(getAttributesImpl)(Data_Maybe.Just.create)(Data_Maybe.Nothing.value);
    var makePresentable = function (r) {
        return function (node) {
            var returnP = function (l) {
                return Presentable.Presentable.create(l)(getAttributes(node));
            };
            var name = getName(node);
            var handleC = function (_442) {
                return function (_443) {
                    if (_443 instanceof Data_Maybe.Nothing) {
                        return Prelude["return"](Control_Monad_Eff.monadEff())(returnP(_442)(Data_Maybe.Nothing.value));
                    };
                    if (_443 instanceof Data_Maybe.Just) {
                        return Prelude[">>="](Control_Monad_Eff.bindEff())(Data_Traversable.traverse(Data_Traversable.traversableArray())(Control_Monad_Eff.applicativeEff())(makePresentable(r))(_443.value0))(Prelude[">>>"](Prelude.semigroupoidArr())(Data_Maybe.Just.create)(Prelude[">>>"](Prelude.semigroupoidArr())(returnP(_442))(Prelude["return"](Control_Monad_Eff.monadEff()))));
                    };
                    throw new Error("Failed pattern match");
                };
            };
            var _1773 = Data_Map.lookup(Prelude.ordString())(name)(r);
            if (_1773 instanceof Data_Maybe.Nothing) {
                return $$throw(name + " not found in registry");
            };
            if (_1773 instanceof Data_Maybe.Just) {
                return handleC(_1773.value0)(getChildren(node));
            };
            throw new Error("Failed pattern match");
        };
    };
    var parse = function (x) {
        return function (r) {
            var parse$prime = Data_Foreign.isArray(x) ? Prelude[">>="](Control_Monad_Eff.bindEff())(Data_Traversable.traverse(Data_Traversable.traversableArray())(Control_Monad_Eff.applicativeEff())(makePresentable(r))(Data_Foreign.unsafeFromForeign(x)))(Prelude[">>>"](Prelude.semigroupoidArr())(Data_Either.Left.create)(Prelude["return"](Control_Monad_Eff.monadEff()))) : Prelude[">>="](Control_Monad_Eff.bindEff())(makePresentable(r)(Data_Foreign.unsafeFromForeign(x)))(Prelude[">>>"](Prelude.semigroupoidArr())(Data_Either.Right.create)(Prelude["return"](Control_Monad_Eff.monadEff())));
            return Prelude[">>="](Control_Monad_Eff.bindEff())(parse$prime)(function (p) {
                if (p instanceof Data_Either.Left) {
                    return Prelude["return"](Control_Monad_Eff.monadEff())(p.value0);
                };
                if (p instanceof Data_Either.Right) {
                    return Prelude["return"](Control_Monad_Eff.monadEff())([ p.value0 ]);
                };
                throw new Error("Failed pattern match");
            });
        };
    };
    var renderYaml = function (mp) {
        return function (reg) {
            return function (yaml) {
                var yamlToForeign = Data_Function.runFn3(parseYaml)(Data_Either.Left.create)(Data_Either.Right.create);
                var _1778 = yamlToForeign(yaml);
                if (_1778 instanceof Data_Either.Right) {
                    return Prelude[">>="](Control_Monad_Eff.bindEff())(parse(_1778.value0)(reg))(render(mp));
                };
                if (_1778 instanceof Data_Either.Left) {
                    return $$throw("Yaml view failed to parse : " + _1778.value0);
                };
                throw new Error("Failed pattern match");
            };
        };
    };
    var emptyRegistery = Data_Map.empty;
    return {
        emptyRegistery: emptyRegistery, 
        register: register, 
        renderYaml: renderYaml
    };
})();
var PS = PS || {};
PS.Test_QuickCheck_LCG = (function () {
    "use strict";
    var Prelude = PS.Prelude;
    var Math = PS.Math;
    var Data_Monoid_Sum = PS.Data_Monoid_Sum;
    var Data_Foldable = PS.Data_Foldable;
    var Data_Array = PS.Data_Array;
    var Data_Tuple = PS.Data_Tuple;
    var Data_Maybe = PS.Data_Maybe;
    var Data_Traversable = PS.Data_Traversable;
    var Debug_Trace = PS.Debug_Trace;
    function Gen(value0) {
        this.value0 = value0;
    };
    Gen.create = function (value0) {
        return new Gen(value0);
    };
    function float32ToInt32(n) {  var arr = new ArrayBuffer(4);  var fv = new Float32Array(arr);  var iv = new Int32Array(arr);  fv[0] = n;  return iv[0];};
    var runGen = function (_446) {
        return _446.value0;
    };
    var stateful = function (f) {
        return new Gen(function (s) {
            return runGen(f(s))(s);
        });
    };
    var sized = function (f) {
        return stateful(function (s) {
            return f(s.size);
        });
    };
    var variant = function (n) {
        return function (g) {
            return Gen.create(function (s) {
                return runGen(g)((function () {
                    var _1783 = {};
                    for (var _1784 in s) {
                        if (s.hasOwnProperty(_1784)) {
                            _1783[_1784] = s[_1784];
                        };
                    };
                    _1783.newSeed = n;
                    return _1783;
                })());
            });
        };
    };
    var resize = function (sz) {
        return function (g) {
            return Gen.create(function (s) {
                return runGen(g)((function () {
                    var _1785 = {};
                    for (var _1786 in s) {
                        if (s.hasOwnProperty(_1786)) {
                            _1785[_1786] = s[_1786];
                        };
                    };
                    _1785.size = sz;
                    return _1785;
                })());
            });
        };
    };
    var repeatable = function (f) {
        return Gen.create(function (s) {
            return {
                value: function (a) {
                    return (runGen(f(a))(s)).value;
                }, 
                state: s
            };
        });
    };
    var lcgN = 1 << 30;
    var lcgM = 1103515245;
    var lcgC = 12345;
    var lcgNext = function (n) {
        return (lcgM * n + lcgC) % lcgN;
    };
    var lcgStep = (function () {
        var f = function (s) {
            return {
                value: s.newSeed, 
                state: (function () {
                    var _1787 = {};
                    for (var _1788 in s) {
                        if (s.hasOwnProperty(_1788)) {
                            _1787[_1788] = s[_1788];
                        };
                    };
                    _1787.newSeed = lcgNext(s.newSeed);
                    return _1787;
                })()
            };
        };
        return new Gen(f);
    })();
    var perturbGen = function (_447) {
        return function (_448) {
            return Gen.create(function (s) {
                return _448.value0((function () {
                    var _1791 = {};
                    for (var _1792 in s) {
                        if (s.hasOwnProperty(_1792)) {
                            _1791[_1792] = s[_1792];
                        };
                    };
                    _1791.newSeed = lcgNext(float32ToInt32(_447)) + s.newSeed;
                    return _1791;
                })());
            });
        };
    };
    var functorGen = function () {
        return new Prelude.Functor(function (_452) {
            return function (_453) {
                return Gen.create(function (s) {
                    var _1796 = _453.value0(s);
                    return {
                        value: _452(_1796.value), 
                        state: _1796.state
                    };
                });
            };
        });
    };
    var uniform = Prelude["<$>"](functorGen())(function (n) {
        return n / (1 << 30);
    })(lcgStep);
    var evalGen = function (gen) {
        return function (st) {
            return (runGen(gen)(st)).value;
        };
    };
    var choose = function (a) {
        return function (b) {
            var min = Math.min(a)(b);
            var max = Math.max(a)(b);
            return Prelude["<$>"](functorGen())(Prelude[">>>"](Prelude.semigroupoidArr())(Prelude["*"](Prelude.numNumber())(max - min))(Prelude["+"](Prelude.numNumber())(min)))(uniform);
        };
    };
    var chooseInt = function (a) {
        return function (b) {
            return Prelude["<$>"](functorGen())(Math.floor)(choose(Math.ceil(a))(Math.floor(b) + 0.9999999989999999));
        };
    };
    var applyGen = function () {
        return new Prelude.Apply(function (_454) {
            return function (_455) {
                return Gen.create(function (s) {
                    var _1802 = _454.value0(s);
                    var _1803 = _455.value0(_1802.state);
                    return {
                        value: _1802.value(_1803.value), 
                        state: _1803.state
                    };
                });
            };
        }, functorGen);
    };
    var bindGen = function () {
        return new Prelude.Bind(function (_456) {
            return function (_457) {
                return Gen.create(function (s) {
                    var _1812 = _456.value0(s);
                    return runGen(_457(_1812.value))(_1812.state);
                });
            };
        }, applyGen);
    };
    var frequency = function (x) {
        return function (xs) {
            var xxs = Prelude[":"](x)(xs);
            var total = Data_Monoid_Sum.runSum(Data_Foldable.fold(Data_Foldable.foldableArray())(Data_Monoid_Sum.monoidSum())(Prelude["<$>"](Data_Array.functorArray())(Prelude["<<<"](Prelude.semigroupoidArr())(Data_Monoid_Sum.Sum.create)(Data_Tuple.fst))(xxs)));
            var pick = function (_449) {
                return function (_450) {
                    return function (_451) {
                        if (_451.length === 0) {
                            return _450;
                        };
                        if (_451.length >= 1) {
                            var _1822 = _451.slice(1);
                            return _449 <= (_451[0]).value0 ? (_451[0]).value1 : pick(_449 - (_451[0]).value0)(_450)(_1822);
                        };
                        throw new Error("Failed pattern match");
                    };
                };
            };
            return Prelude[">>="](bindGen())(chooseInt(1)(total))(function (_61) {
                return pick(_61)(Data_Tuple.snd(x))(xxs);
            });
        };
    };
    var oneOf = function (x) {
        return function (xs) {
            return Prelude[">>="](bindGen())(chooseInt(0)(Data_Array.length(xs)))(function (_60) {
                return _60 === 0 ? x : Data_Maybe.fromMaybe(x)(Data_Array["!!"](xs)(_60 - 1));
            });
        };
    };
    var applicativeGen = function () {
        return new Prelude.Applicative(applyGen, function (a) {
            return new Gen(function (s) {
                return {
                    value: a, 
                    state: s
                };
            });
        });
    };
    var elements = function (x) {
        return function (xs) {
            return Prelude[">>="](bindGen())(chooseInt(0)(Data_Array.length(xs)))(function (_66) {
                return Prelude.pure(applicativeGen())(_66 === 0 ? x : Data_Maybe.fromMaybe(x)(Data_Array["!!"](xs)(_66 - 1)));
            });
        };
    };
    var monadGen = function () {
        return new Prelude.Monad(applicativeGen, bindGen);
    };
    var vectorOf = function (k) {
        return function (g) {
            return Data_Traversable.sequence(Data_Traversable.traversableArray())(applicativeGen())(Prelude["<$>"](Data_Array.functorArray())(Prelude["const"](g))(Data_Array.range(1)(k)));
        };
    };
    var listOf = function (g) {
        return sized(function (n) {
            return Prelude[">>="](bindGen())(chooseInt(0)(n))(function (_62) {
                return vectorOf(_62)(g);
            });
        });
    };
    var listOf1 = function (g) {
        return sized(function (n) {
            return Prelude[">>="](bindGen())(chooseInt(0)(n))(function (_65) {
                return Prelude[">>="](bindGen())(g)(function (_64) {
                    return Prelude[">>="](bindGen())(vectorOf(_65 - 1)(g))(function (_63) {
                        return Prelude["return"](monadGen())(new Data_Tuple.Tuple(_64, _63));
                    });
                });
            });
        });
    };
    var sample = function (sz) {
        return function (g) {
            return evalGen(vectorOf(sz)(g))({
                newSeed: 0, 
                size: sz
            });
        };
    };
    var showSample$prime = function (__dict_Show_392) {
        return function (n) {
            return function (g) {
                return Debug_Trace.print(Prelude.showArray(__dict_Show_392))(sample(n)(g));
            };
        };
    };
    var showSample = function (__dict_Show_393) {
        return showSample$prime(__dict_Show_393)(10);
    };
    return {
        "showSample'": showSample$prime, 
        showSample: showSample, 
        uniform: uniform, 
        perturbGen: perturbGen, 
        evalGen: evalGen, 
        runGen: runGen, 
        elements: elements, 
        vectorOf: vectorOf, 
        listOf1: listOf1, 
        listOf: listOf, 
        frequency: frequency, 
        oneOf: oneOf, 
        chooseInt: chooseInt, 
        choose: choose, 
        resize: resize, 
        sized: sized, 
        variant: variant, 
        stateful: stateful, 
        repeatable: repeatable, 
        functorGen: functorGen, 
        applyGen: applyGen, 
        applicativeGen: applicativeGen, 
        bindGen: bindGen, 
        monadGen: monadGen
    };
})();
var PS = PS || {};
PS.Test_QuickCheck = (function () {
    "use strict";
    var Prelude = PS.Prelude;
    var Test_QuickCheck_LCG = PS.Test_QuickCheck_LCG;
    var Control_Monad_Eff = PS.Control_Monad_Eff;
    var Control_Monad_Eff_Exception = PS.Control_Monad_Eff_Exception;
    var Control_Monad_Eff_Random = PS.Control_Monad_Eff_Random;
    var Debug_Trace = PS.Debug_Trace;
    var Data_Tuple = PS.Data_Tuple;
    var Data_Maybe = PS.Data_Maybe;
    var Data_Either = PS.Data_Either;
    var Data_Array = PS.Data_Array;
    var Data_String = PS.Data_String;
    var Math = PS.Math;
    function Success() {

    };
    Success.value = new Success();
    function Failed(value0) {
        this.value0 = value0;
    };
    Failed.create = function (value0) {
        return new Failed(value0);
    };
    var AlphaNumString = {
        create: function (value) {
            return value;
        }
    };
    function Arbitrary(arbitrary) {
        this.arbitrary = arbitrary;
    };
    function CoArbitrary(coarbitrary) {
        this.coarbitrary = coarbitrary;
    };
    function Testable(test) {
        this.test = test;
    };
    var $less$qmark$greater = function (_458) {
        return function (_459) {
            if (_458) {
                return Success.value;
            };
            if (!_458) {
                return new Failed(_459);
            };
            throw new Error("Failed pattern match");
        };
    };
    var testableResult = function () {
        return new Testable(Prelude["return"](Test_QuickCheck_LCG.monadGen()));
    };
    var testableBoolean = function () {
        return new Testable(function (_467) {
            if (_467) {
                return Prelude["return"](Test_QuickCheck_LCG.monadGen())(Success.value);
            };
            if (!_467) {
                return Prelude["return"](Test_QuickCheck_LCG.monadGen())(new Failed("Test returned false"));
            };
            throw new Error("Failed pattern match");
        });
    };
    var test = function (dict) {
        return dict.test;
    };
    var showResult = function () {
        return new Prelude.Show(function (_460) {
            if (_460 instanceof Success) {
                return "Success";
            };
            if (_460 instanceof Failed) {
                return "Failed: " + _460.value0;
            };
            throw new Error("Failed pattern match");
        });
    };
    var quickCheckPure = function (__dict_Testable_394) {
        return function (s) {
            var quickCheckPure$prime = function (st) {
                return function (n) {
                    return function (prop) {
                        var go = function (_468) {
                            if (_468 <= 0) {
                                return Prelude["return"](Test_QuickCheck_LCG.monadGen())([  ]);
                            };
                            return Prelude[">>="](Test_QuickCheck_LCG.bindGen())(test(__dict_Testable_394)(prop))(function (_78) {
                                return Prelude[">>="](Test_QuickCheck_LCG.bindGen())(go(_468 - 1))(function (_77) {
                                    return Prelude["return"](Test_QuickCheck_LCG.monadGen())(Prelude[":"](_78)(_77));
                                });
                            });
                        };
                        return Test_QuickCheck_LCG.evalGen(go(n))(st);
                    };
                };
            };
            return quickCheckPure$prime({
                newSeed: s, 
                size: 10
            });
        };
    };
    var quickCheck$prime = function (__dict_Testable_395) {
        return function (n) {
            return function (prop) {
                var throwOnFirstFailure = function (__copy__469) {
                    return function (__copy__470) {
                        var _469 = __copy__469;
                        var _470 = __copy__470;
                        tco: while (true) {
                            if (_470.length === 0) {
                                return Prelude["return"](Control_Monad_Eff.monadEff())(Prelude.unit);
                            };
                            if (_470.length >= 1) {
                                var _1842 = _470.slice(1);
                                if (_470[0] instanceof Failed) {
                                    return Control_Monad_Eff_Exception.throwException(Control_Monad_Eff_Exception.error("Test " + (Prelude.show(Prelude.showNumber())(_469) + (" failed: \n" + (_470[0]).value0))));
                                };
                            };
                            if (_470.length >= 1) {
                                var _1844 = _470.slice(1);
                                var __tco__469 = _469 + 1;
                                _469 = __tco__469;
                                _470 = _1844;
                                continue tco;
                            };
                            throw new Error("Failed pattern match");
                        };
                    };
                };
                var countSuccesses = function (_471) {
                    if (_471.length === 0) {
                        return 0;
                    };
                    if (_471.length >= 1) {
                        var _1847 = _471.slice(1);
                        if (_471[0] instanceof Success) {
                            return 1 + countSuccesses(_1847);
                        };
                    };
                    if (_471.length >= 1) {
                        var _1849 = _471.slice(1);
                        return countSuccesses(_1849);
                    };
                    throw new Error("Failed pattern match");
                };
                return function __do() {
                    var _79 = Control_Monad_Eff_Random.random();
                    return (function () {
                        var results = quickCheckPure(__dict_Testable_395)(_79)(n)(prop);
                        var successes = countSuccesses(results);
                        return function __do() {
                            Debug_Trace.trace(Prelude.show(Prelude.showNumber())(successes) + ("/" + (Prelude.show(Prelude.showNumber())(n) + " test(s) passed.")))();
                            return throwOnFirstFailure(1)(results)();
                        };
                    })()();
                };
            };
        };
    };
    var quickCheck = function (__dict_Testable_396) {
        return function (prop) {
            return quickCheck$prime(__dict_Testable_396)(100)(prop);
        };
    };
    var coarbitrary = function (dict) {
        return dict.coarbitrary;
    };
    var coarbTuple = function (__dict_CoArbitrary_397) {
        return function (__dict_CoArbitrary_398) {
            return new CoArbitrary(function (_463) {
                return Prelude[">>>"](Prelude.semigroupoidArr())(coarbitrary(__dict_CoArbitrary_397)(_463.value0))(coarbitrary(__dict_CoArbitrary_398)(_463.value1));
            });
        };
    };
    var coarbNumber = function () {
        return new CoArbitrary(Test_QuickCheck_LCG.perturbGen);
    };
    var coarbMaybe = function (__dict_CoArbitrary_399) {
        return new CoArbitrary(function (_465) {
            if (_465 instanceof Data_Maybe.Nothing) {
                return Test_QuickCheck_LCG.perturbGen(1);
            };
            if (_465 instanceof Data_Maybe.Just) {
                return coarbitrary(__dict_CoArbitrary_399)(_465.value0);
            };
            throw new Error("Failed pattern match");
        });
    };
    var coarbEither = function (__dict_CoArbitrary_400) {
        return function (__dict_CoArbitrary_401) {
            return new CoArbitrary(function (_464) {
                if (_464 instanceof Data_Either.Left) {
                    return coarbitrary(__dict_CoArbitrary_400)(_464.value0);
                };
                if (_464 instanceof Data_Either.Right) {
                    return coarbitrary(__dict_CoArbitrary_401)(_464.value0);
                };
                throw new Error("Failed pattern match");
            });
        };
    };
    var coarbBoolean = function () {
        return new CoArbitrary(function (_461) {
            if (_461) {
                return Test_QuickCheck_LCG.perturbGen(1);
            };
            if (!_461) {
                return Test_QuickCheck_LCG.perturbGen(2);
            };
            throw new Error("Failed pattern match");
        });
    };
    var coarbArray = function (__dict_CoArbitrary_402) {
        return new CoArbitrary(function (_466) {
            if (_466.length === 0) {
                return Prelude.id(Prelude.categoryArr());
            };
            if (_466.length >= 1) {
                var _1862 = _466.slice(1);
                return Prelude["<<<"](Prelude.semigroupoidArr())(coarbitrary(coarbArray(__dict_CoArbitrary_402))(_1862))(coarbitrary(__dict_CoArbitrary_402)(_466[0]));
            };
            throw new Error("Failed pattern match");
        });
    };
    var coarbString = function () {
        return new CoArbitrary(function (s) {
            return coarbitrary(coarbArray(coarbNumber()))(Prelude["<$>"](Data_Array.functorArray())(Data_String.charCodeAt(0))(Data_String.split("")(s)));
        });
    };
    var coarbAlphaNumString = function () {
        return new CoArbitrary(function (_462) {
            return coarbitrary(coarbString())(_462);
        });
    };
    var arbitrary = function (dict) {
        return dict.arbitrary;
    };
    var testableFunction = function (__dict_Arbitrary_405) {
        return function (__dict_Testable_406) {
            return new Testable(function (f) {
                return Prelude[">>="](Test_QuickCheck_LCG.bindGen())(arbitrary(__dict_Arbitrary_405))(function (_76) {
                    return test(__dict_Testable_406)(f(_76));
                });
            });
        };
    };
    var arbTuple = function (__dict_Arbitrary_407) {
        return function (__dict_Arbitrary_408) {
            return new Arbitrary(Prelude["<*>"](Test_QuickCheck_LCG.applyGen())(Prelude["<$>"](Test_QuickCheck_LCG.functorGen())(Data_Tuple.Tuple.create)(arbitrary(__dict_Arbitrary_407)))(arbitrary(__dict_Arbitrary_408)));
        };
    };
    var arbNumber = function () {
        return new Arbitrary(Test_QuickCheck_LCG.uniform);
    };
    var arbFunction = function (__dict_CoArbitrary_410) {
        return function (__dict_Arbitrary_411) {
            return new Arbitrary(Test_QuickCheck_LCG.repeatable(function (a) {
                return coarbitrary(__dict_CoArbitrary_410)(a)(arbitrary(__dict_Arbitrary_411));
            }));
        };
    };
    var arbBoolean = function () {
        return new Arbitrary(Prelude[">>="](Test_QuickCheck_LCG.bindGen())(Test_QuickCheck_LCG.uniform)(function (_67) {
            return Prelude["return"](Test_QuickCheck_LCG.monadGen())((_67 * 2) < 1);
        }));
    };
    var arbEither = function (__dict_Arbitrary_412) {
        return function (__dict_Arbitrary_413) {
            return new Arbitrary(Prelude[">>="](Test_QuickCheck_LCG.bindGen())(arbitrary(arbBoolean()))(function (_70) {
                return _70 ? Prelude["<$>"](Test_QuickCheck_LCG.functorGen())(Data_Either.Left.create)(arbitrary(__dict_Arbitrary_412)) : Prelude["<$>"](Test_QuickCheck_LCG.functorGen())(Data_Either.Right.create)(arbitrary(__dict_Arbitrary_413));
            }));
        };
    };
    var arbMaybe = function (__dict_Arbitrary_409) {
        return new Arbitrary(Prelude[">>="](Test_QuickCheck_LCG.bindGen())(arbitrary(arbBoolean()))(function (_71) {
            return _71 ? Prelude.pure(Test_QuickCheck_LCG.applicativeGen())(Data_Maybe.Nothing.value) : Prelude["<$>"](Test_QuickCheck_LCG.functorGen())(Data_Maybe.Just.create)(arbitrary(__dict_Arbitrary_409));
        }));
    };
    var arbArray = function (__dict_Arbitrary_414) {
        return new Arbitrary(Prelude[">>="](Test_QuickCheck_LCG.bindGen())(arbitrary(arbBoolean()))(function (_75) {
            return _75 ? Prelude["return"](Test_QuickCheck_LCG.monadGen())([  ]) : Prelude[">>="](Test_QuickCheck_LCG.bindGen())(arbitrary(__dict_Arbitrary_414))(function (_74) {
    return Prelude[">>="](Test_QuickCheck_LCG.bindGen())(arbitrary(arbArray(__dict_Arbitrary_414)))(function (_73) {
        return Prelude["return"](Test_QuickCheck_LCG.monadGen())(Prelude[":"](_74)(_73));
    });
});
        }));
    };
    var arbString = function () {
        return new Arbitrary(Prelude[">>="](Test_QuickCheck_LCG.bindGen())(arbitrary(arbArray(arbNumber())))(function (_68) {
            return Prelude["return"](Test_QuickCheck_LCG.monadGen())(Data_String.joinWith("")(Prelude["<$>"](Data_Array.functorArray())(Prelude["<<<"](Prelude.semigroupoidArr())(Data_String.fromCharCode)(Prelude["*"](Prelude.numNumber())(65535)))(_68)));
        }));
    };
    var coarbFunction = function (__dict_Arbitrary_403) {
        return function (__dict_CoArbitrary_404) {
            return new CoArbitrary(function (f) {
                return function (gen) {
                    return Prelude[">>="](Test_QuickCheck_LCG.bindGen())(arbitrary(arbArray(__dict_Arbitrary_403)))(function (_72) {
                        return coarbitrary(coarbArray(__dict_CoArbitrary_404))(Data_Array.map(f)(_72))(gen);
                    });
                };
            });
        };
    };
    var arbAlphaNumString = function () {
        return new Arbitrary((function () {
            var lookup = function (x) {
                var index = Math.round(x * (Data_String.length("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789") - 1));
                return Data_String.charAt(index)("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789");
            };
            return Prelude[">>="](Test_QuickCheck_LCG.bindGen())(arbitrary(arbArray(arbNumber())))(function (_69) {
                return Prelude["return"](Test_QuickCheck_LCG.monadGen())(Prelude["<<<"](Prelude.semigroupoidArr())(AlphaNumString.create)(Data_String.joinWith(""))(Prelude["<$>"](Data_Array.functorArray())(lookup)(_69)));
            });
        })());
    };
    return {
        Success: Success, 
        Failed: Failed, 
        AlphaNumString: AlphaNumString, 
        Testable: Testable, 
        CoArbitrary: CoArbitrary, 
        Arbitrary: Arbitrary, 
        quickCheck: quickCheck, 
        "quickCheck'": quickCheck$prime, 
        quickCheckPure: quickCheckPure, 
        test: test, 
        "<?>": $less$qmark$greater, 
        coarbitrary: coarbitrary, 
        arbitrary: arbitrary, 
        showResult: showResult, 
        arbNumber: arbNumber, 
        coarbNumber: coarbNumber, 
        arbBoolean: arbBoolean, 
        coarbBoolean: coarbBoolean, 
        arbString: arbString, 
        coarbString: coarbString, 
        arbAlphaNumString: arbAlphaNumString, 
        coarbAlphaNumString: coarbAlphaNumString, 
        arbTuple: arbTuple, 
        coarbTuple: coarbTuple, 
        arbEither: arbEither, 
        coarbEither: coarbEither, 
        arbMaybe: arbMaybe, 
        coarbMaybe: coarbMaybe, 
        arbFunction: arbFunction, 
        coarbFunction: coarbFunction, 
        arbArray: arbArray, 
        coarbArray: coarbArray, 
        testableResult: testableResult, 
        testableBoolean: testableBoolean, 
        testableFunction: testableFunction
    };
})();
var PS = PS || {};
PS.App_Presentables_Generators = (function () {
    "use strict";
    var Prelude = PS.Prelude;
    input;
    return {
        input: input
    };
})();
var PS = PS || {};
PS.App_Presentables_Foreign = (function () {
    "use strict";
    var Prelude = PS.Prelude;
    var Data_Function = PS.Data_Function;
    var Data_Maybe = PS.Data_Maybe;
    
  function linkerImpl(Nothing, Just, linkerName, ma, mp){
    return _returnEff(_maybe(window[linkerName](_unMaybe(ma), _unMaybe(mp))));
  } 
  ;
    var linker = Data_Function.runFn5(linkerImpl)(Data_Maybe.Nothing.value)(Data_Maybe.Just.create);
    return {
        linker: linker, 
        linkerImpl: linkerImpl
    };
})();
var PS = PS || {};
PS.App_Presentables_Binders = (function () {
    "use strict";
    var Prelude = PS.Prelude;
    inputRVar;
    return {
        inputRVar: inputRVar
    };
})();
var PS = PS || {};
PS.App_Presentables_ChartSelector = (function () {
    "use strict";
    var Prelude = PS.Prelude;
    var Data_Maybe = PS.Data_Maybe;
    var Control_Monad_Eff = PS.Control_Monad_Eff;
    var App_Presentables_Generators = PS.App_Presentables_Generators;
    var App_Presentables_Binders = PS.App_Presentables_Binders;
    var chartSelector = function (_472) {
        return function (_473) {
            if (_473 instanceof Data_Maybe.Just) {
                return function __do() {
                    Prelude[">>="](Control_Monad_Eff.bindEff())(App_Presentables_Generators.input)(App_Presentables_Binders.inputRVar(_473.value0.chart))();
                    return _473;
                };
            };
            throw new Error("Failed pattern match");
        };
    };
    return {
        chartSelector: chartSelector
    };
})();
var PS = PS || {};
PS.App_Network_StatQuery = (function () {
    "use strict";
    var Prelude = PS.Prelude;
    var Network_SocketIO = PS.Network_SocketIO;
    var Control_Monad_Eff = PS.Control_Monad_Eff;
    var Control_Bind = PS.Control_Bind;
    var Envelope = {
        create: function (value) {
            return value;
        }
    };
    function Request(send) {
        this.send = send;
    };
    
  function getUUID(){
    return function(){
      return uuid.v1();
    };
  }
  ;
    var send = function (dict) {
        return dict.send;
    };
    var getSocket = Network_SocketIO.getSocketSinglton("http://localhost:5000");
    var runStatQuery = function (_474) {
        return function (_475) {
            return function __do() {
                var uuid = getUUID();
                return Prelude[">>="](Control_Monad_Eff.bindEff())(Prelude[">>="](Control_Monad_Eff.bindEff())(getSocket)(Network_SocketIO.emit("StatQuery")((function () {
                    var _1880 = {};
                    for (var _1881 in _474) {
                        if (_474.hasOwnProperty(_1881)) {
                            _1880[_1881] = _474[_1881];
                        };
                    };
                    _1880.id = uuid;
                    return _1880;
                })())))(Network_SocketIO.on("StatQuery")(_475))();
            };
        };
    };
    var emitEnvelope = (function () {
        var f = function (uu) {
            return function (so) {
                return Network_SocketIO.emit("StatQuery")({
                    id: uu
                })(so);
            };
        };
        return Control_Bind.join(Control_Monad_Eff.bindEff())(Prelude["<*>"](Control_Monad_Eff.applyEff())(Prelude["<$>"](Control_Monad_Eff.functorEff())(f)(getUUID))(getSocket));
    })();
    return {
        Envelope: Envelope, 
        Request: Request, 
        send: send, 
        runStatQuery: runStatQuery, 
        emitEnvelope: emitEnvelope, 
        getUUID: getUUID, 
        getSocket: getSocket
    };
})();
var PS = PS || {};
PS.App_Controller = (function () {
    "use strict";
    var Prelude = PS.Prelude;
    var Control_Monad_Eff = PS.Control_Monad_Eff;
    var Control_Reactive = PS.Control_Reactive;
    var Debug_Trace = PS.Debug_Trace;
    var Data_Maybe = PS.Data_Maybe;
    var controller = function (_476) {
        return function (_477) {
            return function __do() {
                var _80 = Control_Reactive.newRVar("moo")();
                Control_Reactive.subscribe(_80)(function (r$prime) {
                    return Debug_Trace.trace(r$prime);
                })();
                return new Data_Maybe.Just({
                    chart: _80
                });
            };
        };
    };
    return {
        controller: controller
    };
})();
var PS = PS || {};
PS.App_Presentables = (function () {
    "use strict";
    var Prelude = PS.Prelude;
    var Presentable_ViewParser = PS.Presentable_ViewParser;
    var App_Presentables_ChartSelector = PS.App_Presentables_ChartSelector;
    var App_Presentables_Foreign = PS.App_Presentables_Foreign;
    var App_Controller = PS.App_Controller;
    var registerPresentables = Presentable_ViewParser.register("Controller")(App_Controller.controller)(Presentable_ViewParser.register("Title")(App_Presentables_Foreign.linker("TitleLinker"))(Presentable_ViewParser.register("ChartSelector")(App_Presentables_ChartSelector.chartSelector)(Presentable_ViewParser.emptyRegistery)));
    return {
        registerPresentables: registerPresentables
    };
})();
var PS = PS || {};
PS.App_Routes = (function () {
    "use strict";
    var Prelude = PS.Prelude;
    var Data_Tuple = PS.Data_Tuple;
    var Control_Monad_Eff = PS.Control_Monad_Eff;
    var App_Presentables = PS.App_Presentables;
    var Presentable_ViewParser = PS.Presentable_ViewParser;
    var Data_Maybe = PS.Data_Maybe;
    var Presentable_Router = PS.Presentable_Router;
    window.yaml = window.yaml || {};;
    var rs = [ new Data_Tuple.Tuple({
        url: "/index", 
        title: "home", 
        data: {}
    }, yaml.index) ];
    var init = function __do() {
        Prelude[">>>"](Prelude.semigroupoidArr())(Presentable_ViewParser.renderYaml(Data_Maybe.Nothing.value))(Presentable_Router.route(rs))(App_Presentables.registerPresentables)();
        return Presentable_Router.initRoutes();
    };
    return {
        init: init, 
        rs: rs, 
        yaml: yaml
    };
})();
var PS = PS || {};
PS.Main = (function () {
    "use strict";
    var Prelude = PS.Prelude;
    var App_Routes = PS.App_Routes;
    var main = App_Routes.init;
    return {
        main: main
    };
})();
PS.Main.main();

