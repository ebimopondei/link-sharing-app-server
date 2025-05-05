import 'reflect-metadata';
import { Model, DataType, Table, Column, Default } from 'sequelize-typescript';

export enum AccountType {
    INDIVIDUAL = 'individual',
    BUSINESS = 'business',
  }

@Table({
    tableName: 'users',
    timestamps: true
})

class User extends Model {

    @Column({
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4,
        primaryKey: true
    })
    id!: string;

    @Column({
        type: DataType.STRING,
        allowNull: true,
        unique: true
    })
    username?: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    })
    email!: string;

    @Column({
        type: DataType.STRING,
        allowNull: true
    })
    phone?: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    password_hash!: string;
    
    @Column({
        type: DataType.STRING,
        allowNull: true,
    })
    avatar_url?: string;

    

    @Column({
        type: DataType.STRING,
        allowNull: true
    })
    firstname?: string;

    @Column({
        type: DataType.STRING,
        allowNull: true
    })
    lastname?: string;

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    password!: string;

    @Column({
        type: DataType.STRING,
        allowNull: true
    })
    address?: string;

    @Column({
        type: DataType.STRING,
        allowNull: true
    })
    country?: string;

    @Column({
        type: DataType.DATEONLY,
        allowNull: true
    })
    dob?: Date;

    @Default(0)
    @Column({
        type: DataType.FLOAT,
    })
    vibe_score?: number;

    @Default('individual')
    @Column({
        type: DataType.ENUM(...Object.values(AccountType)),
        allowNull: false,
      })
      account_type?: AccountType;

    @Default(false)
    @Column({
        type: DataType.BOOLEAN,
    })
    is_verified?: boolean;

}

export default User