import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { UserExtraction } from '../ocr/ocr.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  username: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @OneToMany(() => UserExtraction, (userExtraction) => userExtraction.user)
  userExtractions: UserExtraction[];
}
