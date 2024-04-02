import { Entity, Column, PrimaryGeneratedColumn,OneToMany  } from 'typeorm';
import { Group } from './group.ts';
@Entity()
export class User {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	username: string;

	@Column({ select: false })
	password: string;

	// 一个用户可以管理有多个组
	@OneToMany(() => Group, (groupEntity) => groupEntity.id)  
	groups: JSON; 
}
