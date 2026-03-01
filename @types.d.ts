export interface GoldPrices {
    jual: Record<string, number>;
    beli: Record<string, number>;
}

export interface GoldBuyPrice {
    metadata: {
        retrievedAt: string;
        sources: string[];
    }
    antam: Record<string, number>;
    ubs: Record<string, number>;
}

export interface GoldPriceInput {
    buy: GoldBuyPrice;
    buyBack: GoldBuyPrice;
}