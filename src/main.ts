import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { chains, assets } from 'chain-registry';
import { lastValueFrom } from 'rxjs';
import { AppModule } from './app.module';
import { BanksModule } from './banks/banks.module';
import { BanksService } from './banks/banks.service';
import { AddressesInfo, AddressInfo, ChainMap } from './types';
import { toViewDenom } from './utils';

async function bootstrap() {
  try {
    const app = await NestFactory.createApplicationContext(AppModule);

    const configService = app.get(ConfigService);
    const mailerService = app.get(MailerService);

    const banksService = app
      .select(BanksModule)
      .get(BanksService, { strict: true });

    const chainsConfig = configService.get<ChainMap>('chains');
    const chainsWithInfo: AddressesInfo = {};

    for (const [chainName, mapAddresses] of Object.entries(chainsConfig)) {
      const chainInfo = chains.find(
        (chain) =>
          chain.chain_name === chainName && chain.network_type === 'mainnet',
      );

      const assetsList = assets.find((asset) => asset.chain_name === chainName);

      if (chainInfo && assetsList) {
        const rpc = chainInfo.apis.rpc.map((el) => el.address);
        const rest = chainInfo.apis.rest[0];

        await banksService.connect(rpc, rest.address);

        const addressesInfo: AddressInfo[] = await lastValueFrom(
          banksService.getAddressesInfo(mapAddresses.addresses),
        );

        const validatorAddressesInfo = await lastValueFrom(
          banksService.getValidatorAddressesInfo(
            mapAddresses.validatorAddresses,
          ),
        );

        if (!chains[chainName]) {
          chainsWithInfo[chainName] = {
            addresses: [],
            validatorAddresses: [],
          };
        }

        chainsWithInfo[chainName].addresses = addressesInfo.map((info) => ({
          ...info,
          balances: info.balances.map((balance) =>
            toViewDenom(balance, assetsList.assets),
          ),
          gammBalances: info.gammBalances.map((gammBalance) => ({
            ...gammBalance,
            userLockedCoins: gammBalance.userLockedCoins.map((coin) =>
              toViewDenom(coin, assetsList.assets),
            ),
          })),
          staked: !info.staked
            ? null
            : toViewDenom(info.staked, assetsList.assets),
          stakingRewards: {
            rewards: info.stakingRewards.rewards.map((reward) => ({
              validatorAddress: reward.validatorAddress,
              reward: reward.reward.map((totalReward) =>
                toViewDenom(totalReward, assetsList.assets, 18),
              ),
            })),
            total: info.stakingRewards.total.map((totalReward) =>
              toViewDenom(totalReward, assetsList.assets, 18),
            ),
          },
          lockedCoins: info.lockedCoins.map((lockedCoin) => ({
            ...lockedCoin,
            userLockedCoins: lockedCoin.userLockedCoins.map((coin) =>
              toViewDenom(coin, assetsList.assets),
            ),
          })),
        }));

        chainsWithInfo[chainName].validatorAddresses =
          validatorAddressesInfo.map((validatorInfo) => ({
            address: validatorInfo.address,
            commissions: validatorInfo.commissions.map((commission) =>
              toViewDenom(commission, assetsList.assets, 18),
            ),
          }));

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
  } catch (error) {
    console.error(error);
  }
}

bootstrap();
