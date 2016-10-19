var countries = undefined;
var country_names = undefined;

$.getJSON('/assets/data/qualityoflife.json', function(data) {
    countries = data.countries;
    country_names = data.names;
});

var category_result = function(category, results) {
    var category_box = '.category-result[data-category="'+category+'"]';

    $(category_box + ' > .category-analysis .country-appendix').text(
	country_names[results[2].key].appendix);

    var width = $(category_box).width();
    var height = 82;

    // 52 and 144 are found with trial and error but should be found by
    // computing the largest possible text string and the width of that string
    var x = d3.scaleLinear().domain([0,10]).range([52, width-144])
    var y = d3.scaleLinear().domain([0,5]).range([7, height-7])
    
    var chart = d3.selectAll(category_box + ' > .category-viz')
	.append('svg')
	.attr('height', height)
	.attr('width', width);
    
    var viz = chart.selectAll('g')
	.data(results)
	.enter()
	.append('g');

    viz.append('line')
	.attr('class', function(d) { return d['class']; })
	.attr('x1', x(0))
	.attr('y1', function(d, i) { return y(i); })
        .attr('x2', function(d) { return x(d.value); })
	.attr('y2', function(d, i) { return y(i); });

    viz.append('text')
	.attr('font-size', 10)
	.attr('class', function(d) { return d['class']; })
	.attr('text-anchor', 'end')
        .attr('dominant-baseline', 'middle')
	.attr('x', x(0) - 2)
	.attr('y', function(d, i) { return y(i); })
	.text(function(d) { return d.name; });

    viz.append('text')
	.attr('font-size', 10)
        .attr('dominant-baseline', 'middle')
	.attr('class', function(d) { return d['class']; })
	.attr('x', function(d) { return x(d.value) + 2; })
	.attr('y', function(d, i) { return y(i); })
	.text(function(d) {
	    return !!d.country ? d.country : d.name;});
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

    var viz = chart.selectAll("g").data(results).enter().append("g");

    viz.append("rect")
	.attr("opacity", 0.5)
	.attr("y", function(d,i) {
	    return y(4*i)+y(2)/2-4; })
	.attr("x", function(d) {
	    return x(d.reference)-4; })
	.attr("width", 8)
	.attr("height", 8);

    viz.append("text")
        .attr("text-anchor", "middle")
        .attr("dominant-baseline", "middle")
	.attr("opacity", 0.22)
	.attr("y", function(d,i) {
	    return y(4*i)+y(2)/4; })
	.attr("x", function(d) {
	    return x(d.reference); })
	.text(function(d) {
	    return country_names[reference].icelandic; });

    viz.append("rect")
        .attr("class", function(d) { return d.name; })
	.attr("opacity", 0.5)
	.attr("y", function(d,i) {
	    return y(4*i)+y(2)/2-4; })
	.attr("x", function(d) {
	    return x(d.closest)-4; })
	.attr("width", 8)
	.attr("height", 8);

    viz.append("text")
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

    viz.append("text")
	.attr("class", function(d) { return d.name; })
	.attr("text-anchor", "middle")
	.attr("font-size", 10)
	.attr("opacity", 0.5)
        .attr("dominant-baseline", "middle")
	.attr("y", function(d,i) { return y(4*i)+y(2)/2; })
	.attr("x", x(0)/2)
	.text(function(d) { return d.label });

    viz.append("text")
	.attr("class", function(d) { return d.name; })
	.attr("text-anchor", "middle")
	.attr("font-size", 10)
	.attr("opacity", 0.5)
        .attr("dominant-baseline", "middle")
	.attr("y", function(d,i) { return y(4*i)+y(2)/2; })
	.attr("x", width - (width - x(10))/2)
	.text(function(d) { return d.label });

    viz.append("line")
	.attr("stroke", "#ababab")
        .attr("opacity", 0.5)
        .attr("stroke-width", 1)
        .attr("x1", x(0))
	.attr("y1", function(d,i) { return y(4*i)+y(2)/2; })
	.attr("x2", x(10))
	.attr("y2", function(d,i) { return y(4*i)+y(2)/2; });

    viz.append("line")
	.attr("class", function(d) { return d.name; })
	.attr("stroke-width", 4)
	.attr("x1", function(d) { return x(d.you); })
	.attr("y1", function(d,i)  {return y(4*i); })
	.attr("x2", function(d) { return x(d.you); })
        .attr("y2", function(d,i)  {return y(4*i)+y(2); });

    viz.append("text")
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

	var min_value = _.min(_.values(countries[category]));
	var min_countries = _.filter(
	    _.keys(countries[category]), function(c) {
		return countries[category][c] === min_value; });
	
	var max_value = _.max(_.values(countries[category]));
	var max_countries = _.filter(
	    _.keys(countries[category]), function(c) {
		return countries[category][c] === max_value; });

	var closest_country = _.min(_.pairs(countries[category]),
				    function(p) {
					return Math.pow(p[1] - value, 2);
				    })[0];

	var category_highlights = [
	    {'name': 'Minnst',
	     'class': 'min',
	     'key': min_countries[0],
	     'country': _.map(min_countries, function(c) {
		 console.log(country_names[c].icelandic);
		 return country_names[c].icelandic; }).join('/'),
	     'value': min_value
	    },
	    {'name': 'Þitt svar',
	     'class': 'you',
	     'key': 'you',
	     'country': undefined,
	     'value': value
	    },
	    {'name': 'Líkast þér',
	     'class': 'closest',
	     'key': closest_country,
	     'country': country_names[closest_country].icelandic,
	     'value': countries[category][closest_country]
	    },
	    {'name': country_names['iceland'].icelandic,
	     'class': 'iceland',
	     'key': 'iceland',
	     'country': country_names['iceland'].icelandic,
	     'value': countries[category]['iceland']
	    },
	    {'name': 'Mest',
	     'class': 'max',
	     'key': max_countries[0],
	     'country': _.map(max_countries, function(c) {
		 return country_names[c].icelandic; }).join('/'),
	     'value': max_value
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
