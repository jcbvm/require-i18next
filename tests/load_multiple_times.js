define(['qunit', 'i18n'], function(qunit, plugin) {
    require(['i18n!../tests'], function() {
        require(['i18n!../tests:namespace1'], function() {
            require(['i18n!../tests:namespace2'], function(i18n) {
                
                var translations = {
                    test: 'hello'
                };
                
                qunit.test('resources', function(assert) {
                    assert.deepEqual(plugin.getResources('dev', 'translation'), translations, 'translation');
                    assert.deepEqual(plugin.getResources('dev', 'namespace1'), translations, 'namespace1');
                    assert.deepEqual(plugin.getResources('dev', 'namespace2'), translations, 'namespace2');
                });
                
                qunit.test('namespaces', function(assert) {
                    assert.deepEqual(i18n.options.ns, {
                        defaultNs: 'translation',
                        namespaces: ['translation', 'namespace1', 'namespace2']
                    }, 'translation, namespace1, namespace2');
                });
                
                qunit.test('translate', function(assert) {
                    assert.strictEqual(i18n.t('test'), 'hello', "i18n.t('test')");
                    assert.strictEqual(i18n.t('namespace1:test'), 'hello', "i18n.t('namespace1:test')");
                    assert.strictEqual(i18n.t('namespace2:test'), 'hello', "i18n.t('namespace2:test')");
                });
                
                qunit.load();
                qunit.start();
            });
        });
    });
});
