define(['qunit', 'i18n'], function(QUnit, plugin) {
    var translation = {
        test: 'hello'
    };
    require(['i18n!'], function(i18n) {
        QUnit.test('resources', function(assert) {
            assert.deepEqual(i18n.getResourceBundle('en', 'translation'), translation);
        });
        QUnit.test('namespaces', function(assert) {
            assert.deepEqual(i18n.options.ns, {
                defaultNs: 'translation',
                namespaces: ['translation']
            });
        });
        QUnit.test('translate', function(assert) {
            assert.strictEqual(i18n.t('test'), translation.test);
        });
        QUnit.start();
    });
});
