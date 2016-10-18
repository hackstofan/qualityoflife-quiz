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

var overall_results = function(results, closest, reference) {

    $('#average .average-result .country-appendix').text(
	country_names[closest].appendix
    );

    var height = 800;
    var width = $('#average').width();

    var padding = 20;

    var y = d3.scaleLinear().domain([0,40]).range([padding, height-2*padding]);
    var x = d3.scaleLinear().domain([0,10]).range([4*padding, width-4*padding]);

    var chart = d3.select("#average .average-result")
	.append("svg")
	.attr("class", "compare")
	.attr("height", height)
	.attr("width", width);

    var bar = chart.selectAll("g").data(results).enter().append("g");

    bar.append("rect")
	.attr("opacity", 0.5)
	.attr("y", function(d,i) {
	    return y(4*i)+y(2)/2-4; })
	.attr("x", function(d) {
	    return x(d.reference)-4; })
	.attr("width", 8)
	.attr("height", 8);

    bar.append("text")
        .attr("text-anchor", "middle")
        .attr("dominant-baseline", "middle")
	.attr("opacity", 0.22)
	.attr("y", function(d,i) {
	    return y(4*i)+y(2)/4; })
	.attr("x", function(d) {
	    return x(d.reference); })
	.text(function(d) {
	    return country_names[reference].icelandic; });

    bar.append("rect")
        .attr("class", function(d) { return d.name; })
	.attr("opacity", 0.5)
	.attr("y", function(d,i) {
	    return y(4*i)+y(2)/2-4; })
	.attr("x", function(d) {
	    return x(d.closest)-4; })
	.attr("width", 8)
	.attr("height", 8);

    bar.append("text")
        .attr("class", function(d) { return d.name; })
	.attr("text-anchor", "middle")
        .attr("dominant-baseline", "middle")
	.attr("opacity", 0.5)
	.attr("y", function(d,i) {
	    return y(4*i)+3*y(2)/4; })
	.attr("x", function(d) {
	    return x(d.closest); })
	.text(function(d) {
	    return country_names[closest].icelandic; });

    bar.append("text")
	.attr("class", function(d) { return d.name; })
	.attr("text-anchor", "middle")
	.attr("font-size", 10)
	.attr("opacity", 0.5)
        .attr("dominant-baseline", "middle")
	.attr("y", function(d,i) { return y(4*i)+y(2)/2; })
	.attr("x", x(0)/2)
	.text(function(d) { return d.label });

    bar.append("text")
	.attr("class", function(d) { return d.name; })
	.attr("text-anchor", "middle")
	.attr("font-size", 10)
	.attr("opacity", 0.5)
        .attr("dominant-baseline", "middle")
	.attr("y", function(d,i) { return y(4*i)+y(2)/2; })
	.attr("x", width - (width - x(10))/2)
	.text(function(d) { return d.label });

    bar.append("line")
	.attr("stroke", "#ababab")
        .attr("opacity", 0.5)
        .attr("stroke-width", 1)
        .attr("x1", x(0))
	.attr("y1", function(d,i) { return y(4*i)+y(2)/2; })
	.attr("x2", x(10))
	.attr("y2", function(d,i) { return y(4*i)+y(2)/2; });

    bar.append("line")
	.attr("class", function(d) { return d.name; })
	.attr("stroke-width", 4)
	.attr("x1", function(d) { return x(d.you); })
	.attr("y1", function(d,i)  {return y(4*i); })
	.attr("x2", function(d) { return x(d.you); })
        .attr("y2", function(d,i)  {return y(4*i)+y(2); });

    bar.append("text")
	.attr("class", function(d) { return d.name; })
	.attr("text-anchor", "middle")
        .attr("dominant-baseline", "bottom")
	.attr("font-size", 10)
        .attr("dy", -2)
	.attr("x", function(d) { return x(d.you); })
	.attr("y", function(d,i) { return y(4*i);})
	.text("Þitt svar");
}

$('#generate-results').click(function(event){
    var results = {}

    $(this).hide();
    $('#categories').show();
    scrollTo('#categories');

    $('.answer').each(function(idx,obj) {
	var category = $(obj).data('category');
	var category_label = $(obj).data('label');
	var value = parseInt(this.noUiSlider.get());
	results[category] = {'value': value, 'label': category_label};

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

    $('#average').show();

    var mapped = _.mapObject(countries, function(country_values, category) {
	return _.mapObject(country_values, function(value, country) {
	    return Math.pow(value-results[category].value, 2)
	});
    });

    var summed_countries = _.reduce(_.values(mapped), function(memo, value) {
	_.each(value, function(value, key) {
	    memo[key] = (memo[key] ? memo[key] : 0) + value });
	return memo;
    }, {})

    var picked_country = _.min(_.pairs(summed_countries),
			       function(p) { return p[1]; })[0];

    var chart_data = _.map(_.keys(results), function(key) {
	return {
	    'name': key,
	    'label': results[key].label,
	    'you': results[key].value,
	    'reference': countries[key].iceland,
	    'closest': countries[key][picked_country]
	};
    });

    overall_results(chart_data, picked_country, 'iceland');
});
