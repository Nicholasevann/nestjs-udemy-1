import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { fileTypes } from './enums/file-types.enum';

@Entity()
export class Upload {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: 1024,
    nullable: false,
  })
  name: string;

  @Column({
    type: 'varchar',
    length: 1024,
    nullable: false,
  })
  path: string;

  @Column({
    type: 'varchar',
    nullable: false,
    enum: fileTypes,
    default: fileTypes.IMAGE, // Default value set to 'image'
  })
  type: string;

  @Column({
    type: 'varchar',
    length: 128,
    nullable: false,
  })
  mime: string;

  @Column({
    type: 'int',
    nullable: false,
  })
  size: number;

  @CreateDateColumn()
  createDate: Date;

  @UpdateDateColumn()
  updateDate: Date;
}
