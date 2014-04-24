var fs = require('fs');
var async = require('async');

var re_i18n = /data-i18n\s*=\s*"(?:\[\w+\])?([\w.\-]+)"/g;

var files = fs.readdirSync('./html/public/views');

var paths = [];
async.each(files,
  function(fileName, cb){
    if( !/\.html$/.test(fileName) )
      return cb(null);

    fs.readFile('./html/public/views/' + fileName, {encoding: "utf-8"}, function(err, data){
      var match;
      while( match = re_i18n.exec(data) ){
        paths.push(match[1]);
      }
      cb(null);
    });
  },
  function(err){
    proceedPaths(paths);
  }
);

function proceedPaths(paths){
  var res = {};
  for(var i=0, path; path = paths[i]; i++){
    var keys = path.split('.');

    var prev = res;
    for(var k=0, l = keys.length; k < l ; k++){
      var key = keys[k];

      if(!prev[key])
        prev[key] = {};

      if(k === l-1)
        // the last key in the chain:
        prev[key] = "";
      else
        prev = prev[key];
    }
  }
  fs.writeFileSync("translation.json", JSON.stringify(res, null, "  "));
}