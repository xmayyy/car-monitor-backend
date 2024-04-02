import { Context } from 'koa';
import { User, Image, People, Group } from '../entity/index.ts';
import { dataSource } from '../index.ts';

export default class PeopleController {
	public static async listUsers(ctx: Context) {
		ctx.body = 'PeopleList controller';
	}

	public static async addPeople(ctx: any) {
		console.log('ctx.request.body', ctx.request.body);
		const { name, birthdate, phone_number, sex, group_id } = ctx.request.body;
		const group: Group | null = await dataSource
			.getRepository(Group)
			.createQueryBuilder('group')
			.where('group.group_id = :group_id', { group_id: group_id })
			.getOne();
		console.log('group', group);
		const newPeople = new People();
		newPeople.name = name;
		newPeople.birthdate = birthdate;
		newPeople.phone_number = phone_number;
		newPeople.sex = sex;
		newPeople.group = group!;
		// 保存到数据库
		const res = await dataSource.manager.save(newPeople);
		console.log('图片已保存。用户ID为', newPeople, res);
		// mock数据
		ctx.body = '上传成功';
		ctx.status = 200;
		ctx.body = `Addpeople controller with ID = ${ctx.params.id}`;
	}
	public static async deletePeople(ctx: any) {
		const { people_id } = ctx.request.body;
		const peoples = await dataSource
			.getRepository(People)
			.createQueryBuilder('people')
			.delete()
			.from(People)
			.where('people_id = :id', { id: people_id })
			.execute();
			ctx.body = JSON.stringify({ data: '删除成功', code: 200 })
	}

	public static async updatePeople(ctx:any) {
		console.log('ctx.request.body', ctx.request.body);
		const { name, birthdate, phone_number, sex, group_id,people_id } = ctx.request.body;
		const people = await dataSource
			.getRepository(People)
			.createQueryBuilder('people')
			.update(People)
			.set({ name, birthdate, phone_number, sex, group_id,people_id })
			.where('people_id = :id', { id: people_id })
			.execute();
		ctx.body = JSON.stringify({ data: '更新成功', code: 200 });
	}

	public static async getPeopleList(ctx: any) {
		const { group_id } = ctx.request.query;
		const peoples = await dataSource
			.getRepository(People)
			.createQueryBuilder('people')
			.where('people.groupGroupId = :groupGroupId', { groupGroupId:group_id })
			.getMany();
		console.log(peoples);
		ctx.body = JSON.stringify({ data: peoples, code: 200 });
	}
}
