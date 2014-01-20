define(['i18n'], function(plugin) {

    QUnit.test('name parsing', function(assert) {
        assert.deepEqual(plugin.parseName('locales'), {
            module: 'locales',
            namespaces: []
        }, 'locales');
        assert.deepEqual(plugin.parseName('locales:ns1'), {
            module: 'locales',
            namespaces: ['ns1']
        }, 'locales:ns1');
        assert.deepEqual(plugin.parseName('locales:ns1,ns2'), {
            module: 'locales',
            namespaces: ['ns1', 'ns2']
        }, 'locales:ns1,ns2');
    });
    
    QUnit.test('resources', function(assert) {
        plugin.addResource('locales1', 'en', 'translation', {test1:'test1'});
        plugin.addResource('locales2', 'en', 'translation', {test2:'test2'});
        plugin.addResource('locales1', 'nl', 'translation', {test3:'test3'});
        
        assert.ok(plugin.resourceExists('locales1', 'en', 'translation'));
        assert.ok(plugin.resourceExists('locales2', 'en', 'translation'));
        assert.deepEqual(plugin.getResources('en', 'translation'), {test1:'test1',test2:'test2'});
        
        assert.ok(plugin.resourceExists('locales1', 'nl', 'translation'));
        assert.deepEqual(plugin.getResources('nl', 'translation'), {test3:'test3'});
        
        assert.ok(!plugin.resourceExists('locales1', 'de', 'translation'));
        assert.deepEqual(plugin.getResources('de', 'translation'), {});
    });
    
    QUnit.start();
});
