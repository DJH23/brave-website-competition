import { Controller, Get, Query } from "@nestjs/common";
import { AppService } from "./app.service";
import fetch from "node-fetch";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get("health")
  getHealth() {
    return { status: "ok", uptime: this.appService.getUptime() };
  }

  @Get("search")
  async braveSearch(@Query("q") q: string) {
    if (!q) return { results: [], error: "Missing query" };
    const apiKey = "BSAlqndA5K7avK4djFZu3H9cuq-6Qjj";
    try {
      const response = await fetch(
        `https://api.search.brave.com/res/v1/web/search?q=${encodeURIComponent(q)}`,
        {
          headers: {
            "Accept": "application/json",
            "X-Subscription-Token": apiKey
          }
        }
      );
      if (!response.ok) throw new Error("Brave Search API error");
      const data = await response.json();
      const results = (data.web?.results || []).map((r: any) => ({
        title: r.title,
        url: r.url,
        description: r.description
      }));
      return { results };
    } catch (err: any) {
      return { results: [], error: err.message || "Search failed" };
    }
  }
}
