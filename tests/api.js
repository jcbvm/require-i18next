define(['i18n'], function(plugin) {
    test('name parsing', function() {
        deepEqual(plugin.parseName('locales'), {
            resPath: 'locales/',
            namespaces: []
        });
        deepEqual(plugin.parseName('locales:ns1'), {
            resPath: 'locales/',
            namespaces: ['ns1']
        });
        deepEqual(plugin.parseName('locales:ns1,ns2'), {
            resPath: 'locales/',
            namespaces: ['ns1', 'ns2']
        });
    });
    test('resources', function() {
        plugin.addResource('locales1', 'en', 'translation', {test1:'test1'});
        plugin.addResource('locales2', 'en', 'translation', {test2:'test2'});
        plugin.addResource('locales1', 'nl', 'translation', {test3:'test3'});
        
        ok(plugin.resourceExists('locales1', 'en', 'translation'));
        ok(plugin.resourceExists('locales2', 'en', 'translation'));
        deepEqual(plugin.getResources('en', 'translation'), {test1:'test1',test2:'test2'});
        
        ok(plugin.resourceExists('locales1', 'nl', 'translation'));
        deepEqual(plugin.getResources('nl', 'translation'), {test3:'test3'});
        
        ok(!plugin.resourceExists('locales1', 'de', 'translation'));
        deepEqual(plugin.getResources('de', 'translation'), {});
    });
    start();
});
