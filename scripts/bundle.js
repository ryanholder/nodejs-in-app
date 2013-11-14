/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/ 	
/******/ 	// The require function
/******/ 	function require(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/ 		
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/ 		
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, require);
/******/ 		
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/ 		
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// The bundle contains no chunks. A empty chunk loading function.
/******/ 	require.e = function requireEnsure(_, callback) {
/******/ 		callback.call(null, this);
/******/ 	};
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	require.modules = modules;
/******/ 	
/******/ 	// expose the module cache
/******/ 	require.cache = installedModules;
/******/ 	
/******/ 	
/******/ 	// Load entry module and return exports
/******/ 	return require(0);
/******/ })
/************************************************************************/
/******/ ({
/******/ // __webpack_public_path__
/******/ c: "",

/***/ 0:
/***/ function(module, exports, require) {

	onload = function() {

		var less = require(1);	

		var convertButton = document.querySelector('#convert-button');

		convertButton.addEventListener('click', function(e) {

			less.render(less_editor.getValue(), function (e, css) {
			    console.log(css);
			    css_output.setValue(css);
			});

	  	});

	};

/***/ },

/***/ 1:
/***/ function(module, exports, require) {

	/* WEBPACK VAR INJECTION */(function(require, process) {var path = require(16),
	    sys = require(17),
	    url = require(18),
	    request,
	    fs = require(19);

	var less = {
	    version: [1, 5, 0],
	    Parser: require(2).Parser,
	    tree: require(4),
	    render: function (input, options, callback) {
	        options = options || {};

	        if (typeof(options) === 'function') {
	            callback = options, options = {};
	        }

	        var parser = new(less.Parser)(options),
	            ee;

	        if (callback) {
	            parser.parse(input, function (e, root) {
	                try { callback(e, root && root.toCSS && root.toCSS(options)); } 
	                catch (err) { callback(err); }
	            });
	        } else {
	            ee = new (require(20).EventEmitter)();

	            process.nextTick(function () {
	                parser.parse(input, function (e, root) {
	                    if (e) { return ee.emit('error', e); }
	                    try { ee.emit('success', root.toCSS(options)); } 
	                    catch (err) { ee.emit('error', err); }
	                });
	            });
	            return ee;
	        }
	    },
	    formatError: function(ctx, options) {
	        options = options || {};

	        var message = "";
	        var extract = ctx.extract;
	        var error = [];
	        var stylize = options.color ? require(5).stylize : function (str) { return str; };

	        // only output a stack if it isn't a less error
	        if (ctx.stack && !ctx.type) { return stylize(ctx.stack, 'red'); }

	        if (!ctx.hasOwnProperty('index') || !extract) {
	            return ctx.stack || ctx.message;
	        }

	        if (typeof(extract[0]) === 'string') {
	            error.push(stylize((ctx.line - 1) + ' ' + extract[0], 'grey'));
	        }

	        if (typeof(extract[1]) === 'string') {
	            var errorTxt = ctx.line + ' ';
	            if (extract[1]) {
	                errorTxt += extract[1].slice(0, ctx.column) +
	                                stylize(stylize(stylize(extract[1][ctx.column], 'bold') +
	                                extract[1].slice(ctx.column + 1), 'red'), 'inverse');
	            }
	            error.push(errorTxt);
	        }

	        if (typeof(extract[2]) === 'string') {
	            error.push(stylize((ctx.line + 1) + ' ' + extract[2], 'grey'));
	        }
	        error = error.join('\n') + stylize('', 'reset') + '\n';

	        message += stylize(ctx.type + 'Error: ' + ctx.message, 'red');
	        ctx.filename && (message += stylize(' in ', 'red') + ctx.filename +
	                stylize(' on line ' + ctx.line + ', column ' + (ctx.column + 1) + ':', 'grey'));

	        message += '\n' + error;

	        if (ctx.callLine) {
	            message += stylize('from ', 'red') + (ctx.filename || '') + '/n';
	            message += stylize(ctx.callLine, 'grey') + ' ' + ctx.callExtract + '/n';
	        }

	        return message;
	    },
	    writeError: function (ctx, options) {
	        options = options || {};
	        if (options.silent) { return; }
	        sys.error(less.formatError(ctx, options));
	    }
	};

	['color',      'directive',  'operation',          'dimension',
	 'keyword',    'variable',   'ruleset',            'element',
	 'selector',   'quoted',     'expression',         'rule',
	 'call',       'url',        'alpha',              'import',
	 'mixin',      'comment',    'anonymous',          'value',
	 'javascript', 'assignment', 'condition',          'paren',
	 'media',      'unicode-descriptor', 'negative',   'extend'
	].forEach(function (n) {
	    require(3)("./" + n);
	});


	var isUrlRe = /^(?:https?:)?\/\//i;

	less.Parser.fileLoader = function (file, currentFileInfo, callback, env) {
	    var pathname, dirname, data,
	        newFileInfo = {
	            relativeUrls: env.relativeUrls,
	            entryPath: currentFileInfo.entryPath,
	            rootpath: currentFileInfo.rootpath,
	            rootFilename: currentFileInfo.rootFilename
	        };

	    function handleDataAndCallCallback(data) {
	        var j = file.lastIndexOf('/');

	        // Pass on an updated rootpath if path of imported file is relative and file 
	        // is in a (sub|sup) directory
	        // 
	        // Examples: 
	        // - If path of imported file is 'module/nav/nav.less' and rootpath is 'less/',
	        //   then rootpath should become 'less/module/nav/'
	        // - If path of imported file is '../mixins.less' and rootpath is 'less/', 
	        //   then rootpath should become 'less/../'
	        if(newFileInfo.relativeUrls && !/^(?:[a-z-]+:|\/)/.test(file) && j != -1) {
	            var relativeSubDirectory = file.slice(0, j+1);
	            newFileInfo.rootpath = newFileInfo.rootpath + relativeSubDirectory; // append (sub|sup) directory path of imported file
	        }
	        newFileInfo.currentDirectory = pathname.replace(/[^\\\/]*$/, "");
	        newFileInfo.filename = pathname;

	        callback(null, data, pathname, newFileInfo);
	    }
	    
	    var isUrl = isUrlRe.test( file );
	    if (isUrl || isUrlRe.test(currentFileInfo.currentDirectory)) {
	        if (request === undefined) {
	            try { request = require(49); }
	            catch(e) { request = null; }
	        }
	        if (!request) {
	            callback({ type: 'File', message: "optional dependency 'request' required to import over http(s)\n" });
	            return;
	        }

	        var urlStr = isUrl ? file : url.resolve(currentFileInfo.currentDirectory, file),
	            urlObj = url.parse(urlStr);

	        request.get(urlStr, function (error, res, body) {
	            if (res.statusCode === 404) {
	                callback({ type: 'File', message: "resource '" + urlStr + "' was not found\n" });
	                return;
	            }
	            if (!body) {
	                sys.error( 'Warning: Empty body (HTTP '+ res.statusCode + ') returned by "' + urlStr +'"' );
	            }
	            if (error) {
	                callback({ type: 'File', message: "resource '" + urlStr + "' gave this Error:\n  "+ error +"\n" });
	            }
	            pathname = urlStr;
	            dirname = urlObj.protocol +'//'+ urlObj.host + urlObj.pathname.replace(/[^\/]*$/, '');
	            handleDataAndCallCallback(body);
	        });
	    } else {

	        var paths = [currentFileInfo.currentDirectory].concat(env.paths);
	        paths.push('.');

	        for (var i = 0; i < paths.length; i++) {
	            try {
	                pathname = path.join(paths[i], file);
	                fs.statSync(pathname);
	                break;
	            } catch (e) {
	                pathname = null;
	            }
	        }
	        
	        if (!pathname) {

	            callback({ type: 'File', message: "'" + file + "' wasn't found" });
	            return;
	        }
	        
	        dirname = path.dirname(pathname);

	        if (env.syncImport) {
	            try {
	                data = fs.readFileSync(pathname, 'utf-8');
	                handleDataAndCallCallback(data);
	            } catch (e) {
	                callback(e);
	            }
	        } else {
	            fs.readFile(pathname, 'utf-8', function(e, data) {
	                if (e) { callback(e); }
	                handleDataAndCallCallback(data);
	            });
	        }
	    }
	};

	require(6);
	require(7);
	require(8);
	require(9);
	require(10);
	require(11);
	require(12);
	require(13);
	require(14);

	for (var k in less) { exports[k] = less[k]; }
	
	/* WEBPACK VAR INJECTION */}.call(exports, require, require(15)))

/***/ },

/***/ 2:
/***/ function(module, exports, require) {

	var less, tree;

	// Node.js does not have a header file added which defines less
	if (less === undefined) {
	    less = exports;
	    tree = require(4);
	    less.mode = 'node';
	}
	//
	// less.js - parser
	//
	//    A relatively straight-forward predictive parser.
	//    There is no tokenization/lexing stage, the input is parsed
	//    in one sweep.
	//
	//    To make the parser fast enough to run in the browser, several
	//    optimization had to be made:
	//
	//    - Matching and slicing on a huge input is often cause of slowdowns.
	//      The solution is to chunkify the input into smaller strings.
	//      The chunks are stored in the `chunks` var,
	//      `j` holds the current chunk index, and `current` holds
	//      the index of the current chunk in relation to `input`.
	//      This gives us an almost 4x speed-up.
	//
	//    - In many cases, we don't need to match individual tokens;
	//      for example, if a value doesn't hold any variables, operations
	//      or dynamic references, the parser can effectively 'skip' it,
	//      treating it as a literal.
	//      An example would be '1px solid #000' - which evaluates to itself,
	//      we don't need to know what the individual components are.
	//      The drawback, of course is that you don't get the benefits of
	//      syntax-checking on the CSS. This gives us a 50% speed-up in the parser,
	//      and a smaller speed-up in the code-gen.
	//
	//
	//    Token matching is done with the `$` function, which either takes
	//    a terminal string or regexp, or a non-terminal function to call.
	//    It also takes care of moving all the indices forwards.
	//
	//
	less.Parser = function Parser(env) {
	    var input,       // LeSS input string
	        i,           // current index in `input`
	        j,           // current chunk
	        temp,        // temporarily holds a chunk's state, for backtracking
	        memo,        // temporarily holds `i`, when backtracking
	        furthest,    // furthest index the parser has gone to
	        chunks,      // chunkified input
	        current,     // index of current chunk, in `input`
	        parser;

	    // Top parser on an import tree must be sure there is one "env"
	    // which will then be passed around by reference.
	    if (!(env instanceof tree.parseEnv)) {
	        env = new tree.parseEnv(env);
	    }

	    var imports = this.imports = {
	        paths: env.paths || [],  // Search paths, when importing
	        queue: [],               // Files which haven't been imported yet
	        files: env.files,        // Holds the imported parse trees
	        contents: env.contents,  // Holds the imported file contents
	        mime:  env.mime,         // MIME type of .less files
	        error: null,             // Error in parsing/evaluating an import
	        push: function (path, currentFileInfo, importOptions, callback) {
	            var parserImports = this;
	            this.queue.push(path);

	            var fileParsedFunc = function (e, root, fullPath) {
	                parserImports.queue.splice(parserImports.queue.indexOf(path), 1); // Remove the path from the queue

	                var importedPreviously = fullPath in parserImports.files;

	                parserImports.files[fullPath] = root;                        // Store the root

	                if (e && !parserImports.error) { parserImports.error = e; }

	                callback(e, root, importedPreviously);
	            };

	            if (less.Parser.importer) {
	                less.Parser.importer(path, currentFileInfo, fileParsedFunc, env);
	            } else {
	                less.Parser.fileLoader(path, currentFileInfo, function(e, contents, fullPath, newFileInfo) {
	                    if (e) {fileParsedFunc(e); return;}

	                    var newEnv = new tree.parseEnv(env);

	                    newEnv.currentFileInfo = newFileInfo;
	                    newEnv.processImports = false;
	                    newEnv.contents[fullPath] = contents;

	                    if (currentFileInfo.reference || importOptions.reference) {
	                        newFileInfo.reference = true;
	                    }

	                    if (importOptions.inline) {
	                        fileParsedFunc(null, contents, fullPath);
	                    } else {
	                        new(less.Parser)(newEnv).parse(contents, function (e, root) {
	                            fileParsedFunc(e, root, fullPath);
	                        });
	                    }
	                }, env);
	            }
	        }
	    };

	    function save()    { temp = chunks[j], memo = i, current = i; }
	    function restore() { chunks[j] = temp, i = memo, current = i; }

	    function sync() {
	        if (i > current) {
	            chunks[j] = chunks[j].slice(i - current);
	            current = i;
	        }
	    }
	    function isWhitespace(c) {
	        // Could change to \s?
	        var code = c.charCodeAt(0);
	        return code === 32 || code === 10 || code === 9;
	    }
	    //
	    // Parse from a token, regexp or string, and move forward if match
	    //
	    function $(tok) {
	        var match, length;

	        //
	        // Non-terminal
	        //
	        if (tok instanceof Function) {
	            return tok.call(parser.parsers);
	        //
	        // Terminal
	        //
	        //     Either match a single character in the input,
	        //     or match a regexp in the current chunk (chunk[j]).
	        //
	        } else if (typeof(tok) === 'string') {
	            match = input.charAt(i) === tok ? tok : null;
	            length = 1;
	            sync ();
	        } else {
	            sync ();

	            if (match = tok.exec(chunks[j])) {
	                length = match[0].length;
	            } else {
	                return null;
	            }
	        }

	        // The match is confirmed, add the match length to `i`,
	        // and consume any extra white-space characters (' ' || '\n')
	        // which come after that. The reason for this is that LeSS's
	        // grammar is mostly white-space insensitive.
	        //
	        if (match) {
	            skipWhitespace(length);

	            if(typeof(match) === 'string') {
	                return match;
	            } else {
	                return match.length === 1 ? match[0] : match;
	            }
	        }
	    }

	    function skipWhitespace(length) {
	        var oldi = i, oldj = j,
	            endIndex = i + chunks[j].length,
	            mem = i += length;

	        while (i < endIndex) {
	            if (! isWhitespace(input.charAt(i))) { break; }
	            i++;
	        }
	        chunks[j] = chunks[j].slice(length + (i - mem));
	        current = i;

	        if (chunks[j].length === 0 && j < chunks.length - 1) { j++; }

	        return oldi !== i || oldj !== j;
	    }

	    function expect(arg, msg) {
	        var result = $(arg);
	        if (! result) {
	            error(msg || (typeof(arg) === 'string' ? "expected '" + arg + "' got '" + input.charAt(i) + "'"
	                                                   : "unexpected token"));
	        } else {
	            return result;
	        }
	    }

	    function error(msg, type) {
	        var e = new Error(msg);
	        e.index = i;
	        e.type = type || 'Syntax';
	        throw e;
	    }

	    // Same as $(), but don't change the state of the parser,
	    // just return the match.
	    function peek(tok) {
	        if (typeof(tok) === 'string') {
	            return input.charAt(i) === tok;
	        } else {
	            return tok.test(chunks[j]);
	        }
	    }

	    function getInput(e, env) {
	        if (e.filename && env.currentFileInfo.filename && (e.filename !== env.currentFileInfo.filename)) {
	            return parser.imports.contents[e.filename];
	        } else {
	            return input;
	        }
	    }

	    function getLocation(index, inputStream) {
	        var n = index + 1,
	            line = null,
	            column = -1;

	        while (--n >= 0 && inputStream.charAt(n) !== '\n') {
	            column++;
	        }

	        if (typeof index === 'number') {
	            line = (inputStream.slice(0, index).match(/\n/g) || "").length;
	        }

	        return {
	            line: line,
	            column: column
	        };
	    }

	    function getDebugInfo(index, inputStream, env) {
	        var filename = env.currentFileInfo.filename;
	        if(less.mode !== 'browser' && less.mode !== 'rhino') {
	            filename = require(16).resolve(filename);
	        }

	        return {
	            lineNumber: getLocation(index, inputStream).line + 1,
	            fileName: filename
	        };
	    }

	    function LessError(e, env) {
	        var input = getInput(e, env),
	            loc = getLocation(e.index, input),
	            line = loc.line,
	            col  = loc.column,
	            callLine = e.call && getLocation(e.call, input).line,
	            lines = input.split('\n');

	        this.type = e.type || 'Syntax';
	        this.message = e.message;
	        this.filename = e.filename || env.currentFileInfo.filename;
	        this.index = e.index;
	        this.line = typeof(line) === 'number' ? line + 1 : null;
	        this.callLine = callLine + 1;
	        this.callExtract = lines[callLine];
	        this.stack = e.stack;
	        this.column = col;
	        this.extract = [
	            lines[line - 1],
	            lines[line],
	            lines[line + 1]
	        ];
	    }

	    LessError.prototype = new Error();
	    LessError.prototype.constructor = LessError;

	    this.env = env = env || {};

	    // The optimization level dictates the thoroughness of the parser,
	    // the lower the number, the less nodes it will create in the tree.
	    // This could matter for debugging, or if you want to access
	    // the individual nodes in the tree.
	    this.optimization = ('optimization' in this.env) ? this.env.optimization : 1;

	    //
	    // The Parser
	    //
	    return parser = {

	        imports: imports,
	        //
	        // Parse an input string into an abstract syntax tree,
	        // call `callback` when done.
	        //
	        parse: function (str, callback) {
	            var root, line, lines, error = null;

	            i = j = current = furthest = 0;
	            input = str.replace(/\r\n/g, '\n');

	            // Remove potential UTF Byte Order Mark
	            input = input.replace(/^\uFEFF/, '');

	            parser.imports.contents[env.currentFileInfo.filename] = input;

	            // Split the input into chunks.
	            chunks = (function (chunks) {
	                var j = 0,
	                    skip = /(?:@\{[\w-]+\}|[^"'`\{\}\/\(\)\\])+/g,
	                    comment = /\/\*(?:[^*]|\*+[^\/*])*\*+\/|\/\/.*/g,
	                    string = /"((?:[^"\\\r\n]|\\.)*)"|'((?:[^'\\\r\n]|\\.)*)'|`((?:[^`]|\\.)*)`/g,
	                    level = 0,
	                    match,
	                    chunk = chunks[0],
	                    inParam;

	                for (var i = 0, c, cc; i < input.length;) {
	                    skip.lastIndex = i;
	                    if (match = skip.exec(input)) {
	                        if (match.index === i) {
	                            i += match[0].length;
	                            chunk.push(match[0]);
	                        }
	                    }
	                    c = input.charAt(i);
	                    comment.lastIndex = string.lastIndex = i;

	                    if (match = string.exec(input)) {
	                        if (match.index === i) {
	                            i += match[0].length;
	                            chunk.push(match[0]);
	                            continue;
	                        }
	                    }

	                    if (!inParam && c === '/') {
	                        cc = input.charAt(i + 1);
	                        if (cc === '/' || cc === '*') {
	                            if (match = comment.exec(input)) {
	                                if (match.index === i) {
	                                    i += match[0].length;
	                                    chunk.push(match[0]);
	                                    continue;
	                                }
	                            }
	                        }
	                    }
	                    
	                    switch (c) {
	                        case '{':
	                            if (!inParam) {
	                                level++;
	                                chunk.push(c);
	                                break;
	                            }
	                            /* falls through */
	                        case '}':
	                            if (!inParam) {
	                                level--;
	                                chunk.push(c);
	                                chunks[++j] = chunk = [];
	                                break;
	                            }
	                            /* falls through */
	                        case '(':
	                            if (!inParam) {
	                                inParam = true;
	                                chunk.push(c);
	                                break;
	                            }
	                            /* falls through */
	                        case ')':
	                            if (inParam) {
	                                inParam = false;
	                                chunk.push(c);
	                                break;
	                            }
	                            /* falls through */
	                        default:
	                            chunk.push(c);
	                    }
	                    
	                    i++;
	                }
	                if (level !== 0) {
	                    error = new(LessError)({
	                        index: i-1,
	                        type: 'Parse',
	                        message: (level > 0) ? "missing closing `}`" : "missing opening `{`",
	                        filename: env.currentFileInfo.filename
	                    }, env);
	                }

	                return chunks.map(function (c) { return c.join(''); });
	            })([[]]);

	            if (error) {
	                return callback(new(LessError)(error, env));
	            }

	            // Start with the primary rule.
	            // The whole syntax tree is held under a Ruleset node,
	            // with the `root` property set to true, so no `{}` are
	            // output. The callback is called when the input is parsed.
	            try {
	                root = new(tree.Ruleset)([], $(this.parsers.primary));
	                root.root = true;
	                root.firstRoot = true;
	            } catch (e) {
	                return callback(new(LessError)(e, env));
	            }

	            root.toCSS = (function (evaluate) {
	                return function (options, variables) {
	                    options = options || {};
	                    var evaldRoot,
	                        css,
	                        evalEnv = new tree.evalEnv(options);
	                        
	                    //
	                    // Allows setting variables with a hash, so:
	                    //
	                    //   `{ color: new(tree.Color)('#f01') }` will become:
	                    //
	                    //   new(tree.Rule)('@color',
	                    //     new(tree.Value)([
	                    //       new(tree.Expression)([
	                    //         new(tree.Color)('#f01')
	                    //       ])
	                    //     ])
	                    //   )
	                    //
	                    if (typeof(variables) === 'object' && !Array.isArray(variables)) {
	                        variables = Object.keys(variables).map(function (k) {
	                            var value = variables[k];

	                            if (! (value instanceof tree.Value)) {
	                                if (! (value instanceof tree.Expression)) {
	                                    value = new(tree.Expression)([value]);
	                                }
	                                value = new(tree.Value)([value]);
	                            }
	                            return new(tree.Rule)('@' + k, value, false, null, 0);
	                        });
	                        evalEnv.frames = [new(tree.Ruleset)(null, variables)];
	                    }

	                    try {
	                        evaldRoot = evaluate.call(this, evalEnv);

	                        new(tree.joinSelectorVisitor)()
	                            .run(evaldRoot);

	                        new(tree.processExtendsVisitor)()
	                            .run(evaldRoot);

	                        new(tree.toCSSVisitor)({compress: Boolean(options.compress)})
	                            .run(evaldRoot);

	                        if (options.sourceMap) {
	                            evaldRoot = new tree.sourceMapOutput(
	                                {
	                                    writeSourceMap: options.writeSourceMap,
	                                    rootNode: evaldRoot,
	                                    contentsMap: parser.imports.contents,
	                                    sourceMapFilename: options.sourceMapFilename,
	                                    outputFilename: options.sourceMapOutputFilename,
	                                    sourceMapBasepath: options.sourceMapBasepath,
	                                    sourceMapRootpath: options.sourceMapRootpath,
	                                    outputSourceFiles: options.outputSourceFiles
	                                });
	                        }

	                        css = evaldRoot.toCSS({
	                                compress: Boolean(options.compress),
	                                dumpLineNumbers: env.dumpLineNumbers,
	                                strictUnits: Boolean(options.strictUnits)});
	                    } catch (e) {
	                        throw new(LessError)(e, env);
	                    }

	                    if (options.cleancss && less.mode === 'node') {
	                        return require(61).process(css);
	                    } else if (options.compress) {
	                        return css.replace(/(^(\s)+)|((\s)+$)/g, "");
	                    } else {
	                        return css;
	                    }
	                };
	            })(root.eval);

	            // If `i` is smaller than the `input.length - 1`,
	            // it means the parser wasn't able to parse the whole
	            // string, so we've got a parsing error.
	            //
	            // We try to extract a \n delimited string,
	            // showing the line where the parse error occured.
	            // We split it up into two parts (the part which parsed,
	            // and the part which didn't), so we can color them differently.
	            if (i < input.length - 1) {
	                i = furthest;
	                var loc = getLocation(i, input);
	                lines = input.split('\n');
	                line = loc.line + 1;

	                error = {
	                    type: "Parse",
	                    message: "Unrecognised input",
	                    index: i,
	                    filename: env.currentFileInfo.filename,
	                    line: line,
	                    column: loc.column,
	                    extract: [
	                        lines[line - 2],
	                        lines[line - 1],
	                        lines[line]
	                    ]
	                };
	            }

	            var finish = function (e) {
	                e = error || e || parser.imports.error;

	                if (e) {
	                    if (!(e instanceof LessError)) {
	                        e = new(LessError)(e, env);
	                    }

	                    callback(e);
	                }
	                else {
	                    callback(null, root);
	                }
	            };

	            if (env.processImports !== false) {
	                new tree.importVisitor(this.imports, finish)
	                    .run(root);
	            } else {
	                finish();
	            }
	        },

	        //
	        // Here in, the parsing rules/functions
	        //
	        // The basic structure of the syntax tree generated is as follows:
	        //
	        //   Ruleset ->  Rule -> Value -> Expression -> Entity
	        //
	        // Here's some LESS code:
	        //
	        //    .class {
	        //      color: #fff;
	        //      border: 1px solid #000;
	        //      width: @w + 4px;
	        //      > .child {...}
	        //    }
	        //
	        // And here's what the parse tree might look like:
	        //
	        //     Ruleset (Selector '.class', [
	        //         Rule ("color",  Value ([Expression [Color #fff]]))
	        //         Rule ("border", Value ([Expression [Dimension 1px][Keyword "solid"][Color #000]]))
	        //         Rule ("width",  Value ([Expression [Operation "+" [Variable "@w"][Dimension 4px]]]))
	        //         Ruleset (Selector [Element '>', '.child'], [...])
	        //     ])
	        //
	        //  In general, most rules will try to parse a token with the `$()` function, and if the return
	        //  value is truly, will return a new node, of the relevant type. Sometimes, we need to check
	        //  first, before parsing, that's when we use `peek()`.
	        //
	        parsers: {
	            //
	            // The `primary` rule is the *entry* and *exit* point of the parser.
	            // The rules here can appear at any level of the parse tree.
	            //
	            // The recursive nature of the grammar is an interplay between the `block`
	            // rule, which represents `{ ... }`, the `ruleset` rule, and this `primary` rule,
	            // as represented by this simplified grammar:
	            //
	            //     primary  →  (ruleset | rule)+
	            //     ruleset  →  selector+ block
	            //     block    →  '{' primary '}'
	            //
	            // Only at one point is the primary rule not called from the
	            // block rule: at the root level.
	            //
	            primary: function () {
	                var node, root = [];

	                while ((node = $(this.extendRule) || $(this.mixin.definition) || $(this.rule)    ||  $(this.ruleset) ||
	                               $(this.mixin.call)       || $(this.comment) ||  $(this.directive))
	                               || $(/^[\s\n]+/) || $(/^;+/)) {
	                    node && root.push(node);
	                }
	                return root;
	            },

	            // We create a Comment node for CSS comments `/* */`,
	            // but keep the LeSS comments `//` silent, by just skipping
	            // over them.
	            comment: function () {
	                var comment;

	                if (input.charAt(i) !== '/') { return; }

	                if (input.charAt(i + 1) === '/') {
	                    return new(tree.Comment)($(/^\/\/.*/), true, i, env.currentFileInfo);
	                } else if (comment = $(/^\/\*(?:[^*]|\*+[^\/*])*\*+\/\n?/)) {
	                    return new(tree.Comment)(comment, false, i, env.currentFileInfo);
	                }
	            },

	            comments: function () {
	                var comment, comments = [];

	                while(comment = $(this.comment)) {
	                    comments.push(comment);
	                }

	                return comments;
	            },

	            //
	            // Entities are tokens which can be found inside an Expression
	            //
	            entities: {
	                //
	                // A string, which supports escaping " and '
	                //
	                //     "milky way" 'he\'s the one!'
	                //
	                quoted: function () {
	                    var str, j = i, e, index = i;

	                    if (input.charAt(j) === '~') { j++, e = true; } // Escaped strings
	                    if (input.charAt(j) !== '"' && input.charAt(j) !== "'") { return; }

	                    e && $('~');

	                    if (str = $(/^"((?:[^"\\\r\n]|\\.)*)"|'((?:[^'\\\r\n]|\\.)*)'/)) {
	                        return new(tree.Quoted)(str[0], str[1] || str[2], e, index, env.currentFileInfo);
	                    }
	                },

	                //
	                // A catch-all word, such as:
	                //
	                //     black border-collapse
	                //
	                keyword: function () {
	                    var k;

	                    if (k = $(/^[_A-Za-z-][_A-Za-z0-9-]*/)) {
	                        if (tree.colors.hasOwnProperty(k)) {
	                            // detect named color
	                            return new(tree.Color)(tree.colors[k].slice(1));
	                        } else {
	                            return new(tree.Keyword)(k);
	                        }
	                    }
	                },

	                //
	                // A function call
	                //
	                //     rgb(255, 0, 255)
	                //
	                // We also try to catch IE's `alpha()`, but let the `alpha` parser
	                // deal with the details.
	                //
	                // The arguments are parsed with the `entities.arguments` parser.
	                //
	                call: function () {
	                    var name, nameLC, args, alpha_ret, index = i;

	                    if (! (name = /^([\w-]+|%|progid:[\w\.]+)\(/.exec(chunks[j]))) { return; }

	                    name = name[1];
	                    nameLC = name.toLowerCase();

	                    if (nameLC === 'url') { return null; }
	                    else                  { i += name.length; }

	                    if (nameLC === 'alpha') {
	                        alpha_ret = $(this.alpha);
	                        if(typeof alpha_ret !== 'undefined') {
	                            return alpha_ret;
	                        }
	                    }

	                    $('('); // Parse the '(' and consume whitespace.

	                    args = $(this.entities.arguments);

	                    if (! $(')')) {
	                        return;
	                    }

	                    if (name) { return new(tree.Call)(name, args, index, env.currentFileInfo); }
	                },
	                arguments: function () {
	                    var args = [], arg;

	                    while (arg = $(this.entities.assignment) || $(this.expression)) {
	                        args.push(arg);
	                        if (! $(',')) {
	                            break;
	                        }
	                    }
	                    return args;
	                },
	                literal: function () {
	                    return $(this.entities.dimension) ||
	                           $(this.entities.color) ||
	                           $(this.entities.quoted) ||
	                           $(this.entities.unicodeDescriptor);
	                },

	                // Assignments are argument entities for calls.
	                // They are present in ie filter properties as shown below.
	                //
	                //     filter: progid:DXImageTransform.Microsoft.Alpha( *opacity=50* )
	                //

	                assignment: function () {
	                    var key, value;
	                    if ((key = $(/^\w+(?=\s?=)/i)) && $('=') && (value = $(this.entity))) {
	                        return new(tree.Assignment)(key, value);
	                    }
	                },

	                //
	                // Parse url() tokens
	                //
	                // We use a specific rule for urls, because they don't really behave like
	                // standard function calls. The difference is that the argument doesn't have
	                // to be enclosed within a string, so it can't be parsed as an Expression.
	                //
	                url: function () {
	                    var value;

	                    if (input.charAt(i) !== 'u' || !$(/^url\(/)) {
	                        return;
	                    }

	                    value = $(this.entities.quoted)  || $(this.entities.variable) ||
	                            $(/^(?:(?:\\[\(\)'"])|[^\(\)'"])+/) || "";

	                    expect(')');

	                    /*jshint eqnull:true */
	                    return new(tree.URL)((value.value != null || value instanceof tree.Variable)
	                                        ? value : new(tree.Anonymous)(value), env.currentFileInfo);
	                },

	                //
	                // A Variable entity, such as `@fink`, in
	                //
	                //     width: @fink + 2px
	                //
	                // We use a different parser for variable definitions,
	                // see `parsers.variable`.
	                //
	                variable: function () {
	                    var name, index = i;

	                    if (input.charAt(i) === '@' && (name = $(/^@@?[\w-]+/))) {
	                        return new(tree.Variable)(name, index, env.currentFileInfo);
	                    }
	                },

	                // A variable entity useing the protective {} e.g. @{var}
	                variableCurly: function () {
	                    var curly, index = i;

	                    if (input.charAt(i) === '@' && (curly = $(/^@\{([\w-]+)\}/))) {
	                        return new(tree.Variable)("@" + curly[1], index, env.currentFileInfo);
	                    }
	                },

	                //
	                // A Hexadecimal color
	                //
	                //     #4F3C2F
	                //
	                // `rgb` and `hsl` colors are parsed through the `entities.call` parser.
	                //
	                color: function () {
	                    var rgb;

	                    if (input.charAt(i) === '#' && (rgb = $(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})/))) {
	                        return new(tree.Color)(rgb[1]);
	                    }
	                },

	                //
	                // A Dimension, that is, a number and a unit
	                //
	                //     0.5em 95%
	                //
	                dimension: function () {
	                    var value, c = input.charCodeAt(i);
	                    //Is the first char of the dimension 0-9, '.', '+' or '-'
	                    if ((c > 57 || c < 43) || c === 47 || c == 44) {
	                        return;
	                    }

	                    if (value = $(/^([+-]?\d*\.?\d+)(%|[a-z]+)?/)) {
	                        return new(tree.Dimension)(value[1], value[2]);
	                    }
	                },

	                //
	                // A unicode descriptor, as is used in unicode-range
	                //
	                // U+0??  or U+00A1-00A9
	                //
	                unicodeDescriptor: function () {
	                    var ud;
	                    
	                    if (ud = $(/^U\+[0-9a-fA-F?]+(\-[0-9a-fA-F?]+)?/)) {
	                        return new(tree.UnicodeDescriptor)(ud[0]);
	                    }
	                },

	                //
	                // JavaScript code to be evaluated
	                //
	                //     `window.location.href`
	                //
	                javascript: function () {
	                    var str, j = i, e;

	                    if (input.charAt(j) === '~') { j++; e = true; } // Escaped strings
	                    if (input.charAt(j) !== '`') { return; }
	                    if (env.javascriptEnabled !== undefined && !env.javascriptEnabled) {
	                        error("You are using JavaScript, which has been disabled.");
	                    }

	                    if (e) { $('~'); }

	                    if (str = $(/^`([^`]*)`/)) {
	                        return new(tree.JavaScript)(str[1], i, e);
	                    }
	                }
	            },

	            //
	            // The variable part of a variable definition. Used in the `rule` parser
	            //
	            //     @fink:
	            //
	            variable: function () {
	                var name;

	                if (input.charAt(i) === '@' && (name = $(/^(@[\w-]+)\s*:/))) { return name[1]; }
	            },

	            //
	            // extend syntax - used to extend selectors
	            //
	            extend: function(isRule) {
	                var elements, e, index = i, option, extendList = [];

	                if (!$(isRule ? /^&:extend\(/ : /^:extend\(/)) { return; }

	                do {
	                    option = null;
	                    elements = [];
	                    while (true) {
	                        option = $(/^(all)(?=\s*(\)|,))/);
	                        if (option) { break; }
	                        e = $(this.element);
	                        if (!e) { break; }
	                        elements.push(e);
	                    }

	                    option = option && option[1];

	                    extendList.push(new(tree.Extend)(new(tree.Selector)(elements), option, index));

	                } while($(","));
	                
	                expect(/^\)/);

	                if (isRule) {
	                    expect(/^;/);
	                }

	                return extendList;
	            },

	            //
	            // extendRule - used in a rule to extend all the parent selectors
	            //
	            extendRule: function() {
	                return this.extend(true);
	            },
	            
	            //
	            // Mixins
	            //
	            mixin: {
	                //
	                // A Mixin call, with an optional argument list
	                //
	                //     #mixins > .square(#fff);
	                //     .rounded(4px, black);
	                //     .button;
	                //
	                // The `while` loop is there because mixins can be
	                // namespaced, but we only support the child and descendant
	                // selector for now.
	                //
	                call: function () {
	                    var elements = [], e, c, args, index = i, s = input.charAt(i), important = false;

	                    if (s !== '.' && s !== '#') { return; }

	                    save(); // stop us absorbing part of an invalid selector

	                    while (e = $(/^[#.](?:[\w-]|\\(?:[A-Fa-f0-9]{1,6} ?|[^A-Fa-f0-9]))+/)) {
	                        elements.push(new(tree.Element)(c, e, i, env.currentFileInfo));
	                        c = $('>');
	                    }
	                    if ($('(')) {
	                        args = this.mixin.args.call(this, true).args;
	                        expect(')');
	                    }

	                    args = args || [];

	                    if ($(this.important)) {
	                        important = true;
	                    }

	                    if (elements.length > 0 && ($(';') || peek('}'))) {
	                        return new(tree.mixin.Call)(elements, args, index, env.currentFileInfo, important);
	                    }

	                    restore();
	                },
	                args: function (isCall) {
	                    var expressions = [], argsSemiColon = [], isSemiColonSeperated, argsComma = [], expressionContainsNamed, name, nameLoop, value, arg,
	                        returner = {args:null, variadic: false};
	                    while (true) {
	                        if (isCall) {
	                            arg = $(this.expression);
	                        } else {
	                            $(this.comments);
	                            if (input.charAt(i) === '.' && $(/^\.{3}/)) {
	                                returner.variadic = true;
	                                if ($(";") && !isSemiColonSeperated) {
	                                    isSemiColonSeperated = true;
	                                }
	                                (isSemiColonSeperated ? argsSemiColon : argsComma)
	                                    .push({ variadic: true });
	                                break;
	                            }
	                            arg = $(this.entities.variable) || $(this.entities.literal)
	                                || $(this.entities.keyword);
	                        }

	                        if (!arg) {
	                            break;
	                        }

	                        nameLoop = null;
	                        if (arg.throwAwayComments) {
	                            arg.throwAwayComments();
	                        }
	                        value = arg;
	                        var val = null;

	                        if (isCall) {
	                            // Variable
	                            if (arg.value.length == 1) {
	                                val = arg.value[0];
	                            }
	                        } else {
	                            val = arg;
	                        }

	                        if (val && val instanceof tree.Variable) {
	                            if ($(':')) {
	                                if (expressions.length > 0) {
	                                    if (isSemiColonSeperated) {
	                                        error("Cannot mix ; and , as delimiter types");
	                                    }
	                                    expressionContainsNamed = true;
	                                }
	                                value = expect(this.expression);
	                                nameLoop = (name = val.name);
	                            } else if (!isCall && $(/^\.{3}/)) {
	                                returner.variadic = true;
	                                if ($(";") && !isSemiColonSeperated) {
	                                    isSemiColonSeperated = true;
	                                }
	                                (isSemiColonSeperated ? argsSemiColon : argsComma)
	                                    .push({ name: arg.name, variadic: true });
	                                break;
	                            } else if (!isCall) {
	                                name = nameLoop = val.name;
	                                value = null;
	                            }
	                        }

	                        if (value) {
	                            expressions.push(value);
	                        }

	                        argsComma.push({ name:nameLoop, value:value });

	                        if ($(',')) {
	                            continue;
	                        }

	                        if ($(';') || isSemiColonSeperated) {

	                            if (expressionContainsNamed) {
	                                error("Cannot mix ; and , as delimiter types");
	                            }

	                            isSemiColonSeperated = true;

	                            if (expressions.length > 1) {
	                                value = new(tree.Value)(expressions);
	                            }
	                            argsSemiColon.push({ name:name, value:value });

	                            name = null;
	                            expressions = [];
	                            expressionContainsNamed = false;
	                        }
	                    }

	                    returner.args = isSemiColonSeperated ? argsSemiColon : argsComma;
	                    return returner;
	                },
	                //
	                // A Mixin definition, with a list of parameters
	                //
	                //     .rounded (@radius: 2px, @color) {
	                //        ...
	                //     }
	                //
	                // Until we have a finer grained state-machine, we have to
	                // do a look-ahead, to make sure we don't have a mixin call.
	                // See the `rule` function for more information.
	                //
	                // We start by matching `.rounded (`, and then proceed on to
	                // the argument list, which has optional default values.
	                // We store the parameters in `params`, with a `value` key,
	                // if there is a value, such as in the case of `@radius`.
	                //
	                // Once we've got our params list, and a closing `)`, we parse
	                // the `{...}` block.
	                //
	                definition: function () {
	                    var name, params = [], match, ruleset, cond, variadic = false;
	                    if ((input.charAt(i) !== '.' && input.charAt(i) !== '#') ||
	                        peek(/^[^{]*\}/)) {
	                        return;
	                    }

	                    save();

	                    if (match = $(/^([#.](?:[\w-]|\\(?:[A-Fa-f0-9]{1,6} ?|[^A-Fa-f0-9]))+)\s*\(/)) {
	                        name = match[1];

	                        var argInfo = this.mixin.args.call(this, false);
	                        params = argInfo.args;
	                        variadic = argInfo.variadic;

	                        // .mixincall("@{a}");
	                        // looks a bit like a mixin definition.. so we have to be nice and restore
	                        if (!$(')')) {
	                            furthest = i;
	                            restore();
	                        }
	                        
	                        $(this.comments);

	                        if ($(/^when/)) { // Guard
	                            cond = expect(this.conditions, 'expected condition');
	                        }

	                        ruleset = $(this.block);

	                        if (ruleset) {
	                            return new(tree.mixin.Definition)(name, params, ruleset, cond, variadic);
	                        } else {
	                            restore();
	                        }
	                    }
	                }
	            },

	            //
	            // Entities are the smallest recognized token,
	            // and can be found inside a rule's value.
	            //
	            entity: function () {
	                return $(this.entities.literal) || $(this.entities.variable) || $(this.entities.url) ||
	                       $(this.entities.call)    || $(this.entities.keyword)  ||$(this.entities.javascript) ||
	                       $(this.comment);
	            },

	            //
	            // A Rule terminator. Note that we use `peek()` to check for '}',
	            // because the `block` rule will be expecting it, but we still need to make sure
	            // it's there, if ';' was ommitted.
	            //
	            end: function () {
	                return $(';') || peek('}');
	            },

	            //
	            // IE's alpha function
	            //
	            //     alpha(opacity=88)
	            //
	            alpha: function () {
	                var value;

	                if (! $(/^\(opacity=/i)) { return; }
	                if (value = $(/^\d+/) || $(this.entities.variable)) {
	                    expect(')');
	                    return new(tree.Alpha)(value);
	                }
	            },

	            //
	            // A Selector Element
	            //
	            //     div
	            //     + h1
	            //     #socks
	            //     input[type="text"]
	            //
	            // Elements are the building blocks for Selectors,
	            // they are made out of a `Combinator` (see combinator rule),
	            // and an element name, such as a tag a class, or `*`.
	            //
	            element: function () {
	                var e, c, v;

	                c = $(this.combinator);

	                e = $(/^(?:\d+\.\d+|\d+)%/) || $(/^(?:[.#]?|:*)(?:[\w-]|[^\x00-\x9f]|\\(?:[A-Fa-f0-9]{1,6} ?|[^A-Fa-f0-9]))+/) ||
	                    $('*') || $('&') || $(this.attribute) || $(/^\([^()@]+\)/) || $(/^[\.#](?=@)/) || $(this.entities.variableCurly);

	                if (! e) {
	                    if ($('(')) {
	                        if ((v = ($(this.selector))) &&
	                                $(')')) {
	                            e = new(tree.Paren)(v);
	                        }
	                    }
	                }

	                if (e) { return new(tree.Element)(c, e, i, env.currentFileInfo); }
	            },

	            //
	            // Combinators combine elements together, in a Selector.
	            //
	            // Because our parser isn't white-space sensitive, special care
	            // has to be taken, when parsing the descendant combinator, ` `,
	            // as it's an empty space. We have to check the previous character
	            // in the input, to see if it's a ` ` character. More info on how
	            // we deal with this in *combinator.js*.
	            //
	            combinator: function () {
	                var c = input.charAt(i);

	                if (c === '>' || c === '+' || c === '~' || c === '|') {
	                    i++;
	                    while (input.charAt(i).match(/\s/)) { i++; }
	                    return new(tree.Combinator)(c);
	                } else if (input.charAt(i - 1).match(/\s/)) {
	                    return new(tree.Combinator)(" ");
	                } else {
	                    return new(tree.Combinator)(null);
	                }
	            },
	            //
	            // A CSS selector (see selector below)
	            // with less extensions e.g. the ability to extend and guard
	            //
	            lessSelector: function () {
	                return this.selector(true);
	            },
	            //
	            // A CSS Selector
	            //
	            //     .class > div + h1
	            //     li a:hover
	            //
	            // Selectors are made out of one or more Elements, see above.
	            //
	            selector: function (isLess) {
	                var e, elements = [], c, extend, extendList = [], when, condition;

	                while ((isLess && (extend = $(this.extend))) || (isLess && (when = $(/^when/))) || (e = $(this.element))) {
	                    if (when) {
	                        condition = expect(this.conditions, 'expected condition');
	                    } else if (condition) {
	                        error("CSS guard can only be used at the end of selector");
	                    } else if (extend) {
	                        extendList.push.apply(extendList, extend);
	                    } else {
	                        if (extendList.length) {
	                            error("Extend can only be used at the end of selector");
	                        }
	                        c = input.charAt(i);
	                        elements.push(e);
	                        e = null;
	                    }
	                    if (c === '{' || c === '}' || c === ';' || c === ',' || c === ')') {
	                        break;
	                    }
	                }

	                if (elements.length > 0) { return new(tree.Selector)(elements, extendList, condition, i, env.currentFileInfo); }
	                if (extendList.length) { error("Extend must be used to extend a selector, it cannot be used on its own"); }
	            },
	            attribute: function () {
	                var key, val, op;

	                if (! $('[')) { return; }

	                if (!(key = $(this.entities.variableCurly))) {
	                    key = expect(/^(?:[_A-Za-z0-9-\*]*\|)?(?:[_A-Za-z0-9-]|\\.)+/);
	                }

	                if ((op = $(/^[|~*$^]?=/))) {
	                    val = $(this.entities.quoted) || $(/^[\w-]+/) || $(this.entities.variableCurly);
	                }

	                expect(']');

	                return new(tree.Attribute)(key, op, val);
	            },

	            //
	            // The `block` rule is used by `ruleset` and `mixin.definition`.
	            // It's a wrapper around the `primary` rule, with added `{}`.
	            //
	            block: function () {
	                var content;
	                if ($('{') && (content = $(this.primary)) && $('}')) {
	                    return content;
	                }
	            },

	            //
	            // div, .class, body > p {...}
	            //
	            ruleset: function () {
	                var selectors = [], s, rules, debugInfo;
	                
	                save();

	                if (env.dumpLineNumbers) {
	                    debugInfo = getDebugInfo(i, input, env);
	                }

	                while (s = $(this.lessSelector)) {
	                    selectors.push(s);
	                    $(this.comments);
	                    if (! $(',')) { break; }
	                    if (s.condition) {
	                        error("Guards are only currently allowed on a single selector");
	                    }
	                    $(this.comments);
	                }

	                if (selectors.length > 0 && (rules = $(this.block))) {
	                    var ruleset = new(tree.Ruleset)(selectors, rules, env.strictImports);
	                    if (env.dumpLineNumbers) {
	                        ruleset.debugInfo = debugInfo;
	                    }
	                    return ruleset;
	                } else {
	                    // Backtrack
	                    furthest = i;
	                    restore();
	                }
	            },
	            rule: function (tryAnonymous) {
	                var name, value, c = input.charAt(i), important, merge = false;
	                save();

	                if (c === '.' || c === '#' || c === '&') { return; }

	                if (name = $(this.variable) || $(this.ruleProperty)) {
	                    // prefer to try to parse first if its a variable or we are compressing
	                    // but always fallback on the other one
	                    value = !tryAnonymous && (env.compress || (name.charAt(0) === '@')) ?
	                        ($(this.value) || $(this.anonymousValue)) :
	                        ($(this.anonymousValue) || $(this.value));


	                    important = $(this.important);
	                    if (name[name.length-1] === "+") {
	                        merge = true;
	                        name = name.substr(0, name.length - 1);
	                    }

	                    if (value && $(this.end)) {
	                        return new (tree.Rule)(name, value, important, merge, memo, env.currentFileInfo);
	                    } else {
	                        furthest = i;
	                        restore();
	                        if (value && !tryAnonymous) {
	                            return this.rule(true);
	                        }
	                    }
	                }
	            },
	            anonymousValue: function () {
	                var match;
	                if (match = /^([^@+\/'"*`(;{}-]*);/.exec(chunks[j])) {
	                    i += match[0].length - 1;
	                    return new(tree.Anonymous)(match[1]);
	                }
	            },

	            //
	            // An @import directive
	            //
	            //     @import "lib";
	            //
	            // Depending on our environemnt, importing is done differently:
	            // In the browser, it's an XHR request, in Node, it would be a
	            // file-system operation. The function used for importing is
	            // stored in `import`, which we pass to the Import constructor.
	            //
	            "import": function () {
	                var path, features, index = i;

	                save();

	                var dir = $(/^@import?\s+/);

	                var options = (dir ? $(this.importOptions) : null) || {};

	                if (dir && (path = $(this.entities.quoted) || $(this.entities.url))) {
	                    features = $(this.mediaFeatures);
	                    if ($(';')) {
	                        features = features && new(tree.Value)(features);
	                        return new(tree.Import)(path, features, options, index, env.currentFileInfo);
	                    }
	                }

	                restore();
	            },

	            importOptions: function() {
	                var o, options = {}, optionName, value;

	                // list of options, surrounded by parens
	                if (! $('(')) { return null; }
	                do {
	                    if (o = $(this.importOption)) {
	                        optionName = o;
	                        value = true;
	                        switch(optionName) {
	                            case "css":
	                                optionName = "less";
	                                value = false;
	                            break;
	                            case "once":
	                                optionName = "multiple";
	                                value = false;
	                            break;
	                        }
	                        options[optionName] = value;
	                        if (! $(',')) { break; }
	                    }
	                } while (o);
	                expect(')');
	                return options;
	            },

	            importOption: function() {
	                var opt = $(/^(less|css|multiple|once|inline|reference)/);
	                if (opt) {
	                    return opt[1];
	                }
	            },

	            mediaFeature: function () {
	                var e, p, nodes = [];

	                do {
	                    if (e = $(this.entities.keyword)) {
	                        nodes.push(e);
	                    } else if ($('(')) {
	                        p = $(this.property);
	                        e = $(this.value);
	                        if ($(')')) {
	                            if (p && e) {
	                                nodes.push(new(tree.Paren)(new(tree.Rule)(p, e, null, null, i, env.currentFileInfo, true)));
	                            } else if (e) {
	                                nodes.push(new(tree.Paren)(e));
	                            } else {
	                                return null;
	                            }
	                        } else { return null; }
	                    }
	                } while (e);

	                if (nodes.length > 0) {
	                    return new(tree.Expression)(nodes);
	                }
	            },

	            mediaFeatures: function () {
	                var e, features = [];

	                do {
	                  if (e = $(this.mediaFeature)) {
	                      features.push(e);
	                      if (! $(',')) { break; }
	                  } else if (e = $(this.entities.variable)) {
	                      features.push(e);
	                      if (! $(',')) { break; }
	                  }
	                } while (e);

	                return features.length > 0 ? features : null;
	            },

	            media: function () {
	                var features, rules, media, debugInfo;

	                if (env.dumpLineNumbers) {
	                    debugInfo = getDebugInfo(i, input, env);
	                }

	                if ($(/^@media/)) {
	                    features = $(this.mediaFeatures);

	                    if (rules = $(this.block)) {
	                        media = new(tree.Media)(rules, features, i, env.currentFileInfo);
	                        if (env.dumpLineNumbers) {
	                            media.debugInfo = debugInfo;
	                        }
	                        return media;
	                    }
	                }
	            },

	            //
	            // A CSS Directive
	            //
	            //     @charset "utf-8";
	            //
	            directive: function () {
	                var name, value, rules, nonVendorSpecificName,
	                    hasBlock, hasIdentifier, hasExpression;

	                if (input.charAt(i) !== '@') { return; }

	                if (value = $(this['import']) || $(this.media)) {
	                    return value;
	                }

	                save();

	                name = $(/^@[a-z-]+/);
	                
	                if (!name) { return; }

	                nonVendorSpecificName = name;
	                if (name.charAt(1) == '-' && name.indexOf('-', 2) > 0) {
	                    nonVendorSpecificName = "@" + name.slice(name.indexOf('-', 2) + 1);
	                }

	                switch(nonVendorSpecificName) {
	                    case "@font-face":
	                        hasBlock = true;
	                        break;
	                    case "@viewport":
	                    case "@top-left":
	                    case "@top-left-corner":
	                    case "@top-center":
	                    case "@top-right":
	                    case "@top-right-corner":
	                    case "@bottom-left":
	                    case "@bottom-left-corner":
	                    case "@bottom-center":
	                    case "@bottom-right":
	                    case "@bottom-right-corner":
	                    case "@left-top":
	                    case "@left-middle":
	                    case "@left-bottom":
	                    case "@right-top":
	                    case "@right-middle":
	                    case "@right-bottom":
	                        hasBlock = true;
	                        break;
	                    case "@page":
	                    case "@document":
	                    case "@supports":
	                    case "@keyframes":
	                        hasBlock = true;
	                        hasIdentifier = true;
	                        break;
	                    case "@namespace":
	                        hasExpression = true;
	                        break;
	                }

	                if (hasIdentifier) {
	                    name += " " + ($(/^[^{]+/) || '').trim();
	                }

	                if (hasBlock)
	                {
	                    if (rules = $(this.block)) {
	                        return new(tree.Directive)(name, rules, i, env.currentFileInfo);
	                    }
	                } else {
	                    if ((value = hasExpression ? $(this.expression) : $(this.entity)) && $(';')) {
	                        var directive = new(tree.Directive)(name, value, i, env.currentFileInfo);
	                        if (env.dumpLineNumbers) {
	                            directive.debugInfo = getDebugInfo(i, input, env);
	                        }
	                        return directive;
	                    }
	                }

	                restore();
	            },

	            //
	            // A Value is a comma-delimited list of Expressions
	            //
	            //     font-family: Baskerville, Georgia, serif;
	            //
	            // In a Rule, a Value represents everything after the `:`,
	            // and before the `;`.
	            //
	            value: function () {
	                var e, expressions = [];

	                while (e = $(this.expression)) {
	                    expressions.push(e);
	                    if (! $(',')) { break; }
	                }

	                if (expressions.length > 0) {
	                    return new(tree.Value)(expressions);
	                }
	            },
	            important: function () {
	                if (input.charAt(i) === '!') {
	                    return $(/^! *important/);
	                }
	            },
	            sub: function () {
	                var a, e;

	                if ($('(')) {
	                    if (a = $(this.addition)) {
	                        e = new(tree.Expression)([a]);
	                        expect(')');
	                        e.parens = true;
	                        return e;
	                    }
	                }
	            },
	            multiplication: function () {
	                var m, a, op, operation, isSpaced;
	                if (m = $(this.operand)) {
	                    isSpaced = isWhitespace(input.charAt(i - 1));
	                    while (!peek(/^\/[*\/]/) && (op = ($('/') || $('*')))) {
	                        if (a = $(this.operand)) {
	                            m.parensInOp = true;
	                            a.parensInOp = true;
	                            operation = new(tree.Operation)(op, [operation || m, a], isSpaced);
	                            isSpaced = isWhitespace(input.charAt(i - 1));
	                        } else {
	                            break;
	                        }
	                    }
	                    return operation || m;
	                }
	            },
	            addition: function () {
	                var m, a, op, operation, isSpaced;
	                if (m = $(this.multiplication)) {
	                    isSpaced = isWhitespace(input.charAt(i - 1));
	                    while ((op = $(/^[-+]\s+/) || (!isSpaced && ($('+') || $('-')))) &&
	                           (a = $(this.multiplication))) {
	                        m.parensInOp = true;
	                        a.parensInOp = true;
	                        operation = new(tree.Operation)(op, [operation || m, a], isSpaced);
	                        isSpaced = isWhitespace(input.charAt(i - 1));
	                    }
	                    return operation || m;
	                }
	            },
	            conditions: function () {
	                var a, b, index = i, condition;

	                if (a = $(this.condition)) {
	                    while ($(',') && (b = $(this.condition))) {
	                        condition = new(tree.Condition)('or', condition || a, b, index);
	                    }
	                    return condition || a;
	                }
	            },
	            condition: function () {
	                var a, b, c, op, index = i, negate = false;

	                if ($(/^not/)) { negate = true; }
	                expect('(');
	                if (a = $(this.addition) || $(this.entities.keyword) || $(this.entities.quoted)) {
	                    if (op = $(/^(?:>=|=<|[<=>])/)) {
	                        if (b = $(this.addition) || $(this.entities.keyword) || $(this.entities.quoted)) {
	                            c = new(tree.Condition)(op, a, b, index, negate);
	                        } else {
	                            error('expected expression');
	                        }
	                    } else {
	                        c = new(tree.Condition)('=', a, new(tree.Keyword)('true'), index, negate);
	                    }
	                    expect(')');
	                    return $(/^and/) ? new(tree.Condition)('and', c, $(this.condition)) : c;
	                }
	            },

	            //
	            // An operand is anything that can be part of an operation,
	            // such as a Color, or a Variable
	            //
	            operand: function () {
	                var negate, p = input.charAt(i + 1);

	                if (input.charAt(i) === '-' && (p === '@' || p === '(')) { negate = $('-'); }
	                var o = $(this.sub) || $(this.entities.dimension) ||
	                        $(this.entities.color) || $(this.entities.variable) ||
	                        $(this.entities.call);

	                if (negate) {
	                    o.parensInOp = true;
	                    o = new(tree.Negative)(o);
	                }

	                return o;
	            },

	            //
	            // Expressions either represent mathematical operations,
	            // or white-space delimited Entities.
	            //
	            //     1px solid black
	            //     @var * 2
	            //
	            expression: function () {
	                var e, delim, entities = [];

	                while (e = $(this.addition) || $(this.entity)) {
	                    entities.push(e);
	                    // operations do not allow keyword "/" dimension (e.g. small/20px) so we support that here
	                    if (!peek(/^\/[\/*]/) && (delim = $('/'))) {
	                        entities.push(new(tree.Anonymous)(delim));
	                    }
	                }
	                if (entities.length > 0) {
	                    return new(tree.Expression)(entities);
	                }
	            },
	            property: function () {
	                var name;

	                if (name = $(/^(\*?-?[_a-zA-Z0-9-]+)\s*:/)) {
	                    return name[1];
	                }
	            },
	            ruleProperty: function () {
	                var name;

	                if (name = $(/^(\*?-?[_a-zA-Z0-9-]+)\s*(\+?)\s*:/)) {
	                    return name[1] + (name[2] || "");
	                }
	            }
	        }
	    };
	};



/***/ },

/***/ 3:
/***/ function(module, exports, require) {

	var map = {
		"./alpha": 21,
		"./alpha.js": 21,
		"./anonymous": 22,
		"./anonymous.js": 22,
		"./assignment": 23,
		"./assignment.js": 23,
		"./call": 24,
		"./call.js": 24,
		"./color": 25,
		"./color.js": 25,
		"./comment": 26,
		"./comment.js": 26,
		"./condition": 27,
		"./condition.js": 27,
		"./dimension": 28,
		"./dimension.js": 28,
		"./directive": 29,
		"./directive.js": 29,
		"./element": 30,
		"./element.js": 30,
		"./expression": 31,
		"./expression.js": 31,
		"./extend": 32,
		"./extend.js": 32,
		"./import": 33,
		"./import.js": 33,
		"./javascript": 34,
		"./javascript.js": 34,
		"./keyword": 35,
		"./keyword.js": 35,
		"./media": 36,
		"./media.js": 36,
		"./mixin": 37,
		"./mixin.js": 37,
		"./negative": 38,
		"./negative.js": 38,
		"./operation": 39,
		"./operation.js": 39,
		"./paren": 40,
		"./paren.js": 40,
		"./quoted": 41,
		"./quoted.js": 41,
		"./rule": 42,
		"./rule.js": 42,
		"./ruleset": 43,
		"./ruleset.js": 43,
		"./selector": 44,
		"./selector.js": 44,
		"./unicode-descriptor": 45,
		"./unicode-descriptor.js": 45,
		"./url": 46,
		"./url.js": 46,
		"./value": 47,
		"./value.js": 47,
		"./variable": 48,
		"./variable.js": 48
	};
	function webpackContext(req) {
		return require(webpackContextResolve(req));
	};
	function webpackContextResolve(req) {
		return map[req] || (function() { throw new Error("Cannot find module '" + req + "'.") }());
	};
	webpackContext.keys = function webpackContextKeys() {
		return Object.keys(map);
	};
	webpackContext.resolve = webpackContextResolve;
	module.exports = webpackContext;


/***/ },

/***/ 4:
/***/ function(module, exports, require) {

	(function (tree) {

	tree.debugInfo = function(env, ctx, lineSeperator) {
	    var result="";
	    if (env.dumpLineNumbers && !env.compress) {
	        switch(env.dumpLineNumbers) {
	            case 'comments':
	                result = tree.debugInfo.asComment(ctx);
	                break;
	            case 'mediaquery':
	                result = tree.debugInfo.asMediaQuery(ctx);
	                break;
	            case 'all':
	                result = tree.debugInfo.asComment(ctx) + (lineSeperator || "") + tree.debugInfo.asMediaQuery(ctx);
	                break;
	        }
	    }
	    return result;
	};

	tree.debugInfo.asComment = function(ctx) {
	    return '/* line ' + ctx.debugInfo.lineNumber + ', ' + ctx.debugInfo.fileName + ' */\n';
	};

	tree.debugInfo.asMediaQuery = function(ctx) {
	    return '@media -sass-debug-info{filename{font-family:' +
	        ('file://' + ctx.debugInfo.fileName).replace(/([.:/\\])/g, function (a) {
	            if (a == '\\') {
	                a = '\/';
	            }
	            return '\\' + a;
	        }) +
	        '}line{font-family:\\00003' + ctx.debugInfo.lineNumber + '}}\n';
	};

	tree.find = function (obj, fun) {
	    for (var i = 0, r; i < obj.length; i++) {
	        if (r = fun.call(obj, obj[i])) { return r; }
	    }
	    return null;
	};

	tree.jsify = function (obj) {
	    if (Array.isArray(obj.value) && (obj.value.length > 1)) {
	        return '[' + obj.value.map(function (v) { return v.toCSS(false); }).join(', ') + ']';
	    } else {
	        return obj.toCSS(false);
	    }
	};

	tree.toCSS = function (env) {
	    var strs = [];
	    this.genCSS(env, {
	        add: function(chunk, node) {
	            strs.push(chunk);
	        }
	    });
	    return strs.join('');
	};

	tree.outputRuleset = function (env, output, rules) {
	    output.add((env.compress ? '{' : ' {\n'));
	    env.tabLevel = (env.tabLevel || 0) + 1;
	    var tabRuleStr = env.compress ? '' : Array(env.tabLevel + 1).join("  "),
	        tabSetStr = env.compress ? '' : Array(env.tabLevel).join("  ");
	    for(var i = 0; i < rules.length; i++) {
	        output.add(tabRuleStr);
	        rules[i].genCSS(env, output);
	        output.add(env.compress ? '' : '\n');
	    }
	    env.tabLevel--;
	    output.add(tabSetStr + "}");
	};

	})(require(4));


/***/ },

/***/ 5:
/***/ function(module, exports, require) {

	// lessc_helper.js
	//
	//      helper functions for lessc
	var sys = require(17);

	var lessc_helper = {

	    //Stylize a string
	    stylize : function(str, style) {
	        var styles = {
	            'reset'     : [0,   0],
	            'bold'      : [1,  22],
	            'inverse'   : [7,  27],
	            'underline' : [4,  24],
	            'yellow'    : [33, 39],
	            'green'     : [32, 39],
	            'red'       : [31, 39],
	            'grey'      : [90, 39]
	        };
	        return '\033[' + styles[style][0] + 'm' + str +
	               '\033[' + styles[style][1] + 'm';
	    },

	    //Print command line options
	    printUsage: function() {
	        sys.puts("usage: lessc [option option=parameter ...] <source> [destination]");
	        sys.puts("");
	        sys.puts("If source is set to `-' (dash or hyphen-minus), input is read from stdin.");
	        sys.puts("");
	        sys.puts("options:");
	        sys.puts("  -h, --help              Print help (this message) and exit.");
	        sys.puts("  --include-path=PATHS    Set include paths. Separated by `:'. Use `;' on Windows.");
	        sys.puts("  -M, --depends           Output a makefile import dependency list to stdout");
	        sys.puts("  --no-color              Disable colorized output.");
	        sys.puts("  --no-ie-compat          Disable IE compatibility checks.");
	        sys.puts("  --no-js                 Disable JavaScript in less files");
	        sys.puts("  -l, --lint              Syntax check only (lint).");
	        sys.puts("  -s, --silent            Suppress output of error messages.");
	        sys.puts("  --strict-imports        Force evaluation of imports.");
	        sys.puts("  --verbose               Be verbose.");
	        sys.puts("  -v, --version           Print version number and exit.");
	        sys.puts("  -x, --compress          Compress output by removing some whitespaces.");
	        sys.puts("  --clean-css             Compress output using clean-css");
	        sys.puts("  -O0, -O1, -O2           Set the parser's optimization level. The lower");
	        sys.puts("                          the number, the less nodes it will create in the");
	        sys.puts("                          tree. This could matter for debugging, or if you");
	        sys.puts("                          want to access the individual nodes in the tree.");
	        sys.puts("  --line-numbers=TYPE     Outputs filename and line numbers.");
	        sys.puts("                          TYPE can be either 'comments', which will output");
	        sys.puts("                          the debug info within comments, 'mediaquery'");
	        sys.puts("                          that will output the information within a fake");
	        sys.puts("                          media query which is compatible with the SASS");
	        sys.puts("                          format, and 'all' which will do both.");
	        sys.puts("  --source-map[=FILENAME] Outputs a v3 sourcemap to the filename (or output filename.map)");
	        sys.puts("  --source-map-rootpath=X adds this path onto the sourcemap filename and less file paths");
	        sys.puts("  --source-map-inline     puts the less files into the map instead of referencing them");
	        sys.puts("  -rp, --rootpath=URL     Set rootpath for url rewriting in relative imports and urls.");
	        sys.puts("                          Works with or without the relative-urls option.");
	        sys.puts("  -ru, --relative-urls    re-write relative urls to the base less file.");
	        sys.puts("  -sm=on|off              Turn on or off strict math, where in strict mode, math");
	        sys.puts("  --strict-math=on|off    requires brackets. This option may default to on and then");
	        sys.puts("                          be removed in the future.");
	        sys.puts("  -su=on|off              Allow mixed units, e.g. 1px+1em or 1px*1px which have units");
	        sys.puts("  --strict-units=on|off   that cannot be represented.");
	        sys.puts("");
	        sys.puts("Report bugs to: http://github.com/cloudhead/less.js/issues");
	        sys.puts("Home page: <http://lesscss.org/>");
	    }
	};

	// Exports helper functions
	for (var h in lessc_helper) { exports[h] = lessc_helper[h]; }


/***/ },

/***/ 6:
/***/ function(module, exports, require) {

	(function (tree) {

	    var parseCopyProperties = [
	        'paths',            // option - unmodified - paths to search for imports on
	        'optimization',     // option - optimization level (for the chunker)
	        'files',            // list of files that have been imported, used for import-once
	        'contents',         // browser-only, contents of all the files
	        'relativeUrls',     // option - whether to adjust URL's to be relative
	        'rootpath',         // option - rootpath to append to URL's
	        'strictImports',    // option -
	        'dumpLineNumbers',  // option - whether to dump line numbers
	        'compress',         // option - whether to compress
	        'processImports',   // option - whether to process imports. if false then imports will not be imported
	        'syncImport',       // option - whether to import synchronously
	        'javascriptEnabled',// option - whether JavaScript is enabled. if undefined, defaults to true
	        'mime',             // browser only - mime type for sheet import
	        'useFileCache',     // browser only - whether to use the per file session cache
	        'currentFileInfo'   // information about the current file - for error reporting and importing and making urls relative etc.
	    ];

	    //currentFileInfo = {
	    //  'relativeUrls' - option - whether to adjust URL's to be relative
	    //  'filename' - full resolved filename of current file
	    //  'rootpath' - path to append to normal URLs for this node
	    //  'currentDirectory' - path to the current file, absolute
	    //  'rootFilename' - filename of the base file
	    //  'entryPath' - absolute path to the entry file
	    //  'reference' - whether the file should not be output and only output parts that are referenced

	    tree.parseEnv = function(options) {
	        copyFromOriginal(options, this, parseCopyProperties);

	        if (!this.contents) { this.contents = {}; }
	        if (!this.files) { this.files = {}; }

	        if (!this.currentFileInfo) {
	            var filename = (options && options.filename) || "input";
	            var entryPath = filename.replace(/[^\/\\]*$/, "");
	            if (options) {
	                options.filename = null;
	            }
	            this.currentFileInfo = {
	                filename: filename,
	                relativeUrls: this.relativeUrls,
	                rootpath: (options && options.rootpath) || "",
	                currentDirectory: entryPath,
	                entryPath: entryPath,
	                rootFilename: filename
	            };
	        }
	    };

	    var evalCopyProperties = [
	        'silent',      // whether to swallow errors and warnings
	        'verbose',     // whether to log more activity
	        'compress',    // whether to compress
	        'yuicompress', // whether to compress with the outside tool yui compressor
	        'ieCompat',    // whether to enforce IE compatibility (IE8 data-uri)
	        'strictMath',  // whether math has to be within parenthesis
	        'strictUnits', // whether units need to evaluate correctly
	        'cleancss',    // whether to compress with clean-css
	        'sourceMap'    // whether to output a source map
	        ];

	    tree.evalEnv = function(options, frames) {
	        copyFromOriginal(options, this, evalCopyProperties);

	        this.frames = frames || [];
	    };

	    tree.evalEnv.prototype.inParenthesis = function () {
	        if (!this.parensStack) {
	            this.parensStack = [];
	        }
	        this.parensStack.push(true);
	    };

	    tree.evalEnv.prototype.outOfParenthesis = function () {
	        this.parensStack.pop();
	    };

	    tree.evalEnv.prototype.isMathOn = function () {
	        return this.strictMath ? (this.parensStack && this.parensStack.length) : true;
	    };

	    tree.evalEnv.prototype.isPathRelative = function (path) {
	        return !/^(?:[a-z-]+:|\/)/.test(path);
	    };

	    //todo - do the same for the toCSS env
	    //tree.toCSSEnv = function (options) {
	    //};

	    var copyFromOriginal = function(original, destination, propertiesToCopy) {
	        if (!original) { return; }

	        for(var i = 0; i < propertiesToCopy.length; i++) {
	            if (original.hasOwnProperty(propertiesToCopy[i])) {
	                destination[propertiesToCopy[i]] = original[propertiesToCopy[i]];
	            }
	        }
	    };

	})(require(4));


/***/ },

/***/ 7:
/***/ function(module, exports, require) {

	/* WEBPACK VAR INJECTION */(function(require, Buffer) {(function (tree) {

	tree.functions = {
	    rgb: function (r, g, b) {
	        return this.rgba(r, g, b, 1.0);
	    },
	    rgba: function (r, g, b, a) {
	        var rgb = [r, g, b].map(function (c) { return scaled(c, 256); });
	        a = number(a);
	        return new(tree.Color)(rgb, a);
	    },
	    hsl: function (h, s, l) {
	        return this.hsla(h, s, l, 1.0);
	    },
	    hsla: function (h, s, l, a) {
	        h = (number(h) % 360) / 360;
	        s = clamp(number(s)); l = clamp(number(l)); a = clamp(number(a));

	        var m2 = l <= 0.5 ? l * (s + 1) : l + s - l * s;
	        var m1 = l * 2 - m2;

	        return this.rgba(hue(h + 1/3) * 255,
	                         hue(h)       * 255,
	                         hue(h - 1/3) * 255,
	                         a);

	        function hue(h) {
	            h = h < 0 ? h + 1 : (h > 1 ? h - 1 : h);
	            if      (h * 6 < 1) { return m1 + (m2 - m1) * h * 6; }
	            else if (h * 2 < 1) { return m2; }
	            else if (h * 3 < 2) { return m1 + (m2 - m1) * (2/3 - h) * 6; }
	            else                { return m1; }
	        }
	    },

	    hsv: function(h, s, v) {
	        return this.hsva(h, s, v, 1.0);
	    },

	    hsva: function(h, s, v, a) {
	        h = ((number(h) % 360) / 360) * 360;
	        s = number(s); v = number(v); a = number(a);

	        var i, f;
	        i = Math.floor((h / 60) % 6);
	        f = (h / 60) - i;

	        var vs = [v,
	                  v * (1 - s),
	                  v * (1 - f * s),
	                  v * (1 - (1 - f) * s)];
	        var perm = [[0, 3, 1],
	                    [2, 0, 1],
	                    [1, 0, 3],
	                    [1, 2, 0],
	                    [3, 1, 0],
	                    [0, 1, 2]];

	        return this.rgba(vs[perm[i][0]] * 255,
	                         vs[perm[i][1]] * 255,
	                         vs[perm[i][2]] * 255,
	                         a);
	    },

	    hue: function (color) {
	        return new(tree.Dimension)(Math.round(color.toHSL().h));
	    },
	    saturation: function (color) {
	        return new(tree.Dimension)(Math.round(color.toHSL().s * 100), '%');
	    },
	    lightness: function (color) {
	        return new(tree.Dimension)(Math.round(color.toHSL().l * 100), '%');
	    },
	    hsvhue: function(color) {
	        return new(tree.Dimension)(Math.round(color.toHSV().h));
	    },
	    hsvsaturation: function (color) {
	        return new(tree.Dimension)(Math.round(color.toHSV().s * 100), '%');
	    },
	    hsvvalue: function (color) {
	        return new(tree.Dimension)(Math.round(color.toHSV().v * 100), '%');
	    },
	    red: function (color) {
	        return new(tree.Dimension)(color.rgb[0]);
	    },
	    green: function (color) {
	        return new(tree.Dimension)(color.rgb[1]);
	    },
	    blue: function (color) {
	        return new(tree.Dimension)(color.rgb[2]);
	    },
	    alpha: function (color) {
	        return new(tree.Dimension)(color.toHSL().a);
	    },
	    luma: function (color) {
	        return new(tree.Dimension)(Math.round(color.luma() * color.alpha * 100), '%');
	    },
	    saturate: function (color, amount) {
	        // filter: saturate(3.2);
	        // should be kept as is, so check for color
	        if (!color.rgb) {
	            return null;
	        }
	        var hsl = color.toHSL();

	        hsl.s += amount.value / 100;
	        hsl.s = clamp(hsl.s);
	        return hsla(hsl);
	    },
	    desaturate: function (color, amount) {
	        var hsl = color.toHSL();

	        hsl.s -= amount.value / 100;
	        hsl.s = clamp(hsl.s);
	        return hsla(hsl);
	    },
	    lighten: function (color, amount) {
	        var hsl = color.toHSL();

	        hsl.l += amount.value / 100;
	        hsl.l = clamp(hsl.l);
	        return hsla(hsl);
	    },
	    darken: function (color, amount) {
	        var hsl = color.toHSL();

	        hsl.l -= amount.value / 100;
	        hsl.l = clamp(hsl.l);
	        return hsla(hsl);
	    },
	    fadein: function (color, amount) {
	        var hsl = color.toHSL();

	        hsl.a += amount.value / 100;
	        hsl.a = clamp(hsl.a);
	        return hsla(hsl);
	    },
	    fadeout: function (color, amount) {
	        var hsl = color.toHSL();

	        hsl.a -= amount.value / 100;
	        hsl.a = clamp(hsl.a);
	        return hsla(hsl);
	    },
	    fade: function (color, amount) {
	        var hsl = color.toHSL();

	        hsl.a = amount.value / 100;
	        hsl.a = clamp(hsl.a);
	        return hsla(hsl);
	    },
	    spin: function (color, amount) {
	        var hsl = color.toHSL();
	        var hue = (hsl.h + amount.value) % 360;

	        hsl.h = hue < 0 ? 360 + hue : hue;

	        return hsla(hsl);
	    },
	    //
	    // Copyright (c) 2006-2009 Hampton Catlin, Nathan Weizenbaum, and Chris Eppstein
	    // http://sass-lang.com
	    //
	    mix: function (color1, color2, weight) {
	        if (!weight) {
	            weight = new(tree.Dimension)(50);
	        }
	        var p = weight.value / 100.0;
	        var w = p * 2 - 1;
	        var a = color1.toHSL().a - color2.toHSL().a;

	        var w1 = (((w * a == -1) ? w : (w + a) / (1 + w * a)) + 1) / 2.0;
	        var w2 = 1 - w1;

	        var rgb = [color1.rgb[0] * w1 + color2.rgb[0] * w2,
	                   color1.rgb[1] * w1 + color2.rgb[1] * w2,
	                   color1.rgb[2] * w1 + color2.rgb[2] * w2];

	        var alpha = color1.alpha * p + color2.alpha * (1 - p);

	        return new(tree.Color)(rgb, alpha);
	    },
	    greyscale: function (color) {
	        return this.desaturate(color, new(tree.Dimension)(100));
	    },
	    contrast: function (color, dark, light, threshold) {
	        // filter: contrast(3.2);
	        // should be kept as is, so check for color
	        if (!color.rgb) {
	            return null;
	        }
	        if (typeof light === 'undefined') {
	            light = this.rgba(255, 255, 255, 1.0);
	        }
	        if (typeof dark === 'undefined') {
	            dark = this.rgba(0, 0, 0, 1.0);
	        }
	        //Figure out which is actually light and dark!
	        if (dark.luma() > light.luma()) {
	            var t = light;
	            light = dark;
	            dark = t;
	        }
	        if (typeof threshold === 'undefined') {
	            threshold = 0.43;
	        } else {
	            threshold = number(threshold);
	        }
	        if ((color.luma() * color.alpha) < threshold) {
	            return light;
	        } else {
	            return dark;
	        }
	    },
	    e: function (str) {
	        return new(tree.Anonymous)(str instanceof tree.JavaScript ? str.evaluated : str);
	    },
	    escape: function (str) {
	        return new(tree.Anonymous)(encodeURI(str.value).replace(/=/g, "%3D").replace(/:/g, "%3A").replace(/#/g, "%23").replace(/;/g, "%3B").replace(/\(/g, "%28").replace(/\)/g, "%29"));
	    },
	    '%': function (quoted /* arg, arg, ...*/) {
	        var args = Array.prototype.slice.call(arguments, 1),
	            str = quoted.value;

	        for (var i = 0; i < args.length; i++) {
	            /*jshint loopfunc:true */
	            str = str.replace(/%[sda]/i, function(token) {
	                var value = token.match(/s/i) ? args[i].value : args[i].toCSS();
	                return token.match(/[A-Z]$/) ? encodeURIComponent(value) : value;
	            });
	        }
	        str = str.replace(/%%/g, '%');
	        return new(tree.Quoted)('"' + str + '"', str);
	    },
	    unit: function (val, unit) {
	        return new(tree.Dimension)(val.value, unit ? unit.toCSS() : "");
	    },
	    convert: function (val, unit) {
	        return val.convertTo(unit.value);
	    },
	    round: function (n, f) {
	        var fraction = typeof(f) === "undefined" ? 0 : f.value;
	        return this._math(function(num) { return num.toFixed(fraction); }, null, n);
	    },
	    pi: function () {
	        return new(tree.Dimension)(Math.PI);
	    },
	    mod: function(a, b) {
	        return new(tree.Dimension)(a.value % b.value, a.unit);
	    },
	    pow: function(x, y) {
	        if (typeof x === "number" && typeof y === "number") {
	            x = new(tree.Dimension)(x);
	            y = new(tree.Dimension)(y);
	        } else if (!(x instanceof tree.Dimension) || !(y instanceof tree.Dimension)) {
	            throw { type: "Argument", message: "arguments must be numbers" };
	        }

	        return new(tree.Dimension)(Math.pow(x.value, y.value), x.unit);
	    },
	    _math: function (fn, unit, n) {
	        if (n instanceof tree.Dimension) {
	            /*jshint eqnull:true */
	            return new(tree.Dimension)(fn(parseFloat(n.value)), unit == null ? n.unit : unit);
	        } else if (typeof(n) === 'number') {
	            return fn(n);
	        } else {
	            throw { type: "Argument", message: "argument must be a number" };
	        }
	    },
	    _minmax: function (isMin, args) {
	        args = Array.prototype.slice.call(args);
	        switch(args.length) {
	        case 0: throw { type: "Argument", message: "one or more arguments required" };
	        case 1: return args[0];
	        }
	        var i, j, current, currentUnified, referenceUnified, unit,
	            order  = [], // elems only contains original argument values.
	            values = {}; // key is the unit.toString() for unified tree.Dimension values,
	                         // value is the index into the order array.
	        for (i = 0; i < args.length; i++) {
	            current = args[i];
	            if (!(current instanceof tree.Dimension)) {
	                order.push(current);
	                continue;
	            }
	            currentUnified = current.unify();
	            unit = currentUnified.unit.toString();
	            j = values[unit];
	            if (j === undefined) {
	                values[unit] = order.length;
	                order.push(current);
	                continue;
	            }
	            referenceUnified = order[j].unify();
	            if ( isMin && currentUnified.value < referenceUnified.value ||
	                !isMin && currentUnified.value > referenceUnified.value) {
	                order[j] = current;
	            }
	        }
	        if (order.length == 1) {
	            return order[0];
	        }
	        args = order.map(function (a) { return a.toCSS(this.env); })
	                    .join(this.env.compress ? "," : ", ");
	        return new(tree.Anonymous)((isMin ? "min" : "max") + "(" + args + ")");
	    },
	    min: function () {
	        return this._minmax(true, arguments);
	    },
	    max: function () {
	        return this._minmax(false, arguments);
	    },
	    argb: function (color) {
	        return new(tree.Anonymous)(color.toARGB());

	    },
	    percentage: function (n) {
	        return new(tree.Dimension)(n.value * 100, '%');
	    },
	    color: function (n) {
	        if (n instanceof tree.Quoted) {
	            return new(tree.Color)(n.value.slice(1));
	        } else {
	            throw { type: "Argument", message: "argument must be a string" };
	        }
	    },
	    iscolor: function (n) {
	        return this._isa(n, tree.Color);
	    },
	    isnumber: function (n) {
	        return this._isa(n, tree.Dimension);
	    },
	    isstring: function (n) {
	        return this._isa(n, tree.Quoted);
	    },
	    iskeyword: function (n) {
	        return this._isa(n, tree.Keyword);
	    },
	    isurl: function (n) {
	        return this._isa(n, tree.URL);
	    },
	    ispixel: function (n) {
	        return this.isunit(n, 'px');
	    },
	    ispercentage: function (n) {
	        return this.isunit(n, '%');
	    },
	    isem: function (n) {
	        return this.isunit(n, 'em');
	    },
	    isunit: function (n, unit) {
	        return (n instanceof tree.Dimension) && n.unit.is(unit.value || unit) ? tree.True : tree.False;
	    },
	    _isa: function (n, Type) {
	        return (n instanceof Type) ? tree.True : tree.False;
	    },
	    
	    /* Blending modes */
	    
	    multiply: function(color1, color2) {
	        var r = color1.rgb[0] * color2.rgb[0] / 255;
	        var g = color1.rgb[1] * color2.rgb[1] / 255;
	        var b = color1.rgb[2] * color2.rgb[2] / 255;
	        return this.rgb(r, g, b);
	    },
	    screen: function(color1, color2) {
	        var r = 255 - (255 - color1.rgb[0]) * (255 - color2.rgb[0]) / 255;
	        var g = 255 - (255 - color1.rgb[1]) * (255 - color2.rgb[1]) / 255;
	        var b = 255 - (255 - color1.rgb[2]) * (255 - color2.rgb[2]) / 255;
	        return this.rgb(r, g, b);
	    },
	    overlay: function(color1, color2) {
	        var r = color1.rgb[0] < 128 ? 2 * color1.rgb[0] * color2.rgb[0] / 255 : 255 - 2 * (255 - color1.rgb[0]) * (255 - color2.rgb[0]) / 255;
	        var g = color1.rgb[1] < 128 ? 2 * color1.rgb[1] * color2.rgb[1] / 255 : 255 - 2 * (255 - color1.rgb[1]) * (255 - color2.rgb[1]) / 255;
	        var b = color1.rgb[2] < 128 ? 2 * color1.rgb[2] * color2.rgb[2] / 255 : 255 - 2 * (255 - color1.rgb[2]) * (255 - color2.rgb[2]) / 255;
	        return this.rgb(r, g, b);
	    },
	    softlight: function(color1, color2) {
	        var t = color2.rgb[0] * color1.rgb[0] / 255;
	        var r = t + color1.rgb[0] * (255 - (255 - color1.rgb[0]) * (255 - color2.rgb[0]) / 255 - t) / 255;
	        t = color2.rgb[1] * color1.rgb[1] / 255;
	        var g = t + color1.rgb[1] * (255 - (255 - color1.rgb[1]) * (255 - color2.rgb[1]) / 255 - t) / 255;
	        t = color2.rgb[2] * color1.rgb[2] / 255;
	        var b = t + color1.rgb[2] * (255 - (255 - color1.rgb[2]) * (255 - color2.rgb[2]) / 255 - t) / 255;
	        return this.rgb(r, g, b);
	    },
	    hardlight: function(color1, color2) {
	        var r = color2.rgb[0] < 128 ? 2 * color2.rgb[0] * color1.rgb[0] / 255 : 255 - 2 * (255 - color2.rgb[0]) * (255 - color1.rgb[0]) / 255;
	        var g = color2.rgb[1] < 128 ? 2 * color2.rgb[1] * color1.rgb[1] / 255 : 255 - 2 * (255 - color2.rgb[1]) * (255 - color1.rgb[1]) / 255;
	        var b = color2.rgb[2] < 128 ? 2 * color2.rgb[2] * color1.rgb[2] / 255 : 255 - 2 * (255 - color2.rgb[2]) * (255 - color1.rgb[2]) / 255;
	        return this.rgb(r, g, b);
	    },
	    difference: function(color1, color2) {
	        var r = Math.abs(color1.rgb[0] - color2.rgb[0]);
	        var g = Math.abs(color1.rgb[1] - color2.rgb[1]);
	        var b = Math.abs(color1.rgb[2] - color2.rgb[2]);
	        return this.rgb(r, g, b);
	    },
	    exclusion: function(color1, color2) {
	        var r = color1.rgb[0] + color2.rgb[0] * (255 - color1.rgb[0] - color1.rgb[0]) / 255;
	        var g = color1.rgb[1] + color2.rgb[1] * (255 - color1.rgb[1] - color1.rgb[1]) / 255;
	        var b = color1.rgb[2] + color2.rgb[2] * (255 - color1.rgb[2] - color1.rgb[2]) / 255;
	        return this.rgb(r, g, b);
	    },
	    average: function(color1, color2) {
	        var r = (color1.rgb[0] + color2.rgb[0]) / 2;
	        var g = (color1.rgb[1] + color2.rgb[1]) / 2;
	        var b = (color1.rgb[2] + color2.rgb[2]) / 2;
	        return this.rgb(r, g, b);
	    },
	    negation: function(color1, color2) {
	        var r = 255 - Math.abs(255 - color2.rgb[0] - color1.rgb[0]);
	        var g = 255 - Math.abs(255 - color2.rgb[1] - color1.rgb[1]);
	        var b = 255 - Math.abs(255 - color2.rgb[2] - color1.rgb[2]);
	        return this.rgb(r, g, b);
	    },
	    tint: function(color, amount) {
	        return this.mix(this.rgb(255,255,255), color, amount);
	    },
	    shade: function(color, amount) {
	        return this.mix(this.rgb(0, 0, 0), color, amount);
	    },
	    extract: function(values, index) {
	        index = index.value - 1; // (1-based index)
	        return values.value[index];
	    },

	    "data-uri": function(mimetypeNode, filePathNode) {

	        if (typeof window !== 'undefined') {
	            return new tree.URL(filePathNode || mimetypeNode, this.currentFileInfo).eval(this.env);
	        }

	        var mimetype = mimetypeNode.value;
	        var filePath = (filePathNode && filePathNode.value);

	        var fs = require(19),
	            path = require(16),
	            useBase64 = false;

	        if (arguments.length < 2) {
	            filePath = mimetype;
	        }

	        if (this.env.isPathRelative(filePath)) {
	            if (this.currentFileInfo.relativeUrls) {
	                filePath = path.join(this.currentFileInfo.currentDirectory, filePath);
	            } else {
	                filePath = path.join(this.currentFileInfo.entryPath, filePath);
	            }
	        }

	        // detect the mimetype if not given
	        if (arguments.length < 2) {
	            var mime;
	            try {
	                mime = require(64);
	            } catch (ex) {
	                mime = tree._mime;
	            }

	            mimetype = mime.lookup(filePath);

	            // use base 64 unless it's an ASCII or UTF-8 format
	            var charset = mime.charsets.lookup(mimetype);
	            useBase64 = ['US-ASCII', 'UTF-8'].indexOf(charset) < 0;
	            if (useBase64) { mimetype += ';base64'; }
	        }
	        else {
	            useBase64 = /;base64$/.test(mimetype);
	        }

	        var buf = fs.readFileSync(filePath);

	        // IE8 cannot handle a data-uri larger than 32KB. If this is exceeded
	        // and the --ieCompat flag is enabled, return a normal url() instead.
	        var DATA_URI_MAX_KB = 32,
	            fileSizeInKB = parseInt((buf.length / 1024), 10);
	        if (fileSizeInKB >= DATA_URI_MAX_KB) {

	            if (this.env.ieCompat !== false) {
	                if (!this.env.silent) {
	                    console.warn("Skipped data-uri embedding of %s because its size (%dKB) exceeds IE8-safe %dKB!", filePath, fileSizeInKB, DATA_URI_MAX_KB);
	                }

	                return new tree.URL(filePathNode || mimetypeNode, this.currentFileInfo).eval(this.env);
	            } else if (!this.env.silent) {
	                // if explicitly disabled (via --no-ie-compat on CLI, or env.ieCompat === false), merely warn
	                console.warn("WARNING: Embedding %s (%dKB) exceeds IE8's data-uri size limit of %dKB!", filePath, fileSizeInKB, DATA_URI_MAX_KB);
	            }
	        }

	        buf = useBase64 ? buf.toString('base64')
	                        : encodeURIComponent(buf);

	        var uri = "'data:" + mimetype + ',' + buf + "'";
	        return new(tree.URL)(new(tree.Anonymous)(uri));
	    },

	    "svg-gradient": function(direction) {

	        function throwArgumentDescriptor() {
	            throw { type: "Argument", message: "svg-gradient expects direction, start_color [start_position], [color position,]..., end_color [end_position]" };
	        }

	        if (arguments.length < 3) {
	            throwArgumentDescriptor();
	        }
	        var stops = Array.prototype.slice.call(arguments, 1),
	            gradientDirectionSvg,
	            gradientType = "linear",
	            rectangleDimension = 'x="0" y="0" width="1" height="1"',
	            useBase64 = true,
	            renderEnv = {compress: false},
	            returner,
	            directionValue = direction.toCSS(renderEnv),
	            i, color, position, positionValue, alpha;

	        switch (directionValue) {
	            case "to bottom":
	                gradientDirectionSvg = 'x1="0%" y1="0%" x2="0%" y2="100%"';
	                break;
	            case "to right":
	                gradientDirectionSvg = 'x1="0%" y1="0%" x2="100%" y2="0%"';
	                break;
	            case "to bottom right":
	                gradientDirectionSvg = 'x1="0%" y1="0%" x2="100%" y2="100%"';
	                break;
	            case "to top right":
	                gradientDirectionSvg = 'x1="0%" y1="100%" x2="100%" y2="0%"';
	                break;
	            case "ellipse":
	            case "ellipse at center":
	                gradientType = "radial";
	                gradientDirectionSvg = 'cx="50%" cy="50%" r="75%"';
	                rectangleDimension = 'x="-50" y="-50" width="101" height="101"';
	                break;
	            default:
	                throw { type: "Argument", message: "svg-gradient direction must be 'to bottom', 'to right', 'to bottom right', 'to top right' or 'ellipse at center'" };
	        }
	        returner = '<?xml version="1.0" ?>' +
	            '<svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="100%" height="100%" viewBox="0 0 1 1" preserveAspectRatio="none">' +
	            '<' + gradientType + 'Gradient id="gradient" gradientUnits="userSpaceOnUse" ' + gradientDirectionSvg + '>';

	        for (i = 0; i < stops.length; i+= 1) {
	            if (stops[i].value) {
	                color = stops[i].value[0];
	                position = stops[i].value[1];
	            } else {
	                color = stops[i];
	                position = undefined;
	            }

	            if (!(color instanceof tree.Color) || (!((i === 0 || i+1 === stops.length) && position === undefined) && !(position instanceof tree.Dimension))) {
	                throwArgumentDescriptor();
	            }
	            positionValue = position ? position.toCSS(renderEnv) : i === 0 ? "0%" : "100%";
	            alpha = color.alpha;
	            returner += '<stop offset="' + positionValue + '" stop-color="' + color.toRGB() + '"' + (alpha < 1 ? ' stop-opacity="' + alpha + '"' : '') + '/>';
	        }
	        returner += '</' + gradientType + 'Gradient>' +
	                    '<rect ' + rectangleDimension + ' fill="url(#gradient)" /></svg>';

	        if (useBase64) {
	            // only works in node, needs interface to what is supported in environment
	            try {
	                returner = new Buffer(returner).toString('base64');
	            } catch(e) {
	                useBase64 = false;
	            }
	        }

	        returner = "'data:image/svg+xml" + (useBase64 ? ";base64" : "") + "," + returner + "'";
	        return new(tree.URL)(new(tree.Anonymous)(returner));
	    }
	};

	// these static methods are used as a fallback when the optional 'mime' dependency is missing
	tree._mime = {
	    // this map is intentionally incomplete
	    // if you want more, install 'mime' dep
	    _types: {
	        '.htm' : 'text/html',
	        '.html': 'text/html',
	        '.gif' : 'image/gif',
	        '.jpg' : 'image/jpeg',
	        '.jpeg': 'image/jpeg',
	        '.png' : 'image/png'
	    },
	    lookup: function (filepath) {
	        var ext = require(16).extname(filepath),
	            type = tree._mime._types[ext];
	        if (type === undefined) {
	            throw new Error('Optional dependency "mime" is required for ' + ext);
	        }
	        return type;
	    },
	    charsets: {
	        lookup: function (type) {
	            // assumes all text types are UTF-8
	            return type && (/^text\//).test(type) ? 'UTF-8' : '';
	        }
	    }
	};

	var mathFunctions = [{name:"ceil"}, {name:"floor"}, {name: "sqrt"}, {name:"abs"},
	        {name:"tan", unit: ""}, {name:"sin", unit: ""}, {name:"cos", unit: ""},
	        {name:"atan", unit: "rad"}, {name:"asin", unit: "rad"}, {name:"acos", unit: "rad"}],
	    createMathFunction = function(name, unit) {
	        return function(n) {
	            /*jshint eqnull:true */
	            if (unit != null) {
	                n = n.unify();
	            }
	            return this._math(Math[name], unit, n);
	        };
	    };

	for(var i = 0; i < mathFunctions.length; i++) {
	    tree.functions[mathFunctions[i].name] = createMathFunction(mathFunctions[i].name, mathFunctions[i].unit);
	}

	function hsla(color) {
	    return tree.functions.hsla(color.h, color.s, color.l, color.a);
	}

	function scaled(n, size) {
	    if (n instanceof tree.Dimension && n.unit.is('%')) {
	        return parseFloat(n.value * size / 100);
	    } else {
	        return number(n);
	    }
	}

	function number(n) {
	    if (n instanceof tree.Dimension) {
	        return parseFloat(n.unit.is('%') ? n.value / 100 : n.value);
	    } else if (typeof(n) === 'number') {
	        return n;
	    } else {
	        throw {
	            error: "RuntimeError",
	            message: "color functions take numbers as parameters"
	        };
	    }
	}

	function clamp(val) {
	    return Math.min(1, Math.max(0, val));
	}

	tree.functionCall = function(env, currentFileInfo) {
	    this.env = env;
	    this.currentFileInfo = currentFileInfo;
	};

	tree.functionCall.prototype = tree.functions;

	})(require(4));
	
	/* WEBPACK VAR INJECTION */}.call(exports, require, require(50).Buffer))

/***/ },

/***/ 8:
/***/ function(module, exports, require) {

	(function (tree) {
	    tree.colors = {
	        'aliceblue':'#f0f8ff',
	        'antiquewhite':'#faebd7',
	        'aqua':'#00ffff',
	        'aquamarine':'#7fffd4',
	        'azure':'#f0ffff',
	        'beige':'#f5f5dc',
	        'bisque':'#ffe4c4',
	        'black':'#000000',
	        'blanchedalmond':'#ffebcd',
	        'blue':'#0000ff',
	        'blueviolet':'#8a2be2',
	        'brown':'#a52a2a',
	        'burlywood':'#deb887',
	        'cadetblue':'#5f9ea0',
	        'chartreuse':'#7fff00',
	        'chocolate':'#d2691e',
	        'coral':'#ff7f50',
	        'cornflowerblue':'#6495ed',
	        'cornsilk':'#fff8dc',
	        'crimson':'#dc143c',
	        'cyan':'#00ffff',
	        'darkblue':'#00008b',
	        'darkcyan':'#008b8b',
	        'darkgoldenrod':'#b8860b',
	        'darkgray':'#a9a9a9',
	        'darkgrey':'#a9a9a9',
	        'darkgreen':'#006400',
	        'darkkhaki':'#bdb76b',
	        'darkmagenta':'#8b008b',
	        'darkolivegreen':'#556b2f',
	        'darkorange':'#ff8c00',
	        'darkorchid':'#9932cc',
	        'darkred':'#8b0000',
	        'darksalmon':'#e9967a',
	        'darkseagreen':'#8fbc8f',
	        'darkslateblue':'#483d8b',
	        'darkslategray':'#2f4f4f',
	        'darkslategrey':'#2f4f4f',
	        'darkturquoise':'#00ced1',
	        'darkviolet':'#9400d3',
	        'deeppink':'#ff1493',
	        'deepskyblue':'#00bfff',
	        'dimgray':'#696969',
	        'dimgrey':'#696969',
	        'dodgerblue':'#1e90ff',
	        'firebrick':'#b22222',
	        'floralwhite':'#fffaf0',
	        'forestgreen':'#228b22',
	        'fuchsia':'#ff00ff',
	        'gainsboro':'#dcdcdc',
	        'ghostwhite':'#f8f8ff',
	        'gold':'#ffd700',
	        'goldenrod':'#daa520',
	        'gray':'#808080',
	        'grey':'#808080',
	        'green':'#008000',
	        'greenyellow':'#adff2f',
	        'honeydew':'#f0fff0',
	        'hotpink':'#ff69b4',
	        'indianred':'#cd5c5c',
	        'indigo':'#4b0082',
	        'ivory':'#fffff0',
	        'khaki':'#f0e68c',
	        'lavender':'#e6e6fa',
	        'lavenderblush':'#fff0f5',
	        'lawngreen':'#7cfc00',
	        'lemonchiffon':'#fffacd',
	        'lightblue':'#add8e6',
	        'lightcoral':'#f08080',
	        'lightcyan':'#e0ffff',
	        'lightgoldenrodyellow':'#fafad2',
	        'lightgray':'#d3d3d3',
	        'lightgrey':'#d3d3d3',
	        'lightgreen':'#90ee90',
	        'lightpink':'#ffb6c1',
	        'lightsalmon':'#ffa07a',
	        'lightseagreen':'#20b2aa',
	        'lightskyblue':'#87cefa',
	        'lightslategray':'#778899',
	        'lightslategrey':'#778899',
	        'lightsteelblue':'#b0c4de',
	        'lightyellow':'#ffffe0',
	        'lime':'#00ff00',
	        'limegreen':'#32cd32',
	        'linen':'#faf0e6',
	        'magenta':'#ff00ff',
	        'maroon':'#800000',
	        'mediumaquamarine':'#66cdaa',
	        'mediumblue':'#0000cd',
	        'mediumorchid':'#ba55d3',
	        'mediumpurple':'#9370d8',
	        'mediumseagreen':'#3cb371',
	        'mediumslateblue':'#7b68ee',
	        'mediumspringgreen':'#00fa9a',
	        'mediumturquoise':'#48d1cc',
	        'mediumvioletred':'#c71585',
	        'midnightblue':'#191970',
	        'mintcream':'#f5fffa',
	        'mistyrose':'#ffe4e1',
	        'moccasin':'#ffe4b5',
	        'navajowhite':'#ffdead',
	        'navy':'#000080',
	        'oldlace':'#fdf5e6',
	        'olive':'#808000',
	        'olivedrab':'#6b8e23',
	        'orange':'#ffa500',
	        'orangered':'#ff4500',
	        'orchid':'#da70d6',
	        'palegoldenrod':'#eee8aa',
	        'palegreen':'#98fb98',
	        'paleturquoise':'#afeeee',
	        'palevioletred':'#d87093',
	        'papayawhip':'#ffefd5',
	        'peachpuff':'#ffdab9',
	        'peru':'#cd853f',
	        'pink':'#ffc0cb',
	        'plum':'#dda0dd',
	        'powderblue':'#b0e0e6',
	        'purple':'#800080',
	        'red':'#ff0000',
	        'rosybrown':'#bc8f8f',
	        'royalblue':'#4169e1',
	        'saddlebrown':'#8b4513',
	        'salmon':'#fa8072',
	        'sandybrown':'#f4a460',
	        'seagreen':'#2e8b57',
	        'seashell':'#fff5ee',
	        'sienna':'#a0522d',
	        'silver':'#c0c0c0',
	        'skyblue':'#87ceeb',
	        'slateblue':'#6a5acd',
	        'slategray':'#708090',
	        'slategrey':'#708090',
	        'snow':'#fffafa',
	        'springgreen':'#00ff7f',
	        'steelblue':'#4682b4',
	        'tan':'#d2b48c',
	        'teal':'#008080',
	        'thistle':'#d8bfd8',
	        'tomato':'#ff6347',
	        // 'transparent':'rgba(0,0,0,0)',
	        'turquoise':'#40e0d0',
	        'violet':'#ee82ee',
	        'wheat':'#f5deb3',
	        'white':'#ffffff',
	        'whitesmoke':'#f5f5f5',
	        'yellow':'#ffff00',
	        'yellowgreen':'#9acd32'
	    };
	})(require(4));


/***/ },

/***/ 9:
/***/ function(module, exports, require) {

	(function (tree) {

	    tree.visitor = function(implementation) {
	        this._implementation = implementation;
	    };

	    tree.visitor.prototype = {
	        visit: function(node) {

	            if (node instanceof Array) {
	                return this.visitArray(node);
	            }

	            if (!node || !node.type) {
	                return node;
	            }

	            var funcName = "visit" + node.type,
	                func = this._implementation[funcName],
	                visitArgs, newNode;
	            if (func) {
	                visitArgs = {visitDeeper: true};
	                newNode = func.call(this._implementation, node, visitArgs);
	                if (this._implementation.isReplacing) {
	                    node = newNode;
	                }
	            }
	            if ((!visitArgs || visitArgs.visitDeeper) && node && node.accept) {
	                node.accept(this);
	            }
	            funcName = funcName + "Out";
	            if (this._implementation[funcName]) {
	                this._implementation[funcName](node);
	            }
	            return node;
	        },
	        visitArray: function(nodes) {
	            var i, newNodes = [];
	            for(i = 0; i < nodes.length; i++) {
	                var evald = this.visit(nodes[i]);
	                if (evald instanceof Array) {
	                    evald = this.flatten(evald);
	                    newNodes = newNodes.concat(evald);
	                } else {
	                    newNodes.push(evald);
	                }
	            }
	            if (this._implementation.isReplacing) {
	                return newNodes;
	            }
	            return nodes;
	        },
	        doAccept: function (node) {
	            node.accept(this);
	        },
	        flatten: function(arr, master) {
	            return arr.reduce(this.flattenReduce.bind(this), master || []);
	        },
	        flattenReduce: function(sum, element) {
	            if (element instanceof Array) {
	                sum = this.flatten(element, sum);
	            } else {
	                sum.push(element);
	            }
	            return sum;
	        }
	    };

	})(require(4));

/***/ },

/***/ 10:
/***/ function(module, exports, require) {

	(function (tree) {
	    tree.importVisitor = function(importer, finish, evalEnv) {
	        this._visitor = new tree.visitor(this);
	        this._importer = importer;
	        this._finish = finish;
	        this.env = evalEnv || new tree.evalEnv();
	        this.importCount = 0;
	    };

	    tree.importVisitor.prototype = {
	        isReplacing: true,
	        run: function (root) {
	            var error;
	            try {
	                // process the contents
	                this._visitor.visit(root);
	            }
	            catch(e) {
	                error = e;
	            }

	            this.isFinished = true;

	            if (this.importCount === 0) {
	                this._finish(error);
	            }
	        },
	        visitImport: function (importNode, visitArgs) {
	            var importVisitor = this,
	                evaldImportNode,
	                inlineCSS = importNode.options.inline;

	            if (!importNode.css || inlineCSS) {

	                try {
	                    evaldImportNode = importNode.evalForImport(this.env);
	                } catch(e){
	                    if (!e.filename) { e.index = importNode.index; e.filename = importNode.currentFileInfo.filename; }
	                    // attempt to eval properly and treat as css
	                    importNode.css = true;
	                    // if that fails, this error will be thrown
	                    importNode.error = e;
	                }

	                if (evaldImportNode && (!evaldImportNode.css || inlineCSS)) {
	                    importNode = evaldImportNode;
	                    this.importCount++;
	                    var env = new tree.evalEnv(this.env, this.env.frames.slice(0));

	                    this._importer.push(importNode.getPath(), importNode.currentFileInfo, importNode.options, function (e, root, imported) {
	                        if (e && !e.filename) { e.index = importNode.index; e.filename = importNode.currentFileInfo.filename; }
	                        if (imported && !importNode.options.multiple) { importNode.skip = imported; }

	                        var subFinish = function(e) {
	                            importVisitor.importCount--;

	                            if (importVisitor.importCount === 0 && importVisitor.isFinished) {
	                                importVisitor._finish(e);
	                            }
	                        };

	                        if (root) {
	                            importNode.root = root;
	                            if (!inlineCSS && !importNode.skip) {
	                                new(tree.importVisitor)(importVisitor._importer, subFinish, env)
	                                    .run(root);
	                                return;
	                            }
	                        }

	                        subFinish();
	                    });
	                }
	            }
	            visitArgs.visitDeeper = false;
	            return importNode;
	        },
	        visitRule: function (ruleNode, visitArgs) {
	            visitArgs.visitDeeper = false;
	            return ruleNode;
	        },
	        visitDirective: function (directiveNode, visitArgs) {
	            this.env.frames.unshift(directiveNode);
	            return directiveNode;
	        },
	        visitDirectiveOut: function (directiveNode) {
	            this.env.frames.shift();
	        },
	        visitMixinDefinition: function (mixinDefinitionNode, visitArgs) {
	            this.env.frames.unshift(mixinDefinitionNode);
	            return mixinDefinitionNode;
	        },
	        visitMixinDefinitionOut: function (mixinDefinitionNode) {
	            this.env.frames.shift();
	        },
	        visitRuleset: function (rulesetNode, visitArgs) {
	            this.env.frames.unshift(rulesetNode);
	            return rulesetNode;
	        },
	        visitRulesetOut: function (rulesetNode) {
	            this.env.frames.shift();
	        },
	        visitMedia: function (mediaNode, visitArgs) {
	            this.env.frames.unshift(mediaNode.ruleset);
	            return mediaNode;
	        },
	        visitMediaOut: function (mediaNode) {
	            this.env.frames.shift();
	        }
	    };

	})(require(4));

/***/ },

/***/ 11:
/***/ function(module, exports, require) {

	(function (tree) {
	    /*jshint loopfunc:true */

	    tree.extendFinderVisitor = function() {
	        this._visitor = new tree.visitor(this);
	        this.contexts = [];
	        this.allExtendsStack = [[]];
	    };

	    tree.extendFinderVisitor.prototype = {
	        run: function (root) {
	            root = this._visitor.visit(root);
	            root.allExtends = this.allExtendsStack[0];
	            return root;
	        },
	        visitRule: function (ruleNode, visitArgs) {
	            visitArgs.visitDeeper = false;
	        },
	        visitMixinDefinition: function (mixinDefinitionNode, visitArgs) {
	            visitArgs.visitDeeper = false;
	        },
	        visitRuleset: function (rulesetNode, visitArgs) {

	            if (rulesetNode.root) {
	                return;
	            }

	            var i, j, extend, allSelectorsExtendList = [], extendList;

	            // get &:extend(.a); rules which apply to all selectors in this ruleset
	            for(i = 0; i < rulesetNode.rules.length; i++) {
	                if (rulesetNode.rules[i] instanceof tree.Extend) {
	                    allSelectorsExtendList.push(rulesetNode.rules[i]);
	                }
	            }

	            // now find every selector and apply the extends that apply to all extends
	            // and the ones which apply to an individual extend
	            for(i = 0; i < rulesetNode.paths.length; i++) {
	                var selectorPath = rulesetNode.paths[i],
	                    selector = selectorPath[selectorPath.length-1];
	                extendList = selector.extendList.slice(0).concat(allSelectorsExtendList).map(function(allSelectorsExtend) {
	                    return allSelectorsExtend.clone();
	                });
	                for(j = 0; j < extendList.length; j++) {
	                    this.foundExtends = true;
	                    extend = extendList[j];
	                    extend.findSelfSelectors(selectorPath);
	                    extend.ruleset = rulesetNode;
	                    if (j === 0) { extend.firstExtendOnThisSelectorPath = true; }
	                    this.allExtendsStack[this.allExtendsStack.length-1].push(extend);
	                }
	            }

	            this.contexts.push(rulesetNode.selectors);
	        },
	        visitRulesetOut: function (rulesetNode) {
	            if (!rulesetNode.root) {
	                this.contexts.length = this.contexts.length - 1;
	            }
	        },
	        visitMedia: function (mediaNode, visitArgs) {
	            mediaNode.allExtends = [];
	            this.allExtendsStack.push(mediaNode.allExtends);
	        },
	        visitMediaOut: function (mediaNode) {
	            this.allExtendsStack.length = this.allExtendsStack.length - 1;
	        },
	        visitDirective: function (directiveNode, visitArgs) {
	            directiveNode.allExtends = [];
	            this.allExtendsStack.push(directiveNode.allExtends);
	        },
	        visitDirectiveOut: function (directiveNode) {
	            this.allExtendsStack.length = this.allExtendsStack.length - 1;
	        }
	    };

	    tree.processExtendsVisitor = function() {
	        this._visitor = new tree.visitor(this);
	    };

	    tree.processExtendsVisitor.prototype = {
	        run: function(root) {
	            var extendFinder = new tree.extendFinderVisitor();
	            extendFinder.run(root);
	            if (!extendFinder.foundExtends) { return root; }
	            root.allExtends = root.allExtends.concat(this.doExtendChaining(root.allExtends, root.allExtends));
	            this.allExtendsStack = [root.allExtends];
	            return this._visitor.visit(root);
	        },
	        doExtendChaining: function (extendsList, extendsListTarget, iterationCount) {
	            //
	            // chaining is different from normal extension.. if we extend an extend then we are not just copying, altering and pasting
	            // the selector we would do normally, but we are also adding an extend with the same target selector
	            // this means this new extend can then go and alter other extends
	            //
	            // this method deals with all the chaining work - without it, extend is flat and doesn't work on other extend selectors
	            // this is also the most expensive.. and a match on one selector can cause an extension of a selector we had already processed if
	            // we look at each selector at a time, as is done in visitRuleset

	            var extendIndex, targetExtendIndex, matches, extendsToAdd = [], newSelector, extendVisitor = this, selectorPath, extend, targetExtend, newExtend;

	            iterationCount = iterationCount || 0;

	            //loop through comparing every extend with every target extend.
	            // a target extend is the one on the ruleset we are looking at copy/edit/pasting in place
	            // e.g.  .a:extend(.b) {}  and .b:extend(.c) {} then the first extend extends the second one
	            // and the second is the target.
	            // the seperation into two lists allows us to process a subset of chains with a bigger set, as is the
	            // case when processing media queries
	            for(extendIndex = 0; extendIndex < extendsList.length; extendIndex++){
	                for(targetExtendIndex = 0; targetExtendIndex < extendsListTarget.length; targetExtendIndex++){

	                    extend = extendsList[extendIndex];
	                    targetExtend = extendsListTarget[targetExtendIndex];

	                    // look for circular references
	                    if (this.inInheritanceChain(targetExtend, extend)) { continue; }

	                    // find a match in the target extends self selector (the bit before :extend)
	                    selectorPath = [targetExtend.selfSelectors[0]];
	                    matches = extendVisitor.findMatch(extend, selectorPath);

	                    if (matches.length) {

	                        // we found a match, so for each self selector..
	                        extend.selfSelectors.forEach(function(selfSelector) {

	                            // process the extend as usual
	                            newSelector = extendVisitor.extendSelector(matches, selectorPath, selfSelector);

	                            // but now we create a new extend from it
	                            newExtend = new(tree.Extend)(targetExtend.selector, targetExtend.option, 0);
	                            newExtend.selfSelectors = newSelector;

	                            // add the extend onto the list of extends for that selector
	                            newSelector[newSelector.length-1].extendList = [newExtend];

	                            // record that we need to add it.
	                            extendsToAdd.push(newExtend);
	                            newExtend.ruleset = targetExtend.ruleset;

	                            //remember its parents for circular references
	                            newExtend.parents = [targetExtend, extend];

	                            // only process the selector once.. if we have :extend(.a,.b) then multiple
	                            // extends will look at the same selector path, so when extending
	                            // we know that any others will be duplicates in terms of what is added to the css
	                            if (targetExtend.firstExtendOnThisSelectorPath) {
	                                newExtend.firstExtendOnThisSelectorPath = true;
	                                targetExtend.ruleset.paths.push(newSelector);
	                            }
	                        });
	                    }
	                }
	            }

	            if (extendsToAdd.length) {
	                // try to detect circular references to stop a stack overflow.
	                // may no longer be needed.
	                this.extendChainCount++;
	                if (iterationCount > 100) {
	                    var selectorOne = "{unable to calculate}";
	                    var selectorTwo = "{unable to calculate}";
	                    try
	                    {
	                        selectorOne = extendsToAdd[0].selfSelectors[0].toCSS();
	                        selectorTwo = extendsToAdd[0].selector.toCSS();
	                    }
	                    catch(e) {}
	                    throw {message: "extend circular reference detected. One of the circular extends is currently:"+selectorOne+":extend(" + selectorTwo+")"};
	                }

	                // now process the new extends on the existing rules so that we can handle a extending b extending c ectending d extending e...
	                return extendsToAdd.concat(extendVisitor.doExtendChaining(extendsToAdd, extendsListTarget, iterationCount+1));
	            } else {
	                return extendsToAdd;
	            }
	        },
	        inInheritanceChain: function (possibleParent, possibleChild) {
	            if (possibleParent === possibleChild) {
	                return true;
	            }
	            if (possibleChild.parents) {
	                if (this.inInheritanceChain(possibleParent, possibleChild.parents[0])) {
	                    return true;
	                }
	                if (this.inInheritanceChain(possibleParent, possibleChild.parents[1])) {
	                    return true;
	                }
	            }
	            return false;
	        },
	        visitRule: function (ruleNode, visitArgs) {
	            visitArgs.visitDeeper = false;
	        },
	        visitMixinDefinition: function (mixinDefinitionNode, visitArgs) {
	            visitArgs.visitDeeper = false;
	        },
	        visitSelector: function (selectorNode, visitArgs) {
	            visitArgs.visitDeeper = false;
	        },
	        visitRuleset: function (rulesetNode, visitArgs) {
	            if (rulesetNode.root) {
	                return;
	            }
	            var matches, pathIndex, extendIndex, allExtends = this.allExtendsStack[this.allExtendsStack.length-1], selectorsToAdd = [], extendVisitor = this, selectorPath;

	            // look at each selector path in the ruleset, find any extend matches and then copy, find and replace

	            for(extendIndex = 0; extendIndex < allExtends.length; extendIndex++) {
	                for(pathIndex = 0; pathIndex < rulesetNode.paths.length; pathIndex++) {

	                    selectorPath = rulesetNode.paths[pathIndex];

	                    // extending extends happens initially, before the main pass
	                    if (selectorPath[selectorPath.length-1].extendList.length) { continue; }

	                    matches = this.findMatch(allExtends[extendIndex], selectorPath);

	                    if (matches.length) {

	                        allExtends[extendIndex].selfSelectors.forEach(function(selfSelector) {
	                            selectorsToAdd.push(extendVisitor.extendSelector(matches, selectorPath, selfSelector));
	                        });
	                    }
	                }
	            }
	            rulesetNode.paths = rulesetNode.paths.concat(selectorsToAdd);
	        },
	        findMatch: function (extend, haystackSelectorPath) {
	            //
	            // look through the haystack selector path to try and find the needle - extend.selector
	            // returns an array of selector matches that can then be replaced
	            //
	            var haystackSelectorIndex, hackstackSelector, hackstackElementIndex, haystackElement,
	                targetCombinator, i,
	                extendVisitor = this,
	                needleElements = extend.selector.elements,
	                potentialMatches = [], potentialMatch, matches = [];

	            // loop through the haystack elements
	            for(haystackSelectorIndex = 0; haystackSelectorIndex < haystackSelectorPath.length; haystackSelectorIndex++) {
	                hackstackSelector = haystackSelectorPath[haystackSelectorIndex];

	                for(hackstackElementIndex = 0; hackstackElementIndex < hackstackSelector.elements.length; hackstackElementIndex++) {

	                    haystackElement = hackstackSelector.elements[hackstackElementIndex];

	                    // if we allow elements before our match we can add a potential match every time. otherwise only at the first element.
	                    if (extend.allowBefore || (haystackSelectorIndex === 0 && hackstackElementIndex === 0)) {
	                        potentialMatches.push({pathIndex: haystackSelectorIndex, index: hackstackElementIndex, matched: 0, initialCombinator: haystackElement.combinator});
	                    }

	                    for(i = 0; i < potentialMatches.length; i++) {
	                        potentialMatch = potentialMatches[i];

	                        // selectors add " " onto the first element. When we use & it joins the selectors together, but if we don't
	                        // then each selector in haystackSelectorPath has a space before it added in the toCSS phase. so we need to work out
	                        // what the resulting combinator will be
	                        targetCombinator = haystackElement.combinator.value;
	                        if (targetCombinator === '' && hackstackElementIndex === 0) {
	                            targetCombinator = ' ';
	                        }

	                        // if we don't match, null our match to indicate failure
	                        if (!extendVisitor.isElementValuesEqual(needleElements[potentialMatch.matched].value, haystackElement.value) ||
	                            (potentialMatch.matched > 0 && needleElements[potentialMatch.matched].combinator.value !== targetCombinator)) {
	                            potentialMatch = null;
	                        } else {
	                            potentialMatch.matched++;
	                        }

	                        // if we are still valid and have finished, test whether we have elements after and whether these are allowed
	                        if (potentialMatch) {
	                            potentialMatch.finished = potentialMatch.matched === needleElements.length;
	                            if (potentialMatch.finished &&
	                                (!extend.allowAfter && (hackstackElementIndex+1 < hackstackSelector.elements.length || haystackSelectorIndex+1 < haystackSelectorPath.length))) {
	                                potentialMatch = null;
	                            }
	                        }
	                        // if null we remove, if not, we are still valid, so either push as a valid match or continue
	                        if (potentialMatch) {
	                            if (potentialMatch.finished) {
	                                potentialMatch.length = needleElements.length;
	                                potentialMatch.endPathIndex = haystackSelectorIndex;
	                                potentialMatch.endPathElementIndex = hackstackElementIndex + 1; // index after end of match
	                                potentialMatches.length = 0; // we don't allow matches to overlap, so start matching again
	                                matches.push(potentialMatch);
	                            }
	                        } else {
	                            potentialMatches.splice(i, 1);
	                            i--;
	                        }
	                    }
	                }
	            }
	            return matches;
	        },
	        isElementValuesEqual: function(elementValue1, elementValue2) {
	            if (typeof elementValue1 === "string" || typeof elementValue2 === "string") {
	                return elementValue1 === elementValue2;
	            }
	            if (elementValue1 instanceof tree.Attribute) {
	                if (elementValue1.op !== elementValue2.op || elementValue1.key !== elementValue2.key) {
	                    return false;
	                }
	                if (!elementValue1.value || !elementValue2.value) {
	                    if (elementValue1.value || elementValue2.value) {
	                        return false;
	                    }
	                    return true;
	                }
	                elementValue1 = elementValue1.value.value || elementValue1.value;
	                elementValue2 = elementValue2.value.value || elementValue2.value;
	                return elementValue1 === elementValue2;
	            }
	            return false;
	        },
	        extendSelector:function (matches, selectorPath, replacementSelector) {

	            //for a set of matches, replace each match with the replacement selector

	            var currentSelectorPathIndex = 0,
	                currentSelectorPathElementIndex = 0,
	                path = [],
	                matchIndex,
	                selector,
	                firstElement,
	                match;

	            for (matchIndex = 0; matchIndex < matches.length; matchIndex++) {
	                match = matches[matchIndex];
	                selector = selectorPath[match.pathIndex];
	                firstElement = new tree.Element(
	                    match.initialCombinator,
	                    replacementSelector.elements[0].value,
	                    replacementSelector.elements[0].index,
	                    replacementSelector.elements[0].currentFileInfo
	                );

	                if (match.pathIndex > currentSelectorPathIndex && currentSelectorPathElementIndex > 0) {
	                    path[path.length - 1].elements = path[path.length - 1].elements.concat(selectorPath[currentSelectorPathIndex].elements.slice(currentSelectorPathElementIndex));
	                    currentSelectorPathElementIndex = 0;
	                    currentSelectorPathIndex++;
	                }

	                path = path.concat(selectorPath.slice(currentSelectorPathIndex, match.pathIndex));

	                path.push(new tree.Selector(
	                    selector.elements
	                        .slice(currentSelectorPathElementIndex, match.index)
	                        .concat([firstElement])
	                        .concat(replacementSelector.elements.slice(1))
	                ));
	                currentSelectorPathIndex = match.endPathIndex;
	                currentSelectorPathElementIndex = match.endPathElementIndex;
	                if (currentSelectorPathElementIndex >= selector.elements.length) {
	                    currentSelectorPathElementIndex = 0;
	                    currentSelectorPathIndex++;
	                }
	            }

	            if (currentSelectorPathIndex < selectorPath.length && currentSelectorPathElementIndex > 0) {
	                path[path.length - 1].elements = path[path.length - 1].elements.concat(selectorPath[currentSelectorPathIndex].elements.slice(currentSelectorPathElementIndex));
	                currentSelectorPathElementIndex = 0;
	                currentSelectorPathIndex++;
	            }

	            path = path.concat(selectorPath.slice(currentSelectorPathIndex, selectorPath.length));

	            return path;
	        },
	        visitRulesetOut: function (rulesetNode) {
	        },
	        visitMedia: function (mediaNode, visitArgs) {
	            var newAllExtends = mediaNode.allExtends.concat(this.allExtendsStack[this.allExtendsStack.length-1]);
	            newAllExtends = newAllExtends.concat(this.doExtendChaining(newAllExtends, mediaNode.allExtends));
	            this.allExtendsStack.push(newAllExtends);
	        },
	        visitMediaOut: function (mediaNode) {
	            this.allExtendsStack.length = this.allExtendsStack.length - 1;
	        },
	        visitDirective: function (directiveNode, visitArgs) {
	            var newAllExtends = directiveNode.allExtends.concat(this.allExtendsStack[this.allExtendsStack.length-1]);
	            newAllExtends = newAllExtends.concat(this.doExtendChaining(newAllExtends, directiveNode.allExtends));
	            this.allExtendsStack.push(newAllExtends);
	        },
	        visitDirectiveOut: function (directiveNode) {
	            this.allExtendsStack.length = this.allExtendsStack.length - 1;
	        }
	    };

	})(require(4));


/***/ },

/***/ 12:
/***/ function(module, exports, require) {

	(function (tree) {
	    tree.joinSelectorVisitor = function() {
	        this.contexts = [[]];
	        this._visitor = new tree.visitor(this);
	    };

	    tree.joinSelectorVisitor.prototype = {
	        run: function (root) {
	            return this._visitor.visit(root);
	        },
	        visitRule: function (ruleNode, visitArgs) {
	            visitArgs.visitDeeper = false;
	        },
	        visitMixinDefinition: function (mixinDefinitionNode, visitArgs) {
	            visitArgs.visitDeeper = false;
	        },

	        visitRuleset: function (rulesetNode, visitArgs) {
	            var context = this.contexts[this.contexts.length - 1];
	            var paths = [];
	            this.contexts.push(paths);

	            if (! rulesetNode.root) {
	                rulesetNode.selectors = rulesetNode.selectors.filter(function(selector) { return selector.getIsOutput(); });
	                if (rulesetNode.selectors.length === 0) {
	                    rulesetNode.rules.length = 0;
	                }
	                rulesetNode.joinSelectors(paths, context, rulesetNode.selectors);
	                rulesetNode.paths = paths;
	            }
	        },
	        visitRulesetOut: function (rulesetNode) {
	            this.contexts.length = this.contexts.length - 1;
	        },
	        visitMedia: function (mediaNode, visitArgs) {
	            var context = this.contexts[this.contexts.length - 1];
	            mediaNode.rules[0].root = (context.length === 0 || context[0].multiMedia);
	        }
	    };

	})(require(4));

/***/ },

/***/ 13:
/***/ function(module, exports, require) {

	(function (tree) {
	    tree.toCSSVisitor = function(env) {
	        this._visitor = new tree.visitor(this);
	        this._env = env;
	    };

	    tree.toCSSVisitor.prototype = {
	        isReplacing: true,
	        run: function (root) {
	            return this._visitor.visit(root);
	        },

	        visitRule: function (ruleNode, visitArgs) {
	            if (ruleNode.variable) {
	                return [];
	            }
	            return ruleNode;
	        },

	        visitMixinDefinition: function (mixinNode, visitArgs) {
	            return [];
	        },

	        visitExtend: function (extendNode, visitArgs) {
	            return [];
	        },

	        visitComment: function (commentNode, visitArgs) {
	            if (commentNode.isSilent(this._env)) {
	                return [];
	            }
	            return commentNode;
	        },

	        visitMedia: function(mediaNode, visitArgs) {
	            mediaNode.accept(this._visitor);
	            visitArgs.visitDeeper = false;

	            if (!mediaNode.rules.length) {
	                return [];
	            }
	            return mediaNode;
	        },

	        visitDirective: function(directiveNode, visitArgs) {
	            if (directiveNode.currentFileInfo.reference && !directiveNode.isReferenced) {
	                return [];
	            }
	            if (directiveNode.name === "@charset") {
	                // Only output the debug info together with subsequent @charset definitions
	                // a comment (or @media statement) before the actual @charset directive would
	                // be considered illegal css as it has to be on the first line
	                if (this.charset) {
	                    if (directiveNode.debugInfo) {
	                        var comment = new tree.Comment("/* " + directiveNode.toCSS(this._env).replace(/\n/g, "")+" */\n");
	                        comment.debugInfo = directiveNode.debugInfo;
	                        return this._visitor.visit(comment);
	                    }
	                    return [];
	                }
	                this.charset = true;
	            }
	            return directiveNode;
	        },

	        checkPropertiesInRoot: function(rules) {
	            var ruleNode;
	            for(var i = 0; i < rules.length; i++) {
	                ruleNode = rules[i];
	                if (ruleNode instanceof tree.Rule && !ruleNode.variable) {
	                    throw { message: "properties must be inside selector blocks, they cannot be in the root.",
	                        index: ruleNode.index, filename: ruleNode.currentFileInfo ? ruleNode.currentFileInfo.filename : null};
	                }
	            }
	        },

	        visitRuleset: function (rulesetNode, visitArgs) {
	            var rule, rulesets = [];
	            if (rulesetNode.firstRoot) {
	                this.checkPropertiesInRoot(rulesetNode.rules);
	            }
	            if (! rulesetNode.root) {

	                rulesetNode.paths = rulesetNode.paths
	                    .filter(function(p) {
	                        var i;
	                        if (p[0].elements[0].combinator.value === ' ') {
	                            p[0].elements[0].combinator = new(tree.Combinator)('');
	                        }
	                        for(i = 0; i < p.length; i++) {
	                            if (p[i].getIsReferenced() && p[i].getIsOutput()) {
	                                return true;
	                            }
	                            return false;
	                        }
	                    });

	                // Compile rules and rulesets
	                for (var i = 0; i < rulesetNode.rules.length; i++) {
	                    rule = rulesetNode.rules[i];

	                    if (rule.rules) {
	                        // visit because we are moving them out from being a child
	                        rulesets.push(this._visitor.visit(rule));
	                        rulesetNode.rules.splice(i, 1);
	                        i--;
	                        continue;
	                    }
	                }
	                // accept the visitor to remove rules and refactor itself
	                // then we can decide now whether we want it or not
	                if (rulesetNode.rules.length > 0) {
	                    rulesetNode.accept(this._visitor);
	                }
	                visitArgs.visitDeeper = false;

	                this._mergeRules(rulesetNode.rules);
	                this._removeDuplicateRules(rulesetNode.rules);

	                // now decide whether we keep the ruleset
	                if (rulesetNode.rules.length > 0 && rulesetNode.paths.length > 0) {
	                    rulesets.splice(0, 0, rulesetNode);
	                }
	            } else {
	                rulesetNode.accept(this._visitor);
	                visitArgs.visitDeeper = false;
	                if (rulesetNode.firstRoot || rulesetNode.rules.length > 0) {
	                    rulesets.splice(0, 0, rulesetNode);
	                }
	            }
	            if (rulesets.length === 1) {
	                return rulesets[0];
	            }
	            return rulesets;
	        },

	        _removeDuplicateRules: function(rules) {
	            // remove duplicates
	            var ruleCache = {},
	                ruleList, rule, i;
	            for(i = rules.length - 1; i >= 0 ; i--) {
	                rule = rules[i];
	                if (rule instanceof tree.Rule) {
	                    if (!ruleCache[rule.name]) {
	                        ruleCache[rule.name] = rule;
	                    } else {
	                        ruleList = ruleCache[rule.name];
	                        if (ruleList instanceof tree.Rule) {
	                            ruleList = ruleCache[rule.name] = [ruleCache[rule.name].toCSS(this._env)];
	                        }
	                        var ruleCSS = rule.toCSS(this._env);
	                        if (ruleList.indexOf(ruleCSS) !== -1) {
	                            rules.splice(i, 1);
	                        } else {
	                            ruleList.push(ruleCSS);
	                        }
	                    }
	                }
	            }
	        },

	        _mergeRules: function (rules) {
	            var groups = {},
	                parts,
	                rule,
	                key;

	            for (var i = 0; i < rules.length; i++) {
	                rule = rules[i];

	                if ((rule instanceof tree.Rule) && rule.merge) {
	                    key = [rule.name,
	                        rule.important ? "!" : ""].join(",");

	                    if (!groups[key]) {
	                        parts = groups[key] = [];
	                    } else {
	                        rules.splice(i--, 1);
	                    }

	                    parts.push(rule);
	                }
	            }

	            Object.keys(groups).map(function (k) {
	                parts = groups[k];

	                if (parts.length > 1) {
	                    rule = parts[0];

	                    rule.value = new (tree.Value)(parts.map(function (p) {
	                        return p.value;
	                    }));
	                }
	            });
	        }
	    };

	})(require(4));

/***/ },

/***/ 14:
/***/ function(module, exports, require) {

	(function (tree) {
	    var sourceMap = require(66);

	    tree.sourceMapOutput = function (options) {
	        this._css = [];
	        this._rootNode = options.rootNode;
	        this._writeSourceMap = options.writeSourceMap;
	        this._contentsMap = options.contentsMap;
	        this._sourceMapFilename = options.sourceMapFilename;
	        this._outputFilename = options.outputFilename;
	        this._sourceMapBasepath = options.sourceMapBasepath;
	        this._sourceMapRootpath = options.sourceMapRootpath;
	        this._outputSourceFiles = options.outputSourceFiles;

	        if (this._sourceMapRootpath && this._sourceMapRootpath.charAt(this._sourceMapRootpath.length-1) !== '/') {
	            this._sourceMapRootpath += '/';
	        }

	        this._lineNumber = 0;
	        this._column = 0;
	    };

	    tree.sourceMapOutput.prototype.normalizeFilename = function(filename) {
	        if (this._sourceMapBasepath && filename.indexOf(this._sourceMapBasepath) === 0) {
	             filename = filename.substring(this._sourceMapBasepath.length);
	             if (filename.charAt(0) === '\\' || filename.charAt(0) === '/') {
	                filename = filename.substring(1);
	             }
	        }
	        return this._sourceMapRootpath + filename.replace(/\\/g, '/');
	    };

	    tree.sourceMapOutput.prototype.add = function(chunk, fileInfo, index) {

	        if (!chunk) {
	            //TODO what is calling this with undefined?
	            return;
	        }

	        var lines,
	            columns;

	        if (fileInfo) {
	            var inputSource = this._contentsMap[fileInfo.filename].substring(0, index);
	            lines = inputSource.split("\n");
	            columns = lines[lines.length-1];
	            this._sourceMapGenerator.addMapping({ generated: { line: this._lineNumber + 1, column: this._column},
	                original: { line: lines.length, column: columns.length},
	                source: this.normalizeFilename(fileInfo.filename)});
	        }
	        lines = chunk.split("\n");
	        columns = lines[lines.length-1];

	        if (lines.length === 1) {
	            this._column += columns.length;
	        } else {
	            this._lineNumber += lines.length - 1;
	            this._column = columns.length;
	        }

	        this._css.push(chunk);
	    };

	    tree.sourceMapOutput.prototype.toCSS = function(env) {
	        this._sourceMapGenerator = new sourceMap.SourceMapGenerator({ file: this._outputFilename, sourceRoot: null });

	        if (this._outputSourceFiles) {
	            for(var filename in this._contentsMap) {
	                this._sourceMapGenerator.setSourceContent(this.normalizeFilename(filename), this._contentsMap[filename]);
	            }
	        }

	        this._rootNode.genCSS(env, this);

	        this._writeSourceMap(JSON.stringify(this._sourceMapGenerator.toJSON()));

	        if (this._sourceMapFilename) {
	            this._css.push("/*# sourceMappingURL=" + this._sourceMapRootpath + this._sourceMapFilename + " */");
	        }

	        return this._css.join('');
	    };

	})(require(4));

/***/ },

/***/ 15:
/***/ function(module, exports, require) {

	var events = require(20);

	exports = module.exports = new events.EventEmitter();

	exports.nextTick = (function () {
	    var canSetImmediate = typeof window !== 'undefined'
	        && window.setImmediate;
	    var canPost = typeof window !== 'undefined'
	        && window.postMessage && window.addEventListener
	    ;

	    if (canSetImmediate) {
	        return function (f) { return window.setImmediate(f) };
	    }

	    if (canPost) {
	        var queue = [];
	        window.addEventListener('message', function (ev) {
	            if (ev.source === window && ev.data === 'browserify-tick') {
	                ev.stopPropagation();
	                if (queue.length > 0) {
	                    var fn = queue.shift();
	                    fn();
	                }
	            }
	        }, true);

	        return function nextTick(fn) {
	            queue.push(fn);
	            window.postMessage('browserify-tick', '*');
	        };
	    }

	    return function nextTick(fn) {
	        setTimeout(fn, 0);
	    };
	})();

	exports.platform = exports.arch = 
	exports.execPath = exports.title = 'browser';
	exports.pid = 1;
	exports.browser = true;
	exports.env = {};
	exports.argv = [];

	exports.binding = function (name) {
	    if (name === 'evals') return (require)(58)
	    else throw new Error('No such module. (Possibly not yet loaded)')
	};

	(function () {
	    var cwd = '/';
	    var path;
	    exports.cwd = function () { return cwd };
	    exports.chdir = function (dir) {
	        if (!path) path = require(16);
	        cwd = path.resolve(dir, cwd);
	    };
	})();

	exports.exit = exports.kill = 
	exports.umask = exports.dlopen = 
	exports.uptime = exports.memoryUsage = 
	exports.uvCounters = function() {};
	exports.features = {};


/***/ },

/***/ 16:
/***/ function(module, exports, require) {

	/* WEBPACK VAR INJECTION */(function(require, process) {var filter = require(51);


	// resolves . and .. elements in a path array with directory names there
	// must be no slashes, empty elements, or device names (c:\) in the array
	// (so also no leading and trailing slashes - it does not distinguish
	// relative and absolute paths)
	function normalizeArray(parts, allowAboveRoot) {
	  // if the path tries to go above the root, `up` ends up > 0
	  var up = 0;
	  for (var i = parts.length; i >= 0; i--) {
	    var last = parts[i];
	    if (last == '.') {
	      parts.splice(i, 1);
	    } else if (last === '..') {
	      parts.splice(i, 1);
	      up++;
	    } else if (up) {
	      parts.splice(i, 1);
	      up--;
	    }
	  }

	  // if the path is allowed to go above the root, restore leading ..s
	  if (allowAboveRoot) {
	    for (; up--; up) {
	      parts.unshift('..');
	    }
	  }

	  return parts;
	}

	// Regex to split a filename into [*, dir, basename, ext]
	// posix version
	var splitPathRe =
		/^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;


	// path.resolve([from ...], to)
	// posix version
	exports.resolve = function() {
	var resolvedPath = '',
	    resolvedAbsolute = false;

	for (var i = arguments.length; i >= -1 && !resolvedAbsolute; i--) {
	  var path = (i >= 0)
	      ? arguments[i]
	      : process.cwd();

	  // Skip empty and invalid entries
	  if (typeof path !== 'string' || !path) {
	    continue;
	  }

	  resolvedPath = path + '/' + resolvedPath;
	  resolvedAbsolute = path.charAt(0) === '/';
	}

	// At this point the path should be resolved to a full absolute path, but
	// handle relative paths to be safe (might happen when process.cwd() fails)

	// Normalize the path
	resolvedPath = normalizeArray(filter(resolvedPath.split('/'), function(p) {
	    return !!p;
	  }), !resolvedAbsolute).join('/');

	  return ((resolvedAbsolute ? '/' : '') + resolvedPath) || '.';
	};

	// path.normalize(path)
	// posix version
	exports.normalize = function(path) {
	var isAbsolute = path.charAt(0) === '/',
	    trailingSlash = path.slice(-1) === '/';

	// Normalize the path
	path = normalizeArray(filter(path.split('/'), function(p) {
	    return !!p;
	  }), !isAbsolute).join('/');

	  if (!path && !isAbsolute) {
	    path = '.';
	  }
	  if (path && trailingSlash) {
	    path += '/';
	  }
	  
	  return (isAbsolute ? '/' : '') + path;
	};


	// posix version
	exports.join = function() {
	  var paths = Array.prototype.slice.call(arguments, 0);
	  return exports.normalize(filter(paths, function(p, index) {
	    return p && typeof p === 'string';
	  }).join('/'));
	};


	exports.dirname = function(path) {
	  var match = splitPathRe.exec(path);
	  var root = match[1] || '';
	  var dir = root + (match[2] || '');
	  var isWindows = false;
	  if (!dir) {
	    // No dirname
	    return '.';
	  } else if (dir.length === 1 ||
	      (isWindows && dir.length <= 3 && dir.charAt(1) === ':')) {
	    // It is just a slash or a drive letter with a slash
	    return dir;
	  } else {
	    // It is a full dirname, strip trailing slash
	    return dir.substring(0, dir.length - 1);
	  }
	};


	exports.basename = function(path, ext) {
	  var f = splitPathRe.exec(path)[3] || '';
	  if (ext && f.substr(-1 * ext.length) === ext) {
	    f = f.substr(0, f.length - ext.length);
	  }
	  return f;
	};


	exports.extname = function(path) {
	  return splitPathRe.exec(path)[4] || '';
	};

	exports.relative = function(from, to) {
	  from = exports.resolve(from).substr(1);
	  to = exports.resolve(to).substr(1);

	  function trim(arr) {
	    var start = 0;
	    for (; start < arr.length; start++) {
	      if (arr[start] !== '') break;
	    }

	    var end = arr.length - 1;
	    for (; end >= 0; end--) {
	      if (arr[end] !== '') break;
	    }

	    if (start > end) return [];
	    return arr.slice(start, end - start + 1);
	  }

	  var fromParts = trim(from.split('/'));
	  var toParts = trim(to.split('/'));

	  var length = Math.min(fromParts.length, toParts.length);
	  var samePartsLength = length;
	  for (var i = 0; i < length; i++) {
	    if (fromParts[i] !== toParts[i]) {
	      samePartsLength = i;
	      break;
	    }
	  }

	  var outputParts = [];
	  for (var i = samePartsLength; i < fromParts.length; i++) {
	    outputParts.push('..');
	  }

	  outputParts = outputParts.concat(toParts.slice(samePartsLength));

	  return outputParts.join('/');
	};

	exports.sep = '/';
	/* WEBPACK VAR INJECTION */}.call(exports, require, require(15)))

/***/ },

/***/ 17:
/***/ function(module, exports, require) {

	var events = require(20);

	var isArray = require(52);
	var Object_keys = require(53);
	var Object_getOwnPropertyNames = require(54);
	var Object_create = require(55);
	var isRegExp = require(56);

	exports.isArray = isArray;
	exports.isDate = isDate;
	exports.isRegExp = isRegExp;


	exports.print = function () {};
	exports.puts = function () {};
	exports.debug = function() {};

	exports.inspect = function(obj, showHidden, depth, colors) {
	  var seen = [];

	  var stylize = function(str, styleType) {
	    // http://en.wikipedia.org/wiki/ANSI_escape_code#graphics
	    var styles =
	        { 'bold' : [1, 22],
	          'italic' : [3, 23],
	          'underline' : [4, 24],
	          'inverse' : [7, 27],
	          'white' : [37, 39],
	          'grey' : [90, 39],
	          'black' : [30, 39],
	          'blue' : [34, 39],
	          'cyan' : [36, 39],
	          'green' : [32, 39],
	          'magenta' : [35, 39],
	          'red' : [31, 39],
	          'yellow' : [33, 39] };

	    var style =
	        { 'special': 'cyan',
	          'number': 'blue',
	          'boolean': 'yellow',
	          'undefined': 'grey',
	          'null': 'bold',
	          'string': 'green',
	          'date': 'magenta',
	          // "name": intentionally not styling
	          'regexp': 'red' }[styleType];

	    if (style) {
	      return '\033[' + styles[style][0] + 'm' + str +
	             '\033[' + styles[style][1] + 'm';
	    } else {
	      return str;
	    }
	  };
	  if (! colors) {
	    stylize = function(str, styleType) { return str; };
	  }

	  function format(value, recurseTimes) {
	    // Provide a hook for user-specified inspect functions.
	    // Check that value is an object with an inspect function on it
	    if (value && typeof value.inspect === 'function' &&
	        // Filter out the util module, it's inspect function is special
	        value !== exports &&
	        // Also filter out any prototype objects using the circular check.
	        !(value.constructor && value.constructor.prototype === value)) {
	      return value.inspect(recurseTimes);
	    }

	    // Primitive types cannot have properties
	    switch (typeof value) {
	      case 'undefined':
	        return stylize('undefined', 'undefined');

	      case 'string':
	        var simple = '\'' + JSON.stringify(value).replace(/^"|"$/g, '')
	                                                 .replace(/'/g, "\\'")
	                                                 .replace(/\\"/g, '"') + '\'';
	        return stylize(simple, 'string');

	      case 'number':
	        return stylize('' + value, 'number');

	      case 'boolean':
	        return stylize('' + value, 'boolean');
	    }
	    // For some reason typeof null is "object", so special case here.
	    if (value === null) {
	      return stylize('null', 'null');
	    }

	    // Look up the keys of the object.
	    var visible_keys = Object_keys(value);
	    var keys = showHidden ? Object_getOwnPropertyNames(value) : visible_keys;

	    // Functions without properties can be shortcutted.
	    if (typeof value === 'function' && keys.length === 0) {
	      if (isRegExp(value)) {
	        return stylize('' + value, 'regexp');
	      } else {
	        var name = value.name ? ': ' + value.name : '';
	        return stylize('[Function' + name + ']', 'special');
	      }
	    }

	    // Dates without properties can be shortcutted
	    if (isDate(value) && keys.length === 0) {
	      return stylize(value.toUTCString(), 'date');
	    }

	    var base, type, braces;
	    // Determine the object type
	    if (isArray(value)) {
	      type = 'Array';
	      braces = ['[', ']'];
	    } else {
	      type = 'Object';
	      braces = ['{', '}'];
	    }

	    // Make functions say that they are functions
	    if (typeof value === 'function') {
	      var n = value.name ? ': ' + value.name : '';
	      base = (isRegExp(value)) ? ' ' + value : ' [Function' + n + ']';
	    } else {
	      base = '';
	    }

	    // Make dates with properties first say the date
	    if (isDate(value)) {
	      base = ' ' + value.toUTCString();
	    }

	    if (keys.length === 0) {
	      return braces[0] + base + braces[1];
	    }

	    if (recurseTimes < 0) {
	      if (isRegExp(value)) {
	        return stylize('' + value, 'regexp');
	      } else {
	        return stylize('[Object]', 'special');
	      }
	    }

	    seen.push(value);

	    var output = keys.map(function(key) {
	      var name, str;
	      if (value.__lookupGetter__) {
	        if (value.__lookupGetter__(key)) {
	          if (value.__lookupSetter__(key)) {
	            str = stylize('[Getter/Setter]', 'special');
	          } else {
	            str = stylize('[Getter]', 'special');
	          }
	        } else {
	          if (value.__lookupSetter__(key)) {
	            str = stylize('[Setter]', 'special');
	          }
	        }
	      }
	      if (visible_keys.indexOf(key) < 0) {
	        name = '[' + key + ']';
	      }
	      if (!str) {
	        if (seen.indexOf(value[key]) < 0) {
	          if (recurseTimes === null) {
	            str = format(value[key]);
	          } else {
	            str = format(value[key], recurseTimes - 1);
	          }
	          if (str.indexOf('\n') > -1) {
	            if (isArray(value)) {
	              str = str.split('\n').map(function(line) {
	                return '  ' + line;
	              }).join('\n').substr(2);
	            } else {
	              str = '\n' + str.split('\n').map(function(line) {
	                return '   ' + line;
	              }).join('\n');
	            }
	          }
	        } else {
	          str = stylize('[Circular]', 'special');
	        }
	      }
	      if (typeof name === 'undefined') {
	        if (type === 'Array' && key.match(/^\d+$/)) {
	          return str;
	        }
	        name = JSON.stringify('' + key);
	        if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
	          name = name.substr(1, name.length - 2);
	          name = stylize(name, 'name');
	        } else {
	          name = name.replace(/'/g, "\\'")
	                     .replace(/\\"/g, '"')
	                     .replace(/(^"|"$)/g, "'");
	          name = stylize(name, 'string');
	        }
	      }

	      return name + ': ' + str;
	    });

	    seen.pop();

	    var numLinesEst = 0;
	    var length = output.reduce(function(prev, cur) {
	      numLinesEst++;
	      if (cur.indexOf('\n') >= 0) numLinesEst++;
	      return prev + cur.length + 1;
	    }, 0);

	    if (length > 50) {
	      output = braces[0] +
	               (base === '' ? '' : base + '\n ') +
	               ' ' +
	               output.join(',\n  ') +
	               ' ' +
	               braces[1];

	    } else {
	      output = braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
	    }

	    return output;
	  }
	  return format(obj, (typeof depth === 'undefined' ? 2 : depth));
	};


	function isDate(d) {
	  if (d instanceof Date) return true;
	  if (typeof d !== 'object') return false;
	  var properties = Date.prototype && Object_getOwnPropertyNames(Date.prototype);
	  var proto = d.__proto__ && Object_getOwnPropertyNames(d.__proto__);
	  return JSON.stringify(proto) === JSON.stringify(properties);
	}

	function pad(n) {
	  return n < 10 ? '0' + n.toString(10) : n.toString(10);
	}

	var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
	              'Oct', 'Nov', 'Dec'];

	// 26 Feb 16:19:34
	function timestamp() {
	  var d = new Date();
	  var time = [pad(d.getHours()),
	              pad(d.getMinutes()),
	              pad(d.getSeconds())].join(':');
	  return [d.getDate(), months[d.getMonth()], time].join(' ');
	}

	exports.log = function (msg) {};

	exports.pump = null;

	exports.inherits = function(ctor, superCtor) {
	  ctor.super_ = superCtor;
	  ctor.prototype = Object_create(superCtor.prototype, {
	    constructor: {
	      value: ctor,
	      enumerable: false,
	      writable: true,
	      configurable: true
	    }
	  });
	};

	var formatRegExp = /%[sdj%]/g;
	exports.format = function(f) {
	  if (typeof f !== 'string') {
	    var objects = [];
	    for (var i = 0; i < arguments.length; i++) {
	      objects.push(exports.inspect(arguments[i]));
	    }
	    return objects.join(' ');
	  }

	  var i = 1;
	  var args = arguments;
	  var len = args.length;
	  var str = String(f).replace(formatRegExp, function(x) {
	    if (x === '%%') return '%';
	    if (i >= len) return x;
	    switch (x) {
	      case '%s': return String(args[i++]);
	      case '%d': return Number(args[i++]);
	      case '%j': return JSON.stringify(args[i++]);
	      default:
	        return x;
	    }
	  });
	  for(var x = args[i]; i < len; x = args[++i]){
	    if (x === null || typeof x !== 'object') {
	      str += ' ' + x;
	    } else {
	      str += ' ' + exports.inspect(x);
	    }
	  }
	  return str;
	};


/***/ },

/***/ 18:
/***/ function(module, exports, require) {

	var punycode = require(59);
	var arrayIndexOf = require(57);
	var objectKeys = require(53);




	exports.parse = urlParse;
	exports.resolve = urlResolve;
	exports.resolveObject = urlResolveObject;
	exports.format = urlFormat;

	// Reference: RFC 3986, RFC 1808, RFC 2396

	// define these here so at least they only have to be
	// compiled once on the first module load.
	var protocolPattern = /^([a-z0-9.+-]+:)/i,
	    portPattern = /:[0-9]+$/,
	    // RFC 2396: characters reserved for delimiting URLs.
	    delims = ['<', '>', '"', '`', ' ', '\r', '\n', '\t'],
	    // RFC 2396: characters not allowed for various reasons.
	    unwise = ['{', '}', '|', '\\', '^', '~', '[', ']', '`'].concat(delims),
	    // Allowed by RFCs, but cause of XSS attacks.  Always escape these.
	    autoEscape = ['\''],
	    // Characters that are never ever allowed in a hostname.
	    // Note that any invalid chars are also handled, but these
	    // are the ones that are *expected* to be seen, so we fast-path
	    // them.
	    nonHostChars = ['%', '/', '?', ';', '#']
	      .concat(unwise).concat(autoEscape),
	    nonAuthChars = ['/', '@', '?', '#'].concat(delims),
	    hostnameMaxLen = 255,
	    hostnamePartPattern = /^[a-zA-Z0-9][a-z0-9A-Z_-]{0,62}$/,
	    hostnamePartStart = /^([a-zA-Z0-9][a-z0-9A-Z_-]{0,62})(.*)$/,
	    // protocols that can allow "unsafe" and "unwise" chars.
	    unsafeProtocol = {
	      'javascript': true,
	      'javascript:': true
	    },
	    // protocols that never have a hostname.
	    hostlessProtocol = {
	      'javascript': true,
	      'javascript:': true
	    },
	    // protocols that always have a path component.
	    pathedProtocol = {
	      'http': true,
	      'https': true,
	      'ftp': true,
	      'gopher': true,
	      'file': true,
	      'http:': true,
	      'ftp:': true,
	      'gopher:': true,
	      'file:': true
	    },
	    // protocols that always contain a // bit.
	    slashedProtocol = {
	      'http': true,
	      'https': true,
	      'ftp': true,
	      'gopher': true,
	      'file': true,
	      'http:': true,
	      'https:': true,
	      'ftp:': true,
	      'gopher:': true,
	      'file:': true
	    },
	    querystring = require(60);

	function urlParse(url, parseQueryString, slashesDenoteHost) {
	  if (url && typeof(url) === 'object' && url.href) return url;

	  if (typeof url !== 'string') {
	    throw new TypeError("Parameter 'url' must be a string, not " + typeof url);
	  }

	  var out = {},
	      rest = url;

	  // cut off any delimiters.
	  // This is to support parse stuff like "<http://foo.com>"
	  for (var i = 0, l = rest.length; i < l; i++) {
	    if (arrayIndexOf(delims, rest.charAt(i)) === -1) break;
	  }
	  if (i !== 0) rest = rest.substr(i);


	  var proto = protocolPattern.exec(rest);
	  if (proto) {
	    proto = proto[0];
	    var lowerProto = proto.toLowerCase();
	    out.protocol = lowerProto;
	    rest = rest.substr(proto.length);
	  }

	  // figure out if it's got a host
	  // user@server is *always* interpreted as a hostname, and url
	  // resolution will treat //foo/bar as host=foo,path=bar because that's
	  // how the browser resolves relative URLs.
	  if (slashesDenoteHost || proto || rest.match(/^\/\/[^@\/]+@[^@\/]+/)) {
	    var slashes = rest.substr(0, 2) === '//';
	    if (slashes && !(proto && hostlessProtocol[proto])) {
	      rest = rest.substr(2);
	      out.slashes = true;
	    }
	  }

	  if (!hostlessProtocol[proto] &&
	      (slashes || (proto && !slashedProtocol[proto]))) {
	    // there's a hostname.
	    // the first instance of /, ?, ;, or # ends the host.
	    // don't enforce full RFC correctness, just be unstupid about it.

	    // If there is an @ in the hostname, then non-host chars *are* allowed
	    // to the left of the first @ sign, unless some non-auth character
	    // comes *before* the @-sign.
	    // URLs are obnoxious.
	    var atSign = arrayIndexOf(rest, '@');
	    if (atSign !== -1) {
	      // there *may be* an auth
	      var hasAuth = true;
	      for (var i = 0, l = nonAuthChars.length; i < l; i++) {
	        var index = arrayIndexOf(rest, nonAuthChars[i]);
	        if (index !== -1 && index < atSign) {
	          // not a valid auth.  Something like http://foo.com/bar@baz/
	          hasAuth = false;
	          break;
	        }
	      }
	      if (hasAuth) {
	        // pluck off the auth portion.
	        out.auth = rest.substr(0, atSign);
	        rest = rest.substr(atSign + 1);
	      }
	    }

	    var firstNonHost = -1;
	    for (var i = 0, l = nonHostChars.length; i < l; i++) {
	      var index = arrayIndexOf(rest, nonHostChars[i]);
	      if (index !== -1 &&
	          (firstNonHost < 0 || index < firstNonHost)) firstNonHost = index;
	    }

	    if (firstNonHost !== -1) {
	      out.host = rest.substr(0, firstNonHost);
	      rest = rest.substr(firstNonHost);
	    } else {
	      out.host = rest;
	      rest = '';
	    }

	    // pull out port.
	    var p = parseHost(out.host);
	    var keys = objectKeys(p);
	    for (var i = 0, l = keys.length; i < l; i++) {
	      var key = keys[i];
	      out[key] = p[key];
	    }

	    // we've indicated that there is a hostname,
	    // so even if it's empty, it has to be present.
	    out.hostname = out.hostname || '';

	    // validate a little.
	    if (out.hostname.length > hostnameMaxLen) {
	      out.hostname = '';
	    } else {
	      var hostparts = out.hostname.split(/\./);
	      for (var i = 0, l = hostparts.length; i < l; i++) {
	        var part = hostparts[i];
	        if (!part) continue;
	        if (!part.match(hostnamePartPattern)) {
	          var newpart = '';
	          for (var j = 0, k = part.length; j < k; j++) {
	            if (part.charCodeAt(j) > 127) {
	              // we replace non-ASCII char with a temporary placeholder
	              // we need this to make sure size of hostname is not
	              // broken by replacing non-ASCII by nothing
	              newpart += 'x';
	            } else {
	              newpart += part[j];
	            }
	          }
	          // we test again with ASCII char only
	          if (!newpart.match(hostnamePartPattern)) {
	            var validParts = hostparts.slice(0, i);
	            var notHost = hostparts.slice(i + 1);
	            var bit = part.match(hostnamePartStart);
	            if (bit) {
	              validParts.push(bit[1]);
	              notHost.unshift(bit[2]);
	            }
	            if (notHost.length) {
	              rest = '/' + notHost.join('.') + rest;
	            }
	            out.hostname = validParts.join('.');
	            break;
	          }
	        }
	      }
	    }

	    // hostnames are always lower case.
	    out.hostname = out.hostname.toLowerCase();

	    // IDNA Support: Returns a puny coded representation of "domain".
	    // It only converts the part of the domain name that
	    // has non ASCII characters. I.e. it dosent matter if
	    // you call it with a domain that already is in ASCII.
	    var domainArray = out.hostname.split('.');
	    var newOut = [];
	    for (var i = 0; i < domainArray.length; ++i) {
	      var s = domainArray[i];
	      newOut.push(s.match(/[^A-Za-z0-9_-]/) ?
	          'xn--' + punycode.encode(s) : s);
	    }
	    out.hostname = newOut.join('.');

	    out.host = (out.hostname || '') +
	        ((out.port) ? ':' + out.port : '');
	    out.href += out.host;
	  }

	  // now rest is set to the post-host stuff.
	  // chop off any delim chars.
	  if (!unsafeProtocol[lowerProto]) {

	    // First, make 100% sure that any "autoEscape" chars get
	    // escaped, even if encodeURIComponent doesn't think they
	    // need to be.
	    for (var i = 0, l = autoEscape.length; i < l; i++) {
	      var ae = autoEscape[i];
	      var esc = encodeURIComponent(ae);
	      if (esc === ae) {
	        esc = escape(ae);
	      }
	      rest = rest.split(ae).join(esc);
	    }

	    // Now make sure that delims never appear in a url.
	    var chop = rest.length;
	    for (var i = 0, l = delims.length; i < l; i++) {
	      var c = arrayIndexOf(rest, delims[i]);
	      if (c !== -1) {
	        chop = Math.min(c, chop);
	      }
	    }
	    rest = rest.substr(0, chop);
	  }


	  // chop off from the tail first.
	  var hash = arrayIndexOf(rest, '#');
	  if (hash !== -1) {
	    // got a fragment string.
	    out.hash = rest.substr(hash);
	    rest = rest.slice(0, hash);
	  }
	  var qm = arrayIndexOf(rest, '?');
	  if (qm !== -1) {
	    out.search = rest.substr(qm);
	    out.query = rest.substr(qm + 1);
	    if (parseQueryString) {
	      out.query = querystring.parse(out.query);
	    }
	    rest = rest.slice(0, qm);
	  } else if (parseQueryString) {
	    // no query string, but parseQueryString still requested
	    out.search = '';
	    out.query = {};
	  }
	  if (rest) out.pathname = rest;
	  if (slashedProtocol[proto] &&
	      out.hostname && !out.pathname) {
	    out.pathname = '/';
	  }

	  //to support http.request
	  if (out.pathname || out.search) {
	    out.path = (out.pathname ? out.pathname : '') +
	               (out.search ? out.search : '');
	  }

	  // finally, reconstruct the href based on what has been validated.
	  out.href = urlFormat(out);
	  return out;
	}

	// format a parsed object into a url string
	function urlFormat(obj) {
	  // ensure it's an object, and not a string url.
	  // If it's an obj, this is a no-op.
	  // this way, you can call url_format() on strings
	  // to clean up potentially wonky urls.
	  if (typeof(obj) === 'string') obj = urlParse(obj);

	  var auth = obj.auth || '';
	  if (auth) {
	    auth = auth.split('@').join('%40');
	    for (var i = 0, l = nonAuthChars.length; i < l; i++) {
	      var nAC = nonAuthChars[i];
	      auth = auth.split(nAC).join(encodeURIComponent(nAC));
	    }
	    auth += '@';
	  }

	  var protocol = obj.protocol || '',
	      host = (obj.host !== undefined) ? auth + obj.host :
	          obj.hostname !== undefined ? (
	              auth + obj.hostname +
	              (obj.port ? ':' + obj.port : '')
	          ) :
	          false,
	      pathname = obj.pathname || '',
	      query = obj.query &&
	              ((typeof obj.query === 'object' &&
	                objectKeys(obj.query).length) ?
	                 querystring.stringify(obj.query) :
	                 '') || '',
	      search = obj.search || (query && ('?' + query)) || '',
	      hash = obj.hash || '';


	  if (protocol && protocol.substr(-1) !== ':') protocol += ':';

	  // only the slashedProtocols get the //.  Not mailto:, xmpp:, etc.
	  // unless they had them to begin with.
	  if (obj.slashes ||
	      (!protocol || slashedProtocol[protocol]) && host !== false) {
	    host = '//' + (host || '');
	    if (pathname && pathname.charAt(0) !== '/') pathname = '/' + pathname;
	  } else if (!host) {
	    host = '';
	  }

	  if (hash && hash.charAt(0) !== '#') hash = '#' + hash;
	  if (search && search.charAt(0) !== '?') search = '?' + search;

	  return protocol + host + pathname + search + hash;
	}

	function urlResolve(source, relative) {
	  return urlFormat(urlResolveObject(source, relative));
	}

	function urlResolveObject(source, relative) {
	  if (!source) return relative;

	  source = urlParse(urlFormat(source), false, true);
	  relative = urlParse(urlFormat(relative), false, true);

	  // hash is always overridden, no matter what.
	  source.hash = relative.hash;

	  if (relative.href === '') {
	    source.href = urlFormat(source);
	    return source;
	  }

	  // hrefs like //foo/bar always cut to the protocol.
	  if (relative.slashes && !relative.protocol) {
	    relative.protocol = source.protocol;
	    //urlParse appends trailing / to urls like http://www.example.com
	    if (slashedProtocol[relative.protocol] &&
	        relative.hostname && !relative.pathname) {
	      relative.path = relative.pathname = '/';
	    }
	    relative.href = urlFormat(relative);
	    return relative;
	  }

	  if (relative.protocol && relative.protocol !== source.protocol) {
	    // if it's a known url protocol, then changing
	    // the protocol does weird things
	    // first, if it's not file:, then we MUST have a host,
	    // and if there was a path
	    // to begin with, then we MUST have a path.
	    // if it is file:, then the host is dropped,
	    // because that's known to be hostless.
	    // anything else is assumed to be absolute.
	    if (!slashedProtocol[relative.protocol]) {
	      relative.href = urlFormat(relative);
	      return relative;
	    }
	    source.protocol = relative.protocol;
	    if (!relative.host && !hostlessProtocol[relative.protocol]) {
	      var relPath = (relative.pathname || '').split('/');
	      while (relPath.length && !(relative.host = relPath.shift()));
	      if (!relative.host) relative.host = '';
	      if (!relative.hostname) relative.hostname = '';
	      if (relPath[0] !== '') relPath.unshift('');
	      if (relPath.length < 2) relPath.unshift('');
	      relative.pathname = relPath.join('/');
	    }
	    source.pathname = relative.pathname;
	    source.search = relative.search;
	    source.query = relative.query;
	    source.host = relative.host || '';
	    source.auth = relative.auth;
	    source.hostname = relative.hostname || relative.host;
	    source.port = relative.port;
	    //to support http.request
	    if (source.pathname !== undefined || source.search !== undefined) {
	      source.path = (source.pathname ? source.pathname : '') +
	                    (source.search ? source.search : '');
	    }
	    source.slashes = source.slashes || relative.slashes;
	    source.href = urlFormat(source);
	    return source;
	  }

	  var isSourceAbs = (source.pathname && source.pathname.charAt(0) === '/'),
	      isRelAbs = (
	          relative.host !== undefined ||
	          relative.pathname && relative.pathname.charAt(0) === '/'
	      ),
	      mustEndAbs = (isRelAbs || isSourceAbs ||
	                    (source.host && relative.pathname)),
	      removeAllDots = mustEndAbs,
	      srcPath = source.pathname && source.pathname.split('/') || [],
	      relPath = relative.pathname && relative.pathname.split('/') || [],
	      psychotic = source.protocol &&
	          !slashedProtocol[source.protocol];

	  // if the url is a non-slashed url, then relative
	  // links like ../.. should be able
	  // to crawl up to the hostname, as well.  This is strange.
	  // source.protocol has already been set by now.
	  // Later on, put the first path part into the host field.
	  if (psychotic) {

	    delete source.hostname;
	    delete source.port;
	    if (source.host) {
	      if (srcPath[0] === '') srcPath[0] = source.host;
	      else srcPath.unshift(source.host);
	    }
	    delete source.host;
	    if (relative.protocol) {
	      delete relative.hostname;
	      delete relative.port;
	      if (relative.host) {
	        if (relPath[0] === '') relPath[0] = relative.host;
	        else relPath.unshift(relative.host);
	      }
	      delete relative.host;
	    }
	    mustEndAbs = mustEndAbs && (relPath[0] === '' || srcPath[0] === '');
	  }

	  if (isRelAbs) {
	    // it's absolute.
	    source.host = (relative.host || relative.host === '') ?
	                      relative.host : source.host;
	    source.hostname = (relative.hostname || relative.hostname === '') ?
	                      relative.hostname : source.hostname;
	    source.search = relative.search;
	    source.query = relative.query;
	    srcPath = relPath;
	    // fall through to the dot-handling below.
	  } else if (relPath.length) {
	    // it's relative
	    // throw away the existing file, and take the new path instead.
	    if (!srcPath) srcPath = [];
	    srcPath.pop();
	    srcPath = srcPath.concat(relPath);
	    source.search = relative.search;
	    source.query = relative.query;
	  } else if ('search' in relative) {
	    // just pull out the search.
	    // like href='?foo'.
	    // Put this after the other two cases because it simplifies the booleans
	    if (psychotic) {
	      source.hostname = source.host = srcPath.shift();
	      //occationaly the auth can get stuck only in host
	      //this especialy happens in cases like
	      //url.resolveObject('mailto:local1@domain1', 'local2@domain2')
	      var authInHost = source.host && arrayIndexOf(source.host, '@') > 0 ?
	                       source.host.split('@') : false;
	      if (authInHost) {
	        source.auth = authInHost.shift();
	        source.host = source.hostname = authInHost.shift();
	      }
	    }
	    source.search = relative.search;
	    source.query = relative.query;
	    //to support http.request
	    if (source.pathname !== undefined || source.search !== undefined) {
	      source.path = (source.pathname ? source.pathname : '') +
	                    (source.search ? source.search : '');
	    }
	    source.href = urlFormat(source);
	    return source;
	  }
	  if (!srcPath.length) {
	    // no path at all.  easy.
	    // we've already handled the other stuff above.
	    delete source.pathname;
	    //to support http.request
	    if (!source.search) {
	      source.path = '/' + source.search;
	    } else {
	      delete source.path;
	    }
	    source.href = urlFormat(source);
	    return source;
	  }
	  // if a url ENDs in . or .., then it must get a trailing slash.
	  // however, if it ends in anything else non-slashy,
	  // then it must NOT get a trailing slash.
	  var last = srcPath.slice(-1)[0];
	  var hasTrailingSlash = (
	      (source.host || relative.host) && (last === '.' || last === '..') ||
	      last === '');

	  // strip single dots, resolve double dots to parent dir
	  // if the path tries to go above the root, `up` ends up > 0
	  var up = 0;
	  for (var i = srcPath.length; i >= 0; i--) {
	    last = srcPath[i];
	    if (last == '.') {
	      srcPath.splice(i, 1);
	    } else if (last === '..') {
	      srcPath.splice(i, 1);
	      up++;
	    } else if (up) {
	      srcPath.splice(i, 1);
	      up--;
	    }
	  }

	  // if the path is allowed to go above the root, restore leading ..s
	  if (!mustEndAbs && !removeAllDots) {
	    for (; up--; up) {
	      srcPath.unshift('..');
	    }
	  }

	  if (mustEndAbs && srcPath[0] !== '' &&
	      (!srcPath[0] || srcPath[0].charAt(0) !== '/')) {
	    srcPath.unshift('');
	  }

	  if (hasTrailingSlash && (srcPath.join('/').substr(-1) !== '/')) {
	    srcPath.push('');
	  }

	  var isAbsolute = srcPath[0] === '' ||
	      (srcPath[0] && srcPath[0].charAt(0) === '/');

	  // put the host back
	  if (psychotic) {
	    source.hostname = source.host = isAbsolute ? '' :
	                                    srcPath.length ? srcPath.shift() : '';
	    //occationaly the auth can get stuck only in host
	    //this especialy happens in cases like
	    //url.resolveObject('mailto:local1@domain1', 'local2@domain2')
	    var authInHost = source.host && arrayIndexOf(source.host, '@') > 0 ?
	                     source.host.split('@') : false;
	    if (authInHost) {
	      source.auth = authInHost.shift();
	      source.host = source.hostname = authInHost.shift();
	    }
	  }

	  mustEndAbs = mustEndAbs || (source.host && srcPath.length);

	  if (mustEndAbs && !isAbsolute) {
	    srcPath.unshift('');
	  }

	  source.pathname = srcPath.join('/');
	  //to support request.http
	  if (source.pathname !== undefined || source.search !== undefined) {
	    source.path = (source.pathname ? source.pathname : '') +
	                  (source.search ? source.search : '');
	  }
	  source.auth = relative.auth || source.auth;
	  source.slashes = source.slashes || relative.slashes;
	  source.href = urlFormat(source);
	  return source;
	}

	function parseHost(host) {
	  var out = {};
	  var port = portPattern.exec(host);
	  if (port) {
	    port = port[0];
	    out.port = port.substr(1);
	    host = host.substr(0, host.length - port.length);
	  }
	  if (host) out.hostname = host;
	  return out;
	}


/***/ },

/***/ 19:
/***/ function(module, exports, require) {

	// nothing to see here... no file methods for the browser


/***/ },

/***/ 20:
/***/ function(module, exports, require) {

	var EventEmitter = exports.EventEmitter = function EventEmitter() {};
	var isArray = require(52);
	var indexOf = require(57);



	// By default EventEmitters will print a warning if more than
	// 10 listeners are added to it. This is a useful default which
	// helps finding memory leaks.
	//
	// Obviously not all Emitters should be limited to 10. This function allows
	// that to be increased. Set to zero for unlimited.
	var defaultMaxListeners = 10;
	EventEmitter.prototype.setMaxListeners = function(n) {
	  if (!this._events) this._events = {};
	  this._maxListeners = n;
	};


	EventEmitter.prototype.emit = function(type) {
	  // If there is no 'error' event listener then throw.
	  if (type === 'error') {
	    if (!this._events || !this._events.error ||
	        (isArray(this._events.error) && !this._events.error.length))
	    {
	      if (arguments[1] instanceof Error) {
	        throw arguments[1]; // Unhandled 'error' event
	      } else {
	        throw new Error("Uncaught, unspecified 'error' event.");
	      }
	      return false;
	    }
	  }

	  if (!this._events) return false;
	  var handler = this._events[type];
	  if (!handler) return false;

	  if (typeof handler == 'function') {
	    switch (arguments.length) {
	      // fast cases
	      case 1:
	        handler.call(this);
	        break;
	      case 2:
	        handler.call(this, arguments[1]);
	        break;
	      case 3:
	        handler.call(this, arguments[1], arguments[2]);
	        break;
	      // slower
	      default:
	        var args = Array.prototype.slice.call(arguments, 1);
	        handler.apply(this, args);
	    }
	    return true;

	  } else if (isArray(handler)) {
	    var args = Array.prototype.slice.call(arguments, 1);

	    var listeners = handler.slice();
	    for (var i = 0, l = listeners.length; i < l; i++) {
	      listeners[i].apply(this, args);
	    }
	    return true;

	  } else {
	    return false;
	  }
	};

	// EventEmitter is defined in src/node_events.cc
	// EventEmitter.prototype.emit() is also defined there.
	EventEmitter.prototype.addListener = function(type, listener) {
	  if ('function' !== typeof listener) {
	    throw new Error('addListener only takes instances of Function');
	  }

	  if (!this._events) this._events = {};

	  // To avoid recursion in the case that type == "newListeners"! Before
	  // adding it to the listeners, first emit "newListeners".
	  this.emit('newListener', type, listener);
	  if (!this._events[type]) {
	    // Optimize the case of one listener. Don't need the extra array object.
	    this._events[type] = listener;
	  } else if (isArray(this._events[type])) {

	    // If we've already got an array, just append.
	    this._events[type].push(listener);

	  } else {
	    // Adding the second element, need to change to array.
	    this._events[type] = [this._events[type], listener];
	  }

	  // Check for listener leak
	  if (isArray(this._events[type]) && !this._events[type].warned) {
	    var m;
	    if (this._maxListeners !== undefined) {
	      m = this._maxListeners;
	    } else {
	      m = defaultMaxListeners;
	    }

	    if (m && m > 0 && this._events[type].length > m) {
	      this._events[type].warned = true;
	      console.error('(events) warning: possible EventEmitter memory ' +
	                    'leak detected. %d listeners added. ' +
	                    'Use emitter.setMaxListeners() to increase limit.',
	                    this._events[type].length);
	      console.trace();
	    }
	  }
	  return this;
	};

	EventEmitter.prototype.on = EventEmitter.prototype.addListener;

	EventEmitter.prototype.once = function(type, listener) {
	  if ('function' !== typeof listener) {
	    throw new Error('.once only takes instances of Function');
	  }

	  var self = this;
	  function g() {
	    self.removeListener(type, g);
	    listener.apply(this, arguments);
	  }

	  g.listener = listener;
	  self.on(type, g);

	  return this;
	};

	EventEmitter.prototype.removeListener = function(type, listener) {
	  if ('function' !== typeof listener) {
	    throw new Error('removeListener only takes instances of Function');
	  }

	  // does not use listeners(), so no side effect of creating _events[type]
	  if (!this._events || !this._events[type]) return this;

	  var list = this._events[type];

	  if (isArray(list)) {
	    var position = -1;
	    for (var i = 0, length = list.length; i < length; i++) {
	      if (list[i] === listener ||
	          (list[i].listener && list[i].listener === listener))
	      {
	        position = i;
	        break;
	      }
	    }

	    if (position < 0) return this;
	    list.splice(position, 1);
	    if (list.length == 0)
	      delete this._events[type];
	  } else if (list === listener ||
	             (list.listener && list.listener === listener)) {
	    delete this._events[type];
	  }

	  return this;
	};

	EventEmitter.prototype.removeAllListeners = function(type) {
	  if (arguments.length === 0) {
	    this._events = {};
	    return this;
	  }

	  // does not use listeners(), so no side effect of creating _events[type]
	  if (type && this._events && this._events[type]) this._events[type] = null;
	  return this;
	};

	EventEmitter.prototype.listeners = function(type) {
	  if (!this._events) this._events = {};
	  if (!this._events[type]) this._events[type] = [];
	  if (!isArray(this._events[type])) {
	    this._events[type] = [this._events[type]];
	  }
	  return this._events[type];
	};


/***/ },

/***/ 21:
/***/ function(module, exports, require) {

	(function (tree) {

	tree.Alpha = function (val) {
	    this.value = val;
	};
	tree.Alpha.prototype = {
	    type: "Alpha",
	    accept: function (visitor) {
	        this.value = visitor.visit(this.value);
	    },
	    eval: function (env) {
	        if (this.value.eval) { return new tree.Alpha(this.value.eval(env)); }
	        return this;
	    },
	    genCSS: function (env, output) {
	        output.add("alpha(opacity=");

	        if (this.value.genCSS) {
	            this.value.genCSS(env, output);
	        } else {
	            output.add(this.value);
	        }

	        output.add(")");
	    },
	    toCSS: tree.toCSS
	};

	})(require(4));


/***/ },

/***/ 22:
/***/ function(module, exports, require) {

	(function (tree) {

	tree.Anonymous = function (string) {
	    this.value = string.value || string;
	};
	tree.Anonymous.prototype = {
	    type: "Anonymous",
	    eval: function () { return this; },
	    compare: function (x) {
	        if (!x.toCSS) {
	            return -1;
	        }
	        
	        var left = this.toCSS(),
	            right = x.toCSS();
	        
	        if (left === right) {
	            return 0;
	        }
	        
	        return left < right ? -1 : 1;
	    },
	    genCSS: function (env, output) {
	        output.add(this.value);
	    },
	    toCSS: tree.toCSS
	};

	})(require(4));


/***/ },

/***/ 23:
/***/ function(module, exports, require) {

	(function (tree) {

	tree.Assignment = function (key, val) {
	    this.key = key;
	    this.value = val;
	};
	tree.Assignment.prototype = {
	    type: "Assignment",
	    accept: function (visitor) {
	        this.value = visitor.visit(this.value);
	    },
	    eval: function (env) {
	        if (this.value.eval) {
	            return new(tree.Assignment)(this.key, this.value.eval(env));
	        }
	        return this;
	    },
	    genCSS: function (env, output) {
	        output.add(this.key + '=');
	        if (this.value.genCSS) {
	            this.value.genCSS(env, output);
	        } else {
	            output.add(this.value);
	        }
	    },
	    toCSS: tree.toCSS
	};

	})(require(4));


/***/ },

/***/ 24:
/***/ function(module, exports, require) {

	(function (tree) {

	//
	// A function call node.
	//
	tree.Call = function (name, args, index, currentFileInfo) {
	    this.name = name;
	    this.args = args;
	    this.index = index;
	    this.currentFileInfo = currentFileInfo;
	};
	tree.Call.prototype = {
	    type: "Call",
	    accept: function (visitor) {
	        this.args = visitor.visit(this.args);
	    },
	    //
	    // When evaluating a function call,
	    // we either find the function in `tree.functions` [1],
	    // in which case we call it, passing the  evaluated arguments,
	    // if this returns null or we cannot find the function, we 
	    // simply print it out as it appeared originally [2].
	    //
	    // The *functions.js* file contains the built-in functions.
	    //
	    // The reason why we evaluate the arguments, is in the case where
	    // we try to pass a variable to a function, like: `saturate(@color)`.
	    // The function should receive the value, not the variable.
	    //
	    eval: function (env) {
	        var args = this.args.map(function (a) { return a.eval(env); }),
	            nameLC = this.name.toLowerCase(),
	            result, func;

	        if (nameLC in tree.functions) { // 1.
	            try {
	                func = new tree.functionCall(env, this.currentFileInfo);
	                result = func[nameLC].apply(func, args);
	                /*jshint eqnull:true */
	                if (result != null) {
	                    return result;
	                }
	            } catch (e) {
	                throw { type: e.type || "Runtime",
	                        message: "error evaluating function `" + this.name + "`" +
	                                 (e.message ? ': ' + e.message : ''),
	                        index: this.index, filename: this.currentFileInfo.filename };
	            }
	        }

	        return new tree.Call(this.name, args, this.index, this.currentFileInfo);
	    },

	    genCSS: function (env, output) {
	        output.add(this.name + "(", this.currentFileInfo, this.index);

	        for(var i = 0; i < this.args.length; i++) {
	            this.args[i].genCSS(env, output);
	            if (i + 1 < this.args.length) {
	                output.add(", ");
	            }
	        }

	        output.add(")");
	    },

	    toCSS: tree.toCSS
	};

	})(require(4));


/***/ },

/***/ 25:
/***/ function(module, exports, require) {

	(function (tree) {
	//
	// RGB Colors - #ff0014, #eee
	//
	tree.Color = function (rgb, a) {
	    //
	    // The end goal here, is to parse the arguments
	    // into an integer triplet, such as `128, 255, 0`
	    //
	    // This facilitates operations and conversions.
	    //
	    if (Array.isArray(rgb)) {
	        this.rgb = rgb;
	    } else if (rgb.length == 6) {
	        this.rgb = rgb.match(/.{2}/g).map(function (c) {
	            return parseInt(c, 16);
	        });
	    } else {
	        this.rgb = rgb.split('').map(function (c) {
	            return parseInt(c + c, 16);
	        });
	    }
	    this.alpha = typeof(a) === 'number' ? a : 1;
	};
	tree.Color.prototype = {
	    type: "Color",
	    eval: function () { return this; },
	    luma: function () { return (0.2126 * this.rgb[0] / 255) + (0.7152 * this.rgb[1] / 255) + (0.0722 * this.rgb[2] / 255); },

	    genCSS: function (env, output) {
	        output.add(this.toCSS(env));
	    },
	    toCSS: function (env, doNotCompress) {
	        var compress = env && env.compress && !doNotCompress;

	        // If we have some transparency, the only way to represent it
	        // is via `rgba`. Otherwise, we use the hex representation,
	        // which has better compatibility with older browsers.
	        // Values are capped between `0` and `255`, rounded and zero-padded.
	        if (this.alpha < 1.0) {
	            return "rgba(" + this.rgb.map(function (c) {
	                return Math.round(c);
	            }).concat(this.alpha).join(',' + (compress ? '' : ' ')) + ")";
	        } else {
	            var color = this.toRGB();

	            if (compress) {
	                var splitcolor = color.split('');

	                // Convert color to short format
	                if (splitcolor[1] === splitcolor[2] && splitcolor[3] === splitcolor[4] && splitcolor[5] === splitcolor[6]) {
	                    color = '#' + splitcolor[1] + splitcolor[3] + splitcolor[5];
	                }
	            }

	            return color;
	        }
	    },

	    //
	    // Operations have to be done per-channel, if not,
	    // channels will spill onto each other. Once we have
	    // our result, in the form of an integer triplet,
	    // we create a new Color node to hold the result.
	    //
	    operate: function (env, op, other) {
	        var result = [];

	        if (! (other instanceof tree.Color)) {
	            other = other.toColor();
	        }

	        for (var c = 0; c < 3; c++) {
	            result[c] = tree.operate(env, op, this.rgb[c], other.rgb[c]);
	        }
	        return new(tree.Color)(result, this.alpha + other.alpha);
	    },

	    toRGB: function () {
	        return '#' + this.rgb.map(function (i) {
	            i = Math.round(i);
	            i = (i > 255 ? 255 : (i < 0 ? 0 : i)).toString(16);
	            return i.length === 1 ? '0' + i : i;
	        }).join('');
	    },

	    toHSL: function () {
	        var r = this.rgb[0] / 255,
	            g = this.rgb[1] / 255,
	            b = this.rgb[2] / 255,
	            a = this.alpha;

	        var max = Math.max(r, g, b), min = Math.min(r, g, b);
	        var h, s, l = (max + min) / 2, d = max - min;

	        if (max === min) {
	            h = s = 0;
	        } else {
	            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

	            switch (max) {
	                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
	                case g: h = (b - r) / d + 2;               break;
	                case b: h = (r - g) / d + 4;               break;
	            }
	            h /= 6;
	        }
	        return { h: h * 360, s: s, l: l, a: a };
	    },
	    //Adapted from http://mjijackson.com/2008/02/rgb-to-hsl-and-rgb-to-hsv-color-model-conversion-algorithms-in-javascript
	    toHSV: function () {
	        var r = this.rgb[0] / 255,
	            g = this.rgb[1] / 255,
	            b = this.rgb[2] / 255,
	            a = this.alpha;

	        var max = Math.max(r, g, b), min = Math.min(r, g, b);
	        var h, s, v = max;

	        var d = max - min;
	        if (max === 0) {
	            s = 0;
	        } else {
	            s = d / max;
	        }

	        if (max === min) {
	            h = 0;
	        } else {
	            switch(max){
	                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
	                case g: h = (b - r) / d + 2; break;
	                case b: h = (r - g) / d + 4; break;
	            }
	            h /= 6;
	        }
	        return { h: h * 360, s: s, v: v, a: a };
	    },
	    toARGB: function () {
	        var argb = [Math.round(this.alpha * 255)].concat(this.rgb);
	        return '#' + argb.map(function (i) {
	            i = Math.round(i);
	            i = (i > 255 ? 255 : (i < 0 ? 0 : i)).toString(16);
	            return i.length === 1 ? '0' + i : i;
	        }).join('');
	    },
	    compare: function (x) {
	        if (!x.rgb) {
	            return -1;
	        }
	        
	        return (x.rgb[0] === this.rgb[0] &&
	            x.rgb[1] === this.rgb[1] &&
	            x.rgb[2] === this.rgb[2] &&
	            x.alpha === this.alpha) ? 0 : -1;
	    }
	};


	})(require(4));


/***/ },

/***/ 26:
/***/ function(module, exports, require) {

	(function (tree) {

	tree.Comment = function (value, silent, index, currentFileInfo) {
	    this.value = value;
	    this.silent = !!silent;
	    this.currentFileInfo = currentFileInfo;
	};
	tree.Comment.prototype = {
	    type: "Comment",
	    genCSS: function (env, output) {
	        if (this.debugInfo) {
	            output.add(tree.debugInfo(env, this), this.currentFileInfo, this.index);
	        }
	        output.add(this.value.trim()); //TODO shouldn't need to trim, we shouldn't grab the \n
	    },
	    toCSS: tree.toCSS,
	    isSilent: function(env) {
	        var isReference = (this.currentFileInfo && this.currentFileInfo.reference && !this.isReferenced),
	            isCompressed = env.compress && !this.value.match(/^\/\*!/);
	        return this.silent || isReference || isCompressed;
	    },
	    eval: function () { return this; },
	    markReferenced: function () {
	        this.isReferenced = true;
	    }
	};

	})(require(4));


/***/ },

/***/ 27:
/***/ function(module, exports, require) {

	(function (tree) {

	tree.Condition = function (op, l, r, i, negate) {
	    this.op = op.trim();
	    this.lvalue = l;
	    this.rvalue = r;
	    this.index = i;
	    this.negate = negate;
	};
	tree.Condition.prototype = {
	    type: "Condition",
	    accept: function (visitor) {
	        this.lvalue = visitor.visit(this.lvalue);
	        this.rvalue = visitor.visit(this.rvalue);
	    },
	    eval: function (env) {
	        var a = this.lvalue.eval(env),
	            b = this.rvalue.eval(env);

	        var i = this.index, result;

	        result = (function (op) {
	            switch (op) {
	                case 'and':
	                    return a && b;
	                case 'or':
	                    return a || b;
	                default:
	                    if (a.compare) {
	                        result = a.compare(b);
	                    } else if (b.compare) {
	                        result = b.compare(a);
	                    } else {
	                        throw { type: "Type",
	                                message: "Unable to perform comparison",
	                                index: i };
	                    }
	                    switch (result) {
	                        case -1: return op === '<' || op === '=<';
	                        case  0: return op === '=' || op === '>=' || op === '=<';
	                        case  1: return op === '>' || op === '>=';
	                    }
	            }
	        })(this.op);
	        return this.negate ? !result : result;
	    }
	};

	})(require(4));


/***/ },

/***/ 28:
/***/ function(module, exports, require) {

	(function (tree) {

	//
	// A number with a unit
	//
	tree.Dimension = function (value, unit) {
	    this.value = parseFloat(value);
	    this.unit = (unit && unit instanceof tree.Unit) ? unit :
	      new(tree.Unit)(unit ? [unit] : undefined);
	};

	tree.Dimension.prototype = {
	    type: "Dimension",
	    accept: function (visitor) {
	        this.unit = visitor.visit(this.unit);
	    },
	    eval: function (env) {
	        return this;
	    },
	    toColor: function () {
	        return new(tree.Color)([this.value, this.value, this.value]);
	    },
	    genCSS: function (env, output) {
	        if ((env && env.strictUnits) && !this.unit.isSingular()) {
	            throw new Error("Multiple units in dimension. Correct the units or use the unit function. Bad unit: "+this.unit.toString());
	        }

	        var value = this.value,
	            strValue = String(value);

	        if (value !== 0 && value < 0.000001 && value > -0.000001) {
	            // would be output 1e-6 etc.
	            strValue = value.toFixed(20).replace(/0+$/, "");
	        }

	        if (env && env.compress) {
	            // Zero values doesn't need a unit
	            if (value === 0 && !this.unit.isAngle()) {
	                output.add(strValue);
	                return;
	            }

	            // Float values doesn't need a leading zero
	            if (value > 0 && value < 1) {
	                strValue = (strValue).substr(1);
	            }
	        }

	        output.add(strValue);
	        this.unit.genCSS(env, output);
	    },
	    toCSS: tree.toCSS,

	    // In an operation between two Dimensions,
	    // we default to the first Dimension's unit,
	    // so `1px + 2` will yield `3px`.
	    operate: function (env, op, other) {
	        /*jshint noempty:false */
	        var value = tree.operate(env, op, this.value, other.value),
	            unit = this.unit.clone();

	        if (op === '+' || op === '-') {
	            if (unit.numerator.length === 0 && unit.denominator.length === 0) {
	                unit.numerator = other.unit.numerator.slice(0);
	                unit.denominator = other.unit.denominator.slice(0);
	            } else if (other.unit.numerator.length === 0 && unit.denominator.length === 0) {
	                // do nothing
	            } else {
	                other = other.convertTo(this.unit.usedUnits());

	                if(env.strictUnits && other.unit.toString() !== unit.toString()) {
	                  throw new Error("Incompatible units. Change the units or use the unit function. Bad units: '" + unit.toString() +
	                    "' and '" + other.unit.toString() + "'.");
	                }

	                value = tree.operate(env, op, this.value, other.value);
	            }
	        } else if (op === '*') {
	            unit.numerator = unit.numerator.concat(other.unit.numerator).sort();
	            unit.denominator = unit.denominator.concat(other.unit.denominator).sort();
	            unit.cancel();
	        } else if (op === '/') {
	            unit.numerator = unit.numerator.concat(other.unit.denominator).sort();
	            unit.denominator = unit.denominator.concat(other.unit.numerator).sort();
	            unit.cancel();
	        }
	        return new(tree.Dimension)(value, unit);
	    },

	    compare: function (other) {
	        if (other instanceof tree.Dimension) {
	            var a = this.unify(), b = other.unify(),
	                aValue = a.value, bValue = b.value;

	            if (bValue > aValue) {
	                return -1;
	            } else if (bValue < aValue) {
	                return 1;
	            } else {
	                if (!b.unit.isEmpty() && a.unit.compare(b.unit) !== 0) {
	                    return -1;
	                }
	                return 0;
	            }
	        } else {
	            return -1;
	        }
	    },

	    unify: function () {
	        return this.convertTo({ length: 'm', duration: 's', angle: 'rad' });
	    },

	    convertTo: function (conversions) {
	        var value = this.value, unit = this.unit.clone(),
	            i, groupName, group, targetUnit, derivedConversions = {}, applyUnit;

	        if (typeof conversions === 'string') {
	            for(i in tree.UnitConversions) {
	                if (tree.UnitConversions[i].hasOwnProperty(conversions)) {
	                    derivedConversions = {};
	                    derivedConversions[i] = conversions;
	                }
	            }
	            conversions = derivedConversions;
	        }
	        applyUnit = function (atomicUnit, denominator) {
	          /*jshint loopfunc:true */
	            if (group.hasOwnProperty(atomicUnit)) {
	                if (denominator) {
	                    value = value / (group[atomicUnit] / group[targetUnit]);
	                } else {
	                    value = value * (group[atomicUnit] / group[targetUnit]);
	                }

	                return targetUnit;
	            }

	            return atomicUnit;
	        };

	        for (groupName in conversions) {
	            if (conversions.hasOwnProperty(groupName)) {
	                targetUnit = conversions[groupName];
	                group = tree.UnitConversions[groupName];

	                unit.map(applyUnit);
	            }
	        }

	        unit.cancel();

	        return new(tree.Dimension)(value, unit);
	    }
	};

	// http://www.w3.org/TR/css3-values/#absolute-lengths
	tree.UnitConversions = {
	    length: {
	         'm': 1,
	        'cm': 0.01,
	        'mm': 0.001,
	        'in': 0.0254,
	        'pt': 0.0254 / 72,
	        'pc': 0.0254 / 72 * 12
	    },
	    duration: {
	        's': 1,
	        'ms': 0.001
	    },
	    angle: {
	        'rad': 1/(2*Math.PI),
	        'deg': 1/360,
	        'grad': 1/400,
	        'turn': 1
	    }
	};

	tree.Unit = function (numerator, denominator, backupUnit) {
	    this.numerator = numerator ? numerator.slice(0).sort() : [];
	    this.denominator = denominator ? denominator.slice(0).sort() : [];
	    this.backupUnit = backupUnit;
	};

	tree.Unit.prototype = {
	    type: "Unit",
	    clone: function () {
	        return new tree.Unit(this.numerator.slice(0), this.denominator.slice(0), this.backupUnit);
	    },
	    genCSS: function (env, output) {
	        if (this.numerator.length >= 1) {
	            output.add(this.numerator[0]);
	        } else
	        if (this.denominator.length >= 1) {
	            output.add(this.denominator[0]);
	        } else
	        if ((!env || !env.strictUnits) && this.backupUnit) {
	            output.add(this.backupUnit);
	        }
	    },
	    toCSS: tree.toCSS,

	    toString: function () {
	      var i, returnStr = this.numerator.join("*");
	      for (i = 0; i < this.denominator.length; i++) {
	          returnStr += "/" + this.denominator[i];
	      }
	      return returnStr;
	    },

	    compare: function (other) {
	        return this.is(other.toString()) ? 0 : -1;
	    },

	    is: function (unitString) {
	        return this.toString() === unitString;
	    },

	    isAngle: function () {
	        return tree.UnitConversions.angle.hasOwnProperty(this.toCSS());
	    },

	    isEmpty: function () {
	        return this.numerator.length === 0 && this.denominator.length === 0;
	    },

	    isSingular: function() {
	        return this.numerator.length <= 1 && this.denominator.length === 0;
	    },

	    map: function(callback) {
	        var i;

	        for (i = 0; i < this.numerator.length; i++) {
	            this.numerator[i] = callback(this.numerator[i], false);
	        }

	        for (i = 0; i < this.denominator.length; i++) {
	            this.denominator[i] = callback(this.denominator[i], true);
	        }
	    },

	    usedUnits: function() {
	        var group, result = {}, mapUnit;

	        mapUnit = function (atomicUnit) {
	        /*jshint loopfunc:true */
	            if (group.hasOwnProperty(atomicUnit) && !result[groupName]) {
	                result[groupName] = atomicUnit;
	            }

	            return atomicUnit;
	        };

	        for (var groupName in tree.UnitConversions) {
	            if (tree.UnitConversions.hasOwnProperty(groupName)) {
	                group = tree.UnitConversions[groupName];

	                this.map(mapUnit);
	            }
	        }

	        return result;
	    },

	    cancel: function () {
	        var counter = {}, atomicUnit, i, backup;

	        for (i = 0; i < this.numerator.length; i++) {
	            atomicUnit = this.numerator[i];
	            if (!backup) {
	                backup = atomicUnit;
	            }
	            counter[atomicUnit] = (counter[atomicUnit] || 0) + 1;
	        }

	        for (i = 0; i < this.denominator.length; i++) {
	            atomicUnit = this.denominator[i];
	            if (!backup) {
	                backup = atomicUnit;
	            }
	            counter[atomicUnit] = (counter[atomicUnit] || 0) - 1;
	        }

	        this.numerator = [];
	        this.denominator = [];

	        for (atomicUnit in counter) {
	            if (counter.hasOwnProperty(atomicUnit)) {
	                var count = counter[atomicUnit];

	                if (count > 0) {
	                    for (i = 0; i < count; i++) {
	                        this.numerator.push(atomicUnit);
	                    }
	                } else if (count < 0) {
	                    for (i = 0; i < -count; i++) {
	                        this.denominator.push(atomicUnit);
	                    }
	                }
	            }
	        }

	        if (this.numerator.length === 0 && this.denominator.length === 0 && backup) {
	            this.backupUnit = backup;
	        }

	        this.numerator.sort();
	        this.denominator.sort();
	    }
	};

	})(require(4));


/***/ },

/***/ 29:
/***/ function(module, exports, require) {

	(function (tree) {

	tree.Directive = function (name, value, index, currentFileInfo) {
	    this.name = name;

	    if (Array.isArray(value)) {
	        this.rules = [new(tree.Ruleset)([], value)];
	        this.rules[0].allowImports = true;
	    } else {
	        this.value = value;
	    }
	    this.currentFileInfo = currentFileInfo;

	};
	tree.Directive.prototype = {
	    type: "Directive",
	    accept: function (visitor) {
	        this.rules = visitor.visit(this.rules);
	        this.value = visitor.visit(this.value);
	    },
	    genCSS: function (env, output) {
	        output.add(this.name, this.currentFileInfo, this.index);
	        if (this.rules) {
	            tree.outputRuleset(env, output, this.rules);
	        } else {
	            output.add(' ');
	            this.value.genCSS(env, output);
	            output.add(';');
	        }
	    },
	    toCSS: tree.toCSS,
	    eval: function (env) {
	        var evaldDirective = this;
	        if (this.rules) {
	            env.frames.unshift(this);
	            evaldDirective = new(tree.Directive)(this.name, null, this.index, this.currentFileInfo);
	            evaldDirective.rules = [this.rules[0].eval(env)];
	            evaldDirective.rules[0].root = true;
	            env.frames.shift();
	        }
	        return evaldDirective;
	    },
	    variable: function (name) { return tree.Ruleset.prototype.variable.call(this.rules[0], name); },
	    find: function () { return tree.Ruleset.prototype.find.apply(this.rules[0], arguments); },
	    rulesets: function () { return tree.Ruleset.prototype.rulesets.apply(this.rules[0]); },
	    markReferenced: function () {
	        var i, rules;
	        this.isReferenced = true;
	        if (this.rules) {
	            rules = this.rules[0].rules;
	            for (i = 0; i < rules.length; i++) {
	                if (rules[i].markReferenced) {
	                    rules[i].markReferenced();
	                }
	            }
	        }
	    }
	};

	})(require(4));


/***/ },

/***/ 30:
/***/ function(module, exports, require) {

	(function (tree) {

	tree.Element = function (combinator, value, index, currentFileInfo) {
	    this.combinator = combinator instanceof tree.Combinator ?
	                      combinator : new(tree.Combinator)(combinator);

	    if (typeof(value) === 'string') {
	        this.value = value.trim();
	    } else if (value) {
	        this.value = value;
	    } else {
	        this.value = "";
	    }
	    this.index = index;
	    this.currentFileInfo = currentFileInfo;
	};
	tree.Element.prototype = {
	    type: "Element",
	    accept: function (visitor) {
	        this.combinator = visitor.visit(this.combinator);
	        this.value = visitor.visit(this.value);
	    },
	    eval: function (env) {
	        return new(tree.Element)(this.combinator,
	                                 this.value.eval ? this.value.eval(env) : this.value,
	                                 this.index,
	                                 this.currentFileInfo);
	    },
	    genCSS: function (env, output) {
	        output.add(this.toCSS(env), this.currentFileInfo, this.index);
	    },
	    toCSS: function (env) {
	        var value = (this.value.toCSS ? this.value.toCSS(env) : this.value);
	        if (value === '' && this.combinator.value.charAt(0) === '&') {
	            return '';
	        } else {
	            return this.combinator.toCSS(env || {}) + value;
	        }
	    }
	};

	tree.Attribute = function (key, op, value) {
	    this.key = key;
	    this.op = op;
	    this.value = value;
	};
	tree.Attribute.prototype = {
	    type: "Attribute",
	    accept: function (visitor) {
	        this.value = visitor.visit(this.value);
	    },
	    eval: function (env) {
	        return new(tree.Attribute)(this.key.eval ? this.key.eval(env) : this.key,
	            this.op, (this.value && this.value.eval) ? this.value.eval(env) : this.value);
	    },
	    genCSS: function (env, output) {
	        output.add(this.toCSS(env));
	    },
	    toCSS: function (env) {
	        var value = this.key.toCSS ? this.key.toCSS(env) : this.key;

	        if (this.op) {
	            value += this.op;
	            value += (this.value.toCSS ? this.value.toCSS(env) : this.value);
	        }

	        return '[' + value + ']';
	    }
	};

	tree.Combinator = function (value) {
	    if (value === ' ') {
	        this.value = ' ';
	    } else {
	        this.value = value ? value.trim() : "";
	    }
	};
	tree.Combinator.prototype = {
	    type: "Combinator",
	    _outputMap: {
	        ''  : '',
	        ' ' : ' ',
	        ':' : ' :',
	        '+' : ' + ',
	        '~' : ' ~ ',
	        '>' : ' > ',
	        '|' : '|'
	    },
	    _outputMapCompressed: {
	        ''  : '',
	        ' ' : ' ',
	        ':' : ' :',
	        '+' : '+',
	        '~' : '~',
	        '>' : '>',
	        '|' : '|'
	    },
	    genCSS: function (env, output) {
	        output.add((env.compress ? this._outputMapCompressed : this._outputMap)[this.value]);
	    },
	    toCSS: tree.toCSS
	};

	})(require(4));


/***/ },

/***/ 31:
/***/ function(module, exports, require) {

	(function (tree) {

	tree.Expression = function (value) { this.value = value; };
	tree.Expression.prototype = {
	    type: "Expression",
	    accept: function (visitor) {
	        this.value = visitor.visit(this.value);
	    },
	    eval: function (env) {
	        var returnValue,
	            inParenthesis = this.parens && !this.parensInOp,
	            doubleParen = false;
	        if (inParenthesis) {
	            env.inParenthesis();
	        }
	        if (this.value.length > 1) {
	            returnValue = new(tree.Expression)(this.value.map(function (e) {
	                return e.eval(env);
	            }));
	        } else if (this.value.length === 1) {
	            if (this.value[0].parens && !this.value[0].parensInOp) {
	                doubleParen = true;
	            }
	            returnValue = this.value[0].eval(env);
	        } else {
	            returnValue = this;
	        }
	        if (inParenthesis) {
	            env.outOfParenthesis();
	        }
	        if (this.parens && this.parensInOp && !(env.isMathOn()) && !doubleParen) {
	            returnValue = new(tree.Paren)(returnValue);
	        }
	        return returnValue;
	    },
	    genCSS: function (env, output) {
	        for(var i = 0; i < this.value.length; i++) {
	            this.value[i].genCSS(env, output);
	            if (i + 1 < this.value.length) {
	                output.add(" ");
	            }
	        }
	    },
	    toCSS: tree.toCSS,
	    throwAwayComments: function () {
	        this.value = this.value.filter(function(v) {
	            return !(v instanceof tree.Comment);
	        });
	    }
	};

	})(require(4));


/***/ },

/***/ 32:
/***/ function(module, exports, require) {

	(function (tree) {

	tree.Extend = function Extend(selector, option, index) {
	    this.selector = selector;
	    this.option = option;
	    this.index = index;

	    switch(option) {
	        case "all":
	            this.allowBefore = true;
	            this.allowAfter = true;
	        break;
	        default:
	            this.allowBefore = false;
	            this.allowAfter = false;
	        break;
	    }
	};

	tree.Extend.prototype = {
	    type: "Extend",
	    accept: function (visitor) {
	        this.selector = visitor.visit(this.selector);
	    },
	    eval: function (env) {
	        return new(tree.Extend)(this.selector.eval(env), this.option, this.index);
	    },
	    clone: function (env) {
	        return new(tree.Extend)(this.selector, this.option, this.index);
	    },
	    findSelfSelectors: function (selectors) {
	        var selfElements = [],
	            i;

	        for(i = 0; i < selectors.length; i++) {
	            selfElements = selfElements.concat(selectors[i].elements);
	        }

	        this.selfSelectors = [{ elements: selfElements }];
	    }
	};

	})(require(4));


/***/ },

/***/ 33:
/***/ function(module, exports, require) {

	(function (tree) {
	//
	// CSS @import node
	//
	// The general strategy here is that we don't want to wait
	// for the parsing to be completed, before we start importing
	// the file. That's because in the context of a browser,
	// most of the time will be spent waiting for the server to respond.
	//
	// On creation, we push the import path to our import queue, though
	// `import,push`, we also pass it a callback, which it'll call once
	// the file has been fetched, and parsed.
	//
	tree.Import = function (path, features, options, index, currentFileInfo) {
	    this.options = options;
	    this.index = index;
	    this.path = path;
	    this.features = features;
	    this.currentFileInfo = currentFileInfo;

	    if (this.options.less !== undefined || this.options.inline) {
	        this.css = !this.options.less || this.options.inline;
	    } else {
	        var pathValue = this.getPath();
	        if (pathValue && /css([\?;].*)?$/.test(pathValue)) {
	            this.css = true;
	        }
	    }
	};

	//
	// The actual import node doesn't return anything, when converted to CSS.
	// The reason is that it's used at the evaluation stage, so that the rules
	// it imports can be treated like any other rules.
	//
	// In `eval`, we make sure all Import nodes get evaluated, recursively, so
	// we end up with a flat structure, which can easily be imported in the parent
	// ruleset.
	//
	tree.Import.prototype = {
	    type: "Import",
	    accept: function (visitor) {
	        this.features = visitor.visit(this.features);
	        this.path = visitor.visit(this.path);
	        if (!this.options.inline) {
	            this.root = visitor.visit(this.root);
	        }
	    },
	    genCSS: function (env, output) {
	        if (this.css) {
	            output.add("@import ", this.currentFileInfo, this.index);
	            this.path.genCSS(env, output);
	            if (this.features) {
	                output.add(" ");
	                this.features.genCSS(env, output);
	            }
	            output.add(';');
	        }
	    },
	    toCSS: tree.toCSS,
	    getPath: function () {
	        if (this.path instanceof tree.Quoted) {
	            var path = this.path.value;
	            return (this.css !== undefined || /(\.[a-z]*$)|([\?;].*)$/.test(path)) ? path : path + '.less';
	        } else if (this.path instanceof tree.URL) {
	            return this.path.value.value;
	        }
	        return null;
	    },
	    evalForImport: function (env) {
	        return new(tree.Import)(this.path.eval(env), this.features, this.options, this.index, this.currentFileInfo);
	    },
	    evalPath: function (env) {
	        var path = this.path.eval(env);
	        var rootpath = this.currentFileInfo && this.currentFileInfo.rootpath;
	        if (rootpath && !(path instanceof tree.URL)) {
	            var pathValue = path.value;
	            // Add the base path if the import is relative
	            if (pathValue && env.isPathRelative(pathValue)) {
	                path.value =  rootpath + pathValue;
	            }
	        }
	        return path;
	    },
	    eval: function (env) {
	        var ruleset, features = this.features && this.features.eval(env);

	        if (this.skip) { return []; }

	        if (this.options.inline) {
	            var contents = new(tree.Anonymous)(this.root);
	            return this.features ? new(tree.Media)([contents], this.features.value) : [contents];
	        } else if (this.css) {
	            var newImport = new(tree.Import)(this.evalPath(env), features, this.options, this.index);
	            if (!newImport.css && this.error) {
	                throw this.error;
	            }
	            return newImport;
	        } else {
	            ruleset = new(tree.Ruleset)([], this.root.rules.slice(0));

	            ruleset.evalImports(env);

	            return this.features ? new(tree.Media)(ruleset.rules, this.features.value) : ruleset.rules;
	        }
	    }
	};

	})(require(4));


/***/ },

/***/ 34:
/***/ function(module, exports, require) {

	(function (tree) {

	tree.JavaScript = function (string, index, escaped) {
	    this.escaped = escaped;
	    this.expression = string;
	    this.index = index;
	};
	tree.JavaScript.prototype = {
	    type: "JavaScript",
	    eval: function (env) {
	        var result,
	            that = this,
	            context = {};

	        var expression = this.expression.replace(/@\{([\w-]+)\}/g, function (_, name) {
	            return tree.jsify(new(tree.Variable)('@' + name, that.index).eval(env));
	        });

	        try {
	            expression = new(Function)('return (' + expression + ')');
	        } catch (e) {
	            throw { message: "JavaScript evaluation error: `" + expression + "`" ,
	                    index: this.index };
	        }

	        for (var k in env.frames[0].variables()) {
	            /*jshint loopfunc:true */
	            context[k.slice(1)] = {
	                value: env.frames[0].variables()[k].value,
	                toJS: function () {
	                    return this.value.eval(env).toCSS();
	                }
	            };
	        }

	        try {
	            result = expression.call(context);
	        } catch (e) {
	            throw { message: "JavaScript evaluation error: '" + e.name + ': ' + e.message + "'" ,
	                    index: this.index };
	        }
	        if (typeof(result) === 'string') {
	            return new(tree.Quoted)('"' + result + '"', result, this.escaped, this.index);
	        } else if (Array.isArray(result)) {
	            return new(tree.Anonymous)(result.join(', '));
	        } else {
	            return new(tree.Anonymous)(result);
	        }
	    }
	};

	})(require(4));



/***/ },

/***/ 35:
/***/ function(module, exports, require) {

	(function (tree) {

	tree.Keyword = function (value) { this.value = value; };
	tree.Keyword.prototype = {
	    type: "Keyword",
	    eval: function () { return this; },
	    genCSS: function (env, output) {
	        output.add(this.value);
	    },
	    toCSS: tree.toCSS,
	    compare: function (other) {
	        if (other instanceof tree.Keyword) {
	            return other.value === this.value ? 0 : 1;
	        } else {
	            return -1;
	        }
	    }
	};

	tree.True = new(tree.Keyword)('true');
	tree.False = new(tree.Keyword)('false');

	})(require(4));


/***/ },

/***/ 36:
/***/ function(module, exports, require) {

	(function (tree) {

	tree.Media = function (value, features, index, currentFileInfo) {
	    this.index = index;
	    this.currentFileInfo = currentFileInfo;

	    var selectors = this.emptySelectors();

	    this.features = new(tree.Value)(features);
	    this.rules = [new(tree.Ruleset)(selectors, value)];
	    this.rules[0].allowImports = true;
	};
	tree.Media.prototype = {
	    type: "Media",
	    accept: function (visitor) {
	        this.features = visitor.visit(this.features);
	        this.rules = visitor.visit(this.rules);
	    },
	    genCSS: function (env, output) {
	        output.add('@media ', this.currentFileInfo, this.index);
	        this.features.genCSS(env, output);
	        tree.outputRuleset(env, output, this.rules);
	    },
	    toCSS: tree.toCSS,
	    eval: function (env) {
	        if (!env.mediaBlocks) {
	            env.mediaBlocks = [];
	            env.mediaPath = [];
	        }
	        
	        var media = new(tree.Media)([], [], this.index, this.currentFileInfo);
	        if(this.debugInfo) {
	            this.rules[0].debugInfo = this.debugInfo;
	            media.debugInfo = this.debugInfo;
	        }
	        var strictMathBypass = false;
	        if (!env.strictMath) {
	            strictMathBypass = true;
	            env.strictMath = true;
	        }
	        try {
	            media.features = this.features.eval(env);
	        }
	        finally {
	            if (strictMathBypass) {
	                env.strictMath = false;
	            }
	        }
	        
	        env.mediaPath.push(media);
	        env.mediaBlocks.push(media);
	        
	        env.frames.unshift(this.rules[0]);
	        media.rules = [this.rules[0].eval(env)];
	        env.frames.shift();
	        
	        env.mediaPath.pop();

	        return env.mediaPath.length === 0 ? media.evalTop(env) :
	                    media.evalNested(env);
	    },
	    variable: function (name) { return tree.Ruleset.prototype.variable.call(this.rules[0], name); },
	    find: function () { return tree.Ruleset.prototype.find.apply(this.rules[0], arguments); },
	    rulesets: function () { return tree.Ruleset.prototype.rulesets.apply(this.rules[0]); },
	    emptySelectors: function() { 
	        var el = new(tree.Element)('', '&', this.index, this.currentFileInfo);
	        return [new(tree.Selector)([el], null, null, this.index, this.currentFileInfo)];
	    },
	    markReferenced: function () {
	        var i, rules = this.rules[0].rules;
	        this.isReferenced = true;
	        for (i = 0; i < rules.length; i++) {
	            if (rules[i].markReferenced) {
	                rules[i].markReferenced();
	            }
	        }
	    },

	    evalTop: function (env) {
	        var result = this;

	        // Render all dependent Media blocks.
	        if (env.mediaBlocks.length > 1) {
	            var selectors = this.emptySelectors();
	            result = new(tree.Ruleset)(selectors, env.mediaBlocks);
	            result.multiMedia = true;
	        }

	        delete env.mediaBlocks;
	        delete env.mediaPath;

	        return result;
	    },
	    evalNested: function (env) {
	        var i, value,
	            path = env.mediaPath.concat([this]);

	        // Extract the media-query conditions separated with `,` (OR).
	        for (i = 0; i < path.length; i++) {
	            value = path[i].features instanceof tree.Value ?
	                        path[i].features.value : path[i].features;
	            path[i] = Array.isArray(value) ? value : [value];
	        }

	        // Trace all permutations to generate the resulting media-query.
	        //
	        // (a, b and c) with nested (d, e) ->
	        //    a and d
	        //    a and e
	        //    b and c and d
	        //    b and c and e
	        this.features = new(tree.Value)(this.permute(path).map(function (path) {
	            path = path.map(function (fragment) {
	                return fragment.toCSS ? fragment : new(tree.Anonymous)(fragment);
	            });

	            for(i = path.length - 1; i > 0; i--) {
	                path.splice(i, 0, new(tree.Anonymous)("and"));
	            }

	            return new(tree.Expression)(path);
	        }));

	        // Fake a tree-node that doesn't output anything.
	        return new(tree.Ruleset)([], []);
	    },
	    permute: function (arr) {
	      if (arr.length === 0) {
	          return [];
	      } else if (arr.length === 1) {
	          return arr[0];
	      } else {
	          var result = [];
	          var rest = this.permute(arr.slice(1));
	          for (var i = 0; i < rest.length; i++) {
	              for (var j = 0; j < arr[0].length; j++) {
	                  result.push([arr[0][j]].concat(rest[i]));
	              }
	          }
	          return result;
	      }
	    },
	    bubbleSelectors: function (selectors) {
	      this.rules = [new(tree.Ruleset)(selectors.slice(0), [this.rules[0]])];
	    }
	};

	})(require(4));


/***/ },

/***/ 37:
/***/ function(module, exports, require) {

	(function (tree) {

	tree.mixin = {};
	tree.mixin.Call = function (elements, args, index, currentFileInfo, important) {
	    this.selector = new(tree.Selector)(elements);
	    this.arguments = args;
	    this.index = index;
	    this.currentFileInfo = currentFileInfo;
	    this.important = important;
	};
	tree.mixin.Call.prototype = {
	    type: "MixinCall",
	    accept: function (visitor) {
	        this.selector = visitor.visit(this.selector);
	        this.arguments = visitor.visit(this.arguments);
	    },
	    eval: function (env) {
	        var mixins, mixin, args, rules = [], match = false, i, m, f, isRecursive, isOneFound, rule;

	        args = this.arguments && this.arguments.map(function (a) {
	            return { name: a.name, value: a.value.eval(env) };
	        });

	        for (i = 0; i < env.frames.length; i++) {
	            if ((mixins = env.frames[i].find(this.selector)).length > 0) {
	                isOneFound = true;
	                for (m = 0; m < mixins.length; m++) {
	                    mixin = mixins[m];
	                    isRecursive = false;
	                    for(f = 0; f < env.frames.length; f++) {
	                        if ((!(mixin instanceof tree.mixin.Definition)) && mixin === (env.frames[f].originalRuleset || env.frames[f])) {
	                            isRecursive = true;
	                            break;
	                        }
	                    }
	                    if (isRecursive) {
	                        continue;
	                    }
	                    if (mixin.matchArgs(args, env)) {
	                        if (!mixin.matchCondition || mixin.matchCondition(args, env)) {
	                            try {
	                                Array.prototype.push.apply(
	                                      rules, mixin.eval(env, args, this.important).rules);
	                            } catch (e) {
	                                throw { message: e.message, index: this.index, filename: this.currentFileInfo.filename, stack: e.stack };
	                            }
	                        }
	                        match = true;
	                    }
	                }
	                if (match) {
	                    if (!this.currentFileInfo || !this.currentFileInfo.reference) {
	                        for (i = 0; i < rules.length; i++) {
	                            rule = rules[i];
	                            if (rule.markReferenced) {
	                                rule.markReferenced();
	                            }
	                        }
	                    }
	                    return rules;
	                }
	            }
	        }
	        if (isOneFound) {
	            throw { type:    'Runtime',
	                    message: 'No matching definition was found for `' +
	                              this.selector.toCSS().trim() + '('      +
	                              (args ? args.map(function (a) {
	                                  var argValue = "";
	                                  if (a.name) {
	                                      argValue += a.name + ":";
	                                  }
	                                  if (a.value.toCSS) {
	                                      argValue += a.value.toCSS();
	                                  } else {
	                                      argValue += "???";
	                                  }
	                                  return argValue;
	                              }).join(', ') : "") + ")`",
	                    index:   this.index, filename: this.currentFileInfo.filename };
	        } else {
	            throw { type: 'Name',
	                message: this.selector.toCSS().trim() + " is undefined",
	                index: this.index, filename: this.currentFileInfo.filename };
	        }
	    }
	};

	tree.mixin.Definition = function (name, params, rules, condition, variadic) {
	    this.name = name;
	    this.selectors = [new(tree.Selector)([new(tree.Element)(null, name, this.index, this.currentFileInfo)])];
	    this.params = params;
	    this.condition = condition;
	    this.variadic = variadic;
	    this.arity = params.length;
	    this.rules = rules;
	    this._lookups = {};
	    this.required = params.reduce(function (count, p) {
	        if (!p.name || (p.name && !p.value)) { return count + 1; }
	        else                                 { return count; }
	    }, 0);
	    this.parent = tree.Ruleset.prototype;
	    this.frames = [];
	};
	tree.mixin.Definition.prototype = {
	    type: "MixinDefinition",
	    accept: function (visitor) {
	        this.params = visitor.visit(this.params);
	        this.rules = visitor.visit(this.rules);
	        this.condition = visitor.visit(this.condition);
	    },
	    variable:  function (name) { return this.parent.variable.call(this, name); },
	    variables: function ()     { return this.parent.variables.call(this); },
	    find:      function ()     { return this.parent.find.apply(this, arguments); },
	    rulesets:  function ()     { return this.parent.rulesets.apply(this); },

	    evalParams: function (env, mixinEnv, args, evaldArguments) {
	        /*jshint boss:true */
	        var frame = new(tree.Ruleset)(null, []),
	            varargs, arg,
	            params = this.params.slice(0),
	            i, j, val, name, isNamedFound, argIndex;

	        mixinEnv = new tree.evalEnv(mixinEnv, [frame].concat(mixinEnv.frames));
	        
	        if (args) {
	            args = args.slice(0);

	            for(i = 0; i < args.length; i++) {
	                arg = args[i];
	                if (name = (arg && arg.name)) {
	                    isNamedFound = false;
	                    for(j = 0; j < params.length; j++) {
	                        if (!evaldArguments[j] && name === params[j].name) {
	                            evaldArguments[j] = arg.value.eval(env);
	                            frame.rules.unshift(new(tree.Rule)(name, arg.value.eval(env)));
	                            isNamedFound = true;
	                            break;
	                        }
	                    }
	                    if (isNamedFound) {
	                        args.splice(i, 1);
	                        i--;
	                        continue;
	                    } else {
	                        throw { type: 'Runtime', message: "Named argument for " + this.name +
	                            ' ' + args[i].name + ' not found' };
	                    }
	                }
	            }
	        }
	        argIndex = 0;
	        for (i = 0; i < params.length; i++) {
	            if (evaldArguments[i]) { continue; }
	            
	            arg = args && args[argIndex];

	            if (name = params[i].name) {
	                if (params[i].variadic && args) {
	                    varargs = [];
	                    for (j = argIndex; j < args.length; j++) {
	                        varargs.push(args[j].value.eval(env));
	                    }
	                    frame.rules.unshift(new(tree.Rule)(name, new(tree.Expression)(varargs).eval(env)));
	                } else {
	                    val = arg && arg.value;
	                    if (val) {
	                        val = val.eval(env);
	                    } else if (params[i].value) {
	                        val = params[i].value.eval(mixinEnv);
	                        frame.resetCache();
	                    } else {
	                        throw { type: 'Runtime', message: "wrong number of arguments for " + this.name +
	                            ' (' + args.length + ' for ' + this.arity + ')' };
	                    }
	                    
	                    frame.rules.unshift(new(tree.Rule)(name, val));
	                    evaldArguments[i] = val;
	                }
	            }
	            
	            if (params[i].variadic && args) {
	                for (j = argIndex; j < args.length; j++) {
	                    evaldArguments[j] = args[j].value.eval(env);
	                }
	            }
	            argIndex++;
	        }

	        return frame;
	    },
	    eval: function (env, args, important) {
	        var _arguments = [],
	            mixinFrames = this.frames.concat(env.frames),
	            frame = this.evalParams(env, new(tree.evalEnv)(env, mixinFrames), args, _arguments),
	            rules, ruleset;

	        frame.rules.unshift(new(tree.Rule)('@arguments', new(tree.Expression)(_arguments).eval(env)));

	        rules = important ?
	            this.parent.makeImportant.apply(this).rules : this.rules.slice(0);

	        ruleset = new(tree.Ruleset)(null, rules).eval(new(tree.evalEnv)(env,
	                                                    [this, frame].concat(mixinFrames)));
	        ruleset.originalRuleset = this;
	        return ruleset;
	    },
	    matchCondition: function (args, env) {

	        if (this.condition && !this.condition.eval(
	            new(tree.evalEnv)(env,
	                [this.evalParams(env, new(tree.evalEnv)(env, this.frames.concat(env.frames)), args, [])]
	                    .concat(env.frames)))) {
	            return false;
	        }
	        return true;
	    },
	    matchArgs: function (args, env) {
	        var argsLength = (args && args.length) || 0, len;

	        if (! this.variadic) {
	            if (argsLength < this.required)                               { return false; }
	            if (argsLength > this.params.length)                          { return false; }
	            if ((this.required > 0) && (argsLength > this.params.length)) { return false; }
	        }

	        len = Math.min(argsLength, this.arity);

	        for (var i = 0; i < len; i++) {
	            if (!this.params[i].name && !this.params[i].variadic) {
	                if (args[i].value.eval(env).toCSS() != this.params[i].value.eval(env).toCSS()) {
	                    return false;
	                }
	            }
	        }
	        return true;
	    }
	};

	})(require(4));


/***/ },

/***/ 38:
/***/ function(module, exports, require) {

	(function (tree) {

	tree.Negative = function (node) {
	    this.value = node;
	};
	tree.Negative.prototype = {
	    type: "Negative",
	    accept: function (visitor) {
	        this.value = visitor.visit(this.value);
	    },
	    genCSS: function (env, output) {
	        output.add('-');
	        this.value.genCSS(env, output);
	    },
	    toCSS: tree.toCSS,
	    eval: function (env) {
	        if (env.isMathOn()) {
	            return (new(tree.Operation)('*', [new(tree.Dimension)(-1), this.value])).eval(env);
	        }
	        return new(tree.Negative)(this.value.eval(env));
	    }
	};

	})(require(4));


/***/ },

/***/ 39:
/***/ function(module, exports, require) {

	(function (tree) {

	tree.Operation = function (op, operands, isSpaced) {
	    this.op = op.trim();
	    this.operands = operands;
	    this.isSpaced = isSpaced;
	};
	tree.Operation.prototype = {
	    type: "Operation",
	    accept: function (visitor) {
	        this.operands = visitor.visit(this.operands);
	    },
	    eval: function (env) {
	        var a = this.operands[0].eval(env),
	            b = this.operands[1].eval(env),
	            temp;

	        if (env.isMathOn()) {
	            if (a instanceof tree.Dimension && b instanceof tree.Color) {
	                if (this.op === '*' || this.op === '+') {
	                    temp = b, b = a, a = temp;
	                } else {
	                    throw { type: "Operation",
	                            message: "Can't substract or divide a color from a number" };
	                }
	            }
	            if (!a.operate) {
	                throw { type: "Operation",
	                        message: "Operation on an invalid type" };
	            }

	            return a.operate(env, this.op, b);
	        } else {
	            return new(tree.Operation)(this.op, [a, b], this.isSpaced);
	        }
	    },
	    genCSS: function (env, output) {
	        this.operands[0].genCSS(env, output);
	        if (this.isSpaced) {
	            output.add(" ");
	        }
	        output.add(this.op);
	        if (this.isSpaced) {
	            output.add(" ");
	        }
	        this.operands[1].genCSS(env, output);
	    },
	    toCSS: tree.toCSS
	};

	tree.operate = function (env, op, a, b) {
	    switch (op) {
	        case '+': return a + b;
	        case '-': return a - b;
	        case '*': return a * b;
	        case '/': return a / b;
	    }
	};

	})(require(4));


/***/ },

/***/ 40:
/***/ function(module, exports, require) {

	
	(function (tree) {

	tree.Paren = function (node) {
	    this.value = node;
	};
	tree.Paren.prototype = {
	    type: "Paren",
	    accept: function (visitor) {
	        this.value = visitor.visit(this.value);
	    },
	    genCSS: function (env, output) {
	        output.add('(');
	        this.value.genCSS(env, output);
	        output.add(')');
	    },
	    toCSS: tree.toCSS,
	    eval: function (env) {
	        return new(tree.Paren)(this.value.eval(env));
	    }
	};

	})(require(4));


/***/ },

/***/ 41:
/***/ function(module, exports, require) {

	(function (tree) {

	tree.Quoted = function (str, content, escaped, index, currentFileInfo) {
	    this.escaped = escaped;
	    this.value = content || '';
	    this.quote = str.charAt(0);
	    this.index = index;
	    this.currentFileInfo = currentFileInfo;
	};
	tree.Quoted.prototype = {
	    type: "Quoted",
	    genCSS: function (env, output) {
	        if (!this.escaped) {
	            output.add(this.quote, this.currentFileInfo, this.index);
	        }
	        output.add(this.value);
	        if (!this.escaped) {
	            output.add(this.quote);
	        }
	    },
	    toCSS: tree.toCSS,
	    eval: function (env) {
	        var that = this;
	        var value = this.value.replace(/`([^`]+)`/g, function (_, exp) {
	            return new(tree.JavaScript)(exp, that.index, true).eval(env).value;
	        }).replace(/@\{([\w-]+)\}/g, function (_, name) {
	            var v = new(tree.Variable)('@' + name, that.index, that.currentFileInfo).eval(env, true);
	            return (v instanceof tree.Quoted) ? v.value : v.toCSS();
	        });
	        return new(tree.Quoted)(this.quote + value + this.quote, value, this.escaped, this.index);
	    },
	    compare: function (x) {
	        if (!x.toCSS) {
	            return -1;
	        }
	        
	        var left = this.toCSS(),
	            right = x.toCSS();
	        
	        if (left === right) {
	            return 0;
	        }
	        
	        return left < right ? -1 : 1;
	    }
	};

	})(require(4));


/***/ },

/***/ 42:
/***/ function(module, exports, require) {

	(function (tree) {

	tree.Rule = function (name, value, important, merge, index, currentFileInfo, inline) {
	    this.name = name;
	    this.value = (value instanceof tree.Value) ? value : new(tree.Value)([value]);
	    this.important = important ? ' ' + important.trim() : '';
	    this.merge = merge;
	    this.index = index;
	    this.currentFileInfo = currentFileInfo;
	    this.inline = inline || false;
	    this.variable = (name.charAt(0) === '@');
	};

	tree.Rule.prototype = {
	    type: "Rule",
	    accept: function (visitor) {
	        this.value = visitor.visit(this.value);
	    },
	    genCSS: function (env, output) {
	        output.add(this.name + (env.compress ? ':' : ': '), this.currentFileInfo, this.index);
	        try {
	            this.value.genCSS(env, output);
	        }
	        catch(e) {
	            e.index = this.index;
	            e.filename = this.currentFileInfo.filename;
	            throw e;
	        }
	        output.add(this.important + ((this.inline || (env.lastRule && env.compress)) ? "" : ";"), this.currentFileInfo, this.index);
	    },
	    toCSS: tree.toCSS,
	    eval: function (env) {
	        var strictMathBypass = false;
	        if (this.name === "font" && !env.strictMath) {
	            strictMathBypass = true;
	            env.strictMath = true;
	        }
	        try {
	            return new(tree.Rule)(this.name,
	                              this.value.eval(env),
	                              this.important,
	                              this.merge,
	                              this.index, this.currentFileInfo, this.inline);
	        }
	        finally {
	            if (strictMathBypass) {
	                env.strictMath = false;
	            }
	        }
	    },
	    makeImportant: function () {
	        return new(tree.Rule)(this.name,
	                              this.value,
	                              "!important",
	                              this.merge,
	                              this.index, this.currentFileInfo, this.inline);
	    }
	};

	})(require(4));


/***/ },

/***/ 43:
/***/ function(module, exports, require) {

	(function (tree) {

	tree.Ruleset = function (selectors, rules, strictImports) {
	    this.selectors = selectors;
	    this.rules = rules;
	    this._lookups = {};
	    this.strictImports = strictImports;
	};
	tree.Ruleset.prototype = {
	    type: "Ruleset",
	    accept: function (visitor) {
	        if (this.paths) {
	            for(var i = 0; i < this.paths.length; i++) {
	                this.paths[i] = visitor.visit(this.paths[i]);
	            }
	        } else {
	            this.selectors = visitor.visit(this.selectors);
	        }
	        this.rules = visitor.visit(this.rules);
	    },
	    eval: function (env) {
	        var selectors = this.selectors && this.selectors.map(function (s) { return s.eval(env); });
	        var ruleset = new(tree.Ruleset)(selectors, this.rules.slice(0), this.strictImports);
	        var rules;
	        var rule;
	        var i;
	        
	        ruleset.originalRuleset = this;
	        ruleset.root = this.root;
	        ruleset.firstRoot = this.firstRoot;
	        ruleset.allowImports = this.allowImports;

	        if(this.debugInfo) {
	            ruleset.debugInfo = this.debugInfo;
	        }

	        // push the current ruleset to the frames stack
	        env.frames.unshift(ruleset);

	        // currrent selectors
	        if (!env.selectors) {
	            env.selectors = [];
	        }
	        env.selectors.unshift(this.selectors);

	        // Evaluate imports
	        if (ruleset.root || ruleset.allowImports || !ruleset.strictImports) {
	            ruleset.evalImports(env);
	        }

	        // Store the frames around mixin definitions,
	        // so they can be evaluated like closures when the time comes.
	        for (i = 0; i < ruleset.rules.length; i++) {
	            if (ruleset.rules[i] instanceof tree.mixin.Definition) {
	                ruleset.rules[i].frames = env.frames.slice(0);
	            }
	        }
	        
	        var mediaBlockCount = (env.mediaBlocks && env.mediaBlocks.length) || 0;

	        // Evaluate mixin calls.
	        for (i = 0; i < ruleset.rules.length; i++) {
	            if (ruleset.rules[i] instanceof tree.mixin.Call) {
	                /*jshint loopfunc:true */
	                rules = ruleset.rules[i].eval(env).filter(function(r) {
	                    if ((r instanceof tree.Rule) && r.variable) {
	                        // do not pollute the scope if the variable is
	                        // already there. consider returning false here
	                        // but we need a way to "return" variable from mixins
	                        return !(ruleset.variable(r.name));
	                    }
	                    return true;
	                });
	                ruleset.rules.splice.apply(ruleset.rules, [i, 1].concat(rules));
	                i += rules.length-1;
	                ruleset.resetCache();
	            }
	        }
	        
	        // Evaluate everything else
	        for (i = 0; i < ruleset.rules.length; i++) {
	            rule = ruleset.rules[i];

	            if (! (rule instanceof tree.mixin.Definition)) {
	                ruleset.rules[i] = rule.eval ? rule.eval(env) : rule;
	            }
	        }

	        // Pop the stack
	        env.frames.shift();
	        env.selectors.shift();
	        
	        if (env.mediaBlocks) {
	            for (i = mediaBlockCount; i < env.mediaBlocks.length; i++) {
	                env.mediaBlocks[i].bubbleSelectors(selectors);
	            }
	        }

	        return ruleset;
	    },
	    evalImports: function(env) {
	        var i, rules;
	        for (i = 0; i < this.rules.length; i++) {
	            if (this.rules[i] instanceof tree.Import) {
	                rules = this.rules[i].eval(env);
	                if (typeof rules.length === "number") {
	                    this.rules.splice.apply(this.rules, [i, 1].concat(rules));
	                    i+= rules.length-1;
	                } else {
	                    this.rules.splice(i, 1, rules);
	                }
	                this.resetCache();
	            }
	        }
	    },
	    makeImportant: function() {
	        return new tree.Ruleset(this.selectors, this.rules.map(function (r) {
	                    if (r.makeImportant) {
	                        return r.makeImportant();
	                    } else {
	                        return r;
	                    }
	                }), this.strictImports);
	    },
	    matchArgs: function (args) {
	        return !args || args.length === 0;
	    },
	    matchCondition: function (args, env) {
	        var lastSelector = this.selectors[this.selectors.length-1];
	        if (lastSelector.condition &&
	            !lastSelector.condition.eval(
	                new(tree.evalEnv)(env,
	                    env.frames))) {
	            return false;
	        }
	        return true;
	    },
	    resetCache: function () {
	        this._rulesets = null;
	        this._variables = null;
	        this._lookups = {};
	    },
	    variables: function () {
	        if (this._variables) { return this._variables; }
	        else {
	            return this._variables = this.rules.reduce(function (hash, r) {
	                if (r instanceof tree.Rule && r.variable === true) {
	                    hash[r.name] = r;
	                }
	                return hash;
	            }, {});
	        }
	    },
	    variable: function (name) {
	        return this.variables()[name];
	    },
	    rulesets: function () {
	        return this.rules.filter(function (r) {
	            return (r instanceof tree.Ruleset) || (r instanceof tree.mixin.Definition);
	        });
	    },
	    find: function (selector, self) {
	        self = self || this;
	        var rules = [], match,
	            key = selector.toCSS();

	        if (key in this._lookups) { return this._lookups[key]; }

	        this.rulesets().forEach(function (rule) {
	            if (rule !== self) {
	                for (var j = 0; j < rule.selectors.length; j++) {
	                    if (match = selector.match(rule.selectors[j])) {
	                        if (selector.elements.length > rule.selectors[j].elements.length) {
	                            Array.prototype.push.apply(rules, rule.find(
	                                new(tree.Selector)(selector.elements.slice(1)), self));
	                        } else {
	                            rules.push(rule);
	                        }
	                        break;
	                    }
	                }
	            }
	        });
	        return this._lookups[key] = rules;
	    },
	    genCSS: function (env, output) {
	        var i, j,
	            ruleNodes = [],
	            rulesetNodes = [],
	            debugInfo,     // Line number debugging
	            rule,
	            firstRuleset = true,
	            path;

	        env.tabLevel = (env.tabLevel || 0);

	        if (!this.root) {
	            env.tabLevel++;
	        }

	        var tabRuleStr = env.compress ? '' : Array(env.tabLevel + 1).join("  "),
	            tabSetStr = env.compress ? '' : Array(env.tabLevel).join("  ");

	        for (i = 0; i < this.rules.length; i++) {
	            rule = this.rules[i];
	            if (rule.rules || (rule instanceof tree.Media) || rule instanceof tree.Directive || (this.root && rule instanceof tree.Comment)) {
	                rulesetNodes.push(rule);
	            } else {
	                ruleNodes.push(rule);
	            }
	        }

	        // If this is the root node, we don't render
	        // a selector, or {}.
	        if (!this.root) {
	            debugInfo = tree.debugInfo(env, this, tabSetStr);

	            if (debugInfo) {
	                output.add(debugInfo);
	                output.add(tabSetStr);
	            }

	            for(i = 0; i < this.paths.length; i++) {
	                path = this.paths[i];
	                env.firstSelector = true;
	                for(j = 0; j < path.length; j++) {
	                    output.add(path[j].genCSS(env, output));
	                    env.firstSelector = false;
	                }
	                if (i + 1 < this.paths.length) {
	                    output.add(env.compress ? ',' : (',\n' + tabSetStr));
	                }
	            }

	            output.add((env.compress ? '{' : ' {\n') + tabRuleStr);
	        }

	        // Compile rules and rulesets
	        for (i = 0; i < ruleNodes.length; i++) {
	            rule = ruleNodes[i];

	            if (i + 1 === ruleNodes.length) {
	                env.lastRule = true;
	            }

	            if (rule.toCSS) {
	                output.add(rule.genCSS(env, output));
	            } else if (rule.value) {
	                output.add(rule.value.toString());
	            }

	            if (!env.lastRule) {
	                output.add(env.compress ? '' : ('\n' + tabRuleStr));
	            } else {
	                env.lastRule = false;
	            }
	        }

	        if (!this.root) {
	            output.add((env.compress ? '}' : '\n' + tabSetStr + '}'));
	            env.tabLevel--;
	        }

	        for (i = 0; i < rulesetNodes.length; i++) {
	            if (ruleNodes.length && firstRuleset) {
	                output.add("\n" + (this.root ? tabRuleStr : tabSetStr));
	            }
	            if (!firstRuleset) {
	                output.add('\n' + (this.root ? tabRuleStr : tabSetStr));
	            }
	            firstRuleset = false;
	            output.add(rulesetNodes[i].genCSS(env, output));
	        }

	        output.add(!env.compress && this.firstRoot ? '\n' : '');
	    },

	    toCSS: tree.toCSS,

	    markReferenced: function () {
	        for (var s = 0; s < this.selectors.length; s++) {
	            this.selectors[s].markReferenced();
	        }
	    },

	    joinSelectors: function (paths, context, selectors) {
	        for (var s = 0; s < selectors.length; s++) {
	            this.joinSelector(paths, context, selectors[s]);
	        }
	    },

	    joinSelector: function (paths, context, selector) {

	        var i, j, k, 
	            hasParentSelector, newSelectors, el, sel, parentSel, 
	            newSelectorPath, afterParentJoin, newJoinedSelector, 
	            newJoinedSelectorEmpty, lastSelector, currentElements,
	            selectorsMultiplied;
	    
	        for (i = 0; i < selector.elements.length; i++) {
	            el = selector.elements[i];
	            if (el.value === '&') {
	                hasParentSelector = true;
	            }
	        }
	    
	        if (!hasParentSelector) {
	            if (context.length > 0) {
	                for (i = 0; i < context.length; i++) {
	                    paths.push(context[i].concat(selector));
	                }
	            }
	            else {
	                paths.push([selector]);
	            }
	            return;
	        }

	        // The paths are [[Selector]]
	        // The first list is a list of comma seperated selectors
	        // The inner list is a list of inheritance seperated selectors
	        // e.g.
	        // .a, .b {
	        //   .c {
	        //   }
	        // }
	        // == [[.a] [.c]] [[.b] [.c]]
	        //

	        // the elements from the current selector so far
	        currentElements = [];
	        // the current list of new selectors to add to the path.
	        // We will build it up. We initiate it with one empty selector as we "multiply" the new selectors
	        // by the parents
	        newSelectors = [[]];

	        for (i = 0; i < selector.elements.length; i++) {
	            el = selector.elements[i];
	            // non parent reference elements just get added
	            if (el.value !== "&") {
	                currentElements.push(el);
	            } else {
	                // the new list of selectors to add
	                selectorsMultiplied = [];

	                // merge the current list of non parent selector elements
	                // on to the current list of selectors to add
	                if (currentElements.length > 0) {
	                    this.mergeElementsOnToSelectors(currentElements, newSelectors);
	                }

	                // loop through our current selectors
	                for (j = 0; j < newSelectors.length; j++) {
	                    sel = newSelectors[j];
	                    // if we don't have any parent paths, the & might be in a mixin so that it can be used
	                    // whether there are parents or not
	                    if (context.length === 0) {
	                        // the combinator used on el should now be applied to the next element instead so that
	                        // it is not lost
	                        if (sel.length > 0) {
	                            sel[0].elements = sel[0].elements.slice(0);
	                            sel[0].elements.push(new(tree.Element)(el.combinator, '', 0, el.index, el.currentFileInfo));
	                        }
	                        selectorsMultiplied.push(sel);
	                    }
	                    else {
	                        // and the parent selectors
	                        for (k = 0; k < context.length; k++) {
	                            parentSel = context[k];
	                            // We need to put the current selectors
	                            // then join the last selector's elements on to the parents selectors

	                            // our new selector path
	                            newSelectorPath = [];
	                            // selectors from the parent after the join
	                            afterParentJoin = [];
	                            newJoinedSelectorEmpty = true;

	                            //construct the joined selector - if & is the first thing this will be empty,
	                            // if not newJoinedSelector will be the last set of elements in the selector
	                            if (sel.length > 0) {
	                                newSelectorPath = sel.slice(0);
	                                lastSelector = newSelectorPath.pop();
	                                newJoinedSelector = selector.createDerived(lastSelector.elements.slice(0));
	                                newJoinedSelectorEmpty = false;
	                            }
	                            else {
	                                newJoinedSelector = selector.createDerived([]);
	                            }

	                            //put together the parent selectors after the join
	                            if (parentSel.length > 1) {
	                                afterParentJoin = afterParentJoin.concat(parentSel.slice(1));
	                            }

	                            if (parentSel.length > 0) {
	                                newJoinedSelectorEmpty = false;

	                                // join the elements so far with the first part of the parent
	                                newJoinedSelector.elements.push(new(tree.Element)(el.combinator, parentSel[0].elements[0].value, el.index, el.currentFileInfo));
	                                newJoinedSelector.elements = newJoinedSelector.elements.concat(parentSel[0].elements.slice(1));
	                            }

	                            if (!newJoinedSelectorEmpty) {
	                                // now add the joined selector
	                                newSelectorPath.push(newJoinedSelector);
	                            }

	                            // and the rest of the parent
	                            newSelectorPath = newSelectorPath.concat(afterParentJoin);

	                            // add that to our new set of selectors
	                            selectorsMultiplied.push(newSelectorPath);
	                        }
	                    }
	                }

	                // our new selectors has been multiplied, so reset the state
	                newSelectors = selectorsMultiplied;
	                currentElements = [];
	            }
	        }

	        // if we have any elements left over (e.g. .a& .b == .b)
	        // add them on to all the current selectors
	        if (currentElements.length > 0) {
	            this.mergeElementsOnToSelectors(currentElements, newSelectors);
	        }

	        for (i = 0; i < newSelectors.length; i++) {
	            if (newSelectors[i].length > 0) {
	                paths.push(newSelectors[i]);
	            }
	        }
	    },
	    
	    mergeElementsOnToSelectors: function(elements, selectors) {
	        var i, sel;

	        if (selectors.length === 0) {
	            selectors.push([ new(tree.Selector)(elements) ]);
	            return;
	        }

	        for (i = 0; i < selectors.length; i++) {
	            sel = selectors[i];

	            // if the previous thing in sel is a parent this needs to join on to it
	            if (sel.length > 0) {
	                sel[sel.length - 1] = sel[sel.length - 1].createDerived(sel[sel.length - 1].elements.concat(elements));
	            }
	            else {
	                sel.push(new(tree.Selector)(elements));
	            }
	        }
	    }
	};
	})(require(4));


/***/ },

/***/ 44:
/***/ function(module, exports, require) {

	(function (tree) {

	tree.Selector = function (elements, extendList, condition, index, currentFileInfo, isReferenced) {
	    this.elements = elements;
	    this.extendList = extendList || [];
	    this.condition = condition;
	    this.currentFileInfo = currentFileInfo || {};
	    this.isReferenced = isReferenced;
	    if (!condition) {
	        this.evaldCondition = true;
	    }
	};
	tree.Selector.prototype = {
	    type: "Selector",
	    accept: function (visitor) {
	        this.elements = visitor.visit(this.elements);
	        this.extendList = visitor.visit(this.extendList);
	        this.condition = visitor.visit(this.condition);
	    },
	    createDerived: function(elements, extendList, evaldCondition) {
	        /*jshint eqnull:true */
	        evaldCondition = evaldCondition != null ? evaldCondition : this.evaldCondition;
	        var newSelector = new(tree.Selector)(elements, extendList || this.extendList, this.condition, this.index, this.currentFileInfo, this.isReferenced);
	        newSelector.evaldCondition = evaldCondition;
	        return newSelector;
	    },
	    match: function (other) {
	        var elements = this.elements,
	            len = elements.length,
	            oelements, olen, max, i;

	        oelements = other.elements.slice(
	            (other.elements.length && other.elements[0].value === "&") ? 1 : 0);
	        olen = oelements.length;
	        max = Math.min(len, olen);

	        if (olen === 0 || len < olen) {
	            return false;
	        } else {
	            for (i = 0; i < max; i++) {
	                if (elements[i].value !== oelements[i].value) {
	                    return false;
	                }
	            }
	        }
	        return true;
	    },
	    eval: function (env) {
	        var evaldCondition = this.condition && this.condition.eval(env);

	        return this.createDerived(this.elements.map(function (e) {
	            return e.eval(env);
	        }), this.extendList.map(function(extend) {
	            return extend.eval(env);
	        }), evaldCondition);
	    },
	    genCSS: function (env, output) {
	        var i, element;
	        if ((!env || !env.firstSelector) && this.elements[0].combinator.value === "") {
	            output.add(' ', this.currentFileInfo, this.index);
	        }
	        if (!this._css) {
	            //TODO caching? speed comparison?
	            for(i = 0; i < this.elements.length; i++) {
	                element = this.elements[i];
	                element.genCSS(env, output);
	            }
	        }
	    },
	    toCSS: tree.toCSS,
	    markReferenced: function () {
	        this.isReferenced = true;
	    },
	    getIsReferenced: function() {
	        return !this.currentFileInfo.reference || this.isReferenced;
	    },
	    getIsOutput: function() {
	        return this.evaldCondition;
	    }
	};

	})(require(4));


/***/ },

/***/ 45:
/***/ function(module, exports, require) {

	(function (tree) {

	tree.UnicodeDescriptor = function (value) {
	    this.value = value;
	};
	tree.UnicodeDescriptor.prototype = {
	    type: "UnicodeDescriptor",
	    genCSS: function (env, output) {
	        output.add(this.value);
	    },
	    toCSS: tree.toCSS,
	    eval: function () { return this; }
	};

	})(require(4));


/***/ },

/***/ 46:
/***/ function(module, exports, require) {

	(function (tree) {

	tree.URL = function (val, currentFileInfo) {
	    this.value = val;
	    this.currentFileInfo = currentFileInfo;
	};
	tree.URL.prototype = {
	    type: "Url",
	    accept: function (visitor) {
	        this.value = visitor.visit(this.value);
	    },
	    genCSS: function (env, output) {
	        output.add("url(");
	        this.value.genCSS(env, output);
	        output.add(")");
	    },
	    toCSS: tree.toCSS,
	    eval: function (ctx) {
	        var val = this.value.eval(ctx), rootpath;

	        // Add the base path if the URL is relative
	        rootpath = this.currentFileInfo && this.currentFileInfo.rootpath;
	        if (rootpath && typeof val.value === "string" && ctx.isPathRelative(val.value)) {
	            if (!val.quote) {
	                rootpath = rootpath.replace(/[\(\)'"\s]/g, function(match) { return "\\"+match; });
	            }
	            val.value = rootpath + val.value;
	        }

	        return new(tree.URL)(val, null);
	    }
	};

	})(require(4));


/***/ },

/***/ 47:
/***/ function(module, exports, require) {

	(function (tree) {

	tree.Value = function (value) {
	    this.value = value;
	};
	tree.Value.prototype = {
	    type: "Value",
	    accept: function (visitor) {
	        this.value = visitor.visit(this.value);
	    },
	    eval: function (env) {
	        if (this.value.length === 1) {
	            return this.value[0].eval(env);
	        } else {
	            return new(tree.Value)(this.value.map(function (v) {
	                return v.eval(env);
	            }));
	        }
	    },
	    genCSS: function (env, output) {
	        var i;
	        for(i = 0; i < this.value.length; i++) {
	            this.value[i].genCSS(env, output);
	            if (i+1 < this.value.length) {
	                output.add((env && env.compress) ? ',' : ', ');
	            }
	        }
	    },
	    toCSS: tree.toCSS
	};

	})(require(4));


/***/ },

/***/ 48:
/***/ function(module, exports, require) {

	(function (tree) {

	tree.Variable = function (name, index, currentFileInfo) {
	    this.name = name;
	    this.index = index;
	    this.currentFileInfo = currentFileInfo;
	};
	tree.Variable.prototype = {
	    type: "Variable",
	    eval: function (env) {
	        var variable, v, name = this.name;

	        if (name.indexOf('@@') === 0) {
	            name = '@' + new(tree.Variable)(name.slice(1)).eval(env).value;
	        }
	        
	        if (this.evaluating) {
	            throw { type: 'Name',
	                    message: "Recursive variable definition for " + name,
	                    filename: this.currentFileInfo.file,
	                    index: this.index };
	        }
	        
	        this.evaluating = true;

	        if (variable = tree.find(env.frames, function (frame) {
	            if (v = frame.variable(name)) {
	                return v.value.eval(env);
	            }
	        })) { 
	            this.evaluating = false;
	            return variable;
	        }
	        else {
	            throw { type: 'Name',
	                    message: "variable " + name + " is undefined",
	                    filename: this.currentFileInfo.filename,
	                    index: this.index };
	        }
	    }
	};

	})(require(4));


/***/ },

/***/ 49:
/***/ function(module, exports, require) {

	/* WEBPACK VAR INJECTION */(function(require, process) {// Copyright 2010-2012 Mikeal Rogers
	//
	//    Licensed under the Apache License, Version 2.0 (the "License");
	//    you may not use this file except in compliance with the License.
	//    You may obtain a copy of the License at
	//
	//        http://www.apache.org/licenses/LICENSE-2.0
	//
	//    Unless required by applicable law or agreed to in writing, software
	//    distributed under the License is distributed on an "AS IS" BASIS,
	//    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	//    See the License for the specific language governing permissions and
	//    limitations under the License.

	var Cookie = require(69)
	  , CookieJar = Cookie.Jar
	  , cookieJar = new CookieJar

	  , copy = require(62)
	  , Request = require(63)
	  ;



	// organize params for patch, post, put, head, del
	function initParams(uri, options, callback) {
	  if ((typeof options === 'function') && !callback) callback = options
	  if (options && typeof options === 'object') {
	    options.uri = uri
	  } else if (typeof uri === 'string') {
	    options = {uri:uri}
	  } else {
	    options = uri
	    uri = options.uri
	  }
	  return { uri: uri, options: options, callback: callback }
	}

	function request (uri, options, callback) {
	  if (typeof uri === 'undefined') throw new Error('undefined is not a valid uri or options object.')
	  if ((typeof options === 'function') && !callback) callback = options
	  if (options && typeof options === 'object') {
	    options.uri = uri
	  } else if (typeof uri === 'string') {
	    options = {uri:uri}
	  } else {
	    options = uri
	  }

	  options = copy(options)

	  if (callback) options.callback = callback
	  var r = new Request(options)
	  return r
	}

	module.exports = request

	request.Request = Request;

	request.debug = process.env.NODE_DEBUG && /request/.test(process.env.NODE_DEBUG)

	request.initParams = initParams

	request.defaults = function (options, requester) {
	  var def = function (method) {
	    var d = function (uri, opts, callback) {
	      var params = initParams(uri, opts, callback)
	      for (var i in options) {
	        if (params.options[i] === undefined) params.options[i] = options[i]
	      }
	      if(typeof requester === 'function') {
	        if(method === request) {
	          method = requester
	        } else {
	          params.options._requester = requester
	        }
	      }
	      return method(params.options, params.callback)
	    }
	    return d
	  }
	  var de = def(request)
	  de.get = def(request.get)
	  de.patch = def(request.patch)
	  de.post = def(request.post)
	  de.put = def(request.put)
	  de.head = def(request.head)
	  de.del = def(request.del)
	  de.cookie = def(request.cookie)
	  de.jar = request.jar
	  return de
	}

	request.forever = function (agentOptions, optionsArg) {
	  var options = {}
	  if (optionsArg) {
	    for (option in optionsArg) {
	      options[option] = optionsArg[option]
	    }
	  }
	  if (agentOptions) options.agentOptions = agentOptions
	  options.forever = true
	  return request.defaults(options)
	}

	request.get = request
	request.post = function (uri, options, callback) {
	  var params = initParams(uri, options, callback)
	  params.options.method = 'POST'
	  return request(params.uri || null, params.options, params.callback)
	}
	request.put = function (uri, options, callback) {
	  var params = initParams(uri, options, callback)
	  params.options.method = 'PUT'
	  return request(params.uri || null, params.options, params.callback)
	}
	request.patch = function (uri, options, callback) {
	  var params = initParams(uri, options, callback)
	  params.options.method = 'PATCH'
	  return request(params.uri || null, params.options, params.callback)
	}
	request.head = function (uri, options, callback) {
	  var params = initParams(uri, options, callback)
	  params.options.method = 'HEAD'
	  if (params.options.body ||
	      params.options.requestBodyStream ||
	      (params.options.json && typeof params.options.json !== 'boolean') ||
	      params.options.multipart) {
	    throw new Error("HTTP HEAD requests MUST NOT include a request body.")
	  }
	  return request(params.uri || null, params.options, params.callback)
	}
	request.del = function (uri, options, callback) {
	  var params = initParams(uri, options, callback)
	  params.options.method = 'DELETE'
	  if(typeof params.options._requester === 'function') {
	    request = params.options._requester
	  }
	  return request(params.uri || null, params.options, params.callback)
	}
	request.jar = function () {
	  return new CookieJar
	}
	request.cookie = function (str) {
	  if (str && str.uri) str = str.uri
	  if (typeof str !== 'string') throw new Error("The cookie function only accepts STRING as param")
	  return new Cookie(str)
	}
	
	/* WEBPACK VAR INJECTION */}.call(exports, require, require(15)))

/***/ },

/***/ 50:
/***/ function(module, exports, require) {

	/* WEBPACK VAR INJECTION */(function(require, Buffer) {function SlowBuffer (size) {
	    this.length = size;
	};

	var assert = require(67);

	exports.INSPECT_MAX_BYTES = 50;


	function toHex(n) {
	  if (n < 16) return '0' + n.toString(16);
	  return n.toString(16);
	}

	function utf8ToBytes(str) {
	  var byteArray = [];
	  for (var i = 0; i < str.length; i++)
	    if (str.charCodeAt(i) <= 0x7F)
	      byteArray.push(str.charCodeAt(i));
	    else {
	      var h = encodeURIComponent(str.charAt(i)).substr(1).split('%');
	      for (var j = 0; j < h.length; j++)
	        byteArray.push(parseInt(h[j], 16));
	    }

	  return byteArray;
	}

	function asciiToBytes(str) {
	  var byteArray = []
	  for (var i = 0; i < str.length; i++ )
	    // Node's code seems to be doing this and not & 0x7F..
	    byteArray.push( str.charCodeAt(i) & 0xFF );

	  return byteArray;
	}

	function base64ToBytes(str) {
	  return require(80).toByteArray(str);
	}

	SlowBuffer.byteLength = function (str, encoding) {
	  switch (encoding || "utf8") {
	    case 'hex':
	      return str.length / 2;

	    case 'utf8':
	    case 'utf-8':
	      return utf8ToBytes(str).length;

	    case 'ascii':
	      return str.length;

	    case 'base64':
	      return base64ToBytes(str).length;

	    default:
	      throw new Error('Unknown encoding');
	  }
	};

	function blitBuffer(src, dst, offset, length) {
	  var pos, i = 0;
	  while (i < length) {
	    if ((i+offset >= dst.length) || (i >= src.length))
	      break;

	    dst[i + offset] = src[i];
	    i++;
	  }
	  return i;
	}

	SlowBuffer.prototype.utf8Write = function (string, offset, length) {
	  var bytes, pos;
	  return SlowBuffer._charsWritten =  blitBuffer(utf8ToBytes(string), this, offset, length);
	};

	SlowBuffer.prototype.asciiWrite = function (string, offset, length) {
	  var bytes, pos;
	  return SlowBuffer._charsWritten =  blitBuffer(asciiToBytes(string), this, offset, length);
	};

	SlowBuffer.prototype.base64Write = function (string, offset, length) {
	  var bytes, pos;
	  return SlowBuffer._charsWritten = blitBuffer(base64ToBytes(string), this, offset, length);
	};

	SlowBuffer.prototype.base64Slice = function (start, end) {
	  var bytes = Array.prototype.slice.apply(this, arguments)
	  return require(80).fromByteArray(bytes);
	}

	function decodeUtf8Char(str) {
	  try {
	    return decodeURIComponent(str);
	  } catch (err) {
	    return String.fromCharCode(0xFFFD); // UTF 8 invalid char
	  }
	}

	SlowBuffer.prototype.utf8Slice = function () {
	  var bytes = Array.prototype.slice.apply(this, arguments);
	  var res = "";
	  var tmp = "";
	  var i = 0;
	  while (i < bytes.length) {
	    if (bytes[i] <= 0x7F) {
	      res += decodeUtf8Char(tmp) + String.fromCharCode(bytes[i]);
	      tmp = "";
	    } else
	      tmp += "%" + bytes[i].toString(16);

	    i++;
	  }

	  return res + decodeUtf8Char(tmp);
	}

	SlowBuffer.prototype.asciiSlice = function () {
	  var bytes = Array.prototype.slice.apply(this, arguments);
	  var ret = "";
	  for (var i = 0; i < bytes.length; i++)
	    ret += String.fromCharCode(bytes[i]);
	  return ret;
	}

	SlowBuffer.prototype.inspect = function() {
	  var out = [],
	      len = this.length;
	  for (var i = 0; i < len; i++) {
	    out[i] = toHex(this[i]);
	    if (i == exports.INSPECT_MAX_BYTES) {
	      out[i + 1] = '...';
	      break;
	    }
	  }
	  return '<SlowBuffer ' + out.join(' ') + '>';
	};


	SlowBuffer.prototype.hexSlice = function(start, end) {
	  var len = this.length;

	  if (!start || start < 0) start = 0;
	  if (!end || end < 0 || end > len) end = len;

	  var out = '';
	  for (var i = start; i < end; i++) {
	    out += toHex(this[i]);
	  }
	  return out;
	};


	SlowBuffer.prototype.toString = function(encoding, start, end) {
	  encoding = String(encoding || 'utf8').toLowerCase();
	  start = +start || 0;
	  if (typeof end == 'undefined') end = this.length;

	  // Fastpath empty strings
	  if (+end == start) {
	    return '';
	  }

	  switch (encoding) {
	    case 'hex':
	      return this.hexSlice(start, end);

	    case 'utf8':
	    case 'utf-8':
	      return this.utf8Slice(start, end);

	    case 'ascii':
	      return this.asciiSlice(start, end);

	    case 'binary':
	      return this.binarySlice(start, end);

	    case 'base64':
	      return this.base64Slice(start, end);

	    case 'ucs2':
	    case 'ucs-2':
	      return this.ucs2Slice(start, end);

	    default:
	      throw new Error('Unknown encoding');
	  }
	};


	SlowBuffer.prototype.hexWrite = function(string, offset, length) {
	  offset = +offset || 0;
	  var remaining = this.length - offset;
	  if (!length) {
	    length = remaining;
	  } else {
	    length = +length;
	    if (length > remaining) {
	      length = remaining;
	    }
	  }

	  // must be an even number of digits
	  var strLen = string.length;
	  if (strLen % 2) {
	    throw new Error('Invalid hex string');
	  }
	  if (length > strLen / 2) {
	    length = strLen / 2;
	  }
	  for (var i = 0; i < length; i++) {
	    var byte = parseInt(string.substr(i * 2, 2), 16);
	    if (isNaN(byte)) throw new Error('Invalid hex string');
	    this[offset + i] = byte;
	  }
	  SlowBuffer._charsWritten = i * 2;
	  return i;
	};


	SlowBuffer.prototype.write = function(string, offset, length, encoding) {
	  // Support both (string, offset, length, encoding)
	  // and the legacy (string, encoding, offset, length)
	  if (isFinite(offset)) {
	    if (!isFinite(length)) {
	      encoding = length;
	      length = undefined;
	    }
	  } else {  // legacy
	    var swap = encoding;
	    encoding = offset;
	    offset = length;
	    length = swap;
	  }

	  offset = +offset || 0;
	  var remaining = this.length - offset;
	  if (!length) {
	    length = remaining;
	  } else {
	    length = +length;
	    if (length > remaining) {
	      length = remaining;
	    }
	  }
	  encoding = String(encoding || 'utf8').toLowerCase();

	  switch (encoding) {
	    case 'hex':
	      return this.hexWrite(string, offset, length);

	    case 'utf8':
	    case 'utf-8':
	      return this.utf8Write(string, offset, length);

	    case 'ascii':
	      return this.asciiWrite(string, offset, length);

	    case 'binary':
	      return this.binaryWrite(string, offset, length);

	    case 'base64':
	      return this.base64Write(string, offset, length);

	    case 'ucs2':
	    case 'ucs-2':
	      return this.ucs2Write(string, offset, length);

	    default:
	      throw new Error('Unknown encoding');
	  }
	};


	// slice(start, end)
	SlowBuffer.prototype.slice = function(start, end) {
	  if (end === undefined) end = this.length;

	  if (end > this.length) {
	    throw new Error('oob');
	  }
	  if (start > end) {
	    throw new Error('oob');
	  }

	  return new Buffer(this, end - start, +start);
	};

	SlowBuffer.prototype.copy = function(target, targetstart, sourcestart, sourceend) {
	  var temp = [];
	  for (var i=sourcestart; i<sourceend; i++) {
	    assert.ok(typeof this[i] !== 'undefined', "copying undefined buffer bytes!");
	    temp.push(this[i]);
	  }

	  for (var i=targetstart; i<targetstart+temp.length; i++) {
	    target[i] = temp[i-targetstart];
	  }
	};

	function coerce(length) {
	  // Coerce length to a number (possibly NaN), round up
	  // in case it's fractional (e.g. 123.456) then do a
	  // double negate to coerce a NaN to 0. Easy, right?
	  length = ~~Math.ceil(+length);
	  return length < 0 ? 0 : length;
	}


	// Buffer

	function Buffer(subject, encoding, offset) {
	  if (!(this instanceof Buffer)) {
	    return new Buffer(subject, encoding, offset);
	  }

	  var type;

	  // Are we slicing?
	  if (typeof offset === 'number') {
	    this.length = coerce(encoding);
	    this.parent = subject;
	    this.offset = offset;
	  } else {
	    // Find the length
	    switch (type = typeof subject) {
	      case 'number':
	        this.length = coerce(subject);
	        break;

	      case 'string':
	        this.length = Buffer.byteLength(subject, encoding);
	        break;

	      case 'object': // Assume object is an array
	        this.length = coerce(subject.length);
	        break;

	      default:
	        throw new Error('First argument needs to be a number, ' +
	                        'array or string.');
	    }

	    if (this.length > Buffer.poolSize) {
	      // Big buffer, just alloc one.
	      this.parent = new SlowBuffer(this.length);
	      this.offset = 0;

	    } else {
	      // Small buffer.
	      if (!pool || pool.length - pool.used < this.length) allocPool();
	      this.parent = pool;
	      this.offset = pool.used;
	      pool.used += this.length;
	    }

	    // Treat array-ish objects as a byte array.
	    if (isArrayIsh(subject)) {
	      for (var i = 0; i < this.length; i++) {
	        this.parent[i + this.offset] = subject[i];
	      }
	    } else if (type == 'string') {
	      // We are a string
	      this.length = this.write(subject, 0, encoding);
	    }
	  }

	}

	function isArrayIsh(subject) {
	  return Array.isArray(subject) || Buffer.isBuffer(subject) ||
	         subject && typeof subject === 'object' &&
	         typeof subject.length === 'number';
	}

	exports.SlowBuffer = SlowBuffer;
	exports.Buffer = Buffer;

	Buffer.poolSize = 8 * 1024;
	var pool;

	function allocPool() {
	  pool = new SlowBuffer(Buffer.poolSize);
	  pool.used = 0;
	}


	// Static methods
	Buffer.isBuffer = function isBuffer(b) {
	  return b instanceof Buffer || b instanceof SlowBuffer;
	};

	Buffer.concat = function (list, totalLength) {
	  if (!Array.isArray(list)) {
	    throw new Error("Usage: Buffer.concat(list, [totalLength])\n \
	      list should be an Array.");
	  }

	  if (list.length === 0) {
	    return new Buffer(0);
	  } else if (list.length === 1) {
	    return list[0];
	  }

	  if (typeof totalLength !== 'number') {
	    totalLength = 0;
	    for (var i = 0; i < list.length; i++) {
	      var buf = list[i];
	      totalLength += buf.length;
	    }
	  }

	  var buffer = new Buffer(totalLength);
	  var pos = 0;
	  for (var i = 0; i < list.length; i++) {
	    var buf = list[i];
	    buf.copy(buffer, pos);
	    pos += buf.length;
	  }
	  return buffer;
	};

	// Inspect
	Buffer.prototype.inspect = function inspect() {
	  var out = [],
	      len = this.length;

	  for (var i = 0; i < len; i++) {
	    out[i] = toHex(this.parent[i + this.offset]);
	    if (i == exports.INSPECT_MAX_BYTES) {
	      out[i + 1] = '...';
	      break;
	    }
	  }

	  return '<Buffer ' + out.join(' ') + '>';
	};


	Buffer.prototype.get = function get(i) {
	  if (i < 0 || i >= this.length) throw new Error('oob');
	  return this.parent[this.offset + i];
	};


	Buffer.prototype.set = function set(i, v) {
	  if (i < 0 || i >= this.length) throw new Error('oob');
	  return this.parent[this.offset + i] = v;
	};


	// write(string, offset = 0, length = buffer.length-offset, encoding = 'utf8')
	Buffer.prototype.write = function(string, offset, length, encoding) {
	  // Support both (string, offset, length, encoding)
	  // and the legacy (string, encoding, offset, length)
	  if (isFinite(offset)) {
	    if (!isFinite(length)) {
	      encoding = length;
	      length = undefined;
	    }
	  } else {  // legacy
	    var swap = encoding;
	    encoding = offset;
	    offset = length;
	    length = swap;
	  }

	  offset = +offset || 0;
	  var remaining = this.length - offset;
	  if (!length) {
	    length = remaining;
	  } else {
	    length = +length;
	    if (length > remaining) {
	      length = remaining;
	    }
	  }
	  encoding = String(encoding || 'utf8').toLowerCase();

	  var ret;
	  switch (encoding) {
	    case 'hex':
	      ret = this.parent.hexWrite(string, this.offset + offset, length);
	      break;

	    case 'utf8':
	    case 'utf-8':
	      ret = this.parent.utf8Write(string, this.offset + offset, length);
	      break;

	    case 'ascii':
	      ret = this.parent.asciiWrite(string, this.offset + offset, length);
	      break;

	    case 'binary':
	      ret = this.parent.binaryWrite(string, this.offset + offset, length);
	      break;

	    case 'base64':
	      // Warning: maxLength not taken into account in base64Write
	      ret = this.parent.base64Write(string, this.offset + offset, length);
	      break;

	    case 'ucs2':
	    case 'ucs-2':
	      ret = this.parent.ucs2Write(string, this.offset + offset, length);
	      break;

	    default:
	      throw new Error('Unknown encoding');
	  }

	  Buffer._charsWritten = SlowBuffer._charsWritten;

	  return ret;
	};


	// toString(encoding, start=0, end=buffer.length)
	Buffer.prototype.toString = function(encoding, start, end) {
	  encoding = String(encoding || 'utf8').toLowerCase();

	  if (typeof start == 'undefined' || start < 0) {
	    start = 0;
	  } else if (start > this.length) {
	    start = this.length;
	  }

	  if (typeof end == 'undefined' || end > this.length) {
	    end = this.length;
	  } else if (end < 0) {
	    end = 0;
	  }

	  start = start + this.offset;
	  end = end + this.offset;

	  switch (encoding) {
	    case 'hex':
	      return this.parent.hexSlice(start, end);

	    case 'utf8':
	    case 'utf-8':
	      return this.parent.utf8Slice(start, end);

	    case 'ascii':
	      return this.parent.asciiSlice(start, end);

	    case 'binary':
	      return this.parent.binarySlice(start, end);

	    case 'base64':
	      return this.parent.base64Slice(start, end);

	    case 'ucs2':
	    case 'ucs-2':
	      return this.parent.ucs2Slice(start, end);

	    default:
	      throw new Error('Unknown encoding');
	  }
	};


	// byteLength
	Buffer.byteLength = SlowBuffer.byteLength;


	// fill(value, start=0, end=buffer.length)
	Buffer.prototype.fill = function fill(value, start, end) {
	  value || (value = 0);
	  start || (start = 0);
	  end || (end = this.length);

	  if (typeof value === 'string') {
	    value = value.charCodeAt(0);
	  }
	  if (!(typeof value === 'number') || isNaN(value)) {
	    throw new Error('value is not a number');
	  }

	  if (end < start) throw new Error('end < start');

	  // Fill 0 bytes; we're done
	  if (end === start) return 0;
	  if (this.length == 0) return 0;

	  if (start < 0 || start >= this.length) {
	    throw new Error('start out of bounds');
	  }

	  if (end < 0 || end > this.length) {
	    throw new Error('end out of bounds');
	  }

	  return this.parent.fill(value,
	                          start + this.offset,
	                          end + this.offset);
	};


	// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
	Buffer.prototype.copy = function(target, target_start, start, end) {
	  var source = this;
	  start || (start = 0);
	  end || (end = this.length);
	  target_start || (target_start = 0);

	  if (end < start) throw new Error('sourceEnd < sourceStart');

	  // Copy 0 bytes; we're done
	  if (end === start) return 0;
	  if (target.length == 0 || source.length == 0) return 0;

	  if (target_start < 0 || target_start >= target.length) {
	    throw new Error('targetStart out of bounds');
	  }

	  if (start < 0 || start >= source.length) {
	    throw new Error('sourceStart out of bounds');
	  }

	  if (end < 0 || end > source.length) {
	    throw new Error('sourceEnd out of bounds');
	  }

	  // Are we oob?
	  if (end > this.length) {
	    end = this.length;
	  }

	  if (target.length - target_start < end - start) {
	    end = target.length - target_start + start;
	  }

	  return this.parent.copy(target.parent,
	                          target_start + target.offset,
	                          start + this.offset,
	                          end + this.offset);
	};


	// slice(start, end)
	Buffer.prototype.slice = function(start, end) {
	  if (end === undefined) end = this.length;
	  if (end > this.length) throw new Error('oob');
	  if (start > end) throw new Error('oob');

	  return new Buffer(this.parent, end - start, +start + this.offset);
	};


	// Legacy methods for backwards compatibility.

	Buffer.prototype.utf8Slice = function(start, end) {
	  return this.toString('utf8', start, end);
	};

	Buffer.prototype.binarySlice = function(start, end) {
	  return this.toString('binary', start, end);
	};

	Buffer.prototype.asciiSlice = function(start, end) {
	  return this.toString('ascii', start, end);
	};

	Buffer.prototype.utf8Write = function(string, offset) {
	  return this.write(string, offset, 'utf8');
	};

	Buffer.prototype.binaryWrite = function(string, offset) {
	  return this.write(string, offset, 'binary');
	};

	Buffer.prototype.asciiWrite = function(string, offset) {
	  return this.write(string, offset, 'ascii');
	};

	Buffer.prototype.readUInt8 = function(offset, noAssert) {
	  var buffer = this;

	  if (!noAssert) {
	    assert.ok(offset !== undefined && offset !== null,
	        'missing offset');

	    assert.ok(offset < buffer.length,
	        'Trying to read beyond buffer length');
	  }

	  return buffer.parent[buffer.offset + offset];
	};

	function readUInt16(buffer, offset, isBigEndian, noAssert) {
	  var val = 0;


	  if (!noAssert) {
	    assert.ok(typeof (isBigEndian) === 'boolean',
	        'missing or invalid endian');

	    assert.ok(offset !== undefined && offset !== null,
	        'missing offset');

	    assert.ok(offset + 1 < buffer.length,
	        'Trying to read beyond buffer length');
	  }

	  if (isBigEndian) {
	    val = buffer.parent[buffer.offset + offset] << 8;
	    val |= buffer.parent[buffer.offset + offset + 1];
	  } else {
	    val = buffer.parent[buffer.offset + offset];
	    val |= buffer.parent[buffer.offset + offset + 1] << 8;
	  }

	  return val;
	}

	Buffer.prototype.readUInt16LE = function(offset, noAssert) {
	  return readUInt16(this, offset, false, noAssert);
	};

	Buffer.prototype.readUInt16BE = function(offset, noAssert) {
	  return readUInt16(this, offset, true, noAssert);
	};

	function readUInt32(buffer, offset, isBigEndian, noAssert) {
	  var val = 0;

	  if (!noAssert) {
	    assert.ok(typeof (isBigEndian) === 'boolean',
	        'missing or invalid endian');

	    assert.ok(offset !== undefined && offset !== null,
	        'missing offset');

	    assert.ok(offset + 3 < buffer.length,
	        'Trying to read beyond buffer length');
	  }

	  if (isBigEndian) {
	    val = buffer.parent[buffer.offset + offset + 1] << 16;
	    val |= buffer.parent[buffer.offset + offset + 2] << 8;
	    val |= buffer.parent[buffer.offset + offset + 3];
	    val = val + (buffer.parent[buffer.offset + offset] << 24 >>> 0);
	  } else {
	    val = buffer.parent[buffer.offset + offset + 2] << 16;
	    val |= buffer.parent[buffer.offset + offset + 1] << 8;
	    val |= buffer.parent[buffer.offset + offset];
	    val = val + (buffer.parent[buffer.offset + offset + 3] << 24 >>> 0);
	  }

	  return val;
	}

	Buffer.prototype.readUInt32LE = function(offset, noAssert) {
	  return readUInt32(this, offset, false, noAssert);
	};

	Buffer.prototype.readUInt32BE = function(offset, noAssert) {
	  return readUInt32(this, offset, true, noAssert);
	};


	/*
	 * Signed integer types, yay team! A reminder on how two's complement actually
	 * works. The first bit is the signed bit, i.e. tells us whether or not the
	 * number should be positive or negative. If the two's complement value is
	 * positive, then we're done, as it's equivalent to the unsigned representation.
	 *
	 * Now if the number is positive, you're pretty much done, you can just leverage
	 * the unsigned translations and return those. Unfortunately, negative numbers
	 * aren't quite that straightforward.
	 *
	 * At first glance, one might be inclined to use the traditional formula to
	 * translate binary numbers between the positive and negative values in two's
	 * complement. (Though it doesn't quite work for the most negative value)
	 * Mainly:
	 *  - invert all the bits
	 *  - add one to the result
	 *
	 * Of course, this doesn't quite work in Javascript. Take for example the value
	 * of -128. This could be represented in 16 bits (big-endian) as 0xff80. But of
	 * course, Javascript will do the following:
	 *
	 * > ~0xff80
	 * -65409
	 *
	 * Whoh there, Javascript, that's not quite right. But wait, according to
	 * Javascript that's perfectly correct. When Javascript ends up seeing the
	 * constant 0xff80, it has no notion that it is actually a signed number. It
	 * assumes that we've input the unsigned value 0xff80. Thus, when it does the
	 * binary negation, it casts it into a signed value, (positive 0xff80). Then
	 * when you perform binary negation on that, it turns it into a negative number.
	 *
	 * Instead, we're going to have to use the following general formula, that works
	 * in a rather Javascript friendly way. I'm glad we don't support this kind of
	 * weird numbering scheme in the kernel.
	 *
	 * (BIT-MAX - (unsigned)val + 1) * -1
	 *
	 * The astute observer, may think that this doesn't make sense for 8-bit numbers
	 * (really it isn't necessary for them). However, when you get 16-bit numbers,
	 * you do. Let's go back to our prior example and see how this will look:
	 *
	 * (0xffff - 0xff80 + 1) * -1
	 * (0x007f + 1) * -1
	 * (0x0080) * -1
	 */
	Buffer.prototype.readInt8 = function(offset, noAssert) {
	  var buffer = this;
	  var neg;

	  if (!noAssert) {
	    assert.ok(offset !== undefined && offset !== null,
	        'missing offset');

	    assert.ok(offset < buffer.length,
	        'Trying to read beyond buffer length');
	  }

	  neg = buffer.parent[buffer.offset + offset] & 0x80;
	  if (!neg) {
	    return (buffer.parent[buffer.offset + offset]);
	  }

	  return ((0xff - buffer.parent[buffer.offset + offset] + 1) * -1);
	};

	function readInt16(buffer, offset, isBigEndian, noAssert) {
	  var neg, val;

	  if (!noAssert) {
	    assert.ok(typeof (isBigEndian) === 'boolean',
	        'missing or invalid endian');

	    assert.ok(offset !== undefined && offset !== null,
	        'missing offset');

	    assert.ok(offset + 1 < buffer.length,
	        'Trying to read beyond buffer length');
	  }

	  val = readUInt16(buffer, offset, isBigEndian, noAssert);
	  neg = val & 0x8000;
	  if (!neg) {
	    return val;
	  }

	  return (0xffff - val + 1) * -1;
	}

	Buffer.prototype.readInt16LE = function(offset, noAssert) {
	  return readInt16(this, offset, false, noAssert);
	};

	Buffer.prototype.readInt16BE = function(offset, noAssert) {
	  return readInt16(this, offset, true, noAssert);
	};

	function readInt32(buffer, offset, isBigEndian, noAssert) {
	  var neg, val;

	  if (!noAssert) {
	    assert.ok(typeof (isBigEndian) === 'boolean',
	        'missing or invalid endian');

	    assert.ok(offset !== undefined && offset !== null,
	        'missing offset');

	    assert.ok(offset + 3 < buffer.length,
	        'Trying to read beyond buffer length');
	  }

	  val = readUInt32(buffer, offset, isBigEndian, noAssert);
	  neg = val & 0x80000000;
	  if (!neg) {
	    return (val);
	  }

	  return (0xffffffff - val + 1) * -1;
	}

	Buffer.prototype.readInt32LE = function(offset, noAssert) {
	  return readInt32(this, offset, false, noAssert);
	};

	Buffer.prototype.readInt32BE = function(offset, noAssert) {
	  return readInt32(this, offset, true, noAssert);
	};

	function readFloat(buffer, offset, isBigEndian, noAssert) {
	  if (!noAssert) {
	    assert.ok(typeof (isBigEndian) === 'boolean',
	        'missing or invalid endian');

	    assert.ok(offset + 3 < buffer.length,
	        'Trying to read beyond buffer length');
	  }

	  return require(65).readIEEE754(buffer, offset, isBigEndian,
	      23, 4);
	}

	Buffer.prototype.readFloatLE = function(offset, noAssert) {
	  return readFloat(this, offset, false, noAssert);
	};

	Buffer.prototype.readFloatBE = function(offset, noAssert) {
	  return readFloat(this, offset, true, noAssert);
	};

	function readDouble(buffer, offset, isBigEndian, noAssert) {
	  if (!noAssert) {
	    assert.ok(typeof (isBigEndian) === 'boolean',
	        'missing or invalid endian');

	    assert.ok(offset + 7 < buffer.length,
	        'Trying to read beyond buffer length');
	  }

	  return require(65).readIEEE754(buffer, offset, isBigEndian,
	      52, 8);
	}

	Buffer.prototype.readDoubleLE = function(offset, noAssert) {
	  return readDouble(this, offset, false, noAssert);
	};

	Buffer.prototype.readDoubleBE = function(offset, noAssert) {
	  return readDouble(this, offset, true, noAssert);
	};


	/*
	 * We have to make sure that the value is a valid integer. This means that it is
	 * non-negative. It has no fractional component and that it does not exceed the
	 * maximum allowed value.
	 *
	 *      value           The number to check for validity
	 *
	 *      max             The maximum value
	 */
	function verifuint(value, max) {
	  assert.ok(typeof (value) == 'number',
	      'cannot write a non-number as a number');

	  assert.ok(value >= 0,
	      'specified a negative value for writing an unsigned value');

	  assert.ok(value <= max, 'value is larger than maximum value for type');

	  assert.ok(Math.floor(value) === value, 'value has a fractional component');
	}

	Buffer.prototype.writeUInt8 = function(value, offset, noAssert) {
	  var buffer = this;

	  if (!noAssert) {
	    assert.ok(value !== undefined && value !== null,
	        'missing value');

	    assert.ok(offset !== undefined && offset !== null,
	        'missing offset');

	    assert.ok(offset < buffer.length,
	        'trying to write beyond buffer length');

	    verifuint(value, 0xff);
	  }

	  buffer.parent[buffer.offset + offset] = value;
	};

	function writeUInt16(buffer, value, offset, isBigEndian, noAssert) {
	  if (!noAssert) {
	    assert.ok(value !== undefined && value !== null,
	        'missing value');

	    assert.ok(typeof (isBigEndian) === 'boolean',
	        'missing or invalid endian');

	    assert.ok(offset !== undefined && offset !== null,
	        'missing offset');

	    assert.ok(offset + 1 < buffer.length,
	        'trying to write beyond buffer length');

	    verifuint(value, 0xffff);
	  }

	  if (isBigEndian) {
	    buffer.parent[buffer.offset + offset] = (value & 0xff00) >>> 8;
	    buffer.parent[buffer.offset + offset + 1] = value & 0x00ff;
	  } else {
	    buffer.parent[buffer.offset + offset + 1] = (value & 0xff00) >>> 8;
	    buffer.parent[buffer.offset + offset] = value & 0x00ff;
	  }
	}

	Buffer.prototype.writeUInt16LE = function(value, offset, noAssert) {
	  writeUInt16(this, value, offset, false, noAssert);
	};

	Buffer.prototype.writeUInt16BE = function(value, offset, noAssert) {
	  writeUInt16(this, value, offset, true, noAssert);
	};

	function writeUInt32(buffer, value, offset, isBigEndian, noAssert) {
	  if (!noAssert) {
	    assert.ok(value !== undefined && value !== null,
	        'missing value');

	    assert.ok(typeof (isBigEndian) === 'boolean',
	        'missing or invalid endian');

	    assert.ok(offset !== undefined && offset !== null,
	        'missing offset');

	    assert.ok(offset + 3 < buffer.length,
	        'trying to write beyond buffer length');

	    verifuint(value, 0xffffffff);
	  }

	  if (isBigEndian) {
	    buffer.parent[buffer.offset + offset] = (value >>> 24) & 0xff;
	    buffer.parent[buffer.offset + offset + 1] = (value >>> 16) & 0xff;
	    buffer.parent[buffer.offset + offset + 2] = (value >>> 8) & 0xff;
	    buffer.parent[buffer.offset + offset + 3] = value & 0xff;
	  } else {
	    buffer.parent[buffer.offset + offset + 3] = (value >>> 24) & 0xff;
	    buffer.parent[buffer.offset + offset + 2] = (value >>> 16) & 0xff;
	    buffer.parent[buffer.offset + offset + 1] = (value >>> 8) & 0xff;
	    buffer.parent[buffer.offset + offset] = value & 0xff;
	  }
	}

	Buffer.prototype.writeUInt32LE = function(value, offset, noAssert) {
	  writeUInt32(this, value, offset, false, noAssert);
	};

	Buffer.prototype.writeUInt32BE = function(value, offset, noAssert) {
	  writeUInt32(this, value, offset, true, noAssert);
	};


	/*
	 * We now move onto our friends in the signed number category. Unlike unsigned
	 * numbers, we're going to have to worry a bit more about how we put values into
	 * arrays. Since we are only worrying about signed 32-bit values, we're in
	 * slightly better shape. Unfortunately, we really can't do our favorite binary
	 * & in this system. It really seems to do the wrong thing. For example:
	 *
	 * > -32 & 0xff
	 * 224
	 *
	 * What's happening above is really: 0xe0 & 0xff = 0xe0. However, the results of
	 * this aren't treated as a signed number. Ultimately a bad thing.
	 *
	 * What we're going to want to do is basically create the unsigned equivalent of
	 * our representation and pass that off to the wuint* functions. To do that
	 * we're going to do the following:
	 *
	 *  - if the value is positive
	 *      we can pass it directly off to the equivalent wuint
	 *  - if the value is negative
	 *      we do the following computation:
	 *         mb + val + 1, where
	 *         mb   is the maximum unsigned value in that byte size
	 *         val  is the Javascript negative integer
	 *
	 *
	 * As a concrete value, take -128. In signed 16 bits this would be 0xff80. If
	 * you do out the computations:
	 *
	 * 0xffff - 128 + 1
	 * 0xffff - 127
	 * 0xff80
	 *
	 * You can then encode this value as the signed version. This is really rather
	 * hacky, but it should work and get the job done which is our goal here.
	 */

	/*
	 * A series of checks to make sure we actually have a signed 32-bit number
	 */
	function verifsint(value, max, min) {
	  assert.ok(typeof (value) == 'number',
	      'cannot write a non-number as a number');

	  assert.ok(value <= max, 'value larger than maximum allowed value');

	  assert.ok(value >= min, 'value smaller than minimum allowed value');

	  assert.ok(Math.floor(value) === value, 'value has a fractional component');
	}

	function verifIEEE754(value, max, min) {
	  assert.ok(typeof (value) == 'number',
	      'cannot write a non-number as a number');

	  assert.ok(value <= max, 'value larger than maximum allowed value');

	  assert.ok(value >= min, 'value smaller than minimum allowed value');
	}

	Buffer.prototype.writeInt8 = function(value, offset, noAssert) {
	  var buffer = this;

	  if (!noAssert) {
	    assert.ok(value !== undefined && value !== null,
	        'missing value');

	    assert.ok(offset !== undefined && offset !== null,
	        'missing offset');

	    assert.ok(offset < buffer.length,
	        'Trying to write beyond buffer length');

	    verifsint(value, 0x7f, -0x80);
	  }

	  if (value >= 0) {
	    buffer.writeUInt8(value, offset, noAssert);
	  } else {
	    buffer.writeUInt8(0xff + value + 1, offset, noAssert);
	  }
	};

	function writeInt16(buffer, value, offset, isBigEndian, noAssert) {
	  if (!noAssert) {
	    assert.ok(value !== undefined && value !== null,
	        'missing value');

	    assert.ok(typeof (isBigEndian) === 'boolean',
	        'missing or invalid endian');

	    assert.ok(offset !== undefined && offset !== null,
	        'missing offset');

	    assert.ok(offset + 1 < buffer.length,
	        'Trying to write beyond buffer length');

	    verifsint(value, 0x7fff, -0x8000);
	  }

	  if (value >= 0) {
	    writeUInt16(buffer, value, offset, isBigEndian, noAssert);
	  } else {
	    writeUInt16(buffer, 0xffff + value + 1, offset, isBigEndian, noAssert);
	  }
	}

	Buffer.prototype.writeInt16LE = function(value, offset, noAssert) {
	  writeInt16(this, value, offset, false, noAssert);
	};

	Buffer.prototype.writeInt16BE = function(value, offset, noAssert) {
	  writeInt16(this, value, offset, true, noAssert);
	};

	function writeInt32(buffer, value, offset, isBigEndian, noAssert) {
	  if (!noAssert) {
	    assert.ok(value !== undefined && value !== null,
	        'missing value');

	    assert.ok(typeof (isBigEndian) === 'boolean',
	        'missing or invalid endian');

	    assert.ok(offset !== undefined && offset !== null,
	        'missing offset');

	    assert.ok(offset + 3 < buffer.length,
	        'Trying to write beyond buffer length');

	    verifsint(value, 0x7fffffff, -0x80000000);
	  }

	  if (value >= 0) {
	    writeUInt32(buffer, value, offset, isBigEndian, noAssert);
	  } else {
	    writeUInt32(buffer, 0xffffffff + value + 1, offset, isBigEndian, noAssert);
	  }
	}

	Buffer.prototype.writeInt32LE = function(value, offset, noAssert) {
	  writeInt32(this, value, offset, false, noAssert);
	};

	Buffer.prototype.writeInt32BE = function(value, offset, noAssert) {
	  writeInt32(this, value, offset, true, noAssert);
	};

	function writeFloat(buffer, value, offset, isBigEndian, noAssert) {
	  if (!noAssert) {
	    assert.ok(value !== undefined && value !== null,
	        'missing value');

	    assert.ok(typeof (isBigEndian) === 'boolean',
	        'missing or invalid endian');

	    assert.ok(offset !== undefined && offset !== null,
	        'missing offset');

	    assert.ok(offset + 3 < buffer.length,
	        'Trying to write beyond buffer length');

	    verifIEEE754(value, 3.4028234663852886e+38, -3.4028234663852886e+38);
	  }

	  require(65).writeIEEE754(buffer, value, offset, isBigEndian,
	      23, 4);
	}

	Buffer.prototype.writeFloatLE = function(value, offset, noAssert) {
	  writeFloat(this, value, offset, false, noAssert);
	};

	Buffer.prototype.writeFloatBE = function(value, offset, noAssert) {
	  writeFloat(this, value, offset, true, noAssert);
	};

	function writeDouble(buffer, value, offset, isBigEndian, noAssert) {
	  if (!noAssert) {
	    assert.ok(value !== undefined && value !== null,
	        'missing value');

	    assert.ok(typeof (isBigEndian) === 'boolean',
	        'missing or invalid endian');

	    assert.ok(offset !== undefined && offset !== null,
	        'missing offset');

	    assert.ok(offset + 7 < buffer.length,
	        'Trying to write beyond buffer length');

	    verifIEEE754(value, 1.7976931348623157E+308, -1.7976931348623157E+308);
	  }

	  require(65).writeIEEE754(buffer, value, offset, isBigEndian,
	      52, 8);
	}

	Buffer.prototype.writeDoubleLE = function(value, offset, noAssert) {
	  writeDouble(this, value, offset, false, noAssert);
	};

	Buffer.prototype.writeDoubleBE = function(value, offset, noAssert) {
	  writeDouble(this, value, offset, true, noAssert);
	};

	SlowBuffer.prototype.readUInt8 = Buffer.prototype.readUInt8;
	SlowBuffer.prototype.readUInt16LE = Buffer.prototype.readUInt16LE;
	SlowBuffer.prototype.readUInt16BE = Buffer.prototype.readUInt16BE;
	SlowBuffer.prototype.readUInt32LE = Buffer.prototype.readUInt32LE;
	SlowBuffer.prototype.readUInt32BE = Buffer.prototype.readUInt32BE;
	SlowBuffer.prototype.readInt8 = Buffer.prototype.readInt8;
	SlowBuffer.prototype.readInt16LE = Buffer.prototype.readInt16LE;
	SlowBuffer.prototype.readInt16BE = Buffer.prototype.readInt16BE;
	SlowBuffer.prototype.readInt32LE = Buffer.prototype.readInt32LE;
	SlowBuffer.prototype.readInt32BE = Buffer.prototype.readInt32BE;
	SlowBuffer.prototype.readFloatLE = Buffer.prototype.readFloatLE;
	SlowBuffer.prototype.readFloatBE = Buffer.prototype.readFloatBE;
	SlowBuffer.prototype.readDoubleLE = Buffer.prototype.readDoubleLE;
	SlowBuffer.prototype.readDoubleBE = Buffer.prototype.readDoubleBE;
	SlowBuffer.prototype.writeUInt8 = Buffer.prototype.writeUInt8;
	SlowBuffer.prototype.writeUInt16LE = Buffer.prototype.writeUInt16LE;
	SlowBuffer.prototype.writeUInt16BE = Buffer.prototype.writeUInt16BE;
	SlowBuffer.prototype.writeUInt32LE = Buffer.prototype.writeUInt32LE;
	SlowBuffer.prototype.writeUInt32BE = Buffer.prototype.writeUInt32BE;
	SlowBuffer.prototype.writeInt8 = Buffer.prototype.writeInt8;
	SlowBuffer.prototype.writeInt16LE = Buffer.prototype.writeInt16LE;
	SlowBuffer.prototype.writeInt16BE = Buffer.prototype.writeInt16BE;
	SlowBuffer.prototype.writeInt32LE = Buffer.prototype.writeInt32LE;
	SlowBuffer.prototype.writeInt32BE = Buffer.prototype.writeInt32BE;
	SlowBuffer.prototype.writeFloatLE = Buffer.prototype.writeFloatLE;
	SlowBuffer.prototype.writeFloatBE = Buffer.prototype.writeFloatBE;
	SlowBuffer.prototype.writeDoubleLE = Buffer.prototype.writeDoubleLE;
	SlowBuffer.prototype.writeDoubleBE = Buffer.prototype.writeDoubleBE;
	
	/* WEBPACK VAR INJECTION */}.call(exports, require, require(50).Buffer))

/***/ },

/***/ 51:
/***/ function(module, exports, require) {

	module.exports = function filter (xs, fn) {
	    var res = [];
	    for (var i = 0; i < xs.length; i++) {
	        if (fn(xs[i], i, xs)) res.push(xs[i]);
	    }
	    return res;
	}

/***/ },

/***/ 52:
/***/ function(module, exports, require) {

	module.exports = typeof Array.isArray === 'function'
	    ? Array.isArray
	    : function (xs) {
	        return Object.prototype.toString.call(xs) === '[object Array]'
	    }
	;

	/*

	alternative

	function isArray(ar) {
	  return ar instanceof Array ||
	         Array.isArray(ar) ||
	         (ar && ar !== Object.prototype && isArray(ar.__proto__));
	}

	*/

/***/ },

/***/ 53:
/***/ function(module, exports, require) {

	module.exports = Object.keys || function objectKeys(object) {
		if (object !== Object(object)) throw new TypeError('Invalid object');
		var result = [];
		for (var name in object) {
			if (Object.prototype.hasOwnProperty.call(object, name)) {
				result.push(name);
			}
		}
		return result;
	};


/***/ },

/***/ 54:
/***/ function(module, exports, require) {

	module.exports = Object.getOwnPropertyNames || function (obj) {
	    var res = [];
	    for (var key in obj) {
	        if (Object.hasOwnProperty.call(obj, key)) res.push(key);
	    }
	    return res;
	};

/***/ },

/***/ 55:
/***/ function(module, exports, require) {

	module.exports = Object.create || function (prototype, properties) {
	    // from es5-shim
	    var object;
	    if (prototype === null) {
	        object = { '__proto__' : null };
	    }
	    else {
	        if (typeof prototype !== 'object') {
	            throw new TypeError(
	                'typeof prototype[' + (typeof prototype) + '] != \'object\''
	            );
	        }
	        var Type = function () {};
	        Type.prototype = prototype;
	        object = new Type();
	        object.__proto__ = prototype;
	    }
	    if (typeof properties !== 'undefined' && Object.defineProperties) {
	        Object.defineProperties(object, properties);
	    }
	    return object;
	};

/***/ },

/***/ 56:
/***/ function(module, exports, require) {

	module.exports = function isRegExp(re) {
	  return re instanceof RegExp ||
	    (typeof re === 'object' && Object.prototype.toString.call(re) === '[object RegExp]');
	}

/***/ },

/***/ 57:
/***/ function(module, exports, require) {

	module.exports = function indexOf (xs, x) {
	    if (xs.indexOf) return xs.indexOf(x);
	    for (var i = 0; i < xs.length; i++) {
	        if (x === xs[i]) return i;
	    }
	    return -1;
	}


/***/ },

/***/ 58:
/***/ function(module, exports, require) {

	var Object_keys = function (obj) {
	    if (Object.keys) return Object.keys(obj)
	    else {
	        var res = [];
	        for (var key in obj) res.push(key)
	        return res;
	    }
	};

	var forEach = function (xs, fn) {
	    if (xs.forEach) return xs.forEach(fn)
	    else for (var i = 0; i < xs.length; i++) {
	        fn(xs[i], i, xs);
	    }
	};

	var Script = exports.Script = function NodeScript (code) {
	    if (!(this instanceof Script)) return new Script(code);
	    this.code = code;
	};

	Script.prototype.runInNewContext = function (context) {
	    if (!context) context = {};
	    
	    var iframe = document.createElement('iframe');
	    if (!iframe.style) iframe.style = {};
	    iframe.style.display = 'none';
	    
	    document.body.appendChild(iframe);
	    
	    var win = iframe.contentWindow;
	    
	    forEach(Object_keys(context), function (key) {
	        win[key] = context[key];
	    });
	     
	    if (!win.eval && win.execScript) {
	        // win.eval() magically appears when this is called in IE:
	        win.execScript('null');
	    }
	    
	    var res = win.eval(this.code);
	    
	    forEach(Object_keys(win), function (key) {
	        context[key] = win[key];
	    });
	    
	    document.body.removeChild(iframe);
	    
	    return res;
	};

	Script.prototype.runInThisContext = function () {
	    return eval(this.code); // maybe...
	};

	Script.prototype.runInContext = function (context) {
	    // seems to be just runInNewContext on magical context objects which are
	    // otherwise indistinguishable from objects except plain old objects
	    // for the parameter segfaults node
	    return this.runInNewContext(context);
	};

	forEach(Object_keys(Script.prototype), function (name) {
	    exports[name] = Script[name] = function (code) {
	        var s = Script(code);
	        return s[name].apply(s, [].slice.call(arguments, 1));
	    };
	});

	exports.createScript = function (code) {
	    return exports.Script(code);
	};

	exports.createContext = Script.createContext = function (context) {
	    // not really sure what this one does
	    // seems to just make a shallow copy
	    var copy = {};
	    if(typeof context === 'object') {
	        forEach(Object_keys(context), function (key) {
	            copy[key] = context[key];
	        });
	    }
	    return copy;
	};


/***/ },

/***/ 59:
/***/ function(module, exports, require) {

	/*! http://mths.be/punycode v1.2.0 by @mathias */
	/* Modifications for in browser usage */

		/**
		 * The `punycode` object.
		 * @name punycode
		 * @type Object
		 */
		var punycode,

		/** Highest positive signed 32-bit float value */
		maxInt = 2147483647, // aka. 0x7FFFFFFF or 2^31-1

		/** Bootstring parameters */
		base = 36,
		tMin = 1,
		tMax = 26,
		skew = 38,
		damp = 700,
		initialBias = 72,
		initialN = 128, // 0x80
		delimiter = '-', // '\x2D'

		/** Regular expressions */
		regexPunycode = /^xn--/,
		regexNonASCII = /[^ -~]/, // unprintable ASCII chars + non-ASCII chars
		regexSeparators = /\x2E|\u3002|\uFF0E|\uFF61/g, // RFC 3490 separators

		/** Error messages */
		errors = {
			'overflow': 'Overflow: input needs wider integers to process',
			'not-basic': 'Illegal input >= 0x80 (not a basic code point)',
			'invalid-input': 'Invalid input'
		},

		/** Convenience shortcuts */
		baseMinusTMin = base - tMin,
		floor = Math.floor,
		stringFromCharCode = String.fromCharCode,

		/** Temporary variable */
		key;

		/*--------------------------------------------------------------------------*/

		/**
		 * A generic error utility function.
		 * @private
		 * @param {String} type The error type.
		 * @returns {Error} Throws a `RangeError` with the applicable error message.
		 */
		function error(type) {
			throw RangeError(errors[type]);
		}

		/**
		 * A generic `Array#map` utility function.
		 * @private
		 * @param {Array} array The array to iterate over.
		 * @param {Function} callback The function that gets called for every array
		 * item.
		 * @returns {Array} A new array of values returned by the callback function.
		 */
		function map(array, fn) {
			var length = array.length;
			while (length--) {
				array[length] = fn(array[length]);
			}
			return array;
		}

		/**
		 * A simple `Array#map`-like wrapper to work with domain name strings.
		 * @private
		 * @param {String} domain The domain name.
		 * @param {Function} callback The function that gets called for every
		 * character.
		 * @returns {Array} A new string of characters returned by the callback
		 * function.
		 */
		function mapDomain(string, fn) {
			return map(string.split(regexSeparators), fn).join('.');
		}

		/**
		 * Creates an array containing the decimal code points of each Unicode
		 * character in the string. While JavaScript uses UCS-2 internally,
		 * this function will convert a pair of surrogate halves (each of which
		 * UCS-2 exposes as separate characters) into a single code point,
		 * matching UTF-16.
		 * @see `punycode.ucs2.encode`
		 * @see <http://mathiasbynens.be/notes/javascript-encoding>
		 * @memberOf punycode.ucs2
		 * @name decode
		 * @param {String} string The Unicode input string (UCS-2).
		 * @returns {Array} The new array of code points.
		 */
		function ucs2decode(string) {
			var output = [],
			    counter = 0,
			    length = string.length,
			    value,
			    extra;
			while (counter < length) {
				value = string.charCodeAt(counter++);
				if ((value & 0xF800) == 0xD800 && counter < length) {
					// high surrogate, and there is a next character
					extra = string.charCodeAt(counter++);
					if ((extra & 0xFC00) == 0xDC00) { // low surrogate
						output.push(((value & 0x3FF) << 10) + (extra & 0x3FF) + 0x10000);
					} else {
						output.push(value, extra);
					}
				} else {
					output.push(value);
				}
			}
			return output;
		}

		/**
		 * Creates a string based on an array of decimal code points.
		 * @see `punycode.ucs2.decode`
		 * @memberOf punycode.ucs2
		 * @name encode
		 * @param {Array} codePoints The array of decimal code points.
		 * @returns {String} The new Unicode string (UCS-2).
		 */
		function ucs2encode(array) {
			return map(array, function(value) {
				var output = '';
				if (value > 0xFFFF) {
					value -= 0x10000;
					output += stringFromCharCode(value >>> 10 & 0x3FF | 0xD800);
					value = 0xDC00 | value & 0x3FF;
				}
				output += stringFromCharCode(value);
				return output;
			}).join('');
		}

		/**
		 * Converts a basic code point into a digit/integer.
		 * @see `digitToBasic()`
		 * @private
		 * @param {Number} codePoint The basic (decimal) code point.
		 * @returns {Number} The numeric value of a basic code point (for use in
		 * representing integers) in the range `0` to `base - 1`, or `base` if
		 * the code point does not represent a value.
		 */
		function basicToDigit(codePoint) {
			return codePoint - 48 < 10
				? codePoint - 22
				: codePoint - 65 < 26
					? codePoint - 65
					: codePoint - 97 < 26
						? codePoint - 97
						: base;
		}

		/**
		 * Converts a digit/integer into a basic code point.
		 * @see `basicToDigit()`
		 * @private
		 * @param {Number} digit The numeric value of a basic code point.
		 * @returns {Number} The basic code point whose value (when used for
		 * representing integers) is `digit`, which needs to be in the range
		 * `0` to `base - 1`. If `flag` is non-zero, the uppercase form is
		 * used; else, the lowercase form is used. The behavior is undefined
		 * if flag is non-zero and `digit` has no uppercase form.
		 */
		function digitToBasic(digit, flag) {
			//  0..25 map to ASCII a..z or A..Z
			// 26..35 map to ASCII 0..9
			return digit + 22 + 75 * (digit < 26) - ((flag != 0) << 5);
		}

		/**
		 * Bias adaptation function as per section 3.4 of RFC 3492.
		 * http://tools.ietf.org/html/rfc3492#section-3.4
		 * @private
		 */
		function adapt(delta, numPoints, firstTime) {
			var k = 0;
			delta = firstTime ? floor(delta / damp) : delta >> 1;
			delta += floor(delta / numPoints);
			for (/* no initialization */; delta > baseMinusTMin * tMax >> 1; k += base) {
				delta = floor(delta / baseMinusTMin);
			}
			return floor(k + (baseMinusTMin + 1) * delta / (delta + skew));
		}

		/**
		 * Converts a basic code point to lowercase if `flag` is falsy, or to
		 * uppercase if `flag` is truthy. The code point is unchanged if it's
		 * caseless. The behavior is undefined if `codePoint` is not a basic code
		 * point.
		 * @private
		 * @param {Number} codePoint The numeric value of a basic code point.
		 * @returns {Number} The resulting basic code point.
		 */
		function encodeBasic(codePoint, flag) {
			codePoint -= (codePoint - 97 < 26) << 5;
			return codePoint + (!flag && codePoint - 65 < 26) << 5;
		}

		/**
		 * Converts a Punycode string of ASCII code points to a string of Unicode
		 * code points.
		 * @memberOf punycode
		 * @param {String} input The Punycode string of ASCII code points.
		 * @returns {String} The resulting string of Unicode code points.
		 */
		function decode(input) {
			// Don't use UCS-2
			var output = [],
			    inputLength = input.length,
			    out,
			    i = 0,
			    n = initialN,
			    bias = initialBias,
			    basic,
			    j,
			    index,
			    oldi,
			    w,
			    k,
			    digit,
			    t,
			    length,
			    /** Cached calculation results */
			    baseMinusT;

			// Handle the basic code points: let `basic` be the number of input code
			// points before the last delimiter, or `0` if there is none, then copy
			// the first basic code points to the output.

			basic = input.lastIndexOf(delimiter);
			if (basic < 0) {
				basic = 0;
			}

			for (j = 0; j < basic; ++j) {
				// if it's not a basic code point
				if (input.charCodeAt(j) >= 0x80) {
					error('not-basic');
				}
				output.push(input.charCodeAt(j));
			}

			// Main decoding loop: start just after the last delimiter if any basic code
			// points were copied; start at the beginning otherwise.

			for (index = basic > 0 ? basic + 1 : 0; index < inputLength; /* no final expression */) {

				// `index` is the index of the next character to be consumed.
				// Decode a generalized variable-length integer into `delta`,
				// which gets added to `i`. The overflow checking is easier
				// if we increase `i` as we go, then subtract off its starting
				// value at the end to obtain `delta`.
				for (oldi = i, w = 1, k = base; /* no condition */; k += base) {

					if (index >= inputLength) {
						error('invalid-input');
					}

					digit = basicToDigit(input.charCodeAt(index++));

					if (digit >= base || digit > floor((maxInt - i) / w)) {
						error('overflow');
					}

					i += digit * w;
					t = k <= bias ? tMin : (k >= bias + tMax ? tMax : k - bias);

					if (digit < t) {
						break;
					}

					baseMinusT = base - t;
					if (w > floor(maxInt / baseMinusT)) {
						error('overflow');
					}

					w *= baseMinusT;

				}

				out = output.length + 1;
				bias = adapt(i - oldi, out, oldi == 0);

				// `i` was supposed to wrap around from `out` to `0`,
				// incrementing `n` each time, so we'll fix that now:
				if (floor(i / out) > maxInt - n) {
					error('overflow');
				}

				n += floor(i / out);
				i %= out;

				// Insert `n` at position `i` of the output
				output.splice(i++, 0, n);

			}

			return ucs2encode(output);
		}

		/**
		 * Converts a string of Unicode code points to a Punycode string of ASCII
		 * code points.
		 * @memberOf punycode
		 * @param {String} input The string of Unicode code points.
		 * @returns {String} The resulting Punycode string of ASCII code points.
		 */
		function encode(input) {
			var n,
			    delta,
			    handledCPCount,
			    basicLength,
			    bias,
			    j,
			    m,
			    q,
			    k,
			    t,
			    currentValue,
			    output = [],
			    /** `inputLength` will hold the number of code points in `input`. */
			    inputLength,
			    /** Cached calculation results */
			    handledCPCountPlusOne,
			    baseMinusT,
			    qMinusT;

			// Convert the input in UCS-2 to Unicode
			input = ucs2decode(input);

			// Cache the length
			inputLength = input.length;

			// Initialize the state
			n = initialN;
			delta = 0;
			bias = initialBias;

			// Handle the basic code points
			for (j = 0; j < inputLength; ++j) {
				currentValue = input[j];
				if (currentValue < 0x80) {
					output.push(stringFromCharCode(currentValue));
				}
			}

			handledCPCount = basicLength = output.length;

			// `handledCPCount` is the number of code points that have been handled;
			// `basicLength` is the number of basic code points.

			// Finish the basic string - if it is not empty - with a delimiter
			if (basicLength) {
				output.push(delimiter);
			}

			// Main encoding loop:
			while (handledCPCount < inputLength) {

				// All non-basic code points < n have been handled already. Find the next
				// larger one:
				for (m = maxInt, j = 0; j < inputLength; ++j) {
					currentValue = input[j];
					if (currentValue >= n && currentValue < m) {
						m = currentValue;
					}
				}

				// Increase `delta` enough to advance the decoder's <n,i> state to <m,0>,
				// but guard against overflow
				handledCPCountPlusOne = handledCPCount + 1;
				if (m - n > floor((maxInt - delta) / handledCPCountPlusOne)) {
					error('overflow');
				}

				delta += (m - n) * handledCPCountPlusOne;
				n = m;

				for (j = 0; j < inputLength; ++j) {
					currentValue = input[j];

					if (currentValue < n && ++delta > maxInt) {
						error('overflow');
					}

					if (currentValue == n) {
						// Represent delta as a generalized variable-length integer
						for (q = delta, k = base; /* no condition */; k += base) {
							t = k <= bias ? tMin : (k >= bias + tMax ? tMax : k - bias);
							if (q < t) {
								break;
							}
							qMinusT = q - t;
							baseMinusT = base - t;
							output.push(
								stringFromCharCode(digitToBasic(t + qMinusT % baseMinusT, 0))
							);
							q = floor(qMinusT / baseMinusT);
						}

						output.push(stringFromCharCode(digitToBasic(q, 0)));
						bias = adapt(delta, handledCPCountPlusOne, handledCPCount == basicLength);
						delta = 0;
						++handledCPCount;
					}
				}

				++delta;
				++n;

			}
			return output.join('');
		}

		/**
		 * Converts a Punycode string representing a domain name to Unicode. Only the
		 * Punycoded parts of the domain name will be converted, i.e. it doesn't
		 * matter if you call it on a string that has already been converted to
		 * Unicode.
		 * @memberOf punycode
		 * @param {String} domain The Punycode domain name to convert to Unicode.
		 * @returns {String} The Unicode representation of the given Punycode
		 * string.
		 */
		function toUnicode(domain) {
			return mapDomain(domain, function(string) {
				return regexPunycode.test(string)
					? decode(string.slice(4).toLowerCase())
					: string;
			});
		}

		/**
		 * Converts a Unicode string representing a domain name to Punycode. Only the
		 * non-ASCII parts of the domain name will be converted, i.e. it doesn't
		 * matter if you call it with a domain that's already in ASCII.
		 * @memberOf punycode
		 * @param {String} domain The domain name to convert, as a Unicode string.
		 * @returns {String} The Punycode representation of the given domain name.
		 */
		function toASCII(domain) {
			return mapDomain(domain, function(string) {
				return regexNonASCII.test(string)
					? 'xn--' + encode(string)
					: string;
			});
		}

		/*--------------------------------------------------------------------------*/

		/** Define the public API */
		punycode = {
			/**
			 * A string representing the current Punycode.js version number.
			 * @memberOf punycode
			 * @type String
			 */
			'version': '1.2.0',
			/**
			 * An object of methods to convert from JavaScript's internal character
			 * representation (UCS-2) to decimal Unicode code points, and back.
			 * @see <http://mathiasbynens.be/notes/javascript-encoding>
			 * @memberOf punycode
			 * @type Object
			 */
			'ucs2': {
				'decode': ucs2decode,
				'encode': ucs2encode
			},
			'decode': decode,
			'encode': encode,
			'toASCII': toASCII,
			'toUnicode': toUnicode
		};

		/** Expose `punycode` */
		module.exports = punycode;


/***/ },

/***/ 60:
/***/ function(module, exports, require) {

	var isArray = require(52);

	var objectKeys = require(53);


	/*!
	 * querystring
	 * Copyright(c) 2010 TJ Holowaychuk <tj@vision-media.ca>
	 * MIT Licensed
	 */

	/**
	 * Library version.
	 */

	exports.version = '0.3.1';

	/**
	 * Object#toString() ref for stringify().
	 */

	var toString = Object.prototype.toString;

	/**
	 * Cache non-integer test regexp.
	 */

	var notint = /[^0-9]/;

	/**
	 * Parse the given query `str`, returning an object.
	 *
	 * @param {String} str
	 * @return {Object}
	 * @api public
	 */

	exports.parse = function(str){
	  if (null == str || '' == str) return {};

	  function promote(parent, key) {
	    if (parent[key].length == 0) return parent[key] = {};
	    var t = {};
	    for (var i in parent[key]) t[i] = parent[key][i];
	    parent[key] = t;
	    return t;
	  }

	  return String(str)
	    .split('&')
	    .reduce(function(ret, pair){
	      try{ 
	        pair = decodeURIComponent(pair.replace(/\+/g, ' '));
	      } catch(e) {
	        // ignore
	      }

	      var eql = pair.indexOf('=')
	        , brace = lastBraceInKey(pair)
	        , key = pair.substr(0, brace || eql)
	        , val = pair.substr(brace || eql, pair.length)
	        , val = val.substr(val.indexOf('=') + 1, val.length)
	        , parent = ret;

	      // ?foo
	      if ('' == key) key = pair, val = '';

	      // nested
	      if (~key.indexOf(']')) {
	        var parts = key.split('[')
	          , len = parts.length
	          , last = len - 1;

	        function parse(parts, parent, key) {
	          var part = parts.shift();

	          // end
	          if (!part) {
	            if (isArray(parent[key])) {
	              parent[key].push(val);
	            } else if ('object' == typeof parent[key]) {
	              parent[key] = val;
	            } else if ('undefined' == typeof parent[key]) {
	              parent[key] = val;
	            } else {
	              parent[key] = [parent[key], val];
	            }
	          // array
	          } else {
	            obj = parent[key] = parent[key] || [];
	            if (']' == part) {
	              if (isArray(obj)) {
	                if ('' != val) obj.push(val);
	              } else if ('object' == typeof obj) {
	                obj[objectKeys(obj).length] = val;
	              } else {
	                obj = parent[key] = [parent[key], val];
	              }
	            // prop
	            } else if (~part.indexOf(']')) {
	              part = part.substr(0, part.length - 1);
	              if(notint.test(part) && isArray(obj)) obj = promote(parent, key);
	              parse(parts, obj, part);
	            // key
	            } else {
	              if(notint.test(part) && isArray(obj)) obj = promote(parent, key);
	              parse(parts, obj, part);
	            }
	          }
	        }

	        parse(parts, parent, 'base');
	      // optimize
	      } else {
	        if (notint.test(key) && isArray(parent.base)) {
	          var t = {};
	          for(var k in parent.base) t[k] = parent.base[k];
	          parent.base = t;
	        }
	        set(parent.base, key, val);
	      }

	      return ret;
	    }, {base: {}}).base;
	};

	/**
	 * Turn the given `obj` into a query string
	 *
	 * @param {Object} obj
	 * @return {String}
	 * @api public
	 */

	var stringify = exports.stringify = function(obj, prefix) {
	  if (isArray(obj)) {
	    return stringifyArray(obj, prefix);
	  } else if ('[object Object]' == toString.call(obj)) {
	    return stringifyObject(obj, prefix);
	  } else if ('string' == typeof obj) {
	    return stringifyString(obj, prefix);
	  } else {
	    return prefix;
	  }
	};

	/**
	 * Stringify the given `str`.
	 *
	 * @param {String} str
	 * @param {String} prefix
	 * @return {String}
	 * @api private
	 */

	function stringifyString(str, prefix) {
	  if (!prefix) throw new TypeError('stringify expects an object');
	  return prefix + '=' + encodeURIComponent(str);
	}

	/**
	 * Stringify the given `arr`.
	 *
	 * @param {Array} arr
	 * @param {String} prefix
	 * @return {String}
	 * @api private
	 */

	function stringifyArray(arr, prefix) {
	  var ret = [];
	  if (!prefix) throw new TypeError('stringify expects an object');
	  for (var i = 0; i < arr.length; i++) {
	    ret.push(stringify(arr[i], prefix + '[]'));
	  }
	  return ret.join('&');
	}

	/**
	 * Stringify the given `obj`.
	 *
	 * @param {Object} obj
	 * @param {String} prefix
	 * @return {String}
	 * @api private
	 */

	function stringifyObject(obj, prefix) {
	  var ret = []
	    , keys = objectKeys(obj)
	    , key;
	  for (var i = 0, len = keys.length; i < len; ++i) {
	    key = keys[i];
	    ret.push(stringify(obj[key], prefix
	      ? prefix + '[' + encodeURIComponent(key) + ']'
	      : encodeURIComponent(key)));
	  }
	  return ret.join('&');
	}

	/**
	 * Set `obj`'s `key` to `val` respecting
	 * the weird and wonderful syntax of a qs,
	 * where "foo=bar&foo=baz" becomes an array.
	 *
	 * @param {Object} obj
	 * @param {String} key
	 * @param {String} val
	 * @api private
	 */

	function set(obj, key, val) {
	  var v = obj[key];
	  if (undefined === v) {
	    obj[key] = val;
	  } else if (isArray(v)) {
	    v.push(val);
	  } else {
	    obj[key] = [v, val];
	  }
	}

	/**
	 * Locate last brace in `str` within the key.
	 *
	 * @param {String} str
	 * @return {Number}
	 * @api private
	 */

	function lastBraceInKey(str) {
	  var len = str.length
	    , brace
	    , c;
	  for (var i = 0; i < len; ++i) {
	    c = str[i];
	    if (']' == c) brace = false;
	    if ('[' == c) brace = true;
	    if ('=' == c && !brace) return i;
	  }
	}


/***/ },

/***/ 61:
/***/ function(module, exports, require) {

	module.exports = require(68);


/***/ },

/***/ 62:
/***/ function(module, exports, require) {

	module.exports =
	function copy (obj) {
	  var o = {}
	  Object.keys(obj).forEach(function (i) {
	    o[i] = obj[i]
	  })
	  return o
	}

/***/ },

/***/ 63:
/***/ function(module, exports, require) {

	/* WEBPACK VAR INJECTION */(function(require, Buffer, process) {var http = require(70)
	  , https = false
	  , tls = false
	  , url = require(18)
	  , util = require(17)
	  , stream = require(71)
	  , qs = require(81)
	  , querystring = require(60)
	  , crypto = require(72)

	  , oauth = require(82)
	  , hawk = require(83)
	  , aws = require(84)
	  , httpSignature = require(92)
	  , uuid = require(93)
	  , mime = require(64)
	  , tunnel = require(85)
	  , _safeStringify = require(94)

	  , ForeverAgent = require(86)
	  , FormData = require(95)

	  , Cookie = require(69)
	  , CookieJar = Cookie.Jar
	  , cookieJar = new CookieJar

	  , copy = require(62)
	  , debug = require(73)
	  , getSafe = require(74)
	  ;

	function safeStringify (obj) {
	  var ret
	  try { ret = JSON.stringify(obj) }
	  catch (e) { ret = _safeStringify(obj) }
	  return ret
	}

	var globalPool = {}
	var isUrl = /^https?:/i

	try {
	  https = require(75)
	} catch (e) {}

	try {
	  tls = require(76)
	} catch (e) {}



	// Hacky fix for pre-0.4.4 https
	if (https && !https.Agent) {
	  https.Agent = function (options) {
	    http.Agent.call(this, options)
	  }
	  util.inherits(https.Agent, http.Agent)
	  https.Agent.prototype._getConnection = function (host, port, cb) {
	    var s = tls.connect(port, host, this.options, function () {
	      // do other checks here?
	      if (cb) cb()
	    })
	    return s
	  }
	}

	function isReadStream (rs) {
	  if (rs.readable && rs.path && rs.mode) {
	    return true
	  }
	}

	function toBase64 (str) {
	  return (new Buffer(str || "", "ascii")).toString("base64")
	}

	function md5 (str) {
	  return crypto.createHash('md5').update(str).digest('hex')
	}

	function Request (options) {
	  stream.Stream.call(this)
	  this.readable = true
	  this.writable = true

	  if (typeof options === 'string') {
	    options = {uri:options}
	  }

	  var reserved = Object.keys(Request.prototype)
	  for (var i in options) {
	    if (reserved.indexOf(i) === -1) {
	      this[i] = options[i]
	    } else {
	      if (typeof options[i] === 'function') {
	        delete options[i]
	      }
	    }
	  }

	  if (options.method) {
	    this.explicitMethod = true
	  }

	  this.init(options)
	}
	util.inherits(Request, stream.Stream)
	Request.prototype.init = function (options) {
	  // init() contains all the code to setup the request object.
	  // the actual outgoing request is not started until start() is called
	  // this function is called from both the constructor and on redirect.
	  var self = this
	  if (!options) options = {}

	  if (!self.method) self.method = options.method || 'GET'
	  self.localAddress = options.localAddress

	  debug(options)
	  if (!self.pool && self.pool !== false) self.pool = globalPool
	  self.dests = self.dests || []
	  self.__isRequestRequest = true

	  // Protect against double callback
	  if (!self._callback && self.callback) {
	    self._callback = self.callback
	    self.callback = function () {
	      if (self._callbackCalled) return // Print a warning maybe?
	      self._callbackCalled = true
	      self._callback.apply(self, arguments)
	    }
	    self.on('error', self.callback.bind())
	    self.on('complete', self.callback.bind(self, null))
	  }

	  if (self.url && !self.uri) {
	    // People use this property instead all the time so why not just support it.
	    self.uri = self.url
	    delete self.url
	  }

	  if (!self.uri) {
	    // this will throw if unhandled but is handleable when in a redirect
	    return self.emit('error', new Error("options.uri is a required argument"))
	  } else {
	    if (typeof self.uri == "string") self.uri = url.parse(self.uri)
	  }

	  if (self.strictSSL === false) {
	    self.rejectUnauthorized = false
	  }

	  if (self.proxy) {
	    if (typeof self.proxy == 'string') self.proxy = url.parse(self.proxy)

	    // do the HTTP CONNECT dance using koichik/node-tunnel
	    if (http.globalAgent && self.uri.protocol === "https:") {
	      var tunnelFn = self.proxy.protocol === "http:"
	                   ? tunnel.httpsOverHttp : tunnel.httpsOverHttps

	      var tunnelOptions = { proxy: { host: self.proxy.hostname
	                                   , port: +self.proxy.port
	                                   , proxyAuth: self.proxy.auth
	                                   , headers: { Host: self.uri.hostname + ':' +
	                                        (self.uri.port || self.uri.protocol === 'https:' ? 443 : 80) }}
	                          , rejectUnauthorized: self.rejectUnauthorized
	                          , ca: this.ca }

	      self.agent = tunnelFn(tunnelOptions)
	      self.tunnel = true
	    }
	  }

	  if (!self.uri.pathname) {self.uri.pathname = '/'}

	  if (!self.uri.host) {
	    // Invalid URI: it may generate lot of bad errors, like "TypeError: Cannot call method 'indexOf' of undefined" in CookieJar
	    // Detect and reject it as soon as possible
	    var faultyUri = url.format(self.uri)
	    var message = 'Invalid URI "' + faultyUri + '"'
	    if (Object.keys(options).length === 0) {
	      // No option ? This can be the sign of a redirect
	      // As this is a case where the user cannot do anything (he didn't call request directly with this URL)
	      // he should be warned that it can be caused by a redirection (can save some hair)
	      message += '. This can be caused by a crappy redirection.'
	    }
	    self.emit('error', new Error(message))
	    return // This error was fatal
	  }

	  self._redirectsFollowed = self._redirectsFollowed || 0
	  self.maxRedirects = (self.maxRedirects !== undefined) ? self.maxRedirects : 10
	  self.followRedirect = (self.followRedirect !== undefined) ? self.followRedirect : true
	  self.followAllRedirects = (self.followAllRedirects !== undefined) ? self.followAllRedirects : false
	  if (self.followRedirect || self.followAllRedirects)
	    self.redirects = self.redirects || []

	  self.headers = self.headers ? copy(self.headers) : {}

	  self.setHost = false
	  if (!self.hasHeader('host')) {
	    self.setHeader('host', self.uri.hostname)
	    if (self.uri.port) {
	      if ( !(self.uri.port === 80 && self.uri.protocol === 'http:') &&
	           !(self.uri.port === 443 && self.uri.protocol === 'https:') )
	      self.setHeader('host', self.getHeader('host') + (':'+self.uri.port) )
	    }
	    self.setHost = true
	  }

	  self.jar(self._jar || options.jar)

	  if (!self.uri.port) {
	    if (self.uri.protocol == 'http:') {self.uri.port = 80}
	    else if (self.uri.protocol == 'https:') {self.uri.port = 443}
	  }

	  if (self.proxy && !self.tunnel) {
	    self.port = self.proxy.port
	    self.host = self.proxy.hostname
	  } else {
	    self.port = self.uri.port
	    self.host = self.uri.hostname
	  }

	  self.clientErrorHandler = function (error) {
	    if (self._aborted) return

	    if (self.req && self.req._reusedSocket && error.code === 'ECONNRESET'
	        && self.agent.addRequestNoreuse) {
	      self.agent = { addRequest: self.agent.addRequestNoreuse.bind(self.agent) }
	      self.start()
	      self.req.end()
	      return
	    }
	    if (self.timeout && self.timeoutTimer) {
	      clearTimeout(self.timeoutTimer)
	      self.timeoutTimer = null
	    }
	    self.emit('error', error)
	  }

	  self._parserErrorHandler = function (error) {
	    if (this.res) {
	      if (this.res.request) {
	        this.res.request.emit('error', error)
	      } else {
	        this.res.emit('error', error)
	      }
	    } else {
	      this._httpMessage.emit('error', error)
	    }
	  }

	  if (options.form) {
	    self.form(options.form)
	  }

	  if (options.qs) self.qs(options.qs)

	  if (self.uri.path) {
	    self.path = self.uri.path
	  } else {
	    self.path = self.uri.pathname + (self.uri.search || "")
	  }

	  if (self.path.length === 0) self.path = '/'


	  // Auth must happen last in case signing is dependent on other headers
	  if (options.oauth) {
	    self.oauth(options.oauth)
	  }

	  if (options.aws) {
	    self.aws(options.aws)
	  }

	  if (options.hawk) {
	    self.hawk(options.hawk)
	  }

	  if (options.httpSignature) {
	    self.httpSignature(options.httpSignature)
	  }

	  if (options.auth) {
	    self.auth(
	      (options.auth.user==="") ? options.auth.user : (options.auth.user || options.auth.username ),
	      options.auth.pass || options.auth.password,
	      options.auth.sendImmediately)
	  }

	  if (self.uri.auth && !self.hasHeader('authorization')) {
	    var authPieces = self.uri.auth.split(':').map(function(item){ return querystring.unescape(item) })
	    self.auth(authPieces[0], authPieces.slice(1).join(':'), true)
	  }
	  if (self.proxy && self.proxy.auth && !self.hasHeader('proxy-authorization') && !self.tunnel) {
	    self.setHeader('proxy-authorization', "Basic " + toBase64(self.proxy.auth.split(':').map(function(item){ return querystring.unescape(item)}).join(':')))
	  }


	  if (self.proxy && !self.tunnel) self.path = (self.uri.protocol + '//' + self.uri.host + self.path)

	  if (options.json) {
	    self.json(options.json)
	  } else if (options.multipart) {
	    self.boundary = uuid()
	    self.multipart(options.multipart)
	  }

	  if (self.body) {
	    var length = 0
	    if (!Buffer.isBuffer(self.body)) {
	      if (Array.isArray(self.body)) {
	        for (var i = 0; i < self.body.length; i++) {
	          length += self.body[i].length
	        }
	      } else {
	        self.body = new Buffer(self.body)
	        length = self.body.length
	      }
	    } else {
	      length = self.body.length
	    }
	    if (length) {
	      if (!self.hasHeader('content-length')) self.setHeader('content-length', length)
	    } else {
	      throw new Error('Argument error, options.body.')
	    }
	  }

	  var protocol = self.proxy && !self.tunnel ? self.proxy.protocol : self.uri.protocol
	    , defaultModules = {'http:':http, 'https:':https}
	    , httpModules = self.httpModules || {}
	    ;
	  self.httpModule = httpModules[protocol] || defaultModules[protocol]

	  if (!self.httpModule) return this.emit('error', new Error("Invalid protocol"))

	  if (options.ca) self.ca = options.ca

	  if (!self.agent) {
	    if (options.agentOptions) self.agentOptions = options.agentOptions

	    if (options.agentClass) {
	      self.agentClass = options.agentClass
	    } else if (options.forever) {
	      self.agentClass = protocol === 'http:' ? ForeverAgent : ForeverAgent.SSL
	    } else {
	      self.agentClass = self.httpModule.Agent
	    }
	  }

	  if (self.pool === false) {
	    self.agent = false
	  } else {
	    self.agent = self.agent || self.getAgent()
	    if (self.maxSockets) {
	      // Don't use our pooling if node has the refactored client
	      self.agent.maxSockets = self.maxSockets
	    }
	    if (self.pool.maxSockets) {
	      // Don't use our pooling if node has the refactored client
	      self.agent.maxSockets = self.pool.maxSockets
	    }
	  }

	  self.on('pipe', function (src) {
	    if (self.ntick && self._started) throw new Error("You cannot pipe to this stream after the outbound request has started.")
	    self.src = src
	    if (isReadStream(src)) {
	      if (!self.hasHeader('content-type')) self.setHeader('content-type', mime.lookup(src.path))
	    } else {
	      if (src.headers) {
	        for (var i in src.headers) {
	          if (!self.hasHeader(i)) {
	            self.setHeader(i, src.headers[i])
	          }
	        }
	      }
	      if (self._json && !self.hasHeader('content-type'))
	        self.setHeader('content-type', 'application/json')
	      if (src.method && !self.explicitMethod) {
	        self.method = src.method
	      }
	    }

	    // self.on('pipe', function () {
	    //   console.error("You have already piped to this stream. Pipeing twice is likely to break the request.")
	    // })
	  })

	  process.nextTick(function () {
	    if (self._aborted) return

	    if (self._form) {
	      self.setHeaders(self._form.getHeaders())
	      self._form.pipe(self)
	    }
	    if (self.body) {
	      if (Array.isArray(self.body)) {
	        self.body.forEach(function (part) {
	          self.write(part)
	        })
	      } else {
	        self.write(self.body)
	      }
	      self.end()
	    } else if (self.requestBodyStream) {
	      console.warn("options.requestBodyStream is deprecated, please pass the request object to stream.pipe.")
	      self.requestBodyStream.pipe(self)
	    } else if (!self.src) {
	      if (self.method !== 'GET' && typeof self.method !== 'undefined') {
	        self.setHeader('content-length', 0)
	      }
	      self.end()
	    }
	    self.ntick = true
	  })
	}

	// Must call this when following a redirect from https to http or vice versa
	// Attempts to keep everything as identical as possible, but update the
	// httpModule, Tunneling agent, and/or Forever Agent in use.
	Request.prototype._updateProtocol = function () {
	  var self = this
	  var protocol = self.uri.protocol

	  if (protocol === 'https:') {
	    // previously was doing http, now doing https
	    // if it's https, then we might need to tunnel now.
	    if (self.proxy) {
	      self.tunnel = true
	      var tunnelFn = self.proxy.protocol === 'http:'
	                   ? tunnel.httpsOverHttp : tunnel.httpsOverHttps
	      var tunnelOptions = { proxy: { host: self.proxy.hostname
	                                   , port: +self.proxy.port
	                                   , proxyAuth: self.proxy.auth }
	                          , rejectUnauthorized: self.rejectUnauthorized
	                          , ca: self.ca }
	      self.agent = tunnelFn(tunnelOptions)
	      return
	    }

	    self.httpModule = https
	    switch (self.agentClass) {
	      case ForeverAgent:
	        self.agentClass = ForeverAgent.SSL
	        break
	      case http.Agent:
	        self.agentClass = https.Agent
	        break
	      default:
	        // nothing we can do.  Just hope for the best.
	        return
	    }

	    // if there's an agent, we need to get a new one.
	    if (self.agent) self.agent = self.getAgent()

	  } else {
	    // previously was doing https, now doing http
	    // stop any tunneling.
	    if (self.tunnel) self.tunnel = false
	    self.httpModule = http
	    switch (self.agentClass) {
	      case ForeverAgent.SSL:
	        self.agentClass = ForeverAgent
	        break
	      case https.Agent:
	        self.agentClass = http.Agent
	        break
	      default:
	        // nothing we can do.  just hope for the best
	        return
	    }

	    // if there's an agent, then get a new one.
	    if (self.agent) {
	      self.agent = null
	      self.agent = self.getAgent()
	    }
	  }
	}

	Request.prototype.getAgent = function () {
	  var Agent = this.agentClass
	  var options = {}
	  if (this.agentOptions) {
	    for (var i in this.agentOptions) {
	      options[i] = this.agentOptions[i]
	    }
	  }
	  if (this.ca) options.ca = this.ca
	  if (typeof this.rejectUnauthorized !== 'undefined') options.rejectUnauthorized = this.rejectUnauthorized

	  if (this.cert && this.key) {
	    options.key = this.key
	    options.cert = this.cert
	  }

	  var poolKey = ''

	  // different types of agents are in different pools
	  if (Agent !== this.httpModule.Agent) {
	    poolKey += Agent.name
	  }

	  if (!this.httpModule.globalAgent) {
	    // node 0.4.x
	    options.host = this.host
	    options.port = this.port
	    if (poolKey) poolKey += ':'
	    poolKey += this.host + ':' + this.port
	  }

	  // ca option is only relevant if proxy or destination are https
	  var proxy = this.proxy
	  if (typeof proxy === 'string') proxy = url.parse(proxy)
	  var isHttps = (proxy && proxy.protocol === 'https:') || this.uri.protocol === 'https:'
	  if (isHttps) {
	    if (options.ca) {
	      if (poolKey) poolKey += ':'
	      poolKey += options.ca
	    }

	    if (typeof options.rejectUnauthorized !== 'undefined') {
	      if (poolKey) poolKey += ':'
	      poolKey += options.rejectUnauthorized
	    }

	    if (options.cert)
	      poolKey += options.cert.toString('ascii') + options.key.toString('ascii')

	    if (options.ciphers) {
	      if (poolKey) poolKey += ':'
	      poolKey += options.ciphers
	    }

	    if (options.secureOptions) {
	      if (poolKey) poolKey += ':'
	      poolKey += options.secureOptions
	    }
	  }

	  if (this.pool === globalPool && !poolKey && Object.keys(options).length === 0 && this.httpModule.globalAgent) {
	    // not doing anything special.  Use the globalAgent
	    return this.httpModule.globalAgent
	  }

	  // we're using a stored agent.  Make sure it's protocol-specific
	  poolKey = this.uri.protocol + poolKey

	  // already generated an agent for this setting
	  if (this.pool[poolKey]) return this.pool[poolKey]

	  return this.pool[poolKey] = new Agent(options)
	}

	Request.prototype.start = function () {
	  // start() is called once we are ready to send the outgoing HTTP request.
	  // this is usually called on the first write(), end() or on nextTick()
	  var self = this

	  if (self._aborted) return

	  self._started = true
	  self.method = self.method || 'GET'
	  self.href = self.uri.href

	  if (self.src && self.src.stat && self.src.stat.size && !self.hasHeader('content-length')) {
	    self.setHeader('content-length', self.src.stat.size)
	  }
	  if (self._aws) {
	    self.aws(self._aws, true)
	  }

	  // We have a method named auth, which is completely different from the http.request
	  // auth option.  If we don't remove it, we're gonna have a bad time.
	  var reqOptions = copy(self)
	  delete reqOptions.auth

	  debug('make request', self.uri.href)
	  self.req = self.httpModule.request(reqOptions, self.onResponse.bind(self))

	  if (self.timeout && !self.timeoutTimer) {
	    self.timeoutTimer = setTimeout(function () {
	      self.req.abort()
	      var e = new Error("ETIMEDOUT")
	      e.code = "ETIMEDOUT"
	      self.emit("error", e)
	    }, self.timeout)

	    // Set additional timeout on socket - in case if remote
	    // server freeze after sending headers
	    if (self.req.setTimeout) { // only works on node 0.6+
	      self.req.setTimeout(self.timeout, function () {
	        if (self.req) {
	          self.req.abort()
	          var e = new Error("ESOCKETTIMEDOUT")
	          e.code = "ESOCKETTIMEDOUT"
	          self.emit("error", e)
	        }
	      })
	    }
	  }

	  self.req.on('error', self.clientErrorHandler)
	  self.req.on('drain', function() {
	    self.emit('drain')
	  })
	  self.on('end', function() {
	    if ( self.req.connection ) self.req.connection.removeListener('error', self._parserErrorHandler)
	  })
	  self.emit('request', self.req)
	}
	Request.prototype.onResponse = function (response) {
	  var self = this
	  debug('onResponse', self.uri.href, response.statusCode, response.headers)
	  response.on('end', function() {
	    debug('response end', self.uri.href, response.statusCode, response.headers)
	  });

	  if (response.connection.listeners('error').indexOf(self._parserErrorHandler) === -1) {
	    response.connection.once('error', self._parserErrorHandler)
	  }
	  if (self._aborted) {
	    debug('aborted', self.uri.href)
	    response.resume()
	    return
	  }
	  if (self._paused) response.pause()
	  else response.resume()

	  self.response = response
	  response.request = self
	  response.toJSON = toJSON

	  // XXX This is different on 0.10, because SSL is strict by default
	  if (self.httpModule === https &&
	      self.strictSSL &&
	      !response.client.authorized) {
	    debug('strict ssl error', self.uri.href)
	    var sslErr = response.client.authorizationError
	    self.emit('error', new Error('SSL Error: '+ sslErr))
	    return
	  }

	  if (self.setHost && self.hasHeader('host')) delete self.headers[self.hasHeader('host')]
	  if (self.timeout && self.timeoutTimer) {
	    clearTimeout(self.timeoutTimer)
	    self.timeoutTimer = null
	  }

	  var addCookie = function (cookie) {
	    if (self._jar){
	      if(self._jar.add){
	        self._jar.add(new Cookie(cookie))
	      }
	      else cookieJar.add(new Cookie(cookie))
	    }

	  }

	  if (hasHeader('set-cookie', response.headers) && (!self._disableCookies)) {
	    var headerName = hasHeader('set-cookie', response.headers)
	    if (Array.isArray(response.headers[headerName])) response.headers[headerName].forEach(addCookie)
	    else addCookie(response.headers[headerName])
	  }

	  var redirectTo = null
	  if (response.statusCode >= 300 && response.statusCode < 400 && hasHeader('location', response.headers)) {
	    var location = response.headers[hasHeader('location', response.headers)]
	    debug('redirect', location)

	    if (self.followAllRedirects) {
	      redirectTo = location
	    } else if (self.followRedirect) {
	      switch (self.method) {
	        case 'PATCH':
	        case 'PUT':
	        case 'POST':
	        case 'DELETE':
	          // Do not follow redirects
	          break
	        default:
	          redirectTo = location
	          break
	      }
	    }
	  } else if (response.statusCode == 401 && self._hasAuth && !self._sentAuth) {
	    var authHeader = response.headers[hasHeader('www-authenticate', response.headers)]
	    var authVerb = authHeader && authHeader.split(' ')[0]
	    debug('reauth', authVerb)

	    switch (authVerb) {
	      case 'Basic':
	        self.auth(self._user, self._pass, true)
	        redirectTo = self.uri
	        break

	      case 'Digest':
	        // TODO: More complete implementation of RFC 2617.  For reference:
	        // http://tools.ietf.org/html/rfc2617#section-3
	        // https://github.com/bagder/curl/blob/master/lib/http_digest.c

	        var matches = authHeader.match(/([a-z0-9_-]+)="([^"]+)"/gi)
	        var challenge = {}

	        for (var i = 0; i < matches.length; i++) {
	          var eqPos = matches[i].indexOf('=')
	          var key = matches[i].substring(0, eqPos)
	          var quotedValue = matches[i].substring(eqPos + 1)
	          challenge[key] = quotedValue.substring(1, quotedValue.length - 1)
	        }

	        var ha1 = md5(self._user + ':' + challenge.realm + ':' + self._pass)
	        var ha2 = md5(self.method + ':' + self.uri.path)
	        var digestResponse = md5(ha1 + ':' + challenge.nonce + ':1::auth:' + ha2)
	        var authValues = {
	          username: self._user,
	          realm: challenge.realm,
	          nonce: challenge.nonce,
	          uri: self.uri.path,
	          qop: challenge.qop,
	          response: digestResponse,
	          nc: 1,
	          cnonce: ''
	        }

	        authHeader = []
	        for (var k in authValues) {
	          authHeader.push(k + '="' + authValues[k] + '"')
	        }
	        authHeader = 'Digest ' + authHeader.join(', ')
	        self.setHeader('authorization', authHeader)
	        self._sentAuth = true

	        redirectTo = self.uri
	        break
	    }
	  }

	  if (redirectTo) {
	    debug('redirect to', redirectTo)

	    // ignore any potential response body.  it cannot possibly be useful
	    // to us at this point.
	    if (self._paused) response.resume()

	    if (self._redirectsFollowed >= self.maxRedirects) {
	      self.emit('error', new Error("Exceeded maxRedirects. Probably stuck in a redirect loop "+self.uri.href))
	      return
	    }
	    self._redirectsFollowed += 1

	    if (!isUrl.test(redirectTo)) {
	      redirectTo = url.resolve(self.uri.href, redirectTo)
	    }

	    var uriPrev = self.uri
	    self.uri = url.parse(redirectTo)

	    // handle the case where we change protocol from https to http or vice versa
	    if (self.uri.protocol !== uriPrev.protocol) {
	      self._updateProtocol()
	    }

	    self.redirects.push(
	      { statusCode : response.statusCode
	      , redirectUri: redirectTo
	      }
	    )
	    if (self.followAllRedirects && response.statusCode != 401) self.method = 'GET'
	    // self.method = 'GET' // Force all redirects to use GET || commented out fixes #215
	    delete self.src
	    delete self.req
	    delete self.agent
	    delete self._started
	    if (response.statusCode != 401) {
	      // Remove parameters from the previous response, unless this is the second request
	      // for a server that requires digest authentication.
	      delete self.body
	      delete self._form
	      if (self.headers) {
	        if (self.hasHeader('host')) delete self.headers[self.hasHeader('host')]
	        if (self.hasHeader('content-type')) delete self.headers[self.hasHeader('content-type')]
	        if (self.hasHeader('content-length')) delete self.headers[self.hasHeader('content-length')]
	      }
	    }

	    self.emit('redirect');

	    self.init()
	    return // Ignore the rest of the response
	  } else {
	    self._redirectsFollowed = self._redirectsFollowed || 0
	    // Be a good stream and emit end when the response is finished.
	    // Hack to emit end on close because of a core bug that never fires end
	    response.on('close', function () {
	      if (!self._ended) self.response.emit('end')
	    })

	    if (self.encoding) {
	      if (self.dests.length !== 0) {
	        console.error("Ignoring encoding parameter as this stream is being piped to another stream which makes the encoding option invalid.")
	      } else {
	        response.setEncoding(self.encoding)
	      }
	    }

	    self.emit('response', response)

	    self.dests.forEach(function (dest) {
	      self.pipeDest(dest)
	    })

	    response.on("data", function (chunk) {
	      self._destdata = true
	      self.emit("data", chunk)
	    })
	    response.on("end", function (chunk) {
	      self._ended = true
	      self.emit("end", chunk)
	    })
	    response.on("close", function () {self.emit("close")})

	    if (self.callback) {
	      var buffer = []
	      var bodyLen = 0
	      self.on("data", function (chunk) {
	        buffer.push(chunk)
	        bodyLen += chunk.length
	      })
	      self.on("end", function () {
	        debug('end event', self.uri.href)
	        if (self._aborted) {
	          debug('aborted', self.uri.href)
	          return
	        }

	        if (buffer.length && Buffer.isBuffer(buffer[0])) {
	          debug('has body', self.uri.href, bodyLen)
	          var body = new Buffer(bodyLen)
	          var i = 0
	          buffer.forEach(function (chunk) {
	            chunk.copy(body, i, 0, chunk.length)
	            i += chunk.length
	          })
	          if (self.encoding === null) {
	            response.body = body
	          } else {
	            response.body = body.toString(self.encoding)
	          }
	        } else if (buffer.length) {
	          // The UTF8 BOM [0xEF,0xBB,0xBF] is converted to [0xFE,0xFF] in the JS UTC16/UCS2 representation.
	          // Strip this value out when the encoding is set to 'utf8', as upstream consumers won't expect it and it breaks JSON.parse().
	          if (self.encoding === 'utf8' && buffer[0].length > 0 && buffer[0][0] === "\uFEFF") {
	            buffer[0] = buffer[0].substring(1)
	          }
	          response.body = buffer.join('')
	        }

	        if (self._json) {
	          try {
	            response.body = JSON.parse(response.body)
	          } catch (e) {}
	        }
	        debug('emitting complete', self.uri.href)
	        if(response.body == undefined && !self._json) {
	          response.body = "";
	        }
	        self.emit('complete', response, response.body)
	      })
	    }
	    //if no callback
	    else{
	      self.on("end", function () {
	        if (self._aborted) {
	          debug('aborted', self.uri.href)
	          return
	        }
	        self.emit('complete', response);
	      });
	    }
	  }
	  debug('finish init function', self.uri.href)
	}

	Request.prototype.abort = function () {
	  this._aborted = true

	  if (this.req) {
	    this.req.abort()
	  }
	  else if (this.response) {
	    this.response.abort()
	  }

	  this.emit("abort")
	}

	Request.prototype.pipeDest = function (dest) {
	  var response = this.response
	  // Called after the response is received
	  if (dest.headers && !dest.headersSent) {
	    if (hasHeader('content-type', response.headers)) {
	      var ctname = hasHeader('content-type', response.headers)
	      if (dest.setHeader) dest.setHeader(ctname, response.headers[ctname])
	      else dest.headers[ctname] = response.headers[ctname]
	    }

	    if (hasHeader('content-length', response.headers)) {
	      var clname = hasHeader('content-length', response.headers)
	      if (dest.setHeader) dest.setHeader(clname, response.headers[clname])
	      else dest.headers[clname] = response.headers[clname]
	    }
	  }
	  if (dest.setHeader && !dest.headersSent) {
	    for (var i in response.headers) {
	      dest.setHeader(i, response.headers[i])
	    }
	    dest.statusCode = response.statusCode
	  }
	  if (this.pipefilter) this.pipefilter(response, dest)
	}

	// Composable API
	Request.prototype.setHeader = function (name, value, clobber) {
	  if (clobber === undefined) clobber = true
	  if (clobber || !this.hasHeader(name)) this.headers[name] = value
	  else this.headers[this.hasHeader(name)] += ',' + value
	  return this
	}
	Request.prototype.setHeaders = function (headers) {
	  for (var i in headers) {this.setHeader(i, headers[i])}
	  return this
	}
	Request.prototype.hasHeader = function (header, headers) {
	  var headers = Object.keys(headers || this.headers)
	    , lheaders = headers.map(function (h) {return h.toLowerCase()})
	    ;
	  header = header.toLowerCase()
	  for (var i=0;i<lheaders.length;i++) {
	    if (lheaders[i] === header) return headers[i]
	  }
	  return false
	}

	var hasHeader = Request.prototype.hasHeader

	Request.prototype.qs = function (q, clobber) {
	  var base
	  if (!clobber && this.uri.query) base = qs.parse(this.uri.query)
	  else base = {}

	  for (var i in q) {
	    base[i] = q[i]
	  }

	  if (qs.stringify(base) === ''){
	    return this
	  }

	  this.uri = url.parse(this.uri.href.split('?')[0] + '?' + qs.stringify(base))
	  this.url = this.uri
	  this.path = this.uri.path

	  return this
	}
	Request.prototype.form = function (form) {
	  if (form) {
	    this.setHeader('content-type', 'application/x-www-form-urlencoded; charset=utf-8')
	    this.body = qs.stringify(form).toString('utf8')
	    return this
	  }
	  // create form-data object
	  this._form = new FormData()
	  return this._form
	}
	Request.prototype.multipart = function (multipart) {
	  var self = this
	  self.body = []

	  if (!self.hasHeader('content-type')) {
	    self.setHeader('content-type', 'multipart/related; boundary=' + self.boundary)
	  } else {
	    self.setHeader('content-type', self.headers['content-type'].split(';')[0] + '; boundary=' + self.boundary)
	  }

	  if (!multipart.forEach) throw new Error('Argument error, options.multipart.')

	  if (self.preambleCRLF) {
	    self.body.push(new Buffer('\r\n'))
	  }

	  multipart.forEach(function (part) {
	    var body = part.body
	    if(body == null) throw Error('Body attribute missing in multipart.')
	    delete part.body
	    var preamble = '--' + self.boundary + '\r\n'
	    Object.keys(part).forEach(function (key) {
	      preamble += key + ': ' + part[key] + '\r\n'
	    })
	    preamble += '\r\n'
	    self.body.push(new Buffer(preamble))
	    self.body.push(new Buffer(body))
	    self.body.push(new Buffer('\r\n'))
	  })
	  self.body.push(new Buffer('--' + self.boundary + '--'))
	  return self
	}
	Request.prototype.json = function (val) {
	  var self = this

	  if (!self.hasHeader('accept')) self.setHeader('accept', 'application/json')

	  this._json = true
	  if (typeof val === 'boolean') {
	    if (typeof this.body === 'object') {
	      this.body = safeStringify(this.body)
	      self.setHeader('content-type', 'application/json')
	    }
	  } else {
	    this.body = safeStringify(val)
	    self.setHeader('content-type', 'application/json')
	  }
	  return this
	}
	Request.prototype.getHeader = function (name, headers) {
	  var result, re, match
	  if (!headers) headers = this.headers
	  Object.keys(headers).forEach(function (key) {
	    re = new RegExp(name, 'i')
	    match = key.match(re)
	    if (match) result = headers[key]
	  })
	  return result
	}
	var getHeader = Request.prototype.getHeader

	Request.prototype.auth = function (user, pass, sendImmediately) {
	  if (typeof user !== 'string' || (pass !== undefined && typeof pass !== 'string')) {
	    throw new Error('auth() received invalid user or password')
	  }
	  this._user = user
	  this._pass = pass
	  this._hasAuth = true
	  var header = typeof pass !== 'undefined' ? user + ':' + pass : user
	  if (sendImmediately || typeof sendImmediately == 'undefined') {
	    this.setHeader('authorization', 'Basic ' + toBase64(header))
	    this._sentAuth = true
	  }
	  return this
	}
	Request.prototype.aws = function (opts, now) {
	  if (!now) {
	    this._aws = opts
	    return this
	  }
	  var date = new Date()
	  this.setHeader('date', date.toUTCString())
	  var auth =
	    { key: opts.key
	    , secret: opts.secret
	    , verb: this.method.toUpperCase()
	    , date: date
	    , contentType: this.getHeader('content-type') || ''
	    , md5: this.getHeader('content-md5') || ''
	    , amazonHeaders: aws.canonicalizeHeaders(this.headers)
	    }
	  if (opts.bucket && this.path) {
	    auth.resource = '/' + opts.bucket + this.path
	  } else if (opts.bucket && !this.path) {
	    auth.resource = '/' + opts.bucket
	  } else if (!opts.bucket && this.path) {
	    auth.resource = this.path
	  } else if (!opts.bucket && !this.path) {
	    auth.resource = '/'
	  }
	  auth.resource = aws.canonicalizeResource(auth.resource)
	  this.setHeader('authorization', aws.authorization(auth))

	  return this
	}
	Request.prototype.httpSignature = function (opts) {
	  var req = this
	  httpSignature.signRequest({
	    getHeader: function(header) {
	      return getHeader(header, req.headers)
	    },
	    setHeader: function(header, value) {
	      req.setHeader(header, value)
	    },
	    method: this.method,
	    path: this.path
	  }, opts)
	  debug('httpSignature authorization', this.getHeader('authorization'))

	  return this
	}

	Request.prototype.hawk = function (opts) {
	  this.setHeader('Authorization', hawk.client.header(this.uri, this.method, opts).field)
	}

	Request.prototype.oauth = function (_oauth) {
	  var form
	  if (this.hasHeader('content-type') &&
	      this.getHeader('content-type').slice(0, 'application/x-www-form-urlencoded'.length) ===
	        'application/x-www-form-urlencoded'
	     ) {
	    form = qs.parse(this.body)
	  }
	  if (this.uri.query) {
	    form = qs.parse(this.uri.query)
	  }
	  if (!form) form = {}
	  var oa = {}
	  for (var i in form) oa[i] = form[i]
	  for (var i in _oauth) oa['oauth_'+i] = _oauth[i]
	  if (!oa.oauth_version) oa.oauth_version = '1.0'
	  if (!oa.oauth_timestamp) oa.oauth_timestamp = Math.floor( Date.now() / 1000 ).toString()
	  if (!oa.oauth_nonce) oa.oauth_nonce = uuid().replace(/-/g, '')

	  oa.oauth_signature_method = 'HMAC-SHA1'

	  var consumer_secret = oa.oauth_consumer_secret
	  delete oa.oauth_consumer_secret
	  var token_secret = oa.oauth_token_secret
	  delete oa.oauth_token_secret
	  var timestamp = oa.oauth_timestamp

	  var baseurl = this.uri.protocol + '//' + this.uri.host + this.uri.pathname
	  var signature = oauth.hmacsign(this.method, baseurl, oa, consumer_secret, token_secret)

	  // oa.oauth_signature = signature
	  for (var i in form) {
	    if ( i.slice(0, 'oauth_') in _oauth) {
	      // skip
	    } else {
	      delete oa['oauth_'+i]
	      if (i !== 'x_auth_mode') delete oa[i]
	    }
	  }
	  oa.oauth_timestamp = timestamp
	  var authHeader = 'OAuth '+Object.keys(oa).sort().map(function (i) {return i+'="'+oauth.rfc3986(oa[i])+'"'}).join(',')
	  authHeader += ',oauth_signature="' + oauth.rfc3986(signature) + '"'
	  this.setHeader('Authorization', authHeader)
	  return this
	}
	Request.prototype.jar = function (jar) {
	  var cookies

	  if (this._redirectsFollowed === 0) {
	    this.originalCookieHeader = this.getHeader('cookie')
	  }

	  if (!jar) {
	    // disable cookies
	    cookies = false
	    this._disableCookies = true
	  } else if (jar && jar.get) {
	    // fetch cookie from the user defined cookie jar
	    cookies = jar.get({ url: this.uri.href })
	  } else {
	    // fetch cookie from the global cookie jar
	    cookies = cookieJar.get({ url: this.uri.href })
	  }

	  if (cookies && cookies.length) {
	    var cookieString = cookies.map(function (c) {
	      return c.name + "=" + c.value
	    }).join("; ")

	    if (this.originalCookieHeader) {
	      // Don't overwrite existing Cookie header
	      this.setHeader('cookie', this.originalCookieHeader + '; ' + cookieString)
	    } else {
	      this.setHeader('cookie', cookieString)
	    }
	  }
	  this._jar = jar
	  return this
	}


	// Stream API
	Request.prototype.pipe = function (dest, opts) {
	  if (this.response) {
	    if (this._destdata) {
	      throw new Error("You cannot pipe after data has been emitted from the response.")
	    } else if (this._ended) {
	      throw new Error("You cannot pipe after the response has been ended.")
	    } else {
	      stream.Stream.prototype.pipe.call(this, dest, opts)
	      this.pipeDest(dest)
	      return dest
	    }
	  } else {
	    this.dests.push(dest)
	    stream.Stream.prototype.pipe.call(this, dest, opts)
	    return dest
	  }
	}
	Request.prototype.write = function () {
	  if (!this._started) this.start()
	  return this.req.write.apply(this.req, arguments)
	}
	Request.prototype.end = function (chunk) {
	  if (chunk) this.write(chunk)
	  if (!this._started) this.start()
	  this.req.end()
	}
	Request.prototype.pause = function () {
	  if (!this.response) this._paused = true
	  else this.response.pause.apply(this.response, arguments)
	}
	Request.prototype.resume = function () {
	  if (!this.response) this._paused = false
	  else this.response.resume.apply(this.response, arguments)
	}
	Request.prototype.destroy = function () {
	  if (!this._ended) this.end()
	  else if (this.response) this.response.destroy()
	}

	function toJSON () {
	  return getSafe(this, '__' + (((1+Math.random())*0x10000)|0).toString(16))
	}

	Request.prototype.toJSON = toJSON


	module.exports = Request
	/* WEBPACK VAR INJECTION */}.call(exports, require, require(50).Buffer, require(15)))

/***/ },

/***/ 64:
/***/ function(module, exports, require) {

	/* WEBPACK VAR INJECTION */(function(require, process, __dirname) {var path = require(16);
	var fs = require(19);

	function Mime() {
	  // Map of extension -> mime type
	  this.types = Object.create(null);

	  // Map of mime type -> extension
	  this.extensions = Object.create(null);
	}

	/**
	 * Define mimetype -> extension mappings.  Each key is a mime-type that maps
	 * to an array of extensions associated with the type.  The first extension is
	 * used as the default extension for the type.
	 *
	 * e.g. mime.define({'audio/ogg', ['oga', 'ogg', 'spx']});
	 *
	 * @param map (Object) type definitions
	 */
	Mime.prototype.define = function (map) {
	  for (var type in map) {
	    var exts = map[type];

	    for (var i = 0; i < exts.length; i++) {
	      if (process.env.DEBUG_MIME && this.types[exts]) {
	        console.warn(this._loading.replace(/.*\//, ''), 'changes "' + exts[i] + '" extension type from ' +
	          this.types[exts] + ' to ' + type);
	      }

	      this.types[exts[i]] = type;
	    }

	    // Default extension is the first one we encounter
	    if (!this.extensions[type]) {
	      this.extensions[type] = exts[0];
	    }
	  }
	};

	/**
	 * Load an Apache2-style ".types" file
	 *
	 * This may be called multiple times (it's expected).  Where files declare
	 * overlapping types/extensions, the last file wins.
	 *
	 * @param file (String) path of file to load.
	 */
	Mime.prototype.load = function(file) {

	  this._loading = file;
	  // Read file and split into lines
	  var map = {},
	      content = fs.readFileSync(file, 'ascii'),
	      lines = content.split(/[\r\n]+/);

	  lines.forEach(function(line) {
	    // Clean up whitespace/comments, and split into fields
	    var fields = line.replace(/\s*#.*|^\s*|\s*$/g, '').split(/\s+/);
	    map[fields.shift()] = fields;
	  });

	  this.define(map);

	  this._loading = null;
	};

	/**
	 * Lookup a mime type based on extension
	 */
	Mime.prototype.lookup = function(path, fallback) {
	  var ext = path.replace(/.*[\.\/\\]/, '').toLowerCase();

	  return this.types[ext] || fallback || this.default_type;
	};

	/**
	 * Return file extension associated with a mime type
	 */
	Mime.prototype.extension = function(mimeType) {
	  var type = mimeType.match(/^\s*([^;\s]*)(?:;|\s|$)/)[1].toLowerCase();
	  return this.extensions[type];
	};

	// Default instance
	var mime = new Mime();

	// Load local copy of
	// http://svn.apache.org/repos/asf/httpd/httpd/trunk/docs/conf/mime.types
	mime.load(path.join(__dirname, 'types/mime.types'));

	// Load additional types from node.js community
	mime.load(path.join(__dirname, 'types/node.types'));

	// Default type
	mime.default_type = mime.lookup('bin');

	//
	// Additional API specific to the default instance
	//

	mime.Mime = Mime;

	/**
	 * Lookup a charset based on mime type.
	 */
	mime.charsets = {
	  lookup: function(mimeType, fallback) {
	    // Assume text types are utf8
	    return (/^text\//).test(mimeType) ? 'UTF-8' : fallback;
	  }
	};

	module.exports = mime;
	
	/* WEBPACK VAR INJECTION */}.call(exports, require, require(15), "/"))

/***/ },

/***/ 65:
/***/ function(module, exports, require) {

	exports.readIEEE754 = function(buffer, offset, isBE, mLen, nBytes) {
	  var e, m,
	      eLen = nBytes * 8 - mLen - 1,
	      eMax = (1 << eLen) - 1,
	      eBias = eMax >> 1,
	      nBits = -7,
	      i = isBE ? 0 : (nBytes - 1),
	      d = isBE ? 1 : -1,
	      s = buffer[offset + i];

	  i += d;

	  e = s & ((1 << (-nBits)) - 1);
	  s >>= (-nBits);
	  nBits += eLen;
	  for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8);

	  m = e & ((1 << (-nBits)) - 1);
	  e >>= (-nBits);
	  nBits += mLen;
	  for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8);

	  if (e === 0) {
	    e = 1 - eBias;
	  } else if (e === eMax) {
	    return m ? NaN : ((s ? -1 : 1) * Infinity);
	  } else {
	    m = m + Math.pow(2, mLen);
	    e = e - eBias;
	  }
	  return (s ? -1 : 1) * m * Math.pow(2, e - mLen);
	};

	exports.writeIEEE754 = function(buffer, value, offset, isBE, mLen, nBytes) {
	  var e, m, c,
	      eLen = nBytes * 8 - mLen - 1,
	      eMax = (1 << eLen) - 1,
	      eBias = eMax >> 1,
	      rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0),
	      i = isBE ? (nBytes - 1) : 0,
	      d = isBE ? -1 : 1,
	      s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0;

	  value = Math.abs(value);

	  if (isNaN(value) || value === Infinity) {
	    m = isNaN(value) ? 1 : 0;
	    e = eMax;
	  } else {
	    e = Math.floor(Math.log(value) / Math.LN2);
	    if (value * (c = Math.pow(2, -e)) < 1) {
	      e--;
	      c *= 2;
	    }
	    if (e + eBias >= 1) {
	      value += rt / c;
	    } else {
	      value += rt * Math.pow(2, 1 - eBias);
	    }
	    if (value * c >= 2) {
	      e++;
	      c /= 2;
	    }

	    if (e + eBias >= eMax) {
	      m = 0;
	      e = eMax;
	    } else if (e + eBias >= 1) {
	      m = (value * c - 1) * Math.pow(2, mLen);
	      e = e + eBias;
	    } else {
	      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen);
	      e = 0;
	    }
	  }

	  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8);

	  e = (e << mLen) | m;
	  eLen += mLen;
	  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8);

	  buffer[offset + i - d] |= s * 128;
	};


/***/ },

/***/ 66:
/***/ function(module, exports, require) {

	/*
	 * Copyright 2009-2011 Mozilla Foundation and contributors
	 * Licensed under the New BSD license. See LICENSE.txt or:
	 * http://opensource.org/licenses/BSD-3-Clause
	 */
	exports.SourceMapGenerator = require(77).SourceMapGenerator;
	exports.SourceMapConsumer = require(78).SourceMapConsumer;
	exports.SourceNode = require(79).SourceNode;


/***/ },

/***/ 67:
/***/ function(module, exports, require) {

	// UTILITY
	var util = require(17);
	var pSlice = Array.prototype.slice;

	var objectKeys = require(53);
	var isRegExp = require(56);

	// 1. The assert module provides functions that throw
	// AssertionError's when particular conditions are not met. The
	// assert module must conform to the following interface.

	var assert = module.exports = ok;

	// 2. The AssertionError is defined in assert.
	// new assert.AssertionError({ message: message,
	//                             actual: actual,
	//                             expected: expected })

	assert.AssertionError = function AssertionError(options) {
	  this.name = 'AssertionError';
	  this.message = options.message;
	  this.actual = options.actual;
	  this.expected = options.expected;
	  this.operator = options.operator;
	  var stackStartFunction = options.stackStartFunction || fail;

	  if (Error.captureStackTrace) {
	    Error.captureStackTrace(this, stackStartFunction);
	  }
	};
	util.inherits(assert.AssertionError, Error);

	function replacer(key, value) {
	  if (value === undefined) {
	    return '' + value;
	  }
	  if (typeof value === 'number' && (isNaN(value) || !isFinite(value))) {
	    return value.toString();
	  }
	  if (typeof value === 'function' || value instanceof RegExp) {
	    return value.toString();
	  }
	  return value;
	}

	function truncate(s, n) {
	  if (typeof s == 'string') {
	    return s.length < n ? s : s.slice(0, n);
	  } else {
	    return s;
	  }
	}

	assert.AssertionError.prototype.toString = function() {
	  if (this.message) {
	    return [this.name + ':', this.message].join(' ');
	  } else {
	    return [
	      this.name + ':',
	      truncate(JSON.stringify(this.actual, replacer), 128),
	      this.operator,
	      truncate(JSON.stringify(this.expected, replacer), 128)
	    ].join(' ');
	  }
	};

	// assert.AssertionError instanceof Error

	assert.AssertionError.__proto__ = Error.prototype;

	// At present only the three keys mentioned above are used and
	// understood by the spec. Implementations or sub modules can pass
	// other keys to the AssertionError's constructor - they will be
	// ignored.

	// 3. All of the following functions must throw an AssertionError
	// when a corresponding condition is not met, with a message that
	// may be undefined if not provided.  All assertion methods provide
	// both the actual and expected values to the assertion error for
	// display purposes.

	function fail(actual, expected, message, operator, stackStartFunction) {
	  throw new assert.AssertionError({
	    message: message,
	    actual: actual,
	    expected: expected,
	    operator: operator,
	    stackStartFunction: stackStartFunction
	  });
	}

	// EXTENSION! allows for well behaved errors defined elsewhere.
	assert.fail = fail;

	// 4. Pure assertion tests whether a value is truthy, as determined
	// by !!guard.
	// assert.ok(guard, message_opt);
	// This statement is equivalent to assert.equal(true, !!guard,
	// message_opt);. To test strictly for the value true, use
	// assert.strictEqual(true, guard, message_opt);.

	function ok(value, message) {
	  if (!!!value) fail(value, true, message, '==', assert.ok);
	}
	assert.ok = ok;

	// 5. The equality assertion tests shallow, coercive equality with
	// ==.
	// assert.equal(actual, expected, message_opt);

	assert.equal = function equal(actual, expected, message) {
	  if (actual != expected) fail(actual, expected, message, '==', assert.equal);
	};

	// 6. The non-equality assertion tests for whether two objects are not equal
	// with != assert.notEqual(actual, expected, message_opt);

	assert.notEqual = function notEqual(actual, expected, message) {
	  if (actual == expected) {
	    fail(actual, expected, message, '!=', assert.notEqual);
	  }
	};

	// 7. The equivalence assertion tests a deep equality relation.
	// assert.deepEqual(actual, expected, message_opt);

	assert.deepEqual = function deepEqual(actual, expected, message) {
	  if (!_deepEqual(actual, expected)) {
	    fail(actual, expected, message, 'deepEqual', assert.deepEqual);
	  }
	};

	function _deepEqual(actual, expected) {
	  // 7.1. All identical values are equivalent, as determined by ===.
	  if (actual === expected) {
	    return true;

	  } else if (require(50).Buffer.isBuffer(actual) && require(50).Buffer.isBuffer(expected)) {
	    if (actual.length != expected.length) return false;

	    for (var i = 0; i < actual.length; i++) {
	      if (actual[i] !== expected[i]) return false;
	    }

	    return true;

	  // 7.2. If the expected value is a Date object, the actual value is
	  // equivalent if it is also a Date object that refers to the same time.
	  } else if (actual instanceof Date && expected instanceof Date) {
	    return actual.getTime() === expected.getTime();

	  // 7.3 If the expected value is a RegExp object, the actual value is
	  // equivalent if it is also a RegExp object with the same source and
	  // properties (`global`, `multiline`, `lastIndex`, `ignoreCase`).
	  } else if (isRegExp(actual) && isRegExp(expected)) {
	    return actual.source === expected.source &&
	           actual.global === expected.global &&
	           actual.multiline === expected.multiline &&
	           actual.lastIndex === expected.lastIndex &&
	           actual.ignoreCase === expected.ignoreCase;

	  // 7.4. Other pairs that do not both pass typeof value == 'object',
	  // equivalence is determined by ==.
	  } else if (typeof actual != 'object' && typeof expected != 'object') {
	    return actual == expected;

	  // 7.5 For all other Object pairs, including Array objects, equivalence is
	  // determined by having the same number of owned properties (as verified
	  // with Object.prototype.hasOwnProperty.call), the same set of keys
	  // (although not necessarily the same order), equivalent values for every
	  // corresponding key, and an identical 'prototype' property. Note: this
	  // accounts for both named and indexed properties on Arrays.
	  } else {
	    return objEquiv(actual, expected);
	  }
	}

	function isUndefinedOrNull(value) {
	  return value === null || value === undefined;
	}

	function isArguments(object) {
	  return Object.prototype.toString.call(object) == '[object Arguments]';
	}

	function objEquiv(a, b) {
	  if (isUndefinedOrNull(a) || isUndefinedOrNull(b))
	    return false;
	  // an identical 'prototype' property.
	  if (a.prototype !== b.prototype) return false;
	  //~~~I've managed to break Object.keys through screwy arguments passing.
	  //   Converting to array solves the problem.
	  if (isArguments(a)) {
	    if (!isArguments(b)) {
	      return false;
	    }
	    a = pSlice.call(a);
	    b = pSlice.call(b);
	    return _deepEqual(a, b);
	  }
	  try {
	    var ka = objectKeys(a),
	        kb = objectKeys(b),
	        key, i;
	  } catch (e) {//happens when one is a string literal and the other isn't
	    return false;
	  }
	  // having the same number of owned properties (keys incorporates
	  // hasOwnProperty)
	  if (ka.length != kb.length)
	    return false;
	  //the same set of keys (although not necessarily the same order),
	  ka.sort();
	  kb.sort();
	  //~~~cheap key test
	  for (i = ka.length - 1; i >= 0; i--) {
	    if (ka[i] != kb[i])
	      return false;
	  }
	  //equivalent values for every corresponding key, and
	  //~~~possibly expensive deep test
	  for (i = ka.length - 1; i >= 0; i--) {
	    key = ka[i];
	    if (!_deepEqual(a[key], b[key])) return false;
	  }
	  return true;
	}

	// 8. The non-equivalence assertion tests for any deep inequality.
	// assert.notDeepEqual(actual, expected, message_opt);

	assert.notDeepEqual = function notDeepEqual(actual, expected, message) {
	  if (_deepEqual(actual, expected)) {
	    fail(actual, expected, message, 'notDeepEqual', assert.notDeepEqual);
	  }
	};

	// 9. The strict equality assertion tests strict equality, as determined by ===.
	// assert.strictEqual(actual, expected, message_opt);

	assert.strictEqual = function strictEqual(actual, expected, message) {
	  if (actual !== expected) {
	    fail(actual, expected, message, '===', assert.strictEqual);
	  }
	};

	// 10. The strict non-equality assertion tests for strict inequality, as
	// determined by !==.  assert.notStrictEqual(actual, expected, message_opt);

	assert.notStrictEqual = function notStrictEqual(actual, expected, message) {
	  if (actual === expected) {
	    fail(actual, expected, message, '!==', assert.notStrictEqual);
	  }
	};

	function expectedException(actual, expected) {
	  if (!actual || !expected) {
	    return false;
	  }

	  if (isRegExp(expected)) {
	    return expected.test(actual);
	  } else if (actual instanceof expected) {
	    return true;
	  } else if (expected.call({}, actual) === true) {
	    return true;
	  }

	  return false;
	}

	function _throws(shouldThrow, block, expected, message) {
	  var actual;

	  if (typeof expected === 'string') {
	    message = expected;
	    expected = null;
	  }

	  try {
	    block();
	  } catch (e) {
	    actual = e;
	  }

	  message = (expected && expected.name ? ' (' + expected.name + ').' : '.') +
	            (message ? ' ' + message : '.');

	  if (shouldThrow && !actual) {
	    fail(actual, expected, 'Missing expected exception' + message);
	  }

	  if (!shouldThrow && expectedException(actual, expected)) {
	    fail(actual, expected, 'Got unwanted exception' + message);
	  }

	  if ((shouldThrow && actual && expected &&
	      !expectedException(actual, expected)) || (!shouldThrow && actual)) {
	    throw actual;
	  }
	}

	// 11. Expected to throw an error:
	// assert.throws(block, Error_opt, message_opt);

	assert.throws = function(block, /*optional*/error, /*optional*/message) {
	  _throws.apply(this, [true].concat(pSlice.call(arguments)));
	};

	// EXTENSION! This is annoying to write outside this module.
	assert.doesNotThrow = function(block, /*optional*/error, /*optional*/message) {
	  _throws.apply(this, [false].concat(pSlice.call(arguments)));
	};

	assert.ifError = function(err) { if (err) {throw err;}};


/***/ },

/***/ 68:
/***/ function(module, exports, require) {

	/* WEBPACK VAR INJECTION */(function(require, process) {/**
	 * Clean-css - https://github.com/GoalSmashers/clean-css
	 * Released under the terms of MIT license
	 *
	 * Copyright (C) 2011-2013 GoalSmashers.com
	 */

	var fs = require(19);
	var path = require(16);
	var existsSync = fs.existsSync || path.existsSync;

	var CleanCSS = {
	  colors: {
	    toHex: {
	      aqua: '#0ff',
	      black: '#000',
	      blue: '#00f',
	      fuchsia: '#f0f',
	      white: '#fff',
	      yellow: '#ff0'
	    },
	    toName: {
	      '#000080': 'navy',
	      '#008000': 'green',
	      '#008080': 'teal',
	      '#800000': 'maroon',
	      '#800080': 'purple',
	      '#808000': 'olive',
	      '#808080': 'gray',
	      '#c0c0c0': 'silver',
	      '#f00': 'red'
	    }
	  },

	  process: function(data, options) {
	    var context = {
	      specialComments: [],
	      freeTextBlocks: [],
	      urlBlocks: []
	    };
	    var replace = function() {
	      if (typeof arguments[0] == 'function')
	        arguments[0]();
	      else
	        data = data.replace.apply(data, arguments);
	    };
	    var lineBreak = process.platform == 'win32' ? '\r\n' : '\n';
	    this.lineBreak = lineBreak;

	    options = options || {};

	    // * - leave all important comments
	    // 1 - leave first important comment only
	    // 0 - strip all important comments
	    options.keepSpecialComments = 'keepSpecialComments' in options ?
	      options.keepSpecialComments :
	      '*';

	    options.keepBreaks = options.keepBreaks || false;

	    //active by default
	    if (options.processImport === undefined) {
	      options.processImport = true;
	    }

	    // replace function
	    if (options.debug) {
	      var originalReplace = replace;
	      replace = function(pattern, replacement) {
	        var name = typeof pattern == 'function' ?
	          /function (\w+)\(/.exec(pattern.toString())[1] :
	          pattern;

	        var start = process.hrtime();
	        originalReplace(pattern, replacement);

	        var itTook = process.hrtime(start);
	        console.log('%d ms: ' + name, 1000 * itTook[0] + itTook[1] / 1000000.0);
	      };
	    }

	    var removeComments = function() {
	      replace(function stripComments() {
	        data = CleanCSS._stripComments(context, data);
	      });
	    };

	    removeComments();

	    // replace all escaped line breaks
	    replace(/\\(\r\n|\n)/mg, '');

	    if (options.processImport) {
	      // inline all imports
	      replace(function inlineImports() {
	        data = CleanCSS._inlineImports(data, {
	          root: options.root || process.cwd(),
	          relativeTo: options.relativeTo
	        });
	      });

	      // strip comments with inlined imports
	      if (data.indexOf('/*') > -1) {
	        removeComments();
	      }
	    }

	    // strip parentheses in urls if possible (no spaces inside)
	    replace(/url\((['"])([^\)]+)['"]\)/g, function(match, quote, url) {
	      if (url.match(/[ \t]/g) !== null || url.indexOf('data:') === 0)
	        return 'url(' + quote + url + quote + ')';
	      else
	        return 'url(' + url + ')';
	    });

	    // strip parentheses in animation & font names
	    replace(/(animation|animation\-name|font|font\-family):([^;}]+)/g, function(match, propertyName, fontDef) {
	      return propertyName + ':' + fontDef.replace(/['"]([\w\-]+)['"]/g, '$1');
	    });

	    // strip parentheses in @keyframes
	    replace(/@(\-moz\-|\-o\-|\-webkit\-)?keyframes ([^{]+)/g, function(match, prefix, name) {
	      prefix = prefix || '';
	      return '@' + prefix + 'keyframes ' + (name.indexOf(' ') > -1 ? name : name.replace(/['"]/g, ''));
	    });

	    // IE shorter filters, but only if single (IE 7 issue)
	    replace(/progid:DXImageTransform\.Microsoft\.(Alpha|Chroma)(\([^\)]+\))([;}'"])/g, function(match, filter, args, suffix) {
	      return filter.toLowerCase() + args + suffix;
	    });

	    // strip parentheses in attribute values
	    replace(/\[([^\]]+)\]/g, function(match, content) {
	      var eqIndex = content.indexOf('=');
	      if (eqIndex < 0 && content.indexOf('\'') < 0 && content.indexOf('"') < 0)
	        return match;

	      var key = content.substring(0, eqIndex);
	      var value = content.substring(eqIndex + 1, content.length);

	      if (/^['"](?:[a-zA-Z][a-zA-Z\d\-_]+)['"]$/.test(value))
	        return '[' + key + '=' + value.substring(1, value.length - 1) + ']';
	      else
	        return match;
	    });

	    // replace all free text content with a placeholder
	    replace(function stripFreeText() {
	      data = CleanCSS._stripFreeText(context, data);
	    });

	    // replace url(...) with a placeholder
	    replace(function stripUrls() {
	      data = CleanCSS._stripUrls(context, data);
	    });

	    // line breaks
	    if (!options.keepBreaks)
	      replace(/[\r]?\n/g, ' ');

	    // multiple whitespace
	    replace(/[\t ]+/g, ' ');

	    // multiple semicolons (with optional whitespace)
	    replace(/;[ ]?;+/g, ';');

	    // multiple line breaks to one
	    replace(/ (?:\r\n|\n)/g, lineBreak);
	    replace(/(?:\r\n|\n)+/g, lineBreak);

	    // remove spaces around selectors
	    replace(/ ([+~>]) /g, '$1');

	    // remove extra spaces inside content
	    replace(/([!\(\{\}:;=,\n]) /g, '$1');
	    replace(/ ([!\)\{\};=,\n])/g, '$1');
	    replace(/(?:\r\n|\n)\}/g, '}');
	    replace(/([\{;,])(?:\r\n|\n)/g, '$1');
	    replace(/ :([^\{\};]+)([;}])/g, ':$1$2');

	    // restore spaces inside IE filters (IE 7 issue)
	    replace(/progid:[^(]+\(([^\)]+)/g, function(match) {
	      return match.replace(/,/g, ', ');
	    });

	    // trailing semicolons
	    replace(/;\}/g, '}');

	    // hsl to hex colors
	    replace(/hsl\((\d+),(\d+)%?,(\d+)%?\)/g, function(match, hue, saturation, lightness) {
	      var asRgb = CleanCSS._hslToRgb(hue, saturation, lightness);
	      var redAsHex = asRgb[0].toString(16);
	      var greenAsHex = asRgb[1].toString(16);
	      var blueAsHex = asRgb[2].toString(16);

	      return '#' +
	        ((redAsHex.length == 1 ? '0' : '') + redAsHex) +
	        ((greenAsHex.length == 1 ? '0' : '') + greenAsHex) +
	        ((blueAsHex.length == 1 ? '0' : '') + blueAsHex);
	    });

	    // rgb to hex colors
	    replace(/rgb\((\d+),(\d+),(\d+)\)/g, function(match, red, green, blue) {
	      var redAsHex = parseInt(red, 10).toString(16);
	      var greenAsHex = parseInt(green, 10).toString(16);
	      var blueAsHex = parseInt(blue, 10).toString(16);

	      return '#' +
	        ((redAsHex.length == 1 ? '0' : '') + redAsHex) +
	        ((greenAsHex.length == 1 ? '0' : '') + greenAsHex) +
	        ((blueAsHex.length == 1 ? '0' : '') + blueAsHex);
	    });

	    // long hex to short hex colors
	    replace(/([,: \(])#([0-9a-f]{6})/gi, function(match, prefix, color) {
	      if (color[0] == color[1] && color[2] == color[3] && color[4] == color[5])
	        return prefix + '#' + color[0] + color[2] + color[4];
	      else
	        return prefix + '#' + color;
	    });

	    // replace color name with hex values if shorter (or the other way around)
	    ['toHex', 'toName'].forEach(function(type) {
	      var pattern = '(' + Object.keys(CleanCSS.colors[type]).join('|') + ')';
	      var colorSwitcher = function(match, prefix, colorValue, suffix) {
	        return prefix + CleanCSS.colors[type][colorValue.toLowerCase()] + suffix;
	      };
	      replace(new RegExp('([ :,\\(])' + pattern + '([;\\}!\\) ])', 'ig'), colorSwitcher);
	      replace(new RegExp('(,)' + pattern + '(,)', 'ig'), colorSwitcher);
	    });

	    // replace font weight with numerical value
	    replace(/(font|font\-weight):(normal|bold)([ ;\}!])/g, function(match, property, weight, suffix) {
	      if (weight == 'normal')
	        return property + ':400' + suffix;
	      else if (weight == 'bold')
	        return property + ':700' + suffix;
	      else
	        return match;
	    });

	    // zero + unit to zero
	    replace(/(\s|:|,)0(?:px|em|ex|cm|mm|in|pt|pc|%)/g, '$1' + '0');
	    replace(/rect\(0(?:px|em|ex|cm|mm|in|pt|pc|%)/g, 'rect(0');

	    // fraction zeros removal
	    replace(/\.([1-9]*)0+(\D)/g, function(match, nonZeroPart, suffix) {
	      return (nonZeroPart ? '.' : '') + nonZeroPart + suffix;
	    });

	    // restore 0% in hsl/hsla
	    replace(/(hsl|hsla)\(([^\)]+)\)/g, function(match, colorFunction, colorDef) {
	      var tokens = colorDef.split(',');
	      if (tokens[1] == '0')
	        tokens[1] = '0%';
	      if (tokens[2] == '0')
	        tokens[2] = '0%';
	      return colorFunction + '(' + tokens.join(',') + ')';
	    });

	    // none to 0
	    replace(/(border|border-top|border-right|border-bottom|border-left|outline):none/g, '$1:0');

	    // background:none to 0
	    replace(/(background):none([;}])/g, '$1:0$2');

	    // multiple zeros into one
	    replace(/box-shadow:0 0 0 0([^\.])/g, 'box-shadow:0 0$1');
	    replace(/:0 0 0 0([^\.])/g, ':0$1');
	    replace(/([: ,=\-])0\.(\d)/g, '$1.$2');

	    // shorthand notations
	    var shorthandRegex = function(repeats, hasSuffix) {
	      var pattern = '(padding|margin|border\\-width|border\\-color|border\\-style|border\\-radius):';
	      for (var i = 0; i < repeats; i++) {
	        pattern += '([\\d\\w\\.%#\\(\\),]+)' + (i < repeats - 1 ? ' ' : '');
	      }
	      return new RegExp(pattern + (hasSuffix ? '([;}])' : ''), 'g');
	    };

	    // 4 size values into less
	    replace(shorthandRegex(4), function(match, property, size1, size2, size3, size4) {
	      if (size1 === size2 && size1 === size3 && size1 === size4)
	        return property + ':' + size1;
	      else if (size1 === size3 && size2 === size4)
	        return property + ':' + size1 + ' ' + size2;
	      else if (size2 === size4)
	        return property + ':' + size1 + ' ' + size2 + ' ' + size3;
	      else
	        return match;
	    });

	    // 3 size values into less
	    replace(shorthandRegex(3, true), function(match, property, size1, size2, size3, suffix) {
	      if (size1 === size2 && size1 === size3)
	        return property + ':' + size1 + suffix;
	      else if (size1 === size3)
	        return property + ':' + size1 + ' ' + size2 + suffix;
	      else
	        return match;
	    });

	    // same 2 values into one
	    replace(shorthandRegex(2, true), function(match, property, size1, size2, suffix) {
	      if (size1 === size2)
	        return property + ':' + size1 + suffix;
	      else
	        return match;
	    });

	    // restore rect(...) zeros syntax for 4 zeros
	    replace(/rect\(\s?0(\s|,)0[ ,]0[ ,]0\s?\)/g, 'rect(0$10$10$10)');

	    // remove universal selector when not needed (*#id, *.class etc)
	    replace(/\*([\.#:\[])/g, '$1');

	    // Restore spaces inside calc back
	    replace(/calc\([^\}]+\}/g, function(match) {
	      return match.replace(/\+/g, ' + ');
	    });

	    // Restore urls, content content, and special comments (in that order)
	    replace(/__URL__/g, function() {
	      return context.urlBlocks.shift();
	    });

	    replace(/__CSSFREETEXT__/g, function() {
	      return context.freeTextBlocks.shift();
	    });

	    var specialCommentsCount = context.specialComments.length;
	    var breakSuffix = options.keepBreaks ? lineBreak : '';
	    replace(new RegExp('__CSSCOMMENT__(' + lineBreak + '| )?', 'g'), function() {
	      switch (options.keepSpecialComments) {
	        case '*':
	          return context.specialComments.shift() + breakSuffix;
	        case 1:
	          return context.specialComments.length == specialCommentsCount ?
	            context.specialComments.shift() + breakSuffix :
	            '';
	        case 0:
	          return '';
	      }
	    });

	    // move first charset to the beginning
	    replace(function moveCharset() {
	      // get first charset in stylesheet
	      var match = data.match(/@charset [^;]+;/);
	      var firstCharset = match ? match[0] : null;
	      if (!firstCharset)
	        return;

	      // reattach first charset and remove all subsequent
	      data = firstCharset +
	        (options.keepBreaks ? lineBreak : '') +
	        data.replace(new RegExp('@charset [^;]+;(' + lineBreak + ')?', 'g'), '');
	    });

	    if (options.removeEmpty) {
	      // empty elements
	      replace(/[^\{\}]+\{\}/g, '');

	      // empty @media declarations
	      replace(/@media [^\{]+\{\}/g, '');
	    }

	    // trim spaces at beginning and end
	    return data.trim();
	  },

	  // Inlines all imports taking care of repetitions, unknown files, and cilcular dependencies
	  _inlineImports: function(data, options) {
	    var tempData = [];
	    var nextStart = 0;
	    var nextEnd = 0;
	    var cursor = 0;

	    options.relativeTo = options.relativeTo || options.root;
	    options._baseRelativeTo = options._baseRelativeTo || options.relativeTo;
	    options.visited = options.visited || [];

	    var inlinedFile = function() {
	      var importedFile = data
	        .substring(data.indexOf(' ', nextStart) + 1, nextEnd)
	        .replace(/^url\(/, '')
	        .replace(/\)$/, '')
	        .replace(/['"]/g, '');

	      if (/^(http|https):\/\//.test(importedFile) || /^\/\//.test(importedFile))
	        return '@import url(' + importedFile + ');';

	      var relativeTo = importedFile[0] == '/' ?
	        options.root :
	        options.relativeTo;

	      var fullPath = path.resolve(path.join(relativeTo, importedFile));

	      if (existsSync(fullPath) && fs.statSync(fullPath).isFile() && options.visited.indexOf(fullPath) == -1) {
	        options.visited.push(fullPath);

	        var importedData = fs.readFileSync(fullPath, 'utf8');
	        var importRelativeTo = path.dirname(fullPath);
	        importedData = CleanCSS._rebaseRelativeURLs(importedData, importRelativeTo, options._baseRelativeTo);
	        return CleanCSS._inlineImports(importedData, {
	          root: options.root,
	          relativeTo: importRelativeTo,
	          _baseRelativeTo: options.baseRelativeTo,
	          visited: options.visited
	        });
	      } else {
	        return '';
	      }
	    };

	    for (; nextEnd < data.length; ) {
	      nextStart = data.indexOf('@import', cursor);
	      if (nextStart == -1)
	        break;

	      nextEnd = data.indexOf(';', nextStart);
	      if (nextEnd == -1)
	        break;

	      tempData.push(data.substring(cursor, nextStart));
	      tempData.push(inlinedFile());
	      cursor = nextEnd + 1;
	    }

	    return tempData.length > 0 ?
	      tempData.join('') + data.substring(cursor, data.length) :
	      data;
	  },

	  _rebaseRelativeURLs: function(data, fromBase, toBase) {
	    var tempData = [];
	    var nextStart = 0;
	    var nextEnd = 0;
	    var cursor = 0;

	    for (; nextEnd < data.length; ) {
	      nextStart = data.indexOf('url(', nextEnd);
	      if (nextStart == -1)
	        break;
	      nextEnd = data.indexOf(')', nextStart + 4);
	      if (nextEnd == -1)
	        break;

	      tempData.push(data.substring(cursor, nextStart));
	      var url = data.substring(nextStart + 4, nextEnd).replace(/['"]/g, '');
	      if (url[0] != '/' && url.indexOf('data:') !== 0 && url.substring(url.length - 4) != '.css') {
	        url = path.relative(toBase, path.join(fromBase, url)).replace(/\\/g, '/');
	      }
	      tempData.push('url(' + url + ')');
	      cursor = nextEnd + 1;
	    }

	    return tempData.length > 0 ?
	      tempData.join('') + data.substring(cursor, data.length) :
	      data;
	  },

	  // Strip special comments (/*! ... */) by replacing them by __CSSCOMMENT__ marker
	  // for further restoring. Plain comments are removed. It's done by scanning datq using
	  // String#indexOf scanning instead of regexps to speed up the process.
	  _stripComments: function(context, data) {
	    var tempData = [];
	    var nextStart = 0;
	    var nextEnd = 0;
	    var cursor = 0;

	    for (; nextEnd < data.length; ) {
	      nextStart = data.indexOf('/*', nextEnd);
	      nextEnd = data.indexOf('*/', nextStart + 2);
	      if (nextStart == -1 || nextEnd == -1)
	        break;

	      tempData.push(data.substring(cursor, nextStart));
	      if (data[nextStart + 2] == '!') {
	        // in case of special comments, replace them with a placeholder
	        context.specialComments.push(data.substring(nextStart, nextEnd + 2));
	        tempData.push('__CSSCOMMENT__');
	      }
	      cursor = nextEnd + 2;
	    }

	    return tempData.length > 0 ?
	      tempData.join('') + data.substring(cursor, data.length) :
	      data;
	  },

	  // Strip content tags by replacing them by the __CSSFREETEXT__
	  // marker for further restoring. It's done via string scanning
	  // instead of regexps to speed up the process.
	  _stripFreeText: function(context, data) {
	    var tempData = [];
	    var nextStart = 0;
	    var nextEnd = 0;
	    var cursor = 0;
	    var matchedParenthesis = null;
	    var singleParenthesis = "'";
	    var doubleParenthesis = '"';
	    var dataLength = data.length;

	    for (; nextEnd < data.length; ) {
	      var nextStartSingle = data.indexOf(singleParenthesis, nextEnd + 1);
	      var nextStartDouble = data.indexOf(doubleParenthesis, nextEnd + 1);

	      if (nextStartSingle == -1)
	        nextStartSingle = dataLength;
	      if (nextStartDouble == -1)
	        nextStartDouble = dataLength;

	      if (nextStartSingle < nextStartDouble) {
	        nextStart = nextStartSingle;
	        matchedParenthesis = singleParenthesis;
	      } else {
	        nextStart = nextStartDouble;
	        matchedParenthesis = doubleParenthesis;
	      }

	      if (nextStart == -1)
	        break;

	      nextEnd = data.indexOf(matchedParenthesis, nextStart + 1);
	      if (nextStart == -1 || nextEnd == -1)
	        break;

	      tempData.push(data.substring(cursor, nextStart));
	      tempData.push('__CSSFREETEXT__');
	      context.freeTextBlocks.push(data.substring(nextStart, nextEnd + 1));
	      cursor = nextEnd + 1;
	    }

	    return tempData.length > 0 ?
	      tempData.join('') + data.substring(cursor, data.length) :
	      data;
	  },

	  // Strip urls by replacing them by the __URL__
	  // marker for further restoring. It's done via string scanning
	  // instead of regexps to speed up the process.
	  _stripUrls: function(context, data) {
	    var nextStart = 0;
	    var nextEnd = 0;
	    var cursor = 0;
	    var tempData = [];

	    for (; nextEnd < data.length; ) {
	      nextStart = data.indexOf('url(', nextEnd);
	      if (nextStart == -1)
	        break;

	      nextEnd = data.indexOf(')', nextStart);

	      tempData.push(data.substring(cursor, nextStart));
	      tempData.push('__URL__');
	      context.urlBlocks.push(data.substring(nextStart, nextEnd + 1));
	      cursor = nextEnd + 1;
	    }

	    return tempData.length > 0 ?
	      tempData.join('') + data.substring(cursor, data.length) :
	      data;
	  },

	  // HSL to RGB converter. Both methods taken and adapted from:
	  // http://mjijackson.com/2008/02/rgb-to-hsl-and-rgb-to-hsv-color-model-conversion-algorithms-in-javascript
	  _hslToRgb: function(h, s, l) {
	    var r, g, b;

	    h = ~~h / 360;
	    s = ~~s / 100;
	    l = ~~l / 100;

	    if (s === 0) {
	      r = g = b = l; // achromatic
	    } else {
	      var q = l < 0.5 ?
	        l * (1 + s) :
	        l + s - l * s;
	      var p = 2 * l - q;
	      r = this._hueToRgb(p, q, h + 1/3);
	      g = this._hueToRgb(p, q, h);
	      b = this._hueToRgb(p, q, h - 1/3);
	    }

	    return [~~(r * 255), ~~(g * 255), ~~(b * 255)];
	  },

	  _hueToRgb: function(p, q, t) {
	    if (t < 0) t += 1;
	    if (t > 1) t -= 1;
	    if (t < 1/6) return p + (q - p) * 6 * t;
	    if (t < 1/2) return q;
	    if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
	    return p;
	  }
	};

	module.exports = CleanCSS;
	
	/* WEBPACK VAR INJECTION */}.call(exports, require, require(15)))

/***/ },

/***/ 69:
/***/ function(module, exports, require) {

	/*!
	 * Tobi - Cookie
	 * Copyright(c) 2010 LearnBoost <dev@learnboost.com>
	 * MIT Licensed
	 */

	/**
	 * Module dependencies.
	 */

	var url = require(18);

	/**
	 * Initialize a new `Cookie` with the given cookie `str` and `req`.
	 *
	 * @param {String} str
	 * @param {IncomingRequest} req
	 * @api private
	 */

	var Cookie = exports = module.exports = function Cookie(str, req) {
	  this.str = str;

	  // Map the key/val pairs
	  str.split(/ *; */).reduce(function(obj, pair){
	   var p = pair.indexOf('=');
	   var key = p > 0 ? pair.substring(0, p).trim() : pair.trim();
	   var lowerCasedKey = key.toLowerCase();
	   var value = p > 0 ? pair.substring(p + 1).trim() : true;

	   if (!obj.name) {
	    // First key is the name
	    obj.name = key;
	    obj.value = value;
	   }
	   else if (lowerCasedKey === 'httponly') {
	    obj.httpOnly = value;
	   }
	   else {
	    obj[lowerCasedKey] = value;
	   }
	   return obj;
	  }, this);

	  // Expires
	  this.expires = this.expires
	    ? new Date(this.expires)
	    : Infinity;

	  // Default or trim path
	  this.path = this.path
	    ? this.path.trim(): req 
	    ? url.parse(req.url).pathname: '/';
	};

	/**
	 * Return the original cookie string.
	 *
	 * @return {String}
	 * @api public
	 */

	Cookie.prototype.toString = function(){
	  return this.str;
	};

	module.exports.Jar = require(87)

/***/ },

/***/ 70:
/***/ function(module, exports, require) {

	var http = module.exports;
	var EventEmitter = require(20).EventEmitter;
	var Request = require(88);

	http.request = function (params, cb) {
	    if (!params) params = {};
	    if (!params.host) params.host = window.location.host.split(':')[0];
	    if (!params.port) params.port = window.location.port;
	    
	    var req = new Request(new xhrHttp, params);
	    if (cb) req.on('response', cb);
	    return req;
	};

	http.get = function (params, cb) {
	    params.method = 'GET';
	    var req = http.request(params, cb);
	    req.end();
	    return req;
	};

	http.Agent = function () {};
	http.Agent.defaultMaxSockets = 4;

	var xhrHttp = (function () {
	    if (typeof window === 'undefined') {
	        throw new Error('no window object present');
	    }
	    else if (window.XMLHttpRequest) {
	        return window.XMLHttpRequest;
	    }
	    else if (window.ActiveXObject) {
	        var axs = [
	            'Msxml2.XMLHTTP.6.0',
	            'Msxml2.XMLHTTP.3.0',
	            'Microsoft.XMLHTTP'
	        ];
	        for (var i = 0; i < axs.length; i++) {
	            try {
	                var ax = new(window.ActiveXObject)(axs[i]);
	                return function () {
	                    if (ax) {
	                        var ax_ = ax;
	                        ax = null;
	                        return ax_;
	                    }
	                    else {
	                        return new(window.ActiveXObject)(axs[i]);
	                    }
	                };
	            }
	            catch (e) {}
	        }
	        throw new Error('ajax not supported in this browser')
	    }
	    else {
	        throw new Error('ajax not supported in this browser');
	    }
	})();


/***/ },

/***/ 71:
/***/ function(module, exports, require) {

	var events = require(20);
	var util = require(17);

	function Stream() {
	  events.EventEmitter.call(this);
	}
	util.inherits(Stream, events.EventEmitter);
	module.exports = Stream;
	// Backwards-compat with node 0.4.x
	Stream.Stream = Stream;

	Stream.prototype.pipe = function(dest, options) {
	  var source = this;

	  function ondata(chunk) {
	    if (dest.writable) {
	      if (false === dest.write(chunk) && source.pause) {
	        source.pause();
	      }
	    }
	  }

	  source.on('data', ondata);

	  function ondrain() {
	    if (source.readable && source.resume) {
	      source.resume();
	    }
	  }

	  dest.on('drain', ondrain);

	  // If the 'end' option is not supplied, dest.end() will be called when
	  // source gets the 'end' or 'close' events.  Only dest.end() once, and
	  // only when all sources have ended.
	  if (!dest._isStdio && (!options || options.end !== false)) {
	    dest._pipeCount = dest._pipeCount || 0;
	    dest._pipeCount++;

	    source.on('end', onend);
	    source.on('close', onclose);
	  }

	  var didOnEnd = false;
	  function onend() {
	    if (didOnEnd) return;
	    didOnEnd = true;

	    dest._pipeCount--;

	    // remove the listeners
	    cleanup();

	    if (dest._pipeCount > 0) {
	      // waiting for other incoming streams to end.
	      return;
	    }

	    dest.end();
	  }


	  function onclose() {
	    if (didOnEnd) return;
	    didOnEnd = true;

	    dest._pipeCount--;

	    // remove the listeners
	    cleanup();

	    if (dest._pipeCount > 0) {
	      // waiting for other incoming streams to end.
	      return;
	    }

	    dest.destroy();
	  }

	  // don't leave dangling pipes when there are errors.
	  function onerror(er) {
	    cleanup();
	    if (this.listeners('error').length === 0) {
	      throw er; // Unhandled stream error in pipe.
	    }
	  }

	  source.on('error', onerror);
	  dest.on('error', onerror);

	  // remove all the event listeners that were added.
	  function cleanup() {
	    source.removeListener('data', ondata);
	    dest.removeListener('drain', ondrain);

	    source.removeListener('end', onend);
	    source.removeListener('close', onclose);

	    source.removeListener('error', onerror);
	    dest.removeListener('error', onerror);

	    source.removeListener('end', cleanup);
	    source.removeListener('close', cleanup);

	    dest.removeListener('end', cleanup);
	    dest.removeListener('close', cleanup);
	  }

	  source.on('end', cleanup);
	  source.on('close', cleanup);

	  dest.on('end', cleanup);
	  dest.on('close', cleanup);

	  dest.emit('pipe', source);

	  // Allow for unix-like usage: A.pipe(B).pipe(C)
	  return dest;
	};


/***/ },

/***/ 72:
/***/ function(module, exports, require) {

	var sha = require(89)
	var rng = require(90)
	var md5 = require(91)

	var algorithms = {
	  sha1: {
	    hex: sha.hex_sha1,
	    binary: sha.b64_sha1,
	    ascii: sha.str_sha1
	  },
	  md5: {
	    hex: md5.hex_md5,
	    binary: md5.b64_md5,
	    ascii: md5.any_md5
	  }
	}

	function error () {
	  var m = [].slice.call(arguments).join(' ')
	  throw new Error([
	    m,
	    'we accept pull requests',
	    'http://github.com/dominictarr/crypto-browserify'
	    ].join('\n'))
	}

	exports.createHash = function (alg) {
	  alg = alg || 'sha1'
	  if(!algorithms[alg])
	    error('algorithm:', alg, 'is not yet supported')
	  var s = ''
	  var _alg = algorithms[alg]
	  return {
	    update: function (data) {
	      s += data
	      return this
	    },
	    digest: function (enc) {
	      enc = enc || 'binary'
	      var fn
	      if(!(fn = _alg[enc]))
	        error('encoding:', enc , 'is not yet supported for algorithm', alg)
	      var r = fn(s)
	      s = null //not meant to use the hash after you've called digest.
	      return r
	    }
	  }
	}

	exports.randomBytes = function(size, callback) {
	  if (callback && callback.call) {
	    try {
	      callback.call(this, undefined, rng(size));
	    } catch (err) { callback(err); }
	  } else {
	    return rng(size);
	  }
	}

	// the least I can do is make error messages for the rest of the node.js/crypto api.
	;['createCredentials'
	, 'createHmac'
	, 'createCypher'
	, 'createCypheriv'
	, 'createDecipher'
	, 'createDecipheriv'
	, 'createSign'
	, 'createVerify'
	, 'createDeffieHellman'
	, 'pbkdf2'].forEach(function (name) {
	  exports[name] = function () {
	    error('sorry,', name, 'is not implemented yet')
	  }
	})


/***/ },

/***/ 73:
/***/ function(module, exports, require) {

	/* WEBPACK VAR INJECTION */(function(require, process) {module.exports =
	function debug () {
	  if (/\brequest\b/.test(process.env.NODE_DEBUG))
	    console.error('REQUEST %s', util.format.apply(util, arguments))
	}
	/* WEBPACK VAR INJECTION */}.call(exports, require, require(15)))

/***/ },

/***/ 74:
/***/ function(module, exports, require) {

	// Safe toJSON
	module.exports =
	function getSafe (self, uuid) {
	  if (typeof self === 'object' || typeof self === 'function') var safe = {}
	  if (Array.isArray(self)) var safe = []

	  var recurse = []

	  Object.defineProperty(self, uuid, {})

	  var attrs = Object.keys(self).filter(function (i) {
	    if (i === uuid) return false
	    if ( (typeof self[i] !== 'object' && typeof self[i] !== 'function') || self[i] === null) return true
	    return !(Object.getOwnPropertyDescriptor(self[i], uuid))
	  })


	  for (var i=0;i<attrs.length;i++) {
	    if ( (typeof self[attrs[i]] !== 'object' && typeof self[attrs[i]] !== 'function') ||
	          self[attrs[i]] === null
	        ) {
	      safe[attrs[i]] = self[attrs[i]]
	    } else {
	      recurse.push(attrs[i])
	      Object.defineProperty(self[attrs[i]], uuid, {})
	    }
	  }

	  for (var i=0;i<recurse.length;i++) {
	    safe[recurse[i]] = getSafe(self[recurse[i]], uuid)
	  }

	  return safe
	}

/***/ },

/***/ 75:
/***/ function(module, exports, require) {

	module.exports = require(70);


/***/ },

/***/ 76:
/***/ function(module, exports, require) {

	// todo


/***/ },

/***/ 77:
/***/ function(module, exports, require) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* -*- Mode: js; js-indent-level: 2; -*- */
	/*
	 * Copyright 2011 Mozilla Foundation and contributors
	 * Licensed under the New BSD license. See LICENSE or:
	 * http://opensource.org/licenses/BSD-3-Clause
	 */
	if (false) {
	    var define = require('amdefine')(module, require);
	}
	(__WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, module) {

	  var base64VLQ = require(96);
	  var util = require(97);
	  var ArraySet = require(98).ArraySet;

	  /**
	   * An instance of the SourceMapGenerator represents a source map which is
	   * being built incrementally. To create a new one, you must pass an object
	   * with the following properties:
	   *
	   *   - file: The filename of the generated source.
	   *   - sourceRoot: An optional root for all URLs in this source map.
	   */
	  function SourceMapGenerator(aArgs) {
	    this._file = util.getArg(aArgs, 'file');
	    this._sourceRoot = util.getArg(aArgs, 'sourceRoot', null);
	    this._sources = new ArraySet();
	    this._names = new ArraySet();
	    this._mappings = [];
	    this._sourcesContents = null;
	  }

	  SourceMapGenerator.prototype._version = 3;

	  /**
	   * Creates a new SourceMapGenerator based on a SourceMapConsumer
	   *
	   * @param aSourceMapConsumer The SourceMap.
	   */
	  SourceMapGenerator.fromSourceMap =
	    function SourceMapGenerator_fromSourceMap(aSourceMapConsumer) {
	      var sourceRoot = aSourceMapConsumer.sourceRoot;
	      var generator = new SourceMapGenerator({
	        file: aSourceMapConsumer.file,
	        sourceRoot: sourceRoot
	      });
	      aSourceMapConsumer.eachMapping(function (mapping) {
	        var newMapping = {
	          generated: {
	            line: mapping.generatedLine,
	            column: mapping.generatedColumn
	          }
	        };

	        if (mapping.source) {
	          newMapping.source = mapping.source;
	          if (sourceRoot) {
	            newMapping.source = util.relative(sourceRoot, newMapping.source);
	          }

	          newMapping.original = {
	            line: mapping.originalLine,
	            column: mapping.originalColumn
	          };

	          if (mapping.name) {
	            newMapping.name = mapping.name;
	          }
	        }

	        generator.addMapping(newMapping);
	      });
	      aSourceMapConsumer.sources.forEach(function (sourceFile) {
	        var content = aSourceMapConsumer.sourceContentFor(sourceFile);
	        if (content) {
	          generator.setSourceContent(sourceFile, content);
	        }
	      });
	      return generator;
	    };

	  /**
	   * Add a single mapping from original source line and column to the generated
	   * source's line and column for this source map being created. The mapping
	   * object should have the following properties:
	   *
	   *   - generated: An object with the generated line and column positions.
	   *   - original: An object with the original line and column positions.
	   *   - source: The original source file (relative to the sourceRoot).
	   *   - name: An optional original token name for this mapping.
	   */
	  SourceMapGenerator.prototype.addMapping =
	    function SourceMapGenerator_addMapping(aArgs) {
	      var generated = util.getArg(aArgs, 'generated');
	      var original = util.getArg(aArgs, 'original', null);
	      var source = util.getArg(aArgs, 'source', null);
	      var name = util.getArg(aArgs, 'name', null);

	      this._validateMapping(generated, original, source, name);

	      if (source && !this._sources.has(source)) {
	        this._sources.add(source);
	      }

	      if (name && !this._names.has(name)) {
	        this._names.add(name);
	      }

	      this._mappings.push({
	        generatedLine: generated.line,
	        generatedColumn: generated.column,
	        originalLine: original != null && original.line,
	        originalColumn: original != null && original.column,
	        source: source,
	        name: name
	      });
	    };

	  /**
	   * Set the source content for a source file.
	   */
	  SourceMapGenerator.prototype.setSourceContent =
	    function SourceMapGenerator_setSourceContent(aSourceFile, aSourceContent) {
	      var source = aSourceFile;
	      if (this._sourceRoot) {
	        source = util.relative(this._sourceRoot, source);
	      }

	      if (aSourceContent !== null) {
	        // Add the source content to the _sourcesContents map.
	        // Create a new _sourcesContents map if the property is null.
	        if (!this._sourcesContents) {
	          this._sourcesContents = {};
	        }
	        this._sourcesContents[util.toSetString(source)] = aSourceContent;
	      } else {
	        // Remove the source file from the _sourcesContents map.
	        // If the _sourcesContents map is empty, set the property to null.
	        delete this._sourcesContents[util.toSetString(source)];
	        if (Object.keys(this._sourcesContents).length === 0) {
	          this._sourcesContents = null;
	        }
	      }
	    };

	  /**
	   * Applies the mappings of a sub-source-map for a specific source file to the
	   * source map being generated. Each mapping to the supplied source file is
	   * rewritten using the supplied source map. Note: The resolution for the
	   * resulting mappings is the minimium of this map and the supplied map.
	   *
	   * @param aSourceMapConsumer The source map to be applied.
	   * @param aSourceFile Optional. The filename of the source file.
	   *        If omitted, SourceMapConsumer's file property will be used.
	   */
	  SourceMapGenerator.prototype.applySourceMap =
	    function SourceMapGenerator_applySourceMap(aSourceMapConsumer, aSourceFile) {
	      // If aSourceFile is omitted, we will use the file property of the SourceMap
	      if (!aSourceFile) {
	        aSourceFile = aSourceMapConsumer.file;
	      }
	      var sourceRoot = this._sourceRoot;
	      // Make "aSourceFile" relative if an absolute Url is passed.
	      if (sourceRoot) {
	        aSourceFile = util.relative(sourceRoot, aSourceFile);
	      }
	      // Applying the SourceMap can add and remove items from the sources and
	      // the names array.
	      var newSources = new ArraySet();
	      var newNames = new ArraySet();

	      // Find mappings for the "aSourceFile"
	      this._mappings.forEach(function (mapping) {
	        if (mapping.source === aSourceFile && mapping.originalLine) {
	          // Check if it can be mapped by the source map, then update the mapping.
	          var original = aSourceMapConsumer.originalPositionFor({
	            line: mapping.originalLine,
	            column: mapping.originalColumn
	          });
	          if (original.source !== null) {
	            // Copy mapping
	            if (sourceRoot) {
	              mapping.source = util.relative(sourceRoot, original.source);
	            } else {
	              mapping.source = original.source;
	            }
	            mapping.originalLine = original.line;
	            mapping.originalColumn = original.column;
	            if (original.name !== null && mapping.name !== null) {
	              // Only use the identifier name if it's an identifier
	              // in both SourceMaps
	              mapping.name = original.name;
	            }
	          }
	        }

	        var source = mapping.source;
	        if (source && !newSources.has(source)) {
	          newSources.add(source);
	        }

	        var name = mapping.name;
	        if (name && !newNames.has(name)) {
	          newNames.add(name);
	        }

	      }, this);
	      this._sources = newSources;
	      this._names = newNames;

	      // Copy sourcesContents of applied map.
	      aSourceMapConsumer.sources.forEach(function (sourceFile) {
	        var content = aSourceMapConsumer.sourceContentFor(sourceFile);
	        if (content) {
	          if (sourceRoot) {
	            sourceFile = util.relative(sourceRoot, sourceFile);
	          }
	          this.setSourceContent(sourceFile, content);
	        }
	      }, this);
	    };

	  /**
	   * A mapping can have one of the three levels of data:
	   *
	   *   1. Just the generated position.
	   *   2. The Generated position, original position, and original source.
	   *   3. Generated and original position, original source, as well as a name
	   *      token.
	   *
	   * To maintain consistency, we validate that any new mapping being added falls
	   * in to one of these categories.
	   */
	  SourceMapGenerator.prototype._validateMapping =
	    function SourceMapGenerator_validateMapping(aGenerated, aOriginal, aSource,
	                                                aName) {
	      if (aGenerated && 'line' in aGenerated && 'column' in aGenerated
	          && aGenerated.line > 0 && aGenerated.column >= 0
	          && !aOriginal && !aSource && !aName) {
	        // Case 1.
	        return;
	      }
	      else if (aGenerated && 'line' in aGenerated && 'column' in aGenerated
	               && aOriginal && 'line' in aOriginal && 'column' in aOriginal
	               && aGenerated.line > 0 && aGenerated.column >= 0
	               && aOriginal.line > 0 && aOriginal.column >= 0
	               && aSource) {
	        // Cases 2 and 3.
	        return;
	      }
	      else {
	        throw new Error('Invalid mapping: ' + JSON.stringify({
	          generated: aGenerated,
	          source: aSource,
	          orginal: aOriginal,
	          name: aName
	        }));
	      }
	    };

	  /**
	   * Serialize the accumulated mappings in to the stream of base 64 VLQs
	   * specified by the source map format.
	   */
	  SourceMapGenerator.prototype._serializeMappings =
	    function SourceMapGenerator_serializeMappings() {
	      var previousGeneratedColumn = 0;
	      var previousGeneratedLine = 1;
	      var previousOriginalColumn = 0;
	      var previousOriginalLine = 0;
	      var previousName = 0;
	      var previousSource = 0;
	      var result = '';
	      var mapping;

	      // The mappings must be guaranteed to be in sorted order before we start
	      // serializing them or else the generated line numbers (which are defined
	      // via the ';' separators) will be all messed up. Note: it might be more
	      // performant to maintain the sorting as we insert them, rather than as we
	      // serialize them, but the big O is the same either way.
	      this._mappings.sort(util.compareByGeneratedPositions);

	      for (var i = 0, len = this._mappings.length; i < len; i++) {
	        mapping = this._mappings[i];

	        if (mapping.generatedLine !== previousGeneratedLine) {
	          previousGeneratedColumn = 0;
	          while (mapping.generatedLine !== previousGeneratedLine) {
	            result += ';';
	            previousGeneratedLine++;
	          }
	        }
	        else {
	          if (i > 0) {
	            if (!util.compareByGeneratedPositions(mapping, this._mappings[i - 1])) {
	              continue;
	            }
	            result += ',';
	          }
	        }

	        result += base64VLQ.encode(mapping.generatedColumn
	                                   - previousGeneratedColumn);
	        previousGeneratedColumn = mapping.generatedColumn;

	        if (mapping.source) {
	          result += base64VLQ.encode(this._sources.indexOf(mapping.source)
	                                     - previousSource);
	          previousSource = this._sources.indexOf(mapping.source);

	          // lines are stored 0-based in SourceMap spec version 3
	          result += base64VLQ.encode(mapping.originalLine - 1
	                                     - previousOriginalLine);
	          previousOriginalLine = mapping.originalLine - 1;

	          result += base64VLQ.encode(mapping.originalColumn
	                                     - previousOriginalColumn);
	          previousOriginalColumn = mapping.originalColumn;

	          if (mapping.name) {
	            result += base64VLQ.encode(this._names.indexOf(mapping.name)
	                                       - previousName);
	            previousName = this._names.indexOf(mapping.name);
	          }
	        }
	      }

	      return result;
	    };

	  SourceMapGenerator.prototype._generateSourcesContent =
	    function SourceMapGenerator_generateSourcesContent(aSources, aSourceRoot) {
	      return aSources.map(function (source) {
	        if (!this._sourcesContents) {
	          return null;
	        }
	        if (aSourceRoot) {
	          source = util.relative(aSourceRoot, source);
	        }
	        var key = util.toSetString(source);
	        return Object.prototype.hasOwnProperty.call(this._sourcesContents,
	                                                    key)
	          ? this._sourcesContents[key]
	          : null;
	      }, this);
	    };

	  /**
	   * Externalize the source map.
	   */
	  SourceMapGenerator.prototype.toJSON =
	    function SourceMapGenerator_toJSON() {
	      var map = {
	        version: this._version,
	        file: this._file,
	        sources: this._sources.toArray(),
	        names: this._names.toArray(),
	        mappings: this._serializeMappings()
	      };
	      if (this._sourceRoot) {
	        map.sourceRoot = this._sourceRoot;
	      }
	      if (this._sourcesContents) {
	        map.sourcesContent = this._generateSourcesContent(map.sources, map.sourceRoot);
	      }

	      return map;
	    };

	  /**
	   * Render the source map being generated to a string.
	   */
	  SourceMapGenerator.prototype.toString =
	    function SourceMapGenerator_toString() {
	      return JSON.stringify(this);
	    };

	  exports.SourceMapGenerator = SourceMapGenerator;

	}(require, exports, module)), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },

/***/ 78:
/***/ function(module, exports, require) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* -*- Mode: js; js-indent-level: 2; -*- */
	/*
	 * Copyright 2011 Mozilla Foundation and contributors
	 * Licensed under the New BSD license. See LICENSE or:
	 * http://opensource.org/licenses/BSD-3-Clause
	 */
	if (false) {
	    var define = require('amdefine')(module, require);
	}
	(__WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, module) {

	  var util = require(97);
	  var binarySearch = require(99);
	  var ArraySet = require(98).ArraySet;
	  var base64VLQ = require(96);

	  /**
	   * A SourceMapConsumer instance represents a parsed source map which we can
	   * query for information about the original file positions by giving it a file
	   * position in the generated source.
	   *
	   * The only parameter is the raw source map (either as a JSON string, or
	   * already parsed to an object). According to the spec, source maps have the
	   * following attributes:
	   *
	   *   - version: Which version of the source map spec this map is following.
	   *   - sources: An array of URLs to the original source files.
	   *   - names: An array of identifiers which can be referrenced by individual mappings.
	   *   - sourceRoot: Optional. The URL root from which all sources are relative.
	   *   - sourcesContent: Optional. An array of contents of the original source files.
	   *   - mappings: A string of base64 VLQs which contain the actual mappings.
	   *   - file: The generated file this source map is associated with.
	   *
	   * Here is an example source map, taken from the source map spec[0]:
	   *
	   *     {
	   *       version : 3,
	   *       file: "out.js",
	   *       sourceRoot : "",
	   *       sources: ["foo.js", "bar.js"],
	   *       names: ["src", "maps", "are", "fun"],
	   *       mappings: "AA,AB;;ABCDE;"
	   *     }
	   *
	   * [0]: https://docs.google.com/document/d/1U1RGAehQwRypUTovF1KRlpiOFze0b-_2gc6fAH0KY0k/edit?pli=1#
	   */
	  function SourceMapConsumer(aSourceMap) {
	    var sourceMap = aSourceMap;
	    if (typeof aSourceMap === 'string') {
	      sourceMap = JSON.parse(aSourceMap.replace(/^\)\]\}'/, ''));
	    }

	    var version = util.getArg(sourceMap, 'version');
	    var sources = util.getArg(sourceMap, 'sources');
	    // Sass 3.3 leaves out the 'names' array, so we deviate from the spec (which
	    // requires the array) to play nice here.
	    var names = util.getArg(sourceMap, 'names', []);
	    var sourceRoot = util.getArg(sourceMap, 'sourceRoot', null);
	    var sourcesContent = util.getArg(sourceMap, 'sourcesContent', null);
	    var mappings = util.getArg(sourceMap, 'mappings');
	    var file = util.getArg(sourceMap, 'file', null);

	    // Once again, Sass deviates from the spec and supplies the version as a
	    // string rather than a number, so we use loose equality checking here.
	    if (version != this._version) {
	      throw new Error('Unsupported version: ' + version);
	    }

	    // Pass `true` below to allow duplicate names and sources. While source maps
	    // are intended to be compressed and deduplicated, the TypeScript compiler
	    // sometimes generates source maps with duplicates in them. See Github issue
	    // #72 and bugzil.la/889492.
	    this._names = ArraySet.fromArray(names, true);
	    this._sources = ArraySet.fromArray(sources, true);

	    this.sourceRoot = sourceRoot;
	    this.sourcesContent = sourcesContent;
	    this._mappings = mappings;
	    this.file = file;
	  }

	  /**
	   * Create a SourceMapConsumer from a SourceMapGenerator.
	   *
	   * @param SourceMapGenerator aSourceMap
	   *        The source map that will be consumed.
	   * @returns SourceMapConsumer
	   */
	  SourceMapConsumer.fromSourceMap =
	    function SourceMapConsumer_fromSourceMap(aSourceMap) {
	      var smc = Object.create(SourceMapConsumer.prototype);

	      smc._names = ArraySet.fromArray(aSourceMap._names.toArray(), true);
	      smc._sources = ArraySet.fromArray(aSourceMap._sources.toArray(), true);
	      smc.sourceRoot = aSourceMap._sourceRoot;
	      smc.sourcesContent = aSourceMap._generateSourcesContent(smc._sources.toArray(),
	                                                              smc.sourceRoot);
	      smc.file = aSourceMap._file;

	      smc.__generatedMappings = aSourceMap._mappings.slice()
	        .sort(util.compareByGeneratedPositions);
	      smc.__originalMappings = aSourceMap._mappings.slice()
	        .sort(util.compareByOriginalPositions);

	      return smc;
	    };

	  /**
	   * The version of the source mapping spec that we are consuming.
	   */
	  SourceMapConsumer.prototype._version = 3;

	  /**
	   * The list of original sources.
	   */
	  Object.defineProperty(SourceMapConsumer.prototype, 'sources', {
	    get: function () {
	      return this._sources.toArray().map(function (s) {
	        return this.sourceRoot ? util.join(this.sourceRoot, s) : s;
	      }, this);
	    }
	  });

	  // `__generatedMappings` and `__originalMappings` are arrays that hold the
	  // parsed mapping coordinates from the source map's "mappings" attribute. They
	  // are lazily instantiated, accessed via the `_generatedMappings` and
	  // `_originalMappings` getters respectively, and we only parse the mappings
	  // and create these arrays once queried for a source location. We jump through
	  // these hoops because there can be many thousands of mappings, and parsing
	  // them is expensive, so we only want to do it if we must.
	  //
	  // Each object in the arrays is of the form:
	  //
	  //     {
	  //       generatedLine: The line number in the generated code,
	  //       generatedColumn: The column number in the generated code,
	  //       source: The path to the original source file that generated this
	  //               chunk of code,
	  //       originalLine: The line number in the original source that
	  //                     corresponds to this chunk of generated code,
	  //       originalColumn: The column number in the original source that
	  //                       corresponds to this chunk of generated code,
	  //       name: The name of the original symbol which generated this chunk of
	  //             code.
	  //     }
	  //
	  // All properties except for `generatedLine` and `generatedColumn` can be
	  // `null`.
	  //
	  // `_generatedMappings` is ordered by the generated positions.
	  //
	  // `_originalMappings` is ordered by the original positions.

	  SourceMapConsumer.prototype.__generatedMappings = null;
	  Object.defineProperty(SourceMapConsumer.prototype, '_generatedMappings', {
	    get: function () {
	      if (!this.__generatedMappings) {
	        this.__generatedMappings = [];
	        this.__originalMappings = [];
	        this._parseMappings(this._mappings, this.sourceRoot);
	      }

	      return this.__generatedMappings;
	    }
	  });

	  SourceMapConsumer.prototype.__originalMappings = null;
	  Object.defineProperty(SourceMapConsumer.prototype, '_originalMappings', {
	    get: function () {
	      if (!this.__originalMappings) {
	        this.__generatedMappings = [];
	        this.__originalMappings = [];
	        this._parseMappings(this._mappings, this.sourceRoot);
	      }

	      return this.__originalMappings;
	    }
	  });

	  /**
	   * Parse the mappings in a string in to a data structure which we can easily
	   * query (the ordered arrays in the `this.__generatedMappings` and
	   * `this.__originalMappings` properties).
	   */
	  SourceMapConsumer.prototype._parseMappings =
	    function SourceMapConsumer_parseMappings(aStr, aSourceRoot) {
	      var generatedLine = 1;
	      var previousGeneratedColumn = 0;
	      var previousOriginalLine = 0;
	      var previousOriginalColumn = 0;
	      var previousSource = 0;
	      var previousName = 0;
	      var mappingSeparator = /^[,;]/;
	      var str = aStr;
	      var mapping;
	      var temp;

	      while (str.length > 0) {
	        if (str.charAt(0) === ';') {
	          generatedLine++;
	          str = str.slice(1);
	          previousGeneratedColumn = 0;
	        }
	        else if (str.charAt(0) === ',') {
	          str = str.slice(1);
	        }
	        else {
	          mapping = {};
	          mapping.generatedLine = generatedLine;

	          // Generated column.
	          temp = base64VLQ.decode(str);
	          mapping.generatedColumn = previousGeneratedColumn + temp.value;
	          previousGeneratedColumn = mapping.generatedColumn;
	          str = temp.rest;

	          if (str.length > 0 && !mappingSeparator.test(str.charAt(0))) {
	            // Original source.
	            temp = base64VLQ.decode(str);
	            mapping.source = this._sources.at(previousSource + temp.value);
	            previousSource += temp.value;
	            str = temp.rest;
	            if (str.length === 0 || mappingSeparator.test(str.charAt(0))) {
	              throw new Error('Found a source, but no line and column');
	            }

	            // Original line.
	            temp = base64VLQ.decode(str);
	            mapping.originalLine = previousOriginalLine + temp.value;
	            previousOriginalLine = mapping.originalLine;
	            // Lines are stored 0-based
	            mapping.originalLine += 1;
	            str = temp.rest;
	            if (str.length === 0 || mappingSeparator.test(str.charAt(0))) {
	              throw new Error('Found a source and line, but no column');
	            }

	            // Original column.
	            temp = base64VLQ.decode(str);
	            mapping.originalColumn = previousOriginalColumn + temp.value;
	            previousOriginalColumn = mapping.originalColumn;
	            str = temp.rest;

	            if (str.length > 0 && !mappingSeparator.test(str.charAt(0))) {
	              // Original name.
	              temp = base64VLQ.decode(str);
	              mapping.name = this._names.at(previousName + temp.value);
	              previousName += temp.value;
	              str = temp.rest;
	            }
	          }

	          this.__generatedMappings.push(mapping);
	          if (typeof mapping.originalLine === 'number') {
	            this.__originalMappings.push(mapping);
	          }
	        }
	      }

	      this.__originalMappings.sort(util.compareByOriginalPositions);
	    };

	  /**
	   * Find the mapping that best matches the hypothetical "needle" mapping that
	   * we are searching for in the given "haystack" of mappings.
	   */
	  SourceMapConsumer.prototype._findMapping =
	    function SourceMapConsumer_findMapping(aNeedle, aMappings, aLineName,
	                                           aColumnName, aComparator) {
	      // To return the position we are searching for, we must first find the
	      // mapping for the given position and then return the opposite position it
	      // points to. Because the mappings are sorted, we can use binary search to
	      // find the best mapping.

	      if (aNeedle[aLineName] <= 0) {
	        throw new TypeError('Line must be greater than or equal to 1, got '
	                            + aNeedle[aLineName]);
	      }
	      if (aNeedle[aColumnName] < 0) {
	        throw new TypeError('Column must be greater than or equal to 0, got '
	                            + aNeedle[aColumnName]);
	      }

	      return binarySearch.search(aNeedle, aMappings, aComparator);
	    };

	  /**
	   * Returns the original source, line, and column information for the generated
	   * source's line and column positions provided. The only argument is an object
	   * with the following properties:
	   *
	   *   - line: The line number in the generated source.
	   *   - column: The column number in the generated source.
	   *
	   * and an object is returned with the following properties:
	   *
	   *   - source: The original source file, or null.
	   *   - line: The line number in the original source, or null.
	   *   - column: The column number in the original source, or null.
	   *   - name: The original identifier, or null.
	   */
	  SourceMapConsumer.prototype.originalPositionFor =
	    function SourceMapConsumer_originalPositionFor(aArgs) {
	      var needle = {
	        generatedLine: util.getArg(aArgs, 'line'),
	        generatedColumn: util.getArg(aArgs, 'column')
	      };

	      var mapping = this._findMapping(needle,
	                                      this._generatedMappings,
	                                      "generatedLine",
	                                      "generatedColumn",
	                                      util.compareByGeneratedPositions);

	      if (mapping) {
	        var source = util.getArg(mapping, 'source', null);
	        if (source && this.sourceRoot) {
	          source = util.join(this.sourceRoot, source);
	        }
	        return {
	          source: source,
	          line: util.getArg(mapping, 'originalLine', null),
	          column: util.getArg(mapping, 'originalColumn', null),
	          name: util.getArg(mapping, 'name', null)
	        };
	      }

	      return {
	        source: null,
	        line: null,
	        column: null,
	        name: null
	      };
	    };

	  /**
	   * Returns the original source content. The only argument is the url of the
	   * original source file. Returns null if no original source content is
	   * availible.
	   */
	  SourceMapConsumer.prototype.sourceContentFor =
	    function SourceMapConsumer_sourceContentFor(aSource) {
	      if (!this.sourcesContent) {
	        return null;
	      }

	      if (this.sourceRoot) {
	        aSource = util.relative(this.sourceRoot, aSource);
	      }

	      if (this._sources.has(aSource)) {
	        return this.sourcesContent[this._sources.indexOf(aSource)];
	      }

	      var url;
	      if (this.sourceRoot
	          && (url = util.urlParse(this.sourceRoot))) {
	        // XXX: file:// URIs and absolute paths lead to unexpected behavior for
	        // many users. We can help them out when they expect file:// URIs to
	        // behave like it would if they were running a local HTTP server. See
	        // https://bugzilla.mozilla.org/show_bug.cgi?id=885597.
	        var fileUriAbsPath = aSource.replace(/^file:\/\//, "");
	        if (url.scheme == "file"
	            && this._sources.has(fileUriAbsPath)) {
	          return this.sourcesContent[this._sources.indexOf(fileUriAbsPath)]
	        }

	        if ((!url.path || url.path == "/")
	            && this._sources.has("/" + aSource)) {
	          return this.sourcesContent[this._sources.indexOf("/" + aSource)];
	        }
	      }

	      throw new Error('"' + aSource + '" is not in the SourceMap.');
	    };

	  /**
	   * Returns the generated line and column information for the original source,
	   * line, and column positions provided. The only argument is an object with
	   * the following properties:
	   *
	   *   - source: The filename of the original source.
	   *   - line: The line number in the original source.
	   *   - column: The column number in the original source.
	   *
	   * and an object is returned with the following properties:
	   *
	   *   - line: The line number in the generated source, or null.
	   *   - column: The column number in the generated source, or null.
	   */
	  SourceMapConsumer.prototype.generatedPositionFor =
	    function SourceMapConsumer_generatedPositionFor(aArgs) {
	      var needle = {
	        source: util.getArg(aArgs, 'source'),
	        originalLine: util.getArg(aArgs, 'line'),
	        originalColumn: util.getArg(aArgs, 'column')
	      };

	      if (this.sourceRoot) {
	        needle.source = util.relative(this.sourceRoot, needle.source);
	      }

	      var mapping = this._findMapping(needle,
	                                      this._originalMappings,
	                                      "originalLine",
	                                      "originalColumn",
	                                      util.compareByOriginalPositions);

	      if (mapping) {
	        return {
	          line: util.getArg(mapping, 'generatedLine', null),
	          column: util.getArg(mapping, 'generatedColumn', null)
	        };
	      }

	      return {
	        line: null,
	        column: null
	      };
	    };

	  SourceMapConsumer.GENERATED_ORDER = 1;
	  SourceMapConsumer.ORIGINAL_ORDER = 2;

	  /**
	   * Iterate over each mapping between an original source/line/column and a
	   * generated line/column in this source map.
	   *
	   * @param Function aCallback
	   *        The function that is called with each mapping.
	   * @param Object aContext
	   *        Optional. If specified, this object will be the value of `this` every
	   *        time that `aCallback` is called.
	   * @param aOrder
	   *        Either `SourceMapConsumer.GENERATED_ORDER` or
	   *        `SourceMapConsumer.ORIGINAL_ORDER`. Specifies whether you want to
	   *        iterate over the mappings sorted by the generated file's line/column
	   *        order or the original's source/line/column order, respectively. Defaults to
	   *        `SourceMapConsumer.GENERATED_ORDER`.
	   */
	  SourceMapConsumer.prototype.eachMapping =
	    function SourceMapConsumer_eachMapping(aCallback, aContext, aOrder) {
	      var context = aContext || null;
	      var order = aOrder || SourceMapConsumer.GENERATED_ORDER;

	      var mappings;
	      switch (order) {
	      case SourceMapConsumer.GENERATED_ORDER:
	        mappings = this._generatedMappings;
	        break;
	      case SourceMapConsumer.ORIGINAL_ORDER:
	        mappings = this._originalMappings;
	        break;
	      default:
	        throw new Error("Unknown order of iteration.");
	      }

	      var sourceRoot = this.sourceRoot;
	      mappings.map(function (mapping) {
	        var source = mapping.source;
	        if (source && sourceRoot) {
	          source = util.join(sourceRoot, source);
	        }
	        return {
	          source: source,
	          generatedLine: mapping.generatedLine,
	          generatedColumn: mapping.generatedColumn,
	          originalLine: mapping.originalLine,
	          originalColumn: mapping.originalColumn,
	          name: mapping.name
	        };
	      }).forEach(aCallback, context);
	    };

	  exports.SourceMapConsumer = SourceMapConsumer;

	}(require, exports, module)), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },

/***/ 79:
/***/ function(module, exports, require) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* -*- Mode: js; js-indent-level: 2; -*- */
	/*
	 * Copyright 2011 Mozilla Foundation and contributors
	 * Licensed under the New BSD license. See LICENSE or:
	 * http://opensource.org/licenses/BSD-3-Clause
	 */
	if (false) {
	    var define = require('amdefine')(module, require);
	}
	(__WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, module) {

	  var SourceMapGenerator = require(77).SourceMapGenerator;
	  var util = require(97);

	  /**
	   * SourceNodes provide a way to abstract over interpolating/concatenating
	   * snippets of generated JavaScript source code while maintaining the line and
	   * column information associated with the original source code.
	   *
	   * @param aLine The original line number.
	   * @param aColumn The original column number.
	   * @param aSource The original source's filename.
	   * @param aChunks Optional. An array of strings which are snippets of
	   *        generated JS, or other SourceNodes.
	   * @param aName The original identifier.
	   */
	  function SourceNode(aLine, aColumn, aSource, aChunks, aName) {
	    this.children = [];
	    this.sourceContents = {};
	    this.line = aLine === undefined ? null : aLine;
	    this.column = aColumn === undefined ? null : aColumn;
	    this.source = aSource === undefined ? null : aSource;
	    this.name = aName === undefined ? null : aName;
	    if (aChunks != null) this.add(aChunks);
	  }

	  /**
	   * Creates a SourceNode from generated code and a SourceMapConsumer.
	   *
	   * @param aGeneratedCode The generated code
	   * @param aSourceMapConsumer The SourceMap for the generated code
	   */
	  SourceNode.fromStringWithSourceMap =
	    function SourceNode_fromStringWithSourceMap(aGeneratedCode, aSourceMapConsumer) {
	      // The SourceNode we want to fill with the generated code
	      // and the SourceMap
	      var node = new SourceNode();

	      // The generated code
	      // Processed fragments are removed from this array.
	      var remainingLines = aGeneratedCode.split('\n');

	      // We need to remember the position of "remainingLines"
	      var lastGeneratedLine = 1, lastGeneratedColumn = 0;

	      // The generate SourceNodes we need a code range.
	      // To extract it current and last mapping is used.
	      // Here we store the last mapping.
	      var lastMapping = null;

	      aSourceMapConsumer.eachMapping(function (mapping) {
	        if (lastMapping === null) {
	          // We add the generated code until the first mapping
	          // to the SourceNode without any mapping.
	          // Each line is added as separate string.
	          while (lastGeneratedLine < mapping.generatedLine) {
	            node.add(remainingLines.shift() + "\n");
	            lastGeneratedLine++;
	          }
	          if (lastGeneratedColumn < mapping.generatedColumn) {
	            var nextLine = remainingLines[0];
	            node.add(nextLine.substr(0, mapping.generatedColumn));
	            remainingLines[0] = nextLine.substr(mapping.generatedColumn);
	            lastGeneratedColumn = mapping.generatedColumn;
	          }
	        } else {
	          // We add the code from "lastMapping" to "mapping":
	          // First check if there is a new line in between.
	          if (lastGeneratedLine < mapping.generatedLine) {
	            var code = "";
	            // Associate full lines with "lastMapping"
	            do {
	              code += remainingLines.shift() + "\n";
	              lastGeneratedLine++;
	              lastGeneratedColumn = 0;
	            } while (lastGeneratedLine < mapping.generatedLine);
	            // When we reached the correct line, we add code until we
	            // reach the correct column too.
	            if (lastGeneratedColumn < mapping.generatedColumn) {
	              var nextLine = remainingLines[0];
	              code += nextLine.substr(0, mapping.generatedColumn);
	              remainingLines[0] = nextLine.substr(mapping.generatedColumn);
	              lastGeneratedColumn = mapping.generatedColumn;
	            }
	            // Create the SourceNode.
	            addMappingWithCode(lastMapping, code);
	          } else {
	            // There is no new line in between.
	            // Associate the code between "lastGeneratedColumn" and
	            // "mapping.generatedColumn" with "lastMapping"
	            var nextLine = remainingLines[0];
	            var code = nextLine.substr(0, mapping.generatedColumn -
	                                          lastGeneratedColumn);
	            remainingLines[0] = nextLine.substr(mapping.generatedColumn -
	                                                lastGeneratedColumn);
	            lastGeneratedColumn = mapping.generatedColumn;
	            addMappingWithCode(lastMapping, code);
	          }
	        }
	        lastMapping = mapping;
	      }, this);
	      // We have processed all mappings.
	      // Associate the remaining code in the current line with "lastMapping"
	      // and add the remaining lines without any mapping
	      addMappingWithCode(lastMapping, remainingLines.join("\n"));

	      // Copy sourcesContent into SourceNode
	      aSourceMapConsumer.sources.forEach(function (sourceFile) {
	        var content = aSourceMapConsumer.sourceContentFor(sourceFile);
	        if (content) {
	          node.setSourceContent(sourceFile, content);
	        }
	      });

	      return node;

	      function addMappingWithCode(mapping, code) {
	        if (mapping === null || mapping.source === undefined) {
	          node.add(code);
	        } else {
	          node.add(new SourceNode(mapping.originalLine,
	                                  mapping.originalColumn,
	                                  mapping.source,
	                                  code,
	                                  mapping.name));
	        }
	      }
	    };

	  /**
	   * Add a chunk of generated JS to this source node.
	   *
	   * @param aChunk A string snippet of generated JS code, another instance of
	   *        SourceNode, or an array where each member is one of those things.
	   */
	  SourceNode.prototype.add = function SourceNode_add(aChunk) {
	    if (Array.isArray(aChunk)) {
	      aChunk.forEach(function (chunk) {
	        this.add(chunk);
	      }, this);
	    }
	    else if (aChunk instanceof SourceNode || typeof aChunk === "string") {
	      if (aChunk) {
	        this.children.push(aChunk);
	      }
	    }
	    else {
	      throw new TypeError(
	        "Expected a SourceNode, string, or an array of SourceNodes and strings. Got " + aChunk
	      );
	    }
	    return this;
	  };

	  /**
	   * Add a chunk of generated JS to the beginning of this source node.
	   *
	   * @param aChunk A string snippet of generated JS code, another instance of
	   *        SourceNode, or an array where each member is one of those things.
	   */
	  SourceNode.prototype.prepend = function SourceNode_prepend(aChunk) {
	    if (Array.isArray(aChunk)) {
	      for (var i = aChunk.length-1; i >= 0; i--) {
	        this.prepend(aChunk[i]);
	      }
	    }
	    else if (aChunk instanceof SourceNode || typeof aChunk === "string") {
	      this.children.unshift(aChunk);
	    }
	    else {
	      throw new TypeError(
	        "Expected a SourceNode, string, or an array of SourceNodes and strings. Got " + aChunk
	      );
	    }
	    return this;
	  };

	  /**
	   * Walk over the tree of JS snippets in this node and its children. The
	   * walking function is called once for each snippet of JS and is passed that
	   * snippet and the its original associated source's line/column location.
	   *
	   * @param aFn The traversal function.
	   */
	  SourceNode.prototype.walk = function SourceNode_walk(aFn) {
	    var chunk;
	    for (var i = 0, len = this.children.length; i < len; i++) {
	      chunk = this.children[i];
	      if (chunk instanceof SourceNode) {
	        chunk.walk(aFn);
	      }
	      else {
	        if (chunk !== '') {
	          aFn(chunk, { source: this.source,
	                       line: this.line,
	                       column: this.column,
	                       name: this.name });
	        }
	      }
	    }
	  };

	  /**
	   * Like `String.prototype.join` except for SourceNodes. Inserts `aStr` between
	   * each of `this.children`.
	   *
	   * @param aSep The separator.
	   */
	  SourceNode.prototype.join = function SourceNode_join(aSep) {
	    var newChildren;
	    var i;
	    var len = this.children.length;
	    if (len > 0) {
	      newChildren = [];
	      for (i = 0; i < len-1; i++) {
	        newChildren.push(this.children[i]);
	        newChildren.push(aSep);
	      }
	      newChildren.push(this.children[i]);
	      this.children = newChildren;
	    }
	    return this;
	  };

	  /**
	   * Call String.prototype.replace on the very right-most source snippet. Useful
	   * for trimming whitespace from the end of a source node, etc.
	   *
	   * @param aPattern The pattern to replace.
	   * @param aReplacement The thing to replace the pattern with.
	   */
	  SourceNode.prototype.replaceRight = function SourceNode_replaceRight(aPattern, aReplacement) {
	    var lastChild = this.children[this.children.length - 1];
	    if (lastChild instanceof SourceNode) {
	      lastChild.replaceRight(aPattern, aReplacement);
	    }
	    else if (typeof lastChild === 'string') {
	      this.children[this.children.length - 1] = lastChild.replace(aPattern, aReplacement);
	    }
	    else {
	      this.children.push(''.replace(aPattern, aReplacement));
	    }
	    return this;
	  };

	  /**
	   * Set the source content for a source file. This will be added to the SourceMapGenerator
	   * in the sourcesContent field.
	   *
	   * @param aSourceFile The filename of the source file
	   * @param aSourceContent The content of the source file
	   */
	  SourceNode.prototype.setSourceContent =
	    function SourceNode_setSourceContent(aSourceFile, aSourceContent) {
	      this.sourceContents[util.toSetString(aSourceFile)] = aSourceContent;
	    };

	  /**
	   * Walk over the tree of SourceNodes. The walking function is called for each
	   * source file content and is passed the filename and source content.
	   *
	   * @param aFn The traversal function.
	   */
	  SourceNode.prototype.walkSourceContents =
	    function SourceNode_walkSourceContents(aFn) {
	      for (var i = 0, len = this.children.length; i < len; i++) {
	        if (this.children[i] instanceof SourceNode) {
	          this.children[i].walkSourceContents(aFn);
	        }
	      }

	      var sources = Object.keys(this.sourceContents);
	      for (var i = 0, len = sources.length; i < len; i++) {
	        aFn(util.fromSetString(sources[i]), this.sourceContents[sources[i]]);
	      }
	    };

	  /**
	   * Return the string representation of this source node. Walks over the tree
	   * and concatenates all the various snippets together to one string.
	   */
	  SourceNode.prototype.toString = function SourceNode_toString() {
	    var str = "";
	    this.walk(function (chunk) {
	      str += chunk;
	    });
	    return str;
	  };

	  /**
	   * Returns the string representation of this source node along with a source
	   * map.
	   */
	  SourceNode.prototype.toStringWithSourceMap = function SourceNode_toStringWithSourceMap(aArgs) {
	    var generated = {
	      code: "",
	      line: 1,
	      column: 0
	    };
	    var map = new SourceMapGenerator(aArgs);
	    var sourceMappingActive = false;
	    var lastOriginalSource = null;
	    var lastOriginalLine = null;
	    var lastOriginalColumn = null;
	    var lastOriginalName = null;
	    this.walk(function (chunk, original) {
	      generated.code += chunk;
	      if (original.source !== null
	          && original.line !== null
	          && original.column !== null) {
	        if(lastOriginalSource !== original.source
	           || lastOriginalLine !== original.line
	           || lastOriginalColumn !== original.column
	           || lastOriginalName !== original.name) {
	          map.addMapping({
	            source: original.source,
	            original: {
	              line: original.line,
	              column: original.column
	            },
	            generated: {
	              line: generated.line,
	              column: generated.column
	            },
	            name: original.name
	          });
	        }
	        lastOriginalSource = original.source;
	        lastOriginalLine = original.line;
	        lastOriginalColumn = original.column;
	        lastOriginalName = original.name;
	        sourceMappingActive = true;
	      } else if (sourceMappingActive) {
	        map.addMapping({
	          generated: {
	            line: generated.line,
	            column: generated.column
	          }
	        });
	        lastOriginalSource = null;
	        sourceMappingActive = false;
	      }
	      chunk.split('').forEach(function (ch) {
	        if (ch === '\n') {
	          generated.line++;
	          generated.column = 0;
	        } else {
	          generated.column++;
	        }
	      });
	    });
	    this.walkSourceContents(function (sourceFile, sourceContent) {
	      map.setSourceContent(sourceFile, sourceContent);
	    });

	    return { code: generated.code, map: map };
	  };

	  exports.SourceNode = SourceNode;

	}(require, exports, module)), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },

/***/ 80:
/***/ function(module, exports, require) {

	(function (exports) {
		'use strict';

		var lookup = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

		function b64ToByteArray(b64) {
			var i, j, l, tmp, placeHolders, arr;
		
			if (b64.length % 4 > 0) {
				throw 'Invalid string. Length must be a multiple of 4';
			}

			// the number of equal signs (place holders)
			// if there are two placeholders, than the two characters before it
			// represent one byte
			// if there is only one, then the three characters before it represent 2 bytes
			// this is just a cheap hack to not do indexOf twice
			placeHolders = b64.indexOf('=');
			placeHolders = placeHolders > 0 ? b64.length - placeHolders : 0;

			// base64 is 4/3 + up to two characters of the original data
			arr = [];//new Uint8Array(b64.length * 3 / 4 - placeHolders);

			// if there are placeholders, only get up to the last complete 4 chars
			l = placeHolders > 0 ? b64.length - 4 : b64.length;

			for (i = 0, j = 0; i < l; i += 4, j += 3) {
				tmp = (lookup.indexOf(b64[i]) << 18) | (lookup.indexOf(b64[i + 1]) << 12) | (lookup.indexOf(b64[i + 2]) << 6) | lookup.indexOf(b64[i + 3]);
				arr.push((tmp & 0xFF0000) >> 16);
				arr.push((tmp & 0xFF00) >> 8);
				arr.push(tmp & 0xFF);
			}

			if (placeHolders === 2) {
				tmp = (lookup.indexOf(b64[i]) << 2) | (lookup.indexOf(b64[i + 1]) >> 4);
				arr.push(tmp & 0xFF);
			} else if (placeHolders === 1) {
				tmp = (lookup.indexOf(b64[i]) << 10) | (lookup.indexOf(b64[i + 1]) << 4) | (lookup.indexOf(b64[i + 2]) >> 2);
				arr.push((tmp >> 8) & 0xFF);
				arr.push(tmp & 0xFF);
			}

			return arr;
		}

		function uint8ToBase64(uint8) {
			var i,
				extraBytes = uint8.length % 3, // if we have 1 byte left, pad 2 bytes
				output = "",
				temp, length;

			function tripletToBase64 (num) {
				return lookup[num >> 18 & 0x3F] + lookup[num >> 12 & 0x3F] + lookup[num >> 6 & 0x3F] + lookup[num & 0x3F];
			};

			// go through the array every three bytes, we'll deal with trailing stuff later
			for (i = 0, length = uint8.length - extraBytes; i < length; i += 3) {
				temp = (uint8[i] << 16) + (uint8[i + 1] << 8) + (uint8[i + 2]);
				output += tripletToBase64(temp);
			}

			// pad the end with zeros, but make sure to not forget the extra bytes
			switch (extraBytes) {
				case 1:
					temp = uint8[uint8.length - 1];
					output += lookup[temp >> 2];
					output += lookup[(temp << 4) & 0x3F];
					output += '==';
					break;
				case 2:
					temp = (uint8[uint8.length - 2] << 8) + (uint8[uint8.length - 1]);
					output += lookup[temp >> 10];
					output += lookup[(temp >> 4) & 0x3F];
					output += lookup[(temp << 2) & 0x3F];
					output += '=';
					break;
			}

			return output;
		}

		module.exports.toByteArray = b64ToByteArray;
		module.exports.fromByteArray = uint8ToBase64;
	}());


/***/ },

/***/ 81:
/***/ function(module, exports, require) {

	/**
	 * Object#toString() ref for stringify().
	 */

	var toString = Object.prototype.toString;

	/**
	 * Object#hasOwnProperty ref
	 */

	var hasOwnProperty = Object.prototype.hasOwnProperty;

	/**
	 * Array#indexOf shim.
	 */

	var indexOf = typeof Array.prototype.indexOf === 'function'
	  ? function(arr, el) { return arr.indexOf(el); }
	  : function(arr, el) {
	      for (var i = 0; i < arr.length; i++) {
	        if (arr[i] === el) return i;
	      }
	      return -1;
	    };

	/**
	 * Array.isArray shim.
	 */

	var isArray = Array.isArray || function(arr) {
	  return toString.call(arr) == '[object Array]';
	};

	/**
	 * Object.keys shim.
	 */

	var objectKeys = Object.keys || function(obj) {
	  var ret = [];
	  for (var key in obj) ret.push(key);
	  return ret;
	};

	/**
	 * Array#forEach shim.
	 */

	var forEach = typeof Array.prototype.forEach === 'function'
	  ? function(arr, fn) { return arr.forEach(fn); }
	  : function(arr, fn) {
	      for (var i = 0; i < arr.length; i++) fn(arr[i]);
	    };

	/**
	 * Array#reduce shim.
	 */

	var reduce = function(arr, fn, initial) {
	  if (typeof arr.reduce === 'function') return arr.reduce(fn, initial);
	  var res = initial;
	  for (var i = 0; i < arr.length; i++) res = fn(res, arr[i]);
	  return res;
	};

	/**
	 * Create a nullary object if possible
	 */

	function createObject() {
	  return Object.create
	    ? Object.create(null)
	    : {};
	}

	/**
	 * Cache non-integer test regexp.
	 */

	var isint = /^[0-9]+$/;

	function promote(parent, key) {
	  if (parent[key].length == 0) return parent[key] = createObject();
	  var t = createObject();
	  for (var i in parent[key]) {
	    if (hasOwnProperty.call(parent[key], i)) {
	      t[i] = parent[key][i];
	    }
	  }
	  parent[key] = t;
	  return t;
	}

	function parse(parts, parent, key, val) {
	  var part = parts.shift();
	  // end
	  if (!part) {
	    if (isArray(parent[key])) {
	      parent[key].push(val);
	    } else if ('object' == typeof parent[key]) {
	      parent[key] = val;
	    } else if ('undefined' == typeof parent[key]) {
	      parent[key] = val;
	    } else {
	      parent[key] = [parent[key], val];
	    }
	    // array
	  } else {
	    var obj = parent[key] = parent[key] || [];
	    if (']' == part) {
	      if (isArray(obj)) {
	        if ('' != val) obj.push(val);
	      } else if ('object' == typeof obj) {
	        obj[objectKeys(obj).length] = val;
	      } else {
	        obj = parent[key] = [parent[key], val];
	      }
	      // prop
	    } else if (~indexOf(part, ']')) {
	      part = part.substr(0, part.length - 1);
	      if (!isint.test(part) && isArray(obj)) obj = promote(parent, key);
	      parse(parts, obj, part, val);
	      // key
	    } else {
	      if (!isint.test(part) && isArray(obj)) obj = promote(parent, key);
	      parse(parts, obj, part, val);
	    }
	  }
	}

	/**
	 * Merge parent key/val pair.
	 */

	function merge(parent, key, val){
	  if (~indexOf(key, ']')) {
	    var parts = key.split('[')
	      , len = parts.length
	      , last = len - 1;
	    parse(parts, parent, 'base', val);
	    // optimize
	  } else {
	    if (!isint.test(key) && isArray(parent.base)) {
	      var t = createObject();
	      for (var k in parent.base) t[k] = parent.base[k];
	      parent.base = t;
	    }
	    set(parent.base, key, val);
	  }

	  return parent;
	}

	/**
	 * Compact sparse arrays.
	 */

	function compact(obj) {
	  if ('object' != typeof obj) return obj;

	  if (isArray(obj)) {
	    var ret = [];

	    for (var i in obj) {
	      if (hasOwnProperty.call(obj, i)) {
	        ret.push(obj[i]);
	      }
	    }

	    return ret;
	  }

	  for (var key in obj) {
	    obj[key] = compact(obj[key]);
	  }

	  return obj;
	}

	/**
	 * Restore Object.prototype.
	 * see pull-request #58
	 */

	function restoreProto(obj) {
	  if (!Object.create) return obj;
	  if (isArray(obj)) return obj;
	  if (obj && 'object' != typeof obj) return obj;

	  for (var key in obj) {
	    if (hasOwnProperty.call(obj, key)) {
	      obj[key] = restoreProto(obj[key]);
	    }
	  }

	  obj.__proto__ = Object.prototype;
	  return obj;
	}

	/**
	 * Parse the given obj.
	 */

	function parseObject(obj){
	  var ret = { base: {} };

	  forEach(objectKeys(obj), function(name){
	    merge(ret, name, obj[name]);
	  });

	  return compact(ret.base);
	}

	/**
	 * Parse the given str.
	 */

	function parseString(str){
	  var ret = reduce(String(str).split('&'), function(ret, pair){
	    var eql = indexOf(pair, '=')
	      , brace = lastBraceInKey(pair)
	      , key = pair.substr(0, brace || eql)
	      , val = pair.substr(brace || eql, pair.length)
	      , val = val.substr(indexOf(val, '=') + 1, val.length);

	    // ?foo
	    if ('' == key) key = pair, val = '';
	    if ('' == key) return ret;

	    return merge(ret, decode(key), decode(val));
	  }, { base: createObject() }).base;

	  return restoreProto(compact(ret));
	}

	/**
	 * Parse the given query `str` or `obj`, returning an object.
	 *
	 * @param {String} str | {Object} obj
	 * @return {Object}
	 * @api public
	 */

	exports.parse = function(str){
	  if (null == str || '' == str) return {};
	  return 'object' == typeof str
	    ? parseObject(str)
	    : parseString(str);
	};

	/**
	 * Turn the given `obj` into a query string
	 *
	 * @param {Object} obj
	 * @return {String}
	 * @api public
	 */

	var stringify = exports.stringify = function(obj, prefix) {
	  if (isArray(obj)) {
	    return stringifyArray(obj, prefix);
	  } else if ('[object Object]' == toString.call(obj)) {
	    return stringifyObject(obj, prefix);
	  } else if ('string' == typeof obj) {
	    return stringifyString(obj, prefix);
	  } else {
	    return prefix + '=' + encodeURIComponent(String(obj));
	  }
	};

	/**
	 * Stringify the given `str`.
	 *
	 * @param {String} str
	 * @param {String} prefix
	 * @return {String}
	 * @api private
	 */

	function stringifyString(str, prefix) {
	  if (!prefix) throw new TypeError('stringify expects an object');
	  return prefix + '=' + encodeURIComponent(str);
	}

	/**
	 * Stringify the given `arr`.
	 *
	 * @param {Array} arr
	 * @param {String} prefix
	 * @return {String}
	 * @api private
	 */

	function stringifyArray(arr, prefix) {
	  var ret = [];
	  if (!prefix) throw new TypeError('stringify expects an object');
	  for (var i = 0; i < arr.length; i++) {
	    ret.push(stringify(arr[i], prefix + '[' + i + ']'));
	  }
	  return ret.join('&');
	}

	/**
	 * Stringify the given `obj`.
	 *
	 * @param {Object} obj
	 * @param {String} prefix
	 * @return {String}
	 * @api private
	 */

	function stringifyObject(obj, prefix) {
	  var ret = []
	    , keys = objectKeys(obj)
	    , key;

	  for (var i = 0, len = keys.length; i < len; ++i) {
	    key = keys[i];
	    if ('' == key) continue;
	    if (null == obj[key]) {
	      ret.push(encodeURIComponent(key) + '=');
	    } else {
	      ret.push(stringify(obj[key], prefix
	        ? prefix + '[' + encodeURIComponent(key) + ']'
	        : encodeURIComponent(key)));
	    }
	  }

	  return ret.join('&');
	}

	/**
	 * Set `obj`'s `key` to `val` respecting
	 * the weird and wonderful syntax of a qs,
	 * where "foo=bar&foo=baz" becomes an array.
	 *
	 * @param {Object} obj
	 * @param {String} key
	 * @param {String} val
	 * @api private
	 */

	function set(obj, key, val) {
	  var v = obj[key];
	  if (undefined === v) {
	    obj[key] = val;
	  } else if (isArray(v)) {
	    v.push(val);
	  } else {
	    obj[key] = [v, val];
	  }
	}

	/**
	 * Locate last brace in `str` within the key.
	 *
	 * @param {String} str
	 * @return {Number}
	 * @api private
	 */

	function lastBraceInKey(str) {
	  var len = str.length
	    , brace
	    , c;
	  for (var i = 0; i < len; ++i) {
	    c = str[i];
	    if (']' == c) brace = false;
	    if ('[' == c) brace = true;
	    if ('=' == c && !brace) return i;
	  }
	}

	/**
	 * Decode `str`.
	 *
	 * @param {String} str
	 * @return {String}
	 * @api private
	 */

	function decode(str) {
	  try {
	    return decodeURIComponent(str.replace(/\+/g, ' '));
	  } catch (err) {
	    return str;
	  }
	}


/***/ },

/***/ 82:
/***/ function(module, exports, require) {

	var crypto = require(72)
	  , qs = require(60)
	  ;

	function sha1 (key, body) {
	  return crypto.createHmac('sha1', key).update(body).digest('base64')
	}

	function rfc3986 (str) {
	  return encodeURIComponent(str)
	    .replace(/!/g,'%21')
	    .replace(/\*/g,'%2A')
	    .replace(/\(/g,'%28')
	    .replace(/\)/g,'%29')
	    .replace(/'/g,'%27')
	    ;
	}

	function hmacsign (httpMethod, base_uri, params, consumer_secret, token_secret) {
	  // adapted from https://dev.twitter.com/docs/auth/oauth and 
	  // https://dev.twitter.com/docs/auth/creating-signature

	  var querystring = Object.keys(params).sort().map(function(key){
	    // big WTF here with the escape + encoding but it's what twitter wants
	    return escape(rfc3986(key)) + "%3D" + escape(rfc3986(params[key]))
	  }).join('%26')

	  var base = [
	    httpMethod ? httpMethod.toUpperCase() : 'GET',
	    rfc3986(base_uri),
	    querystring
	  ].join('&')

	  var key = [
	    consumer_secret,
	    token_secret || ''
	  ].map(rfc3986).join('&')

	  return sha1(key, base)
	}

	exports.hmacsign = hmacsign
	exports.rfc3986 = rfc3986


/***/ },

/***/ 83:
/***/ function(module, exports, require) {

	module.exports = require(102);

/***/ },

/***/ 84:
/***/ function(module, exports, require) {

	
	/*!
	 * knox - auth
	 * Copyright(c) 2010 LearnBoost <dev@learnboost.com>
	 * MIT Licensed
	 */

	/**
	 * Module dependencies.
	 */

	var crypto = require(72)
	  , parse = require(18).parse
	  ;

	/**
	 * Valid keys.
	 */

	var keys = 
	  [ 'acl'
	  , 'location'
	  , 'logging'
	  , 'notification'
	  , 'partNumber'
	  , 'policy'
	  , 'requestPayment'
	  , 'torrent'
	  , 'uploadId'
	  , 'uploads'
	  , 'versionId'
	  , 'versioning'
	  , 'versions'
	  , 'website'
	  ]

	/**
	 * Return an "Authorization" header value with the given `options`
	 * in the form of "AWS <key>:<signature>"
	 *
	 * @param {Object} options
	 * @return {String}
	 * @api private
	 */

	function authorization (options) {
	  return 'AWS ' + options.key + ':' + sign(options)
	}

	module.exports = authorization
	module.exports.authorization = authorization

	/**
	 * Simple HMAC-SHA1 Wrapper
	 *
	 * @param {Object} options
	 * @return {String}
	 * @api private
	 */ 

	function hmacSha1 (options) {
	  return crypto.createHmac('sha1', options.secret).update(options.message).digest('base64')
	}

	module.exports.hmacSha1 = hmacSha1

	/**
	 * Create a base64 sha1 HMAC for `options`. 
	 * 
	 * @param {Object} options
	 * @return {String}
	 * @api private
	 */

	function sign (options) {
	  options.message = stringToSign(options)
	  return hmacSha1(options)
	}
	module.exports.sign = sign

	/**
	 * Create a base64 sha1 HMAC for `options`. 
	 *
	 * Specifically to be used with S3 presigned URLs
	 * 
	 * @param {Object} options
	 * @return {String}
	 * @api private
	 */

	function signQuery (options) {
	  options.message = queryStringToSign(options)
	  return hmacSha1(options)
	}
	module.exports.signQuery= signQuery

	/**
	 * Return a string for sign() with the given `options`.
	 *
	 * Spec:
	 * 
	 *    <verb>\n
	 *    <md5>\n
	 *    <content-type>\n
	 *    <date>\n
	 *    [headers\n]
	 *    <resource>
	 *
	 * @param {Object} options
	 * @return {String}
	 * @api private
	 */

	function stringToSign (options) {
	  var headers = options.amazonHeaders || ''
	  if (headers) headers += '\n'
	  var r = 
	    [ options.verb
	    , options.md5
	    , options.contentType
	    , options.date.toUTCString()
	    , headers + options.resource
	    ]
	  return r.join('\n')
	}
	module.exports.queryStringToSign = stringToSign

	/**
	 * Return a string for sign() with the given `options`, but is meant exclusively
	 * for S3 presigned URLs
	 *
	 * Spec:
	 * 
	 *    <date>\n
	 *    <resource>
	 *
	 * @param {Object} options
	 * @return {String}
	 * @api private
	 */

	function queryStringToSign (options){
	  return 'GET\n\n\n' + options.date + '\n' + options.resource
	}
	module.exports.queryStringToSign = queryStringToSign

	/**
	 * Perform the following:
	 *
	 *  - ignore non-amazon headers
	 *  - lowercase fields
	 *  - sort lexicographically
	 *  - trim whitespace between ":"
	 *  - join with newline
	 *
	 * @param {Object} headers
	 * @return {String}
	 * @api private
	 */

	function canonicalizeHeaders (headers) {
	  var buf = []
	    , fields = Object.keys(headers)
	    ;
	  for (var i = 0, len = fields.length; i < len; ++i) {
	    var field = fields[i]
	      , val = headers[field]
	      , field = field.toLowerCase()
	      ;
	    if (0 !== field.indexOf('x-amz')) continue
	    buf.push(field + ':' + val)
	  }
	  return buf.sort().join('\n')
	}
	module.exports.canonicalizeHeaders = canonicalizeHeaders

	/**
	 * Perform the following:
	 *
	 *  - ignore non sub-resources
	 *  - sort lexicographically
	 *
	 * @param {String} resource
	 * @return {String}
	 * @api private
	 */

	function canonicalizeResource (resource) {
	  var url = parse(resource, true)
	    , path = url.pathname
	    , buf = []
	    ;

	  Object.keys(url.query).forEach(function(key){
	    if (!~keys.indexOf(key)) return
	    var val = '' == url.query[key] ? '' : '=' + encodeURIComponent(url.query[key])
	    buf.push(key + val)
	  })

	  return path + (buf.length ? '?' + buf.sort().join('&') : '')
	}
	module.exports.canonicalizeResource = canonicalizeResource


/***/ },

/***/ 85:
/***/ function(module, exports, require) {

	/* WEBPACK VAR INJECTION */(function(require, Buffer, process) {'use strict'

	var net = require(100)
	  , tls = require(76)
	  , http = require(70)
	  , https = require(75)
	  , events = require(20)
	  , assert = require(67)
	  , util = require(17)
	  ;

	exports.httpOverHttp = httpOverHttp
	exports.httpsOverHttp = httpsOverHttp
	exports.httpOverHttps = httpOverHttps
	exports.httpsOverHttps = httpsOverHttps


	function httpOverHttp(options) {
	  var agent = new TunnelingAgent(options)
	  agent.request = http.request
	  return agent
	}

	function httpsOverHttp(options) {
	  var agent = new TunnelingAgent(options)
	  agent.request = http.request
	  agent.createSocket = createSecureSocket
	  return agent
	}

	function httpOverHttps(options) {
	  var agent = new TunnelingAgent(options)
	  agent.request = https.request
	  return agent
	}

	function httpsOverHttps(options) {
	  var agent = new TunnelingAgent(options)
	  agent.request = https.request
	  agent.createSocket = createSecureSocket
	  return agent
	}


	function TunnelingAgent(options) {
	  var self = this
	  self.options = options || {}
	  self.proxyOptions = self.options.proxy || {}
	  self.maxSockets = self.options.maxSockets || http.Agent.defaultMaxSockets
	  self.requests = []
	  self.sockets = []

	  self.on('free', function onFree(socket, host, port) {
	    for (var i = 0, len = self.requests.length; i < len; ++i) {
	      var pending = self.requests[i]
	      if (pending.host === host && pending.port === port) {
	        // Detect the request to connect same origin server,
	        // reuse the connection.
	        self.requests.splice(i, 1)
	        pending.request.onSocket(socket)
	        return
	      }
	    }
	    socket.destroy()
	    self.removeSocket(socket)
	  })
	}
	util.inherits(TunnelingAgent, events.EventEmitter)

	TunnelingAgent.prototype.addRequest = function addRequest(req, host, port) {
	  var self = this

	  if (self.sockets.length >= this.maxSockets) {
	    // We are over limit so we'll add it to the queue.
	    self.requests.push({host: host, port: port, request: req})
	    return
	  }

	  // If we are under maxSockets create a new one.
	  self.createSocket({host: host, port: port, request: req}, function(socket) {
	    socket.on('free', onFree)
	    socket.on('close', onCloseOrRemove)
	    socket.on('agentRemove', onCloseOrRemove)
	    req.onSocket(socket)

	    function onFree() {
	      self.emit('free', socket, host, port)
	    }

	    function onCloseOrRemove(err) {
	      self.removeSocket()
	      socket.removeListener('free', onFree)
	      socket.removeListener('close', onCloseOrRemove)
	      socket.removeListener('agentRemove', onCloseOrRemove)
	    }
	  })
	}

	TunnelingAgent.prototype.createSocket = function createSocket(options, cb) {
	  var self = this
	  var placeholder = {}
	  self.sockets.push(placeholder)

	  var connectOptions = mergeOptions({}, self.proxyOptions, 
	    { method: 'CONNECT'
	    , path: options.host + ':' + options.port
	    , agent: false
	    }
	  )
	  if (connectOptions.proxyAuth) {
	    connectOptions.headers = connectOptions.headers || {}
	    connectOptions.headers['Proxy-Authorization'] = 'Basic ' +
	        new Buffer(connectOptions.proxyAuth).toString('base64')
	  }

	  debug('making CONNECT request')
	  var connectReq = self.request(connectOptions)
	  connectReq.useChunkedEncodingByDefault = false // for v0.6
	  connectReq.once('response', onResponse) // for v0.6
	  connectReq.once('upgrade', onUpgrade)   // for v0.6
	  connectReq.once('connect', onConnect)   // for v0.7 or later
	  connectReq.once('error', onError)
	  connectReq.end()

	  function onResponse(res) {
	    // Very hacky. This is necessary to avoid http-parser leaks.
	    res.upgrade = true
	  }

	  function onUpgrade(res, socket, head) {
	    // Hacky.
	    process.nextTick(function() {
	      onConnect(res, socket, head)
	    })
	  }

	  function onConnect(res, socket, head) {
	    connectReq.removeAllListeners()
	    socket.removeAllListeners()

	    if (res.statusCode === 200) {
	      assert.equal(head.length, 0)
	      debug('tunneling connection has established')
	      self.sockets[self.sockets.indexOf(placeholder)] = socket
	      cb(socket)
	    } else {
	      debug('tunneling socket could not be established, statusCode=%d', res.statusCode)
	      var error = new Error('tunneling socket could not be established, ' + 'statusCode=' + res.statusCode)
	      error.code = 'ECONNRESET'
	      options.request.emit('error', error)
	      self.removeSocket(placeholder)
	    }
	  }

	  function onError(cause) {
	    connectReq.removeAllListeners()

	    debug('tunneling socket could not be established, cause=%s\n', cause.message, cause.stack)
	    var error = new Error('tunneling socket could not be established, ' + 'cause=' + cause.message)
	    error.code = 'ECONNRESET'
	    options.request.emit('error', error)
	    self.removeSocket(placeholder)
	  }
	}

	TunnelingAgent.prototype.removeSocket = function removeSocket(socket) {
	  var pos = this.sockets.indexOf(socket)
	  if (pos === -1) return
	  
	  this.sockets.splice(pos, 1)

	  var pending = this.requests.shift()
	  if (pending) {
	    // If we have pending requests and a socket gets closed a new one
	    // needs to be created to take over in the pool for the one that closed.
	    this.createSocket(pending, function(socket) {
	      pending.request.onSocket(socket)
	    })
	  }
	}

	function createSecureSocket(options, cb) {
	  var self = this
	  TunnelingAgent.prototype.createSocket.call(self, options, function(socket) {
	    // 0 is dummy port for v0.6
	    var secureSocket = tls.connect(0, mergeOptions({}, self.options, 
	      { servername: options.host
	      , socket: socket
	      }
	    ))
	    cb(secureSocket)
	  })
	}


	function mergeOptions(target) {
	  for (var i = 1, len = arguments.length; i < len; ++i) {
	    var overrides = arguments[i]
	    if (typeof overrides === 'object') {
	      var keys = Object.keys(overrides)
	      for (var j = 0, keyLen = keys.length; j < keyLen; ++j) {
	        var k = keys[j]
	        if (overrides[k] !== undefined) {
	          target[k] = overrides[k]
	        }
	      }
	    }
	  }
	  return target
	}


	var debug
	if (process.env.NODE_DEBUG && /\btunnel\b/.test(process.env.NODE_DEBUG)) {
	  debug = function() {
	    var args = Array.prototype.slice.call(arguments)
	    if (typeof args[0] === 'string') {
	      args[0] = 'TUNNEL: ' + args[0]
	    } else {
	      args.unshift('TUNNEL:')
	    }
	    console.error.apply(console, args)
	  }
	} else {
	  debug = function() {}
	}
	exports.debug = debug // for test
	
	/* WEBPACK VAR INJECTION */}.call(exports, require, require(50).Buffer, require(15)))

/***/ },

/***/ 86:
/***/ function(module, exports, require) {

	module.exports = ForeverAgent
	ForeverAgent.SSL = ForeverAgentSSL

	var util = require(17)
	  , Agent = require(70).Agent
	  , net = require(100)
	  , tls = require(76)
	  , AgentSSL = require(75).Agent

	function ForeverAgent(options) {
	  var self = this
	  self.options = options || {}
	  self.requests = {}
	  self.sockets = {}
	  self.freeSockets = {}
	  self.maxSockets = self.options.maxSockets || Agent.defaultMaxSockets
	  self.minSockets = self.options.minSockets || ForeverAgent.defaultMinSockets
	  self.on('free', function(socket, host, port) {
	    var name = host + ':' + port
	    if (self.requests[name] && self.requests[name].length) {
	      self.requests[name].shift().onSocket(socket)
	    } else if (self.sockets[name].length < self.minSockets) {
	      if (!self.freeSockets[name]) self.freeSockets[name] = []
	      self.freeSockets[name].push(socket)
	      
	      // if an error happens while we don't use the socket anyway, meh, throw the socket away
	      function onIdleError() {
	        socket.destroy()
	      }
	      socket._onIdleError = onIdleError
	      socket.on('error', onIdleError)
	    } else {
	      // If there are no pending requests just destroy the
	      // socket and it will get removed from the pool. This
	      // gets us out of timeout issues and allows us to
	      // default to Connection:keep-alive.
	      socket.destroy()
	    }
	  })

	}
	util.inherits(ForeverAgent, Agent)

	ForeverAgent.defaultMinSockets = 5


	ForeverAgent.prototype.createConnection = net.createConnection
	ForeverAgent.prototype.addRequestNoreuse = Agent.prototype.addRequest
	ForeverAgent.prototype.addRequest = function(req, host, port) {
	  var name = host + ':' + port
	  if (this.freeSockets[name] && this.freeSockets[name].length > 0 && !req.useChunkedEncodingByDefault) {
	    var idleSocket = this.freeSockets[name].pop()
	    idleSocket.removeListener('error', idleSocket._onIdleError)
	    delete idleSocket._onIdleError
	    req._reusedSocket = true
	    req.onSocket(idleSocket)
	  } else {
	    this.addRequestNoreuse(req, host, port)
	  }
	}

	ForeverAgent.prototype.removeSocket = function(s, name, host, port) {
	  if (this.sockets[name]) {
	    var index = this.sockets[name].indexOf(s)
	    if (index !== -1) {
	      this.sockets[name].splice(index, 1)
	    }
	  } else if (this.sockets[name] && this.sockets[name].length === 0) {
	    // don't leak
	    delete this.sockets[name]
	    delete this.requests[name]
	  }
	  
	  if (this.freeSockets[name]) {
	    var index = this.freeSockets[name].indexOf(s)
	    if (index !== -1) {
	      this.freeSockets[name].splice(index, 1)
	      if (this.freeSockets[name].length === 0) {
	        delete this.freeSockets[name]
	      }
	    }
	  }

	  if (this.requests[name] && this.requests[name].length) {
	    // If we have pending requests and a socket gets closed a new one
	    // needs to be created to take over in the pool for the one that closed.
	    this.createSocket(name, host, port).emit('free')
	  }
	}

	function ForeverAgentSSL (options) {
	  ForeverAgent.call(this, options)
	}
	util.inherits(ForeverAgentSSL, ForeverAgent)

	ForeverAgentSSL.prototype.createConnection = createConnectionSSL
	ForeverAgentSSL.prototype.addRequestNoreuse = AgentSSL.prototype.addRequest

	function createConnectionSSL (port, host, options) {
	  if (typeof port === 'object') {
	    options = port;
	  } else if (typeof host === 'object') {
	    options = host;
	  } else if (typeof options === 'object') {
	    options = options;
	  } else {
	    options = {};
	  }

	  if (typeof port === 'number') {
	    options.port = port;
	  }

	  if (typeof host === 'string') {
	    options.host = host;
	  }

	  return tls.connect(options);
	}


/***/ },

/***/ 87:
/***/ function(module, exports, require) {

	/*!
	* Tobi - CookieJar
	* Copyright(c) 2010 LearnBoost <dev@learnboost.com>
	* MIT Licensed
	*/

	/**
	* Module dependencies.
	*/

	var url = require(18);

	/**
	* Initialize a new `CookieJar`.
	*
	* @api private
	*/

	var CookieJar = exports = module.exports = function CookieJar() {
	  this.cookies = [];
	};

	/**
	* Add the given `cookie` to the jar.
	*
	* @param {Cookie} cookie
	* @api private
	*/

	CookieJar.prototype.add = function(cookie){
	  this.cookies = this.cookies.filter(function(c){
	    // Avoid duplication (same path, same name)
	    return !(c.name == cookie.name && c.path == cookie.path);
	  });
	  this.cookies.push(cookie);
	};

	/**
	* Get cookies for the given `req`.
	*
	* @param {IncomingRequest} req
	* @return {Array}
	* @api private
	*/

	CookieJar.prototype.get = function(req){
	  var path = url.parse(req.url).pathname
	    , now = new Date
	    , specificity = {};
	  return this.cookies.filter(function(cookie){
	    if (0 == path.indexOf(cookie.path) && now < cookie.expires
	      && cookie.path.length > (specificity[cookie.name] || 0))
	      return specificity[cookie.name] = cookie.path.length;
	  });
	};

	/**
	* Return Cookie string for the given `req`.
	*
	* @param {IncomingRequest} req
	* @return {String}
	* @api private
	*/

	CookieJar.prototype.cookieString = function(req){
	  var cookies = this.get(req);
	  if (cookies.length) {
	    return cookies.map(function(cookie){
	      return cookie.name + '=' + cookie.value;
	    }).join('; ');
	  }
	};


/***/ },

/***/ 88:
/***/ function(module, exports, require) {

	var Stream = require(71);
	var Response = require(101);
	var concatStream = require(108)

	var Request = module.exports = function (xhr, params) {
	    var self = this;
	    self.writable = true;
	    self.xhr = xhr;
	    self.body = concatStream()
	    
	    var uri = params.host + ':' + params.port + (params.path || '/');
	    
	    xhr.open(
	        params.method || 'GET',
	        (params.scheme || 'http') + '://' + uri,
	        true
	    );
	    
	    if (params.headers) {
	        var keys = objectKeys(params.headers);
	        for (var i = 0; i < keys.length; i++) {
	            var key = keys[i];
	            if (!self.isSafeRequestHeader(key)) return;
	            var value = params.headers[key];
	            if (isArray(value)) {
	                for (var j = 0; j < value.length; j++) {
	                    xhr.setRequestHeader(key, value[j]);
	                }
	            }
	            else xhr.setRequestHeader(key, value)
	        }
	    }
	    
	    var res = new Response;
	    res.on('close', function () {
	        self.emit('close');
	    });
	    
	    res.on('ready', function () {
	        self.emit('response', res);
	    });
	    
	    xhr.onreadystatechange = function () {
	        res.handle(xhr);
	    };
	};

	Request.prototype = new Stream;

	Request.prototype.setHeader = function (key, value) {
	    if (isArray(value)) {
	        for (var i = 0; i < value.length; i++) {
	            this.xhr.setRequestHeader(key, value[i]);
	        }
	    }
	    else {
	        this.xhr.setRequestHeader(key, value);
	    }
	};

	Request.prototype.write = function (s) {
	    this.body.write(s);
	};

	Request.prototype.destroy = function (s) {
	    this.xhr.abort();
	    this.emit('close');
	};

	Request.prototype.end = function (s) {
	    if (s !== undefined) this.body.write(s);
	    this.body.end()
	    this.xhr.send(this.body.getBody());
	};

	// Taken from http://dxr.mozilla.org/mozilla/mozilla-central/content/base/src/nsXMLHttpRequest.cpp.html
	Request.unsafeHeaders = [
	    "accept-charset",
	    "accept-encoding",
	    "access-control-request-headers",
	    "access-control-request-method",
	    "connection",
	    "content-length",
	    "cookie",
	    "cookie2",
	    "content-transfer-encoding",
	    "date",
	    "expect",
	    "host",
	    "keep-alive",
	    "origin",
	    "referer",
	    "te",
	    "trailer",
	    "transfer-encoding",
	    "upgrade",
	    "user-agent",
	    "via"
	];

	Request.prototype.isSafeRequestHeader = function (headerName) {
	    if (!headerName) return false;
	    return indexOf(Request.unsafeHeaders, headerName.toLowerCase()) === -1;
	};

	var objectKeys = Object.keys || function (obj) {
	    var keys = [];
	    for (var key in obj) keys.push(key);
	    return keys;
	};

	var isArray = Array.isArray || function (xs) {
	    return Object.prototype.toString.call(xs) === '[object Array]';
	};

	var indexOf = function (xs, x) {
	    if (xs.indexOf) return xs.indexOf(x);
	    for (var i = 0; i < xs.length; i++) {
	        if (xs[i] === x) return i;
	    }
	    return -1;
	};


/***/ },

/***/ 89:
/***/ function(module, exports, require) {

	/*
	 * A JavaScript implementation of the Secure Hash Algorithm, SHA-1, as defined
	 * in FIPS PUB 180-1
	 * Version 2.1a Copyright Paul Johnston 2000 - 2002.
	 * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
	 * Distributed under the BSD License
	 * See http://pajhome.org.uk/crypt/md5 for details.
	 */

	exports.hex_sha1 = hex_sha1;
	exports.b64_sha1 = b64_sha1;
	exports.str_sha1 = str_sha1;
	exports.hex_hmac_sha1 = hex_hmac_sha1;
	exports.b64_hmac_sha1 = b64_hmac_sha1;
	exports.str_hmac_sha1 = str_hmac_sha1;

	/*
	 * Configurable variables. You may need to tweak these to be compatible with
	 * the server-side, but the defaults work in most cases.
	 */
	var hexcase = 0;  /* hex output format. 0 - lowercase; 1 - uppercase        */
	var b64pad  = ""; /* base-64 pad character. "=" for strict RFC compliance   */
	var chrsz   = 8;  /* bits per input character. 8 - ASCII; 16 - Unicode      */

	/*
	 * These are the functions you'll usually want to call
	 * They take string arguments and return either hex or base-64 encoded strings
	 */
	function hex_sha1(s){return binb2hex(core_sha1(str2binb(s),s.length * chrsz));}
	function b64_sha1(s){return binb2b64(core_sha1(str2binb(s),s.length * chrsz));}
	function str_sha1(s){return binb2str(core_sha1(str2binb(s),s.length * chrsz));}
	function hex_hmac_sha1(key, data){ return binb2hex(core_hmac_sha1(key, data));}
	function b64_hmac_sha1(key, data){ return binb2b64(core_hmac_sha1(key, data));}
	function str_hmac_sha1(key, data){ return binb2str(core_hmac_sha1(key, data));}

	/*
	 * Perform a simple self-test to see if the VM is working
	 */
	function sha1_vm_test()
	{
	  return hex_sha1("abc") == "a9993e364706816aba3e25717850c26c9cd0d89d";
	}

	/*
	 * Calculate the SHA-1 of an array of big-endian words, and a bit length
	 */
	function core_sha1(x, len)
	{
	  /* append padding */
	  x[len >> 5] |= 0x80 << (24 - len % 32);
	  x[((len + 64 >> 9) << 4) + 15] = len;

	  var w = Array(80);
	  var a =  1732584193;
	  var b = -271733879;
	  var c = -1732584194;
	  var d =  271733878;
	  var e = -1009589776;

	  for(var i = 0; i < x.length; i += 16)
	  {
	    var olda = a;
	    var oldb = b;
	    var oldc = c;
	    var oldd = d;
	    var olde = e;

	    for(var j = 0; j < 80; j++)
	    {
	      if(j < 16) w[j] = x[i + j];
	      else w[j] = rol(w[j-3] ^ w[j-8] ^ w[j-14] ^ w[j-16], 1);
	      var t = safe_add(safe_add(rol(a, 5), sha1_ft(j, b, c, d)),
	                       safe_add(safe_add(e, w[j]), sha1_kt(j)));
	      e = d;
	      d = c;
	      c = rol(b, 30);
	      b = a;
	      a = t;
	    }

	    a = safe_add(a, olda);
	    b = safe_add(b, oldb);
	    c = safe_add(c, oldc);
	    d = safe_add(d, oldd);
	    e = safe_add(e, olde);
	  }
	  return Array(a, b, c, d, e);

	}

	/*
	 * Perform the appropriate triplet combination function for the current
	 * iteration
	 */
	function sha1_ft(t, b, c, d)
	{
	  if(t < 20) return (b & c) | ((~b) & d);
	  if(t < 40) return b ^ c ^ d;
	  if(t < 60) return (b & c) | (b & d) | (c & d);
	  return b ^ c ^ d;
	}

	/*
	 * Determine the appropriate additive constant for the current iteration
	 */
	function sha1_kt(t)
	{
	  return (t < 20) ?  1518500249 : (t < 40) ?  1859775393 :
	         (t < 60) ? -1894007588 : -899497514;
	}

	/*
	 * Calculate the HMAC-SHA1 of a key and some data
	 */
	function core_hmac_sha1(key, data)
	{
	  var bkey = str2binb(key);
	  if(bkey.length > 16) bkey = core_sha1(bkey, key.length * chrsz);

	  var ipad = Array(16), opad = Array(16);
	  for(var i = 0; i < 16; i++)
	  {
	    ipad[i] = bkey[i] ^ 0x36363636;
	    opad[i] = bkey[i] ^ 0x5C5C5C5C;
	  }

	  var hash = core_sha1(ipad.concat(str2binb(data)), 512 + data.length * chrsz);
	  return core_sha1(opad.concat(hash), 512 + 160);
	}

	/*
	 * Add integers, wrapping at 2^32. This uses 16-bit operations internally
	 * to work around bugs in some JS interpreters.
	 */
	function safe_add(x, y)
	{
	  var lsw = (x & 0xFFFF) + (y & 0xFFFF);
	  var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
	  return (msw << 16) | (lsw & 0xFFFF);
	}

	/*
	 * Bitwise rotate a 32-bit number to the left.
	 */
	function rol(num, cnt)
	{
	  return (num << cnt) | (num >>> (32 - cnt));
	}

	/*
	 * Convert an 8-bit or 16-bit string to an array of big-endian words
	 * In 8-bit function, characters >255 have their hi-byte silently ignored.
	 */
	function str2binb(str)
	{
	  var bin = Array();
	  var mask = (1 << chrsz) - 1;
	  for(var i = 0; i < str.length * chrsz; i += chrsz)
	    bin[i>>5] |= (str.charCodeAt(i / chrsz) & mask) << (32 - chrsz - i%32);
	  return bin;
	}

	/*
	 * Convert an array of big-endian words to a string
	 */
	function binb2str(bin)
	{
	  var str = "";
	  var mask = (1 << chrsz) - 1;
	  for(var i = 0; i < bin.length * 32; i += chrsz)
	    str += String.fromCharCode((bin[i>>5] >>> (32 - chrsz - i%32)) & mask);
	  return str;
	}

	/*
	 * Convert an array of big-endian words to a hex string.
	 */
	function binb2hex(binarray)
	{
	  var hex_tab = hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
	  var str = "";
	  for(var i = 0; i < binarray.length * 4; i++)
	  {
	    str += hex_tab.charAt((binarray[i>>2] >> ((3 - i%4)*8+4)) & 0xF) +
	           hex_tab.charAt((binarray[i>>2] >> ((3 - i%4)*8  )) & 0xF);
	  }
	  return str;
	}

	/*
	 * Convert an array of big-endian words to a base-64 string
	 */
	function binb2b64(binarray)
	{
	  var tab = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
	  var str = "";
	  for(var i = 0; i < binarray.length * 4; i += 3)
	  {
	    var triplet = (((binarray[i   >> 2] >> 8 * (3 -  i   %4)) & 0xFF) << 16)
	                | (((binarray[i+1 >> 2] >> 8 * (3 - (i+1)%4)) & 0xFF) << 8 )
	                |  ((binarray[i+2 >> 2] >> 8 * (3 - (i+2)%4)) & 0xFF);
	    for(var j = 0; j < 4; j++)
	    {
	      if(i * 8 + j * 6 > binarray.length * 32) str += b64pad;
	      else str += tab.charAt((triplet >> 6*(3-j)) & 0x3F);
	    }
	  }
	  return str;
	}



/***/ },

/***/ 90:
/***/ function(module, exports, require) {

	// Original code adapted from Robert Kieffer.
	// details at https://github.com/broofa/node-uuid
	(function() {
	  var _global = this;

	  var mathRNG, whatwgRNG;

	  // NOTE: Math.random() does not guarantee "cryptographic quality"
	  mathRNG = function(size) {
	    var bytes = new Array(size);
	    var r;

	    for (var i = 0, r; i < size; i++) {
	      if ((i & 0x03) == 0) r = Math.random() * 0x100000000;
	      bytes[i] = r >>> ((i & 0x03) << 3) & 0xff;
	    }

	    return bytes;
	  }

	  // currently only available in webkit-based browsers.
	  if (_global.crypto && crypto.getRandomValues) {
	    var _rnds = new Uint32Array(4);
	    whatwgRNG = function(size) {
	      var bytes = new Array(size);
	      crypto.getRandomValues(_rnds);

	      for (var c = 0 ; c < size; c++) {
	        bytes[c] = _rnds[c >> 2] >>> ((c & 0x03) * 8) & 0xff;
	      }
	      return bytes;
	    }
	  }

	  module.exports = whatwgRNG || mathRNG;

	}())

/***/ },

/***/ 91:
/***/ function(module, exports, require) {

	/*
	 * A JavaScript implementation of the RSA Data Security, Inc. MD5 Message
	 * Digest Algorithm, as defined in RFC 1321.
	 * Version 2.2 Copyright (C) Paul Johnston 1999 - 2009
	 * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
	 * Distributed under the BSD License
	 * See http://pajhome.org.uk/crypt/md5 for more info.
	 */

	/*
	 * Configurable variables. You may need to tweak these to be compatible with
	 * the server-side, but the defaults work in most cases.
	 */
	var hexcase = 0;   /* hex output format. 0 - lowercase; 1 - uppercase        */
	var b64pad  = "";  /* base-64 pad character. "=" for strict RFC compliance   */

	/*
	 * These are the functions you'll usually want to call
	 * They take string arguments and return either hex or base-64 encoded strings
	 */
	function hex_md5(s)    { return rstr2hex(rstr_md5(str2rstr_utf8(s))); }
	function b64_md5(s)    { return rstr2b64(rstr_md5(str2rstr_utf8(s))); }
	function any_md5(s, e) { return rstr2any(rstr_md5(str2rstr_utf8(s)), e); }
	function hex_hmac_md5(k, d)
	  { return rstr2hex(rstr_hmac_md5(str2rstr_utf8(k), str2rstr_utf8(d))); }
	function b64_hmac_md5(k, d)
	  { return rstr2b64(rstr_hmac_md5(str2rstr_utf8(k), str2rstr_utf8(d))); }
	function any_hmac_md5(k, d, e)
	  { return rstr2any(rstr_hmac_md5(str2rstr_utf8(k), str2rstr_utf8(d)), e); }

	/*
	 * Perform a simple self-test to see if the VM is working
	 */
	function md5_vm_test()
	{
	  return hex_md5("abc").toLowerCase() == "900150983cd24fb0d6963f7d28e17f72";
	}

	/*
	 * Calculate the MD5 of a raw string
	 */
	function rstr_md5(s)
	{
	  return binl2rstr(binl_md5(rstr2binl(s), s.length * 8));
	}

	/*
	 * Calculate the HMAC-MD5, of a key and some data (raw strings)
	 */
	function rstr_hmac_md5(key, data)
	{
	  var bkey = rstr2binl(key);
	  if(bkey.length > 16) bkey = binl_md5(bkey, key.length * 8);

	  var ipad = Array(16), opad = Array(16);
	  for(var i = 0; i < 16; i++)
	  {
	    ipad[i] = bkey[i] ^ 0x36363636;
	    opad[i] = bkey[i] ^ 0x5C5C5C5C;
	  }

	  var hash = binl_md5(ipad.concat(rstr2binl(data)), 512 + data.length * 8);
	  return binl2rstr(binl_md5(opad.concat(hash), 512 + 128));
	}

	/*
	 * Convert a raw string to a hex string
	 */
	function rstr2hex(input)
	{
	  try { hexcase } catch(e) { hexcase=0; }
	  var hex_tab = hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
	  var output = "";
	  var x;
	  for(var i = 0; i < input.length; i++)
	  {
	    x = input.charCodeAt(i);
	    output += hex_tab.charAt((x >>> 4) & 0x0F)
	           +  hex_tab.charAt( x        & 0x0F);
	  }
	  return output;
	}

	/*
	 * Convert a raw string to a base-64 string
	 */
	function rstr2b64(input)
	{
	  try { b64pad } catch(e) { b64pad=''; }
	  var tab = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
	  var output = "";
	  var len = input.length;
	  for(var i = 0; i < len; i += 3)
	  {
	    var triplet = (input.charCodeAt(i) << 16)
	                | (i + 1 < len ? input.charCodeAt(i+1) << 8 : 0)
	                | (i + 2 < len ? input.charCodeAt(i+2)      : 0);
	    for(var j = 0; j < 4; j++)
	    {
	      if(i * 8 + j * 6 > input.length * 8) output += b64pad;
	      else output += tab.charAt((triplet >>> 6*(3-j)) & 0x3F);
	    }
	  }
	  return output;
	}

	/*
	 * Convert a raw string to an arbitrary string encoding
	 */
	function rstr2any(input, encoding)
	{
	  var divisor = encoding.length;
	  var i, j, q, x, quotient;

	  /* Convert to an array of 16-bit big-endian values, forming the dividend */
	  var dividend = Array(Math.ceil(input.length / 2));
	  for(i = 0; i < dividend.length; i++)
	  {
	    dividend[i] = (input.charCodeAt(i * 2) << 8) | input.charCodeAt(i * 2 + 1);
	  }

	  /*
	   * Repeatedly perform a long division. The binary array forms the dividend,
	   * the length of the encoding is the divisor. Once computed, the quotient
	   * forms the dividend for the next step. All remainders are stored for later
	   * use.
	   */
	  var full_length = Math.ceil(input.length * 8 /
	                                    (Math.log(encoding.length) / Math.log(2)));
	  var remainders = Array(full_length);
	  for(j = 0; j < full_length; j++)
	  {
	    quotient = Array();
	    x = 0;
	    for(i = 0; i < dividend.length; i++)
	    {
	      x = (x << 16) + dividend[i];
	      q = Math.floor(x / divisor);
	      x -= q * divisor;
	      if(quotient.length > 0 || q > 0)
	        quotient[quotient.length] = q;
	    }
	    remainders[j] = x;
	    dividend = quotient;
	  }

	  /* Convert the remainders to the output string */
	  var output = "";
	  for(i = remainders.length - 1; i >= 0; i--)
	    output += encoding.charAt(remainders[i]);

	  return output;
	}

	/*
	 * Encode a string as utf-8.
	 * For efficiency, this assumes the input is valid utf-16.
	 */
	function str2rstr_utf8(input)
	{
	  var output = "";
	  var i = -1;
	  var x, y;

	  while(++i < input.length)
	  {
	    /* Decode utf-16 surrogate pairs */
	    x = input.charCodeAt(i);
	    y = i + 1 < input.length ? input.charCodeAt(i + 1) : 0;
	    if(0xD800 <= x && x <= 0xDBFF && 0xDC00 <= y && y <= 0xDFFF)
	    {
	      x = 0x10000 + ((x & 0x03FF) << 10) + (y & 0x03FF);
	      i++;
	    }

	    /* Encode output as utf-8 */
	    if(x <= 0x7F)
	      output += String.fromCharCode(x);
	    else if(x <= 0x7FF)
	      output += String.fromCharCode(0xC0 | ((x >>> 6 ) & 0x1F),
	                                    0x80 | ( x         & 0x3F));
	    else if(x <= 0xFFFF)
	      output += String.fromCharCode(0xE0 | ((x >>> 12) & 0x0F),
	                                    0x80 | ((x >>> 6 ) & 0x3F),
	                                    0x80 | ( x         & 0x3F));
	    else if(x <= 0x1FFFFF)
	      output += String.fromCharCode(0xF0 | ((x >>> 18) & 0x07),
	                                    0x80 | ((x >>> 12) & 0x3F),
	                                    0x80 | ((x >>> 6 ) & 0x3F),
	                                    0x80 | ( x         & 0x3F));
	  }
	  return output;
	}

	/*
	 * Encode a string as utf-16
	 */
	function str2rstr_utf16le(input)
	{
	  var output = "";
	  for(var i = 0; i < input.length; i++)
	    output += String.fromCharCode( input.charCodeAt(i)        & 0xFF,
	                                  (input.charCodeAt(i) >>> 8) & 0xFF);
	  return output;
	}

	function str2rstr_utf16be(input)
	{
	  var output = "";
	  for(var i = 0; i < input.length; i++)
	    output += String.fromCharCode((input.charCodeAt(i) >>> 8) & 0xFF,
	                                   input.charCodeAt(i)        & 0xFF);
	  return output;
	}

	/*
	 * Convert a raw string to an array of little-endian words
	 * Characters >255 have their high-byte silently ignored.
	 */
	function rstr2binl(input)
	{
	  var output = Array(input.length >> 2);
	  for(var i = 0; i < output.length; i++)
	    output[i] = 0;
	  for(var i = 0; i < input.length * 8; i += 8)
	    output[i>>5] |= (input.charCodeAt(i / 8) & 0xFF) << (i%32);
	  return output;
	}

	/*
	 * Convert an array of little-endian words to a string
	 */
	function binl2rstr(input)
	{
	  var output = "";
	  for(var i = 0; i < input.length * 32; i += 8)
	    output += String.fromCharCode((input[i>>5] >>> (i % 32)) & 0xFF);
	  return output;
	}

	/*
	 * Calculate the MD5 of an array of little-endian words, and a bit length.
	 */
	function binl_md5(x, len)
	{
	  /* append padding */
	  x[len >> 5] |= 0x80 << ((len) % 32);
	  x[(((len + 64) >>> 9) << 4) + 14] = len;

	  var a =  1732584193;
	  var b = -271733879;
	  var c = -1732584194;
	  var d =  271733878;

	  for(var i = 0; i < x.length; i += 16)
	  {
	    var olda = a;
	    var oldb = b;
	    var oldc = c;
	    var oldd = d;

	    a = md5_ff(a, b, c, d, x[i+ 0], 7 , -680876936);
	    d = md5_ff(d, a, b, c, x[i+ 1], 12, -389564586);
	    c = md5_ff(c, d, a, b, x[i+ 2], 17,  606105819);
	    b = md5_ff(b, c, d, a, x[i+ 3], 22, -1044525330);
	    a = md5_ff(a, b, c, d, x[i+ 4], 7 , -176418897);
	    d = md5_ff(d, a, b, c, x[i+ 5], 12,  1200080426);
	    c = md5_ff(c, d, a, b, x[i+ 6], 17, -1473231341);
	    b = md5_ff(b, c, d, a, x[i+ 7], 22, -45705983);
	    a = md5_ff(a, b, c, d, x[i+ 8], 7 ,  1770035416);
	    d = md5_ff(d, a, b, c, x[i+ 9], 12, -1958414417);
	    c = md5_ff(c, d, a, b, x[i+10], 17, -42063);
	    b = md5_ff(b, c, d, a, x[i+11], 22, -1990404162);
	    a = md5_ff(a, b, c, d, x[i+12], 7 ,  1804603682);
	    d = md5_ff(d, a, b, c, x[i+13], 12, -40341101);
	    c = md5_ff(c, d, a, b, x[i+14], 17, -1502002290);
	    b = md5_ff(b, c, d, a, x[i+15], 22,  1236535329);

	    a = md5_gg(a, b, c, d, x[i+ 1], 5 , -165796510);
	    d = md5_gg(d, a, b, c, x[i+ 6], 9 , -1069501632);
	    c = md5_gg(c, d, a, b, x[i+11], 14,  643717713);
	    b = md5_gg(b, c, d, a, x[i+ 0], 20, -373897302);
	    a = md5_gg(a, b, c, d, x[i+ 5], 5 , -701558691);
	    d = md5_gg(d, a, b, c, x[i+10], 9 ,  38016083);
	    c = md5_gg(c, d, a, b, x[i+15], 14, -660478335);
	    b = md5_gg(b, c, d, a, x[i+ 4], 20, -405537848);
	    a = md5_gg(a, b, c, d, x[i+ 9], 5 ,  568446438);
	    d = md5_gg(d, a, b, c, x[i+14], 9 , -1019803690);
	    c = md5_gg(c, d, a, b, x[i+ 3], 14, -187363961);
	    b = md5_gg(b, c, d, a, x[i+ 8], 20,  1163531501);
	    a = md5_gg(a, b, c, d, x[i+13], 5 , -1444681467);
	    d = md5_gg(d, a, b, c, x[i+ 2], 9 , -51403784);
	    c = md5_gg(c, d, a, b, x[i+ 7], 14,  1735328473);
	    b = md5_gg(b, c, d, a, x[i+12], 20, -1926607734);

	    a = md5_hh(a, b, c, d, x[i+ 5], 4 , -378558);
	    d = md5_hh(d, a, b, c, x[i+ 8], 11, -2022574463);
	    c = md5_hh(c, d, a, b, x[i+11], 16,  1839030562);
	    b = md5_hh(b, c, d, a, x[i+14], 23, -35309556);
	    a = md5_hh(a, b, c, d, x[i+ 1], 4 , -1530992060);
	    d = md5_hh(d, a, b, c, x[i+ 4], 11,  1272893353);
	    c = md5_hh(c, d, a, b, x[i+ 7], 16, -155497632);
	    b = md5_hh(b, c, d, a, x[i+10], 23, -1094730640);
	    a = md5_hh(a, b, c, d, x[i+13], 4 ,  681279174);
	    d = md5_hh(d, a, b, c, x[i+ 0], 11, -358537222);
	    c = md5_hh(c, d, a, b, x[i+ 3], 16, -722521979);
	    b = md5_hh(b, c, d, a, x[i+ 6], 23,  76029189);
	    a = md5_hh(a, b, c, d, x[i+ 9], 4 , -640364487);
	    d = md5_hh(d, a, b, c, x[i+12], 11, -421815835);
	    c = md5_hh(c, d, a, b, x[i+15], 16,  530742520);
	    b = md5_hh(b, c, d, a, x[i+ 2], 23, -995338651);

	    a = md5_ii(a, b, c, d, x[i+ 0], 6 , -198630844);
	    d = md5_ii(d, a, b, c, x[i+ 7], 10,  1126891415);
	    c = md5_ii(c, d, a, b, x[i+14], 15, -1416354905);
	    b = md5_ii(b, c, d, a, x[i+ 5], 21, -57434055);
	    a = md5_ii(a, b, c, d, x[i+12], 6 ,  1700485571);
	    d = md5_ii(d, a, b, c, x[i+ 3], 10, -1894986606);
	    c = md5_ii(c, d, a, b, x[i+10], 15, -1051523);
	    b = md5_ii(b, c, d, a, x[i+ 1], 21, -2054922799);
	    a = md5_ii(a, b, c, d, x[i+ 8], 6 ,  1873313359);
	    d = md5_ii(d, a, b, c, x[i+15], 10, -30611744);
	    c = md5_ii(c, d, a, b, x[i+ 6], 15, -1560198380);
	    b = md5_ii(b, c, d, a, x[i+13], 21,  1309151649);
	    a = md5_ii(a, b, c, d, x[i+ 4], 6 , -145523070);
	    d = md5_ii(d, a, b, c, x[i+11], 10, -1120210379);
	    c = md5_ii(c, d, a, b, x[i+ 2], 15,  718787259);
	    b = md5_ii(b, c, d, a, x[i+ 9], 21, -343485551);

	    a = safe_add(a, olda);
	    b = safe_add(b, oldb);
	    c = safe_add(c, oldc);
	    d = safe_add(d, oldd);
	  }
	  return Array(a, b, c, d);
	}

	/*
	 * These functions implement the four basic operations the algorithm uses.
	 */
	function md5_cmn(q, a, b, x, s, t)
	{
	  return safe_add(bit_rol(safe_add(safe_add(a, q), safe_add(x, t)), s),b);
	}
	function md5_ff(a, b, c, d, x, s, t)
	{
	  return md5_cmn((b & c) | ((~b) & d), a, b, x, s, t);
	}
	function md5_gg(a, b, c, d, x, s, t)
	{
	  return md5_cmn((b & d) | (c & (~d)), a, b, x, s, t);
	}
	function md5_hh(a, b, c, d, x, s, t)
	{
	  return md5_cmn(b ^ c ^ d, a, b, x, s, t);
	}
	function md5_ii(a, b, c, d, x, s, t)
	{
	  return md5_cmn(c ^ (b | (~d)), a, b, x, s, t);
	}

	/*
	 * Add integers, wrapping at 2^32. This uses 16-bit operations internally
	 * to work around bugs in some JS interpreters.
	 */
	function safe_add(x, y)
	{
	  var lsw = (x & 0xFFFF) + (y & 0xFFFF);
	  var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
	  return (msw << 16) | (lsw & 0xFFFF);
	}

	/*
	 * Bitwise rotate a 32-bit number to the left.
	 */
	function bit_rol(num, cnt)
	{
	  return (num << cnt) | (num >>> (32 - cnt));
	}


	exports.hex_md5 = hex_md5;
	exports.b64_md5 = b64_md5;
	exports.any_md5 = any_md5;


/***/ },

/***/ 92:
/***/ function(module, exports, require) {

	// Copyright 2011 Joyent, Inc.  All rights reserved.

	var parser = require(103);
	var signer = require(104);
	var verify = require(105);
	var util = require(106);



	///--- API

	module.exports = {

	  parse: parser.parseRequest,
	  parseRequest: parser.parseRequest,

	  sign: signer.signRequest,
	  signRequest: signer.signRequest,

	  sshKeyToPEM: util.sshKeyToPEM,
	  sshKeyFingerprint: util.fingerprint,

	  verify: verify.verifySignature,
	  verifySignature: verify.verifySignature
	};


/***/ },

/***/ 93:
/***/ function(module, exports, require) {

	/* WEBPACK VAR INJECTION */(function(require, Buffer) {var __WEBPACK_AMD_DEFINE_RESULT__;//     uuid.js
	//
	//     Copyright (c) 2010-2012 Robert Kieffer
	//     MIT License - http://opensource.org/licenses/mit-license.php

	(function() {
	  var _global = this;

	  // Unique ID creation requires a high quality random # generator.  We feature
	  // detect to determine the best RNG source, normalizing to a function that
	  // returns 128-bits of randomness, since that's what's usually required
	  var _rng;

	  // Node.js crypto-based RNG - http://nodejs.org/docs/v0.6.2/api/crypto.html
	  //
	  // Moderately fast, high quality
	  if (true) {
	    try {
	      var _rb = require(72).randomBytes;
	      _rng = _rb && function() {return _rb(16);};
	    } catch(e) {}
	  }

	  if (!_rng && _global.crypto && crypto.getRandomValues) {
	    // WHATWG crypto-based RNG - http://wiki.whatwg.org/wiki/Crypto
	    //
	    // Moderately fast, high quality
	    var _rnds8 = new Uint8Array(16);
	    _rng = function whatwgRNG() {
	      crypto.getRandomValues(_rnds8);
	      return _rnds8;
	    };
	  }

	  if (!_rng) {
	    // Math.random()-based (RNG)
	    //
	    // If all else fails, use Math.random().  It's fast, but is of unspecified
	    // quality.
	    var  _rnds = new Array(16);
	    _rng = function() {
	      for (var i = 0, r; i < 16; i++) {
	        if ((i & 0x03) === 0) r = Math.random() * 0x100000000;
	        _rnds[i] = r >>> ((i & 0x03) << 3) & 0xff;
	      }

	      return _rnds;
	    };
	  }

	  // Buffer class to use
	  var BufferClass = typeof(Buffer) == 'function' ? Buffer : Array;

	  // Maps for number <-> hex string conversion
	  var _byteToHex = [];
	  var _hexToByte = {};
	  for (var i = 0; i < 256; i++) {
	    _byteToHex[i] = (i + 0x100).toString(16).substr(1);
	    _hexToByte[_byteToHex[i]] = i;
	  }

	  // **`parse()` - Parse a UUID into it's component bytes**
	  function parse(s, buf, offset) {
	    var i = (buf && offset) || 0, ii = 0;

	    buf = buf || [];
	    s.toLowerCase().replace(/[0-9a-f]{2}/g, function(oct) {
	      if (ii < 16) { // Don't overflow!
	        buf[i + ii++] = _hexToByte[oct];
	      }
	    });

	    // Zero out remaining bytes if string was short
	    while (ii < 16) {
	      buf[i + ii++] = 0;
	    }

	    return buf;
	  }

	  // **`unparse()` - Convert UUID byte array (ala parse()) into a string**
	  function unparse(buf, offset) {
	    var i = offset || 0, bth = _byteToHex;
	    return  bth[buf[i++]] + bth[buf[i++]] +
	            bth[buf[i++]] + bth[buf[i++]] + '-' +
	            bth[buf[i++]] + bth[buf[i++]] + '-' +
	            bth[buf[i++]] + bth[buf[i++]] + '-' +
	            bth[buf[i++]] + bth[buf[i++]] + '-' +
	            bth[buf[i++]] + bth[buf[i++]] +
	            bth[buf[i++]] + bth[buf[i++]] +
	            bth[buf[i++]] + bth[buf[i++]];
	  }

	  // **`v1()` - Generate time-based UUID**
	  //
	  // Inspired by https://github.com/LiosK/UUID.js
	  // and http://docs.python.org/library/uuid.html

	  // random #'s we need to init node and clockseq
	  var _seedBytes = _rng();

	  // Per 4.5, create and 48-bit node id, (47 random bits + multicast bit = 1)
	  var _nodeId = [
	    _seedBytes[0] | 0x01,
	    _seedBytes[1], _seedBytes[2], _seedBytes[3], _seedBytes[4], _seedBytes[5]
	  ];

	  // Per 4.2.2, randomize (14 bit) clockseq
	  var _clockseq = (_seedBytes[6] << 8 | _seedBytes[7]) & 0x3fff;

	  // Previous uuid creation time
	  var _lastMSecs = 0, _lastNSecs = 0;

	  // See https://github.com/broofa/node-uuid for API details
	  function v1(options, buf, offset) {
	    var i = buf && offset || 0;
	    var b = buf || [];

	    options = options || {};

	    var clockseq = options.clockseq != null ? options.clockseq : _clockseq;

	    // UUID timestamps are 100 nano-second units since the Gregorian epoch,
	    // (1582-10-15 00:00).  JSNumbers aren't precise enough for this, so
	    // time is handled internally as 'msecs' (integer milliseconds) and 'nsecs'
	    // (100-nanoseconds offset from msecs) since unix epoch, 1970-01-01 00:00.
	    var msecs = options.msecs != null ? options.msecs : new Date().getTime();

	    // Per 4.2.1.2, use count of uuid's generated during the current clock
	    // cycle to simulate higher resolution clock
	    var nsecs = options.nsecs != null ? options.nsecs : _lastNSecs + 1;

	    // Time since last uuid creation (in msecs)
	    var dt = (msecs - _lastMSecs) + (nsecs - _lastNSecs)/10000;

	    // Per 4.2.1.2, Bump clockseq on clock regression
	    if (dt < 0 && options.clockseq == null) {
	      clockseq = clockseq + 1 & 0x3fff;
	    }

	    // Reset nsecs if clock regresses (new clockseq) or we've moved onto a new
	    // time interval
	    if ((dt < 0 || msecs > _lastMSecs) && options.nsecs == null) {
	      nsecs = 0;
	    }

	    // Per 4.2.1.2 Throw error if too many uuids are requested
	    if (nsecs >= 10000) {
	      throw new Error('uuid.v1(): Can\'t create more than 10M uuids/sec');
	    }

	    _lastMSecs = msecs;
	    _lastNSecs = nsecs;
	    _clockseq = clockseq;

	    // Per 4.1.4 - Convert from unix epoch to Gregorian epoch
	    msecs += 12219292800000;

	    // `time_low`
	    var tl = ((msecs & 0xfffffff) * 10000 + nsecs) % 0x100000000;
	    b[i++] = tl >>> 24 & 0xff;
	    b[i++] = tl >>> 16 & 0xff;
	    b[i++] = tl >>> 8 & 0xff;
	    b[i++] = tl & 0xff;

	    // `time_mid`
	    var tmh = (msecs / 0x100000000 * 10000) & 0xfffffff;
	    b[i++] = tmh >>> 8 & 0xff;
	    b[i++] = tmh & 0xff;

	    // `time_high_and_version`
	    b[i++] = tmh >>> 24 & 0xf | 0x10; // include version
	    b[i++] = tmh >>> 16 & 0xff;

	    // `clock_seq_hi_and_reserved` (Per 4.2.2 - include variant)
	    b[i++] = clockseq >>> 8 | 0x80;

	    // `clock_seq_low`
	    b[i++] = clockseq & 0xff;

	    // `node`
	    var node = options.node || _nodeId;
	    for (var n = 0; n < 6; n++) {
	      b[i + n] = node[n];
	    }

	    return buf ? buf : unparse(b);
	  }

	  // **`v4()` - Generate random UUID**

	  // See https://github.com/broofa/node-uuid for API details
	  function v4(options, buf, offset) {
	    // Deprecated - 'format' argument, as supported in v1.2
	    var i = buf && offset || 0;

	    if (typeof(options) == 'string') {
	      buf = options == 'binary' ? new BufferClass(16) : null;
	      options = null;
	    }
	    options = options || {};

	    var rnds = options.random || (options.rng || _rng)();

	    // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`
	    rnds[6] = (rnds[6] & 0x0f) | 0x40;
	    rnds[8] = (rnds[8] & 0x3f) | 0x80;

	    // Copy bytes to buffer, if provided
	    if (buf) {
	      for (var ii = 0; ii < 16; ii++) {
	        buf[i + ii] = rnds[ii];
	      }
	    }

	    return buf || unparse(rnds);
	  }

	  // Export public API
	  var uuid = v4;
	  uuid.v1 = v1;
	  uuid.v4 = v4;
	  uuid.parse = parse;
	  uuid.unparse = unparse;
	  uuid.BufferClass = BufferClass;

	  if (true) {
	    // Publish as AMD module
	    (__WEBPACK_AMD_DEFINE_RESULT__ = (function() {return uuid;}(require, exports, module)), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	  } else if (typeof(module) != 'undefined' && module.exports) {
	    // Publish as node.js module
	    module.exports = uuid;
	  } else {
	    // Publish as global (in browsers)
	    var _previousRoot = _global.uuid;

	    // **`noConflict()` - (browser only) to reset global 'uuid' var**
	    uuid.noConflict = function() {
	      _global.uuid = _previousRoot;
	      return uuid;
	    };

	    _global.uuid = uuid;
	  }
	}).call(this);
	
	/* WEBPACK VAR INJECTION */}.call(exports, require, require(50).Buffer))

/***/ },

/***/ 94:
/***/ function(module, exports, require) {

	module.exports = stringify;

	function getSerialize (fn, decycle) {
	  var seen = [], keys = [];
	  decycle = decycle || function(key, value) {
	    return '[Circular ' + getPath(value, seen, keys) + ']'
	  };
	  return function(key, value) {
	    var ret = value;
	    if (typeof value === 'object' && value) {
	      if (seen.indexOf(value) !== -1)
	        ret = decycle(key, value);
	      else {
	        seen.push(value);
	        keys.push(key);
	      }
	    }
	    if (fn) ret = fn(key, ret);
	    return ret;
	  }
	}

	function getPath (value, seen, keys) {
	  var index = seen.indexOf(value);
	  var path = [ keys[index] ];
	  for (index--; index >= 0; index--) {
	    if (seen[index][ path[0] ] === value) {
	      value = seen[index];
	      path.unshift(keys[index]);
	    }
	  }
	  return '~' + path.join('.');
	}

	function stringify(obj, fn, spaces, decycle) {
	  return JSON.stringify(obj, getSerialize(fn, decycle), spaces);
	}

	stringify.getSerialize = getSerialize;


/***/ },

/***/ 95:
/***/ function(module, exports, require) {

	/* WEBPACK VAR INJECTION */(function(require, Buffer, process) {var CombinedStream = require(113);
	var util = require(17);
	var path = require(16);
	var http = require(70);
	var https = require(75);
	var parseUrl = require(18).parse;
	var fs = require(19);
	var mime = require(64);
	var async = require(114);

	module.exports = FormData;
	function FormData() {
	  this._overheadLength = 0;
	  this._valueLength = 0;
	  this._lengthRetrievers = [];

	  CombinedStream.call(this);
	}
	util.inherits(FormData, CombinedStream);

	FormData.LINE_BREAK = '\r\n';

	FormData.prototype.append = function(field, value, options) {
	  options = options || {};

	  var append = CombinedStream.prototype.append.bind(this);

	  // all that streamy business can't handle numbers
	  if (typeof value == 'number') value = ''+value;

	  // https://github.com/felixge/node-form-data/issues/38
	  if (util.isArray(value)) {
	    // Please convert your array into string
	    // the way web server expects it
	    this._error(new Error('Arrays are not supported.'));
	    return;
	  }

	  var header = this._multiPartHeader(field, value, options);
	  var footer = this._multiPartFooter(field, value, options);

	  append(header);
	  append(value);
	  append(footer);

	  // pass along options.knownLength
	  this._trackLength(header, value, options);
	};

	FormData.prototype._trackLength = function(header, value, options) {
	  var valueLength = 0;

	  // used w/ getLengthSync(), when length is known.
	  // e.g. for streaming directly from a remote server,
	  // w/ a known file a size, and not wanting to wait for
	  // incoming file to finish to get its size.
	  if (options.knownLength != null) {
	    valueLength += +options.knownLength;
	  } else if (Buffer.isBuffer(value)) {
	    valueLength = value.length;
	  } else if (typeof value === 'string') {
	    valueLength = Buffer.byteLength(value);
	  }

	  this._valueLength += valueLength;

	  // @check why add CRLF? does this account for custom/multiple CRLFs?
	  this._overheadLength +=
	    Buffer.byteLength(header) +
	    + FormData.LINE_BREAK.length;

	  // empty or either doesn't have path or not an http response
	  if (!value || ( !value.path && !(value.readable && value.hasOwnProperty('httpVersion')) )) {
	    return;
	  }

	  // no need to bother with the length
	  if (!options.knownLength)
	  this._lengthRetrievers.push(function(next) {

	    if (value.hasOwnProperty('fd')) {
	      fs.stat(value.path, function(err, stat) {
	        if (err) {
	          next(err);
	          return;
	        }

	        next(null, stat.size);
	      });

	    // or http response
	    } else if (value.hasOwnProperty('httpVersion')) {
	      next(null, +value.headers['content-length']);

	    // or request stream http://github.com/mikeal/request
	    } else if (value.hasOwnProperty('httpModule')) {
	      // wait till response come back
	      value.on('response', function(response) {
	        value.pause();
	        next(null, +response.headers['content-length']);
	      });
	      value.resume();

	    // something else
	    } else {
	      next('Unknown stream');
	    }
	  });
	};

	FormData.prototype._multiPartHeader = function(field, value, options) {
	  var boundary = this.getBoundary();
	  var header = '';

	  // custom header specified (as string)?
	  // it becomes responsible for boundary
	  // (e.g. to handle extra CRLFs on .NET servers)
	  if (options.header != null) {
	    header = options.header;
	  } else {
	    header += '--' + boundary + FormData.LINE_BREAK +
	      'Content-Disposition: form-data; name="' + field + '"';

	    // fs- and request- streams have path property
	    // or use custom filename and/or contentType
	    // TODO: Use request's response mime-type
	    if (options.filename || value.path) {
	      header +=
	        '; filename="' + path.basename(options.filename || value.path) + '"' + FormData.LINE_BREAK +
	        'Content-Type: ' +  (options.contentType || mime.lookup(options.filename || value.path));

	    // http response has not
	    } else if (value.readable && value.hasOwnProperty('httpVersion')) {
	      header +=
	        '; filename="' + path.basename(value.client._httpMessage.path) + '"' + FormData.LINE_BREAK +
	        'Content-Type: ' + value.headers['content-type'];
	    }

	    header += FormData.LINE_BREAK + FormData.LINE_BREAK;
	  }

	  return header;
	};

	FormData.prototype._multiPartFooter = function(field, value, options) {
	  return function(next) {
	    var footer = FormData.LINE_BREAK;

	    var lastPart = (this._streams.length === 0);
	    if (lastPart) {
	      footer += this._lastBoundary();
	    }

	    next(footer);
	  }.bind(this);
	};

	FormData.prototype._lastBoundary = function() {
	  return '--' + this.getBoundary() + '--';
	};

	FormData.prototype.getHeaders = function(userHeaders) {
	  var formHeaders = {
	    'content-type': 'multipart/form-data; boundary=' + this.getBoundary()
	  };

	  for (var header in userHeaders) {
	    formHeaders[header.toLowerCase()] = userHeaders[header];
	  }

	  return formHeaders;
	}

	FormData.prototype.getCustomHeaders = function(contentType) {
	    contentType = contentType ? contentType : 'multipart/form-data';

	    var formHeaders = {
	        'content-type': contentType + '; boundary=' + this.getBoundary(),
	        'content-length': this.getLengthSync()
	    };

	    return formHeaders;
	}

	FormData.prototype.getBoundary = function() {
	  if (!this._boundary) {
	    this._generateBoundary();
	  }

	  return this._boundary;
	};

	FormData.prototype._generateBoundary = function() {
	  // This generates a 50 character boundary similar to those used by Firefox.
	  // They are optimized for boyer-moore parsing.
	  var boundary = '--------------------------';
	  for (var i = 0; i < 24; i++) {
	    boundary += Math.floor(Math.random() * 10).toString(16);
	  }

	  this._boundary = boundary;
	};

	// Note: getLengthSync DOESN'T calculate streams length
	// As workaround one can calculate file size manually
	// and add it as knownLength option
	FormData.prototype.getLengthSync = function(debug) {
	  var knownLength = this._overheadLength + this._valueLength;

	  // Don't get confused, there are 3 "internal" streams for each keyval pair
	  // so it basically checks if there is any value added to the form
	  if (this._streams.length) {
	    knownLength += this._lastBoundary().length;
	  }

	  // https://github.com/felixge/node-form-data/issues/40
	  if (this._lengthRetrievers.length) {
	    // Some async length retrivers are present
	    // therefore synchronous length calculation is false.
	    // Please use getLength(callback) to get proper length
	    this._error(new Error('Cannot calculate proper length in synchronous way.'));
	  }

	  return knownLength;
	};

	FormData.prototype.getLength = function(cb) {
	  var knownLength = this._overheadLength + this._valueLength;

	  if (this._streams.length) {
	    knownLength += this._lastBoundary().length;
	  }

	  if (!this._lengthRetrievers.length) {
	    process.nextTick(cb.bind(this, null, knownLength));
	    return;
	  }

	  async.parallel(this._lengthRetrievers, function(err, values) {
	    if (err) {
	      cb(err);
	      return;
	    }

	    values.forEach(function(length) {
	      knownLength += length;
	    });

	    cb(null, knownLength);
	  });
	};

	FormData.prototype.submit = function(params, cb) {

	  var request
	    , options
	    , defaults = {
	        method : 'post',
	        headers: this.getHeaders()
	    };

	  // parse provided url if it's string
	  // or treat it as options object
	  if (typeof params == 'string') {
	    params = parseUrl(params);

	    options = populate({
	      port: params.port,
	      path: params.pathname,
	      host: params.hostname
	    }, defaults);
	  }
	  else // use custom params
	  {
	    options = populate(params, defaults);
	    // if no port provided use default one
	    if (!options.port) {
	      options.port = options.protocol == 'https:' ? 443 : 80;
	    }
	  }

	  // https if specified, fallback to http in any other case
	  if (params.protocol == 'https:') {
	    request = https.request(options);
	  } else {
	    request = http.request(options);
	  }

	  // get content length and fire away
	  this.getLength(function(err, length) {

	    // TODO: Add chunked encoding when no length (if err)

	    // add content length
	    request.setHeader('Content-Length', length);

	    this.pipe(request);
	    if (cb) {
	      request.on('error', cb);
	      request.on('response', cb.bind(this, null));
	    }
	  }.bind(this));

	  return request;
	};

	FormData.prototype._error = function(err) {
	  if (this.error) return;

	  this.error = err;
	  this.pause();
	  this.emit('error', err);
	};

	/*
	 * Santa's little helpers
	 */

	// populates missing values
	function populate(dst, src) {
	  for (var prop in src) {
	    if (!dst[prop]) dst[prop] = src[prop];
	  }
	  return dst;
	}
	
	/* WEBPACK VAR INJECTION */}.call(exports, require, require(50).Buffer, require(15)))

/***/ },

/***/ 96:
/***/ function(module, exports, require) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* -*- Mode: js; js-indent-level: 2; -*- */
	/*
	 * Copyright 2011 Mozilla Foundation and contributors
	 * Licensed under the New BSD license. See LICENSE or:
	 * http://opensource.org/licenses/BSD-3-Clause
	 *
	 * Based on the Base 64 VLQ implementation in Closure Compiler:
	 * https://code.google.com/p/closure-compiler/source/browse/trunk/src/com/google/debugging/sourcemap/Base64VLQ.java
	 *
	 * Copyright 2011 The Closure Compiler Authors. All rights reserved.
	 * Redistribution and use in source and binary forms, with or without
	 * modification, are permitted provided that the following conditions are
	 * met:
	 *
	 *  * Redistributions of source code must retain the above copyright
	 *    notice, this list of conditions and the following disclaimer.
	 *  * Redistributions in binary form must reproduce the above
	 *    copyright notice, this list of conditions and the following
	 *    disclaimer in the documentation and/or other materials provided
	 *    with the distribution.
	 *  * Neither the name of Google Inc. nor the names of its
	 *    contributors may be used to endorse or promote products derived
	 *    from this software without specific prior written permission.
	 *
	 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
	 * "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
	 * LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
	 * A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
	 * OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
	 * SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
	 * LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
	 * DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
	 * THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
	 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
	 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
	 */
	if (false) {
	    var define = require('amdefine')(module, require);
	}
	(__WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, module) {

	  var base64 = require(107);

	  // A single base 64 digit can contain 6 bits of data. For the base 64 variable
	  // length quantities we use in the source map spec, the first bit is the sign,
	  // the next four bits are the actual value, and the 6th bit is the
	  // continuation bit. The continuation bit tells us whether there are more
	  // digits in this value following this digit.
	  //
	  //   Continuation
	  //   |    Sign
	  //   |    |
	  //   V    V
	  //   101011

	  var VLQ_BASE_SHIFT = 5;

	  // binary: 100000
	  var VLQ_BASE = 1 << VLQ_BASE_SHIFT;

	  // binary: 011111
	  var VLQ_BASE_MASK = VLQ_BASE - 1;

	  // binary: 100000
	  var VLQ_CONTINUATION_BIT = VLQ_BASE;

	  /**
	   * Converts from a two-complement value to a value where the sign bit is
	   * is placed in the least significant bit.  For example, as decimals:
	   *   1 becomes 2 (10 binary), -1 becomes 3 (11 binary)
	   *   2 becomes 4 (100 binary), -2 becomes 5 (101 binary)
	   */
	  function toVLQSigned(aValue) {
	    return aValue < 0
	      ? ((-aValue) << 1) + 1
	      : (aValue << 1) + 0;
	  }

	  /**
	   * Converts to a two-complement value from a value where the sign bit is
	   * is placed in the least significant bit.  For example, as decimals:
	   *   2 (10 binary) becomes 1, 3 (11 binary) becomes -1
	   *   4 (100 binary) becomes 2, 5 (101 binary) becomes -2
	   */
	  function fromVLQSigned(aValue) {
	    var isNegative = (aValue & 1) === 1;
	    var shifted = aValue >> 1;
	    return isNegative
	      ? -shifted
	      : shifted;
	  }

	  /**
	   * Returns the base 64 VLQ encoded value.
	   */
	  exports.encode = function base64VLQ_encode(aValue) {
	    var encoded = "";
	    var digit;

	    var vlq = toVLQSigned(aValue);

	    do {
	      digit = vlq & VLQ_BASE_MASK;
	      vlq >>>= VLQ_BASE_SHIFT;
	      if (vlq > 0) {
	        // There are still more digits in this value, so we must make sure the
	        // continuation bit is marked.
	        digit |= VLQ_CONTINUATION_BIT;
	      }
	      encoded += base64.encode(digit);
	    } while (vlq > 0);

	    return encoded;
	  };

	  /**
	   * Decodes the next base 64 VLQ value from the given string and returns the
	   * value and the rest of the string.
	   */
	  exports.decode = function base64VLQ_decode(aStr) {
	    var i = 0;
	    var strLen = aStr.length;
	    var result = 0;
	    var shift = 0;
	    var continuation, digit;

	    do {
	      if (i >= strLen) {
	        throw new Error("Expected more digits in base 64 VLQ value.");
	      }
	      digit = base64.decode(aStr.charAt(i++));
	      continuation = !!(digit & VLQ_CONTINUATION_BIT);
	      digit &= VLQ_BASE_MASK;
	      result = result + (digit << shift);
	      shift += VLQ_BASE_SHIFT;
	    } while (continuation);

	    return {
	      value: fromVLQSigned(result),
	      rest: aStr.slice(i)
	    };
	  };

	}(require, exports, module)), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },

/***/ 97:
/***/ function(module, exports, require) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* -*- Mode: js; js-indent-level: 2; -*- */
	/*
	 * Copyright 2011 Mozilla Foundation and contributors
	 * Licensed under the New BSD license. See LICENSE or:
	 * http://opensource.org/licenses/BSD-3-Clause
	 */
	if (false) {
	    var define = require('amdefine')(module, require);
	}
	(__WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, module) {

	  /**
	   * This is a helper function for getting values from parameter/options
	   * objects.
	   *
	   * @param args The object we are extracting values from
	   * @param name The name of the property we are getting.
	   * @param defaultValue An optional value to return if the property is missing
	   * from the object. If this is not specified and the property is missing, an
	   * error will be thrown.
	   */
	  function getArg(aArgs, aName, aDefaultValue) {
	    if (aName in aArgs) {
	      return aArgs[aName];
	    } else if (arguments.length === 3) {
	      return aDefaultValue;
	    } else {
	      throw new Error('"' + aName + '" is a required argument.');
	    }
	  }
	  exports.getArg = getArg;

	  var urlRegexp = /([\w+\-.]+):\/\/((\w+:\w+)@)?([\w.]+)?(:(\d+))?(\S+)?/;
	  var dataUrlRegexp = /^data:.+\,.+/;

	  function urlParse(aUrl) {
	    var match = aUrl.match(urlRegexp);
	    if (!match) {
	      return null;
	    }
	    return {
	      scheme: match[1],
	      auth: match[3],
	      host: match[4],
	      port: match[6],
	      path: match[7]
	    };
	  }
	  exports.urlParse = urlParse;

	  function urlGenerate(aParsedUrl) {
	    var url = aParsedUrl.scheme + "://";
	    if (aParsedUrl.auth) {
	      url += aParsedUrl.auth + "@"
	    }
	    if (aParsedUrl.host) {
	      url += aParsedUrl.host;
	    }
	    if (aParsedUrl.port) {
	      url += ":" + aParsedUrl.port
	    }
	    if (aParsedUrl.path) {
	      url += aParsedUrl.path;
	    }
	    return url;
	  }
	  exports.urlGenerate = urlGenerate;

	  function join(aRoot, aPath) {
	    var url;

	    if (aPath.match(urlRegexp) || aPath.match(dataUrlRegexp)) {
	      return aPath;
	    }

	    if (aPath.charAt(0) === '/' && (url = urlParse(aRoot))) {
	      url.path = aPath;
	      return urlGenerate(url);
	    }

	    return aRoot.replace(/\/$/, '') + '/' + aPath;
	  }
	  exports.join = join;

	  /**
	   * Because behavior goes wacky when you set `__proto__` on objects, we
	   * have to prefix all the strings in our set with an arbitrary character.
	   *
	   * See https://github.com/mozilla/source-map/pull/31 and
	   * https://github.com/mozilla/source-map/issues/30
	   *
	   * @param String aStr
	   */
	  function toSetString(aStr) {
	    return '$' + aStr;
	  }
	  exports.toSetString = toSetString;

	  function fromSetString(aStr) {
	    return aStr.substr(1);
	  }
	  exports.fromSetString = fromSetString;

	  function relative(aRoot, aPath) {
	    aRoot = aRoot.replace(/\/$/, '');

	    var url = urlParse(aRoot);
	    if (aPath.charAt(0) == "/" && url && url.path == "/") {
	      return aPath.slice(1);
	    }

	    return aPath.indexOf(aRoot + '/') === 0
	      ? aPath.substr(aRoot.length + 1)
	      : aPath;
	  }
	  exports.relative = relative;

	  function strcmp(aStr1, aStr2) {
	    var s1 = aStr1 || "";
	    var s2 = aStr2 || "";
	    return (s1 > s2) - (s1 < s2);
	  }

	  /**
	   * Comparator between two mappings where the original positions are compared.
	   *
	   * Optionally pass in `true` as `onlyCompareGenerated` to consider two
	   * mappings with the same original source/line/column, but different generated
	   * line and column the same. Useful when searching for a mapping with a
	   * stubbed out mapping.
	   */
	  function compareByOriginalPositions(mappingA, mappingB, onlyCompareOriginal) {
	    var cmp;

	    cmp = strcmp(mappingA.source, mappingB.source);
	    if (cmp) {
	      return cmp;
	    }

	    cmp = mappingA.originalLine - mappingB.originalLine;
	    if (cmp) {
	      return cmp;
	    }

	    cmp = mappingA.originalColumn - mappingB.originalColumn;
	    if (cmp || onlyCompareOriginal) {
	      return cmp;
	    }

	    cmp = strcmp(mappingA.name, mappingB.name);
	    if (cmp) {
	      return cmp;
	    }

	    cmp = mappingA.generatedLine - mappingB.generatedLine;
	    if (cmp) {
	      return cmp;
	    }

	    return mappingA.generatedColumn - mappingB.generatedColumn;
	  };
	  exports.compareByOriginalPositions = compareByOriginalPositions;

	  /**
	   * Comparator between two mappings where the generated positions are
	   * compared.
	   *
	   * Optionally pass in `true` as `onlyCompareGenerated` to consider two
	   * mappings with the same generated line and column, but different
	   * source/name/original line and column the same. Useful when searching for a
	   * mapping with a stubbed out mapping.
	   */
	  function compareByGeneratedPositions(mappingA, mappingB, onlyCompareGenerated) {
	    var cmp;

	    cmp = mappingA.generatedLine - mappingB.generatedLine;
	    if (cmp) {
	      return cmp;
	    }

	    cmp = mappingA.generatedColumn - mappingB.generatedColumn;
	    if (cmp || onlyCompareGenerated) {
	      return cmp;
	    }

	    cmp = strcmp(mappingA.source, mappingB.source);
	    if (cmp) {
	      return cmp;
	    }

	    cmp = mappingA.originalLine - mappingB.originalLine;
	    if (cmp) {
	      return cmp;
	    }

	    cmp = mappingA.originalColumn - mappingB.originalColumn;
	    if (cmp) {
	      return cmp;
	    }

	    return strcmp(mappingA.name, mappingB.name);
	  };
	  exports.compareByGeneratedPositions = compareByGeneratedPositions;

	}(require, exports, module)), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },

/***/ 98:
/***/ function(module, exports, require) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* -*- Mode: js; js-indent-level: 2; -*- */
	/*
	 * Copyright 2011 Mozilla Foundation and contributors
	 * Licensed under the New BSD license. See LICENSE or:
	 * http://opensource.org/licenses/BSD-3-Clause
	 */
	if (false) {
	    var define = require('amdefine')(module, require);
	}
	(__WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, module) {

	  var util = require(97);

	  /**
	   * A data structure which is a combination of an array and a set. Adding a new
	   * member is O(1), testing for membership is O(1), and finding the index of an
	   * element is O(1). Removing elements from the set is not supported. Only
	   * strings are supported for membership.
	   */
	  function ArraySet() {
	    this._array = [];
	    this._set = {};
	  }

	  /**
	   * Static method for creating ArraySet instances from an existing array.
	   */
	  ArraySet.fromArray = function ArraySet_fromArray(aArray, aAllowDuplicates) {
	    var set = new ArraySet();
	    for (var i = 0, len = aArray.length; i < len; i++) {
	      set.add(aArray[i], aAllowDuplicates);
	    }
	    return set;
	  };

	  /**
	   * Add the given string to this set.
	   *
	   * @param String aStr
	   */
	  ArraySet.prototype.add = function ArraySet_add(aStr, aAllowDuplicates) {
	    var isDuplicate = this.has(aStr);
	    var idx = this._array.length;
	    if (!isDuplicate || aAllowDuplicates) {
	      this._array.push(aStr);
	    }
	    if (!isDuplicate) {
	      this._set[util.toSetString(aStr)] = idx;
	    }
	  };

	  /**
	   * Is the given string a member of this set?
	   *
	   * @param String aStr
	   */
	  ArraySet.prototype.has = function ArraySet_has(aStr) {
	    return Object.prototype.hasOwnProperty.call(this._set,
	                                                util.toSetString(aStr));
	  };

	  /**
	   * What is the index of the given string in the array?
	   *
	   * @param String aStr
	   */
	  ArraySet.prototype.indexOf = function ArraySet_indexOf(aStr) {
	    if (this.has(aStr)) {
	      return this._set[util.toSetString(aStr)];
	    }
	    throw new Error('"' + aStr + '" is not in the set.');
	  };

	  /**
	   * What is the element at the given index?
	   *
	   * @param Number aIdx
	   */
	  ArraySet.prototype.at = function ArraySet_at(aIdx) {
	    if (aIdx >= 0 && aIdx < this._array.length) {
	      return this._array[aIdx];
	    }
	    throw new Error('No element indexed by ' + aIdx);
	  };

	  /**
	   * Returns the array representation of this set (which has the proper indices
	   * indicated by indexOf). Note that this is a copy of the internal array used
	   * for storing the members so that no one can mess with internal state.
	   */
	  ArraySet.prototype.toArray = function ArraySet_toArray() {
	    return this._array.slice();
	  };

	  exports.ArraySet = ArraySet;

	}(require, exports, module)), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },

/***/ 99:
/***/ function(module, exports, require) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* -*- Mode: js; js-indent-level: 2; -*- */
	/*
	 * Copyright 2011 Mozilla Foundation and contributors
	 * Licensed under the New BSD license. See LICENSE or:
	 * http://opensource.org/licenses/BSD-3-Clause
	 */
	if (false) {
	    var define = require('amdefine')(module, require);
	}
	(__WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, module) {

	  /**
	   * Recursive implementation of binary search.
	   *
	   * @param aLow Indices here and lower do not contain the needle.
	   * @param aHigh Indices here and higher do not contain the needle.
	   * @param aNeedle The element being searched for.
	   * @param aHaystack The non-empty array being searched.
	   * @param aCompare Function which takes two elements and returns -1, 0, or 1.
	   */
	  function recursiveSearch(aLow, aHigh, aNeedle, aHaystack, aCompare) {
	    // This function terminates when one of the following is true:
	    //
	    //   1. We find the exact element we are looking for.
	    //
	    //   2. We did not find the exact element, but we can return the next
	    //      closest element that is less than that element.
	    //
	    //   3. We did not find the exact element, and there is no next-closest
	    //      element which is less than the one we are searching for, so we
	    //      return null.
	    var mid = Math.floor((aHigh - aLow) / 2) + aLow;
	    var cmp = aCompare(aNeedle, aHaystack[mid], true);
	    if (cmp === 0) {
	      // Found the element we are looking for.
	      return aHaystack[mid];
	    }
	    else if (cmp > 0) {
	      // aHaystack[mid] is greater than our needle.
	      if (aHigh - mid > 1) {
	        // The element is in the upper half.
	        return recursiveSearch(mid, aHigh, aNeedle, aHaystack, aCompare);
	      }
	      // We did not find an exact match, return the next closest one
	      // (termination case 2).
	      return aHaystack[mid];
	    }
	    else {
	      // aHaystack[mid] is less than our needle.
	      if (mid - aLow > 1) {
	        // The element is in the lower half.
	        return recursiveSearch(aLow, mid, aNeedle, aHaystack, aCompare);
	      }
	      // The exact needle element was not found in this haystack. Determine if
	      // we are in termination case (2) or (3) and return the appropriate thing.
	      return aLow < 0
	        ? null
	        : aHaystack[aLow];
	    }
	  }

	  /**
	   * This is an implementation of binary search which will always try and return
	   * the next lowest value checked if there is no exact hit. This is because
	   * mappings between original and generated line/col pairs are single points,
	   * and there is an implicit region between each of them, so a miss just means
	   * that you aren't on the very start of a region.
	   *
	   * @param aNeedle The element you are looking for.
	   * @param aHaystack The array that is being searched.
	   * @param aCompare A function which takes the needle and an element in the
	   *     array and returns -1, 0, or 1 depending on whether the needle is less
	   *     than, equal to, or greater than the element, respectively.
	   */
	  exports.search = function search(aNeedle, aHaystack, aCompare) {
	    return aHaystack.length > 0
	      ? recursiveSearch(-1, aHaystack.length, aNeedle, aHaystack, aCompare)
	      : null;
	  };

	}(require, exports, module)), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },

/***/ 100:
/***/ function(module, exports, require) {

	exports.createServer = exports.connect =
	exports.createConnection = exports.connect =
	exports.Server = exports.Socket =
	exports.isIP =
	exports.isIPv4 = exports.isIPv4 =
	function() {
		throw new Error("net is not availible in browser.");
	}

/***/ },

/***/ 101:
/***/ function(module, exports, require) {

	var Stream = require(71);

	var Response = module.exports = function (res) {
	    this.offset = 0;
	    this.readable = true;
	};

	Response.prototype = new Stream;

	var capable = {
	    streaming : true,
	    status2 : true
	};

	function parseHeaders (res) {
	    var lines = res.getAllResponseHeaders().split(/\r?\n/);
	    var headers = {};
	    for (var i = 0; i < lines.length; i++) {
	        var line = lines[i];
	        if (line === '') continue;
	        
	        var m = line.match(/^([^:]+):\s*(.*)/);
	        if (m) {
	            var key = m[1].toLowerCase(), value = m[2];
	            
	            if (headers[key] !== undefined) {
	            
	                if (isArray(headers[key])) {
	                    headers[key].push(value);
	                }
	                else {
	                    headers[key] = [ headers[key], value ];
	                }
	            }
	            else {
	                headers[key] = value;
	            }
	        }
	        else {
	            headers[line] = true;
	        }
	    }
	    return headers;
	}

	Response.prototype.getResponse = function (xhr) {
	    var respType = String(xhr.responseType).toLowerCase();
	    if (respType === 'blob') return xhr.responseBlob;
	    if (respType === 'arraybuffer') return xhr.response;
	    return xhr.responseText;
	}

	Response.prototype.getHeader = function (key) {
	    return this.headers[key.toLowerCase()];
	};

	Response.prototype.handle = function (res) {
	    if (res.readyState === 2 && capable.status2) {
	        try {
	            this.statusCode = res.status;
	            this.headers = parseHeaders(res);
	        }
	        catch (err) {
	            capable.status2 = false;
	        }
	        
	        if (capable.status2) {
	            this.emit('ready');
	        }
	    }
	    else if (capable.streaming && res.readyState === 3) {
	        try {
	            if (!this.statusCode) {
	                this.statusCode = res.status;
	                this.headers = parseHeaders(res);
	                this.emit('ready');
	            }
	        }
	        catch (err) {}
	        
	        try {
	            this._emitData(res);
	        }
	        catch (err) {
	            capable.streaming = false;
	        }
	    }
	    else if (res.readyState === 4) {
	        if (!this.statusCode) {
	            this.statusCode = res.status;
	            this.emit('ready');
	        }
	        this._emitData(res);
	        
	        if (res.error) {
	            this.emit('error', this.getResponse(res));
	        }
	        else this.emit('end');
	        
	        this.emit('close');
	    }
	};

	Response.prototype._emitData = function (res) {
	    var respBody = this.getResponse(res);
	    if (respBody.toString().match(/ArrayBuffer/)) {
	        this.emit('data', new Uint8Array(respBody, this.offset));
	        this.offset = respBody.byteLength;
	        return;
	    }
	    if (respBody.length > this.offset) {
	        this.emit('data', respBody.slice(this.offset));
	        this.offset = respBody.length;
	    }
	};

	var isArray = Array.isArray || function (xs) {
	    return Object.prototype.toString.call(xs) === '[object Array]';
	};


/***/ },

/***/ 102:
/***/ function(module, exports, require) {

	// Export sub-modules

	exports.error = exports.Error = require(115);
	exports.sntp = require(116);
	exports.server = require(109);
	exports.client = require(110);
	exports.crypto = require(111);
	exports.utils = require(112);

	exports.uri = {
	    authenticate: exports.server.authenticateBewit,
	    getBewit: exports.client.getBewit
	};




/***/ },

/***/ 103:
/***/ function(module, exports, require) {

	// Copyright 2012 Joyent, Inc.  All rights reserved.

	var assert = require(119);
	var util = require(17);



	///--- Globals

	var Algorithms = {
	  'rsa-sha1': true,
	  'rsa-sha256': true,
	  'rsa-sha512': true,
	  'dsa-sha1': true,
	  'hmac-sha1': true,
	  'hmac-sha256': true,
	  'hmac-sha512': true
	};

	var State = {
	  New: 0,
	  Params: 1
	};

	var ParamsState = {
	  Name: 0,
	  Quote: 1,
	  Value: 2,
	  Comma: 3
	};



	///--- Specific Errors

	function HttpSignatureError(message, caller) {
	  if (Error.captureStackTrace)
	    Error.captureStackTrace(this, caller || HttpSignatureError);

	  this.message = message;
	  this.name = caller.name;
	}
	util.inherits(HttpSignatureError, Error);

	function ExpiredRequestError(message) {
	  HttpSignatureError.call(this, message, ExpiredRequestError);
	}
	util.inherits(ExpiredRequestError, HttpSignatureError);


	function InvalidHeaderError(message) {
	  HttpSignatureError.call(this, message, InvalidHeaderError);
	}
	util.inherits(InvalidHeaderError, HttpSignatureError);


	function InvalidParamsError(message) {
	  HttpSignatureError.call(this, message, InvalidParamsError);
	}
	util.inherits(InvalidParamsError, HttpSignatureError);


	function MissingHeaderError(message) {
	  HttpSignatureError.call(this, message, MissingHeaderError);
	}
	util.inherits(MissingHeaderError, HttpSignatureError);



	///--- Exported API

	module.exports = {

	  /**
	   * Parses the 'Authorization' header out of an http.ServerRequest object.
	   *
	   * Note that this API will fully validate the Authorization header, and throw
	   * on any error.  It will not however check the signature, or the keyId format
	   * as those are specific to your environment.  You can use the options object
	   * to pass in extra constraints.
	   *
	   * As a response object you can expect this:
	   *
	   *     {
	   *       "scheme": "Signature",
	   *       "params": {
	   *         "keyId": "foo",
	   *         "algorithm": "rsa-sha256",
	   *         "headers": [
	   *           "date" or "x-date",
	   *           "content-md5"
	   *         ],
	   *         "signature": "base64"
	   *       },
	   *       "signingString": "ready to be passed to crypto.verify()"
	   *     }
	   *
	   * @param {Object} request an http.ServerRequest.
	   * @param {Object} options an optional options object with:
	   *                   - clockSkew: allowed clock skew in seconds (default 300).
	   *                   - headers: required header names (def: date or x-date)
	   *                   - algorithms: algorithms to support (default: all).
	   * @return {Object} parsed out object (see above).
	   * @throws {TypeError} on invalid input.
	   * @throws {InvalidHeaderError} on an invalid Authorization header error.
	   * @throws {InvalidParamsError} if the params in the scheme are invalid.
	   * @throws {MissingHeaderError} if the params indicate a header not present,
	   *                              either in the request headers from the params,
	   *                              or not in the params from a required header
	   *                              in options.
	   * @throws {ExpiredRequestError} if the value of date or x-date exceeds skew.
	   */
	  parseRequest: function parseRequest(request, options) {
	    assert.object(request, 'request');
	    assert.object(request.headers, 'request.headers');
	    if (options === undefined) {
	      options = {};
	    }
	    if (options.headers === undefined) {
	      options.headers = [request.headers['x-date'] ? 'x-date' : 'date'];
	    }
	    assert.object(options, 'options');
	    assert.arrayOfString(options.headers, 'options.headers');
	    assert.optionalNumber(options.clockSkew, 'options.clockSkew');

	    if (!request.headers.authorization)
	      throw new MissingHeaderError('no authorization header present in ' +
	                                   'the request');

	    options.clockSkew = options.clockSkew || 300;


	    var i = 0;
	    var state = State.New;
	    var substate = ParamsState.Name;
	    var tmpName = '';
	    var tmpValue = '';

	    var parsed = {
	      scheme: '',
	      params: {},
	      signingString: '',

	      get algorithm() {
	        return this.params.algorithm.toUpperCase();
	      },

	      get keyId() {
	        return this.params.keyId;
	      }

	    };

	    var authz = request.headers.authorization;
	    for (i = 0; i < authz.length; i++) {
	      var c = authz.charAt(i);

	      switch (Number(state)) {

	      case State.New:
	        if (c !== ' ') parsed.scheme += c;
	        else state = State.Params;
	        break;

	      case State.Params:
	        switch (Number(substate)) {

	        case ParamsState.Name:
	          var code = c.charCodeAt(0);
	          // restricted name of A-Z / a-z
	          if ((code >= 0x41 && code <= 0x5a) || // A-Z
	              (code >= 0x61 && code <= 0x7a)) { // a-z
	            tmpName += c;
	          } else if (c === '=') {
	            if (tmpName.length === 0)
	              throw new InvalidHeaderError('bad param format');
	            substate = ParamsState.Quote;
	          } else {
	            throw new InvalidHeaderError('bad param format');
	          }
	          break;

	        case ParamsState.Quote:
	          if (c === '"') {
	            tmpValue = '';
	            substate = ParamsState.Value;
	          } else {
	            throw new InvalidHeaderError('bad param format');
	          }
	          break;

	        case ParamsState.Value:
	          if (c === '"') {
	            parsed.params[tmpName] = tmpValue;
	            substate = ParamsState.Comma;
	          } else {
	            tmpValue += c;
	          }
	          break;

	        case ParamsState.Comma:
	          if (c === ',') {
	            tmpName = '';
	            substate = ParamsState.Name;
	          } else {
	            throw new InvalidHeaderError('bad param format');
	          }
	          break;

	        default:
	          throw new Error('Invalid substate');
	        }
	        break;

	      default:
	        throw new Error('Invalid substate');
	      }

	    }

	    if (!parsed.params.headers || parsed.params.headers === '') {
	      if (request.headers['x-date']) {
	        parsed.params.headers = ['x-date'];
	      } else {
	        parsed.params.headers = ['date'];
	      }
	    } else {
	      parsed.params.headers = parsed.params.headers.split(' ');
	    }

	    // Minimally validate the parsed object
	    if (!parsed.scheme || parsed.scheme !== 'Signature')
	      throw new InvalidHeaderError('scheme was not "Signature"');

	    if (!parsed.params.keyId)
	      throw new InvalidHeaderError('keyId was not specified');

	    if (!parsed.params.algorithm)
	      throw new InvalidHeaderError('algorithm was not specified');

	    if (!parsed.params.signature)
	      throw new InvalidHeaderError('signature was not specified');

	    // Check the algorithm against the official list
	    parsed.params.algorithm = parsed.params.algorithm.toLowerCase();
	    if (!Algorithms[parsed.params.algorithm])
	      throw new InvalidParamsError(parsed.params.algorithm +
	                                   ' is not supported');

	    // Build the signingString
	    for (i = 0; i < parsed.params.headers.length; i++) {
	      var h = parsed.params.headers[i].toLowerCase();
	      parsed.params.headers[i] = h;

	      if (h !== 'request-line') {
	        var value = request.headers[h];
	        if (!value)
	          throw new MissingHeaderError(h + ' was not in the request');
	        parsed.signingString += h + ': ' + value;
	      } else {
	        parsed.signingString +=
	          request.method + ' ' + request.url + ' HTTP/' + request.httpVersion;
	      }

	      if ((i + 1) < parsed.params.headers.length)
	        parsed.signingString += '\n';
	    }

	    // Check against the constraints
	    var date;
	    if (request.headers.date || request.headers['x-date']) {
	        if (request.headers['x-date']) {
	          date = new Date(request.headers['x-date']);
	        } else {
	          date = new Date(request.headers.date);
	        }
	      var now = new Date();
	      var skew = Math.abs(now.getTime() - date.getTime());

	      if (skew > options.clockSkew * 1000) {
	        throw new ExpiredRequestError('clock skew of ' +
	                                      (skew / 1000) +
	                                      's was greater than ' +
	                                      options.clockSkew + 's');
	      }
	    }

	    options.headers.forEach(function (hdr) {
	      // Remember that we already checked any headers in the params
	      // were in the request, so if this passes we're good.
	      if (parsed.params.headers.indexOf(hdr) < 0)
	        throw new MissingHeaderError(hdr + ' was not a signed header');
	    });

	    if (options.algorithms) {
	      if (options.algorithms.indexOf(parsed.params.algorithm) === -1)
	        throw new InvalidParamsError(parsed.params.algorithm +
	                                     ' is not a supported algorithm');
	    }

	    return parsed;
	  }

	};


/***/ },

/***/ 104:
/***/ function(module, exports, require) {

	// Copyright 2012 Joyent, Inc.  All rights reserved.

	var assert = require(119);
	var crypto = require(72);
	var http = require(70);

	var sprintf = require(17).format;



	///--- Globals

	var Algorithms = {
	  'rsa-sha1': true,
	  'rsa-sha256': true,
	  'rsa-sha512': true,
	  'dsa-sha1': true,
	  'hmac-sha1': true,
	  'hmac-sha256': true,
	  'hmac-sha512': true
	};

	var Authorization =
	  'Signature keyId="%s",algorithm="%s",headers="%s",signature="%s"';



	///--- Specific Errors

	function MissingHeaderError(message) {
	    this.name = 'MissingHeaderError';
	    this.message = message;
	    this.stack = (new Error()).stack;
	}
	MissingHeaderError.prototype = new Error();


	function InvalidAlgorithmError(message) {
	    this.name = 'InvalidAlgorithmError';
	    this.message = message;
	    this.stack = (new Error()).stack;
	}
	InvalidAlgorithmError.prototype = new Error();



	///--- Internal Functions

	function _pad(val) {
	  if (parseInt(val, 10) < 10) {
	    val = '0' + val;
	  }
	  return val;
	}


	function _rfc1123() {
	  var date = new Date();

	  var months = ['Jan',
	                'Feb',
	                'Mar',
	                'Apr',
	                'May',
	                'Jun',
	                'Jul',
	                'Aug',
	                'Sep',
	                'Oct',
	                'Nov',
	                'Dec'];
	  var days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
	  return days[date.getUTCDay()] + ', ' +
	    _pad(date.getUTCDate()) + ' ' +
	    months[date.getUTCMonth()] + ' ' +
	    date.getUTCFullYear() + ' ' +
	    _pad(date.getUTCHours()) + ':' +
	    _pad(date.getUTCMinutes()) + ':' +
	    _pad(date.getUTCSeconds()) +
	    ' GMT';
	}



	///--- Exported API

	module.exports = {

	  /**
	   * Adds an 'Authorization' header to an http.ClientRequest object.
	   *
	   * Note that this API will add a Date header if it's not already set. Any
	   * other headers in the options.headers array MUST be present, or this
	   * will throw.
	   *
	   * You shouldn't need to check the return type; it's just there if you want
	   * to be pedantic.
	   *
	   * @param {Object} request an instance of http.ClientRequest.
	   * @param {Object} options signing parameters object:
	   *                   - {String} keyId required.
	   *                   - {String} key required (either a PEM or HMAC key).
	   *                   - {Array} headers optional; defaults to ['date'].
	   *                   - {String} algorithm optional; defaults to 'rsa-sha256'.
	   *                   - {String} httpVersion optional; defaults to '1.1'.
	   * @return {Boolean} true if Authorization (and optionally Date) were added.
	   * @throws {TypeError} on bad parameter types (input).
	   * @throws {InvalidAlgorithmError} if algorithm was bad.
	   * @throws {MissingHeaderError} if a header to be signed was specified but
	   *                              was not present.
	   */
	  signRequest: function signRequest(request, options) {
	    assert.object(request, 'request');
	    assert.object(options, 'options');
	    assert.optionalString(options.algorithm, 'options.algorithm');
	    assert.string(options.keyId, 'options.keyId');
	    assert.optionalArrayOfString(options.headers, 'options.headers');
	    assert.optionalString(options.httpVersion, 'options.httpVersion');

	    if (!request.getHeader('Date'))
	      request.setHeader('Date', _rfc1123());
	    if (!options.headers)
	      options.headers = ['date'];
	    if (!options.algorithm)
	      options.algorithm = 'rsa-sha256';
	    if (!options.httpVersion)
	      options.httpVersion = '1.1';

	    options.algorithm = options.algorithm.toLowerCase();

	    if (!Algorithms[options.algorithm])
	      throw new InvalidAlgorithmError(options.algorithm + ' is not supported');

	    var i;
	    var stringToSign = '';
	    for (i = 0; i < options.headers.length; i++) {
	      if (typeof (options.headers[i]) !== 'string')
	        throw new TypeError('options.headers must be an array of Strings');

	      var h = options.headers[i].toLowerCase();

	      if (h !== 'request-line') {
	        var value = request.getHeader(h);
	        if (!value) {
	          throw new MissingHeaderError(h + ' was not in the request');
	        }
	        stringToSign += h + ': ' + value;
	      } else {
	        value =
	        stringToSign +=
	          request.method + ' ' + request.path + ' HTTP/' + options.httpVersion;
	      }

	      if ((i + 1) < options.headers.length)
	        stringToSign += '\n';
	    }

	    var alg = options.algorithm.match(/(hmac|rsa)-(\w+)/);
	    var signature;
	    if (alg[1] === 'hmac') {
	      var hmac = crypto.createHmac(alg[2].toUpperCase(), options.key);
	      hmac.update(stringToSign);
	      signature = hmac.digest('base64');
	    } else {
	      var signer = crypto.createSign(options.algorithm.toUpperCase());
	      signer.update(stringToSign);
	      signature = signer.sign(options.key, 'base64');
	    }

	    request.setHeader('Authorization', sprintf(Authorization,
	                                               options.keyId,
	                                               options.algorithm,
	                                               options.headers.join(' '),
	                                               signature));

	    return true;
	  }

	};


/***/ },

/***/ 105:
/***/ function(module, exports, require) {

	// Copyright 2011 Joyent, Inc.  All rights reserved.

	var assert = require(119);
	var crypto = require(72);



	///--- Exported API

	module.exports = {

	  /**
	   * Simply wraps up the node crypto operations for you, and returns
	   * true or false.  You are expected to pass in an object that was
	   * returned from `parse()`.
	   *
	   * @param {Object} parsedSignature the object you got from `parse`.
	   * @param {String} key either an RSA private key PEM or HMAC secret.
	   * @return {Boolean} true if valid, false otherwise.
	   * @throws {TypeError} if you pass in bad arguments.
	   */
	  verifySignature: function verifySignature(parsedSignature, key) {
	    assert.object(parsedSignature, 'parsedSignature');
	    assert.string(key, 'key');

	    var alg = parsedSignature.algorithm.match(/(HMAC|RSA|DSA)-(\w+)/);
	    if (!alg || alg.length !== 3)
	      throw new TypeError('parsedSignature: unsupported algorithm ' +
	                          parsedSignature.algorithm);

	    if (alg[1] === 'HMAC') {
	      var hmac = crypto.createHmac(alg[2].toUpperCase(), key);
	      hmac.update(parsedSignature.signingString);
	      return (hmac.digest('base64') === parsedSignature.params.signature);
	    } else {
	      var verify = crypto.createVerify(alg[0]);
	      verify.update(parsedSignature.signingString);
	      return verify.verify(key, parsedSignature.params.signature, 'base64');
	    }
	  }

	};


/***/ },

/***/ 106:
/***/ function(module, exports, require) {

	/* WEBPACK VAR INJECTION */(function(require, Buffer) {// Copyright 2012 Joyent, Inc.  All rights reserved.

	var assert = require(119);
	var crypto = require(72);

	var asn1 = require(118);
	var ctype = require(117);



	///--- Helpers

	function readNext(buffer, offset) {
	  var len = ctype.ruint32(buffer, 'big', offset);
	  offset += 4;

	  var newOffset = offset + len;

	  return {
	    data: buffer.slice(offset, newOffset),
	    offset: newOffset
	  };
	}


	function writeInt(writer, buffer) {
	  writer.writeByte(0x02); // ASN1.Integer
	  writer.writeLength(buffer.length);

	  for (var i = 0; i < buffer.length; i++)
	    writer.writeByte(buffer[i]);

	  return writer;
	}


	function rsaToPEM(key) {
	  var buffer;
	  var der;
	  var exponent;
	  var i;
	  var modulus;
	  var newKey = '';
	  var offset = 0;
	  var type;
	  var tmp;

	  try {
	    buffer = new Buffer(key.split(' ')[1], 'base64');

	    tmp = readNext(buffer, offset);
	    type = tmp.data.toString();
	    offset = tmp.offset;

	    if (type !== 'ssh-rsa')
	      throw new Error('Invalid ssh key type: ' + type);

	    tmp = readNext(buffer, offset);
	    exponent = tmp.data;
	    offset = tmp.offset;

	    tmp = readNext(buffer, offset);
	    modulus = tmp.data;
	  } catch (e) {
	    throw new Error('Invalid ssh key: ' + key);
	  }

	  // DER is a subset of BER
	  der = new asn1.BerWriter();

	  der.startSequence();

	  der.startSequence();
	  der.writeOID('1.2.840.113549.1.1.1');
	  der.writeNull();
	  der.endSequence();

	  der.startSequence(0x03); // bit string
	  der.writeByte(0x00);

	  // Actual key
	  der.startSequence();
	  writeInt(der, modulus);
	  writeInt(der, exponent);
	  der.endSequence();

	  // bit string
	  der.endSequence();

	  der.endSequence();

	  tmp = der.buffer.toString('base64');
	  for (i = 0; i < tmp.length; i++) {
	    if ((i % 64) === 0)
	      newKey += '\n';
	    newKey += tmp.charAt(i);
	  }

	  if (!/\\n$/.test(newKey))
	    newKey += '\n';

	  return '-----BEGIN PUBLIC KEY-----' + newKey + '-----END PUBLIC KEY-----\n';
	}


	function dsaToPEM(key) {
	  var buffer;
	  var offset = 0;
	  var tmp;
	  var der;
	  var newKey = '';

	  var type;
	  var p;
	  var q;
	  var g;
	  var y;

	  try {
	    buffer = new Buffer(key.split(' ')[1], 'base64');

	    tmp = readNext(buffer, offset);
	    type = tmp.data.toString();
	    offset = tmp.offset;

	    /* JSSTYLED */
	    if (!/^ssh-ds[as].*/.test(type))
	      throw new Error('Invalid ssh key type: ' + type);

	    tmp = readNext(buffer, offset);
	    p = tmp.data;
	    offset = tmp.offset;

	    tmp = readNext(buffer, offset);
	    q = tmp.data;
	    offset = tmp.offset;

	    tmp = readNext(buffer, offset);
	    g = tmp.data;
	    offset = tmp.offset;

	    tmp = readNext(buffer, offset);
	    y = tmp.data;
	  } catch (e) {
	    console.log(e.stack);
	    throw new Error('Invalid ssh key: ' + key);
	  }

	  // DER is a subset of BER
	  der = new asn1.BerWriter();

	  der.startSequence();

	  der.startSequence();
	  der.writeOID('1.2.840.10040.4.1');

	  der.startSequence();
	  writeInt(der, p);
	  writeInt(der, q);
	  writeInt(der, g);
	  der.endSequence();

	  der.endSequence();

	  der.startSequence(0x03); // bit string
	  der.writeByte(0x00);
	  writeInt(der, y);
	  der.endSequence();

	  der.endSequence();

	  tmp = der.buffer.toString('base64');
	  for (var i = 0; i < tmp.length; i++) {
	    if ((i % 64) === 0)
	      newKey += '\n';
	    newKey += tmp.charAt(i);
	  }

	  if (!/\\n$/.test(newKey))
	    newKey += '\n';

	  return '-----BEGIN PUBLIC KEY-----' + newKey + '-----END PUBLIC KEY-----\n';
	}


	///--- API

	module.exports = {

	  /**
	   * Converts an OpenSSH public key (rsa only) to a PKCS#8 PEM file.
	   *
	   * The intent of this module is to interoperate with OpenSSL only,
	   * specifically the node crypto module's `verify` method.
	   *
	   * @param {String} key an OpenSSH public key.
	   * @return {String} PEM encoded form of the RSA public key.
	   * @throws {TypeError} on bad input.
	   * @throws {Error} on invalid ssh key formatted data.
	   */
	  sshKeyToPEM: function sshKeyToPEM(key) {
	    assert.string(key, 'ssh_key');

	    /* JSSTYLED */
	    if (/^ssh-rsa.*/.test(key))
	      return rsaToPEM(key);

	    /* JSSTYLED */
	    if (/^ssh-ds[as].*/.test(key))
	      return dsaToPEM(key);

	    throw new Error('Only RSA and DSA public keys are allowed');
	  },


	  /**
	   * Generates an OpenSSH fingerprint from an ssh public key.
	   *
	   * @param {String} key an OpenSSH public key.
	   * @return {String} key fingerprint.
	   * @throws {TypeError} on bad input.
	   * @throws {Error} if what you passed doesn't look like an ssh public key.
	   */
	  fingerprint: function fingerprint(key) {
	    assert.string(key, 'ssh_key');

	    var pieces = key.split(' ');
	    if (!pieces || !pieces.length || pieces.length < 2)
	      throw new Error('invalid ssh key');

	    var data = new Buffer(pieces[1], 'base64');

	    var hash = crypto.createHash('md5');
	    hash.update(data);
	    var digest = hash.digest('hex');

	    var fp = '';
	    for (var i = 0; i < digest.length; i++) {
	      if (i && i % 2 === 0)
	        fp += ':';

	      fp += digest[i];
	    }

	    return fp;
	  }


	};
	
	/* WEBPACK VAR INJECTION */}.call(exports, require, require(50).Buffer))

/***/ },

/***/ 107:
/***/ function(module, exports, require) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* -*- Mode: js; js-indent-level: 2; -*- */
	/*
	 * Copyright 2011 Mozilla Foundation and contributors
	 * Licensed under the New BSD license. See LICENSE or:
	 * http://opensource.org/licenses/BSD-3-Clause
	 */
	if (false) {
	    var define = require('amdefine')(module, require);
	}
	(__WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, module) {

	  var charToIntMap = {};
	  var intToCharMap = {};

	  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
	    .split('')
	    .forEach(function (ch, index) {
	      charToIntMap[ch] = index;
	      intToCharMap[index] = ch;
	    });

	  /**
	   * Encode an integer in the range of 0 to 63 to a single base 64 digit.
	   */
	  exports.encode = function base64_encode(aNumber) {
	    if (aNumber in intToCharMap) {
	      return intToCharMap[aNumber];
	    }
	    throw new TypeError("Must be between 0 and 63: " + aNumber);
	  };

	  /**
	   * Decode a single base 64 digit to an integer.
	   */
	  exports.decode = function base64_decode(aChar) {
	    if (aChar in charToIntMap) {
	      return charToIntMap[aChar];
	    }
	    throw new TypeError("Not a valid base 64 digit: " + aChar);
	  };

	}(require, exports, module)), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },

/***/ 108:
/***/ function(module, exports, require) {

	/* WEBPACK VAR INJECTION */(function(require, Buffer) {var stream = require(71)
	var util = require(17)

	function ConcatStream(cb) {
	  stream.Stream.call(this)
	  this.writable = true
	  if (cb) this.cb = cb
	  this.body = []
	  if (this.cb) this.on('error', cb)
	}

	util.inherits(ConcatStream, stream.Stream)

	ConcatStream.prototype.write = function(chunk) {
	  this.body.push(chunk)
	}

	ConcatStream.prototype.arrayConcat = function(arrs) {
	  if (arrs.length === 0) return []
	  if (arrs.length === 1) return arrs[0]
	  return arrs.reduce(function (a, b) { return a.concat(b) })
	}

	ConcatStream.prototype.isArray = function(arr) {
	  var isArray = Array.isArray(arr)
	  var isTypedArray = arr.toString().match(/Array/)
	  return isArray || isTypedArray
	}

	ConcatStream.prototype.getBody = function () {
	  if (this.body.length === 0) return
	  if (typeof(this.body[0]) === "string") return this.body.join('')
	  if (this.isArray(this.body[0])) return this.arrayConcat(this.body)
	  if (typeof(Buffer) !== "undefined" && Buffer.isBuffer(this.body[0])) {
	    return Buffer.concat(this.body)
	  }
	  return this.body
	}

	ConcatStream.prototype.end = function() {
	  if (this.cb) this.cb(false, this.getBody())
	}

	module.exports = function(cb) {
	  return new ConcatStream(cb)
	}

	module.exports.ConcatStream = ConcatStream
	
	/* WEBPACK VAR INJECTION */}.call(exports, require, require(50).Buffer))

/***/ },

/***/ 109:
/***/ function(module, exports, require) {

	// Load modules

	var Boom = require(115);
	var Hoek = require(120);
	var Cryptiles = require(121);
	var Crypto = require(111);
	var Utils = require(112);


	// Declare internals

	var internals = {};


	// Hawk authentication

	/*
	   req:                 node's HTTP request object or an object as follows:
	  
	                        var request = {
	                            method: 'GET',
	                            url: '/resource/4?a=1&b=2',
	                            host: 'example.com',
	                            port: 8080,
	                            authorization: 'Hawk id="dh37fgj492je", ts="1353832234", nonce="j4h3g2", ext="some-app-ext-data", mac="6R4rV5iE+NPoym+WwjeHzjAGXUtLNIxmo1vpMofpLAE="'
	                        };
	  
	   credentialsFunc:     required function to lookup the set of Hawk credentials based on the provided credentials id.
	                        The credentials include the MAC key, MAC algorithm, and other attributes (such as username)
	                        needed by the application. This function is the equivalent of verifying the username and
	                        password in Basic authentication.
	  
	                        var credentialsFunc = function (id, callback) {
	    
	                            // Lookup credentials in database
	                            db.lookup(id, function (err, item) {
	    
	                                if (err || !item) {
	                                    return callback(err);
	                                }
	    
	                                var credentials = {
	                                    // Required
	                                    key: item.key,
	                                    algorithm: item.algorithm,
	                                    // Application specific
	                                    user: item.user
	                                };
	    
	                                return callback(null, credentials);
	                            });
	                        };
	  
	   options: {

	        hostHeaderName:        optional header field name, used to override the default 'Host' header when used
	                               behind a cache of a proxy. Apache2 changes the value of the 'Host' header while preserving
	                               the original (which is what the module must verify) in the 'x-forwarded-host' header field.
	                               Only used when passed a node Http.ServerRequest object.
	  
	        nonceFunc:             optional nonce validation function. The function signature is function(nonce, ts, callback)
	                               where 'callback' must be called using the signature function(err).
	  
	        timestampSkewSec:      optional number of seconds of permitted clock skew for incoming timestamps. Defaults to 60 seconds.
	                               Provides a +/- skew which means actual allowed window is double the number of seconds.
	  
	        localtimeOffsetMsec:   optional local clock time offset express in a number of milliseconds (positive or negative).
	                               Defaults to 0.
	  
	        payload:               optional payload for validation. The client calculates the hash value and includes it via the 'hash'
	                               header attribute. The server always ensures the value provided has been included in the request
	                               MAC. When this option is provided, it validates the hash value itself. Validation is done by calculating
	                               a hash value over the entire payload (assuming it has already be normalized to the same format and
	                               encoding used by the client to calculate the hash on request). If the payload is not available at the time
	                               of authentication, the authenticatePayload() method can be used by passing it the credentials and
	                               attributes.hash returned in the authenticate callback.

	        host:                  optional host name override. Only used when passed a node request object.
	        port:                  optional port override. Only used when passed a node request object.
	    }

	    callback: function (err, credentials, artifacts) { }
	 */

	exports.authenticate = function (req, credentialsFunc, options, callback) {

	    callback = Utils.nextTick(callback);
	    
	    // Default options

	    options.nonceFunc = options.nonceFunc || function (nonce, ts, nonceCallback) { return nonceCallback(); };   // No validation
	    options.timestampSkewSec = options.timestampSkewSec || 60;                                                  // 60 seconds

	    // Application time

	    var now = Utils.now() + (options.localtimeOffsetMsec || 0);                 // Measure now before any other processing

	    // Convert node Http request object to a request configuration object

	    var request = Utils.parseRequest(req, options);
	    if (request instanceof Error) {
	        return callback(Boom.badRequest(request.message));
	    }

	    // Parse HTTP Authorization header

	    var attributes = Utils.parseAuthorizationHeader(request.authorization);
	    if (attributes instanceof Error) {
	        return callback(attributes);
	    }

	    // Construct artifacts container

	    var artifacts = {
	        method: request.method,
	        host: request.host,
	        port: request.port,
	        resource: request.url,
	        ts: attributes.ts,
	        nonce: attributes.nonce,
	        hash: attributes.hash,
	        ext: attributes.ext,
	        app: attributes.app,
	        dlg: attributes.dlg,
	        mac: attributes.mac,
	        id: attributes.id
	    };

	    // Verify required header attributes

	    if (!attributes.id ||
	        !attributes.ts ||
	        !attributes.nonce ||
	        !attributes.mac) {

	        return callback(Boom.badRequest('Missing attributes'), null, artifacts);
	    }

	    // Fetch Hawk credentials

	    credentialsFunc(attributes.id, function (err, credentials) {

	        if (err) {
	            return callback(err, credentials || null, artifacts);
	        }

	        if (!credentials) {
	            return callback(Boom.unauthorized('Unknown credentials', 'Hawk'), null, artifacts);
	        }

	        if (!credentials.key ||
	            !credentials.algorithm) {

	            return callback(Boom.internal('Invalid credentials'), credentials, artifacts);
	        }

	        if (Crypto.algorithms.indexOf(credentials.algorithm) === -1) {
	            return callback(Boom.internal('Unknown algorithm'), credentials, artifacts);
	        }

	        // Calculate MAC

	        var mac = Crypto.calculateMac('header', credentials, artifacts);
	        if (!Cryptiles.fixedTimeComparison(mac, attributes.mac)) {
	            return callback(Boom.unauthorized('Bad mac', 'Hawk'), credentials, artifacts);
	        }

	        // Check payload hash

	        if (options.payload !== null &&
	            options.payload !== undefined) {       // '' is valid

	            if (!attributes.hash) {
	                return callback(Boom.unauthorized('Missing required payload hash', 'Hawk'), credentials, artifacts);
	            }

	            var hash = Crypto.calculatePayloadHash(options.payload, credentials.algorithm, request.contentType);
	            if (!Cryptiles.fixedTimeComparison(hash, attributes.hash)) {
	                return callback(Boom.unauthorized('Bad payload hash', 'Hawk'), credentials, artifacts);
	            }
	        }

	        // Check nonce

	        options.nonceFunc(attributes.nonce, attributes.ts, function (err) {

	            if (err) {
	                return callback(Boom.unauthorized('Invalid nonce', 'Hawk'), credentials, artifacts);
	            }

	            // Check timestamp staleness

	            if (Math.abs((attributes.ts * 1000) - now) > (options.timestampSkewSec * 1000)) {
	                var fresh = Math.floor((Utils.now() + (options.localtimeOffsetMsec || 0)) / 1000);            // Get fresh now
	                var tsm = Crypto.calculateTsMac(fresh, credentials);
	                return callback(Boom.unauthorized('Stale timestamp', 'Hawk', { ts: fresh, tsm: tsm }), credentials, artifacts);
	            }

	            // Successful authentication

	            return callback(null, credentials, artifacts);
	        });
	    });
	};


	// Authenticate payload hash - used when payload cannot be provided during authenticate()

	/*
	    payload:        raw request payload
	    credentials:    from authenticate callback
	    artifacts:      from authenticate callback
	    contentType:    req.headers['content-type']
	*/

	exports.authenticatePayload = function (payload, credentials, artifacts, contentType) {

	    var calculatedHash = Crypto.calculatePayloadHash(payload, credentials.algorithm, contentType);
	    return Cryptiles.fixedTimeComparison(calculatedHash, artifacts.hash);
	};


	// Generate a Server-Authorization header for a given response

	/*
	    credentials: {},                                        // Object received from authenticate()
	    artifacts: {}                                           // Object received from authenticate(); 'mac', 'hash', and 'ext' - ignored
	    options: {
	        ext: 'application-specific',                        // Application specific data sent via the ext attribute
	        payload: '{"some":"payload"}',                      // UTF-8 encoded string for body hash generation (ignored if hash provided)
	        contentType: 'application/json',                    // Payload content-type (ignored if hash provided)
	        hash: 'U4MKKSmiVxk37JCCrAVIjV='                     // Pre-calculated payload hash
	    }
	*/

	exports.header = function (credentials, artifacts, options) {

	    // Prepare inputs

	    options = options || {};

	    if (!artifacts ||
	        typeof artifacts !== 'object' ||
	        typeof options !== 'object') {

	        return '';
	    }

	    artifacts = Hoek.clone(artifacts);
	    delete artifacts.mac;
	    artifacts.hash = options.hash;
	    artifacts.ext = options.ext;

	    // Validate credentials

	    if (!credentials ||
	        !credentials.key ||
	        !credentials.algorithm) {

	        // Invalid credential object
	        return '';
	    }

	    if (Crypto.algorithms.indexOf(credentials.algorithm) === -1) {
	        return '';
	    }

	    // Calculate payload hash

	    if (!artifacts.hash &&
	        options.hasOwnProperty('payload')) {

	        artifacts.hash = Crypto.calculatePayloadHash(options.payload, credentials.algorithm, options.contentType);
	    }

	    var mac = Crypto.calculateMac('response', credentials, artifacts);

	    // Construct header

	    var header = 'Hawk mac="' + mac + '"' +
	                 (artifacts.hash ? ', hash="' + artifacts.hash + '"' : '');

	    if (artifacts.ext !== null &&
	        artifacts.ext !== undefined &&
	        artifacts.ext !== '') {                       // Other falsey values allowed

	        header += ', ext="' + Utils.escapeHeaderAttribute(artifacts.ext) + '"';
	    }

	    return header;
	};


	/*
	 * Arguments and options are the same as authenticate() with the exception that the only supported options are:
	 * 'hostHeaderName', 'localtimeOffsetMsec', 'host', 'port'
	 */

	exports.authenticateBewit = function (req, credentialsFunc, options, callback) {

	    callback = Utils.nextTick(callback);

	    // Application time

	    var now = Utils.now() + (options.localtimeOffsetMsec || 0);

	    // Convert node Http request object to a request configuration object

	    var request = Utils.parseRequest(req, options);
	    if (request instanceof Error) {
	        return callback(Boom.badRequest(request.message));
	    }

	    // Extract bewit

	    //                                 1     2             3           4     
	    var resource = request.url.match(/^(\/.*)([\?&])bewit\=([^&$]*)(?:&(.+))?$/);
	    if (!resource) {
	        return callback(Boom.unauthorized(null, 'Hawk'));
	    }

	    // Bewit not empty

	    if (!resource[3]) {
	        return callback(Boom.unauthorized('Empty bewit', 'Hawk'));
	    }

	    // Verify method is GET

	    if (request.method !== 'GET' &&
	        request.method !== 'HEAD') {

	        return callback(Boom.unauthorized('Invalid method', 'Hawk'));
	    }

	    // No other authentication

	    if (request.authorization) {
	        return callback(Boom.badRequest('Multiple authentications', 'Hawk'));
	    }

	    // Parse bewit

	    var bewitString = Utils.base64urlDecode(resource[3]);
	    if (bewitString instanceof Error) {
	        return callback(Boom.badRequest('Invalid bewit encoding'));
	    }

	    // Bewit format: id\exp\mac\ext ('\' is used because it is a reserved header attribute character)

	    var bewitParts = bewitString.split('\\');
	    if (!bewitParts ||
	        bewitParts.length !== 4) {

	        return callback(Boom.badRequest('Invalid bewit structure'));
	    }

	    var bewit = {
	        id: bewitParts[0],
	        exp: parseInt(bewitParts[1], 10),
	        mac: bewitParts[2],
	        ext: bewitParts[3] || ''
	    };

	    if (!bewit.id ||
	        !bewit.exp ||
	        !bewit.mac) {

	        return callback(Boom.badRequest('Missing bewit attributes'));
	    }

	    // Construct URL without bewit

	    var url = resource[1];
	    if (resource[4]) {
	        url += resource[2] + resource[4];
	    }

	    // Check expiration

	    if (bewit.exp * 1000 <= now) {
	        return callback(Boom.unauthorized('Access expired', 'Hawk'), null, bewit);
	    }

	    // Fetch Hawk credentials

	    credentialsFunc(bewit.id, function (err, credentials) {

	        if (err) {
	            return callback(err, credentials || null, bewit.ext);
	        }

	        if (!credentials) {
	            return callback(Boom.unauthorized('Unknown credentials', 'Hawk'), null, bewit);
	        }

	        if (!credentials.key ||
	            !credentials.algorithm) {

	            return callback(Boom.internal('Invalid credentials'), credentials, bewit);
	        }

	        if (Crypto.algorithms.indexOf(credentials.algorithm) === -1) {
	            return callback(Boom.internal('Unknown algorithm'), credentials, bewit);
	        }

	        // Calculate MAC

	        var mac = Crypto.calculateMac('bewit', credentials, {
	            ts: bewit.exp,
	            nonce: '',
	            method: 'GET',
	            resource: url,
	            host: request.host,
	            port: request.port,
	            ext: bewit.ext
	        });

	        if (!Cryptiles.fixedTimeComparison(mac, bewit.mac)) {
	            return callback(Boom.unauthorized('Bad mac', 'Hawk'), credentials, bewit);
	        }

	        // Successful authentication

	        return callback(null, credentials, bewit);
	    });
	};


	/*
	 *  options are the same as authenticate() with the exception that the only supported options are:
	 * 'nonceFunc', 'timestampSkewSec', 'localtimeOffsetMsec'
	 */

	exports.authenticateMessage = function (host, port, message, authorization, credentialsFunc, options, callback) {

	    callback = Utils.nextTick(callback);
	    
	    // Default options

	    options.nonceFunc = options.nonceFunc || function (nonce, ts, nonceCallback) { return nonceCallback(); };   // No validation
	    options.timestampSkewSec = options.timestampSkewSec || 60;                                                  // 60 seconds

	    // Application time

	    var now = Utils.now() + (options.localtimeOffsetMsec || 0);                 // Measure now before any other processing

	    // Validate authorization
	    
	    if (!authorization.id ||
	        !authorization.ts ||
	        !authorization.nonce ||
	        !authorization.hash ||
	        !authorization.mac) {
	        
	            return callback(Boom.badRequest('Invalid authorization'))
	    }

	    // Fetch Hawk credentials

	    credentialsFunc(authorization.id, function (err, credentials) {

	        if (err) {
	            return callback(err, credentials || null);
	        }

	        if (!credentials) {
	            return callback(Boom.unauthorized('Unknown credentials', 'Hawk'));
	        }

	        if (!credentials.key ||
	            !credentials.algorithm) {

	            return callback(Boom.internal('Invalid credentials'), credentials);
	        }

	        if (Crypto.algorithms.indexOf(credentials.algorithm) === -1) {
	            return callback(Boom.internal('Unknown algorithm'), credentials);
	        }

	        // Construct artifacts container

	        var artifacts = {
	            ts: authorization.ts,
	            nonce: authorization.nonce,
	            host: host,
	            port: port,
	            hash: authorization.hash
	        };

	        // Calculate MAC

	        var mac = Crypto.calculateMac('message', credentials, artifacts);
	        if (!Cryptiles.fixedTimeComparison(mac, authorization.mac)) {
	            return callback(Boom.unauthorized('Bad mac', 'Hawk'), credentials);
	        }

	        // Check payload hash

	        var hash = Crypto.calculatePayloadHash(message, credentials.algorithm);
	        if (!Cryptiles.fixedTimeComparison(hash, authorization.hash)) {
	            return callback(Boom.unauthorized('Bad message hash', 'Hawk'), credentials);
	        }

	        // Check nonce

	        options.nonceFunc(authorization.nonce, authorization.ts, function (err) {

	            if (err) {
	                return callback(Boom.unauthorized('Invalid nonce', 'Hawk'), credentials);
	            }

	            // Check timestamp staleness

	            if (Math.abs((authorization.ts * 1000) - now) > (options.timestampSkewSec * 1000)) {
	                return callback(Boom.unauthorized('Stale timestamp'), credentials);
	            }

	            // Successful authentication

	            return callback(null, credentials);
	        });
	    });
	};


/***/ },

/***/ 110:
/***/ function(module, exports, require) {

	// Load modules

	var Url = require(18);
	var Hoek = require(120);
	var Cryptiles = require(121);
	var Crypto = require(111);
	var Utils = require(112);


	// Declare internals

	var internals = {};


	// Generate an Authorization header for a given request

	/*
	    uri: 'http://example.com/resource?a=b' or object from Url.parse()
	    method: HTTP verb (e.g. 'GET', 'POST')
	    options: {

	        // Required

	        credentials: {
	            id: 'dh37fgj492je',
	            key: 'aoijedoaijsdlaksjdl',
	            algorithm: 'sha256'                                 // 'sha1', 'sha256'
	        },

	        // Optional

	        ext: 'application-specific',                        // Application specific data sent via the ext attribute
	        timestamp: Date.now(),                              // A pre-calculated timestamp
	        nonce: '2334f34f',                                  // A pre-generated nonce
	        localtimeOffsetMsec: 400,                           // Time offset to sync with server time (ignored if timestamp provided)
	        payload: '{"some":"payload"}',                      // UTF-8 encoded string for body hash generation (ignored if hash provided)
	        contentType: 'application/json',                    // Payload content-type (ignored if hash provided)
	        hash: 'U4MKKSmiVxk37JCCrAVIjV=',                    // Pre-calculated payload hash
	        app: '24s23423f34dx',                               // Oz application id
	        dlg: '234sz34tww3sd'                                // Oz delegated-by application id
	    }
	*/

	exports.header = function (uri, method, options) {

	    var result = {
	        field: '',
	        artifacts: {}
	    };

	    // Validate inputs

	    if (!uri || (typeof uri !== 'string' && typeof uri !== 'object') ||
	        !method || typeof method !== 'string' ||
	        !options || typeof options !== 'object') {

	        return result;
	    }

	    // Application time

	    var timestamp = options.timestamp || Math.floor((Utils.now() + (options.localtimeOffsetMsec || 0)) / 1000)

	    // Validate credentials

	    var credentials = options.credentials;
	    if (!credentials ||
	        !credentials.id ||
	        !credentials.key ||
	        !credentials.algorithm) {

	        // Invalid credential object
	        return result;
	    }

	    if (Crypto.algorithms.indexOf(credentials.algorithm) === -1) {
	        return result;
	    }

	    // Parse URI

	    if (typeof uri === 'string') {
	        uri = Url.parse(uri);
	    }

	    // Calculate signature

	    var artifacts = {
	        ts: timestamp,
	        nonce: options.nonce || Cryptiles.randomString(6),
	        method: method,
	        resource: uri.pathname + (uri.search || ''),                            // Maintain trailing '?'
	        host: uri.hostname,
	        port: uri.port || (uri.protocol === 'http:' ? 80 : 443),
	        hash: options.hash,
	        ext: options.ext,
	        app: options.app,
	        dlg: options.dlg
	    };

	    result.artifacts = artifacts;

	    // Calculate payload hash

	    if (!artifacts.hash &&
	        options.hasOwnProperty('payload')) {

	        artifacts.hash = Crypto.calculatePayloadHash(options.payload, credentials.algorithm, options.contentType);
	    }

	    var mac = Crypto.calculateMac('header', credentials, artifacts);

	    // Construct header

	    var hasExt = artifacts.ext !== null && artifacts.ext !== undefined && artifacts.ext !== '';       // Other falsey values allowed
	    var header = 'Hawk id="' + credentials.id +
	                 '", ts="' + artifacts.ts +
	                 '", nonce="' + artifacts.nonce +
	                 (artifacts.hash ? '", hash="' + artifacts.hash : '') +
	                 (hasExt ? '", ext="' + Utils.escapeHeaderAttribute(artifacts.ext) : '') +
	                 '", mac="' + mac + '"';

	    if (artifacts.app) {
	        header += ', app="' + artifacts.app +
	                  (artifacts.dlg ? '", dlg="' + artifacts.dlg : '') + '"';
	    }

	    result.field = header;

	    return result;
	};


	// Validate server response

	/*
	    res:        node's response object
	    artifacts:  object recieved from header().artifacts
	    options: {
	        payload:    optional payload received
	        required:   specifies if a Server-Authorization header is required. Defaults to 'false'
	    }
	*/

	exports.authenticate = function (res, credentials, artifacts, options) {

	    artifacts = Hoek.clone(artifacts);
	    options = options || {};

	    if (res.headers['www-authenticate']) {

	        // Parse HTTP WWW-Authenticate header

	        var attributes = Utils.parseAuthorizationHeader(res.headers['www-authenticate'], ['ts', 'tsm', 'error']);
	        if (attributes instanceof Error) {
	            return false;
	        }

	        if (attributes.ts) {
	            var tsm = Crypto.calculateTsMac(attributes.ts, credentials);
	            if (tsm !== attributes.tsm) {
	                return false;
	            }
	        }
	    }

	    // Parse HTTP Server-Authorization header

	    if (!res.headers['server-authorization'] &&
	        !options.required) {

	        return true;
	    }

	    var attributes = Utils.parseAuthorizationHeader(res.headers['server-authorization'], ['mac', 'ext', 'hash']);
	    if (attributes instanceof Error) {
	        return false;
	    }

	    artifacts.ext = attributes.ext;
	    artifacts.hash = attributes.hash;

	    var mac = Crypto.calculateMac('response', credentials, artifacts);
	    if (mac !== attributes.mac) {
	        return false;
	    }

	    if (!options.hasOwnProperty('payload')) {
	        return true;
	    }

	    if (!attributes.hash) {
	        return false;
	    }

	    var calculatedHash = Crypto.calculatePayloadHash(options.payload, credentials.algorithm, res.headers['content-type']);
	    return (calculatedHash === attributes.hash);
	};


	// Generate a bewit value for a given URI

	/*
	 * credentials is an object with the following keys: 'id, 'key', 'algorithm'.
	 * options is an object with the following optional keys: 'ext', 'localtimeOffsetMsec'
	 */
	/*
	    uri: 'http://example.com/resource?a=b' or object from Url.parse()
	    options: {

	        // Required

	        credentials: {
	            id: 'dh37fgj492je',
	            key: 'aoijedoaijsdlaksjdl',
	            algorithm: 'sha256'                             // 'sha1', 'sha256'
	        },
	        ttlSec: 60 * 60,                                    // TTL in seconds

	        // Optional

	        ext: 'application-specific',                        // Application specific data sent via the ext attribute
	        localtimeOffsetMsec: 400                            // Time offset to sync with server time
	    };
	*/

	exports.getBewit = function (uri, options) {

	    // Validate inputs

	    if (!uri ||
	        (typeof uri !== 'string' && typeof uri !== 'object') ||
	        !options ||
	        typeof options !== 'object' ||
	        !options.ttlSec) {

	        return '';
	    }

	    options.ext = (options.ext === null || options.ext === undefined ? '' : options.ext);       // Zero is valid value

	    // Application time

	    var now = Utils.now() + (options.localtimeOffsetMsec || 0);

	    // Validate credentials

	    var credentials = options.credentials;
	    if (!credentials ||
	        !credentials.id ||
	        !credentials.key ||
	        !credentials.algorithm) {

	        return '';
	    }

	    if (Crypto.algorithms.indexOf(credentials.algorithm) === -1) {
	        return '';
	    }

	    // Parse URI

	    if (typeof uri === 'string') {
	        uri = Url.parse(uri);
	    }

	    // Calculate signature

	    var exp = Math.floor(now / 1000) + options.ttlSec;
	    var mac = Crypto.calculateMac('bewit', credentials, {
	        ts: exp,
	        nonce: '',
	        method: 'GET',
	        resource: uri.pathname + (uri.search || ''),                            // Maintain trailing '?'
	        host: uri.hostname,
	        port: uri.port || (uri.protocol === 'http:' ? 80 : 443),
	        ext: options.ext
	    });

	    // Construct bewit: id\exp\mac\ext

	    var bewit = credentials.id + '\\' + exp + '\\' + mac + '\\' + options.ext;
	    return Utils.base64urlEncode(bewit);
	};


	// Generate an authorization string for a message

	/*
	    host: 'example.com',
	    port: 8000,
	    message: '{"some":"payload"}',                          // UTF-8 encoded string for body hash generation
	    options: {

	        // Required

	        credentials: {
	            id: 'dh37fgj492je',
	            key: 'aoijedoaijsdlaksjdl',
	            algorithm: 'sha256'                             // 'sha1', 'sha256'
	        },

	        // Optional

	        timestamp: Date.now(),                              // A pre-calculated timestamp
	        nonce: '2334f34f',                                  // A pre-generated nonce
	        localtimeOffsetMsec: 400,                           // Time offset to sync with server time (ignored if timestamp provided)
	    }
	*/

	exports.message = function (host, port, message, options) {

	    // Validate inputs

	    if (!host || typeof host !== 'string' ||
	        !port || typeof port !== 'number' ||
	        message === null || message === undefined || typeof message !== 'string' ||
	        !options || typeof options !== 'object') {

	        return null;
	    }

	    // Application time

	    var timestamp = options.timestamp || Math.floor((Utils.now() + (options.localtimeOffsetMsec || 0)) / 1000)

	    // Validate credentials

	    var credentials = options.credentials;
	    if (!credentials ||
	        !credentials.id ||
	        !credentials.key ||
	        !credentials.algorithm) {

	        // Invalid credential object
	        return null;
	    }

	    if (Crypto.algorithms.indexOf(credentials.algorithm) === -1) {
	        return null;
	    }

	    // Calculate signature

	    var artifacts = {
	        ts: timestamp,
	        nonce: options.nonce || Cryptiles.randomString(6),
	        host: host,
	        port: port,
	        hash: Crypto.calculatePayloadHash(message, credentials.algorithm)
	    };

	    // Construct authorization

	    var result = {
	        id: credentials.id,
	        ts: artifacts.ts,
	        nonce: artifacts.nonce,
	        hash: artifacts.hash,
	        mac: Crypto.calculateMac('message', credentials, artifacts)
	    };

	    return result;
	};





/***/ },

/***/ 111:
/***/ function(module, exports, require) {

	// Load modules

	var Crypto = require(72);
	var Url = require(18);
	var Utils = require(112);


	// Declare internals

	var internals = {};


	// MAC normalization format version

	exports.headerVersion = '1';                        // Prevent comparison of mac values generated with different normalized string formats


	// Supported HMAC algorithms

	exports.algorithms = ['sha1', 'sha256'];


	// Calculate the request MAC

	/*
	    type: 'header',                                 // 'header', 'bewit', 'response'
	    credentials: {
	        key: 'aoijedoaijsdlaksjdl',
	        algorithm: 'sha256'                         // 'sha1', 'sha256'
	    },
	    options: {
	        method: 'GET',
	        resource: '/resource?a=1&b=2',
	        host: 'example.com',
	        port: 8080,
	        ts: 1357718381034,
	        nonce: 'd3d345f',
	        hash: 'U4MKKSmiVxk37JCCrAVIjV/OhB3y+NdwoCr6RShbVkE=',
	        ext: 'app-specific-data',
	        app: 'hf48hd83qwkj',                        // Application id (Oz)
	        dlg: 'd8djwekds9cj'                         // Delegated by application id (Oz), requires options.app
	    }
	*/

	exports.calculateMac = function (type, credentials, options) {

	    var normalized = exports.generateNormalizedString(type, options);

	    var hmac = Crypto.createHmac(credentials.algorithm, credentials.key).update(normalized);
	    var digest = hmac.digest('base64');
	    return digest;
	};


	exports.generateNormalizedString = function (type, options) {

	    var normalized = 'hawk.' + exports.headerVersion + '.' + type + '\n' +
	                     options.ts + '\n' +
	                     options.nonce + '\n' +
	                     (options.method || '').toUpperCase() + '\n' +
	                     (options.resource || '') + '\n' +
	                     options.host.toLowerCase() + '\n' +
	                     options.port + '\n' +
	                     (options.hash || '') + '\n';

	    if (options.ext) {
	        normalized += options.ext.replace('\\', '\\\\').replace('\n', '\\n');
	    }

	    normalized += '\n';

	    if (options.app) {
	        normalized += options.app + '\n' +
	                      (options.dlg || '') + '\n';
	    }

	    return normalized;
	};


	exports.calculatePayloadHash = function (payload, algorithm, contentType) {

	    var hash = exports.initializePayloadHash(algorithm, contentType);
	    hash.update(payload || '');
	    return exports.finalizePayloadHash(hash);
	};


	exports.initializePayloadHash = function (algorithm, contentType) {

	    var hash = Crypto.createHash(algorithm);
	    hash.update('hawk.' + exports.headerVersion + '.payload\n');
	    hash.update(Utils.parseContentType(contentType) + '\n');
	    return hash;
	};


	exports.finalizePayloadHash = function (hash) {

	    hash.update('\n');
	    return hash.digest('base64');
	};


	exports.calculateTsMac = function (ts, credentials) {

	    var hmac = Crypto.createHmac(credentials.algorithm, credentials.key);
	    hmac.update('hawk.' + exports.headerVersion + '.ts\n' + ts + '\n');
	    return hmac.digest('base64');
	};



/***/ },

/***/ 112:
/***/ function(module, exports, require) {

	/* WEBPACK VAR INJECTION */(function(require, __dirname) {// Load modules

	var Hoek = require(120);
	var Sntp = require(116);
	var Boom = require(115);


	// Declare internals

	var internals = {};


	// Import Hoek Utilities

	internals.import = function () {

	    for (var i in Hoek) {
	        if (Hoek.hasOwnProperty(i)) {
	            exports[i] = Hoek[i];
	        }
	    }
	};

	internals.import();


	// Hawk version

	exports.version = function () {

	    return exports.loadPackage(__dirname + '/..').version;
	};


	// Extract host and port from request

	exports.parseHost = function (req, hostHeaderName) {

	    hostHeaderName = (hostHeaderName ? hostHeaderName.toLowerCase() : 'host');
	    var hostHeader = req.headers[hostHeaderName];
	    if (!hostHeader) {
	        return null;
	    }

	    var hostHeaderRegex;
	    if (hostHeader[0] === '[') {
	        hostHeaderRegex = /^(?:(?:\r\n)?\s)*(\[[^\]]+\])(?::(\d+))?(?:(?:\r\n)?\s)*$/;      // IPv6
	    }
	    else {
	        hostHeaderRegex = /^(?:(?:\r\n)?\s)*([^:]+)(?::(\d+))?(?:(?:\r\n)?\s)*$/;           // IPv4, hostname
	    }
	    
	    var hostParts = hostHeader.match(hostHeaderRegex);

	    if (!hostParts ||
	        hostParts.length !== 3 ||
	        !hostParts[1]) {

	        return null;
	    }

	    return {
	        name: hostParts[1],
	        port: (hostParts[2] ? hostParts[2] : (req.connection && req.connection.encrypted ? 443 : 80))
	    };
	};


	// Parse Content-Type header content

	exports.parseContentType = function (header) {

	    if (!header) {
	        return '';
	    }

	    return header.split(';')[0].trim().toLowerCase();
	};


	// Convert node's  to request configuration object

	exports.parseRequest = function (req, options) {

	    if (!req.headers) {
	        return req;
	    }
	    
	    // Obtain host and port information

	    if (!options.host || !options.port) {
	        var host = exports.parseHost(req, options.hostHeaderName);
	        if (!host) {
	            return new Error('Invalid Host header');
	        }
	    }

	    var request = {
	        method: req.method,
	        url: req.url,
	        host: options.host || host.name,
	        port: options.port || host.port,
	        authorization: req.headers.authorization,
	        contentType: req.headers['content-type'] || ''
	    };

	    return request;
	};


	exports.now = function () {

	    return Sntp.now();
	};


	// Parse Hawk HTTP Authorization header

	exports.parseAuthorizationHeader = function (header, keys) {

	    keys = keys || ['id', 'ts', 'nonce', 'hash', 'ext', 'mac', 'app', 'dlg'];

	    if (!header) {
	        return Boom.unauthorized(null, 'Hawk');
	    }

	    var headerParts = header.match(/^(\w+)(?:\s+(.*))?$/);       // Header: scheme[ something]
	    if (!headerParts) {
	        return Boom.badRequest('Invalid header syntax');
	    }

	    var scheme = headerParts[1];
	    if (scheme.toLowerCase() !== 'hawk') {
	        return Boom.unauthorized(null, 'Hawk');
	    }

	    var attributesString = headerParts[2];
	    if (!attributesString) {
	        return Boom.badRequest('Invalid header syntax');
	    }

	    var attributes = {};
	    var errorMessage = '';
	    var verify = attributesString.replace(/(\w+)="([^"\\]*)"\s*(?:,\s*|$)/g, function ($0, $1, $2) {

	        // Check valid attribute names

	        if (keys.indexOf($1) === -1) {
	            errorMessage = 'Unknown attribute: ' + $1;
	            return;
	        }

	        // Allowed attribute value characters: !#$%&'()*+,-./:;<=>?@[]^_`{|}~ and space, a-z, A-Z, 0-9

	        if ($2.match(/^[ \w\!#\$%&'\(\)\*\+,\-\.\/\:;<\=>\?@\[\]\^`\{\|\}~]+$/) === null) {
	            errorMessage = 'Bad attribute value: ' + $1;
	            return;
	        }

	        // Check for duplicates

	        if (attributes.hasOwnProperty($1)) {
	            errorMessage = 'Duplicate attribute: ' + $1;
	            return;
	        }

	        attributes[$1] = $2;
	        return '';
	    });

	    if (verify !== '') {
	        return Boom.badRequest(errorMessage || 'Bad header format');
	    }

	    return attributes;
	};


	exports.unauthorized = function (message) {

	    return Boom.unauthorized(message, 'Hawk');
	};

	
	/* WEBPACK VAR INJECTION */}.call(exports, require, "/"))

/***/ },

/***/ 113:
/***/ function(module, exports, require) {

	/* WEBPACK VAR INJECTION */(function(require, Buffer) {var util = require(17);
	var Stream = require(71).Stream;
	var DelayedStream = require(127);

	module.exports = CombinedStream;
	function CombinedStream() {
	  this.writable = false;
	  this.readable = true;
	  this.dataSize = 0;
	  this.maxDataSize = 2 * 1024 * 1024;
	  this.pauseStreams = true;

	  this._released = false;
	  this._streams = [];
	  this._currentStream = null;
	}
	util.inherits(CombinedStream, Stream);

	CombinedStream.create = function(options) {
	  var combinedStream = new this();

	  options = options || {};
	  for (var option in options) {
	    combinedStream[option] = options[option];
	  }

	  return combinedStream;
	};

	CombinedStream.isStreamLike = function(stream) {
	  return (typeof stream !== 'function')
	    && (typeof stream !== 'string')
	    && (typeof stream !== 'boolean')    
	    && (typeof stream !== 'number')
	    && (!Buffer.isBuffer(stream));
	};

	CombinedStream.prototype.append = function(stream) {
	  var isStreamLike = CombinedStream.isStreamLike(stream);

	  if (isStreamLike) {
	    if (!(stream instanceof DelayedStream)) {
	      stream.on('data', this._checkDataSize.bind(this));

	      stream = DelayedStream.create(stream, {
	        maxDataSize: Infinity,
	        pauseStream: this.pauseStreams,
	      });
	    }

	    this._handleErrors(stream);

	    if (this.pauseStreams) {
	      stream.pause();
	    }
	  }

	  this._streams.push(stream);
	  return this;
	};

	CombinedStream.prototype.pipe = function(dest, options) {
	  Stream.prototype.pipe.call(this, dest, options);
	  this.resume();
	};

	CombinedStream.prototype._getNext = function() {
	  this._currentStream = null;
	  var stream = this._streams.shift();


	  if (typeof stream == 'undefined') {
	    this.end();
	    return;
	  }

	  if (typeof stream !== 'function') {
	    this._pipeNext(stream);
	    return;
	  }

	  var getStream = stream;
	  getStream(function(stream) {
	    var isStreamLike = CombinedStream.isStreamLike(stream);
	    if (isStreamLike) {
	      stream.on('data', this._checkDataSize.bind(this));
	      this._handleErrors(stream);
	    }

	    this._pipeNext(stream);
	  }.bind(this));
	};

	CombinedStream.prototype._pipeNext = function(stream) {
	  this._currentStream = stream;

	  var isStreamLike = CombinedStream.isStreamLike(stream);
	  if (isStreamLike) {
	    stream.on('end', this._getNext.bind(this))
	    stream.pipe(this, {end: false});
	    return;
	  }

	  var value = stream;
	  this.write(value);
	  this._getNext();
	};

	CombinedStream.prototype._handleErrors = function(stream) {
	  var self = this;
	  stream.on('error', function(err) {
	    self._emitError(err);
	  });
	};

	CombinedStream.prototype.write = function(data) {
	  this.emit('data', data);
	};

	CombinedStream.prototype.pause = function() {
	  if (!this.pauseStreams) {
	    return;
	  }

	  this.emit('pause');
	};

	CombinedStream.prototype.resume = function() {
	  if (!this._released) {
	    this._released = true;
	    this.writable = true;
	    this._getNext();
	  }

	  this.emit('resume');
	};

	CombinedStream.prototype.end = function() {
	  this._reset();
	  this.emit('end');
	};

	CombinedStream.prototype.destroy = function() {
	  this._reset();
	  this.emit('close');
	};

	CombinedStream.prototype._reset = function() {
	  this.writable = false;
	  this._streams = [];
	  this._currentStream = null;
	};

	CombinedStream.prototype._checkDataSize = function() {
	  this._updateDataSize();
	  if (this.dataSize <= this.maxDataSize) {
	    return;
	  }

	  var message =
	    'DelayedStream#maxDataSize of ' + this.maxDataSize + ' bytes exceeded.'
	  this._emitError(new Error(message));
	};

	CombinedStream.prototype._updateDataSize = function() {
	  this.dataSize = 0;

	  var self = this;
	  this._streams.forEach(function(stream) {
	    if (!stream.dataSize) {
	      return;
	    }

	    self.dataSize += stream.dataSize;
	  });

	  if (this._currentStream && this._currentStream.dataSize) {
	    this.dataSize += this._currentStream.dataSize;
	  }
	};

	CombinedStream.prototype._emitError = function(err) {
	  this._reset();
	  this.emit('error', err);
	};
	
	/* WEBPACK VAR INJECTION */}.call(exports, require, require(50).Buffer))

/***/ },

/***/ 114:
/***/ function(module, exports, require) {

	/* WEBPACK VAR INJECTION */(function(require, process) {var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/*global setImmediate: false, setTimeout: false, console: false */
	(function () {

	    var async = {};

	    // global on the server, window in the browser
	    var root, previous_async;

	    root = this;
	    if (root != null) {
	      previous_async = root.async;
	    }

	    async.noConflict = function () {
	        root.async = previous_async;
	        return async;
	    };

	    function only_once(fn) {
	        var called = false;
	        return function() {
	            if (called) throw new Error("Callback was already called.");
	            called = true;
	            fn.apply(root, arguments);
	        }
	    }

	    //// cross-browser compatiblity functions ////

	    var _each = function (arr, iterator) {
	        if (arr.forEach) {
	            return arr.forEach(iterator);
	        }
	        for (var i = 0; i < arr.length; i += 1) {
	            iterator(arr[i], i, arr);
	        }
	    };

	    var _map = function (arr, iterator) {
	        if (arr.map) {
	            return arr.map(iterator);
	        }
	        var results = [];
	        _each(arr, function (x, i, a) {
	            results.push(iterator(x, i, a));
	        });
	        return results;
	    };

	    var _reduce = function (arr, iterator, memo) {
	        if (arr.reduce) {
	            return arr.reduce(iterator, memo);
	        }
	        _each(arr, function (x, i, a) {
	            memo = iterator(memo, x, i, a);
	        });
	        return memo;
	    };

	    var _keys = function (obj) {
	        if (Object.keys) {
	            return Object.keys(obj);
	        }
	        var keys = [];
	        for (var k in obj) {
	            if (obj.hasOwnProperty(k)) {
	                keys.push(k);
	            }
	        }
	        return keys;
	    };

	    //// exported async module functions ////

	    //// nextTick implementation with browser-compatible fallback ////
	    if (typeof process === 'undefined' || !(process.nextTick)) {
	        if (typeof setImmediate === 'function') {
	            async.nextTick = function (fn) {
	                // not a direct alias for IE10 compatibility
	                setImmediate(fn);
	            };
	            async.setImmediate = async.nextTick;
	        }
	        else {
	            async.nextTick = function (fn) {
	                setTimeout(fn, 0);
	            };
	            async.setImmediate = async.nextTick;
	        }
	    }
	    else {
	        async.nextTick = process.nextTick;
	        if (typeof setImmediate !== 'undefined') {
	            async.setImmediate = setImmediate;
	        }
	        else {
	            async.setImmediate = async.nextTick;
	        }
	    }

	    async.each = function (arr, iterator, callback) {
	        callback = callback || function () {};
	        if (!arr.length) {
	            return callback();
	        }
	        var completed = 0;
	        _each(arr, function (x) {
	            iterator(x, only_once(function (err) {
	                if (err) {
	                    callback(err);
	                    callback = function () {};
	                }
	                else {
	                    completed += 1;
	                    if (completed >= arr.length) {
	                        callback(null);
	                    }
	                }
	            }));
	        });
	    };
	    async.forEach = async.each;

	    async.eachSeries = function (arr, iterator, callback) {
	        callback = callback || function () {};
	        if (!arr.length) {
	            return callback();
	        }
	        var completed = 0;
	        var iterate = function () {
	            iterator(arr[completed], function (err) {
	                if (err) {
	                    callback(err);
	                    callback = function () {};
	                }
	                else {
	                    completed += 1;
	                    if (completed >= arr.length) {
	                        callback(null);
	                    }
	                    else {
	                        iterate();
	                    }
	                }
	            });
	        };
	        iterate();
	    };
	    async.forEachSeries = async.eachSeries;

	    async.eachLimit = function (arr, limit, iterator, callback) {
	        var fn = _eachLimit(limit);
	        fn.apply(null, [arr, iterator, callback]);
	    };
	    async.forEachLimit = async.eachLimit;

	    var _eachLimit = function (limit) {

	        return function (arr, iterator, callback) {
	            callback = callback || function () {};
	            if (!arr.length || limit <= 0) {
	                return callback();
	            }
	            var completed = 0;
	            var started = 0;
	            var running = 0;

	            (function replenish () {
	                if (completed >= arr.length) {
	                    return callback();
	                }

	                while (running < limit && started < arr.length) {
	                    started += 1;
	                    running += 1;
	                    iterator(arr[started - 1], function (err) {
	                        if (err) {
	                            callback(err);
	                            callback = function () {};
	                        }
	                        else {
	                            completed += 1;
	                            running -= 1;
	                            if (completed >= arr.length) {
	                                callback();
	                            }
	                            else {
	                                replenish();
	                            }
	                        }
	                    });
	                }
	            })();
	        };
	    };


	    var doParallel = function (fn) {
	        return function () {
	            var args = Array.prototype.slice.call(arguments);
	            return fn.apply(null, [async.each].concat(args));
	        };
	    };
	    var doParallelLimit = function(limit, fn) {
	        return function () {
	            var args = Array.prototype.slice.call(arguments);
	            return fn.apply(null, [_eachLimit(limit)].concat(args));
	        };
	    };
	    var doSeries = function (fn) {
	        return function () {
	            var args = Array.prototype.slice.call(arguments);
	            return fn.apply(null, [async.eachSeries].concat(args));
	        };
	    };


	    var _asyncMap = function (eachfn, arr, iterator, callback) {
	        var results = [];
	        arr = _map(arr, function (x, i) {
	            return {index: i, value: x};
	        });
	        eachfn(arr, function (x, callback) {
	            iterator(x.value, function (err, v) {
	                results[x.index] = v;
	                callback(err);
	            });
	        }, function (err) {
	            callback(err, results);
	        });
	    };
	    async.map = doParallel(_asyncMap);
	    async.mapSeries = doSeries(_asyncMap);
	    async.mapLimit = function (arr, limit, iterator, callback) {
	        return _mapLimit(limit)(arr, iterator, callback);
	    };

	    var _mapLimit = function(limit) {
	        return doParallelLimit(limit, _asyncMap);
	    };

	    // reduce only has a series version, as doing reduce in parallel won't
	    // work in many situations.
	    async.reduce = function (arr, memo, iterator, callback) {
	        async.eachSeries(arr, function (x, callback) {
	            iterator(memo, x, function (err, v) {
	                memo = v;
	                callback(err);
	            });
	        }, function (err) {
	            callback(err, memo);
	        });
	    };
	    // inject alias
	    async.inject = async.reduce;
	    // foldl alias
	    async.foldl = async.reduce;

	    async.reduceRight = function (arr, memo, iterator, callback) {
	        var reversed = _map(arr, function (x) {
	            return x;
	        }).reverse();
	        async.reduce(reversed, memo, iterator, callback);
	    };
	    // foldr alias
	    async.foldr = async.reduceRight;

	    var _filter = function (eachfn, arr, iterator, callback) {
	        var results = [];
	        arr = _map(arr, function (x, i) {
	            return {index: i, value: x};
	        });
	        eachfn(arr, function (x, callback) {
	            iterator(x.value, function (v) {
	                if (v) {
	                    results.push(x);
	                }
	                callback();
	            });
	        }, function (err) {
	            callback(_map(results.sort(function (a, b) {
	                return a.index - b.index;
	            }), function (x) {
	                return x.value;
	            }));
	        });
	    };
	    async.filter = doParallel(_filter);
	    async.filterSeries = doSeries(_filter);
	    // select alias
	    async.select = async.filter;
	    async.selectSeries = async.filterSeries;

	    var _reject = function (eachfn, arr, iterator, callback) {
	        var results = [];
	        arr = _map(arr, function (x, i) {
	            return {index: i, value: x};
	        });
	        eachfn(arr, function (x, callback) {
	            iterator(x.value, function (v) {
	                if (!v) {
	                    results.push(x);
	                }
	                callback();
	            });
	        }, function (err) {
	            callback(_map(results.sort(function (a, b) {
	                return a.index - b.index;
	            }), function (x) {
	                return x.value;
	            }));
	        });
	    };
	    async.reject = doParallel(_reject);
	    async.rejectSeries = doSeries(_reject);

	    var _detect = function (eachfn, arr, iterator, main_callback) {
	        eachfn(arr, function (x, callback) {
	            iterator(x, function (result) {
	                if (result) {
	                    main_callback(x);
	                    main_callback = function () {};
	                }
	                else {
	                    callback();
	                }
	            });
	        }, function (err) {
	            main_callback();
	        });
	    };
	    async.detect = doParallel(_detect);
	    async.detectSeries = doSeries(_detect);

	    async.some = function (arr, iterator, main_callback) {
	        async.each(arr, function (x, callback) {
	            iterator(x, function (v) {
	                if (v) {
	                    main_callback(true);
	                    main_callback = function () {};
	                }
	                callback();
	            });
	        }, function (err) {
	            main_callback(false);
	        });
	    };
	    // any alias
	    async.any = async.some;

	    async.every = function (arr, iterator, main_callback) {
	        async.each(arr, function (x, callback) {
	            iterator(x, function (v) {
	                if (!v) {
	                    main_callback(false);
	                    main_callback = function () {};
	                }
	                callback();
	            });
	        }, function (err) {
	            main_callback(true);
	        });
	    };
	    // all alias
	    async.all = async.every;

	    async.sortBy = function (arr, iterator, callback) {
	        async.map(arr, function (x, callback) {
	            iterator(x, function (err, criteria) {
	                if (err) {
	                    callback(err);
	                }
	                else {
	                    callback(null, {value: x, criteria: criteria});
	                }
	            });
	        }, function (err, results) {
	            if (err) {
	                return callback(err);
	            }
	            else {
	                var fn = function (left, right) {
	                    var a = left.criteria, b = right.criteria;
	                    return a < b ? -1 : a > b ? 1 : 0;
	                };
	                callback(null, _map(results.sort(fn), function (x) {
	                    return x.value;
	                }));
	            }
	        });
	    };

	    async.auto = function (tasks, callback) {
	        callback = callback || function () {};
	        var keys = _keys(tasks);
	        if (!keys.length) {
	            return callback(null);
	        }

	        var results = {};

	        var listeners = [];
	        var addListener = function (fn) {
	            listeners.unshift(fn);
	        };
	        var removeListener = function (fn) {
	            for (var i = 0; i < listeners.length; i += 1) {
	                if (listeners[i] === fn) {
	                    listeners.splice(i, 1);
	                    return;
	                }
	            }
	        };
	        var taskComplete = function () {
	            _each(listeners.slice(0), function (fn) {
	                fn();
	            });
	        };

	        addListener(function () {
	            if (_keys(results).length === keys.length) {
	                callback(null, results);
	                callback = function () {};
	            }
	        });

	        _each(keys, function (k) {
	            var task = (tasks[k] instanceof Function) ? [tasks[k]]: tasks[k];
	            var taskCallback = function (err) {
	                var args = Array.prototype.slice.call(arguments, 1);
	                if (args.length <= 1) {
	                    args = args[0];
	                }
	                if (err) {
	                    var safeResults = {};
	                    _each(_keys(results), function(rkey) {
	                        safeResults[rkey] = results[rkey];
	                    });
	                    safeResults[k] = args;
	                    callback(err, safeResults);
	                    // stop subsequent errors hitting callback multiple times
	                    callback = function () {};
	                }
	                else {
	                    results[k] = args;
	                    async.setImmediate(taskComplete);
	                }
	            };
	            var requires = task.slice(0, Math.abs(task.length - 1)) || [];
	            var ready = function () {
	                return _reduce(requires, function (a, x) {
	                    return (a && results.hasOwnProperty(x));
	                }, true) && !results.hasOwnProperty(k);
	            };
	            if (ready()) {
	                task[task.length - 1](taskCallback, results);
	            }
	            else {
	                var listener = function () {
	                    if (ready()) {
	                        removeListener(listener);
	                        task[task.length - 1](taskCallback, results);
	                    }
	                };
	                addListener(listener);
	            }
	        });
	    };

	    async.waterfall = function (tasks, callback) {
	        callback = callback || function () {};
	        if (tasks.constructor !== Array) {
	          var err = new Error('First argument to waterfall must be an array of functions');
	          return callback(err);
	        }
	        if (!tasks.length) {
	            return callback();
	        }
	        var wrapIterator = function (iterator) {
	            return function (err) {
	                if (err) {
	                    callback.apply(null, arguments);
	                    callback = function () {};
	                }
	                else {
	                    var args = Array.prototype.slice.call(arguments, 1);
	                    var next = iterator.next();
	                    if (next) {
	                        args.push(wrapIterator(next));
	                    }
	                    else {
	                        args.push(callback);
	                    }
	                    async.setImmediate(function () {
	                        iterator.apply(null, args);
	                    });
	                }
	            };
	        };
	        wrapIterator(async.iterator(tasks))();
	    };

	    var _parallel = function(eachfn, tasks, callback) {
	        callback = callback || function () {};
	        if (tasks.constructor === Array) {
	            eachfn.map(tasks, function (fn, callback) {
	                if (fn) {
	                    fn(function (err) {
	                        var args = Array.prototype.slice.call(arguments, 1);
	                        if (args.length <= 1) {
	                            args = args[0];
	                        }
	                        callback.call(null, err, args);
	                    });
	                }
	            }, callback);
	        }
	        else {
	            var results = {};
	            eachfn.each(_keys(tasks), function (k, callback) {
	                tasks[k](function (err) {
	                    var args = Array.prototype.slice.call(arguments, 1);
	                    if (args.length <= 1) {
	                        args = args[0];
	                    }
	                    results[k] = args;
	                    callback(err);
	                });
	            }, function (err) {
	                callback(err, results);
	            });
	        }
	    };

	    async.parallel = function (tasks, callback) {
	        _parallel({ map: async.map, each: async.each }, tasks, callback);
	    };

	    async.parallelLimit = function(tasks, limit, callback) {
	        _parallel({ map: _mapLimit(limit), each: _eachLimit(limit) }, tasks, callback);
	    };

	    async.series = function (tasks, callback) {
	        callback = callback || function () {};
	        if (tasks.constructor === Array) {
	            async.mapSeries(tasks, function (fn, callback) {
	                if (fn) {
	                    fn(function (err) {
	                        var args = Array.prototype.slice.call(arguments, 1);
	                        if (args.length <= 1) {
	                            args = args[0];
	                        }
	                        callback.call(null, err, args);
	                    });
	                }
	            }, callback);
	        }
	        else {
	            var results = {};
	            async.eachSeries(_keys(tasks), function (k, callback) {
	                tasks[k](function (err) {
	                    var args = Array.prototype.slice.call(arguments, 1);
	                    if (args.length <= 1) {
	                        args = args[0];
	                    }
	                    results[k] = args;
	                    callback(err);
	                });
	            }, function (err) {
	                callback(err, results);
	            });
	        }
	    };

	    async.iterator = function (tasks) {
	        var makeCallback = function (index) {
	            var fn = function () {
	                if (tasks.length) {
	                    tasks[index].apply(null, arguments);
	                }
	                return fn.next();
	            };
	            fn.next = function () {
	                return (index < tasks.length - 1) ? makeCallback(index + 1): null;
	            };
	            return fn;
	        };
	        return makeCallback(0);
	    };

	    async.apply = function (fn) {
	        var args = Array.prototype.slice.call(arguments, 1);
	        return function () {
	            return fn.apply(
	                null, args.concat(Array.prototype.slice.call(arguments))
	            );
	        };
	    };

	    var _concat = function (eachfn, arr, fn, callback) {
	        var r = [];
	        eachfn(arr, function (x, cb) {
	            fn(x, function (err, y) {
	                r = r.concat(y || []);
	                cb(err);
	            });
	        }, function (err) {
	            callback(err, r);
	        });
	    };
	    async.concat = doParallel(_concat);
	    async.concatSeries = doSeries(_concat);

	    async.whilst = function (test, iterator, callback) {
	        if (test()) {
	            iterator(function (err) {
	                if (err) {
	                    return callback(err);
	                }
	                async.whilst(test, iterator, callback);
	            });
	        }
	        else {
	            callback();
	        }
	    };

	    async.doWhilst = function (iterator, test, callback) {
	        iterator(function (err) {
	            if (err) {
	                return callback(err);
	            }
	            if (test()) {
	                async.doWhilst(iterator, test, callback);
	            }
	            else {
	                callback();
	            }
	        });
	    };

	    async.until = function (test, iterator, callback) {
	        if (!test()) {
	            iterator(function (err) {
	                if (err) {
	                    return callback(err);
	                }
	                async.until(test, iterator, callback);
	            });
	        }
	        else {
	            callback();
	        }
	    };

	    async.doUntil = function (iterator, test, callback) {
	        iterator(function (err) {
	            if (err) {
	                return callback(err);
	            }
	            if (!test()) {
	                async.doUntil(iterator, test, callback);
	            }
	            else {
	                callback();
	            }
	        });
	    };

	    async.queue = function (worker, concurrency) {
	        if (concurrency === undefined) {
	            concurrency = 1;
	        }
	        function _insert(q, data, pos, callback) {
	          if(data.constructor !== Array) {
	              data = [data];
	          }
	          _each(data, function(task) {
	              var item = {
	                  data: task,
	                  callback: typeof callback === 'function' ? callback : null
	              };

	              if (pos) {
	                q.tasks.unshift(item);
	              } else {
	                q.tasks.push(item);
	              }

	              if (q.saturated && q.tasks.length === concurrency) {
	                  q.saturated();
	              }
	              async.setImmediate(q.process);
	          });
	        }

	        var workers = 0;
	        var q = {
	            tasks: [],
	            concurrency: concurrency,
	            saturated: null,
	            empty: null,
	            drain: null,
	            push: function (data, callback) {
	              _insert(q, data, false, callback);
	            },
	            unshift: function (data, callback) {
	              _insert(q, data, true, callback);
	            },
	            process: function () {
	                if (workers < q.concurrency && q.tasks.length) {
	                    var task = q.tasks.shift();
	                    if (q.empty && q.tasks.length === 0) {
	                        q.empty();
	                    }
	                    workers += 1;
	                    var next = function () {
	                        workers -= 1;
	                        if (task.callback) {
	                            task.callback.apply(task, arguments);
	                        }
	                        if (q.drain && q.tasks.length + workers === 0) {
	                            q.drain();
	                        }
	                        q.process();
	                    };
	                    var cb = only_once(next);
	                    worker(task.data, cb);
	                }
	            },
	            length: function () {
	                return q.tasks.length;
	            },
	            running: function () {
	                return workers;
	            }
	        };
	        return q;
	    };

	    async.cargo = function (worker, payload) {
	        var working     = false,
	            tasks       = [];

	        var cargo = {
	            tasks: tasks,
	            payload: payload,
	            saturated: null,
	            empty: null,
	            drain: null,
	            push: function (data, callback) {
	                if(data.constructor !== Array) {
	                    data = [data];
	                }
	                _each(data, function(task) {
	                    tasks.push({
	                        data: task,
	                        callback: typeof callback === 'function' ? callback : null
	                    });
	                    if (cargo.saturated && tasks.length === payload) {
	                        cargo.saturated();
	                    }
	                });
	                async.setImmediate(cargo.process);
	            },
	            process: function process() {
	                if (working) return;
	                if (tasks.length === 0) {
	                    if(cargo.drain) cargo.drain();
	                    return;
	                }

	                var ts = typeof payload === 'number'
	                            ? tasks.splice(0, payload)
	                            : tasks.splice(0);

	                var ds = _map(ts, function (task) {
	                    return task.data;
	                });

	                if(cargo.empty) cargo.empty();
	                working = true;
	                worker(ds, function () {
	                    working = false;

	                    var args = arguments;
	                    _each(ts, function (data) {
	                        if (data.callback) {
	                            data.callback.apply(null, args);
	                        }
	                    });

	                    process();
	                });
	            },
	            length: function () {
	                return tasks.length;
	            },
	            running: function () {
	                return working;
	            }
	        };
	        return cargo;
	    };

	    var _console_fn = function (name) {
	        return function (fn) {
	            var args = Array.prototype.slice.call(arguments, 1);
	            fn.apply(null, args.concat([function (err) {
	                var args = Array.prototype.slice.call(arguments, 1);
	                if (typeof console !== 'undefined') {
	                    if (err) {
	                        if (console.error) {
	                            console.error(err);
	                        }
	                    }
	                    else if (console[name]) {
	                        _each(args, function (x) {
	                            console[name](x);
	                        });
	                    }
	                }
	            }]));
	        };
	    };
	    async.log = _console_fn('log');
	    async.dir = _console_fn('dir');
	    /*async.info = _console_fn('info');
	    async.warn = _console_fn('warn');
	    async.error = _console_fn('error');*/

	    async.memoize = function (fn, hasher) {
	        var memo = {};
	        var queues = {};
	        hasher = hasher || function (x) {
	            return x;
	        };
	        var memoized = function () {
	            var args = Array.prototype.slice.call(arguments);
	            var callback = args.pop();
	            var key = hasher.apply(null, args);
	            if (key in memo) {
	                callback.apply(null, memo[key]);
	            }
	            else if (key in queues) {
	                queues[key].push(callback);
	            }
	            else {
	                queues[key] = [callback];
	                fn.apply(null, args.concat([function () {
	                    memo[key] = arguments;
	                    var q = queues[key];
	                    delete queues[key];
	                    for (var i = 0, l = q.length; i < l; i++) {
	                      q[i].apply(null, arguments);
	                    }
	                }]));
	            }
	        };
	        memoized.memo = memo;
	        memoized.unmemoized = fn;
	        return memoized;
	    };

	    async.unmemoize = function (fn) {
	      return function () {
	        return (fn.unmemoized || fn).apply(null, arguments);
	      };
	    };

	    async.times = function (count, iterator, callback) {
	        var counter = [];
	        for (var i = 0; i < count; i++) {
	            counter.push(i);
	        }
	        return async.map(counter, iterator, callback);
	    };

	    async.timesSeries = function (count, iterator, callback) {
	        var counter = [];
	        for (var i = 0; i < count; i++) {
	            counter.push(i);
	        }
	        return async.mapSeries(counter, iterator, callback);
	    };

	    async.compose = function (/* functions... */) {
	        var fns = Array.prototype.reverse.call(arguments);
	        return function () {
	            var that = this;
	            var args = Array.prototype.slice.call(arguments);
	            var callback = args.pop();
	            async.reduce(fns, args, function (newargs, fn, cb) {
	                fn.apply(that, newargs.concat([function () {
	                    var err = arguments[0];
	                    var nextargs = Array.prototype.slice.call(arguments, 1);
	                    cb(err, nextargs);
	                }]))
	            },
	            function (err, results) {
	                callback.apply(that, [err].concat(results));
	            });
	        };
	    };

	    var _applyEach = function (eachfn, fns /*args...*/) {
	        var go = function () {
	            var that = this;
	            var args = Array.prototype.slice.call(arguments);
	            var callback = args.pop();
	            return eachfn(fns, function (fn, cb) {
	                fn.apply(that, args.concat([cb]));
	            },
	            callback);
	        };
	        if (arguments.length > 2) {
	            var args = Array.prototype.slice.call(arguments, 2);
	            return go.apply(this, args);
	        }
	        else {
	            return go;
	        }
	    };
	    async.applyEach = doParallel(_applyEach);
	    async.applyEachSeries = doSeries(_applyEach);

	    async.forever = function (fn, callback) {
	        function next(err) {
	            if (err) {
	                if (callback) {
	                    return callback(err);
	                }
	                throw err;
	            }
	            fn(next);
	        }
	        next();
	    };

	    // AMD / RequireJS
	    if (true) {
	        (__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = (function () {
	            return async;
	        }.apply(null, __WEBPACK_AMD_DEFINE_ARRAY__)), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	    }
	    // Node.js
	    else if (typeof module !== 'undefined' && module.exports) {
	        module.exports = async;
	    }
	    // included directly via <script> tag
	    else {
	        root.async = async;
	    }

	}());
	
	/* WEBPACK VAR INJECTION */}.call(exports, require, require(15)))

/***/ },

/***/ 115:
/***/ function(module, exports, require) {

	module.exports = require(123);

/***/ },

/***/ 116:
/***/ function(module, exports, require) {

	module.exports = require(122);

/***/ },

/***/ 117:
/***/ function(module, exports, require) {

	/* WEBPACK VAR INJECTION */(function(require, Buffer) {/*
	 * rm - Feb 2011
	 * ctype.js
	 *
	 * This module provides a simple abstraction towards reading and writing
	 * different types of binary data. It is designed to use ctio.js and provide a
	 * richer and more expressive API on top of it.
	 *
	 * By default we support the following as built in basic types:
	 *	int8_t
	 *	int16_t
	 *	int32_t
	 *	uint8_t
	 *	uint16_t
	 *	uint32_t
	 *	uint64_t
	 *	float
	 *	double
	 *	char
	 *	char[]
	 *
	 * Each type is returned as a Number, with the exception of char and char[]
	 * which are returned as Node Buffers. A char is considered a uint8_t.
	 *
	 * Requests to read and write data are specified as an array of JSON objects.
	 * This is also the same way that one declares structs. Even if just a single
	 * value is requested, it must be done as a struct. The array order determines
	 * the order that we try and read values. Each entry has the following format
	 * with values marked with a * being optional.
	 *
	 * { key: { type: /type/, value*: /value/, offset*: /offset/ }
	 *
	 * If offset is defined, we lseek(offset, SEEK_SET) before reading the next
	 * value. Value is defined when we're writing out data, otherwise it's ignored.
	 *
	 */

	var mod_ctf = require(124);
	var mod_ctio = require(125);
	var mod_assert = require(67);

	/*
	 * This is the set of basic types that we support.
	 *
	 *	read		The function to call to read in a value from a buffer
	 *
	 *	write		The function to call to write a value to a buffer
	 *
	 */
	var deftypes = {
	    'uint8_t':  { read: ctReadUint8, write: ctWriteUint8 },
	    'uint16_t': { read: ctReadUint16, write: ctWriteUint16 },
	    'uint32_t': { read: ctReadUint32, write: ctWriteUint32 },
	    'uint64_t': { read: ctReadUint64, write: ctWriteUint64 },
	    'int8_t': { read: ctReadSint8, write: ctWriteSint8 },
	    'int16_t': { read: ctReadSint16, write: ctWriteSint16 },
	    'int32_t': { read: ctReadSint32, write: ctWriteSint32 },
	    'int64_t': { read: ctReadSint64, write: ctWriteSint64 },
	    'float': { read: ctReadFloat, write: ctWriteFloat },
	    'double': { read: ctReadDouble, write: ctWriteDouble },
	    'char': { read: ctReadChar, write: ctWriteChar },
	    'char[]': { read: ctReadCharArray, write: ctWriteCharArray }
	};

	/*
	 * The following are wrappers around the CType IO low level API. They encode
	 * knowledge about the size and return something in the expected format.
	 */
	function ctReadUint8(endian, buffer, offset)
	{
		var val = mod_ctio.ruint8(buffer, endian, offset);
		return ({ value: val, size: 1 });
	}

	function ctReadUint16(endian, buffer, offset)
	{
		var val = mod_ctio.ruint16(buffer, endian, offset);
		return ({ value: val, size: 2 });
	}

	function ctReadUint32(endian, buffer, offset)
	{
		var val = mod_ctio.ruint32(buffer, endian, offset);
		return ({ value: val, size: 4 });
	}

	function ctReadUint64(endian, buffer, offset)
	{
		var val = mod_ctio.ruint64(buffer, endian, offset);
		return ({ value: val, size: 8 });
	}

	function ctReadSint8(endian, buffer, offset)
	{
		var val = mod_ctio.rsint8(buffer, endian, offset);
		return ({ value: val, size: 1 });
	}

	function ctReadSint16(endian, buffer, offset)
	{
		var val = mod_ctio.rsint16(buffer, endian, offset);
		return ({ value: val, size: 2 });
	}

	function ctReadSint32(endian, buffer, offset)
	{
		var val = mod_ctio.rsint32(buffer, endian, offset);
		return ({ value: val, size: 4 });
	}

	function ctReadSint64(endian, buffer, offset)
	{
		var val = mod_ctio.rsint64(buffer, endian, offset);
		return ({ value: val, size: 8 });
	}

	function ctReadFloat(endian, buffer, offset)
	{
		var val = mod_ctio.rfloat(buffer, endian, offset);
		return ({ value: val, size: 4 });
	}

	function ctReadDouble(endian, buffer, offset)
	{
		var val = mod_ctio.rdouble(buffer, endian, offset);
		return ({ value: val, size: 8 });
	}

	/*
	 * Reads a single character into a node buffer
	 */
	function ctReadChar(endian, buffer, offset)
	{
		var res = new Buffer(1);
		res[0] = mod_ctio.ruint8(buffer, endian, offset);
		return ({ value: res, size: 1 });
	}

	function ctReadCharArray(length, endian, buffer, offset)
	{
		var ii;
		var res = new Buffer(length);

		for (ii = 0; ii < length; ii++)
			res[ii] = mod_ctio.ruint8(buffer, endian, offset + ii);

		return ({ value: res, size: length });
	}

	function ctWriteUint8(value, endian, buffer, offset)
	{
		mod_ctio.wuint8(value, endian, buffer, offset);
		return (1);
	}

	function ctWriteUint16(value, endian, buffer, offset)
	{
		mod_ctio.wuint16(value, endian, buffer, offset);
		return (2);
	}

	function ctWriteUint32(value, endian, buffer, offset)
	{
		mod_ctio.wuint32(value, endian, buffer, offset);
		return (4);
	}

	function ctWriteUint64(value, endian, buffer, offset)
	{
		mod_ctio.wuint64(value, endian, buffer, offset);
		return (8);
	}

	function ctWriteSint8(value, endian, buffer, offset)
	{
		mod_ctio.wsint8(value, endian, buffer, offset);
		return (1);
	}

	function ctWriteSint16(value, endian, buffer, offset)
	{
		mod_ctio.wsint16(value, endian, buffer, offset);
		return (2);
	}

	function ctWriteSint32(value, endian, buffer, offset)
	{
		mod_ctio.wsint32(value, endian, buffer, offset);
		return (4);
	}

	function ctWriteSint64(value, endian, buffer, offset)
	{
		mod_ctio.wsint64(value, endian, buffer, offset);
		return (8);
	}

	function ctWriteFloat(value, endian, buffer, offset)
	{
		mod_ctio.wfloat(value, endian, buffer, offset);
		return (4);
	}

	function ctWriteDouble(value, endian, buffer, offset)
	{
		mod_ctio.wdouble(value, endian, buffer, offset);
		return (8);
	}

	/*
	 * Writes a single character into a node buffer
	 */
	function ctWriteChar(value, endian, buffer, offset)
	{
		if (!(value instanceof Buffer))
			throw (new Error('Input must be a buffer'));

		mod_ctio.ruint8(value[0], endian, buffer, offset);
		return (1);
	}

	/*
	 * We're going to write 0s into the buffer if the string is shorter than the
	 * length of the array.
	 */
	function ctWriteCharArray(value, length, endian, buffer, offset)
	{
		var ii;

		if (!(value instanceof Buffer))
			throw (new Error('Input must be a buffer'));

		if (value.length > length)
			throw (new Error('value length greater than array length'));

		for (ii = 0; ii < value.length && ii < length; ii++)
			mod_ctio.wuint8(value[ii], endian, buffer, offset + ii);

		for (; ii < length; ii++)
			mod_ctio.wuint8(0, endian, offset + ii);


		return (length);
	}

	/*
	 * Each parser has their own set of types. We want to make sure that they each
	 * get their own copy as they may need to modify it.
	 */
	function ctGetBasicTypes()
	{
		var ret = {};
		var key;
		for (key in deftypes)
			ret[key] = deftypes[key];

		return (ret);
	}

	/*
	 * Given a string in the form of type[length] we want to split this into an
	 * object that extracts that information. We want to note that we could possibly
	 * have nested arrays so this should only check the furthest one. It may also be
	 * the case that we have no [] pieces, in which case we just return the current
	 * type.
	 */
	function ctParseType(str)
	{
		var begInd, endInd;
		var type, len;
		if (typeof (str) != 'string')
			throw (new Error('type must be a Javascript string'));

		endInd = str.lastIndexOf(']');
		if (endInd == -1) {
			if (str.lastIndexOf('[') != -1)
				throw (new Error('found invalid type with \'[\' but ' +
				    'no corresponding \']\''));

			return ({ type: str });
		}

		begInd = str.lastIndexOf('[');
		if (begInd == -1)
			throw (new Error('found invalid type with \']\' but ' +
			    'no corresponding \'[\''));

		if (begInd >= endInd)
			throw (new Error('malformed type, \']\' appears before \'[\''));

		type = str.substring(0, begInd);
		len = str.substring(begInd + 1, endInd);

		return ({ type: type, len: len });
	}

	/*
	 * Given a request validate that all of the fields for it are valid and make
	 * sense. This includes verifying the following notions:
	 *  - Each type requested is present in types
	 *  - Only allow a name for a field to be specified once
	 *  - If an array is specified, validate that the requested field exists and
	 *    comes before it.
	 *  - If fields is defined, check that each entry has the occurrence of field
	 */
	function ctCheckReq(def, types, fields)
	{
		var ii, jj;
		var req, keys, key;
		var found = {};

		if (!(def instanceof Array))
			throw (new Error('definition is not an array'));

		if (def.length === 0)
			throw (new Error('definition must have at least one element'));

		for (ii = 0; ii < def.length; ii++) {
			req = def[ii];
			if (!(req instanceof Object))
				throw (new Error('definition must be an array of' +
				    'objects'));

			keys = Object.keys(req);
			if (keys.length != 1)
				throw (new Error('definition entry must only have ' +
				    'one key'));

			if (keys[0] in found)
				throw (new Error('Specified name already ' +
				    'specified: ' + keys[0]));

			if (!('type' in req[keys[0]]))
				throw (new Error('missing required type definition'));

			key = ctParseType(req[keys[0]]['type']);

			/*
			 * We may have nested arrays, we need to check the validity of
			 * the types until the len field is undefined in key. However,
			 * each time len is defined we need to verify it is either an
			 * integer or corresponds to an already seen key.
			 */
			while (key['len'] !== undefined) {
				if (isNaN(parseInt(key['len'], 10))) {
					if (!(key['len'] in found))
						throw (new Error('Given an array ' +
						    'length without a matching type'));

				}

				key = ctParseType(key['type']);
			}

			/* Now we can validate if the type is valid */
			if (!(key['type'] in types))
				throw (new Error('type not found or typdefed: ' +
				    key['type']));

			/* Check for any required fields */
			if (fields !== undefined) {
				for (jj = 0; jj < fields.length; jj++) {
					if (!(fields[jj] in req[keys[0]]))
						throw (new Error('Missing required ' +
						    'field: ' + fields[jj]));
				}
			}

			found[keys[0]] = true;
		}
	}


	/*
	 * Create a new instance of the parser. Each parser has its own store of
	 * typedefs and endianness. Conf is an object with the following required
	 * values:
	 *
	 *	endian		Either 'big' or 'little' do determine the endianness we
	 *			want to read from or write to.
	 *
	 * And the following optional values:
	 *
	 * 	char-type	Valid options here are uint8 and int8. If uint8 is
	 * 			specified this changes the default behavior of a single
	 * 			char from being a buffer of a single character to being
	 * 			a uint8_t. If int8, it becomes an int8_t instead.
	 */
	function CTypeParser(conf)
	{
		if (!conf) throw (new Error('missing required argument'));

		if (!('endian' in conf))
			throw (new Error('missing required endian value'));

		if (conf['endian'] != 'big' && conf['endian'] != 'little')
			throw (new Error('Invalid endian type'));

		if ('char-type' in conf && (conf['char-type'] != 'uint8' &&
		    conf['char-type'] != 'int8'))
			throw (new Error('invalid option for char-type: ' +
			    conf['char-type']));

		this.endian = conf['endian'];
		this.types = ctGetBasicTypes();

		/*
		 * There may be a more graceful way to do this, but this will have to
		 * serve.
		 */
		if ('char-type' in conf && conf['char-type'] == 'uint8')
			this.types['char'] = this.types['uint8_t'];

		if ('char-type' in conf && conf['char-type'] == 'int8')
			this.types['char'] = this.types['int8_t'];
	}

	/*
	 * Sets the current endian value for the Parser. If the value is not valid,
	 * throws an Error.
	 *
	 *	endian		Either 'big' or 'little' do determine the endianness we
	 *			want to read from or write to.
	 *
	 */
	CTypeParser.prototype.setEndian = function (endian)
	{
		if (endian != 'big' && endian != 'little')
			throw (new Error('invalid endian type, must be big or ' +
			    'little'));

		this.endian = endian;
	};

	/*
	 * Returns the current value of the endian value for the parser.
	 */
	CTypeParser.prototype.getEndian = function ()
	{
		return (this.endian);
	};

	/*
	 * A user has requested to add a type, let us honor their request. Yet, if their
	 * request doth spurn us, send them unto the Hells which Dante describes.
	 *
	 * 	name		The string for the type definition we're adding
	 *
	 *	value		Either a string that is a type/array name or an object
	 *			that describes a struct.
	 */
	CTypeParser.prototype.typedef = function (name, value)
	{
		var type;

		if (name === undefined)
			throw (new (Error('missing required typedef argument: name')));

		if (value === undefined)
			throw (new (Error('missing required typedef argument: value')));

		if (typeof (name) != 'string')
			throw (new (Error('the name of a type must be a string')));

		type = ctParseType(name);

		if (type['len'] !== undefined)
			throw (new Error('Cannot have an array in the typedef name'));

		if (name in this.types)
			throw (new Error('typedef name already present: ' + name));

		if (typeof (value) != 'string' && !(value instanceof Array))
			throw (new Error('typedef value must either be a string or ' +
			    'struct'));

		if (typeof (value) == 'string') {
			type = ctParseType(value);
			if (type['len'] !== undefined) {
				if (isNaN(parseInt(type['len'], 10)))
					throw (new (Error('typedef value must use ' +
					    'fixed size array when outside of a ' +
					    'struct')));
			}

			this.types[name] = value;
		} else {
			/* We have a struct, validate it */
			ctCheckReq(value, this.types);
			this.types[name] = value;
		}
	};

	/*
	 * Include all of the typedefs, but none of the built in types. This should be
	 * treated as read-only.
	 */
	CTypeParser.prototype.lstypes = function ()
	{
		var key;
		var ret = {};

		for (key in this.types) {
			if (key in deftypes)
				continue;
			ret[key] = this.types[key];
		}

		return (ret);
	};

	/*
	 * Given a type string that may have array types that aren't numbers, try and
	 * fill them in from the values object. The object should be of the format where
	 * indexing into it should return a number for that type.
	 *
	 *	str		The type string
	 *
	 *	values		An object that can be used to fulfill type information
	 */
	function ctResolveArray(str, values)
	{
		var ret = '';
		var type = ctParseType(str);

		while (type['len'] !== undefined) {
			if (isNaN(parseInt(type['len'], 10))) {
				if (typeof (values[type['len']]) != 'number')
					throw (new Error('cannot sawp in non-number ' +
					    'for array value'));
				ret = '[' + values[type['len']] + ']' + ret;
			} else {
				ret = '[' + type['len'] + ']' + ret;
			}
			type = ctParseType(type['type']);
		}

		ret = type['type'] + ret;

		return (ret);
	}

	/*
	 * [private] Either the typedef resolves to another type string or to a struct.
	 * If it resolves to a struct, we just pass it off to read struct. If not, we
	 * can just pass it off to read entry.
	 */
	CTypeParser.prototype.resolveTypedef = function (type, dispatch, buffer,
	    offset, value)
	{
		var pt;

		mod_assert.ok(type in this.types);
		if (typeof (this.types[type]) == 'string') {
			pt = ctParseType(this.types[type]);
			if (dispatch == 'read')
				return (this.readEntry(pt, buffer, offset));
			else if (dispatch == 'write')
				return (this.writeEntry(value, pt, buffer, offset));
			else
				throw (new Error('invalid dispatch type to ' +
				    'resolveTypedef'));
		} else {
			if (dispatch == 'read')
				return (this.readStruct(this.types[type], buffer,
				    offset));
			else if (dispatch == 'write')
				return (this.writeStruct(value, this.types[type],
				    buffer, offset));
			else
				throw (new Error('invalid dispatch type to ' +
				    'resolveTypedef'));
		}

	};

	/*
	 * [private] Try and read in the specific entry.
	 */
	CTypeParser.prototype.readEntry = function (type, buffer, offset)
	{
		var parse, len;

		/*
		 * Because we want to special case char[]s this is unfortunately
		 * a bit uglier than it really should be. We want to special
		 * case char[]s so that we return a node buffer, thus they are a
		 * first class type where as all other arrays just call into a
		 * generic array routine which calls their data-specific routine
		 * the specified number of times.
		 *
		 * The valid dispatch options we have are:
		 *  - Array and char => char[] handler
		 *  - Generic array handler
		 *  - Generic typedef handler
		 *  - Basic type handler
		 */
		if (type['len'] !== undefined) {
			len = parseInt(type['len'], 10);
			if (isNaN(len))
				throw (new Error('somehow got a non-numeric length'));

			if (type['type'] == 'char')
				parse = this.types['char[]']['read'](len,
				    this.endian, buffer, offset);
			else
				parse = this.readArray(type['type'],
				    len, buffer, offset);
		} else {
			if (type['type'] in deftypes)
				parse = this.types[type['type']]['read'](this.endian,
				    buffer, offset);
			else
				parse = this.resolveTypedef(type['type'], 'read',
				    buffer, offset);
		}

		return (parse);
	};

	/*
	 * [private] Read an array of data
	 */
	CTypeParser.prototype.readArray = function (type, length, buffer, offset)
	{
		var ii, ent, pt;
		var baseOffset = offset;
		var ret = new Array(length);
		pt = ctParseType(type);

		for (ii = 0; ii < length; ii++) {
			ent = this.readEntry(pt, buffer, offset);
			offset += ent['size'];
			ret[ii] = ent['value'];
		}

		return ({ value: ret, size: offset - baseOffset });
	};

	/*
	 * [private] Read a single struct in.
	 */
	CTypeParser.prototype.readStruct = function (def, buffer, offset)
	{
		var parse, ii, type, entry, key;
		var baseOffset = offset;
		var ret = {};

		/* Walk it and handle doing what's necessary */
		for (ii = 0; ii < def.length; ii++) {
			key = Object.keys(def[ii])[0];
			entry = def[ii][key];

			/* Resolve all array values */
			type = ctParseType(ctResolveArray(entry['type'], ret));

			if ('offset' in entry)
				offset = baseOffset + entry['offset'];

			parse = this.readEntry(type, buffer, offset);

			offset += parse['size'];
			ret[key] = parse['value'];
		}

		return ({ value: ret, size: (offset-baseOffset)});
	};

	/*
	 * This is what we were born to do. We read the data from a buffer and return it
	 * in an object whose keys match the values from the object.
	 *
	 *	def		The array definition of the data to read in
	 *
	 *	buffer		The buffer to read data from
	 *
	 *	offset		The offset to start writing to
	 *
	 * Returns an object where each key corresponds to an entry in def and the value
	 * is the read value.
	 */
	CTypeParser.prototype.readData = function (def, buffer, offset)
	{
		/* Sanity check for arguments */
		if (def === undefined)
			throw (new Error('missing definition for what we should be' +
			    'parsing'));

		if (buffer === undefined)
			throw (new Error('missing buffer for what we should be ' +
			    'parsing'));

		if (offset === undefined)
			throw (new Error('missing offset for what we should be ' +
			    'parsing'));

		/* Sanity check the object definition */
		ctCheckReq(def, this.types);

		return (this.readStruct(def, buffer, offset)['value']);
	};

	/*
	 * [private] Write out an array of data
	 */
	CTypeParser.prototype.writeArray = function (value, type, length, buffer,
	    offset)
	{
		var ii, pt;
		var baseOffset = offset;
		if (!(value instanceof Array))
			throw (new Error('asked to write an array, but value is not ' +
			    'an array'));

		if (value.length != length)
			throw (new Error('asked to write array of length ' + length +
			    ' but that does not match value length: ' + value.length));

		pt = ctParseType(type);
		for (ii = 0; ii < length; ii++)
			offset += this.writeEntry(value[ii], pt, buffer, offset);

		return (offset - baseOffset);
	};

	/*
	 * [private] Write the specific entry
	 */
	CTypeParser.prototype.writeEntry = function (value, type, buffer, offset)
	{
		var len, ret;

		if (type['len'] !== undefined) {
			len = parseInt(type['len'], 10);
			if (isNaN(len))
				throw (new Error('somehow got a non-numeric length'));

			if (type['type'] == 'char')
				ret = this.types['char[]']['write'](value, len,
				    this.endian, buffer, offset);
			else
				ret = this.writeArray(value, type['type'],
				    len, buffer, offset);
		} else {
			if (type['type'] in deftypes)
				ret = this.types[type['type']]['write'](value,
				    this.endian, buffer, offset);
			else
				ret = this.resolveTypedef(type['type'], 'write',
				    buffer, offset, value);
		}

		return (ret);
	};

	/*
	 * [private] Write a single struct out.
	 */
	CTypeParser.prototype.writeStruct = function (value, def, buffer, offset)
	{
		var ii, entry, type, key;
		var baseOffset = offset;
		var vals = {};

		for (ii = 0; ii < def.length; ii++) {
			key = Object.keys(def[ii])[0];
			entry = def[ii][key];

			type = ctParseType(ctResolveArray(entry['type'], vals));

			if ('offset' in entry)
				offset = baseOffset + entry['offset'];

			offset += this.writeEntry(value[ii], type, buffer, offset);
			/* Now that we've written it out, we can use it for arrays */
			vals[key] = value[ii];
		}

		return (offset);
	};

	/*
	 * Unfortunately, we're stuck with the sins of an initial poor design. Because
	 * of that, we are going to have to support the old way of writing data via
	 * writeData. There we insert the values that you want to write into the
	 * definition. A little baroque. Internally, we use the new model. So we need to
	 * just get those values out of there. But to maintain the principle of least
	 * surprise, we're not going to modify the input data.
	 */
	function getValues(def)
	{
		var ii, out, key;
		out = [];
		for (ii = 0; ii < def.length; ii++) {
			key = Object.keys(def[ii])[0];
			mod_assert.ok('value' in def[ii][key]);
			out.push(def[ii][key]['value']);
		}

		return (out);
	}

	/*
	 * This is the second half of what we were born to do, write out the data
	 * itself. Historically this function required you to put your values in the
	 * definition section. This was not the smartest thing to do and a bit of an
	 * oversight to be honest. As such, this function now takes a values argument.
	 * If values is non-null and non-undefined, it will be used to determine the
	 * values. This means that the old method is still supported, but is no longer
	 * acceptable.
	 *
	 *	def		The array definition of the data to write out with
	 *			values
	 *
	 *	buffer		The buffer to write to
	 *
	 *	offset		The offset in the buffer to write to
	 *
	 *	values		An array of values to write.
	 */
	CTypeParser.prototype.writeData = function (def, buffer, offset, values)
	{
		var hv;

		if (def === undefined)
			throw (new Error('missing definition for what we should be' +
			    'parsing'));

		if (buffer === undefined)
			throw (new Error('missing buffer for what we should be ' +
			    'parsing'));

		if (offset === undefined)
			throw (new Error('missing offset for what we should be ' +
			    'parsing'));

		hv = (values != null && values != undefined);
		if (hv) {
			if (!Array.isArray(values))
				throw (new Error('missing values for writing'));
			ctCheckReq(def, this.types);
		} else {
			ctCheckReq(def, this.types, [ 'value' ]);
		}

		this.writeStruct(hv ? values : getValues(def), def, buffer, offset);
	};

	/*
	 * Functions to go to and from 64 bit numbers in a way that is compatible with
	 * Javascript limitations. There are two sets. One where the user is okay with
	 * an approximation and one where they are definitely not okay with an
	 * approximation.
	 */

	/*
	 * Attempts to convert an array of two integers returned from rsint64 / ruint64
	 * into an absolute 64 bit number. If however the value would exceed 2^52 this
	 * will instead throw an error. The mantissa in a double is a 52 bit number and
	 * rather than potentially give you a value that is an approximation this will
	 * error. If you would rather an approximation, please see toApprox64.
	 *
	 *	val		An array of two 32-bit integers
	 */
	function toAbs64(val)
	{
		if (val === undefined)
			throw (new Error('missing required arg: value'));

		if (!Array.isArray(val))
			throw (new Error('value must be an array'));

		if (val.length != 2)
			throw (new Error('value must be an array of length 2'));

		/* We have 20 bits worth of precision in this range */
		if (val[0] >= 0x100000)
			throw (new Error('value would become approximated'));

		return (val[0] * Math.pow(2, 32) + val[1]);
	}

	/*
	 * Will return the 64 bit value as returned in an array from rsint64 / ruint64
	 * to a value as close as it can. Note that Javascript stores all numbers as a
	 * double and the mantissa only has 52 bits. Thus this version may approximate
	 * the value.
	 *
	 *	val		An array of two 32-bit integers
	 */
	function toApprox64(val)
	{
		if (val === undefined)
			throw (new Error('missing required arg: value'));

		if (!Array.isArray(val))
			throw (new Error('value must be an array'));

		if (val.length != 2)
			throw (new Error('value must be an array of length 2'));

		return (Math.pow(2, 32) * val[0] + val[1]);
	}

	function parseCTF(json, conf)
	{
		var ctype = new CTypeParser(conf);
		mod_ctf.ctfParseJson(json, ctype);

		return (ctype);
	}

	/*
	 * Export the few things we actually want to. Currently this is just the CType
	 * Parser and ctio.
	 */
	exports.Parser = CTypeParser;
	exports.toAbs64 = toAbs64;
	exports.toApprox64 = toApprox64;

	exports.parseCTF = parseCTF;

	exports.ruint8 = mod_ctio.ruint8;
	exports.ruint16 = mod_ctio.ruint16;
	exports.ruint32 = mod_ctio.ruint32;
	exports.ruint64 = mod_ctio.ruint64;
	exports.wuint8 = mod_ctio.wuint8;
	exports.wuint16 = mod_ctio.wuint16;
	exports.wuint32 = mod_ctio.wuint32;
	exports.wuint64 = mod_ctio.wuint64;

	exports.rsint8 = mod_ctio.rsint8;
	exports.rsint16 = mod_ctio.rsint16;
	exports.rsint32 = mod_ctio.rsint32;
	exports.rsint64 = mod_ctio.rsint64;
	exports.wsint8 = mod_ctio.wsint8;
	exports.wsint16 = mod_ctio.wsint16;
	exports.wsint32 = mod_ctio.wsint32;
	exports.wsint64 = mod_ctio.wsint64;

	exports.rfloat = mod_ctio.rfloat;
	exports.rdouble = mod_ctio.rdouble;
	exports.wfloat = mod_ctio.wfloat;
	exports.wdouble = mod_ctio.wdouble;
	
	/* WEBPACK VAR INJECTION */}.call(exports, require, require(50).Buffer))

/***/ },

/***/ 118:
/***/ function(module, exports, require) {

	// Copyright 2011 Mark Cavage <mcavage@gmail.com> All rights reserved.

	// If you have no idea what ASN.1 or BER is, see this:
	// ftp://ftp.rsa.com/pub/pkcs/ascii/layman.asc

	var Ber = require(126);



	///--- Exported API

	module.exports = {

	  Ber: Ber,

	  BerReader: Ber.Reader,

	  BerWriter: Ber.Writer

	};


/***/ },

/***/ 119:
/***/ function(module, exports, require) {

	/* WEBPACK VAR INJECTION */(function(require, process, Buffer) {// Copyright (c) 2012, Mark Cavage. All rights reserved.

	var assert = require(67);
	var Stream = require(71).Stream;
	var util = require(17);



	///--- Globals

	var NDEBUG = process.env.NODE_NDEBUG || false;



	///--- Messages

	var ARRAY_TYPE_REQUIRED = '%s ([%s]) required';
	var TYPE_REQUIRED = '%s (%s) is required';



	///--- Internal

	function capitalize(str) {
	        return (str.charAt(0).toUpperCase() + str.slice(1));
	}

	function uncapitalize(str) {
	        return (str.charAt(0).toLowerCase() + str.slice(1));
	}

	function _() {
	        return (util.format.apply(util, arguments));
	}


	function _assert(arg, type, name, stackFunc) {
	        if (!NDEBUG) {
	                name = name || type;
	                stackFunc = stackFunc || _assert.caller;
	                var t = typeof (arg);

	                if (t !== type) {
	                        throw new assert.AssertionError({
	                                message: _(TYPE_REQUIRED, name, type),
	                                actual: t,
	                                expected: type,
	                                operator: '===',
	                                stackStartFunction: stackFunc
	                        });
	                }
	        }
	}



	///--- API

	function array(arr, type, name) {
	        if (!NDEBUG) {
	                name = name || type;

	                if (!Array.isArray(arr)) {
	                        throw new assert.AssertionError({
	                                message: _(ARRAY_TYPE_REQUIRED, name, type),
	                                actual: typeof (arr),
	                                expected: 'array',
	                                operator: 'Array.isArray',
	                                stackStartFunction: array.caller
	                        });
	                }

	                for (var i = 0; i < arr.length; i++) {
	                        _assert(arr[i], type, name, array);
	                }
	        }
	}


	function bool(arg, name) {
	        _assert(arg, 'boolean', name, bool);
	}


	function buffer(arg, name) {
	        if (!Buffer.isBuffer(arg)) {
	                throw new assert.AssertionError({
	                        message: _(TYPE_REQUIRED, name, type),
	                        actual: typeof (arg),
	                        expected: 'buffer',
	                        operator: 'Buffer.isBuffer',
	                        stackStartFunction: buffer
	                });
	        }
	}


	function func(arg, name) {
	        _assert(arg, 'function', name);
	}


	function number(arg, name) {
	        _assert(arg, 'number', name);
	}


	function object(arg, name) {
	        _assert(arg, 'object', name);
	}


	function stream(arg, name) {
	        if (!(arg instanceof Stream)) {
	                throw new assert.AssertionError({
	                        message: _(TYPE_REQUIRED, name, type),
	                        actual: typeof (arg),
	                        expected: 'Stream',
	                        operator: 'instanceof',
	                        stackStartFunction: buffer
	                });
	        }
	}


	function string(arg, name) {
	        _assert(arg, 'string', name);
	}



	///--- Exports

	module.exports = {
	        bool: bool,
	        buffer: buffer,
	        func: func,
	        number: number,
	        object: object,
	        stream: stream,
	        string: string
	};


	Object.keys(module.exports).forEach(function (k) {
	        if (k === 'buffer')
	                return;

	        var name = 'arrayOf' + capitalize(k);

	        if (k === 'bool')
	                k = 'boolean';
	        if (k === 'func')
	                k = 'function';
	        module.exports[name] = function (arg, name) {
	                array(arg, k, name);
	        };
	});

	Object.keys(module.exports).forEach(function (k) {
	        var _name = 'optional' + capitalize(k);
	        var s = uncapitalize(k.replace('arrayOf', ''));
	        if (s === 'bool')
	                s = 'boolean';
	        if (s === 'func')
	                s = 'function';

	        if (k.indexOf('arrayOf') !== -1) {
	          module.exports[_name] = function (arg, name) {
	                  if (!NDEBUG && arg !== undefined) {
	                          array(arg, s, name);
	                  }
	          };
	        } else {
	          module.exports[_name] = function (arg, name) {
	                  if (!NDEBUG && arg !== undefined) {
	                          _assert(arg, s, name);
	                  }
	          };
	        }
	});


	// Reexport built-in assertions
	Object.keys(assert).forEach(function (k) {
	        if (k === 'AssertionError') {
	                module.exports[k] = assert[k];
	                return;
	        }

	        module.exports[k] = function () {
	                if (!NDEBUG) {
	                        assert[k].apply(assert[k], arguments);
	                }
	        };
	});
	
	/* WEBPACK VAR INJECTION */}.call(exports, require, require(15), require(50).Buffer))

/***/ },

/***/ 120:
/***/ function(module, exports, require) {

	module.exports = require(128);

/***/ },

/***/ 121:
/***/ function(module, exports, require) {

	module.exports = require(129);

/***/ },

/***/ 122:
/***/ function(module, exports, require) {

	/* WEBPACK VAR INJECTION */(function(require, Buffer, process) {// Load modules

	var Dgram = require((function webpackMissingModule() { throw new Error("Cannot find module \"dgram\""); }()));
	var Dns = require((function webpackMissingModule() { throw new Error("Cannot find module \"dns\""); }()));
	var Hoek = require(120);


	// Declare internals

	var internals = {};


	exports.time = function (options, callback) {

	    if (arguments.length !== 2) {
	        callback = arguments[0];
	        options = {};
	    }

	    var settings = Hoek.clone(options);
	    settings.host = settings.host || 'pool.ntp.org';
	    settings.port = settings.port || 123;
	    settings.resolveReference = settings.resolveReference || false;

	    // Declare variables used by callback

	    var timeoutId = 0;
	    var sent = 0;

	    // Ensure callback is only called once

	    var isFinished = false;
	    var finish = function (err, result) {

	        if (timeoutId) {
	            clearTimeout(timeoutId);
	            timeoutId = 0;
	        }

	        if (!isFinished) {
	            isFinished = true;
	            socket.removeAllListeners();
	            socket.close();
	            return callback(err, result);
	        }
	    };

	    // Create UDP socket

	    var socket = Dgram.createSocket('udp4');

	    socket.once('error', function (err) {

	        return finish(err);
	    });

	    // Listen to incoming messages

	    socket.on('message', function (buffer, rinfo) {

	        var received = Date.now();

	        var message = new internals.NtpMessage(buffer);
	        if (!message.isValid) {
	            return finish(new Error('Invalid server response'), message);
	        }

	        if (message.originateTimestamp !== sent) {
	            return finish(new Error('Wrong originate timestamp'), message);
	        }

	        // Timestamp Name          ID   When Generated
	        // ------------------------------------------------------------
	        // Originate Timestamp     T1   time request sent by client
	        // Receive Timestamp       T2   time request received by server
	        // Transmit Timestamp      T3   time reply sent by server
	        // Destination Timestamp   T4   time reply received by client
	        //
	        // The roundtrip delay d and system clock offset t are defined as:
	        //
	        // d = (T4 - T1) - (T3 - T2)     t = ((T2 - T1) + (T3 - T4)) / 2

	        var T1 = message.originateTimestamp;
	        var T2 = message.receiveTimestamp;
	        var T3 = message.transmitTimestamp;
	        var T4 = received;

	        message.d = (T4 - T1) - (T3 - T2);
	        message.t = ((T2 - T1) + (T3 - T4)) / 2;
	        message.receivedLocally = received;

	        if (!settings.resolveReference ||
	            message.stratum !== 'secondary') {

	            return finish(null, message);
	        }

	        // Resolve reference IP address

	        Dns.reverse(message.referenceId, function (err, domains) {

	            if (!err) {
	                message.referenceHost = domains[0];
	            }

	            return finish(null, message);
	        });
	    });

	    // Set timeout

	    if (settings.timeout) {
	        timeoutId = setTimeout(function () {

	            timeoutId = 0;
	            return finish(new Error('Timeout'));
	        }, settings.timeout);
	    }

	    // Construct NTP message

	    var message = new Buffer(48);
	    for (var i = 0; i < 48; i++) {                      // Zero message
	        message[i] = 0;
	    }

	    message[0] = (0 << 6) + (4 << 3) + (3 << 0)         // Set version number to 4 and Mode to 3 (client)
	    sent = Date.now();
	    internals.fromMsecs(sent, message, 40);               // Set transmit timestamp (returns as originate)

	    // Send NTP request

	    socket.send(message, 0, message.length, settings.port, settings.host, function (err, bytes) {

	        if (err ||
	            bytes !== 48) {

	            return finish(err || new Error('Could not send entire message'));
	        }
	    });
	};


	internals.NtpMessage = function (buffer) {

	    this.isValid = false;

	    // Validate

	    if (buffer.length !== 48) {
	        return;
	    }

	    // Leap indicator

	    var li = (buffer[0] >> 6);
	    switch (li) {
	        case 0: this.leapIndicator = 'no-warning'; break;
	        case 1: this.leapIndicator = 'last-minute-61'; break;
	        case 2: this.leapIndicator = 'last-minute-59'; break;
	        case 3: this.leapIndicator = 'alarm'; break;
	    }

	    // Version

	    var vn = ((buffer[0] & 0x38) >> 3);
	    this.version = vn;

	    // Mode

	    var mode = (buffer[0] & 0x7);
	    switch (mode) {
	        case 1: this.mode = 'symmetric-active'; break;
	        case 2: this.mode = 'symmetric-passive'; break;
	        case 3: this.mode = 'client'; break;
	        case 4: this.mode = 'server'; break;
	        case 5: this.mode = 'broadcast'; break;
	        case 0:
	        case 6:
	        case 7: this.mode = 'reserved'; break;
	    }

	    // Stratum

	    var stratum = buffer[1];
	    if (stratum === 0) {
	        this.stratum = 'death';
	    }
	    else if (stratum === 1) {
	        this.stratum = 'primary';
	    }
	    else if (stratum <= 15) {
	        this.stratum = 'secondary';
	    }
	    else {
	        this.stratum = 'reserved';
	    }

	    // Poll interval (msec)

	    this.pollInterval = Math.round(Math.pow(2, buffer[2])) * 1000;

	    // Precision (msecs)

	    this.precision = Math.pow(2, buffer[3]) * 1000;

	    // Root delay (msecs)

	    var rootDelay = 256 * (256 * (256 * buffer[4] + buffer[5]) + buffer[6]) + buffer[7];
	    this.rootDelay = 1000 * (rootDelay / 0x10000);

	    // Root dispersion (msecs)

	    this.rootDispersion = ((buffer[8] << 8) + buffer[9] + ((buffer[10] << 8) + buffer[11]) / Math.pow(2, 16)) * 1000;

	    // Reference identifier

	    this.referenceId = '';
	    switch (this.stratum) {
	        case 'death':
	        case 'primary':
	            this.referenceId = String.fromCharCode(buffer[12]) + String.fromCharCode(buffer[13]) + String.fromCharCode(buffer[14]) + String.fromCharCode(buffer[15]);
	            break;
	        case 'secondary':
	            this.referenceId = '' + buffer[12] + '.' + buffer[13] + '.' + buffer[14] + '.' + buffer[15];
	            break;
	    }

	    // Reference timestamp

	    this.referenceTimestamp = internals.toMsecs(buffer, 16);

	    // Originate timestamp

	    this.originateTimestamp = internals.toMsecs(buffer, 24);

	    // Receive timestamp

	    this.receiveTimestamp = internals.toMsecs(buffer, 32);

	    // Transmit timestamp

	    this.transmitTimestamp = internals.toMsecs(buffer, 40);

	    // Validate

	    if (this.version === 4 &&
	        this.stratum !== 'reserved' &&
	        this.mode === 'server' &&
	        this.originateTimestamp &&
	        this.receiveTimestamp &&
	        this.transmitTimestamp) {

	        this.isValid = true;
	    }

	    return this;
	};


	internals.toMsecs = function (buffer, offset) {

	    var seconds = 0;
	    var fraction = 0;

	    for (var i = 0; i < 4; ++i) {
	        seconds = (seconds * 256) + buffer[offset + i];
	    }

	    for (i = 4; i < 8; ++i) {
	        fraction = (fraction * 256) + buffer[offset + i];
	    }

	    return ((seconds - 2208988800 + (fraction / Math.pow(2, 32))) * 1000);
	};


	internals.fromMsecs = function (ts, buffer, offset) {

	    var seconds = Math.floor(ts / 1000) + 2208988800;
	    var fraction = Math.round((ts % 1000) / 1000 * Math.pow(2, 32));

	    buffer[offset + 0] = (seconds & 0xFF000000) >> 24;
	    buffer[offset + 1] = (seconds & 0x00FF0000) >> 16;
	    buffer[offset + 2] = (seconds & 0x0000FF00) >> 8;
	    buffer[offset + 3] = (seconds & 0x000000FF);

	    buffer[offset + 4] = (fraction & 0xFF000000) >> 24;
	    buffer[offset + 5] = (fraction & 0x00FF0000) >> 16;
	    buffer[offset + 6] = (fraction & 0x0000FF00) >> 8;
	    buffer[offset + 7] = (fraction & 0x000000FF);
	};


	// Offset singleton

	internals.last = {
	    offset: 0,
	    expires: 0,
	    host: '',
	    port: 0
	};


	exports.offset = function (options, callback) {

	    if (arguments.length !== 2) {
	        callback = arguments[0];
	        options = {};
	    }

	    var now = Date.now();
	    var clockSyncRefresh = options.clockSyncRefresh || 24 * 60 * 60 * 1000;                    // Daily

	    if (internals.last.offset &&
	        internals.last.host === options.host &&
	        internals.last.port === options.port &&
	        now < internals.last.expires) {

	        process.nextTick(function () {
	                
	            callback(null, internals.last.offset);
	        });

	        return;
	    }

	    exports.time(options, function (err, time) {

	        if (err) {
	            return callback(err, 0);
	        }

	        internals.last = {
	            offset: Math.round(time.t),
	            expires: now + clockSyncRefresh,
	            host: options.host,
	            port: options.port
	        };

	        return callback(null, internals.last.offset);
	    });
	};


	// Now singleton

	internals.now = {
	    intervalId: 0
	};


	exports.start = function (options, callback) {

	    if (arguments.length !== 2) {
	        callback = arguments[0];
	        options = {};
	    }

	    if (internals.now.intervalId) {
	        process.nextTick(function () {
	            
	            callback();
	        });
	        
	        return;
	    }

	    exports.offset(options, function (err, offset) {

	        internals.now.intervalId = setInterval(function () {

	            exports.offset(options, function () { });
	        }, options.clockSyncRefresh || 24 * 60 * 60 * 1000);                                // Daily

	        return callback();
	    });
	};


	exports.stop = function () {

	    if (!internals.now.intervalId) {
	        return;
	    }

	    clearInterval(internals.now.intervalId);
	    internals.now.intervalId = 0;
	};


	exports.isLive = function () {

	    return !!internals.now.intervalId;
	};


	exports.now = function () {

	    var now = Date.now();
	    if (!exports.isLive() ||
	        now >= internals.last.expires) {

	        return now;
	    }

	    return now + internals.last.offset;
	};

	
	/* WEBPACK VAR INJECTION */}.call(exports, require, require(50).Buffer, require(15)))

/***/ },

/***/ 123:
/***/ function(module, exports, require) {

	// Load modules

	var Http = require(70);
	var NodeUtil = require(17);
	var Hoek = require(120);


	// Declare internals

	var internals = {};


	exports = module.exports = internals.Boom = function (/* (new Error) or (code, message) */) {

	    var self = this;

	    Hoek.assert(this.constructor === internals.Boom, 'Error must be instantiated using new');

	    Error.call(this);
	    this.isBoom = true;

	    this.response = {
	        code: 0,
	        payload: {},
	        headers: {}
	        // type: 'content-type'
	    };

	    if (arguments[0] instanceof Error) {

	        // Error

	        var error = arguments[0];

	        this.data = error;
	        this.response.code = error.code || 500;
	        if (error.message) {
	            this.message = error.message;
	        }
	    }
	    else {

	        // code, message

	        var code = arguments[0];
	        var message = arguments[1];

	        Hoek.assert(!isNaN(parseFloat(code)) && isFinite(code) && code >= 400, 'First argument must be a number (400+)');

	        this.response.code = code;
	        if (message) {
	            this.message = message;
	        }
	    }

	    // Response format

	    this.reformat();

	    return this;
	};

	NodeUtil.inherits(internals.Boom, Error);


	internals.Boom.prototype.reformat = function () {

	    this.response.payload.code = this.response.code;
	    this.response.payload.error = Http.STATUS_CODES[this.response.code] || 'Unknown';
	    if (this.message) {
	        this.response.payload.message = Hoek.escapeHtml(this.message);         // Prevent XSS from error message
	    }
	};


	// Utilities

	internals.Boom.badRequest = function (message) {

	    return new internals.Boom(400, message);
	};


	internals.Boom.unauthorized = function (message, scheme, attributes) {          // Or function (message, wwwAuthenticate[])

	    var err = new internals.Boom(401, message);

	    if (!scheme) {
	        return err;
	    }

	    var wwwAuthenticate = '';

	    if (typeof scheme === 'string') {

	        // function (message, scheme, attributes)

	        wwwAuthenticate = scheme;
	        if (attributes) {
	            var names = Object.keys(attributes);
	            for (var i = 0, il = names.length; i < il; ++i) {
	                if (i) {
	                    wwwAuthenticate += ',';
	                }

	                var value = attributes[names[i]];
	                if (value === null ||
	                    value === undefined) {              // Value can be zero

	                    value = '';
	                }
	                wwwAuthenticate += ' ' + names[i] + '="' + Hoek.escapeHeaderAttribute(value.toString()) + '"';
	            }
	        }

	        if (message) {
	            if (attributes) {
	                wwwAuthenticate += ',';
	            }
	            wwwAuthenticate += ' error="' + Hoek.escapeHeaderAttribute(message) + '"';
	        }
	        else {
	            err.isMissing = true;
	        }
	    }
	    else {

	        // function (message, wwwAuthenticate[])

	        var wwwArray = scheme;
	        for (var i = 0, il = wwwArray.length; i < il; ++i) {
	            if (i) {
	                wwwAuthenticate += ', ';
	            }

	            wwwAuthenticate += wwwArray[i];
	        }
	    }

	    err.response.headers['WWW-Authenticate'] = wwwAuthenticate;

	    return err;
	};


	internals.Boom.clientTimeout = function (message) {

	    return new internals.Boom(408, message);
	};


	internals.Boom.serverTimeout = function (message) {

	    return new internals.Boom(503, message);
	};


	internals.Boom.forbidden = function (message) {

	    return new internals.Boom(403, message);
	};


	internals.Boom.notFound = function (message) {

	    return new internals.Boom(404, message);
	};


	internals.Boom.internal = function (message, data) {

	    var err = new internals.Boom(500, message);

	    if (data && data.stack) {
	        err.trace = data.stack.split('\n');
	        err.outterTrace = Hoek.displayStack(1);
	    }
	    else {
	        err.trace = Hoek.displayStack(1);
	    }

	    err.data = data;
	    err.response.payload.message = 'An internal server error occurred';                     // Hide actual error from user

	    return err;
	};


	internals.Boom.passThrough = function (code, payload, contentType, headers) {

	    var err = new internals.Boom(500, 'Pass-through');                                      // 500 code is only used to initialize

	    err.data = {
	        code: code,
	        payload: payload,
	        type: contentType
	    };

	    err.response.code = code;
	    err.response.type = contentType;
	    err.response.headers = headers;
	    err.response.payload = payload;

	    return err;
	};




/***/ },

/***/ 124:
/***/ function(module, exports, require) {

	/*
	 * ctf.js
	 *
	 * Understand and parse all of the different JSON formats of CTF data and
	 * translate that into a series of node-ctype friendly pieces. The reason for
	 * the abstraction is to handle different changes in the file format.
	 *
	 * We have to be careful here that we don't end up using a name that is already
	 * a built in type.
	 */
	var mod_assert = require(67);
	var ASSERT = mod_assert.ok;

	var ctf_versions = [ '1.0' ];
	var ctf_entries = [ 'integer', 'float', 'typedef', 'struct' ];
	var ctf_deftypes = [ 'int8_t', 'uint8_t', 'int16_t', 'uint16_t', 'int32_t',
	    'uint32_t', 'float', 'double' ];

	function ctfParseInteger(entry, ctype)
	{
		var name, sign, len, type;

		name = entry['name'];
		if (!('signed' in entry['integer']))
			throw (new Error('Malformed CTF JSON: integer missing ' +
			    'signed value'));


		if (!('length' in entry['integer']))
			throw (new Error('Malformed CTF JSON: integer missing ' +
			    'length value'));

		sign = entry['integer']['signed'];
		len = entry['integer']['length'];
		type = null;

		if (sign && len == 1)
			type = 'int8_t';
		else if (len == 1)
			type = 'uint8_t';
		else if (sign && len == 2)
			type = 'int16_t';
		else if (len == 2)
			type = 'uint16_t';
		else if (sign && len == 4)
			type = 'int32_t';
		else if (len == 4)
			type = 'uint32_t';
		else if (sign && len == 8)
			type = 'int64_t';
		else if (len == 8)
			type = 'uint64_t';

		if (type === null)
			throw (new Error('Malformed CTF JSON: integer has ' +
			    'unsupported length and sign - ' + len + '/' + sign));

		/*
		 * This means that this is the same as one of our built in types. If
		 * that's the case defining it would be an error. So instead of trying
		 * to typedef it, we'll return here.
		 */
		if (name == type)
			return;

		if (name == 'char') {
			ASSERT(type == 'int8_t');
			return;
		}

		ctype.typedef(name, type);
	}

	function ctfParseFloat(entry, ctype)
	{
		var name, len;

		name = entry['name'];
		if (!('length' in entry['float']))
			throw (new Error('Malformed CTF JSON: float missing ' +
			    'length value'));

		len = entry['float']['length'];
		if (len != 4 && len != 8)
			throw (new Error('Malformed CTF JSON: float has invalid ' +
			    'length value'));

		if (len == 4) {
			if (name == 'float')
				return;
			ctype.typedef(name, 'float');
		} else if (len == 8) {
			if (name == 'double')
				return;
			ctype.typedef(name, 'double');
		}
	}

	function ctfParseTypedef(entry, ctype)
	{
		var name, type, ii;

		name = entry['name'];
		if (typeof (entry['typedef']) != 'string')
			throw (new Error('Malformed CTF JSON: typedef value in not ' +
			    'a string'));

		type = entry['typedef'];

		/*
		 * We need to ensure that we're not looking at type that's one of our
		 * built in types. Traditionally in C a uint32_t would be a typedef to
		 * some kind of integer. However, those size types are built ins.
		 */
		for (ii = 0; ii < ctf_deftypes.length; ii++) {
			if (name == ctf_deftypes[ii])
				return;
		}

		ctype.typedef(name, type);
	}

	function ctfParseStruct(entry, ctype)
	{
		var name, type, ii, val, index, member, push;

		member = [];
		if (!Array.isArray(entry['struct']))
			throw (new Error('Malformed CTF JSON: struct value is not ' +
			    'an array'));

		for (ii = 0; ii < entry['struct'].length; ii++) {
			val = entry['struct'][ii];
			if (!('name' in val))
				throw (new Error('Malformed CTF JSON: struct member ' +
				    'missing name'));

			if (!('type' in val))
				throw (new Error('Malformed CTF JSON: struct member ' +
				    'missing type'));

			if (typeof (val['name']) != 'string')
				throw (new Error('Malformed CTF JSON: struct member ' +
				    'name isn\'t a string'));

			if (typeof (val['type']) != 'string')
				throw (new Error('Malformed CTF JSON: struct member ' +
				    'type isn\'t a string'));

			/*
			 * CTF version 2 specifies array names as <type> [<num>] where
			 * as node-ctype does this as <type>[<num>].
			 */
			name = val['name'];
			type = val['type'];
			index = type.indexOf(' [');
			if (index != -1) {
				type = type.substring(0, index) +
				    type.substring(index + 1, type.length);
			}
			push = {};
			push[name] = { 'type': type };
			member.push(push);
		}

		name = entry['name'];
		ctype.typedef(name, member);
	}

	function ctfParseEntry(entry, ctype)
	{
		var ii, found;

		if (!('name' in entry))
			throw (new Error('Malformed CTF JSON: entry missing "name" ' +
			    'section'));

		for (ii = 0; ii < ctf_entries.length; ii++) {
			if (ctf_entries[ii] in entry)
				found++;
		}

		if (found === 0)
			throw (new Error('Malformed CTF JSON: found no entries'));

		if (found >= 2)
			throw (new Error('Malformed CTF JSON: found more than one ' +
			    'entry'));

		if ('integer' in entry) {
			ctfParseInteger(entry, ctype);
			return;
		}

		if ('float' in entry) {
			ctfParseFloat(entry, ctype);
			return;
		}

		if ('typedef' in entry) {
			ctfParseTypedef(entry, ctype);
			return;
		}

		if ('struct' in entry) {
			ctfParseStruct(entry, ctype);
			return;
		}

		ASSERT(false, 'shouldn\'t reach here');
	}

	function ctfParseJson(json, ctype)
	{
		var version, ii;

		ASSERT(json);
		ASSERT(ctype);
		if (!('metadata' in json))
			throw (new Error('Invalid CTF JSON: missing metadata section'));

		if (!('ctf2json_version' in json['metadata']))
			throw (new Error('Invalid CTF JSON: missing ctf2json_version'));

		version = json['metadata']['ctf2json_version'];
		for (ii = 0; ii < ctf_versions.length; ii++) {
			if (ctf_versions[ii] == version)
				break;
		}

		if (ii == ctf_versions.length)
			throw (new Error('Unsuported ctf2json_version: ' + version));

		if (!('data' in json))
			throw (new Error('Invalid CTF JSON: missing data section'));

		if (!Array.isArray(json['data']))
			throw (new Error('Malformed CTF JSON: data section is not ' +
			    'an array'));

		for (ii = 0; ii < json['data'].length; ii++)
			ctfParseEntry(json['data'][ii], ctype);
	}

	exports.ctfParseJson = ctfParseJson;


/***/ },

/***/ 125:
/***/ function(module, exports, require) {

	/*
	 * rm - Feb 2011
	 * ctio.js:
	 *
	 * A simple way to read and write simple ctypes. Of course, as you'll find the
	 * code isn't as simple as it might appear. The following types are currently
	 * supported in big and little endian formats:
	 *
	 * 	uint8_t			int8_t
	 * 	uint16_t		int16_t
	 * 	uint32_t		int32_t
	 *	float (single precision IEEE 754)
	 *	double (double precision IEEE 754)
	 *
	 * This is designed to work in Node and v8. It may in fact work in other
	 * Javascript interpreters (that'd be pretty neat), but it hasn't been tested.
	 * If you find that it does in fact work, that's pretty cool. Try and pass word
	 * back to the original author.
	 *
	 * Note to the reader: If you're tabstop isn't set to 8, parts of this may look
	 * weird.
	 */

	/*
	 * Numbers in Javascript have a secret: all numbers must be represented with an
	 * IEEE-754 double. The double has a mantissa with a length of 52 bits with an
	 * implicit one. Thus the range of integers that can be represented is limited
	 * to the size of the mantissa, this makes reading and writing 64-bit integers
	 * difficult, but far from impossible.
	 *
	 * Another side effect of this representation is what happens when you use the
	 * bitwise operators, i.e. shift left, shift right, and, or, etc. In Javascript,
	 * each operand and the result is cast to a signed 32-bit number. However, in
	 * the case of >>> the values are cast to an unsigned number.
	 */

	/*
	 * A reminder on endian related issues:
	 *
	 * Big Endian: MSB -> First byte
	 * Little Endian: MSB->Last byte
	 */
	var mod_assert = require(67);

	/*
	 * An 8 bit unsigned integer involves doing no significant work.
	 */
	function ruint8(buffer, endian, offset)
	{
		if (endian === undefined)
			throw (new Error('missing endian'));

		if (buffer === undefined)
			throw (new Error('missing buffer'));

		if (offset === undefined)
			throw (new Error('missing offset'));

		if (offset >= buffer.length)
			throw (new Error('Trying to read beyond buffer length'));

		return (buffer[offset]);
	}

	/*
	 * For 16 bit unsigned numbers we can do all the casting that we want to do.
	 */
	function rgint16(buffer, endian, offset)
	{
		var val = 0;

		if (endian == 'big') {
			val = buffer[offset] << 8;
			val |=  buffer[offset+1];
		} else {
			val = buffer[offset];
			val |= buffer[offset+1] << 8;
		}

		return (val);

	}

	function ruint16(buffer, endian, offset)
	{
		if (endian === undefined)
			throw (new Error('missing endian'));

		if (buffer === undefined)
			throw (new Error('missing buffer'));

		if (offset === undefined)
			throw (new Error('missing offset'));

		if (offset + 1 >= buffer.length)
			throw (new Error('Trying to read beyond buffer length'));

		return (rgint16(buffer, endian, offset));
	}

	/*
	 * Because most bitshifting is done using signed numbers, if we would go into
	 * the realm where we use that 32nd bit, we'll end up going into the negative
	 * range. i.e.:
	 * > 200 << 24
	 * -939524096
	 *
	 * Not the value you'd expect. To work around this, we end up having to do some
	 * abuse of the JavaScript standard. in this case, we know that a >>> shift is
	 * defined to cast our value to an *unsigned* 32-bit number. Because of that, we
	 * use that instead to save us some additional math, though it does feel a
	 * little weird and it isn't obvious as to why you woul dwant to do this at
	 * first.
	 */
	function rgint32(buffer, endian, offset)
	{
		var val = 0;

		if (endian == 'big') {
			val = buffer[offset+1] << 16;
			val |= buffer[offset+2] << 8;
			val |= buffer[offset+3];
			val = val + (buffer[offset] << 24 >>> 0);
		} else {
			val = buffer[offset+2] << 16;
			val |= buffer[offset+1] << 8;
			val |= buffer[offset];
			val = val + (buffer[offset + 3] << 24 >>> 0);
		}

		return (val);
	}

	function ruint32(buffer, endian, offset)
	{
		if (endian === undefined)
			throw (new Error('missing endian'));

		if (buffer === undefined)
			throw (new Error('missing buffer'));

		if (offset === undefined)
			throw (new Error('missing offset'));

		if (offset + 3 >= buffer.length)
			throw (new Error('Trying to read beyond buffer length'));

		return (rgint32(buffer, endian, offset));
	}

	/*
	 * Reads a 64-bit unsigned number. The astue observer will note that this
	 * doesn't quite work. Javascript has chosen to only have numbers that can be
	 * represented by a double. A double only has 52 bits of mantissa with an
	 * implicit 1, thus we have up to 53 bits to represent an integer. However, 2^53
	 * doesn't quite give us what we want. Isn't 53 bits enough for anyone? What
	 * could you have possibly wanted to represent that was larger than that? Oh,
	 * maybe a size? You mean we bypassed the 4 GB limit on file sizes, when did
	 * that happen?
	 *
	 * To get around this egregious language issue, we're going to instead construct
	 * an array of two 32 bit unsigned integers. Where arr[0] << 32 + arr[1] would
	 * give the actual number. However, note that the above code probably won't
	 * produce the desired results because of the way Javascript numbers are
	 * doubles.
	 */
	function rgint64(buffer, endian, offset)
	{
		var val = new Array(2);

		if (endian == 'big') {
			val[0] = ruint32(buffer, endian, offset);
			val[1] = ruint32(buffer, endian, offset+4);
		} else {
			val[0] = ruint32(buffer, endian, offset+4);
			val[1] = ruint32(buffer, endian, offset);
		}

		return (val);
	}

	function ruint64(buffer, endian, offset)
	{
		if (endian === undefined)
			throw (new Error('missing endian'));

		if (buffer === undefined)
			throw (new Error('missing buffer'));

		if (offset === undefined)
			throw (new Error('missing offset'));

		if (offset + 7 >= buffer.length)
			throw (new Error('Trying to read beyond buffer length'));

		return (rgint64(buffer, endian, offset));
	}


	/*
	 * Signed integer types, yay team! A reminder on how two's complement actually
	 * works. The first bit is the signed bit, i.e. tells us whether or not the
	 * number should be positive or negative. If the two's complement value is
	 * positive, then we're done, as it's equivalent to the unsigned representation.
	 *
	 * Now if the number is positive, you're pretty much done, you can just leverage
	 * the unsigned translations and return those. Unfortunately, negative numbers
	 * aren't quite that straightforward.
	 *
	 * At first glance, one might be inclined to use the traditional formula to
	 * translate binary numbers between the positive and negative values in two's
	 * complement. (Though it doesn't quite work for the most negative value)
	 * Mainly:
	 *  - invert all the bits
	 *  - add one to the result
	 *
	 * Of course, this doesn't quite work in Javascript. Take for example the value
	 * of -128. This could be represented in 16 bits (big-endian) as 0xff80. But of
	 * course, Javascript will do the following:
	 *
	 * > ~0xff80
	 * -65409
	 *
	 * Whoh there, Javascript, that's not quite right. But wait, according to
	 * Javascript that's perfectly correct. When Javascript ends up seeing the
	 * constant 0xff80, it has no notion that it is actually a signed number. It
	 * assumes that we've input the unsigned value 0xff80. Thus, when it does the
	 * binary negation, it casts it into a signed value, (positive 0xff80). Then
	 * when you perform binary negation on that, it turns it into a negative number.
	 *
	 * Instead, we're going to have to use the following general formula, that works
	 * in a rather Javascript friendly way. I'm glad we don't support this kind of
	 * weird numbering scheme in the kernel.
	 *
	 * (BIT-MAX - (unsigned)val + 1) * -1
	 *
	 * The astute observer, may think that this doesn't make sense for 8-bit numbers
	 * (really it isn't necessary for them). However, when you get 16-bit numbers,
	 * you do. Let's go back to our prior example and see how this will look:
	 *
	 * (0xffff - 0xff80 + 1) * -1
	 * (0x007f + 1) * -1
	 * (0x0080) * -1
	 *
	 * Doing it this way ends up allowing us to treat it appropriately in
	 * Javascript. Sigh, that's really quite ugly for what should just be a few bit
	 * shifts, ~ and &.
	 */

	/*
	 * Endianness doesn't matter for 8-bit signed values. We could in fact optimize
	 * this case because the more traditional methods work, but for consistency,
	 * we'll keep doing this the same way.
	 */
	function rsint8(buffer, endian, offset)
	{
		var neg;

		if (endian === undefined)
			throw (new Error('missing endian'));

		if (buffer === undefined)
			throw (new Error('missing buffer'));

		if (offset === undefined)
			throw (new Error('missing offset'));

		if (offset >= buffer.length)
			throw (new Error('Trying to read beyond buffer length'));

		neg = buffer[offset] & 0x80;
		if (!neg)
			return (buffer[offset]);

		return ((0xff - buffer[offset] + 1) * -1);
	}

	/*
	 * The 16-bit version requires a bit more effort. In this case, we can leverage
	 * our unsigned code to generate the value we want to return.
	 */
	function rsint16(buffer, endian, offset)
	{
		var neg, val;

		if (endian === undefined)
			throw (new Error('missing endian'));

		if (buffer === undefined)
			throw (new Error('missing buffer'));

		if (offset === undefined)
			throw (new Error('missing offset'));

		if (offset + 1 >= buffer.length)
			throw (new Error('Trying to read beyond buffer length'));

		val = rgint16(buffer, endian, offset);
		neg = val & 0x8000;
		if (!neg)
			return (val);

		return ((0xffff - val + 1) * -1);
	}

	/*
	 * We really shouldn't leverage our 32-bit code here and instead utilize the
	 * fact that we know that since these are signed numbers, we can do all the
	 * shifting and binary anding to generate the 32-bit number. But, for
	 * consistency we'll do the same. If we want to do otherwise, we should instead
	 * make the 32 bit unsigned code do the optimization. But as long as there
	 * aren't floats secretly under the hood for that, we /should/ be okay.
	 */
	function rsint32(buffer, endian, offset)
	{
		var neg, val;

		if (endian === undefined)
			throw (new Error('missing endian'));

		if (buffer === undefined)
			throw (new Error('missing buffer'));

		if (offset === undefined)
			throw (new Error('missing offset'));

		if (offset + 3 >= buffer.length)
			throw (new Error('Trying to read beyond buffer length'));

		val = rgint32(buffer, endian, offset);
		neg = val & 0x80000000;
		if (!neg)
			return (val);

		return ((0xffffffff - val + 1) * -1);
	}

	/*
	 * The signed version of this code suffers from all of the same problems of the
	 * other 64 bit version.
	 */
	function rsint64(buffer, endian, offset)
	{
		var neg, val;

		if (endian === undefined)
			throw (new Error('missing endian'));

		if (buffer === undefined)
			throw (new Error('missing buffer'));

		if (offset === undefined)
			throw (new Error('missing offset'));

		if (offset + 3 >= buffer.length)
			throw (new Error('Trying to read beyond buffer length'));

		val = rgint64(buffer, endian, offset);
		neg = val[0] & 0x80000000;

		if (!neg)
			return (val);

		val[0] = (0xffffffff - val[0]) * -1;
		val[1] = (0xffffffff - val[1] + 1) * -1;

		/*
		 * If we had the key 0x8000000000000000, that would leave the lower 32
		 * bits as 0xffffffff, however, since we're goint to add one, that would
		 * actually leave the lower 32-bits as 0x100000000, which would break
		 * our ability to write back a value that we received. To work around
		 * this, if we actually get that value, we're going to bump the upper
		 * portion by 1 and set this to zero.
		 */
		mod_assert.ok(val[1] <= 0x100000000);
		if (val[1] == -0x100000000) {
			val[1] = 0;
			val[0]--;
		}

		return (val);
	}

	/*
	 * We now move onto IEEE 754: The traditional form for floating point numbers
	 * and what is secretly hiding at the heart of everything in this. I really hope
	 * that someone is actually using this, as otherwise, this effort is probably
	 * going to be more wasted.
	 *
	 * One might be tempted to use parseFloat here, but that wouldn't work at all
	 * for several reasons. Mostly due to the way floats actually work, and
	 * parseFloat only actually works in base 10. I don't see base 10 anywhere near
	 * this file.
	 *
	 * In this case we'll implement the single and double precision versions. The
	 * quadruple precision, while probably useful, wouldn't really be accepted by
	 * Javascript, so let's not even waste our time.
	 *
	 * So let's review how this format looks like. A single precision value is 32
	 * bits and has three parts:
	 *   -  Sign bit
	 *   -  Exponent (Using bias notation)
	 *   -  Mantissa
	 *
	 * |s|eeeeeeee|mmmmmmmmmmmmmmmmmmmmmmmmm|
	 * 31| 30-23  |  22    	-       0       |
	 *
	 * The exponent is stored in a biased input. The bias in this case 127.
	 * Therefore, our exponent is equal to the 8-bit value - 127.
	 *
	 * By default, a number is normalized in IEEE, that means that the mantissa has
	 * an implicit one that we don't see. So really the value stored is 1.m.
	 * However, if the exponent is all zeros, then instead we have to shift
	 * everything to the right one and there is no more implicit one.
	 *
	 * Special values:
	 *  - Positive Infinity:
	 *	Sign:		0
	 *	Exponent: 	All 1s
	 *	Mantissa:	0
	 *  - Negative Infinity:
	 *	Sign:		1
	 *	Exponent: 	All 1s
	 *	Mantissa:	0
	 *  - NaN:
	 *	Sign:		*
	 *	Exponent: 	All 1s
	 *	Mantissa:	non-zero
	 *  - Zero:
	 *	Sign:		*
	 *	Exponent:	All 0s
	 *	Mantissa:	0
	 *
	 * In the case of zero, the sign bit determines whether we get a positive or
	 * negative zero. However, since Javascript cannot determine the difference
	 * between the two: i.e. -0 == 0, we just always return 0.
	 *
	 */
	function rfloat(buffer, endian, offset)
	{
		var bytes = [];
		var sign, exponent, mantissa, val;
		var bias = 127;
		var maxexp = 0xff;

		if (endian === undefined)
			throw (new Error('missing endian'));

		if (buffer === undefined)
			throw (new Error('missing buffer'));

		if (offset === undefined)
			throw (new Error('missing offset'));

		if (offset + 3 >= buffer.length)
			throw (new Error('Trying to read beyond buffer length'));

		/* Normalize the bytes to be in endian order */
		if (endian == 'big') {
			bytes[0] = buffer[offset];
			bytes[1] = buffer[offset+1];
			bytes[2] = buffer[offset+2];
			bytes[3] = buffer[offset+3];
		} else {
			bytes[3] = buffer[offset];
			bytes[2] = buffer[offset+1];
			bytes[1] = buffer[offset+2];
			bytes[0] = buffer[offset+3];
		}

		sign = bytes[0] & 0x80;
		exponent = (bytes[0] & 0x7f) << 1;
		exponent |= (bytes[1] & 0x80) >>> 7;
		mantissa = (bytes[1] & 0x7f) << 16;
		mantissa |= bytes[2] << 8;
		mantissa |= bytes[3];

		/* Check for special cases before we do general parsing */
		if (!sign && exponent == maxexp && mantissa === 0)
			return (Number.POSITIVE_INFINITY);

		if (sign && exponent == maxexp && mantissa === 0)
			return (Number.NEGATIVE_INFINITY);

		if (exponent == maxexp && mantissa !== 0)
			return (Number.NaN);

		/*
		 * Javascript really doesn't have support for positive or negative zero.
		 * So we're not going to try and give it to you. That would be just
		 * plain weird. Besides -0 == 0.
		 */
		if (exponent === 0 && mantissa === 0)
			return (0);

		/*
		 * Now we can deal with the bias and the determine whether the mantissa
		 * has the implicit one or not.
		 */
		exponent -= bias;
		if (exponent == -bias) {
			exponent++;
			val = 0;
		} else {
			val = 1;
		}

		val = (val + mantissa * Math.pow(2, -23)) * Math.pow(2, exponent);

		if (sign)
			val *= -1;

		return (val);
	}

	/*
	 * Doubles in IEEE 754 are like their brothers except for a few changes and
	 * increases in size:
	 *   - The exponent is now 11 bits
	 *   - The mantissa is now 52 bits
	 *   - The bias is now 1023
	 *
	 * |s|eeeeeeeeeee|mmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmm|
	 * 63| 62 - 52   | 	51		-			0     |
	 * 63| 62 - 52   |      51              -                       0     |
	 *
	 * While the size has increased a fair amount, we're going to end up keeping the
	 * same general formula for calculating the final value. As a reminder, this
	 * formula is:
	 *
	 * (-1)^s * (n + m) * 2^(e-b)
	 *
	 * Where:
	 *	s	is the sign bit
	 *	n	is (exponent > 0) ? 1 : 0 -- Determines whether we're normalized
	 *					     or not
	 *	m	is the mantissa
	 *	e	is the exponent specified
	 *	b	is the bias for the exponent
	 *
	 */
	function rdouble(buffer, endian, offset)
	{
		var bytes = [];
		var sign, exponent, mantissa, val, lowmant;
		var bias = 1023;
		var maxexp = 0x7ff;

		if (endian === undefined)
			throw (new Error('missing endian'));

		if (buffer === undefined)
			throw (new Error('missing buffer'));

		if (offset === undefined)
			throw (new Error('missing offset'));

		if (offset + 7 >= buffer.length)
			throw (new Error('Trying to read beyond buffer length'));

		/* Normalize the bytes to be in endian order */
		if (endian == 'big') {
			bytes[0] = buffer[offset];
			bytes[1] = buffer[offset+1];
			bytes[2] = buffer[offset+2];
			bytes[3] = buffer[offset+3];
			bytes[4] = buffer[offset+4];
			bytes[5] = buffer[offset+5];
			bytes[6] = buffer[offset+6];
			bytes[7] = buffer[offset+7];
		} else {
			bytes[7] = buffer[offset];
			bytes[6] = buffer[offset+1];
			bytes[5] = buffer[offset+2];
			bytes[4] = buffer[offset+3];
			bytes[3] = buffer[offset+4];
			bytes[2] = buffer[offset+5];
			bytes[1] = buffer[offset+6];
			bytes[0] = buffer[offset+7];
		}

		/*
		 * We can construct the exponent and mantissa the same way as we did in
		 * the case of a float, just increase the range of the exponent.
		 */
		sign = bytes[0] & 0x80;
		exponent = (bytes[0] & 0x7f) << 4;
		exponent |= (bytes[1] & 0xf0) >>> 4;

		/*
		 * This is going to be ugly but then again, we're dealing with IEEE 754.
		 * This could probably be done as a node add on in a few lines of C++,
		 * but oh we'll, we've made it this far so let's be native the rest of
		 * the way...
		 *
		 * What we're going to do is break the mantissa into two parts, the
		 * lower 24 bits and the upper 28 bits. We'll multiply the upper 28 bits
		 * by the appropriate power and then add in the lower 24-bits. Not
		 * really that great. It's pretty much a giant kludge to deal with
		 * Javascript eccentricities around numbers.
		 */
		lowmant = bytes[7];
		lowmant |= bytes[6] << 8;
		lowmant |= bytes[5] << 16;
		mantissa = bytes[4];
		mantissa |= bytes[3] << 8;
		mantissa |= bytes[2] << 16;
		mantissa |= (bytes[1] & 0x0f) << 24;
		mantissa *= Math.pow(2, 24); /* Equivalent to << 24, but JS compat */
		mantissa += lowmant;

		/* Check for special cases before we do general parsing */
		if (!sign && exponent == maxexp && mantissa === 0)
			return (Number.POSITIVE_INFINITY);

		if (sign && exponent == maxexp && mantissa === 0)
			return (Number.NEGATIVE_INFINITY);

		if (exponent == maxexp && mantissa !== 0)
			return (Number.NaN);

		/*
		 * Javascript really doesn't have support for positive or negative zero.
		 * So we're not going to try and give it to you. That would be just
		 * plain weird. Besides -0 == 0.
		 */
		if (exponent === 0 && mantissa === 0)
			return (0);

		/*
		 * Now we can deal with the bias and the determine whether the mantissa
		 * has the implicit one or not.
		 */
		exponent -= bias;
		if (exponent == -bias) {
			exponent++;
			val = 0;
		} else {
			val = 1;
		}

		val = (val + mantissa * Math.pow(2, -52)) * Math.pow(2, exponent);

		if (sign)
			val *= -1;

		return (val);
	}

	/*
	 * Now that we have gone through the pain of reading the individual types, we're
	 * probably going to want some way to write these back. None of this is going to
	 * be good. But since we have Javascript numbers this should certainly be more
	 * interesting. Though we can constrain this end a little bit more in what is
	 * valid. For now, let's go back to our friends the unsigned value.
	 */

	/*
	 * Unsigned numbers seem deceptively easy. Here are the general steps and rules
	 * that we are going to take:
	 *   -  If the number is negative, throw an Error
	 *   -  Truncate any floating point portion
	 *   -  Take the modulus of the number in our base
	 *   -  Write it out to the buffer in the endian format requested at the offset
	 */

	/*
	 * We have to make sure that the value is a valid integer. This means that it is
	 * non-negative. It has no fractional component and that it does not exceed the
	 * maximum allowed value.
	 *
	 *	value		The number to check for validity
	 *
	 *	max		The maximum value
	 */
	function prepuint(value, max)
	{
		if (typeof (value) != 'number')
			throw (new (Error('cannot write a non-number as a number')));

		if (value < 0)
			throw (new Error('specified a negative value for writing an ' +
			    'unsigned value'));

		if (value > max)
			throw (new Error('value is larger than maximum value for ' +
			    'type'));

		if (Math.floor(value) !== value)
			throw (new Error('value has a fractional component'));

		return (value);
	}

	/*
	 * 8-bit version, classy. We can ignore endianness which is good.
	 */
	function wuint8(value, endian, buffer, offset)
	{
		var val;

		if (value === undefined)
			throw (new Error('missing value'));

		if (endian === undefined)
			throw (new Error('missing endian'));

		if (buffer === undefined)
			throw (new Error('missing buffer'));

		if (offset === undefined)
			throw (new Error('missing offset'));

		if (offset >= buffer.length)
			throw (new Error('Trying to read beyond buffer length'));

		val = prepuint(value, 0xff);
		buffer[offset] = val;
	}

	/*
	 * Pretty much the same as the 8-bit version, just this time we need to worry
	 * about endian related issues.
	 */
	function wgint16(val, endian, buffer, offset)
	{
		if (endian == 'big') {
			buffer[offset] = (val & 0xff00) >>> 8;
			buffer[offset+1] = val & 0x00ff;
		} else {
			buffer[offset+1] = (val & 0xff00) >>> 8;
			buffer[offset] = val & 0x00ff;
		}
	}

	function wuint16(value, endian, buffer, offset)
	{
		var val;

		if (value === undefined)
			throw (new Error('missing value'));

		if (endian === undefined)
			throw (new Error('missing endian'));

		if (buffer === undefined)
			throw (new Error('missing buffer'));

		if (offset === undefined)
			throw (new Error('missing offset'));

		if (offset + 1 >= buffer.length)
			throw (new Error('Trying to read beyond buffer length'));

		val = prepuint(value, 0xffff);
		wgint16(val, endian, buffer, offset);
	}

	/*
	 * The 32-bit version is going to have to be a little different unfortunately.
	 * We can't quite bitshift to get the largest byte, because that would end up
	 * getting us caught by the signed values.
	 *
	 * And yes, we do want to subtract out the lower part by default. This means
	 * that when we do the division, it will be treated as a bit shift and we won't
	 * end up generating a floating point value. If we did generate a floating point
	 * value we'd have to truncate it intelligently, this saves us that problem and
	 * may even be somewhat faster under the hood.
	 */
	function wgint32(val, endian, buffer, offset)
	{
		if (endian == 'big') {
			buffer[offset] = (val - (val & 0x00ffffff)) / Math.pow(2, 24);
			buffer[offset+1] = (val >>> 16) & 0xff;
			buffer[offset+2] = (val >>> 8) & 0xff;
			buffer[offset+3] = val & 0xff;
		} else {
			buffer[offset+3] = (val - (val & 0x00ffffff)) /
			    Math.pow(2, 24);
			buffer[offset+2] = (val >>> 16) & 0xff;
			buffer[offset+1] = (val >>> 8) & 0xff;
			buffer[offset] = val & 0xff;
		}
	}

	function wuint32(value, endian, buffer, offset)
	{
		var val;

		if (value === undefined)
			throw (new Error('missing value'));

		if (endian === undefined)
			throw (new Error('missing endian'));

		if (buffer === undefined)
			throw (new Error('missing buffer'));

		if (offset === undefined)
			throw (new Error('missing offset'));

		if (offset + 3 >= buffer.length)
			throw (new Error('Trying to read beyond buffer length'));

		val = prepuint(value, 0xffffffff);
		wgint32(val, endian, buffer, offset);
	}

	/*
	 * Unlike the other versions, we expect the value to be in the form of two
	 * arrays where value[0] << 32 + value[1] would result in the value that we
	 * want.
	 */
	function wgint64(value, endian, buffer, offset)
	{
		if (endian == 'big') {
			wgint32(value[0], endian, buffer, offset);
			wgint32(value[1], endian, buffer, offset+4);
		} else {
			wgint32(value[0], endian, buffer, offset+4);
			wgint32(value[1], endian, buffer, offset);
		}
	}

	function wuint64(value, endian, buffer, offset)
	{
		if (value === undefined)
			throw (new Error('missing value'));

		if (!(value instanceof Array))
			throw (new Error('value must be an array'));

		if (value.length != 2)
			throw (new Error('value must be an array of length 2'));

		if (endian === undefined)
			throw (new Error('missing endian'));

		if (buffer === undefined)
			throw (new Error('missing buffer'));

		if (offset === undefined)
			throw (new Error('missing offset'));

		if (offset + 7 >= buffer.length)
			throw (new Error('Trying to read beyond buffer length'));

		prepuint(value[0], 0xffffffff);
		prepuint(value[1], 0xffffffff);
		wgint64(value, endian, buffer, offset);
	}

	/*
	 * We now move onto our friends in the signed number category. Unlike unsigned
	 * numbers, we're going to have to worry a bit more about how we put values into
	 * arrays. Since we are only worrying about signed 32-bit values, we're in
	 * slightly better shape. Unfortunately, we really can't do our favorite binary
	 * & in this system. It really seems to do the wrong thing. For example:
	 *
	 * > -32 & 0xff
	 * 224
	 *
	 * What's happening above is really: 0xe0 & 0xff = 0xe0. However, the results of
	 * this aren't treated as a signed number. Ultimately a bad thing.
	 *
	 * What we're going to want to do is basically create the unsigned equivalent of
	 * our representation and pass that off to the wuint* functions. To do that
	 * we're going to do the following:
	 *
	 *  - if the value is positive
	 *	we can pass it directly off to the equivalent wuint
	 *  - if the value is negative
	 *	we do the following computation:
	 *	mb + val + 1, where
	 *	mb	is the maximum unsigned value in that byte size
	 *	val	is the Javascript negative integer
	 *
	 *
	 * As a concrete value, take -128. In signed 16 bits this would be 0xff80. If
	 * you do out the computations:
	 *
	 * 0xffff - 128 + 1
	 * 0xffff - 127
	 * 0xff80
	 *
	 * You can then encode this value as the signed version. This is really rather
	 * hacky, but it should work and get the job done which is our goal here.
	 *
	 * Thus the overall flow is:
	 *   -  Truncate the floating point part of the number
	 *   -  We don't have to take the modulus, because the unsigned versions will
	 *   	take care of that for us. And we don't have to worry about that
	 *   	potentially causing bad things to happen because of sign extension
	 *   -  Pass it off to the appropriate unsigned version, potentially modifying
	 *	the negative portions as necessary.
	 */

	/*
	 * A series of checks to make sure we actually have a signed 32-bit number
	 */
	function prepsint(value, max, min)
	{
		if (typeof (value) != 'number')
			throw (new (Error('cannot write a non-number as a number')));

		if (value > max)
			throw (new Error('value larger than maximum allowed value'));

		if (value < min)
			throw (new Error('value smaller than minimum allowed value'));

		if (Math.floor(value) !== value)
			throw (new Error('value has a fractional component'));

		return (value);
	}

	/*
	 * The 8-bit version of the signed value. Overall, fairly straightforward.
	 */
	function wsint8(value, endian, buffer, offset)
	{
		var val;

		if (value === undefined)
			throw (new Error('missing value'));

		if (endian === undefined)
			throw (new Error('missing endian'));

		if (buffer === undefined)
			throw (new Error('missing buffer'));

		if (offset === undefined)
			throw (new Error('missing offset'));

		if (offset >= buffer.length)
			throw (new Error('Trying to read beyond buffer length'));

		val = prepsint(value, 0x7f, -0x80);
		if (val >= 0)
			wuint8(val, endian, buffer, offset);
		else
			wuint8(0xff + val + 1, endian, buffer, offset);
	}

	/*
	 * The 16-bit version of the signed value. Also, fairly straightforward.
	 */
	function wsint16(value, endian, buffer, offset)
	{
		var val;

		if (value === undefined)
			throw (new Error('missing value'));

		if (endian === undefined)
			throw (new Error('missing endian'));

		if (buffer === undefined)
			throw (new Error('missing buffer'));

		if (offset === undefined)
			throw (new Error('missing offset'));

		if (offset + 1 >= buffer.length)
			throw (new Error('Trying to read beyond buffer length'));

		val = prepsint(value, 0x7fff, -0x8000);
		if (val >= 0)
			wgint16(val, endian, buffer, offset);
		else
			wgint16(0xffff + val + 1, endian, buffer, offset);

	}

	/*
	 * We can do this relatively easily by leveraging the code used for 32-bit
	 * unsigned code.
	 */
	function wsint32(value, endian, buffer, offset)
	{
		var val;

		if (value === undefined)
			throw (new Error('missing value'));

		if (endian === undefined)
			throw (new Error('missing endian'));

		if (buffer === undefined)
			throw (new Error('missing buffer'));

		if (offset === undefined)
			throw (new Error('missing offset'));

		if (offset + 3 >= buffer.length)
			throw (new Error('Trying to read beyond buffer length'));

		val = prepsint(value, 0x7fffffff, -0x80000000);
		if (val >= 0)
			wgint32(val, endian, buffer, offset);
		else
			wgint32(0xffffffff + val + 1, endian, buffer, offset);
	}

	/*
	 * The signed 64 bit integer should by in the same format as when received.
	 * Mainly it should ensure that the value is an array of two integers where
	 * value[0] << 32 + value[1] is the desired number. Furthermore, the two values
	 * need to be equal.
	 */
	function wsint64(value, endian, buffer, offset)
	{
		var vzpos, vopos;
		var vals = new Array(2);

		if (value === undefined)
			throw (new Error('missing value'));

		if (!(value instanceof Array))
			throw (new Error('value must be an array'));

		if (value.length != 2)
			throw (new Error('value must be an array of length 2'));

		if (endian === undefined)
			throw (new Error('missing endian'));

		if (buffer === undefined)
			throw (new Error('missing buffer'));

		if (offset === undefined)
			throw (new Error('missing offset'));

		if (offset + 7 >= buffer.length)
			throw (new Error('Trying to read beyond buffer length'));

		/*
		 * We need to make sure that we have the same sign on both values. The
		 * hokiest way to to do this is to multiply the number by +inf. If we do
		 * this, we'll get either +/-inf depending on the sign of the value.
		 * Once we have this, we can compare it to +inf to see if the number is
		 * positive or not.
		 */
		vzpos = (value[0] * Number.POSITIVE_INFINITY) ==
		    Number.POSITIVE_INFINITY;
		vopos = (value[1] * Number.POSITIVE_INFINITY) ==
		    Number.POSITIVE_INFINITY;

		/*
		 * If either of these is zero, then we don't actually need this check.
		 */
		if (value[0] != 0 && value[1] != 0 && vzpos != vopos)
			throw (new Error('Both entries in the array must have ' +
			    'the same sign'));

		/*
		 * Doing verification for a signed 64-bit integer is actually a big
		 * trickier than it appears. We can't quite use our standard techniques
		 * because we need to compare both sets of values. The first value is
		 * pretty straightforward. If the first value is beond the extremes than
		 * we error out. However, the valid range of the second value varies
		 * based on the first one. If the first value is negative, and *not* the
		 * largest negative value, than it can be any integer within the range [
		 * 0, 0xffffffff ]. If it is the largest negative number, it must be
		 * zero.
		 *
		 * If the first number is positive, than it doesn't matter what the
		 * value is. We just simply have to make sure we have a valid positive
		 * integer.
		 */
		if (vzpos) {
			prepuint(value[0], 0x7fffffff);
			prepuint(value[1], 0xffffffff);
		} else {
			prepsint(value[0], 0, -0x80000000);
			prepsint(value[1], 0, -0xffffffff);
			if (value[0] == -0x80000000 && value[1] != 0)
				throw (new Error('value smaller than minimum ' +
				    'allowed value'));
		}

		/* Fix negative numbers */
		if (value[0] < 0 || value[1] < 0) {
			vals[0] = 0xffffffff - Math.abs(value[0]);
			vals[1] = 0x100000000 - Math.abs(value[1]);
			if (vals[1] == 0x100000000) {
				vals[1] = 0;
				vals[0]++;
			}
		} else {
			vals[0] = value[0];
			vals[1] = value[1];
		}
		wgint64(vals, endian, buffer, offset);
	}

	/*
	 * Now we are moving onto the weirder of these, the float and double. For this
	 * we're going to just have to do something that's pretty weird. First off, we
	 * have no way to get at the underlying float representation, at least not
	 * easily. But that doesn't mean we can't figure it out, we just have to use our
	 * heads.
	 *
	 * One might propose to use Number.toString(2). Of course, this is not really
	 * that good, because the ECMAScript 262 v3 Standard says the following Section
	 * 15.7.4.2-Number.prototype.toString (radix):
	 *
	 * If radix is an integer from 2 to 36, but not 10, the result is a string, the
	 * choice of which is implementation-dependent.
	 *
	 * Well that doesn't really help us one bit now does it? We could use the
	 * standard base 10 version of the string, but that's just going to create more
	 * errors as we end up trying to convert it back to a binary value. So, really
	 * this just means we have to be non-lazy and parse the structure intelligently.
	 *
	 * First off, we can do the basic checks: NaN, positive and negative infinity.
	 *
	 * Now that those are done we can work backwards to generate the mantissa and
	 * exponent.
	 *
	 * The first thing we need to do is determine the sign bit, easy to do, check
	 * whether the value is less than 0. And convert the number to its absolute
	 * value representation. Next, we need to determine if the value is less than
	 * one or greater than or equal to one and from there determine what power was
	 * used to get there. What follows is now specific to floats, though the general
	 * ideas behind this will hold for doubles as well, but the exact numbers
	 * involved will change.
	 *
	 * Once we have that power we can determine the exponent and the mantissa. Call
	 * the value that has the number of bits to reach the power ebits. In the
	 * general case they have the following values:
	 *
	 *	exponent	127 + ebits
	 *	mantissa	value * 2^(23 - ebits) & 0x7fffff
	 *
	 * In the case where the value of ebits is <= -127 we are now in the case where
	 * we no longer have normalized numbers. In this case the values take on the
	 * following values:
	 *
	 * 	exponent	0
	 *	mantissa	value * 2^149 & 0x7fffff
	 *
	 * Once we have the values for the sign, mantissa, and exponent. We reconstruct
	 * the four bytes as follows:
	 *
	 *	byte0		sign bit and seven most significant bits from the exp
	 *			sign << 7 | (exponent & 0xfe) >>> 1
	 *
	 *	byte1		lsb from the exponent and 7 top bits from the mantissa
	 *			(exponent & 0x01) << 7 | (mantissa & 0x7f0000) >>> 16
	 *
	 *	byte2		bits 8-15 (zero indexing) from mantissa
	 *			mantissa & 0xff00 >> 8
	 *
	 *	byte3		bits 0-7 from mantissa
	 *			mantissa & 0xff
	 *
	 * Once we have this we have to assign them into the buffer in proper endian
	 * order.
	 */

	/*
	 * Compute the log base 2 of the value. Now, someone who remembers basic
	 * properties of logarithms will point out that we could use the change of base
	 * formula for logs, and in fact that would be astute, because that's what we'll
	 * do for now. It feels cleaner, albeit it may be less efficient than just
	 * iterating and dividing by 2. We may want to come back and revisit that some
	 * day.
	 */
	function log2(value)
	{
		return (Math.log(value) / Math.log(2));
	}

	/*
	 * Helper to determine the exponent of the number we're looking at.
	 */
	function intexp(value)
	{
		return (Math.floor(log2(value)));
	}

	/*
	 * Helper to determine the exponent of the fractional part of the value.
	 */
	function fracexp(value)
	{
		return (Math.floor(log2(value)));
	}

	function wfloat(value, endian, buffer, offset)
	{
		var sign, exponent, mantissa, ebits;
		var bytes = [];

		if (value === undefined)
			throw (new Error('missing value'));

		if (endian === undefined)
			throw (new Error('missing endian'));

		if (buffer === undefined)
			throw (new Error('missing buffer'));

		if (offset === undefined)
			throw (new Error('missing offset'));


		if (offset + 3 >= buffer.length)
			throw (new Error('Trying to read beyond buffer length'));

		if (isNaN(value)) {
			sign = 0;
			exponent = 0xff;
			mantissa = 23;
		} else if (value == Number.POSITIVE_INFINITY) {
			sign = 0;
			exponent = 0xff;
			mantissa = 0;
		} else if (value == Number.NEGATIVE_INFINITY) {
			sign = 1;
			exponent = 0xff;
			mantissa = 0;
		} else {
			/* Well we have some work to do */

			/* Thankfully the sign bit is trivial */
			if (value < 0) {
				sign = 1;
				value = Math.abs(value);
			} else {
				sign = 0;
			}

			/* Use the correct function to determine number of bits */
			if (value < 1)
				ebits = fracexp(value);
			else
				ebits = intexp(value);

			/* Time to deal with the issues surrounding normalization */
			if (ebits <= -127) {
				exponent = 0;
				mantissa = (value * Math.pow(2, 149)) & 0x7fffff;
			} else {
				exponent = 127 + ebits;
				mantissa = value * Math.pow(2, 23 - ebits);
				mantissa &= 0x7fffff;
			}
		}

		bytes[0] = sign << 7 | (exponent & 0xfe) >>> 1;
		bytes[1] = (exponent & 0x01) << 7 | (mantissa & 0x7f0000) >>> 16;
		bytes[2] = (mantissa & 0x00ff00) >>> 8;
		bytes[3] = mantissa & 0x0000ff;

		if (endian == 'big') {
			buffer[offset] = bytes[0];
			buffer[offset+1] = bytes[1];
			buffer[offset+2] = bytes[2];
			buffer[offset+3] = bytes[3];
		} else {
			buffer[offset] = bytes[3];
			buffer[offset+1] = bytes[2];
			buffer[offset+2] = bytes[1];
			buffer[offset+3] = bytes[0];
		}
	}

	/*
	 * Now we move onto doubles. Doubles are similar to floats in pretty much all
	 * ways except that the processing isn't quite as straightforward because we
	 * can't always use shifting, i.e. we have > 32 bit values.
	 *
	 * We're going to proceed in an identical fashion to floats and utilize the same
	 * helper functions. All that really is changing are the specific values that we
	 * use to do the calculations. Thus, to review we have to do the following.
	 *
	 * First get the sign bit and convert the value to its absolute value
	 * representation. Next, we determine the number of bits that we used to get to
	 * the value, branching whether the value is greater than or less than 1. Once
	 * we have that value which we will again call ebits, we have to do the
	 * following in the general case:
	 *
	 *	exponent	1023 + ebits
	 *	mantissa	[value * 2^(52 - ebits)] % 2^52
	 *
	 * In the case where the value of ebits <= -1023 we no longer use normalized
	 * numbers, thus like with floats we have to do slightly different processing:
	 *
	 *	exponent	0
	 *	mantissa	[value * 2^1074] % 2^52
	 *
	 * Once we have determined the sign, exponent and mantissa we can construct the
	 * bytes as follows:
	 *
	 *	byte0		sign bit and seven most significant bits form the exp
	 *			sign << 7 | (exponent & 0x7f0) >>> 4
	 *
	 *	byte1		Remaining 4 bits from the exponent and the four most
	 *			significant bits from the mantissa 48-51
	 *			(exponent & 0x00f) << 4 | mantissa >>> 48
	 *
	 *	byte2		Bits 40-47 from the mantissa
	 *			(mantissa >>> 40) & 0xff
	 *
	 *	byte3		Bits 32-39 from the mantissa
	 *			(mantissa >>> 32) & 0xff
	 *
	 *	byte4		Bits 24-31 from the mantissa
	 *			(mantissa >>> 24) & 0xff
	 *
	 *	byte5		Bits 16-23 from the Mantissa
	 *			(mantissa >>> 16) & 0xff
	 *
	 *	byte6		Bits 8-15 from the mantissa
	 *			(mantissa >>> 8) & 0xff
	 *
	 *	byte7		Bits 0-7 from the mantissa
	 *			mantissa & 0xff
	 *
	 * Now we can't quite do the right shifting that we want in bytes 1 - 3, because
	 * we'll have extended too far and we'll lose those values when we try and do
	 * the shift. Instead we have to use an alternate approach. To try and stay out
	 * of floating point, what we'll do is say that mantissa -= bytes[4-7] and then
	 * divide by 2^32. Once we've done that we can use binary arithmetic. Oof,
	 * that's ugly, but it seems to avoid using floating point (just based on how v8
	 * seems to be optimizing for base 2 arithmetic).
	 */
	function wdouble(value, endian, buffer, offset)
	{
		var sign, exponent, mantissa, ebits;
		var bytes = [];

		if (value === undefined)
			throw (new Error('missing value'));

		if (endian === undefined)
			throw (new Error('missing endian'));

		if (buffer === undefined)
			throw (new Error('missing buffer'));

		if (offset === undefined)
			throw (new Error('missing offset'));


		if (offset + 7 >= buffer.length)
			throw (new Error('Trying to read beyond buffer length'));

		if (isNaN(value)) {
			sign = 0;
			exponent = 0x7ff;
			mantissa = 23;
		} else if (value == Number.POSITIVE_INFINITY) {
			sign = 0;
			exponent = 0x7ff;
			mantissa = 0;
		} else if (value == Number.NEGATIVE_INFINITY) {
			sign = 1;
			exponent = 0x7ff;
			mantissa = 0;
		} else {
			/* Well we have some work to do */

			/* Thankfully the sign bit is trivial */
			if (value < 0) {
				sign = 1;
				value = Math.abs(value);
			} else {
				sign = 0;
			}

			/* Use the correct function to determine number of bits */
			if (value < 1)
				ebits = fracexp(value);
			else
				ebits = intexp(value);

			/*
			 * This is a total hack to determine a denormalized value.
			 * Unfortunately, we sometimes do not get a proper value for
			 * ebits, i.e. we lose the values that would get rounded off.
			 *
			 *
			 * The astute observer may wonder why we would be
			 * multiplying by two Math.pows rather than just summing
			 * them. Well, that's to get around a small bug in the
			 * way v8 seems to implement the function. On occasion
			 * doing:
			 *
			 * foo * Math.pow(2, 1023 + 51)
			 *
			 * Causes us to overflow to infinity, where as doing:
			 *
			 * foo * Math.pow(2, 1023) * Math.pow(2, 51)
			 *
			 * Does not cause us to overflow. Go figure.
			 *
			 */
			if (value <= 2.225073858507201e-308 || ebits <= -1023) {
				exponent = 0;
				mantissa = value * Math.pow(2, 1023) * Math.pow(2, 51);
				mantissa %= Math.pow(2, 52);
			} else {
				/*
				 * We might have gotten fucked by our floating point
				 * logarithm magic. This is rather crappy, but that's
				 * our luck. If we just had a log base 2 or access to
				 * the stupid underlying representation this would have
				 * been much easier and we wouldn't have such stupid
				 * kludges or hacks.
				 */
				if (ebits > 1023)
					ebits = 1023;
				exponent = 1023 + ebits;
				mantissa = value * Math.pow(2, -ebits);
				mantissa *= Math.pow(2, 52);
				mantissa %= Math.pow(2, 52);
			}
		}

		/* Fill the bytes in backwards to deal with the size issues */
		bytes[7] = mantissa & 0xff;
		bytes[6] = (mantissa >>> 8) & 0xff;
		bytes[5] = (mantissa >>> 16) & 0xff;
		mantissa = (mantissa - (mantissa & 0xffffff)) / Math.pow(2, 24);
		bytes[4] = mantissa & 0xff;
		bytes[3] = (mantissa >>> 8) & 0xff;
		bytes[2] = (mantissa >>> 16) & 0xff;
		bytes[1] = (exponent & 0x00f) << 4 | mantissa >>> 24;
		bytes[0] = (sign << 7) | (exponent & 0x7f0) >>> 4;

		if (endian == 'big') {
			buffer[offset] = bytes[0];
			buffer[offset+1] = bytes[1];
			buffer[offset+2] = bytes[2];
			buffer[offset+3] = bytes[3];
			buffer[offset+4] = bytes[4];
			buffer[offset+5] = bytes[5];
			buffer[offset+6] = bytes[6];
			buffer[offset+7] = bytes[7];
		} else {
			buffer[offset+7] = bytes[0];
			buffer[offset+6] = bytes[1];
			buffer[offset+5] = bytes[2];
			buffer[offset+4] = bytes[3];
			buffer[offset+3] = bytes[4];
			buffer[offset+2] = bytes[5];
			buffer[offset+1] = bytes[6];
			buffer[offset] = bytes[7];
		}
	}

	/*
	 * Actually export our work above. One might argue that we shouldn't expose
	 * these interfaces and just force people to use the higher level abstractions
	 * around this work. However, unlike say other libraries we've come across, this
	 * interface has several properties: it makes sense, it's simple, and it's
	 * useful.
	 */
	exports.ruint8 = ruint8;
	exports.ruint16 = ruint16;
	exports.ruint32 = ruint32;
	exports.ruint64 = ruint64;
	exports.wuint8 = wuint8;
	exports.wuint16 = wuint16;
	exports.wuint32 = wuint32;
	exports.wuint64 = wuint64;

	exports.rsint8 = rsint8;
	exports.rsint16 = rsint16;
	exports.rsint32 = rsint32;
	exports.rsint64 = rsint64;
	exports.wsint8 = wsint8;
	exports.wsint16 = wsint16;
	exports.wsint32 = wsint32;
	exports.wsint64 = wsint64;

	exports.rfloat = rfloat;
	exports.rdouble = rdouble;
	exports.wfloat = wfloat;
	exports.wdouble = wdouble;


/***/ },

/***/ 126:
/***/ function(module, exports, require) {

	// Copyright 2011 Mark Cavage <mcavage@gmail.com> All rights reserved.

	var errors = require(130);
	var types = require(131);

	var Reader = require(132);
	var Writer = require(133);


	///--- Exports

	module.exports = {

	  Reader: Reader,

	  Writer: Writer

	};

	for (var t in types) {
	  if (types.hasOwnProperty(t))
	    module.exports[t] = types[t];
	}
	for (var e in errors) {
	  if (errors.hasOwnProperty(e))
	    module.exports[e] = errors[e];
	}


/***/ },

/***/ 127:
/***/ function(module, exports, require) {

	var Stream = require(71).Stream;
	var util = require(17);

	module.exports = DelayedStream;
	function DelayedStream() {
	  this.source = null;
	  this.dataSize = 0;
	  this.maxDataSize = 1024 * 1024;
	  this.pauseStream = true;

	  this._maxDataSizeExceeded = false;
	  this._released = false;
	  this._bufferedEvents = [];
	}
	util.inherits(DelayedStream, Stream);

	DelayedStream.create = function(source, options) {
	  var delayedStream = new this();

	  options = options || {};
	  for (var option in options) {
	    delayedStream[option] = options[option];
	  }

	  delayedStream.source = source;

	  var realEmit = source.emit;
	  source.emit = function() {
	    delayedStream._handleEmit(arguments);
	    return realEmit.apply(source, arguments);
	  };

	  source.on('error', function() {});
	  if (delayedStream.pauseStream) {
	    source.pause();
	  }

	  return delayedStream;
	};

	DelayedStream.prototype.__defineGetter__('readable', function() {
	  return this.source.readable;
	});

	DelayedStream.prototype.resume = function() {
	  if (!this._released) {
	    this.release();
	  }

	  this.source.resume();
	};

	DelayedStream.prototype.pause = function() {
	  this.source.pause();
	};

	DelayedStream.prototype.release = function() {
	  this._released = true;

	  this._bufferedEvents.forEach(function(args) {
	    this.emit.apply(this, args);
	  }.bind(this));
	  this._bufferedEvents = [];
	};

	DelayedStream.prototype.pipe = function() {
	  var r = Stream.prototype.pipe.apply(this, arguments);
	  this.resume();
	  return r;
	};

	DelayedStream.prototype._handleEmit = function(args) {
	  if (this._released) {
	    this.emit.apply(this, args);
	    return;
	  }

	  if (args[0] === 'data') {
	    this.dataSize += args[1].length;
	    this._checkIfMaxDataSizeExceeded();
	  }

	  this._bufferedEvents.push(args);
	};

	DelayedStream.prototype._checkIfMaxDataSizeExceeded = function() {
	  if (this._maxDataSizeExceeded) {
	    return;
	  }

	  if (this.dataSize <= this.maxDataSize) {
	    return;
	  }

	  this._maxDataSizeExceeded = true;
	  var message =
	    'DelayedStream#maxDataSize of ' + this.maxDataSize + ' bytes exceeded.'
	  this.emit('error', new Error(message));
	};


/***/ },

/***/ 128:
/***/ function(module, exports, require) {

	/* WEBPACK VAR INJECTION */(function(require, Buffer, process) {// Load modules

	var Fs = require(19);
	var Escape = require(135);


	// Declare internals

	var internals = {};


	// Clone object or array

	exports.clone = function (obj, seen) {

	    if (typeof obj !== 'object' ||
	        obj === null) {

	        return obj;
	    }

	    seen = seen || { orig: [], copy: [] };

	    var lookup = seen.orig.indexOf(obj);
	    if (lookup !== -1) {
	        return seen.copy[lookup];
	    }

	    var newObj = (obj instanceof Array) ? [] : {};

	    seen.orig.push(obj);
	    seen.copy.push(newObj);

	    for (var i in obj) {
	        if (obj.hasOwnProperty(i)) {
	            if (obj[i] instanceof Buffer) {
	                newObj[i] = new Buffer(obj[i]);
	            }
	            else if (obj[i] instanceof Date) {
	                newObj[i] = new Date(obj[i].getTime());
	            }
	            else if (obj[i] instanceof RegExp) {
	                var flags = '' + (obj[i].global ? 'g' : '') + (obj[i].ignoreCase ? 'i' : '') + (obj[i].multiline ? 'm' : '');
	                newObj[i] = new RegExp(obj[i].source, flags);
	            }
	            else {
	                newObj[i] = exports.clone(obj[i], seen);
	            }
	        }
	    }

	    return newObj;
	};


	// Merge all the properties of source into target, source wins in conflic, and by default null and undefined from source are applied

	exports.merge = function (target, source, isNullOverride /* = true */, isMergeArrays /* = true */) {

	    exports.assert(target && typeof target == 'object', 'Invalid target value: must be an object');
	    exports.assert(source === null || source === undefined || typeof source === 'object', 'Invalid source value: must be null, undefined, or an object');

	    if (!source) {
	        return target;
	    }

	    if (source instanceof Array) {
	        exports.assert(target instanceof Array, 'Cannot merge array onto an object');
	        if (isMergeArrays === false) {                                                  // isMergeArrays defaults to true
	            target.length = 0;                                                          // Must not change target assignment
	        }

	        for (var i = 0, il = source.length; i < il; ++i) {
	            target.push(source[i]);
	        }

	        return target;
	    }

	    var keys = Object.keys(source);
	    for (var k = 0, kl = keys.length; k < kl; ++k) {
	        var key = keys[k];
	        var value = source[key];
	        if (value &&
	            typeof value === 'object') {

	            if (!target[key] ||
	                typeof target[key] !== 'object') {

	                target[key] = exports.clone(value);
	            }
	            else {
	                exports.merge(target[key], source[key], isNullOverride, isMergeArrays);
	            }
	        }
	        else {
	            if (value !== null && value !== undefined) {            // Explicit to preserve empty strings
	                target[key] = value;
	            }
	            else if (isNullOverride !== false) {                    // Defaults to true
	                target[key] = value;
	            }
	        }
	    }

	    return target;
	};


	// Apply options to a copy of the defaults

	exports.applyToDefaults = function (defaults, options) {

	    exports.assert(defaults && typeof defaults == 'object', 'Invalid defaults value: must be an object');
	    exports.assert(!options || options === true || typeof options === 'object', 'Invalid options value: must be true, falsy or an object');

	    if (!options) {                                                 // If no options, return null
	        return null;
	    }

	    var copy = exports.clone(defaults);

	    if (options === true) {                                         // If options is set to true, use defaults
	        return copy;
	    }

	    return exports.merge(copy, options, false, false);
	};


	// Remove duplicate items from array

	exports.unique = function (array, key) {

	    var index = {};
	    var result = [];

	    for (var i = 0, il = array.length; i < il; ++i) {
	        var id = (key ? array[i][key] : array[i]);
	        if (index[id] !== true) {

	            result.push(array[i]);
	            index[id] = true;
	        }
	    }

	    return result;
	};


	// Convert array into object

	exports.mapToObject = function (array, key) {

	    if (!array) {
	        return null;
	    }

	    var obj = {};
	    for (var i = 0, il = array.length; i < il; ++i) {
	        if (key) {
	            if (array[i][key]) {
	                obj[array[i][key]] = true;
	            }
	        }
	        else {
	            obj[array[i]] = true;
	        }
	    }

	    return obj;
	};


	// Find the common unique items in two arrays

	exports.intersect = function (array1, array2, justFirst) {

	    if (!array1 || !array2) {
	        return [];
	    }

	    var common = [];
	    var hash = (array1 instanceof Array ? exports.mapToObject(array1) : array1);
	    var found = {};
	    for (var i = 0, il = array2.length; i < il; ++i) {
	        if (hash[array2[i]] && !found[array2[i]]) {
	            if (justFirst) {
	                return array2[i];
	            }

	            common.push(array2[i]);
	            found[array2[i]] = true;
	        }
	    }

	    return (justFirst ? null : common);
	};


	// Find which keys are present

	exports.matchKeys = function (obj, keys) {

	    var matched = [];
	    for (var i = 0, il = keys.length; i < il; ++i) {
	        if (obj.hasOwnProperty(keys[i])) {
	            matched.push(keys[i]);
	        }
	    }
	    return matched;
	};


	// Flatten array

	exports.flatten = function (array, target) {

	    var result = target || [];

	    for (var i = 0, il = array.length; i < il; ++i) {
	        if (Array.isArray(array[i])) {
	            exports.flatten(array[i], result);
	        }
	        else {
	            result.push(array[i]);
	        }
	    }

	    return result;
	};


	// Remove keys

	exports.removeKeys = function (object, keys) {

	    for (var i = 0, il = keys.length; i < il; i++) {
	        delete object[keys[i]];
	    }
	};


	// Convert an object key chain string ('a.b.c') to reference (object[a][b][c])

	exports.reach = function (obj, chain) {

	    var path = chain.split('.');
	    var ref = obj;
	    for (var i = 0, il = path.length; i < il; ++i) {
	        if (ref) {
	            ref = ref[path[i]];
	        }
	    }

	    return ref;
	};


	// Inherits a selected set of methods from an object, wrapping functions in asynchronous syntax and catching errors

	exports.inheritAsync = function (self, obj, keys) {

	    keys = keys || null;

	    for (var i in obj) {
	        if (obj.hasOwnProperty(i)) {
	            if (keys instanceof Array &&
	                keys.indexOf(i) < 0) {

	                continue;
	            }

	            self.prototype[i] = (function (fn) {

	                return function (next) {

	                    var result = null;
	                    try {
	                        result = fn();
	                    }
	                    catch (err) {
	                        return next(err);
	                    }

	                    return next(null, result);
	                };
	            })(obj[i]);
	        }
	    }
	};


	exports.formatStack = function (stack) {

	    var trace = [];
	    for (var i = 0, il = stack.length; i < il; ++i) {
	        var item = stack[i];
	        trace.push([item.getFileName(), item.getLineNumber(), item.getColumnNumber(), item.getFunctionName(), item.isConstructor()]);
	    }

	    return trace;
	};


	exports.formatTrace = function (trace) {

	    var display = [];

	    for (var i = 0, il = trace.length; i < il; ++i) {
	        var row = trace[i];
	        display.push((row[4] ? 'new ' : '') + row[3] + ' (' + row[0] + ':' + row[1] + ':' + row[2] + ')');
	    }

	    return display;
	};


	exports.callStack = function (slice) {

	    // http://code.google.com/p/v8/wiki/JavaScriptStackTraceApi

	    var v8 = Error.prepareStackTrace;
	    Error.prepareStackTrace = function (err, stack) {

	        return stack;
	    };

	    var capture = {};
	    Error.captureStackTrace(capture, arguments.callee);
	    var stack = capture.stack;

	    Error.prepareStackTrace = v8;

	    var trace = exports.formatStack(stack);

	    if (slice) {
	        return trace.slice(slice);
	    }

	    return trace;
	};


	exports.displayStack = function (slice) {

	    var trace = exports.callStack(slice === undefined ? 1 : slice + 1);

	    return exports.formatTrace(trace);
	};


	exports.abortThrow = false;


	exports.abort = function (message, hideStack) {

	    if (process.env.NODE_ENV === 'test' || exports.abortThrow === true) {
	        throw new Error(message || 'Unknown error');
	    }

	    var stack = '';
	    if (!hideStack) {
	        stack = exports.displayStack(1).join('\n\t');
	    }
	    console.log('ABORT: ' + message + '\n\t' + stack);
	    process.exit(1);
	};


	exports.assert = function (condition /*, msg1, msg2, msg3 */) {

	    if (condition) {
	        return;
	    }

	    var msgs = Array.prototype.slice.call(arguments, 1);
	    msgs = msgs.map(function (msg) {

	        return typeof msg === 'string' ? msg : msg instanceof Error ? msg.message : JSON.stringify(msg);
	    });
	    throw new Error(msgs.join(' ') || 'Unknown error');
	};


	exports.loadDirModules = function (path, excludeFiles, target) {      // target(filename, name, capName)

	    var exclude = {};
	    for (var i = 0, il = excludeFiles.length; i < il; ++i) {
	        exclude[excludeFiles[i] + '.js'] = true;
	    }

	    var files = Fs.readdirSync(path);
	    for (i = 0, il = files.length; i < il; ++i) {
	        var filename = files[i];
	        if (/\.js$/.test(filename) &&
	            !exclude[filename]) {

	            var name = filename.substr(0, filename.lastIndexOf('.'));
	            var capName = name.charAt(0).toUpperCase() + name.substr(1).toLowerCase();

	            if (typeof target !== 'function') {
	                target[capName] = require(134)(path + '/' + name);
	            }
	            else {
	                target(path + '/' + name, name, capName);
	            }
	        }
	    }
	};


	exports.rename = function (obj, from, to) {

	    obj[to] = obj[from];
	    delete obj[from];
	};


	exports.Timer = function () {

	    this.reset();
	};


	exports.Timer.prototype.reset = function () {

	    this.ts = Date.now();
	};


	exports.Timer.prototype.elapsed = function () {

	    return Date.now() - this.ts;
	};


	// Load and parse package.json process root or given directory

	exports.loadPackage = function (dir) {

	    var result = {};
	    var filepath = (dir || process.env.PWD) + '/package.json';
	    if (Fs.existsSync(filepath)) {
	        try {
	            result = JSON.parse(Fs.readFileSync(filepath));
	        }
	        catch (e) { }
	    }

	    return result;
	};


	// Escape string for Regex construction

	exports.escapeRegex = function (string) {

	    // Escape ^$.*+-?=!:|\/()[]{},
	    return string.replace(/[\^\$\.\*\+\-\?\=\!\:\|\\\/\(\)\[\]\{\}\,]/g, '\\$&');
	};


	// Return an error as first argument of a callback

	exports.toss = function (condition /*, [message], next */) {

	    var message = (arguments.length === 3 ? arguments[1] : '');
	    var next = (arguments.length === 3 ? arguments[2] : arguments[1]);

	    var err = (message instanceof Error ? message : (message ? new Error(message) : (condition instanceof Error ? condition : new Error())));

	    if (condition instanceof Error ||
	        !condition) {

	        return next(err);
	    }
	};


	// Base64url (RFC 4648) encode

	exports.base64urlEncode = function (value) {

	    return (new Buffer(value, 'binary')).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/\=/g, '');
	};


	// Base64url (RFC 4648) decode

	exports.base64urlDecode = function (encoded) {

	    if (encoded &&
	        !encoded.match(/^[\w\-]*$/)) {

	        return new Error('Invalid character');
	    }

	    try {
	        return (new Buffer(encoded.replace(/-/g, '+').replace(/:/g, '/'), 'base64')).toString('binary');
	    }
	    catch (err) {
	        return err;
	    }
	};


	// Escape attribute value for use in HTTP header

	exports.escapeHeaderAttribute = function (attribute) {

	    // Allowed value characters: !#$%&'()*+,-./:;<=>?@[]^_`{|}~ and space, a-z, A-Z, 0-9, \, "

	    exports.assert(attribute.match(/^[ \w\!#\$%&'\(\)\*\+,\-\.\/\:;<\=>\?@\[\]\^`\{\|\}~\"\\]*$/), 'Bad attribute value (' + attribute + ')');

	    return attribute.replace(/\\/g, '\\\\').replace(/\"/g, '\\"');                             // Escape quotes and slash
	};


	exports.escapeHtml = function (string) {

	    return Escape.escapeHtml(string);
	};


	exports.escapeJavaScript = function (string) {

	    return Escape.escapeJavaScript(string);
	};


	/*
	var event = {
	    timestamp: now.getTime(),
	    tags: ['tag'],
	    data: { some: 'data' }
	};
	*/

	exports.consoleFunc = console.log;

	exports.printEvent = function (event) {

	    var pad = function (value) {

	        return (value < 10 ? '0' : '') + value;
	    };

	    var now = new Date(event.timestamp);
	    var timestring = (now.getYear() - 100).toString() +
	        pad(now.getMonth() + 1) +
	        pad(now.getDate()) +
	        '/' +
	        pad(now.getHours()) +
	        pad(now.getMinutes()) +
	        pad(now.getSeconds()) +
	        '.' +
	        now.getMilliseconds();

	    var data = event.data;
	    if (typeof event.data !== 'string') {
	        try {
	            data = JSON.stringify(event.data);
	        }
	        catch (e) {
	            data = 'JSON Error: ' + e.message;
	        }
	    }

	    var output = timestring + ', ' + event.tags[0] + ', ' + data;
	    exports.consoleFunc(output);
	};


	exports.nextTick = function (callback) {

	    return function () {

	        var args = arguments;
	        process.nextTick(function () {

	            callback.apply(null, args);
	        });
	    };
	};
	
	/* WEBPACK VAR INJECTION */}.call(exports, require, require(50).Buffer, require(15)))

/***/ },

/***/ 129:
/***/ function(module, exports, require) {

	// Load modules

	var Crypto = require(72);
	var Boom = require(115);


	// Declare internals

	var internals = {};


	// Generate a cryptographically strong pseudo-random data

	exports.randomString = function (size) {

	    var buffer = exports.randomBits((size + 1) * 6);
	    if (buffer instanceof Error) {
	        return buffer;
	    }

	    var string = buffer.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/\=/g, '');
	    return string.slice(0, size);
	};


	exports.randomBits = function (bits) {

	    if (!bits ||
	        bits < 0) {

	        return Boom.internal('Invalid random bits count');
	    }

	    var bytes = Math.ceil(bits / 8);
	    try {
	        return Crypto.randomBytes(bytes);
	    }
	    catch (err) {
	        return Boom.internal('Failed generating random bits: ' + err.message);
	    }
	};


	// Compare two strings using fixed time algorithm (to prevent time-based analysis of MAC digest match)

	exports.fixedTimeComparison = function (a, b) {

	    if (typeof a !== 'string' ||
	        typeof b !== 'string') {

	        return false;
	    }

	    var mismatch = (a.length === b.length ? 0 : 1);
	    if (mismatch) {
	        b = a;
	    }

	    for (var i = 0, il = a.length; i < il; ++i) {
	        var ac = a.charCodeAt(i);
	        var bc = b.charCodeAt(i);
	        mismatch += (ac === bc ? 0 : 1);
	    }

	    return (mismatch === 0);
	};




/***/ },

/***/ 130:
/***/ function(module, exports, require) {

	// Copyright 2011 Mark Cavage <mcavage@gmail.com> All rights reserved.


	module.exports = {

	  newInvalidAsn1Error: function(msg) {
	    var e = new Error();
	    e.name = 'InvalidAsn1Error';
	    e.message = msg || '';
	    return e;
	  }

	};


/***/ },

/***/ 131:
/***/ function(module, exports, require) {

	// Copyright 2011 Mark Cavage <mcavage@gmail.com> All rights reserved.


	module.exports = {
	  EOC: 0,
	  Boolean: 1,
	  Integer: 2,
	  BitString: 3,
	  OctetString: 4,
	  Null: 5,
	  OID: 6,
	  ObjectDescriptor: 7,
	  External: 8,
	  Real: 9, // float
	  Enumeration: 10,
	  PDV: 11,
	  Utf8String: 12,
	  RelativeOID: 13,
	  Sequence: 16,
	  Set: 17,
	  NumericString: 18,
	  PrintableString: 19,
	  T61String: 20,
	  VideotexString: 21,
	  IA5String: 22,
	  UTCTime: 23,
	  GeneralizedTime: 24,
	  GraphicString: 25,
	  VisibleString: 26,
	  GeneralString: 28,
	  UniversalString: 29,
	  CharacterString: 30,
	  BMPString: 31,
	  Constructor: 32,
	  Context: 128
	};


/***/ },

/***/ 132:
/***/ function(module, exports, require) {

	/* WEBPACK VAR INJECTION */(function(require, Buffer) {// Copyright 2011 Mark Cavage <mcavage@gmail.com> All rights reserved.

	var assert = require(67);

	var ASN1 = require(131);
	var errors = require(130);


	///--- Globals

	var newInvalidAsn1Error = errors.newInvalidAsn1Error;



	///--- API

	function Reader(data) {
	  if (!data || !Buffer.isBuffer(data))
	    throw new TypeError('data must be a node Buffer');

	  this._buf = data;
	  this._size = data.length;

	  // These hold the "current" state
	  this._len = 0;
	  this._offset = 0;

	  var self = this;
	  this.__defineGetter__('length', function() { return self._len; });
	  this.__defineGetter__('offset', function() { return self._offset; });
	  this.__defineGetter__('remain', function() {
	    return self._size - self._offset;
	  });
	  this.__defineGetter__('buffer', function() {
	    return self._buf.slice(self._offset);
	  });
	}


	/**
	 * Reads a single byte and advances offset; you can pass in `true` to make this
	 * a "peek" operation (i.e., get the byte, but don't advance the offset).
	 *
	 * @param {Boolean} peek true means don't move offset.
	 * @return {Number} the next byte, null if not enough data.
	 */
	Reader.prototype.readByte = function(peek) {
	  if (this._size - this._offset < 1)
	    return null;

	  var b = this._buf[this._offset] & 0xff;

	  if (!peek)
	    this._offset += 1;

	  return b;
	};


	Reader.prototype.peek = function() {
	  return this.readByte(true);
	};


	/**
	 * Reads a (potentially) variable length off the BER buffer.  This call is
	 * not really meant to be called directly, as callers have to manipulate
	 * the internal buffer afterwards.
	 *
	 * As a result of this call, you can call `Reader.length`, until the
	 * next thing called that does a readLength.
	 *
	 * @return {Number} the amount of offset to advance the buffer.
	 * @throws {InvalidAsn1Error} on bad ASN.1
	 */
	Reader.prototype.readLength = function(offset) {
	  if (offset === undefined)
	    offset = this._offset;

	  if (offset >= this._size)
	    return null;

	  var lenB = this._buf[offset++] & 0xff;
	  if (lenB === null)
	    return null;

	  if ((lenB & 0x80) == 0x80) {
	    lenB &= 0x7f;

	    if (lenB == 0)
	      throw newInvalidAsn1Error('Indefinite length not supported');

	    if (lenB > 4)
	      throw newInvalidAsn1Error('encoding too long');

	    if (this._size - offset < lenB)
	      return null;

	    this._len = 0;
	    for (var i = 0; i < lenB; i++)
	      this._len = (this._len << 8) + (this._buf[offset++] & 0xff);

	  } else {
	    // Wasn't a variable length
	    this._len = lenB;
	  }

	  return offset;
	};


	/**
	 * Parses the next sequence in this BER buffer.
	 *
	 * To get the length of the sequence, call `Reader.length`.
	 *
	 * @return {Number} the sequence's tag.
	 */
	Reader.prototype.readSequence = function(tag) {
	  var seq = this.peek();
	  if (seq === null)
	    return null;
	  if (tag !== undefined && tag !== seq)
	    throw newInvalidAsn1Error('Expected 0x' + tag.toString(16) +
	                              ': got 0x' + seq.toString(16));

	  var o = this.readLength(this._offset + 1); // stored in `length`
	  if (o === null)
	    return null;

	  this._offset = o;
	  return seq;
	};


	Reader.prototype.readInt = function() {
	  return this._readTag(ASN1.Integer);
	};


	Reader.prototype.readBoolean = function() {
	  return (this._readTag(ASN1.Boolean) === 0 ? false : true);
	};


	Reader.prototype.readEnumeration = function() {
	  return this._readTag(ASN1.Enumeration);
	};


	Reader.prototype.readString = function(tag, retbuf) {
	  if (!tag)
	    tag = ASN1.OctetString;

	  var b = this.peek();
	  if (b === null)
	    return null;

	  if (b !== tag)
	    throw newInvalidAsn1Error('Expected 0x' + tag.toString(16) +
	                              ': got 0x' + b.toString(16));

	  var o = this.readLength(this._offset + 1); // stored in `length`

	  if (o === null)
	    return null;

	  if (this.length > this._size - o)
	    return null;

	  this._offset = o;

	  if (this.length === 0)
	    return '';

	  var str = this._buf.slice(this._offset, this._offset + this.length);
	  this._offset += this.length;

	  return retbuf ? str : str.toString('utf8');
	};

	Reader.prototype.readOID = function(tag) {
	  if (!tag)
	    tag = ASN1.OID;

	  var b = this.peek();
	  if (b === null)
	    return null;

	  if (b !== tag)
	    throw newInvalidAsn1Error('Expected 0x' + tag.toString(16) +
	                              ': got 0x' + b.toString(16));

	  var o = this.readLength(this._offset + 1); // stored in `length`
	  if (o === null)
	    return null;

	  if (this.length > this._size - o)
	    return null;

	  this._offset = o;

	  var values = [];
	  var value = 0;

	  for (var i = 0; i < this.length; i++) {
	    var byte = this._buf[this._offset++] & 0xff;

	    value <<= 7;
	    value += byte & 0x7f;
	    if ((byte & 0x80) == 0) {
	      values.push(value);
	      value = 0;
	    }
	  }

	  value = values.shift();
	  values.unshift(value % 40);
	  values.unshift((value / 40) >> 0);

	  return values.join('.');
	};


	Reader.prototype._readTag = function(tag) {
	  assert.ok(tag !== undefined);

	  var b = this.peek();

	  if (b === null)
	    return null;

	  if (b !== tag)
	    throw newInvalidAsn1Error('Expected 0x' + tag.toString(16) +
	                              ': got 0x' + b.toString(16));

	  var o = this.readLength(this._offset + 1); // stored in `length`
	  if (o === null)
	    return null;

	  if (this.length > 4)
	    throw newInvalidAsn1Error('Integer too long: ' + this.length);

	  if (this.length > this._size - o)
	    return null;
	  this._offset = o;

	  var fb = this._buf[this._offset++];
	  var value = 0;

	  value = fb & 0x7F;
	  for (var i = 1; i < this.length; i++) {
	    value <<= 8;
	    value |= (this._buf[this._offset++] & 0xff);
	  }

	  if ((fb & 0x80) == 0x80)
	    value = -value;

	  return value;
	};



	///--- Exported API

	module.exports = Reader;
	
	/* WEBPACK VAR INJECTION */}.call(exports, require, require(50).Buffer))

/***/ },

/***/ 133:
/***/ function(module, exports, require) {

	/* WEBPACK VAR INJECTION */(function(require, Buffer) {// Copyright 2011 Mark Cavage <mcavage@gmail.com> All rights reserved.

	var assert = require(67);
	var ASN1 = require(131);
	var errors = require(130);


	///--- Globals

	var newInvalidAsn1Error = errors.newInvalidAsn1Error;

	var DEFAULT_OPTS = {
	  size: 1024,
	  growthFactor: 8
	};


	///--- Helpers

	function merge(from, to) {
	  assert.ok(from);
	  assert.equal(typeof(from), 'object');
	  assert.ok(to);
	  assert.equal(typeof(to), 'object');

	  var keys = Object.getOwnPropertyNames(from);
	  keys.forEach(function(key) {
	    if (to[key])
	      return;

	    var value = Object.getOwnPropertyDescriptor(from, key);
	    Object.defineProperty(to, key, value);
	  });

	  return to;
	}



	///--- API

	function Writer(options) {
	  options = merge(DEFAULT_OPTS, options || {});

	  this._buf = new Buffer(options.size || 1024);
	  this._size = this._buf.length;
	  this._offset = 0;
	  this._options = options;

	  // A list of offsets in the buffer where we need to insert
	  // sequence tag/len pairs.
	  this._seq = [];

	  var self = this;
	  this.__defineGetter__('buffer', function() {
	    if (self._seq.length)
	      throw new InvalidAsn1Error(self._seq.length + ' unended sequence(s)');

	    return self._buf.slice(0, self._offset);
	  });
	}


	Writer.prototype.writeByte = function(b) {
	  if (typeof(b) !== 'number')
	    throw new TypeError('argument must be a Number');

	  this._ensure(1);
	  this._buf[this._offset++] = b;
	};


	Writer.prototype.writeInt = function(i, tag) {
	  if (typeof(i) !== 'number')
	    throw new TypeError('argument must be a Number');
	  if (typeof(tag) !== 'number')
	    tag = ASN1.Integer;

	  var sz = 4;

	  while ((((i & 0xff800000) === 0) || ((i & 0xff800000) === 0xff800000)) &&
	         (sz > 1)) {
	    sz--;
	    i <<= 8;
	  }

	  if (sz > 4)
	    throw new InvalidAsn1Error('BER ints cannot be > 0xffffffff');

	  this._ensure(2 + sz);
	  this._buf[this._offset++] = tag;
	  this._buf[this._offset++] = sz;

	  while (sz-- > 0) {
	    this._buf[this._offset++] = ((i & 0xff000000) >> 24);
	    i <<= 8;
	  }

	};


	Writer.prototype.writeNull = function() {
	  this.writeByte(ASN1.Null);
	  this.writeByte(0x00);
	};


	Writer.prototype.writeEnumeration = function(i, tag) {
	  if (typeof(i) !== 'number')
	    throw new TypeError('argument must be a Number');
	  if (typeof(tag) !== 'number')
	    tag = ASN1.Enumeration;

	  return this.writeInt(i, tag);
	};


	Writer.prototype.writeBoolean = function(b, tag) {
	  if (typeof(b) !== 'boolean')
	    throw new TypeError('argument must be a Boolean');
	  if (typeof(tag) !== 'number')
	    tag = ASN1.Boolean;

	  this._ensure(3);
	  this._buf[this._offset++] = tag;
	  this._buf[this._offset++] = 0x01;
	  this._buf[this._offset++] = b ? 0xff : 0x00;
	};


	Writer.prototype.writeString = function(s, tag) {
	  if (typeof(s) !== 'string')
	    throw new TypeError('argument must be a string (was: ' + typeof(s) + ')');
	  if (typeof(tag) !== 'number')
	    tag = ASN1.OctetString;

	  var len = Buffer.byteLength(s);
	  this.writeByte(tag);
	  this.writeLength(len);
	  if (len) {
	    this._ensure(len);
	    this._buf.write(s, this._offset);
	    this._offset += len;
	  }
	};


	Writer.prototype.writeBuffer = function(buf, tag) {
	  if (typeof(tag) !== 'number')
	    throw new TypeError('tag must be a number');
	  if (!Buffer.isBuffer(buf))
	    throw new TypeError('argument must be a buffer');

	  this.writeByte(tag);
	  this.writeLength(buf.length);
	  this._ensure(buf.length);
	  buf.copy(this._buf, this._offset, 0, buf.length);
	  this._offset += buf.length;
	};


	Writer.prototype.writeStringArray = function(strings) {
	  if ((!strings instanceof Array))
	    throw new TypeError('argument must be an Array[String]');

	  var self = this;
	  strings.forEach(function(s) {
	    self.writeString(s);
	  });
	};

	// This is really to solve DER cases, but whatever for now
	Writer.prototype.writeOID = function(s, tag) {
	  if (typeof(s) !== 'string')
	    throw new TypeError('argument must be a string');
	  if (typeof(tag) !== 'number')
	    tag = ASN1.OID;

	  if (!/^([0-9]+\.){3,}[0-9]+$/.test(s))
	    throw new Error('argument is not a valid OID string');

	  function encodeOctet(bytes, octet) {
	    if (octet < 128) {
	        bytes.push(octet);
	    } else if (octet < 16384) {
	        bytes.push((octet >>> 7) | 0x80);
	        bytes.push(octet & 0x7F);
	    } else if (octet < 2097152) {
	      bytes.push((octet >>> 14) | 0x80);
	      bytes.push(((octet >>> 7) | 0x80) & 0xFF);
	      bytes.push(octet & 0x7F);
	    } else if (octet < 268435456) {
	      bytes.push((octet >>> 21) | 0x80);
	      bytes.push(((octet >>> 14) | 0x80) & 0xFF);
	      bytes.push(((octet >>> 7) | 0x80) & 0xFF);
	      bytes.push(octet & 0x7F);
	    } else {
	      bytes.push(((octet >>> 28) | 0x80) & 0xFF);
	      bytes.push(((octet >>> 21) | 0x80) & 0xFF);
	      bytes.push(((octet >>> 14) | 0x80) & 0xFF);
	      bytes.push(((octet >>> 7) | 0x80) & 0xFF);
	      bytes.push(octet & 0x7F);
	    }
	  }

	  var tmp = s.split('.');
	  var bytes = [];
	  bytes.push(parseInt(tmp[0], 10) * 40 + parseInt(tmp[1], 10));
	  tmp.slice(2).forEach(function(b) {
	    encodeOctet(bytes, parseInt(b, 10));
	  });

	  var self = this;
	  this._ensure(2 + bytes.length);
	  this.writeByte(tag);
	  this.writeLength(bytes.length);
	  bytes.forEach(function(b) {
	    self.writeByte(b);
	  });
	};


	Writer.prototype.writeLength = function(len) {
	  if (typeof(len) !== 'number')
	    throw new TypeError('argument must be a Number');

	  this._ensure(4);

	  if (len <= 0x7f) {
	    this._buf[this._offset++] = len;
	  } else if (len <= 0xff) {
	    this._buf[this._offset++] = 0x81;
	    this._buf[this._offset++] = len;
	  } else if (len <= 0xffff) {
	    this._buf[this._offset++] = 0x82;
	    this._buf[this._offset++] = len >> 8;
	    this._buf[this._offset++] = len;
	  } else if (len <= 0xffffff) {
	    this._shift(start, len, 1);
	    this._buf[this._offset++] = 0x83;
	    this._buf[this._offset++] = len >> 16;
	    this._buf[this._offset++] = len >> 8;
	    this._buf[this._offset++] = len;
	  } else {
	    throw new InvalidAsn1ERror('Length too long (> 4 bytes)');
	  }
	};

	Writer.prototype.startSequence = function(tag) {
	  if (typeof(tag) !== 'number')
	    tag = ASN1.Sequence | ASN1.Constructor;

	  this.writeByte(tag);
	  this._seq.push(this._offset);
	  this._ensure(3);
	  this._offset += 3;
	};


	Writer.prototype.endSequence = function() {
	  var seq = this._seq.pop();
	  var start = seq + 3;
	  var len = this._offset - start;

	  if (len <= 0x7f) {
	    this._shift(start, len, -2);
	    this._buf[seq] = len;
	  } else if (len <= 0xff) {
	    this._shift(start, len, -1);
	    this._buf[seq] = 0x81;
	    this._buf[seq + 1] = len;
	  } else if (len <= 0xffff) {
	    this._buf[seq] = 0x82;
	    this._buf[seq + 1] = len >> 8;
	    this._buf[seq + 2] = len;
	  } else if (len <= 0xffffff) {
	    this._shift(start, len, 1);
	    this._buf[seq] = 0x83;
	    this._buf[seq + 1] = len >> 16;
	    this._buf[seq + 2] = len >> 8;
	    this._buf[seq + 3] = len;
	  } else {
	    throw new InvalidAsn1Error('Sequence too long');
	  }
	};


	Writer.prototype._shift = function(start, len, shift) {
	  assert.ok(start !== undefined);
	  assert.ok(len !== undefined);
	  assert.ok(shift);

	  this._buf.copy(this._buf, start + shift, start, start + len);
	  this._offset += shift;
	};

	Writer.prototype._ensure = function(len) {
	  assert.ok(len);

	  if (this._size - this._offset < len) {
	    var sz = this._size * this._options.growthFactor;
	    if (sz - this._offset < len)
	      sz += len;

	    var buf = new Buffer(sz);

	    this._buf.copy(buf, 0, 0, this._offset);
	    this._buf = buf;
	    this._size = sz;
	  }
	};



	///--- Exported API

	module.exports = Writer;
	
	/* WEBPACK VAR INJECTION */}.call(exports, require, require(50).Buffer))

/***/ },

/***/ 134:
/***/ function(module, exports, require) {

	var map = {
		"./escape": 135,
		"./escape.js": 135,
		"./index": 128,
		"./index.js": 128
	};
	function webpackContext(req) {
		return require(webpackContextResolve(req));
	};
	function webpackContextResolve(req) {
		return map[req] || (function() { throw new Error("Cannot find module '" + req + "'.") }());
	};
	webpackContext.keys = function webpackContextKeys() {
		return Object.keys(map);
	};
	webpackContext.resolve = webpackContextResolve;
	module.exports = webpackContext;


/***/ },

/***/ 135:
/***/ function(module, exports, require) {

	/* WEBPACK VAR INJECTION */(function(require, Buffer) {// Declare internals

	var internals = {};


	exports.escapeJavaScript = function (input) {

	    if (!input) {
	        return '';
	    }

	    var escaped = '';

	    for (var i = 0, il = input.length; i < il; ++i) {

	        var charCode = input.charCodeAt(i);

	        if (internals.isSafe(charCode)) {
	            escaped += input[i];
	        }
	        else {
	            escaped += internals.escapeJavaScriptChar(charCode);
	        }
	    }

	    return escaped;
	};


	exports.escapeHtml = function (input) {

	    if (!input) {
	        return '';
	    }

	    var escaped = '';

	    for (var i = 0, il = input.length; i < il; ++i) {

	        var charCode = input.charCodeAt(i);

	        if (internals.isSafe(charCode)) {
	            escaped += input[i];
	        }
	        else {
	            escaped += internals.escapeHtmlChar(charCode);
	        }
	    }

	    return escaped;
	};


	internals.escapeJavaScriptChar = function (charCode) {

	    if (charCode >= 256) {
	        return '\\u' + internals.padLeft('' + charCode, 4);
	    }

	    var hexValue = new Buffer(String.fromCharCode(charCode), 'ascii').toString('hex');
	    return '\\x' + internals.padLeft(hexValue, 2);
	};


	internals.escapeHtmlChar = function (charCode) {

	    var namedEscape = internals.namedHtml[charCode];
	    if (typeof namedEscape !== 'undefined') {
	        return namedEscape;
	    }

	    if (charCode >= 256) {
	        return '&#' + charCode + ';';
	    }

	    var hexValue = new Buffer(String.fromCharCode(charCode), 'ascii').toString('hex');
	    return '&#x' + internals.padLeft(hexValue, 2) + ';';
	};


	internals.padLeft = function (str, len) {

	    while (str.length < len) {
	        str = '0' + str;
	    }

	    return str;
	};


	internals.isSafe = function (charCode) {

	    return (typeof internals.safeCharCodes[charCode] !== 'undefined');
	};


	internals.namedHtml = {
	    '38': '&amp;',
	    '60': '&lt;',
	    '62': '&gt;',
	    '34': '&quot;',
	    '160': '&nbsp;',
	    '162': '&cent;',
	    '163': '&pound;',
	    '164': '&curren;',
	    '169': '&copy;',
	    '174': '&reg;'
	};


	internals.safeCharCodes = (function () {

	    var safe = {};

	    for (var i = 32; i < 123; ++i) {

	        if ((i >= 97 && i <= 122) ||         // a-z
	            (i >= 65 && i <= 90) ||          // A-Z
	            (i >= 48 && i <= 57) ||          // 0-9
	            i === 32 ||                      // space
	            i === 46 ||                      // .
	            i === 44 ||                      // ,
	            i === 45 ||                      // -
	            i === 58 ||                      // :
	            i === 95) {                      // _

	            safe[i] = null;
	        }
	    }

	    return safe;
	}());
	/* WEBPACK VAR INJECTION */}.call(exports, require, require(50).Buffer))

/***/ }
/******/ })