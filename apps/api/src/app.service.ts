import { Injectable } from "@nestjs/common";

@Injectable()
export class AppService {
  private readonly startedAt = Date.now();

  getUptime() {
    return Math.round((Date.now() - this.startedAt) / 1000);
  }
}
