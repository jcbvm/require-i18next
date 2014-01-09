# require-i18next

A [RequireJS](http://requirejs.org) plugin for [i18next](http://i18next.com).

If you are using Handlebars, you might also want to look at my
[i18next Handlebars helper](https://github.com/jcbvm/handlebars-i18next).

## Download

[Latest release](https://github.com/jcbvm/require-i18next/releases/latest)

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

### Loading additional namespaces

With i18next you can load multiple namespaces and refer to them when 
calling translate with a key (for example <code>i18next.t("namespace:key")</code>).

This plugin gives you the option to load additional namespaces 
immediately when loading a locale by doing:

```javascript
require(["some/module", "i18n!path/to/locales:namespace1,namespace2"],
    function(module, i18n) {
        // The additional namespaces "namespace1" and "namespace2" are
        // now loaded and ready for use
    }
);
```

### Special notes

When loading multiple locale files from different locations within the same requirejs module, the locales will be merged. So for example if you load the following locale files:

```javascript
// Locale file 1
{
    "key1": "value1",
    "key2": "value2"
}

// Locale file 2
{
    "key1": "value1",
    "key2": "value2"
}

// Later in the code
i18n.t("key1");
```

The second translations will overwrite the first translations (because the keys are the same). To prevent these overriding, it is always a good idea to put the keys in a separate (unique) scope, so for example:

```javascript
// Locale file 1
{
    "translations1": {
        "key1": "value1",
        "key2": "value2"
    }
}

// Locale file 2
{
    "translations2": {
        "key1": "value1",
        "key2": "value2"
    }
}

// Later in the code
i18n.t("translations1.key1");
```

This way, loading both locales will not override any existing translations within the same namespace.

## Configuration

### Plugin setup

Below follows a basic example on how to set up the plugin in requirejs.

```javascript
requirejs.config({
    map: {
        i18n : "path/to/require-i18next/plugin" // for example require-i18next/i18next
    },
    paths: {
        i18next : "path/to/i18next"
    }
});
```

Now you can use the i18n! prefix to load locales.

Notes:<br>
\- Make sure <i>i18next</i> is defined, as the plugin has a dependency on it.<br>
\- Make sure the <i>i18next-builder</i> file is in the same directory as the plugin file.

### Basic options

Normally i18next is initialized with options by calling i18next.init().
With this plugin you can define the i18next options in the requirejs
configuration as following:

```javascript
requirejs.config({
    i18next: {
        ns           : "messages",
        fallbackLng  : "en",
        detectLngQS  : "locale",
        lowerCaseLng : true,
        useCookie    : false,
        resGetPath   : "__ns__.__lng__.json"
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

With the above example when loading locales with "i18n!path/to/locales1"
only the languages defined in the "path/to/locales1" object will be
used as supported languages.

## Optimization

The plugin supports inlining locales when optimizing your code. 
Within the build process, the plugin will load all resources and add them to the final file. 
After the build process, i18next doesn't have to dynamicly load any locales anymore, but can simply read them from the same file.

Notes:<br>
\- Currently inlining locales is only supported for single file builds<br>
\- The <i>supportedLngs</i> option is needed to inline the locales (see [Advanced Options](#advanced-options))

### Build configuration

```javascript
({
    // Enable inlining locales
    inlineI18next: true, 
    
    // Plugin code is not needed anymore when inlining the locales
    stubModules: ["require-i18next/i18next"], // the path you mapped to the i18n prefix in your config
})
```

## License

This project is released under the MIT license.

<br>[![Bitdeli Badge](https://d2weczhvl823v0.cloudfront.net/jcbvm/require-i18next/trend.png)](https://bitdeli.com/free "Bitdeli Badge")
