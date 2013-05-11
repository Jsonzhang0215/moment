/*jshint onevar:false*/

module.exports = function (grunt) {

    var helpers = require('grunt-lib-legacyhelpers').init(grunt);
    var START = "(function(){\n";
    var END   = "})();\n";

    var GLOBAL_START = [
        "(function(){",
        "    function onload (moment) {",
        ""
    ].join('\n');

    var GLOBAL_RESET = "\nmoment.lang('en');\n";

    var GLOBAL_END = [
        "",
        "    }",
        "    if (typeof define === \"function\" && define.amd) {",
        "        define([\"moment\"], onload);",
        "    }",
        "    if (typeof window !== \"undefined\" && window.moment) {",
        "        onload(window.moment);",
        "    }",
        "})();",
        ""
    ].join('\n');

    grunt.registerMultiTask('concatlang', 'Concatenate files.', function() {
        var files = grunt.file.expand(this.data.src);
        // Concat specified files.
        var src = helpers.concat(files, {separator: END + START});
        grunt.file.write(this.data.dest, wrapFile(src));

        // Fail task if errors were logged.
        if (this.errorCount) { return false; }

        // Otherwise, print a success message.
        grunt.log.writeln('File "' + this.data.dest + '" created.');
    });

    function wrapFile(code) {
        code = code.replace(/require\([\'\"]\.\.\/moment[\'\"]\)/g, "moment");
        return GLOBAL_START + START + code + END + GLOBAL_RESET + GLOBAL_END;
    }
};
