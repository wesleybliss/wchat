
var express = require('express'),
    http = require('http');

var app = express(),
    server = http.createServer( app ),
    io = require('socket.io').listen( server );

server.listen( 8080 );

//for ( var p in io ) console.log(p);

app.configure( function() {
    
    app.use( express.methodOverride() );
    app.use( express.bodyParser() );
    app.use( app.router );
    
    app.use( express.static(__dirname + '/public') );
    app.use( express.errorHandler() );
    app.use( express.logger() );
    
});

var pr = function( o ) {
    for ( var p in o ) console.log( p );
};


// Action to set the counter
app.get( '/sentCounter/set/:count', function( req, res ) {
    sentCounter = req.params.count;
    res.send( 'ok' );
});


// Action to get the current counter
app.get( '/sentCounter/get', function( req, res ) {
    res.send( 'sentCounter: ' + sentCounter );
});


// Action to broadcast messages to all connected users (except for the sender)
app.get( '/message/broadcast/:msg', function( req, res ) {
    pr( socket );
    io.sockets.broadcast( 'message', {
        sentCounter: sentCounter,
        message: req.params.msg
    });
    res.send( 'ok' );
});



var sentCounter = 0;

io.sockets.on( 'connection', function( client ) {
    
    client.broadcast.emit( 'message', {
        sentCounter: sentCounter,
        message: 'Welcome to wchat.'
    });
    
    client.broadcast.emit( 'message', {
        sentCounter: sentCounter,
        message: 'Another client connected.'
    });
    
    client.on( 'message', function( data ) {
        sentCounter++;
        client.broadcast.emit( 'message', {
            sentCounter: sentCounter,
            message: data
        });
    });
    
    client.on( 'disconnect', function() {
        client.broadcast.emit( 'message', {
            sentCounter: sentCounter,
            message: 'Another client disconnected.'
        });
    });
    
    sender( client );
    
});


var sender = function( client ) {
    sentCounter++;
    client.broadcast.emit( 'message', {
        sentCounter: sentCounter,
        message: ( 'This was an auto message - msg #' + sentCounter )
    });
    setTimeout( function() {
        sender( client );
    }, 10000 );
};

