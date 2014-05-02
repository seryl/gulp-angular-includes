var through = require('through2');
var path = require('path');
var BufferList = require('bl');

module.exports = function() {
  function strip_extension(fname) {
    var extlen = path.extname(fname).length;
    return fname.slice(0, -1*extlen);
  }

  function prepare_includes(file, env, cb) {
    var location = path.relative(file.base, file.path);
    var base = location.split(path.sep)[0];
    this._info = this._info || {};
    this._info[base] = this._info[base] || [];
    this._info[base].push(location);
    return cb();
  }

  function build_includes(cb) {
    var bl = new BufferList();

    function append_include(name) {
      if (name in this._info) {
        var target_ext = path.extname(this._info[name][0]);
        if (target_ext === ".js") {
          bl.append("// " + name + "\n");
        } else if (target_ext === ".coffee") {
          bl.append("# " + name + "\n");
        }

        for(var key in this._info[name]) {
          bl.append('require("./' + strip_extension(this._info[name][key]) + '")' + "\n");
        }
        bl.append("\n");
      }
    }

    append_include.call(this, 'common');
    this._info['common'] = null;
    delete this._info['common'];

    for (var key in this._info) {
      append_include.call(this, key);
    }
    this.push(bl.toString());
    return cb();
  };

  return through.obj(prepare_includes, build_includes);
};
