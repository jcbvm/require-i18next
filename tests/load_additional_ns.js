define(['i18n'], function(plugin) {
    var translation = {
        test: 'hello'
    };
    var namespace1 = {
        test: 'hello1'
    };
    require(['i18n!../tests:namespace1'], function(i18n) {
        test('resources', function() {
            deepEqual(plugin.getResources('dev', 'translation'), translation);
            deepEqual(plugin.getResources('dev', 'namespace1'), namespace1);
        });
        test('namespaces', function() {
            deepEqual(i18n.options.ns, {
                defaultNs: 'translation',
                namespaces: ['translation', 'namespace1']
            });
        });
        test('translate', function() {
            strictEqual(i18n.t('test'), 'hello');
            strictEqual(i18n.t('namespace1:test'), 'hello1');
        });
        start();
    });
});
