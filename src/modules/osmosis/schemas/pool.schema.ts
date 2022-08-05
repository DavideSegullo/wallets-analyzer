import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { Document } from 'mongoose';
import { Coin } from './coin.schema';
import { PoolAsset, PoolAssetSchema } from './pool-asset.schema';
import { PoolMeta } from './pool-meta.schema';
import { PoolParams } from './pool-params.schema';

export type PoolDocument = Pool & Document;

@Schema({
  timestamps: true,
  timeseries: {
    timeField: 'createdAt',
    metaField: 'poolMeta',
    granularity: 'hours',
  },
})
export class Pool {
  @Prop({ type: PoolMeta, required: true })
  @ValidateNested({ each: true })
  @IsNotEmpty()
  @Type(() => PoolMeta)
  @ApiProperty({
    type: PoolMeta,
  })
  poolMeta: PoolMeta;

  @Prop({ type: Coin, required: true })
  @ValidateNested({ each: true })
  @IsNotEmpty()
  @Type(() => Coin)
  @ApiProperty({
    type: Coin,
  })
  totalShares: Coin;

  @Prop({ type: [PoolAssetSchema], default: [] })
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
