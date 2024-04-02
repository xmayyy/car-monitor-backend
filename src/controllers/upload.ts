import got from 'got';
import { User, Image, People, Group } from '../entity/index.ts';

import { dataSource } from '../index.ts';

const AK = '4ww9C81IMUF8unkkR44ZqqA8';
const SK = 's7GhGeALiHjgsmuKsBfWOP9AUR1SAhNS';
export default class uploadController {
	// 获取AccessToken
	public static async getAccessToken(ctx: any) {
		let access_token = '';
		try {
			const response = await got(
				'https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=' +
					AK +
					'&client_secret=' +
					SK
			);
			access_token = JSON.parse(response.body).access_token;
			// console.log('statusCode:', response.statusCode);
			// console.log('body:', response.body);
			// console.log('getAccessToken', JSON.parse(response.body).access_token);
			ctx.body = { body: response.body };
			ctx.status = 200;
		} catch (error) {
			ctx.body = '出错了';
			console.log('error:', error);
		}
		ctx.cookies.set('access_token', access_token, {
			httpOnly: false,
			maxAge: 1 * 60 * 60 * 1000,
		});
		ctx.body = { access_token };
	}
	// 上传图片至算法服务
	public static async uploadImg(ctx: any) {
		const username = ctx.cookies.get('USER_ID');
		const imageBase64 = ctx.request.body.image;
		const access_token = ctx.request.body.access_token;
		// console.log('username',username)
		const url =
			'https://aip.baidubce.com/rest/2.0/image-classify/v1/driver_behavior?access_token=' +
			access_token;
		const options = {
			methods: 'post',
			form: {
				image: imageBase64,
			},
		};

		// 真实请求算法服务
		const data: any = await got.post(url, options);
		// console.log('data',data.body)
		// ctx.body = data.body;

		// // mock数据
		// const data =  {"person_num":1,"person_info":[{"attributes":{"both_hands_leaving_wheel":{"score":0.0027262079529464,"threshold":0.75},"eyes_closed":{"score":0.52571189403534,"threshold":0.55},"no_face_mask":{"score":0.99098205566406,"threshold":0.75},"not_buckling_up":{"score":0.35487979650497,"threshold":0.44},"smoke":{"score":0.0050711673684418,"threshold":0.48},"not_facing_front":{"score":0.38045233488083,"threshold":0.5},"cellphone":{"score":0.0021178498864174,"threshold":0.69},"yawning":{"score":0.94005098938942,"threshold":0.5},"head_lowered":{"score":0.089937459677458,"threshold":0.55}},"location":{"score":0.97623002529144,"top":8,"left":0,"width":397,"height":230}}],"driver_num":1,"log_id":1751885228515024257}
		console.log('dataaaaaa', data);

		const newImage = new Image();
		newImage.username = username;
		newImage.image64 = imageBase64;
		newImage.person_info = JSON.stringify(JSON.parse(data.body).person_info);
		newImage.driver_num = JSON.parse(data.body).driver_num;
		newImage.log_id = JSON.parse(data.body).log_id;
		newImage.person_num = JSON.parse(data.body).person_num;
		// 保存到数据库
		const res = await dataSource.manager.save(newImage);
		console.log('图片已保存。用户ID为', newImage.id, res);
		// mock数据
		ctx.body = '上传成功';
		ctx.status = 200;
	}
	// 获取分析记录
	public static async getList(ctx: any) {
		const username = ctx.cookies.get('USER_ID');
		const imageList = await dataSource
			.getRepository(Image)
			.createQueryBuilder('image')
			.where('image.username = :username', { username })
			.getMany();
		// console.log('imageList',imageList)
		if (imageList) {
			// console.log('imageList',imageList)
			ctx.body = imageList;
			ctx.status = 200;
		} else {
			ctx.body = '获取资源失败';
		}
	}
	// 删除选定记录
	public static async deleteOneId(ctx: any) {
		const username = ctx.cookies.get('USER_ID');
		const log_id = ctx.request.body.log_id;
		console.log(username, log_id);
		const imageList = await dataSource
			.getRepository(Image)
			.createQueryBuilder('image')
			.delete()
			.where('image.username = :username', { username })
			.andWhere('image.log_id = :log_id', { log_id })
			.execute();
		console.log('imageList', JSON.stringify(imageList));
		ctx.body = '删除成功';
	}
}

/**
 * 使用 AK，SK 生成鉴权签名（Access Token）
 * @return string 鉴权签名信息（Access Token）
 */
// function getAccessToken() {
// 	let options = {
// 		method: 'POST',
// 		url:
// 			'https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=' +
// 			AK +
// 			'&client_secret=' +
// 			SK,
// 	};
// 	// return new Promise((resolve, reject) => {
// 	// 	request(options, (error, response) => {
// 	// 		if (error) {
// 	// 			reject(error);
// 	// 		} else {
// 	// 			resolve(JSON.parse(response.body).access_token);
// 	// 		}
// 	// 	});
// 	// });
// }
