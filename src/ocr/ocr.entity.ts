import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../user/user.entity';

@Entity({ name: 'user_extractions' }) // Rename the table
export class UserExtraction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  originalExtraction: string;

  @Column({ nullable: true })
  improvedExtraction: string;

  @Column({ nullable: true })
  translatedText: string;

  @Column({ nullable: true })
  summarizedText: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.userExtractions)
  @JoinColumn({ name: 'id_user' })
  user: User;

  @Column({ name: 'id_user' })
  idUser: string;
}
