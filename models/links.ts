import 'reflect-metadata';
import { Model, DataType, Table, Column, ForeignKey, BelongsTo } from 'sequelize-typescript';
import User from './user';

@Table({
    tableName: 'user-links',
    timestamps: true
})

class UserLinks extends Model {
    @Column({
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4,
        primaryKey: true
    })
    id!: string;

    @ForeignKey(() => User)
    @Column({
      type: DataType.UUID,
      allowNull: false,
    })
    user_id!: number;

    @Column({
        type: DataType.STRING,
        allowNull: false,
        unique: false
    })
    platform!: string;

    @Column({
        type: DataType.FLOAT,
    })
    order?: number;

    @Column({
        type: DataType.STRING,
        allowNull: false,
        unique: false
    })
    url!: string;

    @BelongsTo(() => User)
    user!: User;
}

export default UserLinks