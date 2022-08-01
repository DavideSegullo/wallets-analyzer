import { Controller, Get, Param, UsePipes } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BankService } from 'src/modules/cosmos/bank/bank.service';
import { LockupService } from 'src/modules/osmosis/lockup/lockup.service';
import { PoolsService } from 'src/modules/osmosis/pools/pools.service';
import { AddressValidatorPipe } from 'src/validators/address-validator.pipe';
import { ChainRequest } from './dto/chain-request.dto';

@ApiTags('Accounts')
@Controller('accounts')
export class AccountsController {
  constructor(
    private bankService: BankService,
    private lockupService: LockupService,
  ) {}

  @Get('balances/:chain/:address')
  @UsePipes(new AddressValidatorPipe())
  balances(@Param() params: ChainRequest) {
    return this.bankService.getBalances(params.address);
  }

  @Get('locked-coins/:chain/:address')
  lockedCoins(@Param() params: ChainRequest) {
    return this.lockupService.lockedCoins(params.address);
  }
}
