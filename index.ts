import dotenv from 'dotenv';
import { scrapeAntamGoldPrices, scrapeUbsGoldPrices } from './scraper';
import { createGoldPrice, fetchHargaEmasOrg } from './service';
import type { GoldBuyPrice, GoldPriceInput } from './@types.d';
import Baker from 'cronbake';

async function main() {
    dotenv.config({ quiet: true });

    const baker = Baker.create();

    baker.add({
        name: 'fetch-gold-price',
        // cron: '0 33 23 * * *', // debug
        cron: '0 0 9,12,17 * * *',
        callback: async () => {
            console.log('Fetch gold price job started');
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
            console.log('Fetch gold price job finished');
        }
    });

    baker.bakeAll();
}

main().catch(console.error).finally(() => console.log('Job setup complete'));