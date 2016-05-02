
$(document).ready(function () {
    initMenu();
    
    //getMyLocation();
});

/* Javascript for the Sidebar*/
function initMenu() {
    // $('#menu ul').hide();
    $('#sidebar-wrapper ul').children('.current').parent().show();
    //$('#menu ul:first').show();
    $('#sidebar-wrapper li a').click(function() {
        var checkElement = $(this).next();
        if((checkElement.is('ul')) && (checkElement.is(':visible'))) {
            return false;
        }
        if((checkElement.is('ul')) && (!checkElement.is(':visible'))) {
            $('#sidebar-wrapper ul:visible').slideUp('normal');
            checkElement.slideDown('normal');
            return false;
        }
    });
}