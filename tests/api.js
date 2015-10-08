define(['qunit', 'i18n'], function(QUnit, plugin) {
    QUnit.test('name parsing', function(assert) {
        assert.deepEqual(plugin.parseName('locales'), {
            resPath: 'locales/',
            namespaces: []
        });
        assert.deepEqual(plugin.parseName('locales:ns1'), {
            resPath: 'locales/',
            namespaces: ['ns1']
        });
        assert.deepEqual(plugin.parseName('locales:ns1,ns2'), {
            resPath: 'locales/',
            namespaces: ['ns1', 'ns2']
        });
    });
    QUnit.start();
});
