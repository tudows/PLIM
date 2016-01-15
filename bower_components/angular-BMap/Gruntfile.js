module.exports = function (grunt) {

  var sources = ['./src/*.js'],
    html = ['./html/*.html'];//Դ�ļ�

  // ��������
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    watch: {
      scripts: {
        tasks: ['uglify'],
        files: sources
      }
    },

    jshint: {
      all: sources
    },

    uglify: {
      options: {
        mangle: true,
        banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      build: {
        files: {
          'dist/angular-bmap.min.js': sources
        }
      }
    },

    concat: {
      options: {
        banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %> */\n' +
        '(function(){\n',
        footer: '\n})();'
      },
      build: {
        files: {
          'output/js/output.js': sources
        }
      }
    },
    htmlmin: {
      options: {
        removeComments: true,
        collapseWhitespace: true,
        conservativeCollapse: true,
        collapseBooleanAttributes: true,
        removeCommentsFromCDATA: true,
        removeOptionalTags: true
      },
      build: {
        files: [{
          expand: true,
          src: html,
          dest: 'output/'
        }]
      }
    },
    jsdoc2md: {
      withOptions: {
        options: {
          "no-gfm": true
        },
        src: "src/*.js",
        dest: "api/with-index.md"
      }
    }
  });
  // �������
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-htmlmin');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks("grunt-jsdoc-to-markdown");
};
