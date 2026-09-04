import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { OneToMany } from 'typeorm';
import { TaskAttachment } from './task-attachment.entity.js';
@Entity('tasks')
export class Task {

  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  title!: string;

  @Column({ type: 'text' })
  description!: string;

  @Column({ default: false })
  completed!: boolean;

  @Column()
  userId!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
  
  @OneToMany(
    () => TaskAttachment,
    (attachment) => attachment.task,
  )
  attachments!: TaskAttachment[];
  
}
