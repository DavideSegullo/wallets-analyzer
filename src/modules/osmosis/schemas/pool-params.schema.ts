import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { Document } from 'mongoose';

export type PoolParamsDocument = PoolParams & Document;

@Schema({ _id: false })
export class PoolParams {
  @Prop({ type: String, required: true })
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  swapFee: string;

  @Prop({ type: String, required: true })
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  exitFee: string;

  @Prop({ type: String, required: true })
  @IsString()
  @ApiProperty()
  smoothWeightChangeParams: string | null;
}

export const PoolParamsSchema = SchemaFactory.createForClass(PoolParams);
