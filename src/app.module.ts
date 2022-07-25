import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BanksModule } from './banks/banks.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { createTransport } from 'nodemailer';
import { google } from 'googleapis';
import configuration from 'config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    /* MailerModule.forRootAsync({
      async useFactory(config: ConfigService) {
        const OAuth2Client = new google.auth.OAuth2(
          config.get('email').clientId,
          config.get('email').clientSecret,
        );

        OAuth2Client.setCredentials({
          refresh_token: 'refresh token from oauth playground goes here',
        });

        const accessToken = await OAuth2Client.getAccessToken();

        const transport = createTransport({
          service: 'gmail',
          auth: {
            type: 'OAuth2',
            user: config.get('email').user, //your gmail account you used to set the project up in google cloud console"
            clientId: config.get('email').clientId,
            clientSecret: config.get('email').clientSecret,
            refreshToken: 'Refresh Token Here',
            accessToken,
          },
        });

        return {
          transport,
          defaults: {
            from: `"wallets-analyzer" <${config.get('email').user}>`,
          },
        };
      },
      inject: [ConfigService],
    }), */
    BanksModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
