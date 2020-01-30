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
	const _inputs_html = 'textarea, input[type=text], input[type=password], ' +
		'input[type=number], input[type=tel], input[type=email], input[type=url], ' +
		'input[type=date], input[type=datetime-local], input[type=search], ' +
		'input[type=month], input[type=time], input[type=week]';

	/**
	 * [_addEvent description]
	 * @param {string} _Selector Selectors HTML DOM (tag, #id, .class) separate with ','
	 * @param {array|String} _Events    DOM Events to add in HTML inputs
	 * @param {RegExp} _Pattern  Pattern in regular expresion
	 * @param {string} _Replace  Value to replace, default string empty ""
	 */
	const _addEvent = function({
		_Selector,
		_Pattern,
		_Events = 'blur, keyup',
		_Replace = '',
		_Function
	}) {
		let _domElements = document.querySelectorAll(_Selector);

		if (!Array.isArray(_Events) || typeof _Events === 'string') {
			_Events = _Events.split(',');
		}

		const domElementsLength = _domElements.length;
		let domElementsIndex = 0;
		// iteration elements DOM
		while (domElementsIndex < domElementsLength) {
			const eventsLength = _Events.length;
			let eventsIndex = 0;
			while (eventsIndex < eventsLength) {
				_addIndividualEnvent({
					_Selector: _domElements[domElementsIndex],
					_Pattern,
					_Event: _Events[eventsIndex].trim(),
					_Replace,
					_Function
				});
				eventsIndex++;
			}
			domElementsIndex++;
		}
	};

	/**
	 *
	 * @param {string} _Selector
	 * @param {RegExp} _Pattern
	 * @param {*} _Event
	 * @param {string} _Replace
	 */
	const _addIndividualEnvent = function({
		_Selector,
		_Pattern,
		_Event,
		_Replace = '',
		_Function = function(event) {
			this.value = this.value.replace(_Pattern, _Replace);
		}
	}) {
		// add event into DOM
		_Selector.addEventListener(_Event, _Function);
	};

	/**
	 * Remove accents in text and replace with equivalent letter
	 * @param {String} _Text
	 */
	const _removeAccents = function(_Text) {
		//console.log("palabra actual: " + _Text);
		/*
		_Text = _Text.replace(/[ñ]/n, 'n');
		_Text = _Text_Text.replace(/[ç]/, 'c');
		*/
		_Text = _Text
			.replace(/[áäàâãå]/gi, 'a')
			.replace(/[ÁÄÂÃÀ]/gi, 'A')
			.replace(/[éëè]/gi, 'e')
			.replace(/[ÉËÊÈ]/gi, 'E')
			.replace(/[íïîì]/gi, 'i')
			.replace(/[ÍÏÎÌ]/gi, 'I')
			.replace(/[óöôò]/gi, 'o')
			.replace(/[ÓÖÔÒ]/gi, 'O')
			.replace(/[úüûù]/gi, 'u')
			.replace(/[ÚÜÛÙ]/gi, 'U')
			.replace(/[ýÿ]/gi, 'y')
			.replace(/[Ý]/gi, 'Y');

		return _Text;
	};

	return {
		// public methods and properties

		/**
		 * validation so that it does not allow you to start typing with spaces
		 * and/or do not allow 2 consecutive spaces at the end
		 */
		validatete_spaces: function() {
			let _domElements = document.querySelectorAll(_inputs_html);
			let _Pattern = /^\s+/;
			const overWriteFunction = function() {
				//remove spaces at the beginning
				this.value = this.value.replace(_Pattern, '');

				//remove consecutive spaces
				this.value = this.value.replace(/ +/gim, ' ');
			};

			_addEvent({
				_Selector: _inputs_html,
				_Events: ['keydown', 'blur'],
				_Function: overWriteFunction
			});
		},

		validatete_no_spaces: function(_Selector = '.validatete_no_spaces') {
			let _Pattern = / /gim;
			_addEvent({ _Selector, _Pattern });
		},

		// remove the accents and diacritics
		value_without_diacritic: function(
			_Selector = '.value_without_diacritic, .valor_sin_diacriticos',
			_Language = 'es'
		) {
			let _idiomaHTML = window.navigator.language || navigator.browserLanguage;
			let _domElements = document.querySelectorAll(_Selector);
			let _es = ['es', 'es-ES', 'español', 'spanish'];

			// Recorremos cada uno de nuestros elementos DOM HTML
			for (let i = 0; i < _domElements.length; i++){
				if (_es.includes(_idiomaHTML)
					|| _es.includes(_domElements[i].getAttribute("lang"))) {
					_Pattern = /([^n\u0300-\u036f]|n(?!\u0303(?![\u0300-\u036f])))[\u0300-\u036f]+/gi;
					_Reemplazo = "$1";
				}
				else {
					_Pattern = /[\u0300-\u036f]/g;
					_Reemplazo = "";
				}
				_domElements[i].addEventListener('input', function(_Event) {
					this.value = this.value
						.normalize('NFD')
						.replace(_Pattern, _Reemplazo)
						.normalize();
				});
			}
		},

		// validate para el ancho máximo de los input number, ya que por diseño
		//solo admite el atributo min y max
		validate_maximo: function(_Selector = "input[type=number]") {
			let _domElements = document.querySelectorAll(_Selector);
			//Recorremos cada uno de nuestros elementos DOM HTML
			for (let i = 0; i < _domElements.length; i++){
				_domElements[i].addEventListener('input', function(_Event) {
					let maxlength;
					// es necesaria la condición ya que los type number no manejan
					// el atributo maxlength
					if (this.getAttribute("maxlength")) {
						maxlength = this.getAttribute("maxlength");
						//si esta definido el atributo max
					}
					else if (this.getAttribute("max")) {
						maxlength = this.getAttribute("max").length;
					}
					else {
						// break function without attribute
						return;
					}
					this.value = this.value.slice(0, maxlength);
				});
			}
		},

		//Coloca todas las letras en mayúscula
		valor_mayuscula: function(_Selector = '.valor_mayuscula') {
			let _domElements = document.querySelectorAll(_Selector);
			//Recorremos cada uno de nuestros elementos DOM HTML
			for (let i = 0; i < _domElements.length; i++) {
				_domElements[i].addEventListener('input', function(_Event) {
					this.value = this.value.toUpperCase();
				});
			};
		},

		//Coloca todas las letras a minúsculas
		valor_minuscula: function(_Selector = '.valor_minuscula') {
			let _domElements = document.querySelectorAll(_Selector);
			//Recorremos cada uno de nuestros elementos DOM HTML
			for (let i = 0; i < _domElements.length; i++) {
				_domElements[i].addEventListener('input', function(_Event) {
					this.value = this.value.toLowerCase();
				});
			};
		},

		//Coloca la inicial en mayúscula, como la función ucfirst en PHP
		valor_mayuscula_primera: function(_Selector = '.valor_mayuscula_primera') {
			let _domElements = document.querySelectorAll(_Selector);
			let _Pattern = /^([A-ZÁÉÍÓÚ]{1}[a-zñáéíóú]+[\s]*)+$/g;
			//Recorremos cada uno de nuestros elementos DOM HTML
			for (let i = 0; i < _domElements.length; i++) {
				_domElements[i].addEventListener('keyup', function(_Event) {
					//this.value = this.value.replace(_Pattern);
					this.value = this.value.toLowerCase();
					this.value = this.value.charAt(0).toUpperCase() + this.value.slice(1);
				});
			};
		},

		//Coloca la inicial en mayúscula, como la función ucfirst en PHP
		valor_mayuscula_inicial: function(_Selector = '.valor_mayuscula_inicial') {
			validateInput.valor_mayuscula_primera(_Selector);
		},

		//Coloca primera letra en mayúscula de cada palabra, como la función ucwords en PHP
		valor_capitalize: function(_Selector = '.valor_capitalize') {
			let _Pattern = /\b[a-z]/g;
			let _Pattern2 = /^([a-z\u00E0-\u00FC])|\s+([a-z\u00E0-\u00FC])/g;
			let _domElements = document.querySelectorAll(_Selector);

			//Recorremos cada uno de nuestros elementos DOM HTML
			for (let i = 0; i < _domElements.length; i++) {
				_domElements[i].addEventListener('keyup', function(_Event) {
					this.value = this.value.toLowerCase().replace(_Pattern, function(letra) {
						return letra.toUpperCase();
					});
				});
			};
		},

		//validate para valores NUMERICOS con 0 antes
		validateNumber: function(_Selector = '.validate-number') {
			let _Pattern = /[^0-9]/g;
			_addEvent({ _Selector, _Pattern });
		},

		//MEJORAR VALIDACION DEL PRIMER CARACTER EN 0 CON EXPRESIONES REGULARES
		//validate que solo sean números enteros
		validate_num_entero: function(_Selector = '.validate_num_entero') {
			let _Pattern = /[^0-9]/g;
			//let _Pattern = /^[0-9]{0,12}([,][0-9]{2,2})?$/g;
			///let _Pattern = /^[0-9]{0,12}([,][0-9]{2,2})?$/g;
			//let _Pattern = /^[1-9]{1}([0-9]{1,})?$/g;
			//this.value = this.value.replace(/^[1-9][0-9]*$/g, '');
			//this.value = this.value.replace(/^[1-9]\d*$/g, '');
			//this.value = this.value.replace(/[1-9]\d*/g, '');
			//this.value = this.value.replace(/^\d*$/g, '');
			//this.value = this.value.replace(/^-?(?:0?[1-9]\d*|0)$/g, '');
			//let _Pattern = /^[1-9]{1}[0-9]{2,}/g;
			//let _Pattern = /[1-9]\d{0,}/g; //numero mayora cero
			let _domElements = document.querySelectorAll(_Selector);

			//Recorremos cada uno de nuestros elementos DOM HTML
			for (let i = 0; i < _domElements.length; i++){
				_domElements[i].addEventListener('keyup', function(_Event){
					this.value = this.value.replace(_Pattern, '');
					while(this.value.charAt(0) == "0") {
						this.value = this.value.substring(1);
					}
				});
				_domElements[i].addEventListener('blur', function(_Event) {
					this.value = this.value.replace(_Pattern, '');
					while(this.value.charAt(0) == "0") {
						this.value = this.value.substring(1);
					}
				});
			}
		},

		// validate only letters from A to Z
		validateAlphabetic: function(_Selector = '.validate-alphabetic') {
			let _Pattern = /[^a-zA-Zá-úÁ-Úä-üÄ-Üà-ùÀ-Ù ]/gi;
			//let _Pattern = /[0-9¨´`~!@#$%^&*()_°¬|+\-=¿?;:'",.<>\{\}\[\]\\\/]/gi;
			_addEvent({ _Selector, _Pattern });
		},

		validateAlfaNumeric: function(_Selector = '.validate-alphanumeric') {
			let _Pattern = /[¨´`'"~!@#$%^&*()_°¬|+\-=?;:,._ç*+/¡<>\{\}\[\]\\\/]/gi;
			_addEvent({ _Selector, _Pattern });
		},

		// validate para NUMEROS DE TELEFONO Y FAX, locales e internacionales
		// falta validater que no repita mas de 1 vez el guion y el mas
		validate_num_telefono: function(_Selector = '.validate_num_telefono') {
			let _Pattern = /[^0-9+-]/gi;
			let _domElements = document.querySelectorAll(_Selector);

			//Recorremos cada uno de nuestros elementos DOM HTML
			for (let i = 0; i < _domElements.length; i++){
				_domElements[i].addEventListener('keyup', function(_Event){
					this.value = this.value.replace(_Pattern, '');
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
				});
				_domElements[i].addEventListener('blur', function(_Event){
					this.value = this.value.replace(_Pattern, '');
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
				});
			}
		},

		//validate para NUMEROS DE TELEFONO Y FAX, locales e internacionales
		//falta validater que no repita mas de 1 vez el guion y el mas
		validate_telefono_mundial: function(_Selector = '.validate_num_telefono') {
			let _Pattern = /^\s*(?:\+?(\d{1,3}))?([-. (]*(\d{3})[-. )]*)?((\d{3})[-. ]*(\d{2,4})(?:[-.x ]*(\d+))?)\s*$/g;
			_addEvent({ _Selector, _Pattern });
			/*
			+584246573321
			+42 555.123.4567
			+1-(800)-123-4567
			+7 555 1234567
			+7(926)1234567
			(926) 1234567
			+79261234567
			*/
		},

		validate_num_real: function(_Selector = ".validate_num_real") {
			let _Pattern = /[^0-9.]/g;
			_addEvent({ _Selector, _Pattern });
		},

		validateBanckAccount: function(_Selector = '.validate_num_banco, .validate_cuenta_banco') {
			let _Pattern = /[^0-9][-]{}$/g;
			_addEvent({ _Selector, _Pattern });
		},

		validate_operacion_numerica: function(_Selector = ".validate_operacion_numerica") {
			let _Pattern = /[^0-9.+*\-\/%=]/g;
			_addEvent({ _Selector, _Pattern });
		},

		validate_etiqueta_html: function(_Selector = ".validate_html_tag") {
			//let _Pattern = /[^0-9'"a-z<>\-\/\\=_ ]/gi;
			let _Pattern =/^<([a-z]+)([^<]+)*(?:>(.*)<\/\1>|\s+\/>)$/g
			_addEvent({ _Selector, _Pattern });
		},

		validate_correo: function(_Selector = ".validate_correo") {
			//let _Pattern = /[a-zA-Z0-9.+_-]+@[a-zA-Z0-9.-]+\.[a-zA-Z0-9.-]+/i;
			let _Pattern = /^([^@\s]+)@((?:[-a-z0-9]+\.)+[a-z]{1,})$/i;
			let _domElements = document.querySelectorAll(_Selector);

			//Recorremos cada uno de nuestros elementos DOM HTML
			for (let i = 0; i < _domElements.length; i++) {
				//enfoca si no pasa validatecion
				_domElements[i].addEventListener('blur', function(_Event) {
					_Event.preventDefault();

					// x@x.xx
					//if( !this.value.match(/^[^\s()<>@,;:\/]+@\w[\w\.-]+\.[a-z]{1,}$/i) ) {
					if (!this.value.match(_Pattern)
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

				_addIndividualEnvent(_domElements[i], /[ñ` ´~!#%^&$¡¨¿*()°¬|+\=?,;:'"<>\{\}\[\]\\\/]/, 'keyup');
			};
		},

		validate_direccion: function(_Selector = ".validate_direccion") {
			let _Pattern = /[`~!@%^&$¡¨¿*_¬|+\=?;:'"<>\{\}\[\]]/gi;
			_addEvent({ _Selector, _Pattern });
		},

		// validate el grupo sanguíneo A+, A-, O+, A-
		validate_sangre: function(_Selector = ".validate_sangre") {
			///let _Pattern = /^[aboABO-+]/gi;
			let _Pattern = /[^aboABO+-]/g;
			_addEvent({ _Selector, _Pattern });
		},

		validate_rif: function(_Selector = ".validate_rif") {
			//let _Pattern = /^([VEJPGC]{1})([0-9]{7,9})$/g;
			let _Pattern = /^[VEJPGC][-][0-9]{7,9}[-][0-9]{1}$/g;
			_addEvent({ _Selector, _Pattern });
		},

		validate_mac: function(_Selector = ".validate_mac") {
			let _Pattern = /[a-fA-F0-9.+_-]+:[a-fA-F0-9.+_-]+:[a-fA-F0-9.+_-]+:[a-fA-F0-9.+_-]+:[a-fA-F0-9.+_-]+:[a-fA-F0-9.+_-]+/gi;
			_addEvent({ _Selector, _Pattern });
		},

		validate_ip: function(_Selector = ".validate_ip") {
			let _Pattern = /\b([1-9]|[1-9][0-9]|1([0-9][0-9])|2([0-4][0-9]|5[0-5]))\.([0-9]|[1-9][0-9]|1([0-9][0-9])|2([0-4][0-9]|5[0-5]))\.([0-9]|[1-9][0-9]|1([0-9][0-9])|2([0-4][0-9]|5[0-5]))\.([0-9]|[1-9][0-9]|1([0-9][0-9])|2([0-4][0-9]|5[0-5]))\b/g;
			_addEvent({ _Selector, _Pattern });
		},

		validate_ip_puerto: function(_Selector = ".validate_ip_puerto") {
			let _Pattern = /[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}:[0-9]{1,5}/g;
			_addEvent({ _Selector, _Pattern });
		},

		validate_num_moneda: function(_Selector = ".validate_num_moneda") {
			let _Pattern = /^[0-9]{0,12}([,][0-9]{2,2})?$/g;
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

			if(typeof priceFormat === 'function') {
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
		},

		validate_url: function(_Selector = ".validate_url") {
			//let _Pattern = /([--:\w?@%&+~#=]*\.[a-z]{2,4}\/{0,2})((?:[?&](?:\w+)=(?:\w+))+|[--:\w?@%&+~#=]+)?/;
			let _Pattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
			//let _Pattern = /^(ht|f)tp(s?)\:\/\/[0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*(:(0-9)*)*(\/?)( [a-zA-Z0-9\-\.\?\,\'\/\\\+&%\$#_]*)?$/;
			//let _Pattern = /^((ht|f)tp(s?)\:\/\/)?[0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*(:(0-9)*)*(\/?)( [a-zA-Z0-9\-\.\?\,\'\/\\\+&%\$#_]*)?$/;
			let _domElements = document.querySelectorAll('.validate_url');

			//Recorremos cada uno de nuestros elementos DOM HTML
			for (let i = 0; i < _domElements.length; i++) {
				//enfoca si no pasa validatecion
				_domElements[i].addEventListener('blur', function(_Event) {
					_Event.preventDefault();

					if (!this.value.match(_Pattern)
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
		},

		validate_tiempo: function(_Selector = ".validate_tiempo") {
			let _Pattern = /([01]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?/g;
			//let _Pattern = /^(0[1-9]|1\d|2[0-3]):([0-5]\d):([0-5]\d)$/g;
			//let _Pattern = /^(0[1-9]|1\d|2[0-3]):([0-5]\d):([0-5]\d)$/g;
			_addEvent({ _Selector, _Pattern });
		},

		validate_fecha: function(_Selector = ".validate_fecha") {
			let _Pattern = /(0[1-9]|[12][0-9]|3[01])[\/.](0[13578]|1[02])[\/.](20)[0-9]{2}|(0[1-9]|[12][0-9]|30)[\/.](0[469]|11)[\/.](20)[0-9]{2}|(0[1-9]|1[0-9]|2[0-8])[\/.](02)[\/.](20)[0-9]{2}|29[\/.](02)[\/.](((20)(04|08|[2468][048]|[13579][26]))|2000)/g;
			//let _Pattern = /^\d{1,2}\/\d{1,2}\/\d{2,4}$/g;
			_addEvent({ _Selector, _Pattern });
		},

		validate_fecha_tiempo: function(_Selector = ".validate_fecha_tiempo") {
			let _Pattern = /^([1-9]{2}|[0-9][1-9]|[1-9][0-9])[0-9]{3}$/g;
			_addEvent({ _Selector, _Pattern });
		},

		validate_codigo_postal: function(_Selector = ".validate_codigo_postal") {
			let _Pattern = /((0[1-9]|1[0-2])\-(0[1-9]|1[0-9]|2[0-9]|3[01])\-\d{4})(\s+)(([0-1][0-9]|[2][0-3]):([0-5][0-9]):([0-5][0-9])|24:00:00)/g;
			_addEvent({ _Selector, _Pattern });
		},

		validate_color_hex: function(_Selector = ".validate_color_hex") {
			let _Pattern = /[#]([\dA-F]{6}|[\dA-F]{3})/g;
			_addEvent({ _Selector, _Pattern });
		},

		validate_direccion_bitcoin: function(_Selector = ".validate_direccion_bitcoin") {
			let _Pattern = /([13][a-km-zA-HJ-NP-Z0-9]{26,33})/g;
			_addEvent({ _Selector, _Pattern });
		},

		validate_hastag: function(_Selector = ".validate_hastag") {
			let _Pattern = /([@][A-z]+)|([#][A-z]+)/g;
			_addEvent({ _Selector, _Pattern });
		},

		validateAll: function() {
			validateInput.validatete_spaces();
			validateInput.value_without_diacritic();
			validateInput.valor_minuscula();
			validateInput.valor_mayuscula_primera();
			validateInput.valor_capitalize();
			validateInput.valor_mayuscula();
			//validateInput.validate_maximo();

			validateInput.validateNumber();
			validateInput.validate_num_entero();
			validateInput.validateAlphabetic();
			validateInput.validate_sangre();
			validateInput.validateAlfaNumeric();
			validateInput.validate_correo();
			validateInput.validate_direccion();
			validateInput.validate_num_telefono();
			validateInput.validate_num_real();
			validateInput.validate_operacion_numerica();
			validateInput.validate_etiqueta_html();
			validateInput.validateBanckAccount();
		},

		validate_inner: function() {
			validateInput.validateAll();
			console.log("Reassigned the validations to innerHTML");
		}
	} // end return
})();

export default validateInput;
