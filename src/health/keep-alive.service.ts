import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class KeepAliveService {
  private readonly logger = new Logger(KeepAliveService.name);
  private readonly appUrl =
    process.env.RENDER_EXTERNAL_URL ||
    'https://finance-dashboard-backend-sigv.onrender.com';

  @Cron(CronExpression.EVERY_10_MINUTES)
  async handleKeepAlive() {
    try {
      const response = await fetch(`${this.appUrl}/health`);
      this.logger.log(`Keep-alive ping: ${response.status}`);
    } catch (error) {
      this.logger.warn(`Keep-alive ping failed: ${error.message}`);
    }
  }
}
