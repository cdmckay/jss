(function($){
	
  /**
   * Converts a properly configured XML document into properly formatted
   * documentation.
   * 
   * @author Cameron McKay
   */
  
  $(function()
  {
  	// Create a ul.
	$("<ul id='command-list'>").appendTo("#xml-target");
  	$.get("commands.xml", {}, transform);
  });
  
  function transform(xml)
  {  
  	var $ul = $('#command-list');
  	$('command', xml).each(function()
	{		
		var $li = $('<li>').html($('name', this).text());
		$li.appendTo($ul);
	});
  }
  
})(jQuery);