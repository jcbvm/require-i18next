define(['i18n'], function(plugin) {
    var translation = {
        test: 'hallo'
    };
    var namespace1 = {
        test: 'hallo1'
    };
    require.config({
        i18next: {
            lng: 'nl',
            fallbackLng: 'en',
            supportedLngs: {
                nl: ['translation', 'namespace1']
            }
        }
    });
    require(['i18n!:namespace1,namespace2'], function(i18n) {
        test('resources', function() {
            deepEqual(plugin.getResources('nl', 'translation'), translation);
            deepEqual(plugin.getResources('nl', 'namespace1'), namespace1);
            deepEqual(plugin.getResources('nl', 'namespace2'), {});
            deepEqual(plugin.getResources('en', 'translation'), {});
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
            strictEqual(i18n.t('test'), translation.test);
            strictEqual(i18n.t('namespace1:test'), namespace1.test);
            strictEqual(i18n.t('namespace2:test'), 'namespace2:test');
        });
        start();
    });
});
