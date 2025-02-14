async function fetchCryptoPrices(cryptos) {
    const url = `https://api.coingecko.com/api/v3/simple/price?ids=${cryptos
        .join(",")
        .toLowerCase()}&vs_currencies=usd`;

    const response = await fetch(url);

    if (!response.ok) {
        console.error("Failed to fetch cryptocurrency prices");
        return {};
    }

    const data = await response.json();
    return data;
}

chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
    if (message.type === "crypto_detected") {
        
        const cryptoMapping = {
            BTC: "bitcoin",
            ETH: "ethereum",
            XRP: "ripple",
            DOGE: "dogecoin",
            ADA: "cardano",
            SOL: "solana",
            LTC: "litecoin",
            DOT: "polkadot",
            BNB: "binancecoin",
            USDT: "tether",
            BCH: "bitcoin-cash",
            LINK: "chainlink",
            XLM: "stellar",
            XMR: "monero",
            VET: "vechain",
            EOS: "eos",
            SHIB: "shiba-inu",
            TRX: "tron",
            AVAX: "avalanche",
        };

        const uniqueCryptos = [...new Set(message.cryptos)];

        const normalizedCryptos = uniqueCryptos
            .map((crypto) => cryptoMapping[crypto])
            .filter(Boolean);

        const prices = await fetchCryptoPrices(normalizedCryptos);

        
        const formattedPrices = {};
        Object.entries(cryptoMapping).forEach(([key, id]) => {
            if (prices[id]) {
                formattedPrices[key] = prices[id].usd.toFixed(2);
            }
        });

        chrome.storage.local.set({ cryptoPrices: formattedPrices });
    }
});
