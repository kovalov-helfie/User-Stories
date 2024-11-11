import { ApiProperty } from "@nestjs/swagger";
import { BelongsTo, Column, DataType, ForeignKey, Model, PrimaryKey, Table } from "sequelize-typescript";
import { User } from "../users/user.entity";

@Table
export class Claim extends Model<Claim> {
    @PrimaryKey
    @Column({type: DataType.STRING, allowNull: false})
    @ApiProperty({type: String, example: "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f-1"})
    claimUserKey: string;
    @ForeignKey(() => User)
    @Column({type: DataType.STRING, allowNull: false})
    @ApiProperty({type: String, example: "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f"})
    userAddress: string;
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
    @BelongsTo(() => User)
    user: User;
}