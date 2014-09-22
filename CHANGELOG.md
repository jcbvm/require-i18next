# require-i18next changelog

### v0.4.0 (January 19, 2014)

* [BREAKING] The plugin builder no longer depends on the i18next lib (the lib should be manually added to the final build file), see #5.
* [BUGFIX] Loading additional namespaces several times doesn't work, see #7.
* [BUGFIX] Error when running a build without inlining the resources, see #6.
* Added resource functions to public plugin API.
* Rewrote some small parts.

### v0.3.0 (January 5, 2014)

* [BUGFIX] Fixed some issues related to loading locales from multiple locations.
* [FEATURE] ability to inline locales when optimizing (single file builds), see #4.
* Added builder file for optimization.

### v0.2.1 (December 19, 2013)

* [BUGFIX] Loading additional namespaces several times doesn't work, see #3.

### v0.2.0 (October 13, 2013)

* [BUGFIX] Fixed requirejs build issues (loading will be skipped when building).
* [FEATURE] Added namespaces support to resource name.
* Cleaned up some code.

### v0.1.0 (July 6, 2013)

* Initial release.
