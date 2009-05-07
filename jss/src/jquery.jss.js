(function($) {
	
/**
 * JSS 1.0.0 - Enhanced CSS-like JavaScript Stylesheets
 * Copyright (c) 2009 Cameron McKay (couchware.ca/blogs/cam)
 * Licensed under the GPL (GPL-LICENSE.txt) license.
 * @author cdmckay
 */

/**
 * Processes the CSS declaration.  This function
 * will intercept special JSS properties and
 * redirect them to the appropriate handler.
 * @param {Object} sheet
 * @param {String} blocksel
 * @param {String} prop
 * @param {String} value
 * @param {Boolean} events If false, event properties will not be parsed.
 * 
 */
function processDeclartion(sheet, blocksel, prop, value)
{	
	// See if value is an execution command.
	if (value.substr(0, 1) == "!")
	{		
		value = sheet[value.substr(1)].call(sheet, blocksel, prop);
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
 * @param {Object} expression
 * @param {String} eventTarget The event target.
 * @param {String} selector The selector defined by the command.
 * @return The expression with all the attributes replaced.
 * @type String
 */
function replaceAttributes(expression, eventTarget, selector)
{			
	if (expression.length == 0) return expression;		
	
	// If it's an array, run it recursively.
	if (expression.constructor == Array)
	{
		var expressionList = expression;
		for (var i = 0; i < expressionList.length; i++)
		{
			expressionList[i] = 
					replaceAttributes(expressionList[i], eventTarget, selector);
		}
		
		return expressionList;
	}
	
	//alert(expression);		
	
	// Get the eventTarget and the command selector.
	var $eventTarget = $(eventTarget);
	var $selector = $(selector);
	
	//alert(expression + ", " + selector);			
	
	// Find all the attributes.
	var regex = /(\{[\w-@]+\})/g;		
	
	// The string to return.
	var ret = expression;
	
	// For each attribute, replace it with the appropriate
	// value.
	var result;
	while((result = regex.exec(expression)) != null)
	{
		// The current match.
		var match = result[0];
		
		// Remove the { and }.
		var temp = match.substr(1, match.length - 2);		
		
		// This will be the attribute we replace it with.
		var attr;
		
		// See if we should use the selector instead.
		if (temp[0] == "@" && selector != "")
		{		
			//attr = $selector.attr(temp.substr(1));
			attr = getAttribute($selector, temp.substr(1));
		}
		else
		{
			//attr = $blocksel.attr(temp);
			attr = getAttribute($eventTarget, temp);
		}
			
		if (attr == undefined) attr = "";
		
		//alert($eventTarget.length);
		//alert(temp + " = " + rep);
		
		ret = ret.replace(match, attr);
	}
	
	return ret;
}

/**
 * Converts a string from css-case to camelCase.
 * @param {String} text
 * @return The css-case string in camelCase.
 * @type String 
 */
function toCamelCase(text)
{
	var ret = [];
	for (var i = 0; i < text.length; i++)
	{
		var ch = text[i];
		if (ch == '-')
		{
			if (i + 1 < text.length) ret.push(text[i + 1].toUpperCase());
			i++;
		}
		else
		{
			ret.push(ch);
		}
	}
	return ret.join("");
}

/**
 * Get the attribute value of the passed jQuery ($$) object with the passed name.
 * @param {jQuery} $$
 * @param {String} name
 * @return The attribute value.
 * @type String
 */
function getAttribute($$, name)
{	
	var attr;
	switch (name)
	{
		case "offset-top":			
			attr = $$.offset().top;
			break;
			
		case "offset-left":
			attr = $$.offset().left;
			break;
			
		case "position-top":
			attr = $$.position().top;
			break;
			
		case "position-left":
			attr = $$.position().left;
			break;
			
		case "scroll-top":
		case "scroll-left":
		case "width":
		case "height":
		case "inner-width":
		case "inner-height":
		case "outer-width":
		case "outer-height":
			attr = $$[toCamelCase(name)]();
			break;
					
		default:
			attr = $$.attr(name);
			if (attr === undefined) attr = $$.css(name);
	}
	
	return attr;
}

function setAttribute($$, name, value)
{
	
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
	
	var parts = parseExpression(value);
	
	if (parts.command == undefined)
		throw Error("No command specified in expression");					
		
	var argu   = parts.arguments;
	var fnlist = parts.fnlist;
	var cb     = fnlist[0];
	
	// Create the command function.
	var commandfunc = commandWrapper($.jss.command[parts.command]);
	
	// Add it to the event function table.
	if ($.jss.eventfunc[blocksel] == undefined) $.jss.eventfunc[blocksel] = new Array();
	$.jss.eventfunc[blocksel].push(
	{
		type: prop,
		fn: commandfunc
	});
	
	// Bind it.
	$(blocksel).bind(
		prop, 
		{ 
			sheet:     sheet,
			blocksel:  blocksel, 
			prop:      prop,
			value:     value,
			selector:  parts.selector,
			arguments: argu,			
			callback:  sheet[cb],
			fnlist:    fnlist
		},
		commandfunc
	);
}

/** A regular expression breaking down a JSS expression. */
var expression = /^([\w-]+)(\s+\((.+)\))?(.+?)?((\s+\!\w+)*)?$/i;

/** A regular expression for finding quoted strings. */
var quoteFinder = /'([^'\\]*(\\.[^'\\]*)*)'|"([^"\\]*(\\.[^"\\]*)*)"|([^'"\s]+)/ig;

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
	var command = $.trim(result[1]);
			
	// Extract the selector and remove it.
	var selector = $.trim(result[3]);	
	
	// The arguments.  
	var artmp = $.trim(result[4]);
	var arlist = [];
	if (artmp != undefined)
	{
		// Rewind the quote finder.
		quoteFinder.lastIndex = 0;
		
		var match;
		while ((match = quoteFinder.exec(artmp)) != null)
		{			
			if      (match[1] != undefined && match[1].length > 0) arlist.push(match[1]);
			else if (match[3] != undefined && match[3].length > 0) arlist.push(match[3]);
			else if (match[5] != undefined && match[5].length > 0) arlist.push(match[5]);
		}						
	}
	
	// The function arguments, if defined.
	var tmp = $.trim(result[5]);
	var fnlist = [];
	if (tmp != undefined)
	{
		fnlist = tmp.split(/\s+/);	
		
		// Remove the exclamation mark.
		for (var i = 0; i < fnlist.length; i++)
		{
			fnlist[i] = fnlist[i].substr(1);
		}
	}			
			
	return { 
		"command":   command,
		"selector":  selector,
		"arguments": arlist,
		"value":     value,
		"fnlist":    fnlist
	};
}

function determineTarget(event)
{
	return (event.data.selector.length == 0)
		? event.currentTarget
		: event.data.selector;		
}

/**
 * Wraps the command function with a preprocessor.
 * @param {Function} commandFunction
 */
function commandWrapper(commandFunction)
{
	return function(event)
	{
		commandPreprocessor(event);
		return commandFunction(event);
	}
}

/**
 * A function run before every command.  It is mainly used to 
 * replace attributes and data.
 * @param {Object} event The event that triggers the command.
 */
function commandPreprocessor(event)
{
	// The data part of the event.
	var data = event.data;
	
	// Replace all attributes.
	data.arguments = replaceAttributes(data.arguments, event.currentTarget, data.selector);
	data.fnlist = replaceAttributes(data.fnlist, event.currentTarget, data.selector);
	
	// Replace all data.
	// Not yet implemented.
	
	//return event;
}

/**
 * A convenience function for determining
 * what data to pass to an animation function.
 * @param {Object} data
 */
function effectPreprocessor(data)
{							
	var speed  = data.arguments.length > 0 ? data.arguments[0] : "normal";

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
		speed: speed, 
		callback: data.callback
	}	
}

/**
 * Preprocesses the arguments for the
 * attr family of commands.
 * @param {String} data
 * @return An object containing the target selector, the attr name and the attr value.
 * @type Object
 */
function attrPreprocessor(data)
{
	if (data.arguments.length < 1) return false;											
						
	var a = data.arguments;	
	var name =  a[0].replace( "_", "-", "g" );
	var value = a.slice(1).join(" ");
	
	return {		
		name: name,
		value: value
	}	
}

jQuery.extend(
{		
	jss:
	{
		/** The built-in JSS commands. */
		command:
		{
			"alert": function(event)
			{
				replaceAttributes(event.data);
				alert(event.data.arguments.join(" "));
			},
			
			"fade-out": function(event)
			{	
				var target = determineTarget(event);
				var data = effectPreprocessor(event.data);		
				$(target).fadeOut(data.speed, data.callback);
			},
			
			"fade-in": function(event)
			{
				var target = determineTarget(event);
				var data = effectPreprocessor(event.data);		
				$(target).fadeIn(data.speed, data.callback);
			},
			
			"slide-up": function(event)
			{
				var target = determineTarget(event);
				var data = effectPreprocessor(event.data);		
				$(target).slideUp(data.speed, data.callback);
			},
			
			"slide-down": function(event)
			{
				var target = determineTarget(event);
				var data = effectPreprocessor(event.data);		
				$(target).slideDown(data.speed, data.callback);
			},
			
			"slide-toggle": function(event)
			{
				var target = determineTarget(event);
				var data = effectPreprocessor(event.data);		
				$(target).slideToggle(data.speed, data.callback);
			},
			
			"toggle": function(event)
			{
				var target = determineTarget(event);
				var data = effectPreprocessor(event.data);
				$(target).toggle(data.speed, data.callback);
			},
			
			"set-attr": function(event)
			{			
				var target = determineTarget(event);
				var data = attrPreprocessor(event.data);	
				$(target).attr(data.name, data.value);
			},
			
			"remove-attr": function(event)
			{
				var target = determineTarget(event);
				var data = attrPreprocessor(event.data);	
				$(target).removeAttr(data.name);
			},
			
			"set-css": function(event)
			{
				var target = determineTarget(event);
				var data = attrPreprocessor(event.data)
				$(target).css(data.name, data.value);
			},
			
			"set-html": function(event)
			{
				var target = determineTarget(event);
				$(target).html(event.data.arguments.join(" "));
			},
			
			"set-text": function(event)
			{
				var target = determineTarget(event);
				$(target).text(event.data.arguments.join(" "));
			},
			
			"add-class": function(event)
			{
				var target = determineTarget(event);
				$(target).addClass(event.data.arguments.join(" "));		
				$.jss.load();
			},		
			
			"remove-class": function(event)
			{
				var target = determineTarget(event);
				$(target).removeClass(event.data.arguments.join(" "));
				$.jss.load();
			},
			
			"toggle-class": function(event)
			{
				var target = determineTarget(event);
				$(target).toggleClass(event.data.arguments.join(" "));
				$.jss.load();
			}
		},				
		
		/**
		 * All the event property functions that have been declared.
		 * This is used by JSS to remove all bound functions when
		 * it re-applies a stylesheet.
		 * 
		 * The table keys are the selector that was used to find
		 * the elements.
		 * 
		 * For example, eventfunc[".box"][0]  would be the first function
		 * declared using the ".box" selector.
		 */
		eventfunc: new Object(),
		
		/** 
		 * The available stylesheets loaded using script
		 * tags.
		 */
		length: 0,		
		
		/**
		 * The named stylesheets.
		 */		
		sheet: new Object(),				
		
		/**
		 * Declare a JSS stylesheet.
		 * @param {String} [id] An identifier for the stylesheet.
		 * @param {Object} stylesheet The JSS stylesheet.
		 */
		declare: function( id, stylesheet )
		{
			if (typeof id == "string") 
			{
				this.sheet[id] = stylesheet;				
			}
			else
			{							
				// If the id is not a string, then it must be a stylesheet.
				// Thus, we map id to the stylesheet variable.  It's a little
				// dirty but it makes the part after it a lot more clear.
				stylesheet = id;
			}		
			
			// Add the stylesheet to this array.
			Array.prototype.push.call(this, stylesheet);
						
			return this;	
		},		
		
		/**
		 * Clears the memory of all JSS stylesheets.
		 */
		clear: function()
		{
			// Clear the array.
			for (var i = 0; i < this.length; i++)
			{
				this[i] = undefined;
			}			
			this.length = 0;
			
			// Clear the sheet hash.
			for (var ss in this.sheet)
			{
				this.sheet[ss] = undefined;
			}
		},
		
		/**
		 * Apply a JSS stylesheet to the current document.
		 * @param {Object} sheet
		 */
		apply: function(sheet)
		{					
			// If the first arugment is a number, then 
			// use the sheet at that index.
			if (sheet.constructor == Number)
			{
				var index = sheet;
				sheet = this[index];				
			}
			// If it's a string, then use the named sheet.
			else if (typeof sheet == "string")
			{
				sheet = this.sheet[sheet];
			}
			
			for (var blocksel in sheet)
			{	
				// Unbind any existing event properties.
				if (this.eventfunc[blocksel] != undefined)			
				{
					var a = this.eventfunc[blocksel];
					var $blocksel = $(blocksel);
					//alert(blocksel + ": " + this.eventfunc[blocksel].length);
					for (var i = 0; i < a.length; i++) $blocksel.unbind(a[i].type, a[i].fn);
				}
				
				var block = sheet[blocksel];
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
							processDeclartion(sheet, blocksel, 
								prop.replace( '_', '-', 'g' ), value);
						}						
					} // end for
				}
				else
				{
					var value;
					for (var prop in block)
					{		
						value = block[prop];
						processDeclartion(sheet, blocksel, 
							prop.replace( '_', '-' ), value);
					}		
				}						
			} //end for		
			
			return this;			
		},			
				
		load: function()
		{
			for (var i = 0; i < this.length; i++)
			{
				this.apply(i);
			}
			
			return this;
		},
		
		/**
		 * Get the JSS stylesheet from the web using JSONp.  This
		 * stylesheet will be automatically applied.
		 * @param {String} url
		 */
		get: function(url)	
		{
			// Not implemented.
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
