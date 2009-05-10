/**
 * Create a random string with the given length.
 * @param {Object} length
 * @return A random string.
 * @type String
 */
function randomString(length)
{
	var src = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
	var str = '';
	for (var i = 0; i < length; i++) 
	{
		var rnd = Math.floor(Math.random() * src.length);
		str += src.substr(rnd, 1);
	}		
	return str;
};