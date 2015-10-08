define(['qunit', 'i18n'], function(QUnit, plugin) {
    var translation = {
        test: 'hello'
    };
    var namespace1 = {
        test: 'hello1'
    };
    var namespace2 = {
        test: 'hello2'
    };
    var ns = {
        defaultNs: 'translation',
        namespaces: ['translation', 'namespace1', 'namespace2']
    };
    require.config({
        i18next: {
            lng: 'en',
            fallbackLng: 'en',
            ns: ns
        }
    });
    require(['i18n!'], function(i18n) {
        QUnit.test('resources', function(assert) {
            assert.deepEqual(i18n.getResourceBundle('en', 'translation'), translation);
            assert.deepEqual(i18n.getResourceBundle('en', 'namespace1'), namespace1);
            assert.deepEqual(i18n.getResourceBundle('en', 'namespace2'), namespace2);
        });
        QUnit.test('namespaces', function(assert) {
            assert.deepEqual(i18n.options.ns, ns);
        });
        QUnit.test('translate', function(assert) {
            assert.strictEqual(i18n.t('test'), translation.test);
            assert.strictEqual(i18n.t('namespace1:test'), namespace1.test);
            assert.strictEqual(i18n.t('namespace2:test'), namespace2.test);
        });
        QUnit.start();
    });
});
