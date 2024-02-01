import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Image {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	username: string;

	@Column()
	image64: string;

  @Column()
  person_num:number;

  @Column()  
  person_info: string; // 你可以使用其他类型，比如JSON类型，来存储属性对象  
  
  @Column()
  driver_num:number;

  @Column()  
  log_id: number;
}