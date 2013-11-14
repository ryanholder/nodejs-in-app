onload = function() {

	var less = require('less');	

	var convertButton = document.querySelector('#convert-button');

	convertButton.addEventListener('click', function(e) {

		less.render(less_editor.getValue(), function (e, css) {
		    console.log(css);
		    css_output.setValue(css);
		});

  	});

};