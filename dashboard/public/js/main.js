var lang; // init global variable
console.log("Hello World");

function setModalContent(content) {
	document.getElementById('releaseName').innerText= content.name;
	document.getElementById('releaseNamespace').innerText= content.namespace;
	document.getElementById('releaseRevision').innerText= content.revision;
	document.getElementById('releaseUpdated').innerText= content.updated;
	document.getElementById('releaseStatus').innerText= content.status;
	document.getElementById('releaseChart').innerText= content.chart;
	document.getElementById('releaseAppVersion').innerText= content.app_version;
}

function getLocale() {
	var languageSelection = document.getElementById('languageSelection');
	if (languageSelection != null) {
		if (localStorage.getItem("languageSelection") != null) {
			lang = localStorage.getItem("languageSelection");
			languageSelection.value = lang;
		} else if (languageSelection.selectedIndex != -1) {
			lang = languageSelection.options[languageSelection.selectedIndex].value;
			localStorage.setItem("languageSelection", lang);
		} else {
			lang = "en";
		}

		var langList = ["en", "fr", "hi", "es"];
		var resources = {};

		for (var i=0; i<langList.length; i++) {
			resources[langList[i]] = {
				translation: {},
				response: {}
			};
			resources[langList[i]]["response"] = fetch('/public/i18n/'+langList[i]+'.json').then(function(response){
				return response.json();
			});
		}

		Promise.all(langList.map(function (lang) {
			return resources[lang].response;
		})).then(function (responses) {
			for (var i=0; i<responses.length; i++) {
				resources[langList[i]]["translation"] = responses[i];
			}
			initLocale(resources, lang);
		});
	}
}

function initLocale(locale, lang) {
	moment.locale(lang);
	i18next.init({
		lng: lang,
		fallbackLng: "en",
		resources: locale
	}, function(err, t) {
		jqueryI18next.init(i18next, $, {
			useOptionsAttr: true
		});
		$('#main-content').localize();

		var languageSelection = document.getElementById('languageSelection');
		languageSelection.onchange = function() {
			localStorage.setItem("languageSelection", this.value);
			lang = this.value;
			moment.locale(lang);
			i18next.changeLanguage(this.value);
			$('#main-content').localize();
		};
		window.isLocalized = true;
	});
}

$(document).ready(function() {
	getLocale();
});
