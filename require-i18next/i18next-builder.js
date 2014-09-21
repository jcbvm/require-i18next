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
        defaultNss,
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
     * @returns {Object} Object containing resource path and namespaces
     */
    function parseName(name) {
        var splitted = name.split(":");
        return {
            resPath: splitted[0] ? splitted[0] + (/\/$/.test(splitted[0]) ? "" : "/") : "",
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

            var parsedName = parseName(name),
                resPath = parsedName.resPath,
                supportedLngs, namespaces, url, content;

            // Initialize data
            if (!data) {
                data = config.i18next;
                extend(options, data);
            }

            // Initialize default namespaces
            if (!defaultNss) {
                if (typeof options.ns == "string") {
                    defaultNss = [options.ns];
                } else {
                    defaultNss = options.ns.namespaces;
                }
            }

            // Setup namespaces
            namespaces = defaultNss.slice();
            each(parsedName.namespaces, function(val) {
                if (namespaces.indexOf(val) == -1) {
                    namespaces.push(val);
                }
            });

            // Setup (scoped) supported languages
            if (options.supportedLngs) {
                supportedLngs = 
                    options.supportedLngs[resPath] || 
                    options.supportedLngs[resPath.replace(/\/$/,'')] || 
                    options.supportedLngs;
            }

            // Load all needed resources
            options.resStore = options.resStore || {};
            each(supportedLngs, function(nss, lng) {
                options.resStore[lng] = options.resStore[lng] || {};
                each(nss, function(ns) {
                    if (namespaces.indexOf(ns) !== -1) {
                        url = req.toUrl(resPath + options.resGetPath
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
