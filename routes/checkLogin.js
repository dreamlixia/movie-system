
module.exports = {
	check( req, res ){
		if( req.cookies.loginState != 1){//记录登陆状态
			res.render('login');
			return;
		}
	}
	
}
		