/**
 * Modulo de Validaciones de entrada de Texto
 * @required: ECMAScript 2015 (ES6)
 * @author: Edwin Betancourt <EdwinBetanc0urt@outlook.com>
 * @version 0.6
 * @created: 05-Abril-2018
 * @dependency: jQuery +3.3.1 para validate priece format

 * @description:
		Este programa es software libre, su uso, redistribución, y/o modificación
	debe ser bajo los términos de las licencias indicadas, licencia MIT.

		Este software esta creado con propósitos generales que sean requeridos,
	siempre que este sujeto a las licencias indicadas, pero SIN NINGUNA GARANTÍA
	Y/O RESPONSABILIDAD que recaiga a los creadores, autores y/o desarrolladores,
	incluso sin la garantía implícita de COMERCIALIZACIÓN o IDONEIDAD PARA UN
	PROPÓSITO PARTICULAR. Cualquier MODIFICACIÓN, ADAPTACIÓN Y/O MEJORA que se haga
	a partir de este código debe ser notificada y enviada a la fuente, comunidad
	o repositorio de donde fue obtenida, y/o a sus AUTORES.
 */

const validateInput = (function() {
	// private methods and properties
	let language = {
		base: 'en',
		withOutTranslate: 'Without translate key function: ',
		translate: {}
	};

	const _inputs_html = 'textarea, input[type=text], input[type=password], ' +
		'input[type=number], input[type=tel], input[type=email], input[type=url], ' +
		'input[type=date], input[type=datetime-local], input[type=search], ' +
		'input[type=month], input[type=time], input[type=week]';

	/**
	 * [_addEvent description]
	 * @param {string} selector, Selectors HTML DOM (tag, #id, .class) separate with ','
	 * @param {array|String} _Events, DOM Events to add in HTML inputs
	 * @param {RegExp} pattern, Pattern in regular expression
	 * @param {string} _Replace, Value to replace, default string empty ""
	 */
	const _addEvent = function({
		selector,
		pattern,
		eventsList = 'blur, keyup',
		valueToReplace = '',
		functionToValidate
	}) {
		const _domElements = document.querySelectorAll(selector);

		if (!Array.isArray(eventsList) || typeof eventsList === 'string') {
			eventsList = eventsList.split(',');
		}

		const domElementsLength = _domElements.length;
		let domElementsIndex = 0;
		// iteration elements DOM
		while (domElementsIndex < domElementsLength) {
			const eventsLength = eventsList.length;
			let eventsIndex = 0;
			while (eventsIndex < eventsLength) {
				_addIndividualEnvent({
					selector: _domElements[domElementsIndex],
					pattern,
					eventToActivate: eventsList[eventsIndex].trim(),
					valueToReplace,
					functionToValidate
				});
				eventsIndex++;
			}
			domElementsIndex++;
		}
	};

	/**
	 *
	 * @param {string} selector
	 * @param {RegExp} pattern
	 * @param {string} eventToActivate
	 * @param {string} valueToReplace
	 */
	const _addIndividualEnvent = function({
		selector,
		pattern,
		eventToActivate,
		valueToReplace = '',
		functionToValidate
	}) {
		if (typeof functionToValidate !== 'function') {
			functionToValidate = function() {
				this.value = this.value.replace(pattern, valueToReplace);
			};
		}

		// add event into DOM
		selector.addEventListener(eventToActivate, functionToValidate);
	};

	const withoutRunnablesMethdods = ['init', 'getLang', 'validateDefault', 'validateAll'];

	/**
	 * Remove accents in text and replace with equivalent letter
	 * @param {String} _Text
	 */
	const _removeAccents = function(_Text) {
		return _Text
			.replace(/[áäàâãå]/gi, 'a')
			.replace(/[ÁÄÂÃÀ]/gi, 'A')
			//.replace(/[ç]/, 'c');
			//.replace(/[Ç]/, 'C');
			.replace(/[éëè]/gi, 'e')
			.replace(/[ÉËÊÈ]/gi, 'E')
			.replace(/[íïîì]/gi, 'i')
			.replace(/[ÍÏÎÌ]/gi, 'I')
			//.replace(/[ñ]/n, 'n')
			//.replace(/[Ñ]/n, 'N')
			.replace(/[óöôò]/gi, 'o')
			.replace(/[ÓÖÔÒ]/gi, 'O')
			.replace(/[úüûù]/gi, 'u')
			.replace(/[ÚÜÛÙ]/gi, 'U')
			.replace(/[ýÿ]/gi, 'y')
			.replace(/[Ý]/gi, 'Y');
	};

	const getSelector = function(selector, functionName) {
		if (language.base !== 'en') {
			if (language.translate && language.translate[functionName]) {
				selector += ', ' + language.translate[functionName];
				return selector;
			}
			console.warn(language.withOutTranslate, functionName);
		}
		return selector;
	};

	return {
		// public methods and properties
		init: function({ 
			lang = 'en' ,
			translate = {},
			isDefaultValidation = true
		}) {
			if (lang && lang !== 'en') {
				language = translate;
			}

			if (isDefaultValidation) {
				this.validateDefault();
			}

			return this;
		},

		runValidations(validationsList) {
			if (typeof validationsList === 'string') {
				validationsList = validationsList.split(',');
			}
			const errorValidations = []
			const runLength = validationsList.length;
			let runIndex = 0;
			while (runIndex < runLength) {
				const functionToRun = validationsList[runIndex];
				
				if (typeof this[functionToRun] !== 'function') {
					errorValidations.push(functionToRun);
					runIndex++;
					continue;
				}
				if (withoutRunnablesMethdods.includes(functionToRun)) {
					console.warn(`'${functionToRun}' method cannot be executed from here.`);
					runIndex++;
					continue;
				}
			
				this[functionToRun].call();
				runIndex++;
			}
			if (errorValidations.length) {
				console.warn(`Not match to validations: ${errorValidations.toString()}`);
			}
			return this;
		},

		getLang: function() {
			return language;
		},

		validateDefault: function() {
			this.validateAlphabetic();
			this.validateAlphaNumeric();
			//this.validateConsecutiveSpaces();
			this.validateEmail();
			this.validateNumber();
			this.validateWithoutDiacritics();
			this.validateWithoutSpaces();
			return this;
		},

		validateAll: function() {
			this.validateAlphabetic();
			this.validateAlphaNumeric();
			this.validateBankAccount();
			this.validateBloodGroup();
			//this.validateConsecutiveSpaces();
			this.validateEmail();
			this.validateHexadecimalColour();
			this.validateHtmlTag();
			this.validateIp();
			this.validateIpWithPort();
			this.validateMacAddress();
			this.validateMaxLength();
			this.validateNumber();
			this.validateWithoutDiacritics();
			this.validateWithoutSpaces();

			this.valueCapitalize();
			this.valueCapitalLetter();
			this.valueLowerCase();
			this.valueUpperCase();

			// this.validate_num_entero();
			// this.validate_direccion();
			// this.validate_num_telefono();
			// this.validate_num_real();
			// this.validate_operacion_numerica();
			return this;
		},

		/** 
		 * validate only letters from A to Z
		 * @param {string} selector to apply validation
		 */
		validateAlphabetic: function(selector = '.validate-alphabetic') {
			const pattern = /[^a-zA-Zá-úÁ-Úä-üÄ-Üà-ùÀ-Ù ]/gi;
			selector = getSelector(selector, 'validateAlphabetic');
			_addEvent({ selector, pattern });
			return this;
		},

		validateAlphaNumeric: function(selector = '.validate-alphanumeric') {
			// TODO: Evaluate if required characters: , . - +
			const pattern = /[^a-zA-Zá-úÁ-Úä-üÄ-Üà-ùÀ-Ù0-9 ]/gi;
			selector = getSelector(selector, 'validateAlphaNumeric');
			_addEvent({ selector, pattern });
			return this;
		},

		validateBankAccount: function(selector = '.validate-bank-account') {
			const pattern = /[^0-9][-]{}$/g;
			selector = getSelector(selector, 'validateBloodGroup');
			_addEvent({ selector, pattern });
			return this;
		},

		/**
		 * validate blood group: A+, A-, AB+, AB-, B+, B- O+, O-
		 * TODO: Change pattern to validate multiples match when input text
		 */
		validateBloodGroup: function(selector = ".validate-blood-group") {
			const pattern = /([^aAbBoO]{1}|A{1}B{1})[+-]{1}/g;
			selector = getSelector(selector, 'validateBloodGroup');
			_addEvent({ selector, pattern });
			return this;
		},

		/**
		 * validation so that it does not allow you to start typing with spaces
		 * and/or do not allow 2 consecutive spaces at the end
		 */
		validateConsecutiveSpaces: function() {
			// const pattern = /^\s+/g;

			const overWriteFunction = function() {
				//const pattern = /\\s{2,}/gim;
				//const pattern = /^\s+|\s+$|\s+(?=\s)/g;
				//const pattern = /\s{2,}/g;
				//const pattern = /\s\s+/g;
				//const pattern = /(\s\s\s*)/g;
				//const pattern = /^\s+|\s+$|\s+(?=\s)/g;
				// const pattern = /( ){2,}/u;
				const pattern = /\S+/g;
				//remove spaces at the beginning
				this.value = this.value
				.replace(/^\s+|\s+$/g,'').replace(/(\s\s\s*)/g, ' ');
				//.replace(/^\s+|\s+$/, '') .replace(/\s+/, ' ')
				//.replace(pattern, '');

				//remove consecutive spaces
				// this.value = this.value.replace(/ +/gim, ' ');
			};

			_addEvent({
				selector: _inputs_html,
				eventsList: ['keydown', 'blur'],
				functionToValidate: overWriteFunction
			});
			return this;
		},

		validateHexadecimalColour: function(selector = ".validate-hexadecimal-colour") {
			const pattern = /[#]([\dA-F]{6}|[\dA-F]{3})/g;
			selector = getSelector(selector, 'validateHexadecimalColour');
			_addEvent({ selector, pattern });
			return this;
		},

		validateHtmlTag: function(selector = ".validate-html-tag") {
			const pattern =/^<([a-z]+)([^<]+)*(?:>(.*)<\/\1>|\s+\/>)$/g
			selector = getSelector(selector, 'validateHtmlTag');
			_addEvent({ selector, pattern });
			return this;
		},

		validateIp: function(selector = ".validate-ip") {
			// const pattern = /[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}/g;
			const pattern = /\b([1-9]|[1-9][0-9]|1([0-9][0-9])|2([0-4][0-9]|5[0-5]))\.([0-9]|[1-9][0-9]|1([0-9][0-9])|2([0-4][0-9]|5[0-5]))\.([0-9]|[1-9][0-9]|1([0-9][0-9])|2([0-4][0-9]|5[0-5]))\.([0-9]|[1-9][0-9]|1([0-9][0-9])|2([0-4][0-9]|5[0-5]))\b/g;
			selector = getSelector(selector, 'validateIp');
			_addEvent({ selector, pattern });
			return this;
		},

		validateIpWithPort: function(selector = ".validate-ip-with-port") {
			const pattern = /[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}:[0-9]{1,5}/g;
			selector = getSelector(selector, 'validateIpWithPort');
			_addEvent({ selector, pattern });
			return this;
		},

		validateMacAddress: function(selector = ".validate-mac-address") {
			const pattern = /[a-fA-F0-9.+_-]+:[a-fA-F0-9.+_-]+:[a-fA-F0-9.+_-]+:[a-fA-F0-9.+_-]+:[a-fA-F0-9.+_-]+:[a-fA-F0-9.+_-]+/gi;
			selector = getSelector(selector, 'validateMacAddress');
			_addEvent({ selector, pattern });
			return this;
		},

		/**
		 * validate para el ancho máximo de los input number, ya que por diseño
		 * solo admite el atributo min y max
		 */
		validateMaxLength: function() {
			const overWriteFunction = function() {
				let maxlength = this.getAttribute('maxlength');
				// es necesaria la condición ya que los type number no manejan
				// el atributo maxlength
				if (maxlength == undefined || maxlength == null) {
					//si esta definido el atributo max
					const max = this.getAttribute('max');
					// break function without attribute
					if (max == undefined || max == null) {
						return;
					}
					maxlength = max.length;
					// if (max == 0 && this.value > 0) {
					//	maxlength = 0;
					// }
				}
				this.value = this.value.slice(0, maxlength);
			};

			_addEvent({ 
				selector: 'input[type=number]', 
				eventsList: ['input'],
				functionToValidate: overWriteFunction
			});
			return this;
		},

		// validate numeric values
		validateNumber: function(selector = '.validate-number') {
			const pattern = /[^0-9]/g;
			selector = getSelector(selector, 'validateNumber');
			_addEvent({ selector, pattern });
			return this;
		},

		// remove the accents and diacritics
		validateWithoutDiacritics: function(selector = '.value-without-diacritic', _Language = 'es') {
			let _idiomaHTML = window.navigator.language || navigator.browserLanguage;
			let _domElements = document.querySelectorAll(selector);
			let _es = ['es', 'es-ES', 'español', 'spanish'];
			const domLength = _domElements.length
			let pattern = /[\u0300-\u036f]/g;
			let _Reemplazo = "";
			let index = 0
			// Recorremos cada uno de nuestros elementos DOM HTML
			while(index < domLength) {
				if (_es.includes(_idiomaHTML)
					|| _es.includes(_domElements[index].getAttribute("lang"))) {
					pattern = /([^n\u0300-\u036f]|n(?!\u0303(?![\u0300-\u036f])))[\u0300-\u036f]+/gi;
					_Reemplazo = "$1";
				}

				_domElements[index].addEventListener('input', function(_Event) {
					this.value = this.value
						.normalize('NFD')
						.replace(pattern, _Reemplazo)
						.normalize();
				});
				index++;
			}
			return this;
		},

		validateWithoutSpaces: function(selector = '.validate-no-spaces') {
			const pattern = / /gim;
			selector = getSelector(selector, 'validateAlphaNumeric');
			_addEvent({ selector, pattern });
			return this;
		},

		/**
		 * Change first letter to upper case into. Example:
		 * 'this is a example' => 'This Is A Example'
		 * 'This IS a Example' => 'This Is A Example'
		 */
		valueCapitalize: function(selector = '.value-capitalize') {
			// const pattern = /\b[a-z]/g;
			const pattern = /^([a-z\u00E0-\u00FC])|\s+([a-z\u00E0-\u00FC])/g; // accept diacritics
			const overWriteFunction = function() {
				this.value = this.value.toLowerCase().replace(pattern, function(letter) {
					return letter.toUpperCase();
				});
			};

			selector = getSelector(selector, 'valueCapitalize');
			_addEvent({ 
				selector, 
				functionToValidate: overWriteFunction
			});
			return this;
		},

		/**
		 * Change only first letter to upper case into. Example:
		 * 'this is a example' => 'This is a example'
		 * 'This IS a Example' => 'This is a example'
		 */
		valueCapitalLetter: function(selector = '.value-capital-letter') {
			// const pattern = /^([A-ZÁÉÍÓÚ]{1}[a-zñáéíóú]+[\s]*)+$/g;
			const overWriteFunction = function() {
				this.value = this.value.toLowerCase();
				this.value = this.value.charAt(0).toUpperCase() + this.value.slice(1);
			};

			selector = getSelector(selector, 'validateNumber');
			_addEvent({ 
				selector, 
				eventsList: ['input'],
				functionToValidate: overWriteFunction
			});
			return this;
		},

		/**
		 * Change input text value to lower case. Example: 
		 * 'Hello WORLD' => 'hello world'
		 * 'Hello world' => 'hello world'
		 */
		valueLowerCase: function(selector = '.value-lower-case') {
			const overWriteFunction = function() {
				this.value = this.value.toUpperCase();
			};

			selector = getSelector(selector, 'valueLowerCase');
			_addEvent({ 
				selector, 
				eventsList: ['input'],
				functionToValidate: overWriteFunction
			});
			return this;
		},

		/**
		 * Change input text value to upper case. Example: 
		 * 'Hello world' => 'HELLO WORLD'
		 */
		valueUpperCase: function(selector = '.value-upper-case') {
			const overWriteFunction = function() {
				this.value = this.value.toUpperCase();
			};

			selector = getSelector(selector, 'valueUpperCase');
			_addEvent({ 
				selector, 
				eventsList: ['input'],
				functionToValidate: overWriteFunction
			});
			return this;
		},

		//MEJORAR VALIDACION DEL PRIMER CARACTER EN 0 CON EXPRESIONES REGULARES
		//validate que solo sean números enteros
		validate_num_entero: function(selector = '.validate_num_entero') {
			let pattern = /[^0-9]/g;
			//let pattern = /^[0-9]{0,12}([,][0-9]{2,2})?$/g;
			///let pattern = /^[0-9]{0,12}([,][0-9]{2,2})?$/g;
			//let pattern = /^[1-9]{1}([0-9]{1,})?$/g;
			//this.value = this.value.replace(/^[1-9][0-9]*$/g, '');
			//this.value = this.value.replace(/^[1-9]\d*$/g, '');
			//this.value = this.value.replace(/[1-9]\d*/g, '');
			//this.value = this.value.replace(/^\d*$/g, '');
			//this.value = this.value.replace(/^-?(?:0?[1-9]\d*|0)$/g, '');
			//let pattern = /^[1-9]{1}[0-9]{2,}/g;
			//let pattern = /[1-9]\d{0,}/g; //numero mayora cero
			let _domElements = document.querySelectorAll(selector);

			//Recorremos cada uno de nuestros elementos DOM HTML
			for (let i = 0; i < _domElements.length; i++){
				_domElements[i].addEventListener('keyup', function(_Event){
					this.value = this.value.replace(pattern, '');
					while(this.value.charAt(0) == "0") {
						this.value = this.value.substring(1);
					}
				});
				_domElements[i].addEventListener('blur', function(_Event) {
					this.value = this.value.replace(pattern, '');
					while(this.value.charAt(0) == "0") {
						this.value = this.value.substring(1);
					}
				});
			}
			return this;
		},

		// validate para NUMEROS DE TELEFONO Y FAX, locales e internacionales
		// falta validater que no repita mas de 1 vez el guion y el mas
		validate_num_telefono: function(selector = '.validate_num_telefono') {
			let pattern = /[^0-9+-]/gi;
			let _domElements = document.querySelectorAll(selector);

			const callBack = function() {
				this.value = this.value.replace(pattern, '');
				//validate la primera posición sea un cero o un mas
				tam = this.value.length; //toma el tamaño de la cadena
				//sino identifica inicialmente el + toma un cero
				if (this.value.charAt(0) != "+") {
					this.value = "0" + this.value.substr(1);
					if (tam == 4 && this.value.charAt(4) != "-")
						this.value = this.value.substr(0, 4) + "-" + this.value.substr(5);
				}
				else {
					this.value = "+" + this.value.substr(1);
					if (tam == 3 && this.value.charAt(4) != "-")
						this.value = this.value.substr(0, 3) + "-" + this.value.substr(3);
				}

				//si el carácter en la posición final y la antepenúltima son iguales
				//y a su vez igual a un guion o un mas elimina el ultimo repetido
				if (this.value.charAt(tam - 1) == this.value.charAt(tam - 2) && (this.value.charAt(tam - 1) == "-" || this.value.charAt(tam - 1) == "+")) {
					//toma el valor desde la posicion cero hasta una posición menos, borrando 1 de los guiones al final
					this.value = this.value.substr(0, tam - 1);
				}
			};

			//Recorremos cada uno de nuestros elementos DOM HTML
			for (let i = 0; i < _domElements.length; i++) {
				_domElements[i].addEventListener('keyup', callBack);
				_domElements[i].addEventListener('blur', callBack);
			}
			return this;
		},

		//validate para NUMEROS DE TELEFONO Y FAX, locales e internacionales
		//falta validater que no repita mas de 1 vez el guion y el mas
		validate_telefono_mundial: function(selector = '.validate_num_telefono') {
			let pattern = /^\s*(?:\+?(\d{1,3}))?([-. (]*(\d{3})[-. )]*)?((\d{3})[-. ]*(\d{2,4})(?:[-.x ]*(\d+))?)\s*$/g;
			_addEvent({ selector, pattern });
			/*
			+584246573321
			+42 555.123.4567
			+1-(800)-123-4567
			+7 555 1234567
			+7(926)1234567
			(926) 1234567
			+79261234567
			*/
			return this;
		},

		validate_num_real: function(selector = ".validate_num_real") {
			let pattern = /[^0-9.]/g;
			_addEvent({ selector, pattern });
			return this;
		},

		validate_operacion_numerica: function(selector = ".validate_operacion_numerica") {
			let pattern = /[^0-9.+*\-\/%=]/g;
			_addEvent({ selector, pattern });
			return this;
		},

		validateEmail: function(selector = ".validate-email") {
			//let pattern = /[a-zA-Z0-9.+_-]+@[a-zA-Z0-9.-]+\.[a-zA-Z0-9.-]+/i;
			let pattern = /^([^@\s]+)@((?:[-a-z0-9]+\.)+[a-z]{1,})$/i;
			let _domElements = document.querySelectorAll(selector);

			//Recorremos cada uno de nuestros elementos DOM HTML
			for (let i = 0; i < _domElements.length; i++) {
				//enfoca si no pasa validatecion
				_domElements[i].addEventListener('blur', function(_Event) {
					_Event.preventDefault();

					// x@x.xx
					//if( !this.value.match(/^[^\s()<>@,;:\/]+@\w[\w\.-]+\.[a-z]{1,}$/i) ) {
					if (!this.value.match(pattern)
					&& this.value.trim() != "") {
					// x@xx.x
					//if (!(/\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)/.test(this.value)) ) {
					//if (!(/^\w+([\.\-\_]?\w+)*@\w+([\.\-\_]?\w+)*([\.\-\_]?\w{1,})+$/.test(this.value)) ) {
						setTimeout(
							function(){
								_domElements[i].focus();
							},
							10
						);
						console.log("correo malo");
					}
					else if (this.value.trim() == "") {
						console.log("correo vacio");
					}
					else {
						console.log("correo bien");
					}
					//_domElements[i].focus();

					//_removeAccents(this.value);
				});

				_addIndividualEnvent({ 
					selector: _domElements[i], 
					pattern: /[ñ` ´~!#%^&$¡¨¿*()°¬|+\=?,;:'"<>\{\}\[\]\\\/]/, 
					eventToActivate: 'keyup'
				});
			};
			return this;
		},

		validate_direccion: function(selector = ".validate_direccion") {
			let pattern = /[`~!@%^&$¡¨¿*_¬|+\=?;:'"<>\{\}\[\]]/gi;
			_addEvent({ selector, pattern });
			return this;
		},

		validate_rif: function(selector = ".validate_rif") {
			//let pattern = /^([VEJPGC]{1})([0-9]{7,9})$/g;
			let pattern = /^[VEJPGC][-][0-9]{7,9}[-][0-9]{1}$/g;
			_addEvent({ selector, pattern });
			return this;
		},

		validate_num_moneda: function(selector = ".validate_num_moneda") {
			let pattern = /^[0-9]{0,12}([,][0-9]{2,2})?$/g;
			// validate para NUMEROS DECIMALES
			$('.validate_num_moneda').keyup(function() {
				this.value = this.value.replace(/[^0-9,.]/g, '');

				//Busca la coma y cambia por un punto
				if (this.value.indexOf(","))
					this.value = this.value.replace(/[^0-9.]/g, '.');

				//validate la primera posición que no sea un cero, punto o coma
				if (this.value.charAt(0) == "0" || this.value.charAt(0) == "." || this.value.charAt(0) == ",") {
					this.value = this.value
						.substring(1)
						.replace(/[^0-9]/g, '');
				}

				//validate la posición final para que no se repitan dos comas o puntos
				tam = this.value.length; //toma el tamaño de la cadena
				//si el carácter en la posición final y la antepenúltima son iguales y a su vez igual a un punto
				if (this.value.charAt(tam - 1) == this.value.charAt(tam - 2) && this.value.charAt(tam - 1) == ".") {
					//toma el valor desde la posicion cero hasta una posición menos, borrando 2 puntos consecutivos
					this.value = this.value.substr(0, tam - 1);
				}
			});

			if (typeof priceFormat === 'function') {
				$('.validate_moneda_bolivares').priceFormat({
					prefix: '', //simbolo de moneda que va al principio (predeterminado toma USD$)
					suffix: '', //simbolo de moneda que va al final
					centsSeparator: '.', //separador de sentimos
					thousandsSeparator: '', //separador de miles
					insertPlusSign: false //un mas al principio
					//allowNegative: true //permite negativos
				});
			}
			let _domElements = document.querySelectorAll('.validate_direccion');
			//Recorremos cada uno de nuestros elementos DOM HTML
			for (let i = 0; i < _domElements.length; i++){
				_domElements[i].addEventListener('keyup', function(_Event){
					this.value = this.value.replace(/[`~!@%^&$¡¨¿*_¬|+\=?;:'"<>\{\}\[\]]/gi, '');
				});
			};
			return this;
		},

		validate_url: function(selector = ".validate_url") {
			//let pattern = /([--:\w?@%&+~#=]*\.[a-z]{2,4}\/{0,2})((?:[?&](?:\w+)=(?:\w+))+|[--:\w?@%&+~#=]+)?/;
			let pattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
			//let pattern = /^(ht|f)tp(s?)\:\/\/[0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*(:(0-9)*)*(\/?)( [a-zA-Z0-9\-\.\?\,\'\/\\\+&%\$#_]*)?$/;
			//let pattern = /^((ht|f)tp(s?)\:\/\/)?[0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*(:(0-9)*)*(\/?)( [a-zA-Z0-9\-\.\?\,\'\/\\\+&%\$#_]*)?$/;
			let _domElements = document.querySelectorAll('.validate_url');

			//Recorremos cada uno de nuestros elementos DOM HTML
			for (let i = 0; i < _domElements.length; i++) {
				//enfoca si no pasa validatecion
				_domElements[i].addEventListener('blur', function(_Event) {
					_Event.preventDefault();

					if (!this.value.match(pattern)
					&& this.value.trim() != "") {
						setTimeout(
							function(){
								_domElements[i].focus();
							},
							10
						);
						console.log("url mala");
					}
					else if (this.value.trim() == "") {
						console.log("url vacia");
					}
					else {
						console.log("url bien");
					}
					this.value = _removeAccents(this.value);
				});

				_addIndividualEnvent(_domElements[i], /[ñ` ´~!#%^&$¡¨¿*()°¬|+\=?,;:'"<>\{\}\[\]\\\/]/, 'keyup');
			};
			return this;
		},

		validateTime: function(selector = ".validate_tiempo") {
			let pattern = /([01]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?/g;
			//let pattern = /^(0[1-9]|1\d|2[0-3]):([0-5]\d):([0-5]\d)$/g;
			//let pattern = /^(0[1-9]|1\d|2[0-3]):([0-5]\d):([0-5]\d)$/g;
			_addEvent({ selector, pattern });
			return this;
		},

		validate_fecha: function(selector = ".validate_fecha") {
			let pattern = /(0[1-9]|[12][0-9]|3[01])[\/.](0[13578]|1[02])[\/.](20)[0-9]{2}|(0[1-9]|[12][0-9]|30)[\/.](0[469]|11)[\/.](20)[0-9]{2}|(0[1-9]|1[0-9]|2[0-8])[\/.](02)[\/.](20)[0-9]{2}|29[\/.](02)[\/.](((20)(04|08|[2468][048]|[13579][26]))|2000)/g;
			//let pattern = /^\d{1,2}\/\d{1,2}\/\d{2,4}$/g;
			_addEvent({ selector, pattern });
			return this;
		},

		validate_fecha_tiempo: function(selector = ".validate_fecha_tiempo") {
			let pattern = /^([1-9]{2}|[0-9][1-9]|[1-9][0-9])[0-9]{3}$/g;
			_addEvent({ selector, pattern });
			return this;
		},

		validate_codigo_postal: function(selector = ".validate_codigo_postal") {
			let pattern = /((0[1-9]|1[0-2])\-(0[1-9]|1[0-9]|2[0-9]|3[01])\-\d{4})(\s+)(([0-1][0-9]|[2][0-3]):([0-5][0-9]):([0-5][0-9])|24:00:00)/g;
			_addEvent({ selector, pattern });
			return this;
		},

		validate_direccion_bitcoin: function(selector = ".validate_direccion_bitcoin") {
			let pattern = /([13][a-km-zA-HJ-NP-Z0-9]{26,33})/g;
			_addEvent({ selector, pattern });
			return this;
		},

		validate_hastag: function(selector = ".validate_hastag") {
			let pattern = /([@][A-z]+)|([#][A-z]+)/g;
			_addEvent({ selector, pattern });
			return this;
		}

	} // end return
})();

export default validateInput;
