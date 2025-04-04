const getAlaiToken = require("./functions/auth");
const scrapeWebpage = require("./functions/scrape");


const { scrapedData } = require("./data");
const alai = require("./functions/alai");


const url = "https://en.wikipedia.org/wiki/Wiki";  

async function main() {
    console.log("Logging in....")
    const token = await getAlaiToken();
    if (!token) {
        console.error("Failed to authenticate with Alai.");
        return;
    }
    console.log(`Scraping ${url} ....`)
    const data =  await scrapeWebpage(url)
    await alai(token,data)
    
}

main();
