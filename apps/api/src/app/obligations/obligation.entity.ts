import { ApiProperty } from "@nestjs/swagger";
import { BelongsTo, Column, DataType, ForeignKey, HasMany, Model, PrimaryKey, Table } from "sequelize-typescript";
import { Asset } from "../assets/asset.entity";
import { DvdTransfer } from "../dvd-transfers/dvd-transfer.entity";
import { User } from "../users/user.entity";

@Table
export class Obligation extends Model<Obligation> {
    @PrimaryKey
    @Column({type: DataType.INTEGER, autoIncrement: true, allowNull: false})
    @ApiProperty({type: Number, example: 0})
    obligationId: number;
    @ForeignKey(() => Asset)
    @Column({type: DataType.STRING, allowNull: true})
    @ApiProperty({type: String, example: "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f"})
    tokenAddress: string;
    @ForeignKey(() => User)
    @Column({type: DataType.STRING, allowNull: false})
    @ApiProperty({type: String, example: "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f"})
    seller: string;
    @Column({type: DataType.STRING, allowNull: true})
    @ApiProperty({type: String, example: "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f"})
    buyer: string;
    @Column({type: DataType.INTEGER, allowNull: false})
    @ApiProperty({type: Number, example: 100})
    amount: number;
    @Column({type: DataType.SMALLINT, allowNull: false})
    @ApiProperty({type: Number, example: 2})
    txCount: number;
    @Column({type: DataType.BOOLEAN, allowNull: false})
    @ApiProperty({type: Boolean, example: false})
    isExecuted: boolean;
    @BelongsTo(() => Asset, { onDelete: 'CASCADE' })
    asset: Asset;
    @BelongsTo(() => User, { onDelete: 'CASCADE' })
    user: User;
    @HasMany(() => DvdTransfer)
    dvdTransfers: DvdTransfer[];
}
