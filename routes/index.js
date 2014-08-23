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

router.get('/lay', function(req, res)
{
	res.sendfile('./views/laytest.html');
});

router.get('/lay/template', function(req, res)
{
	res.sendfile('./views/PageLayout.html');
});

module.exports = router;