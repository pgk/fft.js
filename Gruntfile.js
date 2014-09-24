module.exports = function(grunt) {
  // Do grunt-related things in here
  grunt.initConfig({
	  pkg: grunt.file.readJSON('package.json'),
	  uglify: {
	    options: {
	      banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
	    },
	    build: {
	      src: 'src/<%= pkg.name %>.js',
	      dest: 'build/<%= pkg.name %>.min.js'
	    }
	  },
	  browserify: {
      fft: {
        src: ["index.js"],
        dest: './dist/<%= pkg.name %>.js',
        options: {
          fft: "<%= pkg.name %>"
        }
      }
    },
	});
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-browserify');
};