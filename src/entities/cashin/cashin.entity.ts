import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
  name: 'cashin',
})
export class Cashin {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  sia: string;

  @Column('text')
  fullName: string;

  @Column('text')
  nationalId: string;

  @Column('text')
  amount: string;

  @Column('json')
  data: JSON;

  @Column('json')
  paymentCredit: JSON;

  @Column('json')
  networkAccess: JSON;

  @Column('json')
  systemService: JSON;

  @Column('json')
  accountService: JSON;

  @Column('json')
  cardTransactionRecord: JSON;

  @Column('json')
  payment: JSON;

  @Column('text')
  type: string;

  @Column('json')
  request?: JSON;

  @Column('json')
  response: JSON;

  @Column('json')
  error?: JSON;

  @Column('json')
  responseHeypay?: JSON;

  @Column('text')
  status: string;

  @Column('text')
  codeAuthorization: string;

  createdAt?: Date;

  @Column('date')
  updatedAt?: Date;
}
