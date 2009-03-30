jQuery.jss.declare("base", {
	
	"div.box":
	{
		padding: "5px",
		margin: "10px",
		border: "1px red solid",
		background: "maroon",
		color: "white",
		font_family: 'Impact, sans-serif'
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
		click: "toggle +normal (div.collapse div:first) !callback"
	},			
	
	"callback": function()
	{
		alert("Called back!");
	}
		
//	"img[src-over]":
//	{
//		hover: "set-attr src [src-over]; set-attr src [src-out]"
//	}
	
});
