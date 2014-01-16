define(['qunit', 'i18n!../tests'], function(qunit, i18n) {
    
    qunit.test("load translation", function(assert) {
        assert.deepEqual(i18n.options.ns, {
            defaultNs: 'translation',
            namespaces: ['translation']
        });
    });
    
    qunit.test("use translation", function(assert) {
        assert.strictEqual(i18n.t('test'), 'hello', "i18n.t('test')");
    });
    
    qunit.load();
    qunit.start();
});
