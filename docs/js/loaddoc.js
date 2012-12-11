(function($){
	
	/**
	* Converts a properly configured XML document into properly formatted
	* documentation.
	* 
	* @author Cameron McKay
	*/
  
  	var prefix = path == undefined ? "" : path + "/";
  
  	$(function()
	{
		$('#xml-target').getTransform(
			prefix + 'xml/commands.xsl',
			prefix + 'xml/commands.xml'
		);	
		
	});		
  
})(jQuery);