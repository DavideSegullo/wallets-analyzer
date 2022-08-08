import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { Document } from 'mongoose';
import { PoolParams } from './pool-params.schema';

export type PoolMetaDocument = PoolMeta & Document;

@Schema({ _id: false })
export class PoolMeta {
  @Prop({ type: String, required: true, index: true })
  @IsString()
  @ApiProperty({
    description: 'Pool creator address',
  })
  address: string;

  @Prop({ type: String, required: true, index: true })
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

  @Prop({ type: String })
  @IsString()
  @ApiProperty()
  futurePoolGovernor: string;
}

export const PoolMetaSchema = SchemaFactory.createForClass(PoolMeta);
