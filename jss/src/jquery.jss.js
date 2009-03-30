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
			var v = parse(value);			
		
			$(selector).each(function()
			{				
				$(this).bind(prop, 
				{ 
					element: this, 
					"arguments": v["arguments"], 
					selector: v.selector 
				}, func[v.fn]);
			});		
			break;
		}								
		
		default:
			$(selector).css(prop, value);
	}
}

function parse(value, sheet)
{
	var a = $.trim(value).split(" ");
	var fn = a[0]; // Get the function.	
	
	var b = a.slice(1);	
	var args = [];
	var selector = [];
	
	$.each(b, function()
	{
		if (this[0] == "-") args.push(this);
		else selector.push(this);
	});
	
	return { "fn": fn, "arguments": args, selector: selector.join(" ") };
}

var func =
{
	"alert": function(event)
	{
		alert(event.data.selector);
	},
	
	"fade-out": function(event)
	{	
		var data = event.data;
		
		var target = (data.selector.length == 0)
			? data.element 
			: $(data.selector);
		
		var speed = data.arguments.length >= 1
			? data.arguments[0].substr(1) 
			: "";	
		
		$(target).fadeOut(speed);
	},
	
	"fade-in": function(event)
	{
		var data = event.data;
		
		var target = (data.selector.length == 0)
			? data.element 
			: $(data.selector);
		
		var speed = data.arguments.length >= 1
			? data.arguments[0].substr(1) 
			: "";
		
		$(target).fadeIn(speed);
	},
	
	"toggle": function(event)
	{
		var data = event.data;
		
		var target = (data.selector.length == 0)
			? data.element 
			: $(data.selector);		
		
		var speed = data.arguments.length >= 1
			? data.arguments[0].substr(1) 
			: "";
		
		$(target).toggle(speed);
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
