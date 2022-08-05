import { Module } from '@nestjs/common';
import { BanksModule } from './modules/banks/banks.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { google } from 'googleapis';
import { OsmosisModule } from './modules/osmosis/osmosis.module';
import { CosmosModule } from './modules/cosmos/cosmos.module';
import { ChainsModule } from './modules/chains/chains.module';
import { AccountsModule } from './modules/accounts/accounts.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { SnapshotsModule } from './modules/snapshots/snapshots.module';
import configuration from 'src/config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    MongooseModule.forRootAsync({
      useFactory(config: ConfigService) {
        const mongoConfig = config.get('mongo');

        return {
          uri: mongoConfig.uri,
          dbName: mongoConfig.dbName,
          user: mongoConfig.user,
          pass: mongoConfig.pass,
        };
      },
      inject: [ConfigService],
    }),
    MailerModule.forRootAsync({
      async useFactory(config: ConfigService) {
        const OAuth2Client = new google.auth.OAuth2(
          config.get('email').clientId,
          config.get('email').clientSecret,
        );

        OAuth2Client.setCredentials({
          refresh_token: config.get('email').refreshToken,
        });

        const accessToken = await OAuth2Client.getAccessToken();

        return {
          transport: {
            host: 'smtp.gmail.com',
            port: 465,
            secure: true, // true for 465, false for other ports
            auth: {
              type: 'OAuth2',
              user: config.get('email').user,
              clientId: config.get('email').clientId,
              clientSecret: config.get('email').clientSecret,
              refreshToken: config.get('email').refreshToken,
              accessToken: accessToken.token,
            },
          },
          defaults: {
            from: `"wallets-analyzer" <${config.get('email').user}>`,
          },
        };
      },
      inject: [ConfigService],
    }),
    ScheduleModule.forRoot(),
    BanksModule,
    OsmosisModule,
    CosmosModule,
    ChainsModule,
    AccountsModule,
    SnapshotsModule,
  ],
})
export class AppModule {}
