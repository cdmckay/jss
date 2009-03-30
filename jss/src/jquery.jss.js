(function($) {
	
/**
 * JSS 0.1.0 - CSS-like JavaScript Stylesheets
 * Copyright (c) 2009 Cameron McKay (couchware.ca/blogs/cam)
 * Licensed under the GPL (GPL-LICENSE.txt) license.
 * @author cdmckay
 */

/**
 * Processes the CSS property.  This function
 * will intercept special JSS properties and
 * redirect them to the appropriate handler.
 * @param {String} prop
 * @param {String} value
 * @param {String} selector
 */
function processProperty(prop, value, selector, sheet)
{
	// See if value is an execution command.
	if (value[0] == "!")
	{
		value = sheet[value.substr(1)].call(sheet);
	}
	
	switch (prop)
	{
		case "blur":
		case "change":
		case "click":		
		case "dblclick":
		case "error":
		case "focus":
		case "keydown":
		case "keypress":
		case "keyup":
		case "load":
		case "mousedown":
		case "mouseenter":
		case "mouseleave":
		case "mousemove":
		case "mouseout":
		case "mouseover":
		case "mouseup":
		case "resize":
		case "scroll":
		case "select":
		case "submit":
		case "unload":
		{
			// If the value is an array, then cycle it.
			if (value.constructor == Array)
			{
				for (var i = 0; i < value.length; i++)					
				{
					bind(prop, value[i], selector, sheet);
				}
			}	
			else
			{
				bind(prop, value, selector, sheet);
			}		
			
			break;
		}								
		
		default:
			$(selector).css(prop, value);
	}
}

/**
 * Bind the given property type using the contents
 * of the value, the current selector and the sheet.
 * @param {Object} prop
 * @param {Object} value
 * @param {Object} selector
 * @param {Object} sheet
 */
function bind(prop, value, selector, sheet)
{
	// Parse the value.
	var val = parse(value, sheet);			

	// Select the appropriate elements.
	$(selector).each(function()
	{				
		$(this).bind(prop, 
		{ 
			element:   this, 
			optional:  val.optional,
			selector:  val.selector,
			callback:  val.callback
		}, func[val.fn]);
	});		
}

/** A regular expression for finding the selector. */
var selpat = /\(.+?\)/i;

/**
 * Parse the passed value and return the separated
 * data.
 * @param {Object} value
 * @param {Object} sheet
 */
function parse(value, sheet)
{
	// Get rid of excess whitespace.
	var a = $.trim(value);
	
	// Extract the selector and remove it.
	var selector = selpat.exec(a)[0];
	selector = selector.substr(1, selector.length - 2);
	a = a.replace(selpat, "");
			
	// Split the remaining string.
	var sp = a.split(" ");
	
	// Get the function name.
	var fn = sp[0];
	
	// Cycle through the remaining value to
	// find optional arguments and a callback.		
	var optional = [];
	var callback = function(){};
	
	$.each(sp, function()
	{
		if (this[0] == "+") optional.push(this.substr(1));
		else if (this[0] == "!") callback = sheet[this.substr(1)];		
	});
	
	return { 
		fn: fn, 
		optional: optional,
		selector: selector,
		callback: callback
	};
}

/**
 * A convenience function for determining
 * what data to pass to an animation function.
 * @param {Object} data
 */
function animationAssist(data)
{
	var target = (data.selector.length == 0)
		? data.element 
		: $(data.selector);
	
	var speed = data.optional.length >= 1
		? data.optional[0]
		: "";	
		
	switch (speed)
	{
		case "slow":
		case "normal":
		case "fast":
			break;
			
		default:
			speed = parseInt(speed);
	}
		
	return { 
		target: target, 
		speed: speed, 
		callback: data.callback 
	}
}

var func =
{
	"alert": function(event)
	{
		alert(event.data.selector);
	},
	
	"fade-out": function(event)
	{	
		var data = animationAssist(event.data);		
		$(data.target).fadeOut(data.speed, data.callback);
	},
	
	"fade-in": function(event)
	{
		var data = animationAssist(event.data);		
		$(data.target).fadeIn(data.speed, data.callback);
	},
	
	"toggle": function(event)
	{
		var data = animationAssist(event.data);		
		$(data.target).toggle(data.speed, data.callback);
	}
}

jQuery.extend(
{		
	jss:
	{
		/** 
		 * The available stylesheets loaded using script
		 * tags.
		 */
		length: 0,
		
		/**
		 * Declare a JSS stylesheet.
		 * @param {String} [id] An identifier for the stylesheet.
		 * @param {Object} stylesheet The JSS stylesheet.
		 */
		declare: function()
		{
			if (typeof arguments[0] == "string") 
			{
				this[arguments[0]] = arguments[1];
				Array.prototype.push.apply(this, Array.prototype.slice.call(arguments, 1));
			}
			else
			{
				Array.prototype.push.apply(this, arguments);
			}			
		},
		
		/**
		 * Apply a JSS stylesheet to the current document.
		 * @param {Object} sheet
		 */
		apply: function(sheet)
		{		
			for (var selector in sheet)
			{				
				var block = sheet[selector];
				
				if (typeof block == "function")
				{
					continue;
				}
				else if (block.constructor == Array)
				{					
					for (var i = 0; i < block.length; i++)
					{
						var value;
						for (var prop in block[i])
						{							
							value = block[i][prop];							
							processProperty(prop.replace( '_', '-' ),
								value, selector, sheet);
						}						
					} // end for
				}
				else
				{
					var value;
					for (var prop in block)
					{		
						value = block[prop];
						processProperty(prop.replace( '_', '-' ), 
							value, selector, sheet);
					}		
				}						
			} //end for					
		},
		
		load: function()
		{
			for (var i = 0; i < this.length; i++)
			{
				this.apply(this[i]);
			}
		},
		
		/**
		 * Get the JSS stylesheet from the web using JSONp.  This
		 * stylesheet will be automatically applied.
		 * @param {String} url
		 */
		get: function(url)	
		{
			
		}
	}	
});

// Register a ready handler to load the JSS sheets
// as soon as the DOM is ready.
$(function()
{
	$.jss.load();
});

})(jQuery);
