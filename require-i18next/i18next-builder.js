/**
 * RequireJS i18next Plugin (builder)
 * 
 * Version 0.3.0 (12-31-2013)
 * Copyright 2013 Jacob van Mourik
 * Released under the MIT license
 */
define(["i18next"], function(i18next) {
    "use strict";

    var builder,
        initWritten,
        options,
        resources = {},
        supportedLngs,
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

    builder = {
        version: "0.3.0",

        /**
         * Parses a resource name into its component parts. 
         * For example: resource:namespace1,namespace2 where resource is the path to
         * the locales and the part after the : the additional namespace(s) to load.
         * 
         * @param {String} name The resource name
         * @returns {Object} Object containing module name and namespaces
         */
        parseName: function(name) {
            var splitted = name.split(":");
            return {
                module: splitted[0],
                namespaces: splitted[1] ? splitted[1].split(",") : []
            };
        },

        load: function(name, req, onload, config) {
            // Skip the process if i18next resources will not be inlined 
            // or supported languages is not defined
            if (!config.inlineI18next || !config.i18next || !config.i18next.supportedLngs) {
                onload();
                return;
            }

            // Setup build options when running for the first time
            if (!options) {
                options = config.i18next;
                options.resStore = options.resStore || {};
                supportedLngs = options.supportedLngs;
                delete options.supportedLngs;
            }

            var languages, content, url,
                parsedName = builder.parseName(name),
                namespaces = parsedName.namespaces,
                dir = parsedName.module,
                resGetPath = options.resGetPath || o.resGetPath,
                defaultNamespace = options.ns || o.ns;
                interpolation = {
                    interpolationPrefix: options.interpolationPrefix || o.interpolationPrefix,
                    interpolationSuffix: options.interpolationSuffix || o.interpolationSuffix
                };

            // Define resource URL
            url = req.toUrl(dir + (dir.substr(dir.length-1) !== "/" ? "/" : "") + resGetPath);

            // Define languages to load
            languages = supportedLngs;
            if (languages[dir]) {
                languages = languages[dir];
            } 

            // Load all needed resources
            resources[name] = {};
            f.each(languages, function(lng, nss) {
                resources[name][lng] = {};
                f.each(nss, function(idx, ns) {
                    if (ns === defaultNamespace || namespaces.indexOf(ns) !== -1) {
                        content = loadFile(f.applyReplacement(url, {lng: lng, ns: ns}, null, interpolation));
                        resources[name][lng][ns] = JSON.parse(content);
                    }
                });
            });

            onload();
        },

        write: function(pluginName, moduleName, write) {
            if (!resources.hasOwnProperty(moduleName)) {
                return;
            }
            // Write out module which initializes i18next (only ones)
            if (!initWritten) {
                initWritten = true;
                write.asModule("i18next-init",
                    "define(['i18next'], function(i18next) {\n" +
                        "\ti18next.init(" + JSON.stringify(options) + ");\n" +
                        "\treturn i18next;\n" +
                    "});");
            }
            // Write out module which adds the loaded resources to i18next
            write.asModule(pluginName + "!" + moduleName,
                "define(['i18next-init'], function(i18next) {\n" +
                    "\tvar f = i18next.functions;\n" +
                    "\tvar resources = " + JSON.stringify(resources[moduleName]) + ";\n" +
                    "\tf.each(resources, function(lng, nss) {\n" +
                        "\t\tf.each(nss, function(idx, ns) {\n" +
                            "\t\t\ti18next.addResourceBundle(lng, ns, resources[lng][ns]);\n" +
                        "\t\t});\n" +
                    "\t});\n" +
                    "\treturn i18next;\n" +
                "});");
        }
    };

    return builder;
});
