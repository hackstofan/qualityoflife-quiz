var scrollTo = function(hash) {
    var target = $(hash);
    target = target.length ? target : $('[name=' + hash.slice(1) +']');
    if (target.length) {
	$('html, body').animate({
	    scrollTop: target.offset().top
	}, 1000);
    }
};

$(function() {
    $('a[href*="#"]:not([href="#"])').click(function() {
	if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
	    scrollTo(this.hash);
	}
	return false;
    });
});
