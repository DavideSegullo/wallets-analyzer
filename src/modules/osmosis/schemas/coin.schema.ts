import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { Document } from 'mongoose';

export type CoinDocument = Coin & Document;

@Schema({ _id: false })
export class Coin {
  @Prop({ type: String, required: true })
  @IsString()
  @ApiProperty()
  denom: string;

  @Prop({ type: String, required: true })
  @IsString()
  @ApiProperty()
  amount: string;
}

export const CoinSchema = SchemaFactory.createForClass(Coin);
