(function($) {
	
/**
 * JSS 0.1.0 - CSS-like JavaScript Stylesheets
 * Copyright (c) 2009 Cameron McKay (couchware.ca/blogs/cam)
 * Licensed under the GPL (GPL-LICENSE.txt) license.
 * @author cdmckay
 */

/**
 * Processes the CSS declaration.  This function
 * will intercept special JSS properties and
 * redirect them to the appropriate handler.
 * @param {String} prop
 * @param {String} value
 * @param {String} blocksel
 */
function processDeclartion(sheet, blocksel, prop, value)
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
		case "hover":
		{
			// If the value is an array, then cycle it.
			if (value.constructor == Array)
			{
				for (var i = 0; i < value.length; i++)					
				{
					processExpression(sheet, blocksel, prop, value[i]);
				}
			}	
			else
			{
				processExpression(sheet, blocksel, prop, value);
			}		
			
			break;
		}						
		
		default:
			$(blocksel).css(prop, value);
	}
}

/**
 * This funtion replaces all {attr} expressions with their
 * corresponding attributes, and then returns the new string.
 * If the attribute is not found, the attribute is replaced
 * with an empty string.
 * @param {String} expression
 * @param {String} blocksel The block selector.
 * @param {String} target The target selector.
 * @return The expression with all the attributes replaced.
 * @type String
 */
function replaceAttributes(expression, blocksel, target)
{			
	if (expression.length == 0) return expression;		
	
	//alert(expression);		
	
	// Get the blocksel and the target.
	var $blocksel = $(blocksel);
	var $target = $(target);
	
	// Find all the attributes.
	var regex = /(\{[\w-]+\})/g;	
	var result;
	
	// The string to return.
	var ret = expression;
	
	// For each attribute, replace it with the appropriate
	// value.
	while((result = regex.exec(expression)) != null)
	{
		// The current match.
		var match = result[0];
		
		// Remove the { and }.
		var temp = match.substr(1, match.length - 2);		
		
		// Find the variable.
		var rep = $blocksel.attr(temp);
		
		//alert(blocksel);
		
		if (rep == undefined) rep = "";
		
		//alert($blocksel.length);
		//alert(temp + " = " + rep);
		
		ret = ret.replace(match, rep);
	}
	
	return ret;
}

/**
 * Process a JSS expression.
 * @param {Object} sheet
 * @param {Object} blocksel
 * @param {Object} prop
 * @param {Object} value
 */
function processExpression(sheet, blocksel, prop, value)
{
	if (prop == "hover")
	{
		var a = value.split("|");
		processExpression(sheet, blocksel, "mouseenter", $.trim(a[0]));
		processExpression(sheet, blocksel, "mouseleave", $.trim(a[1]));
		return;
	}	
	
	var parts = parseExpression(replaceAttributes(value, blocksel));
	
	if (parts.command == undefined)
		throw Error("No command specified in expression");			
	
	$(blocksel).bind(
		prop, 
		{ 
			element:   $(blocksel), 
			selector:  parts.selector,
			arguments: parts.arguments,
			callback:  sheet[parts.callback]
		},
		$.jss.command[parts.command]
	);
}

/** A regular expression breaking down a JSS expression. */
var expression = /^([\w-]+)(\s+\((.+)\))?(.+?)?(\s+\!(\w+))?$/i;

/**
 * Parse the passed expression and return the separated
 * data.
 * @param {Object} value
 */
function parseExpression(value)
{
	// Get rid of excess whitespace.
	var value = $.trim(value);
	var result = expression.exec(value);
	
	// Get the command name.
	var command = result[1];
			
	// Extract the selector and remove it.
	var selector = result[3];
	
	// The arguments.  The $ is used so as to not conflict
	// with the function arguments.	
	var $arguments = result[4];
	
	// The callback, if it's defined.
	var callback = result[6];	
		
	return { 
		"command": $.trim(command),
		"selector": $.trim(selector),
		"arguments": $.trim($arguments),
		"value": $.trim(value),
		"callback": $.trim(callback)
	};
}

/**
 * A convenience function for determining
 * what data to pass to an animation function.
 * @param {Object} data
 */
function effectPreprocessor(data)
{	
	var target = (data.selector.length == 0)
		? data.element 
		: data.selector;	
						
	var speed = data.arguments == undefined ? "0" : data.arguments;

	switch (speed)
	{
		case "slow":
		case "normal":
		case "fast":
			break;
			
		default:
			speed = parseInt(speed);
	}					
	
	if (isNaN(speed)) speed = "0";
			
	return { 
		target: target, 
		speed: speed, 
		callback: data.callback
	}	
}

function attrPreprocessor(data)
{
	var target = (data.selector.length == 0)
		? data.element 
		: data.selector;
		
	var a = data.arguments;	
	var attr = $.trim(a.split(/\s+/)[0]);
	var value = $.trim(a.substr(a.indexOf(" ")));
	
	return {
		target: target,
		attr: attr,
		value: value
	}	
}

jQuery.extend(
{		
	jss:
	{
		command:
		{
			"alert": function(event)
			{
				alert(event.data.arguments);
			},
			
			"fade-out": function(event)
			{	
				var data = effectPreprocessor(event.data);		
				$(data.target).fadeOut(data.speed, data.callback);
			},
			
			"fade-in": function(event)
			{
				var data = effectPreprocessor(event.data);		
				$(data.target).fadeIn(data.speed, data.callback);
			},
			
			"slide-up": function(event)
			{
				
			},
			
			"slide-down": function(event)
			{
				
			},
			
			"toggle": function(event)
			{
				var data = effectPreprocessor(event.data);
				$(data.target).toggle(data.speed, data.callback);
			},
			
			"set-attr": function(event)
			{
				var data = attrPreprocessor(event.data);	
				$(data.target).attr(data.attr, data.value);
			},
			
			"remove-attr": function(event)
			{
				var data = attrPreprocessor(event.data);	
				$(data.target).removeAttr(data.attr);
			},
			
			"set-prop": function(event)
			{
				
			}						
		},
		
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
							processDeclartion(sheet, selector, 
								prop.replace( '_', '-' ), value);
						}						
					} // end for
				}
				else
				{
					var value;
					for (var prop in block)
					{		
						value = block[prop];
						processDeclartion(sheet, selector, 
							prop.replace( '_', '-' ), value);
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
