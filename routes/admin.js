var { MongoClient } = require('mongodb');
var async = require('async');
var url = require('url');
var md5 = require('md5');


var mongoUrl = 'mongodb://localhost:27017/project01';


module.exports = {
	defaultRoute: ( req, res, next ) => {
		res.render('login');
	},
	adminLoginAction : (req, res, next ) => {
		var { name, pwd } = req.body;
		pwd = md5( pwd );
		console.log( pwd );
		//res.send( pwd );
		async.waterfall( [
			( cb ) => {
				MongoClient.connect( mongoUrl, ( err, db ) =>　{
					if ( err ) throw err;
					cb(　null, db );
				})
			},
			( db, cb ) => {
				db.collection('admin').find({name,pwd},{}).toArray( ( err, res ) => {
					if ( err ) throw err;
					cb( null, res );
					db.close();
				})
			}
		], ( err, result ) => {
			if (　err ) throw err;
			result.length > 0 ? res.cookie('loginState', 1) : res.cookie('loginState', 0);
			res.redirect('/');
		})
	},
	adminLogOut: ( req, res, next ) =>　{
		res.cookie('loginState',0);
		res.redirect('/');
	}
	
}