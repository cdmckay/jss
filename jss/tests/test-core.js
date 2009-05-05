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

test("The clear method.", function()
{
	// Add an empty sheet.
	$.jss.declare({});
	
	// Make sure there are some sheets declared.
	ok($.jss.length > 0, "Make sure there are some sheets");
	
	// Clear them out.
	$.jss.clear();
	
	// Make sure it is clear.
	equals($.jss.length, 0, "Make sure there are no sheets after a clear");
});

test("The apply method.", function()
{
	// Make sure there are no sheets.
	$.jss.clear();
	
	// The first sheet.
	var sheet1 = 
	{
		".box":
		{
			background: "maroon"
		}
	};	
	$.jss.declare(sheet1);
	
	// The second sheet.
	var sheet2 =
	{
		".box":
		{
			background: "navy"
		}
	};
	$.jss.declare("test", sheet2);
	
	// Apply the first sheet, and see if the CSS worked.
	ok(!($(".box").css("background") != undefined && $(".box").css("background").indexOf("maroon") + 1),
			"Make sure maroon is not already there");			
	$.jss.apply(0);
	ok($(".box").css("background").indexOf("maroon") + 1, "Make sure maroon was applied");
	
	// Apply the second sheet, and see if the CSS worked.
	ok(!($(".box").css("background") != undefined && $(".box").css("background").indexOf("navy") + 1), 
			"Make sure navy is not already there");			
	$.jss.apply(1);
	ok($(".box").css("background").indexOf("navy") + 1, "Make sure navy was applied");
});

test("The load method.", function()
{	
	// Make sure there are no sheets.
	$.jss.clear();

	// Add a sheet.
	var sheet1 = 
	{
		".box":
		{
			background: "maroon",
			color: "maroon"
		}
	};	
	$.jss.declare(sheet1);
	
	// Now, add a new sheet.
	var sheet2 =
	{
		".box":
		{
			background: "orange"
		}
	};
	$.jss.declare(sheet2);
	
	// Try the load method.
	ok(!($(".box").css("color") != undefined && $(".box").css("color").indexOf("maroon") + 1), 
			"Make sure the font color is not already maroon");
	ok(!($(".box").css("background") != undefined && $(".box").css("background").indexOf("orange") + 1), 
			"Make sure the background is not already orange");
	$.jss.load();
	ok(($(".box").css("color").indexOf("maroon") + 1), "Make sure the font color is maroon");
	ok(($(".box").css("background").indexOf("orange") + 1), "Make sure the background is orange");	
});
