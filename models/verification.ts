import 'reflect-metadata';
import { Model, DataType, Table, Column } from 'sequelize-typescript';

@Table({
    tableName: 'verification',
    timestamps: true
})

class Verification extends Model {
    @Column({
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4,
        primaryKey: true
    })
    id!: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
        unique: true
    })
    token!: string;
}

export default Verification