var express = require('express');
var router = express.Router();

var multer = require('multer');
var upload = multer({
	dest: 'uploads/'//所有上传的文件都放在这里
})


var casts = require('./casts.js');
var directors = require('./directors.js');
var movie = require('./movie.js');
var admin = require('./admin.js');
var banner = require('./banner.js');

/* GET home page. */
router.get('/', function( req, res, next ) {
	
	var type = req.cookies.loginState == 1 ? 'index' : 'login';
	res.render(type);
//	res.render("index");//index.ejs是页面
// 	console.log(req.cookies);
// 	console.log("b","1111");
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

router.get('/admin', admin.defaultRoute );
router.post('/adminLoginAction',admin.adminLoginAction);//登陆页面路由
router.get('/adminLogOut', admin.adminLogOut );

router.get('/banner', banner.defaultRoute );
router.get('/addBannerRoute', banner.addBannerRoute );
router.post('/addBannerAction', upload.single('bannerimg'), banner.addBannerAction );//post提交的

module.exports = router;
