// Unit tests for the JSS commands.

module("command");

test("set-attr", function()
{
	var rndstr = function(length)
	{
		var src = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
		var str = '';
		for (var i = 0; i < length; i++) 
		{
			var rnd = Math.floor(Math.random() * src.length);
			str += src.substr(rnd, 1);
		}		
		return str;
	};
	
	var teststr1 = rndstr(8);
	var teststr2 = rndstr(8);
	var sheet = { "#test1": {} };	
	$.jss.declare(sheet);
	
	// Make sure the attribute is set to test to start.
	var $test1 = $('#test1');
	var $test2 = $('#test2');
	
	// Test for it.
	sheet["#test1"]["click"] = "set-attr test " + teststr1;
	$.jss.load();
	$test1.attr("test", "test");
	$test1.click();
	equals($test1.attr("test"), teststr1, "Check for random test string");
	
	// Add an extra parameter to set-attr and see if it still works.
	sheet["#test1"]["click"] = "set-attr test " + teststr1 + " extra";
	$.jss.load();	
	$test1.attr("test", "test");
	$test1.click();
	equals($test1.attr("test"), teststr1 + " extra", "Add third parameter, check for random test string");		
	
	// Try it with a selector.
	sheet["#test1"]["click"] = "set-attr (#test2) test " + teststr2;
	$.jss.load();
	$test2.attr("test", "test");
	$test1.click();
	equals($test2.attr("test"), teststr2, "Use selector, check for random test string");
	
	// Try it with a selector.
	sheet["#test1"]["click"] = "set-attr (#test2) test " + teststr2 + " extra";
	$.jss.load();
	$test2.attr("test", "test");
	$test1.click();
	equals($test2.attr("test"), teststr2 + " extra", "Use selector, add third paramter, check for random test string");
	
});
