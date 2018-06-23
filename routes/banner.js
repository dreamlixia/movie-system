var fs = require('fs');

var { MongoClient } = require('mongodb');//连接了mongodb
var async = require('async');
var url = require('url');

var checkLogin = require('./checkLogin.js');
var mongoUrl = 'mongodb://localhost:27017/project01';

module.exports = {
	defaultRoute: ( req, res, next ) => {
		checkLogin.check( req, res );//检测登录
		
		
			async.waterfall( [
					( cb ) => {
							MongoClient.connect( mongoUrl, ( err, db) => {
									if ( err ) throw err;
									cb( null, db );
							})
					},
					( db, cb ) => {
							db.collection('banner').find( {}, { _id: 0 }).toArray( ( err, data ) => {//data就是我们转出的数组
									if ( err ) throw err;
									cb( null, data );
									db.close();
							});
					}
			], ( err, result ) => {
					if ( err ) throw err;
					res.render('banner', {
							result
		})        
			}) 
	},
	addBannerRoute( req, res, next ){
		checkLogin.check( req, res );
		res.render('banner_add');
	},
	addBannerAction( req, res, next ){
		checkLogin.check( req, res );
		//console.log(req.body);
		//console.log(req.file);
		
		var { bannerid, bannerurl } = req.body;
		
		var oldName = './uploads/' + req.file.filename;
		var finishFlagArr = req.file.originalname.split('.');
		var finishFlag = finishFlagArr[finishFlagArr.length - 1];
		var newName = './uploads/' + req.file.filename + '.' + finishFlag;
		var imgurl = req.file.filename + '.' + finishFlag;//数据存放的地址
		
		async.waterfall([
			( cb ) => {
				fs.rename( oldName, newName, ( err, data ) => {
					if( err ) throw err;
					cb( null, imgurl );
				})
			},
			( imgurl, cb ) => {
				MongoClient.connect( mongoUrl, ( err, db) => {
					if( err ) throw err;
					cb( null, imgurl, db );
				})
			},
			( imgurl, db, cb ) => {
				console.log(bannerid, bannerurl, imgurl);
				db.collection('banner').insert( { bannerid, bannerurl, imgurl }, ( err, res ) => {
					if( err ) throw err;
					cb( null, 'ok');
					db.close();
				})
			}
		],( err, result ) => {
			if( err ) throw err;
			if( result == 'ok'){
				res.redirect('/banner');
			}
			
		})
		
		//res.send('!');
	}
}