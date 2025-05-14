import 'reflect-metadata';
import { Model, DataType, Table, Column, ForeignKey, BelongsTo } from 'sequelize-typescript';
import User from './user';
import Links from './links';

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
    
    @BelongsTo(() => User)
    user!: User;

    @ForeignKey( () => Links)
    @Column({
        type: DataType.UUID,
        allowNull: false,
        unique: false
    })
    platform_id!: string;

    @BelongsTo(() => Links)
    links!: Links;

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

}

export default UserLinks