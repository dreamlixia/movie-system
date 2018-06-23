var express = require('express');
var router = express.Router();


var casts = require('./casts.js');
var directors = require('./directors.js');
var movie = require('./movie.js');

/* GET home page. */
router.get('/', function( req, res, next ) {
	res.render('index');//index.ejs是页面
});

router.get('/casts', casts.defaultRoute );//casts是路由casts.js
router.get('/castspaging',casts.castspaging);
router.get('/deleteCastRoute',casts.deleteCastRoute);//删除演员的路由
router.get('/addCastRoute',casts.addCastRoute);//添加
router.post('/addCastsAction',casts.addCastsAction);
router.get('/updateCastRoute',casts.updateCastRoute);//是get
router.post('/updateCastsAction',casts.updateCastsAction);


router.get('/directors', directors.defaultRoute );


router.get('/movie', movie.defaultRoute );
router.get('/sortMovieRoute', movie.sortMovieRoute );//升序降序
router.get('/areaQueryMovieRoute', movie.areaQueryMovieRoute );//按区间查找
router.get('/searchMovieRoute', movie.searchMovieRoute );
router.get('/getYearMovie', movie.getYearMovie );


module.exports = router;
