var countries = undefined;
var country_names = undefined;

$.getJSON('/assets/data/qualityoflife.json', function(data) {
    countries = data.countries;
    country_names = data.names;
});

var category_result = function(category, results) {
    var category_box = '.category-result[data-category="'+category+'"]';

    $(category_box + ' > .category-analysis .country-appendix').text(
	country_names[results[2].country].appendix);

    var width = $(category_box).width();
    var height = 64;
    
    var x = d3.scaleLinear().domain([0,10]).range([52, width-122])
    var y = d3.scaleLinear().domain([0,5]).range([7, height-7])
    
    var chart = d3.selectAll(category_box + ' > .category-viz')
	.append('svg')
	.attr('height', height)
	.attr('width', width);
    
    var viz = chart.selectAll('g')
	.data(results)
	.enter()
	.append('g');

    viz.append('rect')
	.attr('class', function(d) { return d['class']; })
	.attr('height', function(d) { return d['class'] === 'you' ? 4 : 2; })
	.attr('width', function(d) { return x(d.value); } )
	.attr('x', x(0))
	.attr('y', function(d, i) {
	    return d['class'] === 'you' ? y(i) - 1 : y(i) });

    viz.append('text')
	.attr('font-size', 10)
	.attr('class', function(d) { return d['class']; })
    	.attr('dy', 5)
	.attr('text-anchor', 'end')
	.attr('x', x(0) - 2)
	.attr('y', function(d, i) { return y(i); })
	.text(function(d) { return d.name; });

    viz.append('text')
	.attr('font-size', 10)
	.attr('class', function(d) { return d['class']; })
    	.attr('dy', 5)
	.attr('x', function(d) { return x(0) + x(d.value) + 2; })
	.attr('y', function(d, i) { return y(i); })
	.text(function(d) {
	    return !!d.country ? country_names[d.country].icelandic : d.name;});
}

$('#generate-results').click(function(event){
    var results = {}
    $('.answer').each(function(idx,obj) {
	var category = $(obj).data('category');
	var value = parseInt(this.noUiSlider.get());
	results[category] = value;
	var min_country = _.min(_.pairs(countries[category]),
				function(p) { return p[1] })[0];
	var max_country = _.max(_.pairs(countries[category]),
				function(p) { return p[1] })[0];
	var closest_country = _.min(_.pairs(countries[category]),
				    function(p) {
					return Math.pow(p[1] - value, 2);
				    })[0];

	var category_highlights = [
	    {'name': 'Minnst',
	     'class': 'min',
	     'country': min_country,
	     'value': countries[category][min_country]
	    },
	    {'name': 'Þitt svar',
	     'class': 'you',
	     'country': undefined,
	     'value': value
	    },
	    {'name': 'Líkast þér',
	     'class': 'closest',
	     'country': closest_country,
	     'value': countries[category][closest_country]
	    },
	    {'name': 'Ísland',
	     'class': 'iceland',
	     'country': 'iceland',
	     'value': countries[category]['iceland']
	    },
	    {'name': 'Mest',
	     'class': 'max',
	     'country': max_country,
	     'value': countries[category][max_country]
	    }
	];

	category_result(category, category_highlights);
    });
});
