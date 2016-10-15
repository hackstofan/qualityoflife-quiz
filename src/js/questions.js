$('.answer').each(function(idx, obj) {
    noUiSlider.create(this, {
	start: [ 5 ],
	step: 1,
	connect: [true, false],
	range: {
	    'min': 0,
	    'max': 10
	}
    });
});

