import * as argon2 from 'argon2';
import { User } from '../entity/user.ts';
import {dataSource} from '../index.ts'
export default class AuthController {
	public static async login(ctx: any) {
		ctx.body = 'Login controller';
	}

	public static async register(ctx: any) {
    console.log(ctx.request.body);
		const newUser = new User();
		newUser.username = ctx.request.body.username;
		newUser.password = await argon2.hash(ctx.request.body.password);
		// 保存到数据库
		const res  = await dataSource.manager.save(newUser)
    console.log("用户已保存。用户ID为", newUser.id,res)
		// const user = await userRepository.save(newUser);
		ctx.status = 201;
		ctx.body = 'Register controller';
	}
}
