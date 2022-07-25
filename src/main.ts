import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BanksModule } from './banks/banks.module';
import { BanksService } from './banks/banks.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const banksService = app
    .select(BanksModule)
    .get(BanksService, { strict: true });

  await banksService.connect('https://rpc-bitsong.itastakers.com');
  const balances = await banksService.getBalances('bitsong1...').toPromise();
  banksService.disconnect();

  console.log(balances);

  await app.close();
}

bootstrap();
