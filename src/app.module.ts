import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BanksModule } from './banks/banks.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { google } from 'googleapis';
import configuration from 'config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
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
    BanksModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
