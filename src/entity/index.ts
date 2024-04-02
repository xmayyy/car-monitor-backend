import {
	Entity,
	Column,
	PrimaryGeneratedColumn,
	OneToMany,
	ManyToOne,
} from 'typeorm';

@Entity()
export class User {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	username: string;

	@Column({ select: false })
	password: string;

	// 一个用户可以管理有多个组
	@OneToMany(() => Group, (groupEntity) => groupEntity.user)
	groups: Group[];
}

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
	group_dec: string;

	// 班级属于一个用户
	@ManyToOne(() => User, (user) => user.groups)
	user: User | null;

	// 外键列，通过关系自动生成
	@Column({ nullable: false })
	id: number;

	// 一个班级可以有多个学生
	@OneToMany(() => People, (people) => people.group_id)
	peoples: People[];
}
@Entity()
export class People {
	@PrimaryGeneratedColumn()
	people_id: number;

	@Column()
	phone_number: string;

	@Column()
	sex: string;

	@Column()
	name: string;

	@Column()
	birthdate: string;

	// 人员属于一个小组
	@ManyToOne(() => Group, (group) => group.peoples)
	group: Group;

	// 外键列，通过关系自动生成
	@Column({ nullable: false })
	group_id: number;
}

@Entity()
export class Image {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	username: string;

	@Column()
	image64: string;

	@Column()
	person_num: number;

	@Column()
	person_info: string; // 你可以使用其他类型，比如JSON类型，来存储属性对象

	@Column()
	driver_num: number;

	@Column()
	log_id: number;
}
