// Unit tests for the JSS commands.

module("command");

test("set-attr", function()
{
	$.jss.clear();
	
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
	$test1.removeAttr("test");
	$test1.click();
	equals($test1.attr("test"), teststr1, "Check for random test string");
	$test1.unbind();
	
	// Add an extra parameter to set-attr and see if it still works.
	sheet["#test1"]["click"] = "set-attr test " + teststr1 + " extra";
	$.jss.load();	
	$test1.removeAttr("test");
	$test1.click();
	equals($test1.attr("test"), teststr1 + " extra", "Add third parameter, check for random test string");	
	$test1.unbind();	
	
	// Try it with a selector.
	sheet["#test1"]["click"] = "set-attr (#test2) test " + teststr2;
	$.jss.load();
	$test2.removeAttr("test");
	$test1.click();
	equals($test2.attr("test"), teststr2, "Use selector, check for random test string");
	$test1.unbind();
	
	// Try it with a selector.
	sheet["#test1"]["click"] = "set-attr (#test2) test " + teststr2 + " extra";
	$.jss.load();
	$test2.removeAttr("test");
	$test1.click();
	equals($test2.attr("test"), teststr2 + " extra", "Use selector, add third paramter, check for random test string");	
	$test1.unbind();
});

test("remove-attr", function()
{
	$.jss.clear();
	
	var sheet = { "#test1": {} };	
	$.jss.declare(sheet);
	
	// Make sure the attribute is set to test to start.
	var $test1 = $('#test1');
	var $test2 = $('#test2');
	
	// Test removing under ideal circumstances.
	sheet["#test1"]["click"] = "remove-attr test";
	$.jss.load();
	$test1.attr("test", "test");
	$test1.click();
	equals($test1.attr("test"), undefined, "Make sure the attribute was removed");
	$test1.unbind();
	
	// Test with an extra argument (should be ignored).
	sheet["#test1"]["click"] = "remove-attr test bean";
	$.jss.load();
	$test1.attr("test", "test");
	$test1.attr("bean", "boon");
	$test1.click();
	equals($test1.attr("test"), undefined, "Add extra argument, make sure the attribute was removed");
	equals($test1.attr("bean"), "boon", "Make sure attribute with the same name as the extra argument was untouched");
	$test1.unbind();
	
	// Test removing under using a selector.
	sheet["#test1"]["click"] = "remove-attr (#test2) test";
	$.jss.load();
	$test2.attr("test", "test");
	$test1.click();
	equals($test2.attr("test"), undefined, "Use selector, make sure the attribute was removed");
	$test1.unbind();
});
