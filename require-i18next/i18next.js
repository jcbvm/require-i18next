/**
 * RequireJS i18next Plugin
 * 
 * Version 0.3.0 (01-05-2013)
 * Copyright 2013 Jacob van Mourik
 * Released under the MIT license
 */
define(["i18next"], function(i18next) {
    "use strict";

    var plugin,
        defaultNamespace,
        supportedLngs,
        resStore = {},
        f = i18next.functions,
        o = i18next.options;

    /**
     * Checks to see if there exists a resource with the given 
     * module, language and namespace in the store. 
     * 
     * @param {String} module The module name
     * @param {String} lng The language
     * @param {String} ns The namespace
     * @returns {Boolean} If the resource exists in the store
     */
    function resourceExists(module, lng, ns) {
        return resStore[module] && resStore[module][lng] && resStore[module][lng][ns];
    }

    /**
     * Adds a resource to the store (overrides existing one).
     * 
     * @param {String} module The module name
     * @param {String} lng The language
     * @param {String} ns The namespace
     * @param {Object} data The resource data
     */
    function addResource(module, lng, ns, data) {
        resStore[module] = resStore[module] || {};
        resStore[module][lng] = resStore[module][lng] || {};
        resStore[module][lng][ns] = data;
    }

    /**
     * Gets all resources by the given language and namespace.
     * 
     * @param {String} lng The language
     * @param {String} ns The namespace
     * @returns {Object} The resource data
     */
    function getResources(lng, ns) {
        var data = {};
        f.each(resStore, function(module) {
            if (resStore[module][lng] && resStore[module][lng][ns]) {
                f.extend(data, resStore[module][lng][ns]);
            }
        });
        return data;
    }

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
                options = f.extend({}, config.i18next), 
                namespaces = parsedName.namespaces, 
                module = parsedName.module, 
                supportedLngs = options.supportedLngs;

            // Store default namespace if not done yet
            if (!defaultNamespace) {
                defaultNamespace = options.ns || o.ns;
            }

            // Check for scoped supported languages value
            if (supportedLngs && supportedLngs[module]) {
                supportedLngs = supportedLngs[module];
            }

            // Set the namespaces
            namespaces.push(defaultNamespace);
            options.ns = { 
                namespaces: namespaces, 
                defaultNs: defaultNamespace
            };

            // Set a custom load function
            options.customLoad = function(lng, ns, opts, done) {
                var supported, url;

                // Check for already loaded resource
                if (resourceExists(module, lng, ns)) {
                    done(null, getResources(lng, ns));
                    return;
                }

                // Check for language/namespace support
                if (supportedLngs) {
                    f.each(supportedLngs, function(language, namespaces) {
                        if (language === lng) {
                            f.each(namespaces, function(idx, namespace) {
                                return !(supported = namespace === ns);
                            });
                        }
                        return !supported;
                    });
                    if (!supported) {
                        f.log("no support found for: " + ns);
                        done(null, {});
                        return;
                    } 
                }

                // Define resource url
                url = req.toUrl(module + (module.substr(module.length - 1) !== "/" ? "/" : "") + 
                        f.applyReplacement(opts.resGetPath, {lng : lng, ns : ns}));

                // Make the request
                f.ajax({
                    url: url,
                    dataType: "json",
                    async: opts.async,
                    success: function(data, status, xhr) {
                        addResource(module, lng, ns, data);
                        f.log("loaded: " + url);
                        done(null, getResources(lng, ns));
                    },
                    error: function(xhr, status, error) {
                        f.log("failed loading: " + url);
                        done(error, {});
                    }
                });
            };

            // Delete supported languages, they are only needed by this plugin
            delete options.supportedLngs;

            // Initialize i18next and return the i18next instance
            i18next.init(options, function() {
                onload(i18next);
            });
        }
    };

    return plugin;
});
