var express = require('express');
var router = express.Router();

router.get('/', function(req, res)
{
	res.sendfile('./views/tohru.html');
});

router.get('/test', function(req, res)
{
	res.sendfile('./views/test.html');
});

module.exports = router;