/* RequireJS i18next Plugin
 * 
 * Version 0.1.0
 * Copyright 2013 Jacob van Mourik
 * Released under the MIT license
 */
define({
    load: function(path, req, onload, config) {
        "use strict";
        
        req(["i18next"], function(i18next) {
            var f = i18next.functions,
                o = i18next.options,
                options = config.i18next || {};
            
            // Set the resource path (including `path` and requirejs's `urlArgs` if set)
            options.resGetPath = path
                    + (path.substr(path.length-1, 1) !== "/" ? "/" : "")
                    + (options.resGetPath || o.resGetPath)
                    + (config.urlArgs ? "?" + config.urlArgs : "");
            
            // If supportedLngs is defined, we want to do a custom load
            if (options.supportedLngs) {
                
                // Function to check if the supportedLngs object is scoped by locations,
                // otherwise it is just an object with `language : namespace` definitions
                var isScoped = function(obj) {
                    var result = false;
                    f.each(obj, function(key, val) {
                        result = toString.call(val) != "[object Array]";
                        return false;
                    });
                    return result;
                };
                
                // Get the supported languages by checking the scope,
                // if scoped, we only want to get the supported languages for `path`
                options.supportedLngs = isScoped(options.supportedLngs)
                        ? options.supportedLngs[path]
                        : options.supportedLngs;
                
                // We"ll define a custom load function here which will be called 
                // by i18next on each request
                options.customLoad = function(lng, ns, opts, done) {
                    var found = false;
                    
                    // Check if the requested language and namespace are supported
                    f.each(opts.supportedLngs, function(language, namespaces) {
                        if (language === lng) {
                            f.each(namespaces, function(idx, namespace) {
                                return !(found = namespace === ns);
                            });
                        }
                        return !found;
                    });
                    
                    // Return if we did not found any match
                    if (!found) {
                        f.log("no support found for: " + ns + ":" + lng);
                        done(null, {});
                        return;
                    }
                    
                    // Otherwise, make an ajax call
                    var url = f.applyReplacement(opts.resGetPath, {lng: lng, ns: ns});
                    f.ajax({
                        url: url,
                        dataType: "json",
                        async: opts.getAsync,
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
            
            // Initialize i18next with the options defined above
            // Returns the i18next object to the instance which made the request
            i18next.init(options, function() {
                onload(i18next);
            });
        });
    }
});