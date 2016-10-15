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

$('#generate-results').click(function(event){
    var results = {}
    $('.answer').each(function(idx,obj) {
	var category = $(obj).data('category');
	var value = parseInt(this.noUiSlider.get());
	results[category] = value;
    });
});

