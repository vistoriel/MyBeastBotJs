import { Column, Model, Table, DataType } from 'sequelize-typescript';

@Table({
  modelName: 'session',
})
export class SessionModel extends Model {
  @Column({
    type: DataType.INTEGER,
    defaultValue: null,
  })
  userId: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  chatId: number;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
  })
  isUser: boolean;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  value: string;
}
