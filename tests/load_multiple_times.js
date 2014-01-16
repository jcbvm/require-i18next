define(['qunit'], function(qunit) {
    require(['i18n!../tests'], function() {
        require(['i18n!../tests:namespace1'], function() {
            require(['i18n!../tests:namespace2'], function(i18n) {
                
                qunit.test('load translations', function(assert) {
                    assert.deepEqual(i18n.options.ns, {
                        defaultNs: 'translation',
                        namespaces: ['translation', 'namespace1', 'namespace2']
                    });
                });
                
                qunit.test('use translations', function(assert) {
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
