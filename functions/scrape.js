const { default: FirecrawlApp } = require("@mendable/firecrawl-js");
require("dotenv").config();

const app = new FirecrawlApp({ apiKey: process.env.FIRECRAWL_API_KEY });

async function scrapeWebpage(url) {
  try {
    // Scrape a website
    const scrapeResponse = await app.scrapeUrl(url, {
      formats: ["markdown"],
    });
    if (!scrapeResponse.success) {
      throw new Error(`Failed to scrape: ${scrapeResponse.error}`);
    }

    console.log(scrapeResponse?.markdown);
    return scrapeResponse?.markdown || null
  } catch (error) {
    console.error("Error scraping webpage:", error);
    return null;
  }
}

module.exports = scrapeWebpage;
