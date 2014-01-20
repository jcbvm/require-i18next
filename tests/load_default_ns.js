define(['i18n'], function(plugin) {
    
    var translations = {
        test: 'hello'
    };
    
    require(['i18n!../tests'], function(i18n) {
    
        QUnit.test('resources', function(assert) {
            assert.deepEqual(plugin.getResources('dev', 'translation'), translations, 'translation');
        });
        
        QUnit.test('namespaces', function(assert) {
            assert.deepEqual(i18n.options.ns, {
                defaultNs: 'translation',
                namespaces: ['translation']
            }, 'translation');
        });
        
        QUnit.test('translate', function(assert) {
            assert.strictEqual(i18n.t('test'), 'hello', "i18n.t('test')");
        });
        
        QUnit.start();
    });
});
