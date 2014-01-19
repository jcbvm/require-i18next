define(['qunit', 'i18n'], function(qunit, plugin) {
    require(['i18n!../tests:namespace1'], function(i18n) {
        
        var translations = {
            test: 'hello'
        };
        
        qunit.test('resources', function(assert) {
            assert.deepEqual(plugin.getResources('dev', 'translation'), translations, 'translation');
            assert.deepEqual(plugin.getResources('dev', 'namespace1'), translations, 'namespace1');
        });
        
        qunit.test('namespaces', function(assert) {
            assert.deepEqual(i18n.options.ns, {
                defaultNs: 'translation',
                namespaces: ['translation', 'namespace1']
            }, 'translation, namespace1');
        });
        
        qunit.test('translate', function(assert) {
            assert.strictEqual(i18n.t('test'), 'hello', "i18n.t('test')");
            assert.strictEqual(i18n.t('namespace1:test'), 'hello', "i18n.t('namespace1:test')");
        });
        
        qunit.load();
        qunit.start();
    });
});
