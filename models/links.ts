import 'reflect-metadata';
import { Model, DataType, Table, Column } from 'sequelize-typescript';

@Table({
    tableName: 'links',
    timestamps: true
})

class Links extends Model {
    @Column({
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4,
        primaryKey: true
    })
    id!: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
        unique: false
    })
    platform!: string;

    @Column({
        type: DataType.TEXT,
        allowNull: false,
        unique: false
    })
    icon!: string;
}

export default Links