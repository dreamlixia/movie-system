
const SMSClient = require('@alicloud/sms-sdk')
const url = require('url')
var { MongoClient } = require('mongodb');
var async = require('async');
var mongoUrl = 'mongodb://localhost:27017/project01';


function randomNum () {
	return Math.floor(Math.random() * (9999-1000 +1) + 1000);
}
module.exports = {
	defaultRoute: ( req, res, next ) => {
		res.send('user');
	},
	sendCode ( req, res, next ) {
		const {tel} = url.parse( req.url, true ).query
		// ACCESS_KEY_ID/ACCESS_KEY_SECRET 根据实际申请的账号信息进行替换
		const accessKeyId = 'LTAIZQoVVoPuBjU9'
		const secretAccessKey = 'GfJuI2dLsCQh7Q56TmFxPTniXjkVnB'
		//初始化sms_client
		let smsClient = new SMSClient({accessKeyId, secretAccessKey})
		//发送短信
		let code = randomNum()
		
		async.waterfall([
			(cb) => {
				MongoClient.connect( mongoUrl, (err, db) => {
					if( err ) throw err;
					cb(null, db)
				})
			},
			(db, cb) => {
				db.collection('users').find({tel},{_id:0}).toArray((err, data)=> {
					if( err ) throw err;
					cb(null, data);
					db.close();
				})
			}
		], (err, result) => {
			if( err ) throw err;
			if(result.length > 0){
				res.send('1')
			}else if(result.length == 0){
				//res.send('0')
				
				smsClient.sendSMS({
				    PhoneNumbers: tel,
				    SignName: '吴勋勋',
				    TemplateCode: 'SMS_111785721',
				    TemplateParam: '{"code":'+code+'}'
				}).then(function (result) {
				    let {Code}=result
				    if (Code === 'OK') {
				        //处理返回参数
				        console.log(result)
				        res.send({
				        	code,
				        	state: 1
				        })
				    }
				}, function (err) {
				    console.log(err)
				    res.send({
				    	state: 0
				    })
				})
			}
		})
		

	},
	register ( req, res, next ) {
		const {tel, password} = req.body
		console.log(req.body)
		async.waterfall([
			( cb ) => {
				MongoClient.connect( mongoUrl, (err, db) => {
					if( err ) throw err;
					cb( null, db );
				})
			},
			( db, cb ) => {
				db.collection('users').insert({tel,password}, ( err, res ) => {
					if( err ) throw err;
					cb( null, 'ok');
					db.close();
				})
			}
		], (err, result) => {
			if( err ) throw err;
			if( result == 'ok'){
				res.send('1')
			}else{
				res.send('0')
			}
		})
	},
	logining ( req, res, next ) {
		const {tel, password} = req.body
		console.log(req.body)
		async.waterfall([
			( cb ) => {
				MongoClient.connect( mongoUrl, (err, db) => {
					if( err ) throw err;
					cb( null, db );
				})
			},
			( db, cb ) => {
				db.collection('users').find({tel}).toArray((err, data) => {
					if( err ) throw err;
					if(data.length == 0){//没有该用户
						cb(null, 0)
						db.close()
					}else{
						db.collection('users').find({tel, password}).toArray((err, res) => {
							if( err ) throw err;
							if(res.length == 0){
								cb(null, 2)//密码错误
								db.close()
							}else{
								cb(null, 1)//ok
								db.close()
							}
						})
					}
				})
			}
		], (err, result) => {
			if( err ) throw err;
			if( result == '0'){
				res.send('0')
			}else if(result == 1){
				res.send('1')
			}else{
				res.send('2')
			}
		})
	}
}