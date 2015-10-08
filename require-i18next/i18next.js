/**
 * RequireJS i18next Plugin
 * 
 * @version 0.6.0
 * @copyright 2013-2015 Jacob van Mourik
 * @license MIT
 */
define(["i18next"], function(i18next) {
    "use strict";

    var plugin,
        defaultNss,
        f = i18next.functions,
        o = i18next.options;

    plugin = {
        version: "0.6.0",
        pluginBuilder: "./i18next-builder",

        /**
         * Parses a resource name into its component parts. 
         * For example: resource:namespace1,namespace2 where resource is the path to
         * the locales and the part after the : the additional namespace(s) to load.
         * 
         * @param {String} name The resource name
         * @returns {Object} Object containing resource path and namespaces
         */
        parseName: function(name) {
            var splitted = name.split(":");
            return {
                resPath: splitted[0] ? splitted[0] + (/\/$/.test(splitted[0]) ? "" : "/") : "",
                namespaces: splitted[1] ? splitted[1].split(",") : []
            };
        },

        load: function(name, req, onload, conf) {
            var config = f.extend({}, conf.i18next),
                parsedName = plugin.parseName(name), 
                resPath = parsedName.resPath, 
                supportedLngs, namespaces;

            // Setup default namespaces if not set yet
            if (!defaultNss) {
				if (!config.ns) {
					defaultNss = o.ns.namespaces.slice();
				} else if (typeof config.ns === "string") {
                    defaultNss = [config.ns];
                } else {
                    defaultNss = config.ns.namespaces.slice();
                }
            }

            // Setup namespaces
            namespaces = defaultNss.slice();
            f.each(parsedName.namespaces, function(idx, val) {
                if (namespaces.indexOf(val) === -1) {
                    namespaces.push(val);
                }
            });

            // Setup (scoped) supported languages
            if (config.supportedLngs) {
                supportedLngs = 
                    config.supportedLngs[resPath] || 
                    config.supportedLngs[resPath.replace(/\/$/,'')] || 
                    config.supportedLngs;
            }

            // Set namespaces
			config.ns = f.extend({}, o.ns);
			f.each(namespaces, function(idx, val) {
				if (config.ns.namespaces.indexOf(val) === -1) {
					config.ns.namespaces.push(val);
				}
			});

            // Set a custom load function
            config.customLoad = function(lng, ns, opts, done) {
				var options = f.extend({}, opts),
					defaultNs = options.ns.defaultNs,
                    fetch = true;

                // Check if given namespace is requested by current module
                if (namespaces.indexOf(ns) === -1) {
                    fetch = false;
                }
                // Check for language/namespace support
                else if (supportedLngs && (!supportedLngs[lng] || supportedLngs[lng].indexOf(ns) === -1)) {
                    f.log("no locale support found for " + lng + " with namespace " + ns);
                    fetch = false;
                }

                if (!fetch) {
                    done(null, i18next.getResourceBundle(lng, ns));
                    return;
                }

                // Define resource url
                options.resGetPath = req.toUrl(resPath + options.resGetPath);

                // Make the request
                i18next.sync._fetchOne(lng, ns, options, function(err, data) {
                    i18next.addResourceBundle(lng, ns, data); // deep extend?
                    done(err, i18next.getResourceBundle(lng, ns));
                });
            };

            // Delete supported languages, they are only needed by this plugin
            delete config.supportedLngs;

            // Initialize i18next and return the i18next instance
            i18next.init(config, function() {
                onload(i18next);
            });
        }
    };

    return plugin;
});