module("core");

test("The JSS object.", function()
{
	equals(typeof($.jss), "object", "See if the JSS object exists");
	equals($.jss.length, 0, "Make sure the length is 0 when no stylesheets are loaded");							
});

test("The declare method.", function()
{
	// Add a new stylesheet.	
	var sheet1 = 
	{
		".box":
		{
			background: "maroon"
		}
	};	
	$.jss.declare(sheet1);
	
	equals($.jss.length, 1, "Make sure the length is 1 when a single stylesheet is loaded");
	equals($.jss[0], sheet1, "Make sure the sheet is accessible by index");
	equals($.jss[1], undefined, "Make sure an undefined index is undefined");
	
	// Declare a new sheet, this time with an id.	
	var sheet2 =
	{
		".box":
		{
			background: "navy"
		}
	};
	$.jss.declare("test", sheet2);
	
	equals($.jss.length, 2, "Make sure the length is 2 when two stylesheets are loaded");
	equals($.jss[1], $.jss.sheet["test"], "See if the the id and index match");
});

test("The apply method.", function()
{
	// Apply the first sheet, and see if the CSS worked.
	ok(!($(".box").css("background").indexOf("maroon") + 1), "Make sure maroon is not already there");
	$.jss.apply(0);
	ok($(".box").css("background").indexOf("maroon") + 1, "Make sure maroon was applied");
	
	// Apply the second sheet, and see if the CSS worked.
	ok(!($(".box").css("background").indexOf("navy") + 1), "Make sure navy is not already there");
	$.jss.apply(1);
	ok($(".box").css("background").indexOf("navy") + 1, "Make sure navy was applied");
});

test("The load method.", function()
{
	// Modify the existing first sheet and add a rule to it dynamically.
	$.jss[0][".box"]["color"] = "maroon";
	
	// Now, add a new sheet.
	var sheet3 =
	{
		".box":
		{
			background: "orange"
		}
	};
	$.jss.declare("top", sheet3);
	
	// Try the load method.
	ok(!($(".box").css("color").indexOf("maroon") + 1), "Make sure the font color is not already maroon");
	ok(!($(".box").css("background").indexOf("orange") + 1), "Make sure the background is not already orange");
	$.jss.load();
	ok(($(".box").css("color").indexOf("maroon") + 1), "Make sure the font color is maroon");
	ok(($(".box").css("background").indexOf("orange") + 1), "Make sure the background is orange");	
});
