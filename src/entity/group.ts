import {
	Entity,
	Column,
	PrimaryGeneratedColumn,
	ManyToOne,
	OneToMany,
} from 'typeorm';
import { User } from './user.ts';
import { People } from './people.ts';
@Entity()
export class Group {
	@PrimaryGeneratedColumn()
	group_id: number;

	@Column()
	group_Name: string;

	@Column()
	group_owner_name: string;

	@Column()
	group_owner_phone_number: string;

	@Column()
	groupDec: string;

	// 班级属于一个用户
	@ManyToOne(() => User, (user) => user.groups)
	user: User;

	// 外键列，通过关系自动生成
	@Column({ nullable: false })
	id: number;

	// 一个班级可以有多个学生
	@OneToMany(() => People, (people) => people.group_id)
	peoples: People[];
}
