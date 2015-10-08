define(['qunit', 'i18n'], function(QUnit, plugin) {
    var translation = {
        test: 'hello',
        module: {
            test: 'hello'
        }
    };
    var namespace1 = {
        test: 'hello1'
    };
    var namespace2 = {
        test: 'hello2'
    };
    require(['i18n!:namespace1,namespace2'], function(i18n) {
        require(['i18n!module'], function(i18n) {
            QUnit.test('resources', function(assert) {
                assert.deepEqual(i18n.getResourceBundle('en', 'translation'), translation);
                assert.deepEqual(i18n.getResourceBundle('en', 'namespace1'), namespace1);
                assert.deepEqual(i18n.getResourceBundle('en', 'namespace2'), namespace2);
            });
            QUnit.test('namespaces', function(assert) {
                assert.deepEqual(i18n.options.ns, {
                    defaultNs: 'translation',
                    namespaces: ['translation', 'namespace1', 'namespace2']
                });
            });
            QUnit.test('translate', function(assert) {
                assert.strictEqual(i18n.t('test'), translation.test);
                assert.strictEqual(i18n.t('module.test'), translation.module.test);
                assert.strictEqual(i18n.t('namespace1:test'), namespace1.test);
                assert.strictEqual(i18n.t('namespace2:test'), namespace2.test);
            });
            QUnit.start();
        });
    });
});
