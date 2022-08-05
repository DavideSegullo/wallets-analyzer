import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { Document } from 'mongoose';
import { Coin, CoinSchema } from './coin.schema';

export type PoolAssetDocument = PoolAsset & Document;

@Schema({ _id: false })
export class PoolAsset {
  @Prop({ type: CoinSchema, required: true })
  @ValidateNested({ each: true })
  @IsNotEmpty()
  @Type(() => Coin)
  @ApiProperty({
    type: Coin,
  })
  token: Coin;

  @Prop({ type: String, required: true })
  @IsString()
  @ApiProperty()
  weight: string;
}

export const PoolAssetSchema = SchemaFactory.createForClass(PoolAsset);
