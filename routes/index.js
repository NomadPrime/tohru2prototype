var express = require('express');
var router = express.Router();

router.get('/', function(req, res)
{
	res.sendfile('./views/tohru.html');
});

/* GET Hello World page. */
router.get('/hello', function(req, res)
{
  res.sendfile('./views/helloworld.html');
});

router.get('/navi', function(req, res)
{
	res.sendfile('./views/navi.html');
});

module.exports = router;