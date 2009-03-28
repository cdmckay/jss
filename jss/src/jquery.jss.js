(function($) {
	
/**
 * jSS 0.1.0 - CSS-like JavaScript Stylesheets
 * Copyright (c) 2009 Cameron McKay (couchware.ca/blogs/cam)
 * Licensed under the GPL (GPL-LICENSE.txt) license.
 * @author cdmckay
 */

/**
 * Processes the CSS property.  This function
 * will intercept special jSS properties and
 * redirect them to the appropriate handler.
 * @param {String} prop
 * @param {String} value
 * @param {String} selector
 */
function processProperty(prop, value, selector)
{
	switch (prop)
	{
		case "animate":
			animateProperty(value, selector);
			return true;
		
		default:
			$(selector).css(prop, value);
	}
}

/**
 * Animates the element using the appropriate 
 * animation effect.
 * @param {String} value
 * @param {String} selector
 */
function animateProperty(value, selector)
{
	var $set = $(selector);
	switch (value)
	{
		case "fadeIn":
			$set.fadeIn();
			break;
			
		case "fadeOut":
			$set.fadeOut();
			break;
			
		case "slideDown":
			$set.slideDown();
			break;
			
		case "slideOut":
			$set.slideUp();
			break;	
			
		default:
			throw new Error("Unrecognized animate value.");
	}
}

jQuery.extend(
{		
	jSS:
	{
		/** 
		 * The available stylesheets loaded using script
		 * tags.
		 */
		length: 0,
		
		/**
		 * Declare a jSS stylesheet.
		 */
		declare: function()
		{
			Array.prototype.push.apply(this, arguments);
		},
		
		/**
		 * Apply a jSS stylesheet to the current document.
		 * @param {Object} sheet
		 */
		apply: function(sheet)
		{		
			for (var selector in sheet)
			{				
				var block = sheet[selector];
				for (var prop in block)
				{		
					processProperty(prop.replace( '_', '-' ), 
						block[prop], selector);
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
		 * Get the jSS stylesheet from the web using JSONp.  This
		 * stylesheet will be automatically applied.
		 * @param {String} url
		 */
		get: function(url)	
		{
			
		}
	}	
});

// Register a ready handler to load the jSS sheets
// as soon as the DOM is ready.
$(function()
{
	$.jSS.load();
});

})(jQuery);
