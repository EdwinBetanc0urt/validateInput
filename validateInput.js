
/**
 * Modulo de Validaciones
 * @required: ECMAScript 2015 (ES6)
 * @author: Edwin Betancourt <EdwinBetanc0urt@outlook.com>
 * @version 0.6
 * @created: 05-Abril-2018
 * @modificated: 08-Abril-2018
 * @supported: Mozilla Firefox +58
 * @dependency: jQuery +3.3.1 para validación priece format

		Este programa es software libre, su uso, redistribución, y/o modificación
	debe ser bajo los términos de las licencias indicadas, la GNU Licencia Pública
	General (GPL) publicada por la Fundación de Software Libre(FSF) de la versión
	3 o cualquier versión posterior y la Creative Commons Atribución - Compartir
	Igual (CC BY-SA) de la versión 4.0 Internacional o cualquier versión posterior.

		Este software esta creado con propósitos generales que sean requeridos,
	siempre que este sujeto a las licencias indicadas, pero SIN NINGUNA GARANTÍA
	Y/O RESPONSABILIDAD que recaiga a los creadores, autores y/o desarrolladores,
	incluso sin la garantía implícita de COMERCIALIZACIÓN o IDONEIDAD PARA UN
	PROPÓSITO PARTICULAR. Cualquier MODIFICACIÓN, ADAPTACIÓN Y/O MEJORA que se haga
	a partir de este código debe ser notificada y enviada a la fuente, comunidad
	o repositorio de donde fue obtenida, y/o a sus AUTORES.
 */
var modValidacion = (() => {
	//métodos y propiedades privados
	var _version = "ver 0.6";

	return {
		//métodos y propiedades públicos

		//validación para que no permita empezar a escribir con espacios y/o no
		//permita 2 espacios consecutivos al final
		valida_espacios: () => {
			let _elementosDOM = document.querySelectorAll(
				"textarea, " +
				"input[type=text], input[type=number], input[type=password], " +
				"input[type=email], input[type=search], input[type=url], " +
				"input[type=tel], input[type=date], input[type=datetime-local], " +
				"input[type=month], input[type=time], input[type=week]"
			);
			let _Patron = /^\s+/;

			for(let i = 0; i < _elementosDOM.length; i++){
				_elementosDOM[i].addEventListener('keydown', function(pEvento){
					//quita los espacios al inicio
					this.value = this.value.replace(_Patron, '');

					//quita los espacios consecutivos
					this.value = this.value.replace(/ +/gim, ' ');
				});
				_elementosDOM[i].addEventListener('blur', function(pEvento){
					//quita los espacios al inicio
					this.value = this.value.replace(_Patron, '');

					//quita los espacios consecutivos
					this.value = this.value.replace(/ +/gim, ' ');
				});
			}
		},

		//quita los acentos y diacríticos
		valor_sin_diacriticos: (_Selector = '.valor_sin_diacriticos', _Lenguaje = 'es') => {
			let _idiomaHTML = window.navigator.language || navigator.browserLanguage;
			let _elementosDOM = document.querySelectorAll(_Selector);
			let _es = ['es', 'es-ES', 'español', 'spanish'];
			//Recorremos cada uno de nuestros elementos DOM HTML

			for(let i = 0; i < _elementosDOM.length; i++){
				if (_es.indexOf(_idiomaHTML) > -1
					|| _es.indexOf(_elementosDOM[i].getAttribute("lang")) > -1 ) {
					_Patron = /([^n\u0300-\u036f]|n(?!\u0303(?![\u0300-\u036f])))[\u0300-\u036f]+/gi;
					_Reemplazo = "$1";
				}
				else {
					_Patron = /[\u0300-\u036f]/g;
					_Reemplazo = "";
				}
				_elementosDOM[i].addEventListener('input', function(pEvento) {
					this.value = this.value
						.normalize('NFD')
						.replace(_Patron, _Reemplazo)
						.normalize();
				});
			}
		},

		//validación para el ancho máximo de los input number, ya que por diseño
		//solo admite el atributo min y max
		valida_maximo: () => {
			let _elementosDOM = document.querySelectorAll("input[type=number]");
			//Recorremos cada uno de nuestros elementos DOM HTML
			for(let i = 0; i < _elementosDOM.length; i++){
				_elementosDOM[i].addEventListener('input', function(pEvento) {
					//es necesaria la condición ya que los type number no manejan
					//el atributo maxlength
					if (this.getAttribute("maxlength")) {
						let liMax = this.getAttribute("maxlength");
						//si esta definido el atributo max
					}
					else if (this.getAttribute("max")) {
						let liMax = this.getAttribute("max").length;
					}
					else {
						//continue; //no funciona porque dentro del for existe una función
						return;
					}
					this.value = this.value.slice(0, liMax);
				});
			}
		},

		//Coloca todas las letras en mayúscula
		valor_mayuscula: (_Selector = '.valor_mayuscula') => {
			let _elementosDOM = document.querySelectorAll(_Selector);
			//Recorremos cada uno de nuestros elementos DOM HTML
			for(let i = 0; i < _elementosDOM.length; i++) {
				_elementosDOM[i].addEventListener('input', function(pEvento) {
					this.value = this.value.toUpperCase();
				});
			};
		},

		//Coloca todas las letras a minúsculas
		valor_minuscula: (_Selector = '.valor_minuscula') => {
			let _elementosDOM = document.querySelectorAll(_Selector);
			//Recorremos cada uno de nuestros elementos DOM HTML
			for(let i = 0; i < _elementosDOM.length; i++) {
				_elementosDOM[i].addEventListener('input', function(pEvento) {
					this.value = this.value.toLowerCase();
				});
			};
		},

		//Coloca la inicial en mayúscula, como la función ucfirst en PHP
		valor_mayuscula_primera: (_Selector = '.valor_mayuscula_primera') => {
			let _elementosDOM = document.querySelectorAll(_Selector);
			let _Patron = /^([A-ZÁÉÍÓÚ]{1}[a-zñáéíóú]+[\s]*)+$/g;
			//Recorremos cada uno de nuestros elementos DOM HTML
			for(let i = 0; i < _elementosDOM.length; i++) {
				_elementosDOM[i].addEventListener('keyup', function(pEvento) {
					//this.value = this.value.replace(_Patron);
					this.value = this.value.toLowerCase();
					this.value = this.value.charAt(0).toUpperCase() + this.value.slice(1);
				});
			};
		},
		//Coloca la inicial en mayúscula, como la función ucfirst en PHP
		valor_mayuscula_inicial: (_Selector = '.valor_mayuscula_inicial') => {
			modValidacion.valor_mayuscula_primera(_Selector);
		},

		//Coloca primera letra en mayúscula de cada palabra, como la función ucwords en PHP
		valor_capitalize: (_Selector = '.valor_capitalize') => {
			let _Patron = /\b[a-z]/g;
			let _Patron2 = /^([a-z\u00E0-\u00FC])|\s+([a-z\u00E0-\u00FC])/g;
			let _elementosDOM = document.querySelectorAll(_Selector);

			//Recorremos cada uno de nuestros elementos DOM HTML
			for(let i = 0; i < _elementosDOM.length; i++) {
				_elementosDOM[i].addEventListener('keyup', function(pEvento) {
					this.value = this.value.toLowerCase().replace(_Patron, (letra) => {
						return letra.toUpperCase();
					});
				});
			};
		},

		//validaciones para valores NUMERICOS con 0 antes
		valida_numerico: (_Selector = '.valida_numerico') => {
			let _Patron = /[^0-9]/g;
			let _elementosDOM = document.querySelectorAll(_Selector);

			//Recorremos cada uno de nuestros elementos DOM HTML
			for(let i = 0; i < _elementosDOM.length; i++){
				_elementosDOM[i].addEventListener('keyup', function(pEvento) {
					this.value = this.value.replace(_Patron, '');
				});
				_elementosDOM[i].addEventListener('blur', function(pEvento) {
					this.value = this.value.replace(_Patron, '');
				});
			}
		},

		//MEJORAR VALIDACION DEL PRIMER CARACTER EN 0 CON EXPRESIONES REGULARES
		//valida que solo sean números enteros
		valida_num_entero: (_Selector = '.valida_num_entero') => {
			let _Patron = /[^0-9]/g;
			//let _Patron = /^[0-9]{0,12}([,][0-9]{2,2})?$/g;
			///let _Patron = /^[0-9]{0,12}([,][0-9]{2,2})?$/g;
			//let _Patron = /^[1-9]{1}([0-9]{1,})?$/g;
			//this.value = this.value.replace(/^[1-9][0-9]*$/g, '');
			//this.value = this.value.replace(/^[1-9]\d*$/g, '');
			//this.value = this.value.replace(/[1-9]\d*/g, '');
			//this.value = this.value.replace(/^\d*$/g, '');
			//this.value = this.value.replace(/^-?(?:0?[1-9]\d*|0)$/g, '');
			//let _Patron = /^[1-9]{1}[0-9]{2,}/g;
			//let _Patron = /[1-9]\d{0,}/g; //numero mayora cero
			let _elementosDOM = document.querySelectorAll(_Selector);

			//Recorremos cada uno de nuestros elementos DOM HTML
			for(let i = 0; i < _elementosDOM.length; i++){
				_elementosDOM[i].addEventListener('keyup', function(pEvento){
					this.value = this.value.replace(_Patron, '');
					while(this.value.charAt(0) == "0") {
						this.value = this.value.substring(1);
					}
				});
				_elementosDOM[i].addEventListener('blur', function(pEvento) {
					this.value = this.value.replace(_Patron, '');
					while(this.value.charAt(0) == "0") {
						this.value = this.value.substring(1);
					}
				});
			}
		},

		//valida que solo sean letras de la A a la Z
		valida_alfabetico: (_Selector = '.valida_alfabetico') => {
			let _Patron = /[^a-zA-Zá-úÁ-Úä-üÄ-Üà-ùÀ-Ù ]/gi;
			//let _Patron = /[0-9¨´`~!@#$%^&*()_°¬|+\-=¿?;:'",.<>\{\}\[\]\\\/]/gi;
			let _elementosDOM = document.querySelectorAll(_Selector);

			//Recorremos cada uno de nuestros elementos DOM HTML
			for(let i = 0; i < _elementosDOM.length; i++){
				_elementosDOM[i].addEventListener('keyup', function(pEvento){
					this.value = this.value.replace(_Patron, '');
				});
				_elementosDOM[i].addEventListener('blur', function(pEvento){
					this.value = this.value.replace(_Patron, '');
				});
			};
		},

		valida_alfa_numerico: (_Selector = '.valida_alfa_numerico') => {
			let _Patron = /[¨´`'"~!@#$%^&*()_°¬|+\-=?;:,._ç*+/¡<>\{\}\[\]\\\/]/gi;
			let _elementosDOM = document.querySelectorAll(_Selector);

			//Recorremos cada uno de nuestros elementos DOM HTML
			for(let i = 0; i < _elementosDOM.length; i++){
				_elementosDOM[i].addEventListener('keyup', function(pEvento){
					this.value = this.value.replace(_Patron, '');
				});
				_elementosDOM[i].addEventListener('blur', function(pEvento){
					this.value = this.value.replace(_Patron, '');
				});
			}
		},

		//validaciones para NUMEROS DE TELEFONO Y FAX, locales e internacionales
		//falta validar que no repita mas de 1 vez el guion y el mas
		valida_num_telefono: (_Selector = '.valida_num_telefono') => {
			let _Patron = /[^0-9+-]/gi;
			let _elementosDOM = document.querySelectorAll(_Selector);

			//Recorremos cada uno de nuestros elementos DOM HTML
			for(let i = 0; i < _elementosDOM.length; i++){
				_elementosDOM[i].addEventListener('keyup', function(pEvento){
					this.value = this.value.replace(_Patron, '');
					//valida la primera posición sea un cero o un mas
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
				_elementosDOM[i].addEventListener('blur', function(pEvento){
					this.value = this.value.replace(_Patron, '');
					//valida la primera posición sea un cero o un mas
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

		//validaciones para NUMEROS DE TELEFONO Y FAX, locales e internacionales
		//falta validar que no repita mas de 1 vez el guion y el mas
		valida_telefono_mundial: () => {
			let _Patron = /^\s*(?:\+?(\d{1,3}))?([-. (]*(\d{3})[-. )]*)?((\d{3})[-. ]*(\d{2,4})(?:[-.x ]*(\d+))?)\s*$/g;
			let _elementosDOM = document.querySelectorAll('.valida_num_telefono');

			//Recorremos cada uno de nuestros elementos DOM HTML
			for(let i = 0; i < _elementosDOM.length; i++){
				_elementosDOM[i].addEventListener('keyup', function(pEvento){
					this.value = this.value.replace(_Patron, '');
				});
				_elementosDOM[i].addEventListener('blur', function(pEvento){
					this.value = this.value.replace(_Patron, '');
				});
			}
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

		valida_num_real: (_Selector = ".valida_num_real") => {
			let _Patron = /[^0-9.]/g;
			let _elementosDOM = document.querySelectorAll(_Selector);

			//Recorremos cada uno de nuestros elementos DOM HTML
			for(let i = 0; i < _elementosDOM.length; i++){
				_elementosDOM[i].addEventListener('keyup', function(pEvento){
					this.value = this.value.replace(_Patron, '');
				});
				_elementosDOM[i].addEventListener('blur', function(pEvento){
					this.value = this.value.replace(_Patron, '');
				});
			}
		},

		valida_num_banco: (_Selector = '.valida_num_banco') => {
			let _Patron = /[^0-9][-]{}$/g;
			//let _Patron = /^[VEJPGC][-][0-9]{7,9}[-][0-9]{1}$/g;
			let _elementosDOM = document.querySelectorAll(_Selector);

			//Recorremos cada uno de nuestros elementos DOM HTML
			for(let i = 0; i < _elementosDOM.length; i++){
				_elementosDOM[i].addEventListener('keyup', function(pEvento){
					this.value = this.value.replace(/^[VEJPGC][-][0-9]{7,9}[-][0-9]{1}$/g, '');
				});
				_elementosDOM[i].addEventListener('blur', function(pEvento){
					this.value = this.value.replace(/^[VEJPGC][-][0-9]{7,9}[-][0-9]{1}$/g, '');
				});
			}
		},

		valida_cuenta_banco: (_Selector = '.valida_cuenta_banco') => {
			modValidacion.valida_num_banco(_Selector);
		},

		valida_operacion_numerica: () => {
			let _Patron = /[^0-9.+*\-\/%=]/g;
			let _elementosDOM = document.querySelectorAll('.valida_operacion_numerica');

			//Recorremos cada uno de nuestros elementos DOM HTML
			for(let i = 0; i < _elementosDOM.length; i++){
				_elementosDOM[i].addEventListener('keyup', function(pEvento){
					this.value = this.value.replace(_Patron, '');
				});
				_elementosDOM[i].addEventListener('blur', function(pEvento){
					this.value = this.value.replace(_Patron, '');
				});
			}
		},

		valida_etiqueta_html: () => {
			//let _Patron = /[^0-9'"a-z<>\-\/\\=_ ]/gi;
			let _Patron =/^<([a-z]+)([^<]+)*(?:>(.*)<\/\1>|\s+\/>)$/g
			let _elementosDOM = document.querySelectorAll('.valida_etiqueta_html');

			//Recorremos cada uno de nuestros elementos DOM HTML
			for(let i = 0; i < _elementosDOM.length; i++){
				_elementosDOM[i].addEventListener('keyup', function(pEvento){
					this.value = this.value.replace(_Patron, '');
				});
				_elementosDOM[i].addEventListener('blur', function(pEvento){
					this.value = this.value.replace(_Patron, '');
				});
			}
		},

		valida_correo: () => {
			//let _Patron = /[a-zA-Z0-9.+_-]+@[a-zA-Z0-9.-]+\.[a-zA-Z0-9.-]+/i;
			let _Patron = /^([^@\s]+)@((?:[-a-z0-9]+\.)+[a-z]{1,})$/i;
			let _elementosDOM = document.querySelectorAll('.valida_correo');

			//Recorremos cada uno de nuestros elementos DOM HTML
			for(let i = 0; i < _elementosDOM.length; i++) {
				//enfoca si no pasa validacion
				_elementosDOM[i].addEventListener('blur', function(pEvento) {
					pEvento.preventDefault();

					// x@x.xx
					//if( !this.value.match(/^[^\s()<>@,;:\/]+@\w[\w\.-]+\.[a-z]{1,}$/i) ) {
					if( !this.value.match(_Patron)
					&& this.value.trim() != "") {
					// x@xx.x
					//if( !(/\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)/.test(this.value)) ) {
					//if( !(/^\w+([\.\-\_]?\w+)*@\w+([\.\-\_]?\w+)*([\.\-\_]?\w{1,})+$/.test(this.value)) ) {
						setTimeout(
							function(){
								_elementosDOM[i].focus();
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
					//_elementosDOM[i].focus();
				});

				//elimina los espacios
				_elementosDOM[i].addEventListener('keyup', function(pEvento) {
					this.value = this.value.replace(/ /gim, ''); //elimina los espacios
					this.value = this.value.replace(/[ñ`´~!#%^&$¡¨¿*()°¬|+\=?,;:'"<>\{\}\[\]\\\/]/gi,'');
					this.value = fjQuitarTildes(this.value);
				});
			};
		},

		valida_direccion: () => {
			let _Patron = /[`~!@%^&$¡¨¿*_¬|+\=?;:'"<>\{\}\[\]]/gi;
			let _elementosDOM = document.querySelectorAll('.valida_direccion');

			//Recorremos cada uno de nuestros elementos DOM HTML
			for(let i = 0; i < _elementosDOM.length; i++){
				_elementosDOM[i].addEventListener('keyup', function(pEvento){
					this.value = this.value.replace(_Patron, '');
				});
				_elementosDOM[i].addEventListener('blur', function(pEvento){
					this.value = this.value.replace(_Patron, '');
				});
			};
		},

		// valida el grupo sanguíneo A+, A-, O+, A-
		valida_sangre: () => {
			///let _Patron = /^[aboABO-+]/gi;
			let _Patron = /[^aboABO+-]/g;
			let _elementosDOM = document.querySelectorAll('.valida_sangre');

			//Recorremos cada uno de nuestros elementos DOM HTML
			for(let i = 0; i < _elementosDOM.length; i++){
				_elementosDOM[i].addEventListener('keyup', function(pEvento){
					this.value = this.value.replace(_Patron, '');
				});
				_elementosDOM[i].addEventListener('blur', function(pEvento){
					this.value = this.value.replace(_Patron, '');
				});
			};
		},

		valida_rif: () => {
			//let _Patron = /^([VEJPGC]{1})([0-9]{7,9})$/g;
			let _Patron = /^[VEJPGC][-][0-9]{7,9}[-][0-9]{1}$/g;
			let _elementosDOM = document.querySelectorAll('.valida_rif');

			//Recorremos cada uno de nuestros elementos DOM HTML
			for(let i = 0; i < _elementosDOM.length; i++){
				_elementosDOM[i].addEventListener('keyup', function(pEvento){
					this.value = this.value.replace(_Patron, '');
				});
				_elementosDOM[i].addEventListener('blur', function(pEvento){
					this.value = this.value.replace(_Patron, '');
				});
			};
		},

		valida_mac: () => {
			let _Patron = /[a-fA-F0-9.+_-]+:[a-fA-F0-9.+_-]+:[a-fA-F0-9.+_-]+:[a-fA-F0-9.+_-]+:[a-fA-F0-9.+_-]+:[a-fA-F0-9.+_-]+/gi;
			let _elementosDOM = document.querySelectorAll('.valida_mac');

			//Recorremos cada uno de nuestros elementos DOM HTML
			for(let i = 0; i < _elementosDOM.length; i++){
				_elementosDOM[i].addEventListener('keyup', function(pEvento){
					this.value = this.value.replace(_Patron, '');
				});
				_elementosDOM[i].addEventListener('blur', function(pEvento){
					this.value = this.value.replace(_Patron, '');
				});
			};
		},

		valida_ip: () => {
			let _Patron = /\b([1-9]|[1-9][0-9]|1([0-9][0-9])|2([0-4][0-9]|5[0-5]))\.([0-9]|[1-9][0-9]|1([0-9][0-9])|2([0-4][0-9]|5[0-5]))\.([0-9]|[1-9][0-9]|1([0-9][0-9])|2([0-4][0-9]|5[0-5]))\.([0-9]|[1-9][0-9]|1([0-9][0-9])|2([0-4][0-9]|5[0-5]))\b/g;
			let _elementosDOM = document.querySelectorAll('.valida_ip');

			//Recorremos cada uno de nuestros elementos DOM HTML
			for(let i = 0; i < _elementosDOM.length; i++){
				_elementosDOM[i].addEventListener('keyup', function(pEvento){
					this.value = this.value.replace(_Patron, '');
				});
				_elementosDOM[i].addEventListener('blur', function(pEvento){
					this.value = this.value.replace(_Patron, '');
				});
			};
		},

		valida_ip_puerto: () => {
			let _Patron = /[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}:[0-9]{1,5}/g;
			let _elementosDOM = document.querySelectorAll('.valida_ip_puerto');

			//Recorremos cada uno de nuestros elementos DOM HTML
			for(let i = 0; i < _elementosDOM.length; i++){
				_elementosDOM[i].addEventListener('keyup', function(pEvento){
					this.value = this.value.replace(_Patron, '');
				});
				_elementosDOM[i].addEventListener('blur', function(pEvento){
					this.value = this.value.replace(_Patron, '');
				});
			};
		},

		valida_num_moneda: () => {
			let _Patron = /^[0-9]{0,12}([,][0-9]{2,2})?$/g;
			// validaciones para NUMEROS DECIMALES
			$('.valida_num_moneda').keyup(function() {
				this.value = this.value.replace(/[^0-9,.]/g, '');

				//Busca la coma y cambia por un punto
				if (this.value.indexOf(","))
					this.value = this.value.replace(/[^0-9.]/g, '.');

				//valida la primera posición que no sea un cero, punto o coma
				if (this.value.charAt(0) == "0" || this.value.charAt(0) == "." || this.value.charAt(0) == ",") {
					this.value = this.value.substring(1);
					this.value = this.value.replace(/[^0-9]/g, '');
				}

				//valida la posición final para que no se repitan dos comas o puntos
				tam = this.value.length; //toma el tamaño de la cadena
				//si el carácter en la posición final y la antepenúltima son iguales y a su vez igual a un punto
				if (this.value.charAt(tam - 1) == this.value.charAt(tam - 2) && this.value.charAt(tam - 1) == ".") {
					//toma el valor desde la posicion cero hasta una posición menos, borrando 2 puntos consecutivos
					this.value = this.value.substr(0, tam - 1);
				}
			});

			if(typeof priceFormat === 'function') {
				$('.valida_moneda_bolivares').priceFormat({
					prefix: '', //simbolo de moneda que va al principio (predeterminado toma USD$)
					suffix: '', //simbolo de moneda que va al final
					centsSeparator: '.', //separador de sentimos
					thousandsSeparator: '', //separador de miles
					insertPlusSign: false //un mas al principio
					//allowNegative: true //permite negativos
				});
			}
			let _elementosDOM = document.querySelectorAll('.valida_direccion');
			//Recorremos cada uno de nuestros elementos DOM HTML
			for(let i = 0; i < _elementosDOM.length; i++){
				_elementosDOM[i].addEventListener('keyup', function(pEvento){
					this.value = this.value.replace(/[`~!@%^&$¡¨¿*_¬|+\=?;:'"<>\{\}\[\]]/gi, '');
				});
			};
		},

		valida_url: () => {
			//let _Patron = /([--:\w?@%&+~#=]*\.[a-z]{2,4}\/{0,2})((?:[?&](?:\w+)=(?:\w+))+|[--:\w?@%&+~#=]+)?/;
			let _Patron = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
			//let _Patron = /^(ht|f)tp(s?)\:\/\/[0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*(:(0-9)*)*(\/?)( [a-zA-Z0-9\-\.\?\,\'\/\\\+&%\$#_]*)?$/;
			//let _Patron = /^((ht|f)tp(s?)\:\/\/)?[0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*(:(0-9)*)*(\/?)( [a-zA-Z0-9\-\.\?\,\'\/\\\+&%\$#_]*)?$/;
			let _elementosDOM = document.querySelectorAll('.valida_url');

			//Recorremos cada uno de nuestros elementos DOM HTML
			for(let i = 0; i < _elementosDOM.length; i++) {
				//enfoca si no pasa validacion
				_elementosDOM[i].addEventListener('blur', function(pEvento) {
					pEvento.preventDefault();

					if( !this.value.match(_Patron)
					&& this.value.trim() != "") {
						setTimeout(
							function(){
								_elementosDOM[i].focus();
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
				});

				//elimina los espacios
				_elementosDOM[i].addEventListener('keyup', function(pEvento) {
					this.value = this.value.replace(/ /gim, ''); //elimina los espacios
					this.value = this.value.replace(/[ñ`´~!#%^&$¡¨¿*()°¬|+\=?,;:'"<>\{\}\[\]\\\/]/gi,'');
					this.value = fjQuitarTildes(this.value);
				});
			};
		},

		valida_tiempo: () => {
			let _Patron = /([01]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?/g;
			//let _Patron = /^(0[1-9]|1\d|2[0-3]):([0-5]\d):([0-5]\d)$/g;
			//let _Patron = /^(0[1-9]|1\d|2[0-3]):([0-5]\d):([0-5]\d)$/g;
			let _elementosDOM = document.querySelectorAll('.valida_tiempo');

			//Recorremos cada uno de nuestros elementos DOM HTML
			for(let i = 0; i < _elementosDOM.length; i++){
				_elementosDOM[i].addEventListener('keyup', function(pEvento){
					this.value = this.value.replace(_Patron, '');
				});
				_elementosDOM[i].addEventListener('blur', function(pEvento){
					this.value = this.value.replace(_Patron, '');
				});
			};
		},

		valida_fecha: () => {
			let _Patron = /(0[1-9]|[12][0-9]|3[01])[\/.](0[13578]|1[02])[\/.](20)[0-9]{2}|(0[1-9]|[12][0-9]|30)[\/.](0[469]|11)[\/.](20)[0-9]{2}|(0[1-9]|1[0-9]|2[0-8])[\/.](02)[\/.](20)[0-9]{2}|29[\/.](02)[\/.](((20)(04|08|[2468][048]|[13579][26]))|2000)/g;
			//let _Patron = /^\d{1,2}\/\d{1,2}\/\d{2,4}$/g;
			let _elementosDOM = document.querySelectorAll('.valida_fecha');

			//Recorremos cada uno de nuestros elementos DOM HTML
			for(let i = 0; i < _elementosDOM.length; i++){
				_elementosDOM[i].addEventListener('keyup', function(pEvento){
					this.value = this.value.replace(_Patron, '');
				});
				_elementosDOM[i].addEventListener('blur', function(pEvento){
					this.value = this.value.replace(_Patron, '');
				});
			};
		},

		valida_fecha_tiempo: () => {
			let _Patron = /^([1-9]{2}|[0-9][1-9]|[1-9][0-9])[0-9]{3}$/g;
			let _elementosDOM = document.querySelectorAll('.valida_fecha_tiempo');

			//Recorremos cada uno de nuestros elementos DOM HTML
			for(let i = 0; i < _elementosDOM.length; i++){
				_elementosDOM[i].addEventListener('keyup', function(pEvento){
					this.value = this.value.replace(_Patron, '');
				});
				_elementosDOM[i].addEventListener('blur', function(pEvento){
					this.value = this.value.replace(_Patron, '');
				});
			};
		},

		valida_codigo_postal: () => {
			let _Patron = /((0[1-9]|1[0-2])\-(0[1-9]|1[0-9]|2[0-9]|3[01])\-\d{4})(\s+)(([0-1][0-9]|[2][0-3]):([0-5][0-9]):([0-5][0-9])|24:00:00)/g;
			let _elementosDOM = document.querySelectorAll('.valida_codigo_postal');

			//Recorremos cada uno de nuestros elementos DOM HTML
			for(let i = 0; i < _elementosDOM.length; i++){
				_elementosDOM[i].addEventListener('keyup', function(pEvento){
					this.value = this.value.replace(_Patron, '');
				});
				_elementosDOM[i].addEventListener('blur', function(pEvento){
					this.value = this.value.replace(_Patron, '');
				});
			};
		},

		valida_color_hex: () => {
			let _Patron = /[#]([\dA-F]{6}|[\dA-F]{3})/g;
			let _elementosDOM = document.querySelectorAll('.valida_color_hex');

			//Recorremos cada uno de nuestros elementos DOM HTML
			for(let i = 0; i < _elementosDOM.length; i++){
				_elementosDOM[i].addEventListener('keyup', function(pEvento){
					this.value = this.value.replace(_Patron, '');
				});
				_elementosDOM[i].addEventListener('blur', function(pEvento){
					this.value = this.value.replace(_Patron, '');
				});
			};
		},

		valida_direccion_bitcoin: () => {
			let _Patron = /([13][a-km-zA-HJ-NP-Z0-9]{26,33})/g;
			let _elementosDOM = document.querySelectorAll('.valida_direccion_bitcoin');

			//Recorremos cada uno de nuestros elementos DOM HTML
			for(let i = 0; i < _elementosDOM.length; i++){
				_elementosDOM[i].addEventListener('keyup', function(pEvento){
					this.value = this.value.replace(_Patron, '');
				});
				_elementosDOM[i].addEventListener('blur', function(pEvento){
					this.value = this.value.replace(_Patron, '');
				});
			};
		},

		valida_hastag: () => {
			let _Patron = /([@][A-z]+)|([#][A-z]+)/g;
			let _elementosDOM = document.querySelectorAll('.valida_hastag');

			//Recorremos cada uno de nuestros elementos DOM HTML
			for(let i = 0; i < _elementosDOM.length; i++){
				_elementosDOM[i].addEventListener('keyup', function(pEvento){
					this.value = this.value.replace(_Patron, '');
				});
				_elementosDOM[i].addEventListener('blur', function(pEvento){
					this.value = this.value.replace(_Patron, '');
				});
			};
		},

		valida_todo: () => {
			modValidacion.valida_espacios();
			modValidacion.valor_sin_diacriticos();
			modValidacion.valor_minuscula();
			modValidacion.valor_mayuscula_primera();
			modValidacion.valor_capitalize();
			modValidacion.valor_mayuscula();
			//modValidacion.valida_maximo();

			modValidacion.valida_numerico();
			modValidacion.valida_num_entero();
			modValidacion.valida_alfabetico();
			modValidacion.valida_sangre();
			modValidacion.valida_alfa_numerico();
			modValidacion.valida_correo();
			modValidacion.valida_direccion();
			modValidacion.valida_num_telefono();
			modValidacion.valida_num_real();
			modValidacion.valida_operacion_numerica();
			modValidacion.valida_etiqueta_html();
			modValidacion.valida_num_banco();
		},

		validar_inner: () => {
			modValidacion.valida_numerico();
			modValidacion.valida_num_entero();
			modValidacion.valida_alfabetico();
			modValidacion.valida_alfa_numerico();
			console.log("Reasignada la validación a los innerHTML ");
		}
	} //fin del return
})();

function valida_todo() {
	modValidacion.valida_todo();
}

function validar_inner() {
	modValidacion.validar_inner();
}
