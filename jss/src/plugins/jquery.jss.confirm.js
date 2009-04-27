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

$.extend($.jss.command, 
{
	"confirm": function(event)
	{
		// A convenience variable.
		var data = event.data;
		
		// The data variable is 
		
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
			var sel;
			if (data.selector != undefined)
			{
				sel = data.selector;
			}
			else
			{
				sel = data.blocksel;
			}
			
			$(sel).html(str);
		}
	}
})

})(jQuery);
