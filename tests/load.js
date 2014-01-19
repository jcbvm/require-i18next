define(['qunit'], function(qunit) {

    var options = {
        resGetPath: 'someResGetPath',
        customOption: 'someCustomOption',
        supportedLngs: {}
    };
    
    require.config({
        i18next: options
    });
    
    require(['i18n!'], function(i18n) {
    
        qunit.test('returns i18next instance', function(assert) {
            assert.ok(i18n.init, 'i18n.init');
            assert.ok(i18n.setLng, 'i18n.setLng');
            assert.ok(i18n.preload, 'i18n.preload');
            assert.ok(i18n.addResourceBundle, 'i18n.addResourceBundle');
            assert.ok(i18n.loadNamespace, 'i18n.loadNamespace');
            assert.ok(i18n.loadNamespaces, 'i18n.loadNamespaces');
            assert.ok(i18n.setDefaultNamespace, 'i18n.setDefaultNamespace');
            assert.ok(i18n.t, 'i18n.t');
            assert.ok(i18n.translate, 'i18n.translate');
            assert.ok(i18n.exists, 'i18n.exists');
            assert.ok(i18n.detectLanguage, 'i18n.detectLanguage');
            assert.ok(i18n.pluralExtensions, 'i18n.pluralExtensions');
            assert.ok(i18n.sync, 'i18n.sync');
            assert.ok(i18n.functions, 'i18n.functions');
            assert.ok(i18n.lng, 'i18n.lng');
            assert.ok(i18n.addPostProcessor, 'i18n.addPostProcessor ');
            assert.ok(i18n.options, 'i18n.options');
        });
        
        qunit.test('initializes i18next', function(assert) {
            assert.notEqual(typeof i18n.options.lng, 'undefined');
        });
        
        qunit.test('defines a custom load function', function(assert) {
            assert.equal(typeof i18n.options.customLoad, 'function');
        });
        
        qunit.test('passes given options to i18next', function(assert) {
            assert.strictEqual(i18n.options.resGetPath, options.resGetPath);
            assert.strictEqual(i18n.options.customOption, options.customOption);
        });
        
        qunit.test('does not expose supported languages', function(assert) {
            assert.equal(typeof i18n.options.supportedLngs, 'undefined');
        });
        
        qunit.load();
        qunit.start();
    });
});
