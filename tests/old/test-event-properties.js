// Unit tests for the JSS event properties.

module("event-properties");

test("Test the event properties using a callback.", function()
{
	// The element we'll add an attribute to.
	var $el = $('#test1');
	
	// The callback that sets the element attribute.
	var callback = function()
	{		
		return "set-attr (#test1) test test";
	}
	
	// The events to test.
	var events = [
		"blur", 
		"change", 
		"click", 
		"dblclick",
		"error",
		"focus",
		"keydown",
		"keypress",
		"keyup",
		"select",
		"submit"			
	];	
	
	// The sheet we'll use to trigger the callback.
	var sheet = 
	{ 
		"#test1": {},		
		"callback": callback
	};												
	
	$.each(events, function()
	{
		sheet["#test1"][this] = "!callback";
	});				
	
	$.jss.declare(sheet).load();				
				
	$.each(events, function()
	{		
		if (this != "setup") $("#test1")[this]();
		equals($el.attr("test"), "test", "Make sure that the " + this + " event works");
		$el.attr("test", "-");
	});			
	
	// Test setup.
	$.jss.clear();
	
	var setupsheet = 
	{
		"#test1":
		{
			setup: "set-attr test tube"
		}
	}				
	$.jss.declare(setupsheet);	
	$el.attr("test", "-");
	$.jss.load();	
	equals($el.attr("test"), "tube", "Make sure that the setup event works");
});
