sliders = document.getElementsByClassName('answer');

for ( var i = 0; i < sliders.length; i++ ) {
    console.log(sliders[i]);
    noUiSlider.create(sliders[i], {
	start: [ 5 ],
	step: 1,
	connect: [true, false],
	range: {
	    'min': 0,
	    'max': 10
	}
    });
}

