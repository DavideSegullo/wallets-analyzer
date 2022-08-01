import { fromBech32 } from '@cosmjs/encoding';
import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { ChainRequest } from 'src/modules/accounts/dto/chain-request.dto';
import { extractChainName } from 'src/utils';

@Injectable()
export class AddressValidatorPipe implements PipeTransform {
  transform(value: ChainRequest) {
    const chain = extractChainName(value.chain);

    if (!chain) {
      throw new BadRequestException(`No chain found with name: ${value.chain}`);
    }

    const { data, prefix } = fromBech32(value.address);

    if (prefix !== chain.bech32_prefix || data.length !== 20) {
      throw new BadRequestException(
        `Invalid chain address, ex: ${chain.bech32_prefix}1...`,
      );
    }

    return value;
  }
}
