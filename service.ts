import axios from 'axios';
import type { GoldPriceInput } from './@types.d';

export async function fetchHargaEmasOrg(): Promise<string> {
    const baseUrl = process.env['SOURCE_BASE_URL'] ?? 'https://harga-emas.org';
    const res = await axios.get(baseUrl);
    return res.data;
}

export async function createGoldPrice(input: GoldPriceInput) {
    const baseUrl = process.env['API_BASE_URL'] ?? 'https://aimas.bangmarcel.art/api';
    return await axios.post(`${baseUrl}/gold-price`, input, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': process.env['API_SECRET'],
        }
    });
}