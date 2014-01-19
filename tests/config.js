require.config({
    map: {
        '*': {
            'i18n': '../i18next'
        }
    },
    paths: {
        'qunit'   : '../bower_components/qunit/qunit/qunit',
    	'i18next' : '../bower_components/i18next/release/i18next.amd-1.7.1'
    },
    shim: {
        'qunit': {
            exports: 'QUnit',
            init: function() {
                QUnit.config.autoload = false;
                QUnit.config.autostart = false;
            }
        }
    }
});
