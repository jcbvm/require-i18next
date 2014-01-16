define(['qunit', 'i18n'], function(qunit, plugin) {

    qunit.test('parsing name "locales"', function(assert) {
        assert.deepEqual(plugin.parseName('locales'), {
            module: 'locales',
            namespaces: []
        });
    });
    
    qunit.test('parsing name "locales:ns1"', function(assert) {
        assert.deepEqual(plugin.parseName('locales:ns1'), {
            module: 'locales',
            namespaces: ['ns1']
        });
    });
    
    qunit.test('parsing name "locales:ns1,ns2"', function(assert) {
        assert.deepEqual(plugin.parseName('locales:ns1,ns2'), {
            module: 'locales',
            namespaces: ['ns1', 'ns2']
        });
    });
    
    qunit.test('resources', function(assert) {
        plugin.addResource('locales', 'en', 'translation', {hello:'bye'});
        
        assert.ok(plugin.resourceExists('locales', 'en', 'translation'));
        assert.ok(!plugin.resourceExists('', 'en', 'translation'));
        assert.ok(!plugin.resourceExists('locales', '', 'translation'));
        assert.ok(!plugin.resourceExists('locales', 'en', ''));
        
        assert.deepEqual(plugin.getResources('en', 'translation'), {hello:'bye'});
        assert.deepEqual(plugin.getResources('', 'translation'), {});
        assert.deepEqual(plugin.getResources('en', ''), {});
    });
    
    qunit.load();
    qunit.start();
});
