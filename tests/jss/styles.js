jQuery.jss.declare("base", {
	
	"div.box":
	{
		padding: "5px",
		margin: "10px",
		border: "1px red solid",
		background: "maroon",
		color: "white",
		font_family: 'Impact, sans-serif',	
		click: "toggle-class box-highlight",
		//setup: "alert 2 + 2 is " + (2 + 2) + "."
	},
	
	"div.box-highlight":
	{
		background: "black",
		border: "1px blue solid"
	},
	
	"div.box:first":
	{
		hover: "fade-out (.box-array) | fade-in (.box-array)"
	},
	
	"div.box a":
	{		
		click: "set-css font-family {click-font}",
		click: "alert (div.box) 'The padding is {padding}.'",
		hover: "set-text <<<<>>>> | set-text worked?"
	},
	
	"span.underline":
	{
		text_decoration: "underline",
		click: "alert (#eg) The position of #eg is {position-left},{position-top}.",
		hover: "set-text \\| | set-text yyy"
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
		//setup: "set-data test tube",
		//click: "alert [test]"
		setup: "set-data src-out {src}", // Store the original image name.
		hover: "set-attr src {src-over} | set-attr src [src-out]",
		click: "alert The dimensions of this element are {width}x{height}."
	},

	"div.hover-other":
	{		
		//hover: "set-attr (#eg) src {src-over} | set-attr (#eg) src {src-out}"
	 	click: "trigger (img[src-over]:eq(0)) click"
	}

//	"div.hover-other":
//	{
//		hover: "set-attr (img#target) src {^src-over-from-blocksel} | set-attr (img#target) src {^src-out-from-blocksel}"
//	}
	
});
