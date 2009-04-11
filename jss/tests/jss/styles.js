jQuery.jss.declare("base", {
	
	"div.box":
	{
		padding: "5px",
		margin: "10px",
		border: "1px red solid",
		background: "maroon",
		color: "white",
		font_family: 'Impact, sans-serif',		
	},
	
	"div.box:first":
	{
		hover: "fade-out (.box-array) | fade-in (.box-array)"
	},
	
	"div.box a":
	{
		click: "remove-attr href"
	},
	
	"span.underline":
	{
		text_decoration: "underline"		
	},		
	
	/* 
	 * Implements a collapsible div that opens and closes
	 * when the span above it is clicked.
	 */
	"div.collapse span:first":
	{
		click: "toggle (div.collapse div:first) normal !callback"
	},			
	
	"callback": function()
	{
		alert("Called back!");
	},
		
	"img[src-over]":
	{
		hover: "set-attr src {src-over} | set-attr src {src-out}"
	}

//	"div.hover-other":
//	{
//		hover: "set-attr (img#target) src {src-over} | set-attr (img#target) src {src-out}"
//	}

//	"div.hover-other":
//	{
//		hover: "set-attr (img#target) src {@src-over-from-blocksel} | set-attr (img#target) src {@src-out-from-blocksel}"
//	}
	
});
