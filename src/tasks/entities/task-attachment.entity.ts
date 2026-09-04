import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import type { Task } from './task.entity.js';

@Entity('task_attachments')
export class TaskAttachment {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  fileName!: string;

  @Column()
  originalName!: string;

  @Column()
  mimeType!: string;

  @Column()
  size!: number;

  @Column()
  taskId!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @ManyToOne(
    'Task',
    'attachments',
    {
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn({
    name: 'taskId',
  })
  task!: Task;
}