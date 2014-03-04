/**
 * RequireJS i18next Plugin (builder)
 * 
 * @version 0.4.0
 * @copyright 2013-2014 Jacob van Mourik
 * @license MIT
 */
(function() {
    "use strict";

    var data,
        dataWritten,
        options = {
            ns: "translation",
            resGetPath: "locales/__lng__/__ns__.json",
            interpolationPrefix: "__",
            interpolationSuffix: "__"
        };

    // Based on underscore.js
    function each(obj, iterator, context) {
        if (!obj) return;
        if (obj.length === +obj.length) {
            for (var i = 0, length = obj.length; i < length; i++) {
                iterator.call(context, obj[i], i);
            }
        } else {
            for (var prop in obj) {
                iterator.call(context, obj[prop], prop);
            }
        }
    }

    // Based on underscore.js
    function extend(obj) {
        each(Array.prototype.slice.call(arguments, 1), function(source) {
            if (source) {
                for (var prop in source) {
                    obj[prop] = source[prop];
                }
            }
        });
        return obj;
    }

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
                input = new java.io.BufferedReader(new java.io.InputStreamReader(new java.io.FileInputStream(file), "utf-8"));
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

    define({
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

            var languages, url, content,
                parsedName = parseName(name),
                namespaces = parsedName.namespaces,
                module = parsedName.module;

            // Setup options when running for the first time
            if (!data) {
                data = config.i18next;
                extend(options, data);
            }

            // Add default namespace to namespaces list
            namespaces.push(options.ns);

            // Check for scoped supported languages value
            languages = options.supportedLngs;
            if (languages[module]) {
                languages = languages[module];
            }

            // Fix module ending slash
            module += module.substr(module.length-1) !== "/" ? "/" : "";

            // Load all needed resources
            options.resStore = options.resStore || {};
            each(languages, function(nss, lng) {
                options.resStore[lng] = options.resStore[lng] || {};
                each(nss, function(ns) {
                    if (namespaces.indexOf(ns) !== -1) {
                        url = req.toUrl(module + options.resGetPath
                                .replace(options.interpolationPrefix + "ns" + options.interpolationSuffix, ns)
                                .replace(options.interpolationPrefix + "lng" + options.interpolationSuffix, lng));
                        content = JSON.parse(loadFile(url));
                        options.resStore[lng][ns] = options.resStore[lng][ns] || {};
                        extend(options.resStore[lng][ns], content);
                    }
                });
            });

            onload();
        },

        write: function(pluginName, moduleName, write) {
            if (!data) return;
            if (!dataWritten) {
                dataWritten = true;
                data.resStore = options.resStore;
                delete data.supportedLngs;
                write.asModule("i18next-init",
                        "define(['i18next'], function(i18next) {\n" +
                            "\ti18next.init(" + JSON.stringify(data) + ");\n" +
                            "\treturn i18next;\n" +
                        "});");
            }
            write.asModule(pluginName + "!" + moduleName,
                    "define(['i18next-init'], function(i18next) {\n" +
                        "\treturn i18next;\n" +
                    "});");
        }
    });
})();
