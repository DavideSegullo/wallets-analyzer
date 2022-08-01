import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ChainRequest {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description:
      'Chain name from Chain Registry: https://github.com/cosmos/chain-registry',
    type: String,
  })
  chain: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Chain address',
    type: String,
  })
  address: string;
}
