import dotenv from 'dotenv';
import { scrapeAntamGoldPrices, scrapeUbsGoldPrices } from './scraper';
import { createGoldPrice, fetchHargaEmasOrg } from './service';
import type { GoldBuyPrice, GoldPriceInput } from './@types.d';

async function main() {
    dotenv.config();

    const html = await fetchHargaEmasOrg();
    const ubs = scrapeUbsGoldPrices(html);
    const antam = scrapeAntamGoldPrices(html);

    const retrievedAt = new Date().toISOString();

    const source = process.env['SOURCE_BASE_URL'] ?? 'https://harga-emas.org';
    const buyBack: GoldBuyPrice = {
        metadata: {
            retrievedAt,
            sources: [source],
        },
        antam: antam.beli,
        ubs: ubs.beli,
    };
    const buy: GoldBuyPrice = {
        ...buyBack,
        antam: antam.jual,
        ubs: ubs.jual,
    };

    const input: GoldPriceInput = { buy, buyBack };
    await createGoldPrice(input);
    console.log({ ubs, antam });
}

main().catch(console.error).finally(() => console.log('done'));