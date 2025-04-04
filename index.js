const getAlaiToken = require("./functions/auth");
const scrapeWebpage = require("./functions/scrape");


const { scrapedData } = require("./data");
const alai = require("./functions/alai");
const token = process.env.ALAI_TOKEN


const url = "https://karthikvanam.vercel.app/";  

async function main() {
    // const token = await getAlaiToken();
    // if (!token) {
    //     console.error("Failed to authenticate with Alai.");
    //     return;
    // }
    // const data =  await scrapeWebpage(url)
    await alai(token,scrapedData)
    
}

main();
