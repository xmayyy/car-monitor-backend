const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const cors = require('koa2-cors');
const app = new Koa();
const router = require('./routers/index');
// const json = require('koa-json');
app.use(cors());
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
app.use(bodyParser())
app.use(router.routes(), router.allowedMethods());
app.listen(3001, () => {
  console.log('Server is running at http://localhost:3001');
});