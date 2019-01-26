import Backbone from '../node_modules/backbone/backbone.js';
import _ from '../node_modules/backbone/node_modules/underscore/underscore.js';
import nanoajax from '../node_modules/nanoajax/index.js';
import config from './config';

var model = {
	inputURL: '',
	keyword: '',
	outputURL: '',
	message: ''
};

document.addEventListener('DOMContentLoaded', function () {
	activateApp();
});

function activateApp() {
	var formElem = document.getElementById('url-form');
	var url2Shorten = document.getElementById('url-input');
	var keywordInput = document.getElementById('custom-keyword');
	var resultElem = document.getElementById('result');
	var msgBox = document.getElementById('message');
	
	formElem.addEventListener('submit', function (ev) {
		ev.preventDefault();

		submitUrl();
	});
	
	function submitUrl() {
		var _url = setInputURL();
		var keyword = setKeyword();

		if (!_url) {
			console.error('Must provide a URL!');
			return;
		}
		
//		if (model.keyword.length) {}

		var urlEncoded = encodeURI(_url);
		
		setMessage('Chargement…');
		
		nanoajax.ajax({
			url: config.apiUrl + '?' + 'signature=' + config.signature
			+ '&action=shorturl'
			+ '&format=simple'
			+ '&url=' + urlEncoded
			+ '&keyword=' + model.keyword,
			method: 'GET',
			cors: 'true'
		}, function (code, responseText) {
			if (code !== 200) {
				setMessage('ERREUR :(');
				console.error('ERROR shortening URL', responseText);
			} else {
				setOutputURL(responseText);
				focusOutput();
			}
		});
	}
	
	url2Shorten.addEventListener('keypress', function (ev) {
		setMessage('');
		
		setOutputURL('');
	});
	
	keywordInput.addEventListener('keypress', function (ev) {
		model.keyword = keywordInput.value;
	});
	
	function setInputURL() {
		setMessage(''); // reset
		model.inputURL = url2Shorten.value;
		
		if (!model.inputURL) {
			return false;
		} else {
			return model.inputURL;
		}
	}
	
	function setKeyword() {
		model.keyword = keywordInput.value;
		
		if (!model.keyword) {
			return false;
		} else {
			return model.keyword;
		}
	}
	
	resultElem.addEventListener('focus', function () {
		focusOutput();
	});
	
	function focusOutput() {
		
		if (!resultElem.value.length) {
			return;
		} else {
			resultElem.select();

			setMessage('Succès!');
		}
	}
	
	function setMessage(message) {
		if (message && message.length) {
			msgBox.innerHTML = message;
			msgBox.classList.add('active');
		} else {
			msgBox.innerHTML = '';
		}
	}
	
	function setOutputURL(url) {
		if (url && url.length) {
			model.outputURL = url;
			resultElem.value = model.outputURL;
			resultElem.removeAttribute('disabled');
		} else {
			resultElem.value = '';
			resultElem.setAttribute('disabled', '');
		}
	}
}