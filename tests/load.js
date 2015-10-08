define(['qunit', 'i18n'], function(QUnit, plugin) {
    var options = {
        resGetPath: 'someResGetPath',
        supportedLngs: {}
    };
    require.config({
        i18next: options
    });
    require(['i18n!'], function(i18n) {
        QUnit.test('returns i18next instance', function(assert) {
            assert.ok(i18n.t);
        });
        QUnit.test('initializes i18next', function(assert) {
            assert.notEqual(typeof i18n.options.lng, 'undefined');
        });
        QUnit.test('defines a custom load function', function(assert) {
            assert.equal(typeof i18n.options.customLoad, 'function');
        });
        QUnit.test('passes given options to i18next', function(assert) {
            assert.strictEqual(i18n.options.resGetPath, options.resGetPath);
        });
        QUnit.test('does not expose supported languages', function(assert) {
            assert.equal(typeof i18n.options.supportedLngs, 'undefined');
        });
        QUnit.start();
    });
});
