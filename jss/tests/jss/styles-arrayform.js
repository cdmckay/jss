jQuery.jss.declare({
	
	"div.box-array":
	[
		{ padding: "5px" },
		{ margin: "10px" },
		{ border: "1px black solid" },
		{ background: "!chrono" },
		{ color: "black" },
		{ font_family: 'Georgia, serif' },
		{ click: "toggle (div.box) slow" }
	],				
		
	/**
	 * Checks the current time.  If the minute is
	 * even, it shows a dark background.  If the
	 * minute is odd, it shows a light background.
	 */
	chrono: function()
	{
		var minute = new Date().getMinutes();
		
		if (parseInt(minute % 2) == 0) return "lightgreen";
		else return "lightblue";						
	},		

		
});
