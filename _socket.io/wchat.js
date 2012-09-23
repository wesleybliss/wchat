
var http = require('http'),
    sys = require('sys'),
    fs = require('fs'),
    io = require('socket.io');

var pr = function( o ) {
    var s = [];
    for ( var p in o ) {
        s.push( p + ' = ' + o );
    }
    if ( (arguments.length >= 2) && !!arguments[1] ) {
        return s.join( '\n' );
    }
    console.log( s.join('\n') );
    return true;
};


var server = http.createServer( function( req, res ) {
    
    res.writeHead( 200, {
        'Content-Type': 'text/html'
    });
    
    fs.readFile( __dirname + '/template.html', function( err, data ) {
        if ( err ) throw err;
        res.end( data );
    });
    
});

server.listen( 8080 );

var socket = io.listen( server );
var interval;

socket.on( 'connection', function( client ) {
    
    client.on( 'message', function( event ) {
        console.log( 'MSG: ' + event );
        socket.broadcast.emit( event );
    });
    
    client.on( 'disconnect', function() {
        clearInterval( interval );
        console.log( 'Server disconnected' );
    });
    
    client.on( 'set nick', function(name) {
        console.log( 'nick set to ' + name );
    });
    
});