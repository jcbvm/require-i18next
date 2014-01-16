(function() {
    var style = document.createElement('link');
    style.rel = 'stylesheet';
    style.type = 'text/css'; 
    style.href = '../bower_components/qunit/qunit/qunit.css'; 
    document.getElementsByTagName('head')[0].appendChild(style);
    
    require.config({
        map: {
            '*': {
                'i18n': '../i18next'
            }
        },
        paths: {
            'qunit'   : '../bower_components/qunit/qunit/qunit',
        	'i18next' : '../bower_components/i18next/release/i18next.amd-1.7.1'
        	//'i18next' : '../bower_components/i18next/release/i18next.amd.withJQuery-1.7.1'
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
})();
