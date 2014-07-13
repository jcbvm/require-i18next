define(['i18n'], function(plugin) {
    var translation = {
        test: 'hello'
    };
    var namespace1 = {
        test: 'hello1'
    };
    var namespace2 = {
        test: 'hello2'
    };
    require(['i18n!../tests'], function() {
        require(['i18n!../tests:namespace1'], function() {
            require(['i18n!../tests:namespace2'], function(i18n) {
                test('resources', function() {
                    deepEqual(plugin.getResources('dev', 'translation'), translation);
                    deepEqual(plugin.getResources('dev', 'namespace1'), namespace1);
                    deepEqual(plugin.getResources('dev', 'namespace2'), namespace2);
                });
                test('namespaces', function() {
                    deepEqual(i18n.options.ns, {
                        defaultNs: 'translation',
                        namespaces: ['translation', 'namespace1', 'namespace2']
                    });
                });
                test('translate', function() {
                    strictEqual(i18n.t('test'), 'hello');
                    strictEqual(i18n.t('namespace1:test'), 'hello1');
                    strictEqual(i18n.t('namespace2:test'), 'hello2');
                });
                start();
            });
        });
    });
});
