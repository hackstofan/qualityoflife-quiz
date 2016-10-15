module.exports = function(grunt) {

    grunt.initConfig({
	pkg: grunt.file.readJSON('package.json'),
	clean: ['build/'],
	copy: {
	    img: {
		files: [
		    {
			expand: true,
			cwd: 'src/',
			src: ['img/*'],
			dest: 'build/assets/'
		    }
		]
	    }
	},
	less: {
	    build: {
		options: {
		    paths: "src/less"
		},
		files: {
		    'build/assets/css/app.css': 'src/less/app.less'
		}
	    }
	},
	nunjucks: {
	    options: {
		data: grunt.file.readJSON("project.json"),
		paths: "src/html"
	    },
	    build: {
		files: [{
		    expand: true,
		    cwd: "src/html/templates",
		    src: [
			"*.html"
		    ],
		    dest: "build/",
		    ext: ".html"
		}]
	    }
	}
    });
    
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-nunjucks-2-html');

    grunt.registerTask('default', [
	'clean', 'copy', 'less', 'nunjucks'
    ]);

};
