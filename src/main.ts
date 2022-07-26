import { MailerService } from '@nestjs-modules/mailer';
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
  const mailerService = app.get(MailerService);

  const banksService = app
    .select(BanksModule)
    .get(BanksService, { strict: true });

  const chainsConfig = configService.get<{ [key: string]: string[] }>('chains');
  const chainsWithInfo: { [key: string]: unknown } = {};

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

      chainsWithInfo[chainName] = balances;

      banksService.disconnect();
    }
  }

  const attachmentString = JSON.stringify(chainsWithInfo);
  const attachment = Buffer.from(attachmentString, 'utf-8');

  await mailerService.sendMail({
    to: configService.get('email').to, // list of receivers
    from: configService.get('email').user, // sender address
    subject: 'Report Wallets Analyzer', // Subject line
    text: 'Report', // plaintext body
    attachments: [
      {
        filename: 'report.json',
        content: attachment,
      },
    ],
  });

  await app.close();
}

bootstrap();
