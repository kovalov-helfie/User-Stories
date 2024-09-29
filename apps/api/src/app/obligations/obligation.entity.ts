import { ApiProperty } from "@nestjs/swagger";
import { BelongsTo, Column, DataType, ForeignKey, Model, PrimaryKey, Table } from "sequelize-typescript";
import { Asset } from "../assets/asset.entity";

@Table
export class Obligation extends Model<Obligation> {
    @PrimaryKey
    @Column({type: DataType.INTEGER, autoIncrement: true, allowNull: false})
    @ApiProperty({type: Number, example: 0})
    id: number;
    @ForeignKey(() => Asset)
    @Column({type: DataType.INTEGER, allowNull: true})
    @ApiProperty({type: Number, example: 0})
    assetId: number;
    @Column({type: DataType.STRING, allowNull: false})
    @ApiProperty({type: String, example: "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f"})
    userAddress: string;
    @Column({type: DataType.INTEGER, allowNull: false})
    @ApiProperty({type: Number, example: 100})
    minPurchaseAmount: number;
    @Column({type: DataType.INTEGER, allowNull: false})
    @ApiProperty({type: Number, example: 100})
    lockupPeriod: number;
    @Column({type: DataType.STRING, allowNull: false})
    @ApiProperty({type: String, example: "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f"})
    transferRestrictionAddress: string;
    @Column({type: DataType.BOOLEAN, allowNull: false})
    @ApiProperty({type: Boolean, example: false})
    isExecuted: boolean;
}
