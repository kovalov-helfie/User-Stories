import { ApiProperty } from "@nestjs/swagger";
import { BelongsTo, Column, DataType, ForeignKey, HasMany, Model, PrimaryKey, Table } from "sequelize-typescript";
import { Asset } from "../assets/asset.entity";
import { User } from "../users/user.entity";

@Table
export class UserAsset extends Model<UserAsset> {
    @PrimaryKey
    @ForeignKey(() => User)
    @Column({type: DataType.STRING, allowNull: true})
    @ApiProperty({type: String, example: "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f"})
    userAddress: string;
    @PrimaryKey
    @ForeignKey(() => Asset)
    @Column({type: DataType.STRING, allowNull: true})
    @ApiProperty({type: String, example: "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f"})
    tokenAddress: string;
    @BelongsTo(() => User)
    user: User;
    @BelongsTo(() => Asset)
    asset: Asset;
}