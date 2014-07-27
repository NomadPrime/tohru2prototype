var express = require('express');
var router = express.Router();
var nano = require('nano')('http://localhost:5984');
nano.db.create('tohrutest');//test database for hello world stuff
var testdb = nano.use('tohrutest');

//create default document
testdb.get('default', function(err, body) {
	if(err) {
		testdb.insert({alfa:true},'default');
	}
});

router.get('/tester/list', function(req, res) {
	testdb.get('THETEST', function(err, body){
		if(!err) res.send(body);
	});
});

router.get('/list', function(req, res)
{
	res.sendfile('./views/tohru.html');
});

module.exports = router;