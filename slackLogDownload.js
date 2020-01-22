// Library Load
const cheerio = require('cheerio-httpcli');
const request = require('request');
const fs = require('fs');
const unzip = require('node-unzip-2');

// 環境変数 (env)
require('dotenv').config()
const env = process.env
const SLACK_DOMAIN = env.SLACK_DOMAIN
const SLACK_EXPORT_URL = env.SLACK_EXPORT_URL
const MAIL_ADDR = env.MAIL_ADDR
const PASSWORD = env.PASSWORD


// ダウンロード先 / 解凍先
const SLACK_LOG_DOWNLOAD_PATH = "/Users/macbook-pro/Documents/100.github/Slack"
const SLACK_LOG_UNZIP_PATH= "/Users/macbook-pro/Documents/100.github/Slack"

//ログエクスポート管理画面のURL
const access = cheerio.fetch(SLACK_EXPORT_URL);

access.then(function(result){

	const login = {
		email: MAIL_ADDR,
		password: PASSWORD
	};

	result.$('form[id=signin_form]').submit(login,function(err,$,res,body){
		const log_url = $("a[href^='/services/export/download/']").first().attr("href");
		const domain = SLACK_DOMAIN;
		const address = domain + log_url;
		console.log('¥r¥nログ格納先URL⇒' + address);
		
		console.log('¥r¥nアクセス中...¥r¥n');

		//変数setcookieに入っている連想配列のkey名がcookiesである値を取得する
 		const setcookie = res.cookies;

		const j = request.jar();
		const cookie1 = request.cookie('b=' + setcookie.b);
		const cookie2 = request.cookie('d=' + setcookie.d);
		const cookie3 = request.cookie('d-s=' + setcookie['d-s']);
		const cookie4 = request.cookie('lc=' + setcookie.lc);
		const cookie5 = request.cookie('x=' + setcookie.x);
		console.log('jarの中身確認');
		console.log(j);
		const url = address;
		j.setCookie(cookie1, url);
		j.setCookie(cookie2, url);
		j.setCookie(cookie3, url);
		j.setCookie(cookie4, url);
		j.setCookie(cookie5, url);
		console.log('jarの中身セット');
		console.log(j);

		const options = {
		 	url: url,
		 	method: 'GET',
			jar: j,
			encoding: null
		};


		 request(options, function (err,res,body) {
			console.log('¥r¥nファイルダウンロードの処理開始');
			 fs.writeFileSync('test.zip', body, 'binary');
			 console.log('¥r¥nファイル解凍の処理開始');
			 fs.createReadStream(SLACK_LOG_DOWNLOAD_PATH)
			 .pipe(unzip.Extract({ path: SLACK_LOG_UNZIP_PATH }));
		 });
	});
});

access.catch(function(err){
	console.log(err);
});