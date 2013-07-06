# require-i18next

A [RequireJS](http://requirejs.org) plugin for [i18next](http://i18next.com).

## Usage

The require-i18next plugin makes is able to load locales as dependency in
requirejs by simply using the prefix i18n! followed by a path to the 
directory of your locales.

```javascript
require(["some/module", "i18n!path/to/locales"],
    function(module, i18n) {
        // The i18n variable is an instance of i18next
        // So right here you can for example call i18n.t("some key")
        // to get the translation for "some key"
        // (See the i18next docs for more details)
    }
);
```

Notice that the above path to the locales does not have a trailing slash.
The plugin will do a trailing slash check when defining the path, so you
may include it or not.

## Configuration

### Plugin setup

Below follows a basic example on how to set up the plugin in requirejs.

```javascript
requirejs.config({
    paths: {
        i18next : "path/to/i18next.js",
        i18n    : "path/to/require-i18next.js"
    }
});
```

Now you can use the i18n! prefix to load locales.

NOTE: please make sure "i18next" is defined, as the plugin has a 
dependency on it.

### Basic options

Normally i18next is initialized with options by calling i18next.init().
With this plugin you can define the i18next options in the requirejs
configuration as following:

```javascript
requirejs.config({
    i18next: {
        debug         : true,
        ns            : "messages",
        fallbackLng   : "en",
        detectLngQS   : "locale",
        lowerCaseLng  : true,
        useCookie     : false,
        resGetPath    : "__ns__.__lng__.json"
    }
});
```

The plugin will read these options and will pass it to the init function 
of i18next when loading locales.

### Advanced options

Currently i18next will try to load the locales it has detected from a
user's browser or cookie, first by trying the specific locale, secondly by
trying the unspecific locale and finally by trying the fallback locale. 
So for example when it has detected nl-NL, it will try to load 
nl-NL -> nl -> en (when en is set as fallback language). 

When requesting these locales via ajax calls, i18next will make an ajax 
call for each locale, which is not very optimal.

The plugin therefor adds an extra option to define supported languages and
will prevent making unnecessary ajax calls if requested languages are not
supported:

```javascript
requirejs.config({
    i18next: {
        supportedLngs: {
            en: ["namespace1", "namespace2"],
            nl: ["namespace1"]
        }
    }
});
```

The extra option supportedLngs is an object containing languages with 
namespaces pairs. Now you can define which languages and namespaces you
do support.

It is also possible to give the locales in the option a scope like so:

```javascript
requirejs.config({
    i18next: {
        supportedLngs: {
            "path/to/locales1": {
                en: ["namespace1", "namespace2"],
                nl: ["namespace1"]
            },
            "path/to/locales2": {
                en: ["namespace1"]
            }
        }
    }
});
```

With the above example when loading locales with i18n!path/to/locales1
only the languages defined in the "path/to/locales1" object will be
used as supported languages.

## License

This project is released under the MIT license.