define(['qunit', 'i18n!../tests:namespace1'], function(qunit, i18n) {
    
    qunit.test("load translations", function(assert) {
        assert.deepEqual(i18n.options.ns, {
            defaultNs: 'translation',
            namespaces: ['translation', 'namespace1']
        });
    });
    
    qunit.test("use translations", function(assert) {
        assert.strictEqual(i18n.t('test'), 'hello', "i18n.t('test')");
        assert.strictEqual(i18n.t('namespace1:test'), 'hello', "i18n.t('namespace1:test')");
    });
    
    qunit.load();
    qunit.start();
});
