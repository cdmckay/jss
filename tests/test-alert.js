module("alert",
{
    setup: function()
    {
        // Rebind alert so we can test it.
        __jss.oldAlert = window.alert;
        window.alert = function(message)
        {            
            window.alert.lastMessage = message;
        };

        $.jss.clear();
    },
    teardown: function()
    {
        window.alert = __jss.oldAlert;
        __jss.oldAlert = undefined;
    }
});

test("alert with single argument", function()
{      
    var sheet =
    {
        "#test1":
        {
            "click": "alert hi"
        }
    };

    $.jss.declare(sheet).load();

    // Get a reference to the test 1 element.
    var test1 = $('#test1');

    equals(window.alert.lastMessage, undefined, "alert result should be undefined");
    test1.click();
    equals(window.alert.lastMessage, "hi", "alert result should be hi");
});

test("alert with single quoted argument", function()
{    
    var sheet =
    {
        "#test1":
        {
            "click": "alert 'hi how are you'"
        }
    };

    $.jss.declare(sheet).load();

    // Get a reference to the test 1 element.
    var test1 = $('#test1');

    equals(window.alert.lastMessage, undefined, "alert result should be undefined");
    test1.click();
    equals(window.alert.lastMessage, "hi how are you", "alert result should be hi");
});

test("alert with multiple arguments", function()
{    
    var sheet =
    {
        "#test1":
        {
            "click": "alert hi how are you"
        }
    };

    $.jss.declare(sheet).load();

    // Get a reference to the test 1 element.
    var test1 = $('#test1');

    equals(window.alert.lastMessage, undefined, "alert result should be undefined");
    test1.click();
    equals(window.alert.lastMessage, "hi how are you", "alert result should be hi");
});

