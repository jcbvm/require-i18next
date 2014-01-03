/**
 * RequireJS i18next Plugin
 * 
 * Version 0.3.0 (01-03-2013)
 * Copyright 2013 Jacob van Mourik
 * Released under the MIT license
 */
define([ "i18next" ], function(i18next) {
    "use strict";

    var plugin, 
        defaultNamespace, 
        supportedLngs, 
        resStore = {}, 
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
                module : splitted[0],
                namespaces : splitted[1] ? splitted[1].split(",") : []
            };
        },

        load: function(name, req, onload, config) {
            var parsedName = plugin.parseName(name), 
                options = config.i18next, 
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

            // Fix module ending slash
            module += module.substr(module.length - 1) !== "/" ? "/" : "";

            // Backup existing namespaces, so we can restore them when new ones are loaded
            namespaces.push(defaultNamespace);
            f.each(resStore, function(lng, nss) {
                f.each(nss, function(ns) {
                    if (resStore[lng][ns]) {
                        resStore[lng]['_' + ns] = resStore[lng][ns];
                        delete resStore[lng][ns];
                    }
                });
            });

            // Set the existing resources
            options.resStore = resStore;

            // Set a custom load function
            options.customLoad = function(lng, ns, opts, done) {
                var supported, url;

                if (supportedLngs) {
                    f.each(supportedLngs, function(language, namespaces) {
                        if (language === lng) {
                            f.each(namespaces,function(idx, namespace) {
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
                url = req.toUrl(module + f.applyReplacement(opts.resGetPath, {lng : lng, ns : ns}));

                f.ajax({
                    url : url,
                    dataType : "json",
                    async : opts.async,
                    success : function(data, status, xhr) {
                        f.log("loaded: " + url);
                        resStore[lng] = resStore[lng] || {};
                        resStore[lng][ns] = data;
                        if (resStore[lng]['_' + ns]) {
                            f.extend(resStore[lng][ns], resStore[lng]['_' + ns]);
                            delete resStore[lng]['_' + ns];
                        }
                        done(null, resStore[lng][ns]);
                    },
                    error : function(xhr, status, error) {
                        f.log("failed loading: " + url);
                        done(error, {});
                    }
                });
            };

            // Delete supported languages, they are only needed by this plugin
            delete options.supportedLngs;

            // Initialize i18next and load all needed resources
            i18next.init(options, function() {
                i18next.loadNamespaces(namespaces, function() {
                    onload(i18next);
                });
            });
        }
    };

    return plugin;
});
