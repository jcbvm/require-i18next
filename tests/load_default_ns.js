define(['i18n'], function(plugin) {
    var translation = {
        test: 'hello'
    };
    require(['i18n!'], function(i18n) {
        test('resources', function() {
            deepEqual(plugin.getResources('en', 'translation'), translation);
        });
        test('namespaces', function() {
            deepEqual(i18n.options.ns, {
                defaultNs: 'translation',
                namespaces: ['translation']
            });
        });
        test('translate', function() {
            strictEqual(i18n.t('test'), translation.test);
        });
        start();
    });
});
