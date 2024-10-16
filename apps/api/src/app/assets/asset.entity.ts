import { ApiProperty } from "@nestjs/swagger";
import { BelongsTo, Column, DataType, ForeignKey, HasMany, Model, PrimaryKey, Table } from "sequelize-typescript";
import { User } from "../users/user.entity";
import { Obligation } from "../obligations/obligation.entity";

@Table
export class Asset extends Model<Asset> {
    @PrimaryKey
    @Column({type: DataType.INTEGER, autoIncrement: true, allowNull: false})
    @ApiProperty({type: Number, example: 0})
    id: number;
    @ForeignKey(() => User)
    @Column({type: DataType.STRING, allowNull: false})
    @ApiProperty({type: String, example: "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f"})
    userAddress: string;
    @ForeignKey(() => Obligation)
    @Column({type: DataType.INTEGER, allowNull: true})
    @ApiProperty({type: Number, example: 0})
    obligationId: number;
    @Column({type: DataType.STRING, allowNull: false})
    @ApiProperty({type: String, example: "Test_Asset"})
    name: string;
    @Column({type: DataType.STRING, allowNull: false})
    @ApiProperty({type: String, example: "This is a test asset"})
    description: string;
    @Column({type: DataType.STRING, allowNull: false})
    @ApiProperty({type: String, example: "RWA test asset"})
    type: string;
    @BelongsTo(() => User)
    user: User
    @BelongsTo(() => Obligation)
    obligation: Obligation
}