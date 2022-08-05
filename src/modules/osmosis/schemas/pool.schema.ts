import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { Document } from 'mongoose';
import { Coin } from './coin.schema';
import { PoolAsset } from './pool-asset.schema';
import { PoolParams } from './pool-params.schema';

export type PoolDocument = Pool & Document;

@Schema({ timestamps: true })
export class Pool {
  @Prop({ type: String, required: true })
  @IsString()
  @ApiProperty()
  name: string;

  @Prop({ type: String, required: true, index: true })
  @IsString()
  @ApiProperty({
    description: 'Pool creator address',
  })
  address: string;

  @Prop({ type: String, required: true, unique: true, index: true })
  @IsString()
  @ApiProperty({
    description: 'Pool ID on Osmosis Chain',
  })
  id: string;

  @Prop({ type: PoolParams, required: true })
  @ValidateNested({ each: true })
  @IsNotEmpty()
  @Type(() => PoolParams)
  @ApiProperty({
    type: PoolParams,
  })
  poolParams: PoolParams;

  @Prop({ type: String, required: true })
  @IsString()
  @ApiProperty()
  futurePoolGovernor: string;

  @Prop({ type: Coin, required: true })
  @ValidateNested({ each: true })
  @IsNotEmpty()
  @Type(() => Coin)
  @ApiProperty({
    type: Coin,
  })
  totalShares: Coin;

  @Prop({ type: [{ type: PoolAsset, default: [] }] })
  @IsArray()
  @ValidateNested({ each: true })
  @IsNotEmpty()
  @Type(() => PoolAsset)
  @ApiProperty({
    type: [PoolAsset],
  })
  poolAssets: PoolAsset[];

  @Prop({ type: String, required: true })
  @IsString()
  @ApiProperty()
  totalWeight: string;
}

export const PoolSchema = SchemaFactory.createForClass(Pool);
