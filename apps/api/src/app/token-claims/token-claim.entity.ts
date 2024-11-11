import { ApiProperty } from "@nestjs/swagger";
import { BelongsTo, Column, DataType, ForeignKey, Model, PrimaryKey, Table } from "sequelize-typescript";
import { Asset } from "../assets/asset.entity";

@Table
export class TokenClaim extends Model<TokenClaim> {
    @PrimaryKey
    @Column({type: DataType.STRING, allowNull: false})
    @ApiProperty({type: String, example: "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f-1"})
    claimTokenKey: string;
    @ForeignKey(() => Asset)
    @Column({type: DataType.STRING, allowNull: false})
    @ApiProperty({type: String, example: "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f"})
    tokenAddress: string;
    @Column({type: DataType.BIGINT, allowNull: false})
    @ApiProperty({type: BigInt, example: 1})
    claimTopic: number;
    @Column({type: DataType.STRING, allowNull: false})
    @ApiProperty({type: String, example: "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f-1.png"})
    docGen: string;
    @Column({type: DataType.STRING, allowNull: false})
    @ApiProperty({type: String, example: "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f5C69bEe701ef814a2B6a3EDD"})
    data: string;
    @Column({type: DataType.BOOLEAN, allowNull: false, defaultValue: false})
    @ApiProperty({type: Boolean, example: false})
    isClaimVerified: boolean;
    @BelongsTo(() => Asset)
    asset: Asset;
}