(function($) {

/**
 * JSS Confirm Plugin 1.0
 * Copyright (c) 2009 Cameron McKay (couchware.ca/blogs/cam)
 * Licensed under the GPL (GPL-LICENSE.txt) license.
 * 
 * This plugin implements a "confirm" command that will
 * call a different callback depending on whether yes 
 * or no was clicked.
 * 
 * It is meant as an example JSS plugin.
 * 
 * Usage:
 * confirm (selector) question !truefn !falsefn
 * confirm (selector) question true-str false-str
 * 
 * The truefn/falsefn functions can return strings.  If they
 * do, their contents are placed inside the passed selector.
 * If no selector is given, then the JSS block selector is used.
 * 
 * Example:
 * confirm (#message) 'Hello, Ms. O\'Brien! How are you?' 'Great!' 'Awww!'
 * confirm (#message) 'Are you there?' !truefn !falsefn
 *  
 * @author cdmckay
 */

// The "event.data" variable is how JSS custom commands are possible.
// The data variable is a hash containing the following keys:
//			sheet:     the JSS sheet that the command was called from
//			blocksel:  the JSS block selector the command was called from
//			prop:      the property the command was called from
//			value:     the value the command was detected in
//			selector:  the selector defined in the command
//			arguments: the array of arguments given to the command
//			callback:  the first function argument given to the command
//			fnlist:    the array of functions given to the command
//
// For example, if this plugin was invoked using the following JSS:
//
// "#test-no-quote":
// {					
//   click: "confirm (#message) Are you happy today? Sweet! 'Less sweet.' !truefn !falsefn"
// }
//
// Then the variables would be:
//
//			sheet:     the object that has "#test-no-quote" as it's property
//			blocksel:  "#test-no-quote"
//			prop:      "click"
//			value:     "confirm (#message) Are you happy today? Sweet! 'Less sweet.'"
//			selector:  "#message"
//			arguments: [ "Are", "you", "happy", "today?", "Sweet!", "Less sweet." ]
//			callback:  truefn()
//			fnlist:    [ truefn(), falsefn() ]
//
// By following the rest of the code here, you can see how these values may be used
// to create a plugin.	

$.extend($.jss.command, 
{
	"confirm": function(event)
	{
		// A convenience variable.
		var data = event.data;					
		
		// Confirm can run under two conditions:
		// 1. If there is at least 1 argument and at least 2 functions.
		// 2. If there is at least 3 arguments.
		if (!(data.arguments.length >= 3 || (data.arguments.length >= 1 && data.fnlist >= 2)))
		{
			return false;
		}						
		
		// Text is the string shown in the confirm dialog.
		// T is the value set to the selector if OK is pressed,
		// F is the value set to the selector if Cancel is pressed.
		var text, t, f;
		
		if (data.fnlist.length >= 2)
		{
			text = data.arguments.join(" ");
			t = data.sheet[data.fnlist[0]].call(data.sheet);
			f = data.sheet[data.fnlist[1]].call(data.sheet);	
		}
		else
		{
			var len = data.arguments.length;
			text = data.arguments.slice(0, len - 2).join(" ");
			t = data.arguments[len - 2];
			f = data.arguments[len - 1];
		}
		
		// Show the confirm dialog.
		// The "arguments" variable contains all arguments to
		// the command.  In this case, the arguments are 
		// the text to show.
		var result = window.confirm(text);
		
		// Call the appropriate function depending on
		// what the user pressed in the confirm dialog.
		var str = result ? t : f;
		if (str.constructor == String)
		{
			// This code determines which selector to use.
			// If a selector is defined by the command, it is used,
			// otherwise, the block selector is used.
			var target;
			if (data.selector.length != 0)
			{
				target = data.selector;
			}
			else
			{			
				target = event.currentTarget;
			}
						
			$(target).html(str);
		}		
	}
})

})(jQuery);
