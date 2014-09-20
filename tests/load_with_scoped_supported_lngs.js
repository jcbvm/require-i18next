define(['i18n'], function(plugin) {
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
                '../tests/': { // test with ending slash
                    en: ['translation'],
                    nl: ['translation', 'namespace1']
                },
                '../tests/module': { // test without ending slash
                    en: ['translation']
                }
            }
        }
    });
    require(['i18n!../tests:namespace1,namespace2'], function() {
        require(['i18n!../tests/module:namespace1,namespace2'], function(i18n) {
            test('resources', function() {
                deepEqual(plugin.getResources('nl', 'translation'), nlTranslation);
                deepEqual(plugin.getResources('nl', 'namespace1'), nlNamespace1);
                deepEqual(plugin.getResources('nl', 'namespace2'), {});
                deepEqual(plugin.getResources('en', 'translation'), enTranslation);
                deepEqual(plugin.getResources('en', 'namespace1'), {});
                deepEqual(plugin.getResources('en', 'namespace2'), {});
            });
            test('namespaces', function() {
                deepEqual(i18n.options.ns, {
                    defaultNs: 'translation',
                    namespaces: ['translation', 'namespace1', 'namespace2']
                });
            });
            test('translate', function() {
                strictEqual(i18n.t('test', {lng: 'nl'}), nlTranslation.test);
                strictEqual(i18n.t('module.test', {lng: 'nl'}), enTranslation.module.test);
                strictEqual(i18n.t('namespace1:test', {lng: 'nl'}), nlNamespace1.test);
                strictEqual(i18n.t('namespace2:test', {lng: 'nl'}), 'namespace2:test');
                strictEqual(i18n.t('test', {lng: 'en'}), enTranslation.test);
                strictEqual(i18n.t('module.test', {lng: 'en'}), enTranslation.module.test);
                strictEqual(i18n.t('namespace1:test', {lng: 'en'}), 'namespace1:test');
                strictEqual(i18n.t('namespace2:test', {lng: 'en'}), 'namespace2:test');
            });
            start();
        });
    });
});
