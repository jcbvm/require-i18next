define(['i18n'], function(plugin) {
    var options = {
        resGetPath: 'someResGetPath',
        supportedLngs: {}
    };
    require.config({
        i18next: options
    });
    require(['i18n!'], function(i18n) {
        test('returns i18next instance', function() {
            ok(i18n.init, 'i18n.init');
            ok(i18n.setLng, 'i18n.setLng');
            ok(i18n.preload, 'i18n.preload');
            ok(i18n.addResourceBundle, 'i18n.addResourceBundle');
            ok(i18n.loadNamespace, 'i18n.loadNamespace');
            ok(i18n.loadNamespaces, 'i18n.loadNamespaces');
            ok(i18n.setDefaultNamespace, 'i18n.setDefaultNamespace');
            ok(i18n.t, 'i18n.t');
            ok(i18n.translate, 'i18n.translate');
            ok(i18n.exists, 'i18n.exists');
            ok(i18n.detectLanguage, 'i18n.detectLanguage');
            ok(i18n.pluralExtensions, 'i18n.pluralExtensions');
            ok(i18n.sync, 'i18n.sync');
            ok(i18n.functions, 'i18n.functions');
            ok(i18n.lng, 'i18n.lng');
            ok(i18n.addPostProcessor, 'i18n.addPostProcessor ');
            ok(i18n.options, 'i18n.options');
        });
        test('initializes i18next', function() {
            notEqual(typeof i18n.options.lng, 'undefined');
        });
        test('defines a custom load function', function(assert) {
            equal(typeof i18n.options.customLoad, 'function');
        });
        test('passes given options to i18next', function(assert) {
            strictEqual(i18n.options.resGetPath, options.resGetPath);
        });
        test('does not expose supported languages', function(assert) {
            equal(typeof i18n.options.supportedLngs, 'undefined');
        });
        start();
    });
});
