import * as argon2 from 'argon2';
import { User } from '../entity/user.ts';
import { dataSource } from '../index.ts';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../constant.ts';
export default class AuthController {
	public static async login(ctx: any) {
		console.log(ctx.request.body.username);
		const user = await dataSource
			.getRepository(User)
			.createQueryBuilder()
			.where({ username: ctx.request.body.username })
			.addSelect('User.password')
			.getOne();
		console.log('user', user);
		if (!user) {
			ctx.status = 200;
			ctx.body = { message: '用户名不存在' };
		} else if (await argon2.verify(user.password, ctx.request.body.password)) {
			console.log(' user.username', user.username)
			ctx.status = 200;
			ctx.cookies.set('USER_ID', user.username, {
				httpOnly: false,
				maxAge: 1 * 60 * 60 * 1000,
			});
			ctx.cookies.set('JWT', jwt.sign({ id: user.id }, JWT_SECRET), {
				httpOnly: false,
				maxAge: 1 * 60 * 60 * 1000,
			});
			ctx.body = { token: jwt.sign({ id: user.id }, JWT_SECRET) };
		} else {
			ctx.status = 200;
			ctx.body = { message: '密码错误' };
		}
	}

	public static async register(ctx: any) {
		console.log(ctx.request.body);
		const newUser = new User();
		newUser.username = ctx.request.body.username;
		newUser.password = await argon2.hash(ctx.request.body.password);
		// 保存到数据库
		const res = await dataSource.manager.save(newUser);
		console.log('用户已保存。用户ID为', newUser.id, res);
		// const user = await userRepository.save(newUser);
		ctx.status = 201;
		ctx.body = 'Register controller';
	}

	public static async checkLogin(ctx: any) {
		console.log('checkLogin');
		console.log(ctx.request.params);
		const clientToken = ctx.cookies.get('JWT');
		// 如果有token
		if (clientToken) {
			jwt.verify(clientToken, JWT_SECRET, (err: any, decoded: any) => {
				if (err) {
					ctx.body = {
						success: false,
						info: 'token无效',
					};
				} else {
					console.log('token验证正确',decoded);
					ctx.body = {
						success: true,
						info: '登录成功',
					};
				}
				return;
			});
		}
		// 即没有cookie也没有token的情况
		if (!ctx.cookies.get('USER_ID') && !ctx.cookies.get('JWT')) {
			ctx.body = {
				success: false,
				info: '请登录',
			};
			return;
		}
	}
}
