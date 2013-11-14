//onload = function() {	
	var less_editor = ace.edit("less-editor");
	less_editor.setTheme("ace/theme/twilight");
	less_editor.getSession().setMode("ace/mode/less");

	var css_output = ace.edit("css-output");
	css_output.setTheme("ace/theme/textmate");
	css_output.getSession().setMode("ace/mode/css");
//};