var express = require('express');
var router = express.Router();
var nano = require('nano')('http://localhost:5984');
nano.db.create('tohrutest');
var testdb = nano.use('tohrutest');

//create default document
testdb.get('default', function(err, body) {
	if(err) {
		testdb.insert({alfa:true},'default');
	}
});

/* GET Hello World page. */
router.get('/hello', function(req, res) {
  res.sendfile('./views/helloworld.html');
});

router.get('/tester/list', function(req, res) {
	testdb.get('THETEST', function(err, body){
		if(!err) res.send(body);
	});
});

router.get('/userlist', function(req, res) {
    var db = req.db;
    var collection = db.get('usercollection');
    collection.find({},{},function(e,docs){
        res.render('userlist', {
            "userlist" : docs
        });
    });
});

router.get('/navi', function(req, res) {
	res.sendfile('./views/navi.html');
});

module.exports = router;
