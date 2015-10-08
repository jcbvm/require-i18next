require.config({
    map: {
        '*': {
            'i18n': '../require-i18next/i18next'
        }
    },
    paths: {
    	'i18next': '../bower_components/i18next/i18next.amd',
		'qunit': '../bower_components/qunit/qunit/qunit'
    },
    i18next: {
        lng: 'en',
        fallbackLng: 'en'
    }
});

