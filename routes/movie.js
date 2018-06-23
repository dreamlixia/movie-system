var { MongoClient } = require('mongodb');
var async = require('async');
var url = require('url');

var mongoUrl = 'mongodb://localhost:27017/project01';


module.exports = {
	defaultRoute: ( req, res, next ) => {
		if( req.cookies.loginState != 1){
			res.render('login');
			return;
		}
		async.waterfall ( [
			( cb ) => {
				MongoClient.connect( mongoUrl, ( err, db ) => {
					if( err ) throw err;
					cb( null, db );
				})
			},
			( db, cb )=>{
				db.collection('movie').distinct('year', ( err, yearArr ) => {
					if ( err ) throw err;
					yearArr.sort( ( a, b ) => {
						return a-b;
					});
					cb( null, yearArr, db )
				})
			},
			( yearArr, db, cb ) => {//拿到电影数据
				db.collection('movie').find({},{_id:0}).toArray( (err, res ) => {
					if( err ) throw err;
					cb( null, {
						res,
						yearArr
					});
					db.close();
				})
			}
		], ( err, result ) => {
			if ( err ) throw err;
			res.render('movie',{
				result: result.res,
				yearArr:result.yearArr
			});
		})
	},
	//升序降序
	sortMovieRoute: ( req, res, next ) => {
		if( req.cookies.loginState != 1){
			res.render('login');
			return;
		}
		var { type, num } = url.parse( req.url, true ).query;
		
		var sortObj ={};
		num = num * 1;
		
		try{
			sortObj[type] = num;
		}catch(e){
			//TODO handle the exception
		}
		async.waterfall([
			
			( cb ) => {
				MongoClient.connect( mongoUrl, ( err, db ) => {
					if( err ) throw err;
					cb( null, db );
				})
			},
			( db, cb )=>{
				db.collection('movie').distinct('year', ( err, yearArr ) => {
					if ( err ) throw err;
					yearArr.sort( ( a, b ) => {
						return a-b;
					});
					cb( null, yearArr, db )
				})
			},
			( yearArr, db, cb ) => {
				db.collection('movie').find({},{_id:0}).sort( sortObj ).toArray( (err, res ) => {
					if( err ) throw err;
					cb( null, {
						res,//拿到电影数据
						yearArr
					});
					db.close();
				})
			}
		], ( err, result ) => {
			if ( err ) throw err;
			res.render('movie',{
				result: result.res,
				yearArr: result.yearArr
			})
		})
		
	},
	//按区间查找
	areaQueryMovieRoute: ( req, res, next ) => {
		if( req.cookies.loginState != 1){
			res.render('login');
			return;
		}
		var { type, min, max } = url.parse( req.url, true ).query;
		var whereObj = {};
		min = min * 1;
		max = max * 1;
		try{
			whereObj[type] = {
				$gte : min,//$get,$lte获取到临界值
				$lte: max
			}
		}catch(e){
			//TODO handle the exception
		}
		
		async.waterfall([
			
			( cb ) => {
				MongoClient.connect( mongoUrl, ( err, db ) => {
					if( err ) throw err;
					cb( null, db );
				})
			},
			( db, cb )=>{
				db.collection('movie').distinct('year', ( err, yearArr ) => {
					if ( err ) throw err;
					yearArr.sort( ( a, b ) => {
						return a-b;
					});
					cb( null, yearArr, db )
				})
			},
			( yearArr, db, cb ) => {
				db.collection('movie').find( whereObj, {_id:0}).toArray( (err, res ) => {
					if( err ) throw err;
					cb( null, {
						res,//拿到电影数据
						yearArr
					});
					db.close();
				})
			}
		], ( err, result ) => {
			if ( err ) throw err;
			res.render('movie',{
				result: result.res,
				yearArr: result.yearArr
			})
		})
		
	},
	//查找类型，按名称
	searchMovieRoute: ( req, res, next ) => {
		if( req.cookies.loginState != 1){
			res.render('login');
			return;
		}
		//title		subtype		
		//type	val
		var { type, val } = url.parse( req.url, true ).query;
		var whereObj = {};//赋初值
		try{
			whereObj[type] = eval("/" + val + "/");
		}catch(e){
			//TODO handle the exception
		}
		async.waterfall([
			
			( cb ) => {
				MongoClient.connect( mongoUrl, ( err, db ) => {
					if( err ) throw err;
					cb( null, db );
				})
			},
			( db, cb )=>{
				db.collection('movie').distinct('year', ( err, yearArr ) => {
					if ( err ) throw err;
					yearArr.sort( ( a, b ) => {
						return a-b;
					});
					cb( null, yearArr, db )
				})
			},
			( yearArr, db, cb ) => {
				db.collection('movie').find( whereObj, {_id:0}).toArray( (err, res ) => {
					if( err ) throw err;
					cb( null, {
						res,//拿到电影数据
						yearArr
					});
					db.close();
				})
			}
		], ( err, result ) => {
			if ( err ) throw err;
			res.render('movie',{
				result: result.res,
				yearArr:result.yearArr
			})
		})
	},
	getYearMovie: ( req, res, next ) => {
		
		if( req.cookies.loginState != 1){
			res.render('login');
			return;
		}
		var {year} = url.parse( req.url, true ).query;
		year = year * 1;
		async.waterfall ( [
			( cb ) => {
				MongoClient.connect( mongoUrl, ( err, db ) => {
					if( err ) throw err;
					cb( null, db );
				})
			},
			( db, cb )=>{
				db.collection('movie').distinct('year', ( err, yearArr ) => {
					if ( err ) throw err;
					yearArr.sort( ( a, b ) => {
						return a-b;
					});
					cb( null, yearArr, db )
				})
			},
			( yearArr, db, cb ) => {//拿到电影数据
				db.collection('movie').find({year:year},{_id:0}).toArray( (err, res ) => {
					if( err ) throw err;
					cb( null, {
						res,
						yearArr
					});
					db.close();
				})
			}
		], ( err, result ) => {
			if ( err ) throw err;
			res.render('movie',{
				result: result.res,
				yearArr:result.yearArr
			});
		})
		
	}
	
	
}