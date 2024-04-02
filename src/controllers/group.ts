import { Context } from 'koa';
import { User, Image, People, Group } from '../entity/index.ts';
import { dataSource } from '../index.ts';
export default class GroupController {
	public static async listUsers(ctx: any) {
		ctx.body = 'GroupList controller';
	}

	public static async addGroup(ctx: any) {
		console.log('ctx.request.body', ctx.request.body);
		const { groupName, groupOwnerName, groupOwnerPhoneNumber, groupDec, id } = ctx.request.body;
		const user: User | null = await dataSource
			.getRepository(User)
			.createQueryBuilder('user')
			.where('user.username = :username', { username: id })
			.getOne();
		const newGroup = new Group();
		newGroup.group_Name = groupName;
		newGroup.group_owner_name = groupOwnerName;
		newGroup.group_owner_phone_number = groupOwnerPhoneNumber;
		newGroup.group_dec = groupDec;
		newGroup.user = user;
		// 保存到数据库
		const res = await dataSource.manager.save(newGroup);
		console.log('小组保存成功，小组id为', newGroup.group_id, res);
		// mock数据
		ctx.body = '上传成功';
		ctx.status = 200;
		ctx.body = `AddGroup controller with ID = ${ctx.params.id}`;
	}
	public static async deleteGroup(ctx: any) {
		const { groupId } = ctx.request.body;
		const groups = await dataSource
			.getRepository(Group)
			.createQueryBuilder('group')
			.delete()
			.from(Group)
			.where('group_id = :id', { id: groupId })
			.execute();
			ctx.body = JSON.stringify({ data: '删除成功', code: 200 })
	}

	public static async updateGroup(ctx: any) {
		console.log('ctx.request.body', ctx.request.body);
		const {
			groupName,
			groupOwnerName,
			groupOwnerPhoneNumber,
			groupDec,
			groupId,
		} = ctx.request.body;
		const groups = await dataSource
			.getRepository(Group)
			.createQueryBuilder('group')
			.update(Group)
			.set({
				group_id: groupId,
				group_Name: groupName,
				group_owner_name: groupOwnerName,
				group_owner_phone_number: groupOwnerPhoneNumber,
				group_dec: groupDec,
			})
			.where('group_id = :id', { id: groupId })
			.execute();
		ctx.body = JSON.stringify({ data: '更新成功', code: 200 });
	}

	public static async getGroupList(ctx: any) {
		const { id } = ctx.request.query;
		const user: User | null = await dataSource
			.getRepository(User)
			.createQueryBuilder('user')
			.where('user.username = :username', { username: id })
			.getOne();
		const groups = await dataSource
			.getRepository(Group)
			.createQueryBuilder('group')
			.where('group.userId = :userId', { userId: user?.id })
			.getMany();
		console.log(groups);
		ctx.body = JSON.stringify({ data: groups, code: 200 });
	}
}
