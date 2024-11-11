import { ApiProperty } from "@nestjs/swagger";
import { BelongsTo, Column, DataType, ForeignKey, Model, PrimaryKey, Table } from "sequelize-typescript";
import { Asset } from "../assets/asset.entity";
import { ExecuteStatus } from "../types";

@Table
export class TokenComplianceRequest extends Model<TokenComplianceRequest> {
    @PrimaryKey
    @Column({type: DataType.INTEGER, autoIncrement: true, allowNull: false})
    @ApiProperty({type: Number, example: 0})
    id: number;
    @ForeignKey(() => Asset)
    @Column({type: DataType.STRING, allowNull: false})
    @ApiProperty({type: String, example: "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f"})
    tokenAddress: string;
    @Column({type: DataType.INTEGER, allowNull: false})
    @ApiProperty({type: Number, example: 100})
    maxTransferAmount: number;
    @Column({type: DataType.STRING, allowNull: false})
    @ApiProperty({type: String, example: "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f"})
    userAddress: string;
    @Column({type: DataType.SMALLINT, allowNull: false, defaultValue: 0})
    @ApiProperty({type: Number, example: 0})
    status: number;
    @BelongsTo(() => Asset)
    asset: Asset; 
}