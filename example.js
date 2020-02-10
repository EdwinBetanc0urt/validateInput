import validateInput from './validateInput.js';
import esLang from './i18n/es.js';

document.addEventListener('DOMContentLoaded', function() {
	validateInput.init({ 
		lang: 'es',
		translate: esLang,
	})
	.runValidations(['validateAlphabetic', 'validateIp', 'valueCapitalize', 'init']);
 
});
