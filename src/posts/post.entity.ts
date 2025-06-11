import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PostTypeEnum, StatusEnum } from './dtos/create-post.dto';
import { MetaOption } from 'src/meta-options/meta-option.entity';

@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, nullable: false })
  title: string;

  @Column({ type: 'enum', enum: PostTypeEnum, nullable: false })
  postType: PostTypeEnum;

  @Column({ type: 'varchar', length: 255, unique: true, nullable: false })
  slug: string;

  @Column({ type: 'enum', enum: StatusEnum, nullable: false })
  status: StatusEnum;

  @Column({ type: 'text', nullable: true })
  content?: string;

  @Column({ type: 'json', nullable: true })
  schema?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  featuredImageUrl?: string;

  @Column({ type: 'timestamp', nullable: true })
  publishOn?: Date;

  @Column({ type: 'simple-array', nullable: true })
  tags?: string[];

  @OneToOne(() => MetaOption, (metaOption) => metaOption.post, {
    // automatic add update delete
    cascade: true,
    // automatic show relation data
    eager: true,
  })
  @JoinColumn()
  metaOptions?: MetaOption;
}
