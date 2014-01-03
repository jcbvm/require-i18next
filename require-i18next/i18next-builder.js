/**
 * RequireJS i18next Plugin (builder)
 * 
 * Version 0.3.0 (01-03-2013)
 * Copyright 2013 Jacob van Mourik
 * Released under the MIT license
 */
define(["i18next"], function(i18next) {
    "use strict";

    var initWritten,
        options,
        f = i18next.functions,
        o = i18next.options;

    /**
     * Synchronously loads the contents of a file using either nodejs or rhino.
     * 
     * @param {String} path The path of the file
     * @returns {String} The contents of the file
     */
    function loadFile(path) {
        if (typeof process !== "undefined" && process.versions 
                && !!process.versions.node && !process.versions["node-webkit"]) {
            var file = fs.readFileSync(path, "utf8");
            if (file.indexOf("\uFEFF") === 0) {
                return file.substring(1);
            }
            return file;
        } else {
            var stringBuffer, line,
                file = new java.io.File(path), 
                lineSeparator = java.lang.System.getProperty("line.separator"), 
                input = new java.io.BufferedReader(new java.io.InputStreamReader(new java.io.FileInputStream(file), 'utf-8'));
            try {
                stringBuffer = new java.lang.StringBuffer();
                line = input.readLine();
                if (line && line.length() && line.charAt(0) === 0xfeff) {
                    line = line.substring(1);
                }
                stringBuffer.append(line);
                while ((line = input.readLine()) !== null) {
                    stringBuffer.append(lineSeparator).append(line);
                }
                return String(stringBuffer.toString());
            } finally {
                input.close();
            }
        }
    }

    /**
	 * Parses a resource name into its component parts. 
	 * For example: resource:namespace1,namespace2 where resource is the path to
	 * the locales and the part after the : the additional namespace(s) to load.
	 * 
	 * @param {String} name The resource name
	 * @returns {Object} Object containing module name and namespaces
	 */
	function parseName(name) {
		var splitted = name.split(":");
		return {
			module: splitted[0],
			namespaces: splitted[1] ? splitted[1].split(",") : []
		};
	}

    return {
        load: function(name, req, onload, config) {
            // Skip the process if i18next resources will not be inlined 
            // or supported languages is not defined
            if (!config.inlineI18next || !config.i18next || !config.i18next.supportedLngs) {
                onload();
                return;
            }

            // Currently, inlining resources is only supported for single file builds 
            if (config.modules.length > 1) {
            	throw new Error("The i18next plugin doesn't support inlining resources for " +
            			"multiple module builds. To proceed, remove the inlineI18next " +
            			"property in the build options.");
            }

            // Setup build options when running for the first time
            if (!options) {
            	options = config.i18next;
            	options.resStore = options.resStore || {};
            }

            var languages, content, url,
                parsedName = parseName(name),
                namespaces = parsedName.namespaces,
                module = parsedName.module,
                resGetPath = options.resGetPath || o.resGetPath,
                defaultNamespace = options.ns || o.ns,
                interpolation = {
                    interpolationPrefix: options.interpolationPrefix || o.interpolationPrefix,
                    interpolationSuffix: options.interpolationSuffix || o.interpolationSuffix
                };

            // Add default namespace to namespaces list
            namespaces.push(defaultNamespace);

            // Check for scoped supported languages value
            languages = options.supportedLngs;
            if (languages[module]) {
            	languages = languages[module];
            }

            // Fix module ending slash
            module += module.substr(module.length-1) !== "/" ? "/" : "";

            // Load all needed resources
            f.each(languages, function(lng, nss) {
            	options.resStore[lng] = options.resStore[lng] || {};
                f.each(nss, function(idx, ns) {
                    if (namespaces.indexOf(ns) !== -1) {
	                	url = req.toUrl(module + f.applyReplacement(resGetPath, {lng: lng, ns: ns}, null, interpolation));
	                	content = JSON.parse(loadFile(url));
	                	options.resStore[lng][ns] = options.resStore[lng][ns] || {};
	                	f.extend(options.resStore[lng][ns], content);
                    }
                });
            });

            onload();
        },

        write: function(pluginName, moduleName, write) {
            if (!initWritten) {
            	initWritten = true;
            	delete options.supportedLngs;
            	write.asModule("i18next-init",
                        "define(['i18next'], function(i18next) {\n" +
                            "\ti18next.init(" + JSON.stringify(options) + ");\n" +
                            "\treturn i18next;\n" +
                        "});");
            }
            write.asModule(pluginName + "!" + moduleName,
	                "define(['i18next-init'], function(i18next) {\n" +
	                    "\treturn i18next;\n" +
	                "});");
        }
    };
});
