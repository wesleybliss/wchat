
var Hello = function () {
  this.index = function (req, resp, params) {
    this.respond(params, {
      format: 'html'
    , template: 'app/views/hello/index'
    });
  };
};

exports.Hello = Hello;


