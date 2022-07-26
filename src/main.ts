import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { chains } from 'chain-registry';
import { lastValueFrom } from 'rxjs';
import { AppModule } from './app.module';
import { BanksModule } from './banks/banks.module';
import { BanksService } from './banks/banks.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const configService = app.get(ConfigService);

  const banksService = app
    .select(BanksModule)
    .get(BanksService, { strict: true });

  const chainsConfig = configService.get<{ [key: string]: string[] }>('chains');

  for (const [chainName, addresses] of Object.entries(chainsConfig)) {
    const chainInfo = chains.find(
      (chain) =>
        chain.chain_name === chainName && chain.network_type === 'mainnet',
    );

    if (chainInfo) {
      const rpc = chainInfo.apis.rpc[0];

      await banksService.connect(rpc.address);

      const balances = await lastValueFrom(
        banksService.getAddressesInfo(addresses),
      );

      console.log(JSON.stringify(balances));

      banksService.disconnect();
    }
  }

  await app.close();
}

bootstrap();
