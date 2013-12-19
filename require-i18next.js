/* RequireJS i18next Plugin
 * 
 * Version 0.3.0 (10-13-2013)
 * Copyright 2013 Jacob van Mourik
 * Released under the MIT license
 */
define(["i18next"], function(i18next) {
    "use strict";
    
    var plugin, resGetPath, 
    	f = i18next.functions;
    
    /**
     * Checks if the given language and namespace are supported.
     * 
     * @param {String} lng The language to check
     * @param {String} ns The namespace to check
     * @param {Object} supportedLngs Object containing supported languages/namespaces 
     * @returns {Boolean} Whether the given language and namespace are supported
     */
    function checkSupport(lng, ns, supportedLngs) {
        var supported = false;
        f.each(supportedLngs, function(language, namespaces) {
            if (language === lng) {
                f.each(namespaces, function(idx, namespace) {
                    return !(supported = namespace === ns);
                });
            }
            return !supported;
        });
        return supported;
    }
    
    /**
     * Initializes i18next with given options and namespaces.
     * 
     * @param {Object} options I18next options
     * @param {Array} namespaces Additional namespaces to load
     * @param {Function} callback Callback function to call when done initializing
     */
    function initI18next(options, namespaces, callback) { 
        i18next.init(options, function() {
            if (namespaces) {
                // Load additional namespaces
                i18next.loadNamespaces(namespaces, callback);
            } else {
                callback && callback();
            }
        });
    }
    
    plugin = {
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
            name = name.split(":");
            return {
                module: name[0] + (name[0].substr(name[0].length-1, 1) !== "/" ? "/" : ""),
                namespaces: name[1] ? name[1].split(",") : null
            };
        },
        
        /**
         * Loads an i18next resource.
         * 
         * @param {String} name The name of the resource to load
         * @param {Function} req A local "require" function to use to load other modules
         * @param {Function} onload A function to call with the value for name
         * @param {Object} config A configuration object
         * @returns {Object} The i18next object
         */
        load: function(name, req, onload, config) {
        	
        	// Skip the process if we are in a build environment
            if (config.isBuild) {
                onload();
                return;
            }
            
            // Pull in i18next's options
            var options = i18next.options;
            
    		// Do some setup when we run this plugin for the first time
            if (!resGetPath) {
            	
            	// Overwrite i18next options with config from requirejs
            	f.extend(options, config.i18next);
            	
            	// Save original resGetPath
            	resGetPath = options.resGetPath;
            }
            
            // Parse the resource name
            name = plugin.parseName(name);
            
            // Set the resource path
            options.resGetPath = req.toUrl(name.module + resGetPath);
            
            // If supportedLngs is defined, we want to do a custom load
            if (options.supportedLngs) {
                
                // We'll define a custom load function here which will be called 
                // by i18next on each request
                options.customLoad = function(lng, ns, opts, done) {
                    var url, supportedLngs = options.supportedLngs;
                    
                    // Check for a scoped value
                    if (supportedLngs[name.module]) {
                        supportedLngs = supportedLngs[name.module];
                    }
                    
                    // Return if the language and/or namespace are not supported
                    if (!checkSupport(lng, ns, supportedLngs)) {
                        f.log("no support found for: " + ns + ":" + lng);
                        done(null, {});
                        return;
                    }
                    
                    // Apply the requested language and namespace to the resource path
                    url = f.applyReplacement(options.resGetPath, {lng: lng, ns: ns});
                    
                    // Make the request
                    f.ajax({
                        url: url,
                        dataType: "json",
                        async: options.getAsync,
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
            
            // Initialize i18next and return the i18next object
            initI18next(options, name.namespaces, function() {
                onload(i18next);
            });
        }
    };
    
    return plugin;
});
