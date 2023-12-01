const path = require('path');
const fs = require('fs');
const Router = require('koa-router');
const coBody = require('co-body');
// const json = require('koa-json');
const got = require('got');
const router = new Router();

// 存储性能数据
let performanceList = [];
// 存储错误数据
let errorList = [];
// 存储录屏数据
let recordScreenList = [];
// 存储白屏检测数据
let whiteScreenList = [];

router.prefix('/api');
router.get('/getErrorList', async (ctx) => {
	ctx.body = { code: 200, data: errorList };
});
router.get('/getRecordScreenId', async (ctx) => {
	const id = ctx.query.id
	const res = recordScreenList.filter(x=>x.recordScreenId === id)
	ctx.body = { code: 200, data: res };
});
router.post('/reportData', async (ctx, next) => {
	try {
		if(ctx.request.body.type === 'recordScreen'){
			recordScreenList.push(ctx.request.body);
		}
		const params = await coBody.json(ctx.req);
		console.log('params.type', params.type);
		ctx.set('Content-Type', 'application/json');
		if (!params) return;
		if (params.type == 'performance') {
			performanceList.push(params);
		} else if (params.type == 'recordScreen') {
			recordScreenList.push(params);
			console.log('recordScreenList',recordScreenList)
		} else if (params.type == 'whiteScreen') {
			whiteScreenList.push(params);
		} else {
			errorList.push(params);
		}
		ctx.body = 'report success';
	} catch (e) {
		ctx.body = 'server "port reportData" error';
	}
});

// 获取js.map源码文件
router.get('/getmap', async (ctx, next) => {
	let fileName = ctx.query.fileName;
	let env = ctx.query.env;
	console.log('fileName', fileName);
	console.log('env', env);
	if (env == 'development') {
		let mapFile = path.join('http://localhost:8081/js', fileName);
		console.log('mapFile', mapFile);
		let res = null;
		const requestPromise = new Promise((resolve, reject) => {
			// 需要封装成 Promise，等待执行完返回请求。回调中无法 ctx.body 返回响应
			try {
				got.get(mapFile).then((res) => {
					console.log(res.body);
					resolve(res.body);
				});
				// fs.readFile(mapFile,'utf8', function (err, data) {
				// 	if (err) {
				// 		console.error(err);
				// 		return;
				// 	}
				// 	console.log('data', data);
				// 	resolve(data);
				// });
			} catch (e) {
				console.log(e);
			}
		});
		const result = await requestPromise;
		// 最后接口返回数据
		ctx.body = {
			code: 0,
			msg: result,
		};
	} else {
		// req.query 获取接口参数
		let mapFile = path.join(__filename, '..', 'dist/js');
		// 拿到dist目录下对应map文件的路径
		let mapPath = path.join(mapFile, `${fileName}.map`);
		fs.readFile(mapPath, function (err, data) {
			if (err) {
				console.error(err);
				return;
			}
			res.send(data);
		});
	}
});


module.exports = router;
