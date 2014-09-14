define(['i18n'], function(plugin) {
    var ns = {
        defaultNs: 'translation',
        namespaces: ['translation', 'namespace1', 'namespace2']
    };
    require.config({
        i18next: {
            ns: ns
        }
    });
    var translation = {
        test: 'hello'
    };
    var namespace1 = {
        test: 'hello1'
    };
    var namespace2 = {
        test: 'hello2'
    };
    require(['i18n!../tests'], function(i18n) {
        test('resources', function() {
            deepEqual(plugin.getResources('dev', 'translation'), translation);
            deepEqual(plugin.getResources('dev', 'namespace1'), namespace1);
            deepEqual(plugin.getResources('dev', 'namespace2'), namespace2);
        });
        test('namespaces', function() {
            deepEqual(i18n.options.ns, ns);
        });
        test('translate', function() {
            strictEqual(i18n.t('test'), 'hello');
            strictEqual(i18n.t('namespace1:test'), 'hello1');
            strictEqual(i18n.t('namespace2:test'), 'hello2');
        });
        start();
    });
});
