import Koa from 'koa';
import cors from 'koa2-cors';
import bodyParser from 'koa-bodyparser';
import { unprotectedRouter,protectedRouter } from './routers/index.js';

import { User,Image,People,Group } from './entity/index.js';
// import { Image } from './entity/image.js';
// import { People } from './entity/people.js';

import { JWT_SECRET } from './constant.js';
import jwt from 'koa-jwt';
import 'reflect-metadata';
import { DataSource } from 'typeorm';
// 链接数据库
var dataSource = new DataSource({
	type: 'mysql',
	host: 'localhost',
	port: 3306,
	username: 'root',
	password: '123456',
	database: 'koa',
	synchronize: false,
	entities: [User,Image,People,Group],
});
// const json = require('koa-json');
// app.use(json());
// app.use(async (ctx) => {
//   ctx.body = 'Hello World';
// });
// app.use(async (ctx, next) => {
//   ctx.set('Access-Control-Allow-Origin', '*');
//   ctx.set('Access-Control-Allow-Headers', 'Content-Type');
//   ctx.set('Access-Control-Allow-Methods', '*');
//   ctx.set('Content-Type', 'application/json;charset=utf-8');
//   await next();
// });

dataSource
	.initialize()
	.then(() => {
		const app = new Koa();
		app.use(async (ctx, next) => {
			ctx.set("Access-Control-Allow-Credentials", 'true');
  // ctx.set('Access-Control-Allow-Origin', '*');
  // ctx.set('Access-Control-Allow-Headers', 'Content-Type');
  // ctx.set('Access-Control-Allow-Methods', '*');
  // ctx.set('Content-Type', 'application/json;charset=utf-8');
  await next();
});
		app.use(cors());
		app.use(bodyParser());
		// 无JWTtoken可访问
		app.use(unprotectedRouter.routes()).use(unprotectedRouter.allowedMethods());
		app.use(jwt({ secret: JWT_SECRET }).unless({ method: 'GET' }));
		// 需要JWTtoken才可访问
		app.use(protectedRouter.routes()).use(protectedRouter.allowedMethods());
		app.listen(3002, () => {
			console.log('Server is running at http://localhost:3002');
		});
	})
	.catch((err) => console.log('TypeORM connection error:', err));
export { dataSource };
