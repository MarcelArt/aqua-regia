import * as cheerio from 'cheerio';
import type { GoldPrices } from './@types.d';



export function scrapeUbsGoldPrices(html: string): GoldPrices {
    const $ = cheerio.load(html);
    const result: GoldPrices = { jual: {}, beli: {} };

    // Find the specific table by checking ALL three unique headers
    const goldTable = $('table').filter((_, table) => {
        const headers = $(table).find('th span, th');
        const headerTexts = headers.map((_, th) => $(th).text().trim()).get();
        return headerTexts.includes('Satuan') &&
               headerTexts.includes('Jual') &&
               headerTexts.includes('Beli');
    });

    if (goldTable.length === 0) {
        throw new Error('UBS gold table not found');
    }

    // Parse rows
    goldTable.find('tbody tr').each((_, row) => {
        const cols = $(row).find('td');
        if (cols.length >= 3) {
            const unit = $(cols[0]).text().trim();
            const jual = $(cols[1]).text().replace(/\./g, '');
            const beli = $(cols[2]).text().replace(/\./g, '');

            result.jual[unit] = parseInt(jual);
            result.beli[unit] = parseInt(beli);
        }
    });

    return result;
}

export function scrapeAntamGoldPrices(html: string): GoldPrices {
    const $ = cheerio.load(html);
    const result: GoldPrices = { jual: {}, beli: {} };

    // Find the GoldPriceTable by checking for "Satuan" and "Antam" headers
    const goldTable = $('table').filter((_, table) => {
        const headers = $(table).find('th span, th');
        const headerTexts = headers.map((_, th) => $(th).text().trim()).get();
        return headerTexts.includes('Satuan') &&
               headerTexts.includes('Antam');
    });

    if (goldTable.length === 0) {
        throw new Error('Antam gold table not found');
    }

    // Extract buyback price from the notes section
    const buybackText = goldTable.find('span:contains("Harga pembelian kembali")').text();
    const buybackMatch = buybackText.match(/Rp([\d.]+)/);
    const buybackPrice = buybackMatch?.[1] ? parseInt(buybackMatch[1].replace(/\./g, '')) : 0;

    // Parse rows (skip rows with non-numeric units)
    goldTable.find('tbody tr').each((_, row) => {
        const cols = $(row).find('td');
        if (cols.length >= 2) {
            const unit = $(cols[0]).text().trim();
            const weight = parseFloat(unit);

            // Skip if unit is not a valid number
            if (isNaN(weight) || unit === '') {
                return;
            }

            const jual = $(cols[1]).text().replace(/\./g, '');
            const jualNum = parseInt(jual);

            result.jual[unit] = jualNum;
            // Use jual as beli if buyback price is not available, otherwise calculate
            result.beli[unit] = buybackPrice === 0 ? jualNum : Math.round(weight * buybackPrice);
        }
    });

    return result;
}