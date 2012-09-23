
var ApiUsers = function () {
  this.index = function ( req, resp, params ) {
    this.respond(params, {
      format: 'json'
    , template: 'app/views/api/users/index'
    });
  };
};

exports.Users = Users;