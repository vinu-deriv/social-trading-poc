import yahooFinance from "yahoo-finance2";

interface NewsItem {
  title: string;
  summary: string;
  url: string;
  publishedAt: string;
}

interface TrendingAsset {
  symbol: string;
  name: string;
  imageUrl: string;
  currentPrice: number;
  changePercentage: number;
  direction: "up" | "down";
}

export class MarketService {
  private readonly DEFAULT_IMAGE =
    "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400";

  private async getTrendingSymbols(): Promise<string[]> {
    try {
      const queryOptions = { count: 5, lang: "en-US" };
      const result = await yahooFinance.trendingSymbols("US", queryOptions);
      return result.quotes.map((quote) => quote.symbol);
    } catch (error) {
      console.error("Error getting trending symbols:", error);
      throw error;
    }
  }

  private async getCompanyLogo(symbol: string): Promise<string> {
    try {
      const quote = await yahooFinance.quoteSummary(symbol, {
        modules: ["assetProfile"],
      });
      // Try to get logo from asset profile
      if (quote.assetProfile?.website) {
        const domain = new URL(quote.assetProfile.website).hostname;
        // Request a larger PNG logo from Clearbit
        return `https://logo.clearbit.com/${domain}?size=200&format=png`;
      }
      return this.DEFAULT_IMAGE;
    } catch (error) {
      console.error(`Error getting logo for ${symbol}:`, error);
      return this.DEFAULT_IMAGE;
    }
  }

  public async getSymbolNews(symbol: string): Promise<NewsItem[]> {
    try {
      const result = await yahooFinance.search(symbol, {
        newsCount: 2,
        quotesCount: 0,
      });

      return result.news.map((item) => ({
        title: item.title,
        summary: item.title, // Using title as summary since the API doesn't provide a snippet
        url: item.link,
        publishedAt: item.providerPublishTime.toString(),
      }));
    } catch (error) {
      console.error(`Error getting news for ${symbol}:`, error);
      return [];
    }
  }

  public async getSymbolPrice(symbol: string): Promise<number | null> {
    try {
      const quote = await yahooFinance.quote(symbol);
      return quote.regularMarketPrice || null;
    } catch (error) {
      console.error(`Error getting price for ${symbol}:`, error);
      return null;
    }
  }

  public async getTrendingAssets(): Promise<TrendingAsset[]> {
    console.log(`[Market] Getting trending assets...`);
    try {
      // First get trending symbols
      const trendingSymbols = await this.getTrendingSymbols();
      console.log(`[Market] Found trending symbols:`, trendingSymbols);

      // Then get detailed quotes for each symbol
      const quotes = await Promise.all(
        trendingSymbols.map(async (symbol) => {
          const [quote, logo] = await Promise.all([
            yahooFinance.quote(symbol),
            this.getCompanyLogo(symbol),
          ]);

          const direction =
            (quote.regularMarketChangePercent || 0) >= 0
              ? ("up" as const)
              : ("down" as const);

          return {
            symbol,
            name: quote.longName || quote.shortName || symbol,
            currentPrice: quote.regularMarketPrice || 0,
            changePercentage: quote.regularMarketChangePercent || 0,
            direction,
            imageUrl: logo,
          };
        })
      );

      return quotes;
    } catch (error) {
      console.error("Error getting trending assets:", error);
      throw error;
    }
  }
}
