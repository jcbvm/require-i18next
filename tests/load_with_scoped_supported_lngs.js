define(['qunit', 'i18n'], function(QUnit, plugin) {
    var enTranslation = {
        test: 'hello',
        module: {
            test: 'hello'
        }
    };
    var nlTranslation = {
        test: 'hallo'
    };
    var nlNamespace1 = {
        test: 'hallo1'
    };
    require.config({
        i18next: {
            lng: 'nl',
            fallbackLng: 'en',
            supportedLngs: {
                '': {
                    en: ['translation'],
                    nl: ['translation', 'namespace1']
                },
                'module': {
                    en: ['translation']
                }
            }
        }
    });
    require(['i18n!:namespace1,namespace2'], function() {
        require(['i18n!module:namespace1,namespace2'], function(i18n) {
            QUnit.test('resources', function(assert) {
                assert.deepEqual(i18n.getResourceBundle('nl', 'translation'), nlTranslation);
                assert.deepEqual(i18n.getResourceBundle('nl', 'namespace1'), nlNamespace1);
                assert.deepEqual(i18n.getResourceBundle('nl', 'namespace2'), {});
                assert.deepEqual(i18n.getResourceBundle('en', 'translation'), enTranslation);
                assert.deepEqual(i18n.getResourceBundle('en', 'namespace1'), {});
                assert.deepEqual(i18n.getResourceBundle('en', 'namespace2'), {});
            });
            QUnit.test('namespaces', function(assert) {
                assert.deepEqual(i18n.options.ns, {
                    defaultNs: 'translation',
                    namespaces: ['translation', 'namespace1', 'namespace2']
                });
            });
            QUnit.test('translate', function(assert) {
                assert.strictEqual(i18n.t('test', {lng: 'nl'}), nlTranslation.test);
                assert.strictEqual(i18n.t('module.test', {lng: 'nl'}), enTranslation.module.test);
                assert.strictEqual(i18n.t('namespace1:test', {lng: 'nl'}), nlNamespace1.test);
                assert.strictEqual(i18n.t('namespace2:test', {lng: 'nl'}), 'namespace2:test');
                assert.strictEqual(i18n.t('test', {lng: 'en'}), enTranslation.test);
                assert.strictEqual(i18n.t('module.test', {lng: 'en'}), enTranslation.module.test);
                assert.strictEqual(i18n.t('namespace1:test', {lng: 'en'}), 'namespace1:test');
                assert.strictEqual(i18n.t('namespace2:test', {lng: 'en'}), 'namespace2:test');
            });
            QUnit.start();
        });
    });
});
