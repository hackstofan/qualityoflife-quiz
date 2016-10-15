module.exports = function(grunt) {

    grunt.initConfig({
	pkg: grunt.file.readJSON('package.json'),
	clean: ['build/'],
	copy: {
	    build: {
		files: [
		    {
			expand: true,
			cwd: 'src/img/',
			src: ['*.jpg', '*.png'],
			dest: 'build/assets/img/'
		    },
		    {
			expand: true,
			cwd: 'src/external',
			src: ['js/*', 'css/*'],
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
 	uglify: {
 	    build: {
 		files: {
 		    'build/assets/js/app.js': ['src/js/*.js']
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
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-nunjucks-2-html');

    grunt.registerTask('default', [
	'clean', 'copy', 'less', 'uglify', 'nunjucks'
    ]);

};
