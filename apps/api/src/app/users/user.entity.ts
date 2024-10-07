import { ApiProperty } from "@nestjs/swagger";
import { BelongsTo, Column, DataType, ForeignKey, HasMany, Model, PrimaryKey, Table } from "sequelize-typescript";
import { Identity } from "../identities/identity.entity";
import { Claim } from "../claims/claim.entity";
import { Asset } from "../assets/asset.entity";

@Table
export class User extends Model<User> {
    @PrimaryKey
    @Column({type: DataType.STRING, allowNull: false})
    @ApiProperty({type: String, example: "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f"})
    userAddress: string;
    @ForeignKey(() => Identity)
    @Column({type: DataType.STRING, allowNull: true})
    @ApiProperty({type: String, example: "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f"})
    identityAddress: string;
    @Column({type: DataType.SMALLINT, allowNull: true})
    @ApiProperty({type: Number, example: 0})
    country: number;
    @Column({type: DataType.BOOLEAN, allowNull: false, defaultValue: false})
    @ApiProperty({type: Boolean, example: false})
    isVerified: boolean;
    @Column({type: DataType.BOOLEAN, allowNull: false, defaultValue: false})
    @ApiProperty({type: Boolean, example: false})
    isAdmin: boolean;
    @HasMany(() => Claim)
    claims: Claim[];
    @HasMany(() => Asset)
    assets: Asset[];
    @BelongsTo(() => Identity)
    identity: Identity  
}