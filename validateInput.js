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
	 * @param {string} valueToReplace, Value to replace, default string empty ''
	 * @param {function} functionToValidate, overwrite function to validate
	 */
	const _addEvent = function({
		selector,
		pattern,
		eventsList = ['blur', 'keyup'], // 'blur, keyup'
		valueToReplace = '',
		functionToValidate
	}) {
		const _domElements = document.querySelectorAll(selector);

		if (typeof eventsList === 'string') {
			eventsList = eventsList.split(',');
		}

		const domElementsLength = _domElements.length;
		let domElementsIndex = 0;
		// iteration elements DOM
		while (domElementsIndex < domElementsLength) {
			const eventsLength = eventsList.length;
			let eventsIndex = 0;
			// iteration events to add
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
	 * @param {function} functionToValidate, overwrite function to validate
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

	const notRunnableMethods = ['init', 'getLang', 'runValidations', 'validateDefault', 'validateAll'];

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

		runValidations(validationsList = []) {
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
				if (notRunnableMethods.includes(functionToRun)) {
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
			this.validateConsecutiveSpaces();
			this.validateEmail();
			this.validateNumber();
			this.validateWithoutDiacritics();
			this.validateWithoutSpaces();
			return this;
		},

		validateAll: function() {
			const validateFunctions = this;
			const lengthNotRunable = notRunnableMethods.length;
			let index = 0;
			while (index < lengthNotRunable) {
				delete(validateFunctions[notRunnableMethods[index]]);
				index++;
			}

			for (const functionName in validateFunctions) {
				this[functionName].call();
			}
			return this;
		},

		validateAddress: function(selector = '.validate-address') {
			const pattern = /[`~!@%^&$¡¨¿*_¬|+\=?;:'"<>\{\}\[\]]/gi;
			selector = getSelector(selector, 'validateAddress');
			_addEvent({ selector, pattern });
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

		/**
		 * Always 20 digits.
		 * First 4 are the bank's ID (see bcv.org.ve's official list) and the following 15 are the account number.
		 * This regex validates there are 20 continuous digits and groups the match in two.
		 */
		validateBankAccount: function(selector = '.validate-bank-account') {
			const pattern = /^(\d{5})(\d{15})$/g;
			selector = getSelector(selector, 'validateBankAccount');
			_addEvent({ selector, pattern });
			return this;
		},

		/**
		 * validate blood group: A+, A-, AB+, AB-, B+, B- O+, O-
		 * TODO: Change pattern to validate multiples match when input text
		 */
		validateBloodGroup: function(selector = '.validate-blood-group') {
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
			const pattern = /^\s+/g;
			const overWriteFunction = function() {
				this.value = this.value
					// remove spaces at the beginning
					.replace(pattern, '')
					// remove consecutive spaces
					.replace(/ +/gim, ' ');
			};

			_addEvent({
				selector: _inputs_html,
				functionToValidate: overWriteFunction
			});
			return this;
		},

		validateDate: function(selector = '.validate-date') {
			// const pattern = /(?:(?:31(\/|-|\.)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(\/|-|\.)(?:0?[13-9]|1[0-2])\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\/|-|\.)0?2\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/|-|\.)(?:(?:0?[1-9])|(?:1[0-2]))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})/gm;
			const pattern = /(0[1-9]|[12][0-9]|3[01])[\/.](0[13578]|1[02])[\/.](20)[0-9]{2}|(0[1-9]|[12][0-9]|30)[\/.](0[469]|11)[\/.](20)[0-9]{2}|(0[1-9]|1[0-9]|2[0-8])[\/.](02)[\/.](20)[0-9]{2}|29[\/.](02)[\/.](((20)(04|08|[2468][048]|[13579][26]))|2000)/g;
			// const pattern = /^\d{1,2}\/\d{1,2}\/\d{2,4}$/g;
			selector = getSelector(selector, 'validateDate');
			_addEvent({ selector, pattern });
			return this;
		},

		validateDateTime: function(selector = '.validate-date-time') {
			const pattern = /^([1-9]{2}|[0-9][1-9]|[1-9][0-9])[0-9]{3}$/g;
			selector = getSelector(selector, 'validateDateTime');
			_addEvent({ selector, pattern });
			return this;
		},

		validateEmail: function(selector = '.validate-email') {
			// const pattern = /[a-zA-Z0-9.+_-]+@[a-zA-Z0-9.-]+\.[a-zA-Z0-9.-]+/i;
			const pattern = /^([^@\s]+)@((?:[-a-z0-9]+\.)+[a-z]{1,})$/i;
			// const pattern = /[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/gm;
			// const pattern = /(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))/gm;

			const overWriteFunction = function(event) {
				event.preventDefault();

				// x@x.xx
				// if( !this.value.match(/^[^\s()<>@,;:\/]+@\w[\w\.-]+\.[a-z]{1,}$/i) ) {
				// x@xx.x
				// if (!(/\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)/.test(this.value)) ) {
				// if (!(/^\w+([\.\-\_]?\w+)*@\w+([\.\-\_]?\w+)*([\.\-\_]?\w{1,})+$/.test(this.value)) ) {
				if (!this.value.match(pattern) && this.value.trim() != '') {
					setTimeout(function() {
						this.focus();
					}, 10);
					console.log('correo malo');
				}
				else if (this.value.trim() == '') {
					console.log('correo vacio');
				}
				else {
					console.log('correo bien');
				}
			};

			selector = getSelector(selector, 'validateEmail');
			_addEvent({
				selector,
				pattern: /[ñ` ´~!#%^&$¡¨¿*()°¬|+\=?,;:'"<>\{\}\[\]\\\/]/,
				eventsList: ['keyup']
			});
			_addEvent({
				selector,
				eventsList: ['blur'],
				functionToValidate: overWriteFunction
			});
			return this;
		},

		validateHashtag: function(selector = '.validate-hashtag') {
			const pattern = /([@][A-z]+)|([#][A-z]+)/g;
			selector = getSelector(selector, 'validateHashtag');
			_addEvent({ selector, pattern });
			return this;
		},

		validateHexadecimalColour: function(selector = '.validate-hexadecimal-colour') {
			const pattern = /[#]([\dA-F]{6}|[\dA-F]{3})/g;
			selector = getSelector(selector, 'validateHexadecimalColour');
			_addEvent({ selector, pattern });
			return this;
		},

		validateHtmlTag: function(selector = '.validate-html-tag') {
			const pattern = /^<([a-z]+)([^<]+)*(?:>(.*)<\/\1>|\s+\/>)$/g;
			selector = getSelector(selector, 'validateHtmlTag');
			_addEvent({ selector, pattern });
			return this;
		},

		/**
		 * Improve first character validation to 0 with regular expressions
		 * TODO: Validate that they are only integers
		 * @param {string} selector
		 */
		validateIntegerNumber: function(selector = '.validate-integer-number') {
			const pattern = /[^0-9]/g;
			// const pattern = /^[0-9]{0,12}([,][0-9]{2,2})?$/g;
			// const pattern = /^[1-9]{1}([0-9]{1,})?$/g;
			// const pattern = /^[1-9][0-9]*$/g;
			// const pattern = /^[1-9]\d*$/g;
			// const pattern = /[1-9]\d*/g;
			// const pattern = /^\d*$/g;
			// const pattern = /^-?(?:0?[1-9]\d*|0)$/g;
			// const pattern = /^[1-9]{1}[0-9]{2,}/g;
			// const pattern = /[1-9]\d{0,}/g;

			const overWriteFunction = function() {
				this.value = this.value.replace(pattern, '');
				while(this.value.charAt(0) == '0') {
					this.value = this.value.substring(1);
				}
			};

			selector = getSelector(selector, 'validateIntegerNumber');
			_addEvent({
				selector,
				functionToValidate: overWriteFunction
			 });
			return this;
		},

		/**
		 * validation for TELEPHONE NUMBERS AND FAX NUMBERS, local and international
		 * lack validation that does not repeat more than 1 time the script and
			+584246573321
			+42 555.123.4567
			+1-(800)-123-4567
			+7 555 1234567
			+7(926)1234567
			(926) 1234567
			+79261234567
		 */
		validateInternationalPhone: function(selector = '.validate-international-phone') {
			const pattern = /^\s*(?:\+?(\d{1,3}))?([-. (]*(\d{3})[-. )]*)?((\d{3})[-. ]*(\d{2,4})(?:[-.x ]*(\d+))?)\s*$/g;
			selector = getSelector(selector, 'validateInternationalPhone');
			_addEvent({ selector, pattern });
			return this;
		},

		validateIp: function(selector = '.validate-ip') {
			// const pattern = /[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}/g;
			// const pattern = /(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}/gm;
			const pattern = /\b([1-9]|[1-9][0-9]|1([0-9][0-9])|2([0-4][0-9]|5[0-5]))\.([0-9]|[1-9][0-9]|1([0-9][0-9])|2([0-4][0-9]|5[0-5]))\.([0-9]|[1-9][0-9]|1([0-9][0-9])|2([0-4][0-9]|5[0-5]))\.([0-9]|[1-9][0-9]|1([0-9][0-9])|2([0-4][0-9]|5[0-5]))\b/g;
			selector = getSelector(selector, 'validateIp');
			_addEvent({ selector, pattern });
			return this;
		},

		validateIpV6: function(selector = '.validate-ip-v6') {
			const pattern = /(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))/gm;
			selector = getSelector(selector, 'validateIpV6');
			_addEvent({ selector, pattern });
			return this;
		},

		validateIpWithPort: function(selector = '.validate-ip-with-port') {
			const pattern = /[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}:[0-9]{1,5}/g;
			selector = getSelector(selector, 'validateIpWithPort');
			_addEvent({ selector, pattern });
			return this;
		},

		/**
		 * +90.0, -127.554334
		 * 45, 180
		 * -90.000, -180.0
		 * 20,80
		 * 47.1231231, 179.99999999
		 * -90., -180.
		 * 045, 180
		 */
		validateLatitudeAndLongitude: function(selector = '.validate-latitude-longitude') {
			const pattern =/ ^((\-?|\+?)?\d+(\.\d+)?),\s*((\-?|\+?)?\d+(\.\d+)?)$/g;
			selector = getSelector(selector, 'validateLatitudeAndLongitude');
			_addEvent({ selector, pattern });
			return this;
		},

		validateMacAddress: function(selector = '.validate-mac-address') {
			// const pattern = /^[a-fA-F0-9]{2}(:[a-fA-F0-9]{2}){5}$/gm;
			const pattern = /[a-fA-F0-9.+_-]+:[a-fA-F0-9.+_-]+:[a-fA-F0-9.+_-]+:[a-fA-F0-9.+_-]+:[a-fA-F0-9.+_-]+:[a-fA-F0-9.+_-]+/gi;
			selector = getSelector(selector, 'validateMacAddress');
			_addEvent({ selector, pattern });
			return this;
		},

		/**
		 * validate for the maximum width of the input numbers, since by design
		 * it only supports the min and max attribute
		 */
		validateMaxLength: function() {
			const overWriteFunction = function() {
				let maxlength = this.getAttribute('maxlength');
				// the condition is necessary because type numbers do not handle
				// the maxlength attribute
				if (maxlength == undefined || maxlength == null) {
					// if the max attribute is defined
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

		validateNumericOperation: function(selector = '.validate-numeric-operation') {
			const pattern = /[^0-9.+*\-\/%=]/g;
			selector = getSelector(selector, 'validateNumericOperation');
			_addEvent({ selector, pattern });
			return this;
		},

		// validate numeric values
		validateNumber: function(selector = '.validate-number') {
			// const pattern = /^\d/g;
			const pattern = /[^0-9]/g;
			selector = getSelector(selector, 'validateNumber');
			_addEvent({ selector, pattern });
			return this;
		},

		validatePassword: function(selector = '.validate-rif') {
			// const pattern = /^([VEJPGC]{1})([0-9]{7,9})$/g;
			const pattern = / ^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/gm;
			selector = getSelector(selector, 'validatePassword');
			_addEvent({ selector, pattern });
			return this;
		},

		/**
		 * validate for phone and fax numbers, local and international
		 * TODO: It is necessary to validate that it does not repeat more than 1 time the - and the +
		 * @param {string} selector
		 */
		validatePhoneNumber: function(selector = '.validate-phone-number') {
			const pattern = /[^0-9+-]/gi;
			const overWriteFunction = function() {
				this.value = this.value.replace(pattern, '');
				const length = this.value.length; // string length

				// validate that the first position is a 0 or a +
				// but initially identifies the + takes a 0 and vice versa
				if (this.value.charAt(0) != '+') {
					this.value = '0' + this.value.substr(1);
					if (length == 4 && this.value.charAt(4) != '-')
						this.value = this.value.substr(0, 4) + '-' + this.value.substr(5);
				}
				else {
					this.value = '+' + this.value.substr(1);
					if (length == 3 && this.value.charAt(4) != '-')
						this.value = this.value.substr(0, 3) + '-' + this.value.substr(3);
				}

				// if the character in the final position and the antepenultimate
				// position are the same and in turn equal to a script or a plus
				// eliminates the last repeat
				if (this.value.charAt(length - 1) == this.value.charAt(length - 2) &&
					(this.value.charAt(length - 1) == '-' ||
					this.value.charAt(length - 1) == '+')) {
					// takes the value from the zero position to one less position,
					// deleting 1 of the dashes at the end
					this.value = this.value.substr(0, length - 1);
				}
			};

			selector = getSelector(selector, 'validatePhoneNumber');
			_addEvent({
				selector,
				eventsList: ['blur', 'keyup'],
				functionToValidate: overWriteFunction
			 });
			return this;
		},

		validatePostalCode: function(selector = '.validate-postal-code') {
			const pattern = /((0[1-9]|1[0-2])\-(0[1-9]|1[0-9]|2[0-9]|3[01])\-\d{4})(\s+)(([0-1][0-9]|[2][0-3]):([0-5][0-9]):([0-5][0-9])|24:00:00)/g;
			selector = getSelector(selector, 'validatePostalCode');
			_addEvent({ selector, pattern });
			return this;
		},

		validateRealNumber: function(selector = '.validate-real-number') {
			const pattern = /[^0-9.]/g;
			selector = getSelector(selector, 'validateRealNumber');
			_addEvent({ selector, pattern });
			return this;
		},

		validateRif: function(selector = '.validate-rif') {
			// const pattern = /^([VEJPGC]{1})([0-9]{7,9})$/g;
			const pattern = /^[VEJPGC][-][0-9]{7,9}[-][0-9]{1}$/g;
			selector = getSelector(selector, 'validateRif');
			_addEvent({ selector, pattern });
			return this;
		},

		/**
		 * 0.0.4
		 * 10.20.30
		 * 1.1.2-prerelease+meta
		 * 1.1.2+meta
		 * 1.0.0-alpha
		 * 1.0.0-alpha.beta
		 * 1.0.0-alpha.1
		 * 1.0.0-alpha.0valid
		 * 1.0.0-rc.1+build.1
		 * 1.2.3-beta
		 * 10.2.3-DEV-SNAPSHOT
		 * 1.2.3-SNAPSHOT-123
		 * 2.0.0+build.1848
		 * 2.0.1-alpha.1227
		 * 1.0.0-alpha+beta
		 * 1.2.3----RC-SNAPSHOT.12.9.1--.12+788
		 * 1.2.3----R-S.12.9.1--.12+meta
		 */
		validateSemanticVersion: function(selector = '.validate-semantic-version') {
			const pattern = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/gm;
			selector = getSelector(selector, 'validateSemanticVersion');
			_addEvent({ selector, pattern });
			return this;
		},

		validateTime: function(selector = '.validate-time') {
			const pattern = /([01]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?/g;
			// const pattern = /^(0[1-9]|1\d|2[0-3]):([0-5]\d):([0-5]\d)$/g;
			selector = getSelector(selector, 'validateTime');
			_addEvent({ selector, pattern });
			return this;
		},

		validateUrl: function(selector = '.validate-url') {
			// const pattern = /([--:\w?@%&+~#=]*\.[a-z]{2,4}\/{0,2})((?:[?&](?:\w+)=(?:\w+))+|[--:\w?@%&+~#=]+)?/;
			const pattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
			// const pattern = /^(ht|f)tp(s?)\:\/\/[0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*(:(0-9)*)*(\/?)( [a-zA-Z0-9\-\.\?\,\'\/\\\+&%\$#_]*)?$/;
			// const pattern = /^((ht|f)tp(s?)\:\/\/)?[0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*(:(0-9)*)*(\/?)( [a-zA-Z0-9\-\.\?\,\'\/\\\+&%\$#_]*)?$/;
			let _domElements = document.querySelectorAll(selector);

			const overWriteFunction = function(event) {
				event.preventDefault();

				if (!this.value.match(pattern) && this.value.trim() != '') {
					setTimeout(function() {
						this.focus();
					}, 10);
					console.log('url mala');
				}
				else if (this.value.trim() == '') {
					console.log('url vacia');
				}
				else {
					console.log('url bien');
				}
				this.value = _removeAccents(this.value);
			};

			selector = getSelector(selector, 'validateUrl');
			_addEvent({
				selector,
				pattern: /[ñ` ´~!#%^&$¡¨¿*()°¬|+\=?,;:'"<>\{\}\[\]\\\/]/,
				eventsList: ['keyup']
			});
			_addEvent({
				selector,
				eventsList: ['blur'],
				functionToValidate: overWriteFunction
			});
			return this;
		},

		/**
		 * Universally Unique Identifier (UUID)
		 */
		validateUuid: function(selector = '.validate-uuid') {
			const pattern =  /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/gm;
			selector = getSelector(selector, 'validateUuid');
			_addEvent({ selector, pattern });
			return this;
		},

		// crypto currency
		validateWalletAddress: function(selector = '.validate-wallet-address') {
			const pattern = /([13][a-km-zA-HJ-NP-Z0-9]{26,33})/g;
			selector = getSelector(selector, 'validateWalletAddress');
			_addEvent({ selector, pattern });
			return this;
		},

		// remove the accents and diacritics
		validateWithoutDiacritics: function(selector = '.value-without-diacritic', setLang = 'es') {
			const langHtml = window.navigator.language || navigator.browserLanguage;
			const spanishLang = ['es', 'es-ES', 'español', 'spanish'];
			let pattern = /[\u0300-\u036f]/g;
			let valueToReplace = '';

			if (spanishLang.includes(setLang) || spanishLang.includes(langHtml) || spanishLang.includes(this.getAttribute('lang'))) {
				pattern = /([^n\u0300-\u036f]|n(?!\u0303(?![\u0300-\u036f])))[\u0300-\u036f]+/gi;
				valueToReplace = '$1';
			}

			const overWriteFunction = function(_Event) {
				this.value = this.value
					.normalize('NFD')
					.replace(pattern, valueToReplace)
					.normalize();
			};

			selector = getSelector(selector, 'validateWithoutDiacritics');
			_addEvent({
				selector,
				eventsList: ['input'],
				functionToValidate: overWriteFunction
			});
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

			selector = getSelector(selector, 'valueCapitalLetter');
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
		}

	} // end return
})();

export default validateInput;
