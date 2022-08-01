import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BankService } from 'src/modules/cosmos/bank/bank.service';
import { ChainRequest } from './dto/chain-request.dto';

@ApiTags('Accounts')
@Controller('accounts')
export class AccountsController {
  constructor(private bankService: BankService) {}

  @Get('balances/:chain/:address')
  balances(@Param() params: ChainRequest) {
    return this.bankService.getBalances(params.address);
  }
}
