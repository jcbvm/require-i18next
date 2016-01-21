# require-i18next [![Build Status](https://travis-ci.org/jcbvm/require-i18next.svg?branch=master)](https://travis-ci.org/jcbvm/require-i18next) [![devDependency Status](https://david-dm.org/jcbvm/require-i18next/dev-status.svg)](https://david-dm.org/jcbvm/require-i18next#info=devDependencies)

A [RequireJS](http://requirejs.org) plugin for requiring and optimizing translations using [i18next](http://i18next.com).

<strong>NOTE: This plugin does not (yet) support i18next version 2.x</strong>

The plugin supports both [RequireJS](http://requirejs.org) and [Almond](https://github.com/jrburke/almond).

- [Usage](#usage)
  - [Loading locales](#loading-locales)
  - [Loading additional namespaces](#loading-additional-namespaces)
  - [Special notes](#special-notes)
- [Setup and Configuration](#setup-and-configuration)
  - [Setup plugin](#setup-plugin)
  - [Basic configuration](#basic-configuration)
  - [Advanced configuration](#advanced-configuration)
- [Optimization](#optimization)
  - [Inlining locales](#inlining-locales)
    - [Single module build configuration](#single-module-build-configuration)
    - [Multiple module build configuration](#multiple-module-build-configuration)
- [Download](#download)
- [Changelog](#changelog)
- [License](#license)

## Usage

### Loading locales

The require-i18next plugin makes is able to load locales as dependency in
requirejs by simply using the prefix i18n! followed by a path to the 
directory of your locales.

```javascript
require(["some/module", "i18n!path/to/locales"], function(module, i18n) {
    // The i18n variable is an instance of i18next
    // So right here you can for example call i18n.t("some_key")
    // to get the translation for "some_key"
    // (See the i18next docs for more details)
});
```

### Loading additional namespaces

With i18next you can load multiple namespaces and refer to them when 
calling translate with a key (for example <code>i18next.t("namespace:key")</code>).

This plugin gives you the option to load additional namespaces 
immediately when loading a locale by doing:

```javascript
require(["some/module", "i18n!path/to/locales:namespace1,namespace2"], function(module, i18n) {
    // The additional namespaces "namespace1" and "namespace2" are now loaded
    // So right now we can for example call i18n.t("namespace1:some_key")
    // to get the translation for "some_key" in namespace "namespace1"
    // (See the i18next docs for more details)
});
```

### Special notes

When loading multiple locale files from different locations within the same requirejs module, the locales will be merged. So for example if you load the following locale files in the same module:

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

## Setup and Configuration

### Setup plugin

Below follows a basic example on how to set up the plugin in requirejs.

```javascript
requirejs.config({
    map: {
        "*": {
            i18n: "path/to/require/i18next/plugin"
        }
    },
    paths: {
        i18next: "path/to/i18next"
    }
});
```

Now you can use the i18n! prefix to load locales.

### Basic configuration

Normally i18next is initialized with options by calling i18next.init().This plugin makes it able to define the i18next options in the requirejs configuration:

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

The plugin will pass the options to i18next when loading locales.

### Advanced configuration

Currently i18next will try to load the locales it has detected from a user's browser or cookie, first by trying the specific locale, secondly by trying the unspecific locale and finally by trying the fallback locale. So for example when it has detected nl-NL, it will try to load nl-NL -> nl -> en (when en is set as fallback language). So it tries to load each locale, even if you don't have support for one of them. 

The plugin adds an extra option "supportedLngs" to define the languages and namespaces you do support and will only try to load a locale if it is supported. 

The supported languages can be defined by languages and namespaces pairs:

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

It is also possible to define the supported languages with a scope:

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

With the above example when loading locales with "i18n!path/to/locales1"only the languages defined in the "path/to/locales1" scope will be used as supported languages.

## Optimization

### Inlining locales

The plugin supports inlining of locales when optimizing with requirejs. When inlining, the plugin will load all the locale files used in each module and add them to the final build file. After the build process, i18next doesn't have to dynamicly load any locales anymore.

**Note:** the <i>supportedLngs</i> option is needed for inlining locales (see [Advanced configuration](#advanced-configuration))

#### Single module build configuration

```javascript
({
    // Enable inlining locales
    inlineI18next: true, 
    
    // Plugin code is not needed anymore when inlining locales
    stubModules: ["path/to/require/i18next/plugin"],
    
    // Add the i18next lib as dependency to the module
    // (it is not included by the plugin when building)
    shim: {
        "main": ["i18next"]
    },
    
    // The name of the module to build
    name: "main",
    
    ...
})
```

#### Multiple module build configuration

```javascript
({
    // Enable inlining locales
    inlineI18next: true, 
    
    // Plugin code is not needed anymore when inlining locales
    stubModules: ["path/to/require/i18next/plugin"],
    
    // Add the i18next lib as dependency to the modules which use the plugin
    // (it is not included by the plugin when building)
    shim: {
        "first": ["i18next"],
        "second": ["i18next"]
    },
    
    // The modules to build
    modules: [
        {
            name: "first"
        }, 
        {
            name: "second"
        }
    ],
    
    ...
})
```

## Download

[Latest release](https://github.com/jcbvm/require-i18next/releases/latest)

## Changelog

[Changelog](https://github.com/jcbvm/require-i18next/blob/master/CHANGELOG.md)

## License

This project is released under the MIT license.
