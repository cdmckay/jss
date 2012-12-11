module("show",
{
    setup: function()
    {
        // Rebind show so we can easily test it.
        __jss.oldShow = $.fn.show;
        $.fn.show = function(speed, callback)
        {
            var fn      = $.fn.show;
            fn.called   = true;
            fn.speed    = speed;
            fn.callback = callback;
        };

        $.jss.clear();
    },
    teardown: function()
    {
        $.fn.show = __jss.oldShow;
        __jss.oldShow = undefined;
    }
});





