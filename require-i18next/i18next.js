/**
 * RequireJS i18next Plugin
 * 
 * Version 0.3.0 (12-31-2013)
 * Copyright 2013 Jacob van Mourik
 * Released under the MIT license
 */
define(["i18next"], function(i18next) {
    "use strict";

    var plugin,
        origResGetPath,
        f = i18next.functions,
        o = i18next.options;

    plugin = {
        version: "0.3.0",
        pluginBuilder: "./i18next-builder",

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
            var parsedName = plugin.parseName(name),
            options = config.i18next || {},
            namespaces = parsedName.namespaces,
            dir = parsedName.module,
            url, supportedLngs;

            // Store original resource path when running for the first time
            if (!origResGetPath) {
                origResGetPath = options.resGetPath || o.resGetPath;
            }

            // Define locale URL
            url = req.toUrl(dir + (dir.substr(dir.length-1) !== "/" ? "/" : "") + origResGetPath);

            // Define supported languages
            supportedLngs = options.supportedLngs;
            if (supportedLngs && supportedLngs[dir]) {
                supportedLngs = supportedLngs[dir];
            }

            // Set resource path
            options.resGetPath = url;

            // Set custom load function if supported languages is defined
            if (supportedLngs) {
                options.customLoad = function(lng, ns, opts, done) {
                    var supported;

                    // Check for language and namespace support
                    f.each(supportedLngs, function(language, namespaces) {
                        if (language === lng) {
                            f.each(namespaces, function(idx, namespace) {
                                return !(supported = namespace === ns);
                            });
                        }
                        return !supported;
                    });

                    // Return if language and/or namespace are not supported
                    if (!supported) {
                        f.log("no support found for: " + ns + ":" + lng);
                        done(null, {});
                        return;
                    }

                    // Make the request
                    f.ajax({
                        url: f.applyReplacement(url, {lng: lng, ns: ns}),
                        dataType: "json",
                        async: opts.async,
                        success: function(data, status, xhr) {
                            f.log("loaded: " + url);
                            done(null, data);
                        },
                        error: function(xhr, status, error) {
                            f.log("failed loading: " + url);
                            done(error, {});
                        }
                    });
                };
            }

            // Unset supported languages
            delete options.supportedLngs;

            // Initialize i18next and return the i18next object
            i18next.init(options, function() {
                i18next.loadNamespaces(namespaces, function() {
                    onload(i18next);
                });
            });
        }
    };

    return plugin;
});
