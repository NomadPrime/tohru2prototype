$(document).ready(function() {
	var bluh = 0;
	setInterval(function(){
	$('#origin').empty().append('<p>BASE 36 COUNTER: ' + bluh.toString(36) + '</p>');
	$('#origin').append('<div id="outList"></div>');
	$('<p id=>HELLO, WORLD!</p>').appendTo('#outList');
	$.getJSON('/tester/list', '', function(data) {
		$('#outList').append('<p id=lolwut>' + data.test + '</p>');
	});
	bluh++;
	},1000);
});