import { ApiProperty } from "@nestjs/swagger";
import { BelongsTo, Column, DataType, ForeignKey, Model, PrimaryKey, Table } from "sequelize-typescript";
import { Obligation } from "../obligations/obligation.entity";

@Table
export class DvdTransfer extends Model<DvdTransfer> {
    @PrimaryKey
    @Column({type: DataType.INTEGER, autoIncrement: true, allowNull: false})
    @ApiProperty({type: Number, example: 0})
    id: number;
    @ForeignKey(() => Obligation)
    @Column({type: DataType.INTEGER, allowNull: false})
    @ApiProperty({type: Number, example: 0})
    obligationId: number;
    @Column({type: DataType.BIGINT, allowNull: false})
    @ApiProperty({type: BigInt, example: 0})
    nonce: bigint;
    @Column({type: DataType.STRING, allowNull: true})
    @ApiProperty({type: String, example: "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f"})
    buyer: string;
    @Column({type: DataType.STRING, allowNull: true})
    @ApiProperty({type: String, example: "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f"})
    buyerToken: string;
    @Column({type: DataType.DOUBLE, allowNull: false})
    @ApiProperty({type: Number, example: 100})
    buyerAmount: number;
    @Column({type: DataType.STRING, allowNull: false})
    @ApiProperty({type: String, example: "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f"})
    seller: string;
    @Column({type: DataType.STRING, allowNull: false})
    @ApiProperty({type: String, example: "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f"})
    sellerToken: string;
    @Column({type: DataType.DOUBLE, allowNull: false})
    @ApiProperty({type: Number, example: 100})
    sellerAmount: number;
    @Column({type: DataType.SMALLINT, allowNull: false})
    @ApiProperty({type: Number, example: 0})
    status: number;
    @Column({type: DataType.STRING, allowNull: false})
    @ApiProperty({type: String, example: "0x2B6a3EDD4B1652CB9cc5aA6f5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f"})
    transferId: string;
    @BelongsTo(() => Obligation)
    obligation: Obligation;
}
