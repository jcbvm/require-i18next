define(['i18n'], function(plugin) {

    var translations = {
        test: 'hello'
    };
    
    require(['i18n!../tests:namespace1'], function(i18n) {
        
        QUnit.test('resources', function(assert) {
            assert.deepEqual(plugin.getResources('dev', 'translation'), translations, 'translation');
            assert.deepEqual(plugin.getResources('dev', 'namespace1'), translations, 'namespace1');
        });
        
        QUnit.test('namespaces', function(assert) {
            assert.deepEqual(i18n.options.ns, {
                defaultNs: 'translation',
                namespaces: ['translation', 'namespace1']
            }, 'translation, namespace1');
        });
        
        QUnit.test('translate', function(assert) {
            assert.strictEqual(i18n.t('test'), 'hello', "i18n.t('test')");
            assert.strictEqual(i18n.t('namespace1:test'), 'hello', "i18n.t('namespace1:test')");
        });
        
        QUnit.start();
    });
});
