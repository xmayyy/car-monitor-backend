import { Entity, Column, PrimaryGeneratedColumn,ManyToOne } from 'typeorm';
import { Group } from './group.ts';
// 前向声明 Group 类，仅用于类型  

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

	// 外键列，通过关系自动生成  
	@Column({ nullable: false })  
	group_id: number;  
	
}
