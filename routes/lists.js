var express = require('express');
var router = express.Router();
var nano = require('nano')('http://localhost:5984');	//change to proper login

////////DATABASE SETUP////////
nano.db.list(function(err, body)
{
	var dbPresent = false;
	body.forEach(function(db)
	{
		if(db === 'tohru')
		{
			dbPresent = true;
		}
	});
	if(!dbPresent)	//Create TOHRU database
	{
		nano.db.create('tohru');
		var db = nano.use('tohru');
		//any 'starter' documents to be created go here
	}
});
var db = nano.use('tohru');


/*
nano.db.create('tohrutest');//test database for hello world stuff
var testdb = nano.use('tohrutest');

//create default document
testdb.get('default', function(err, body) {
	if(err) {
		testdb.insert({alfa:true},'default');
	}
});

/*
router.get('/tester/list', function(req, res) {
	testdb.get('THETEST', function(err, body){
		if(!err) res.send(body);
	});
});
*/

router.post('/test', function(req, res)
{
	console.log(req.body.alpha);
});

/**
 * Simply check if a document exists for a particular meeting
 */
router.post('/meetexists', function(req, res)
{
	db.get(req.body.meeting, function(err, body)
	{
		if(err)
		{
			res.json({exists:false});
		}
		else
		{
			res.json({exists:true});
		}
	});
});

/**
 * Function for checking validity of a password
 */
var modPassCheck = function(meeting, modpass, cb)
{
	db.get('##MODPASS##'+meeting, function(err, body)
	{
		if(err)
		{
			cb(false);
		}
		else
		{
			if(modpass == body.password)
			{
				cb(true);
			}
			else
			{
				cb(false);
			}
		}
	});
};

/**
 * Recursive function for registration
 */
updateRegister = function(db, meeting, username)
{
	db.get(meeting, function(err, body)
	{
		body.users.push({name: username});
		body.update = Date.now();
		db.insert(body, function(err, body)
		{
			if(err)
			{
				updateRegister(db, meeting, username);
			}
		});
	});
};

/**
 * Registers a new user in a meeting and gives them the meeting key.
 */
router.post('/register', function(req, res)
{
	db.get(req.body.meeting, function(err, body)
	{
		if(err)
		{
			console.log('User "'+req.body.name+'" could not find meeting "'+req.body.meeting+'"');
			res.json({key:-52});
		}
		else
		{
			updateRegister(db, req.body.meeting, req.body.name);
			console.log('User "'+req.body.name+'" registered in meeting "'+req.body.meeting+'"');
			res.json({key: body.key});
		}
	});
});

/**
 * Registers a new moderator in a meeting and gives them the meeting key.
 */
router.post('/registermod', function(req, res)
{
	//var pass = modPassCheck(req.body.meeting, req.body.modpass);
	//console.log(pass);
	modPassCheck(req.body.meeting, req.body.modpass, function(check)
	{
	if(check)
	{
		db.get(req.body.meeting, function(err, body)
		{
			if(err)
			{
				res.json({key:-52});
			}
			else
			{
				updateRegister(db, req.body.meeting, '[MOD] '+req.body.name);
				console.log('User "'+req.body.name+'" registered with moderator access in meeting "'+req.body.meeting+'"');
				res.json({key: body.key});
			}
		});
	}
	else
	{
		console.log('User "'+req.body.name+'" attempted to gain moderator access to meeting "'+req.body.meeting+'" with invalid password "'+req.body.modpass+'"');
		res.json({key:-52});
	}
});
});

/**
 * Creates a new meeting
 */
router.post('/createnew', function(req, res)
{
	db.get(req.body.meeting, function(err, body)
	{
		if(err)
		{
			var newMeeting = {
				key: Math.floor((Math.random()*10000000000000000000000)+1).toString(36),
				update: Date.now(),
				hands: [],
				users: []
			};
			var newMod = {
				update: 0,
				password: req.body.modpass
			};
			db.insert(newMeeting, req.body.meeting);
			db.insert(newMod, '##MODPASS##'+req.body.meeting);
			console.log('New meeting registered as "'+req.body.meeting+'"');
			res.json({nameTaken: false});
		}
		else
		{
			console.log('Attempt to register "'+req.body.meeting+'", meeting already exists');
			res.json({nameTaken: true});
		}
	});
});

module.exports = router;