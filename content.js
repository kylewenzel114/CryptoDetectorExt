const cryptoRegex = /(?:\(|\[|\{|^|\s|,|")?(Bitcoin|Ethereum|Ripple|Dogecoin|Cardano|Solana|Litecoin|Polkadot|Binance Coin|Tether|Bitcoin Cash|Chainlink|Stellar|Monero|VeChain|EOS|Shiba Inu|Tron|Avalanche|BTC|ETH|XRP|DOGE|ADA|SOL|LTC|DOT|BNB|USDT|BCH|LINK|XLM|XMR|VET|EOS|SHIB|TRX|AVAX)(?:\)|\]|\}|,|\.|$|\s|")?/gi;

const normalizationMap = {
    BITCOIN: "BTC",
    BTC: "BTC",
    ETHEREUM: "ETH",
    ETH: "ETH",
    RIPPLE: "XRP",
    XRP: "XRP",
    DOGECOIN: "DOGE",
    DOGE: "DOGE",
    CARDANO: "ADA",
    ADA: "ADA",
    SOLANA: "SOL",
    SOL: "SOL",
    LITECOIN: "LTC",
    LTC: "LTC",
    POLKADOT: "DOT",
    DOT: "DOT",
    "BINANCE COIN": "BNB",
    BNB: "BNB",
    TETHER: "USDT",
    USDT: "USDT",
    "BITCOIN CASH": "BCH",
    BCH: "BCH",
    CHAINLINK: "LINK",
    LINK: "LINK",
    STELLAR: "XLM",
    XLM: "XLM",
    MONERO: "XMR",
    XMR: "XMR",
    VECHAIN: "VET",
    VET: "VET",
    EOS: "EOS",
    SHIBA: "SHIB",
    "SHIBA INU": "SHIB",
    SHIB: "SHIB",
    TRON: "TRX",
    TRX: "TRX",
    AVALANCHE: "AVAX",
    AVAX: "AVAX",
};

let detectedCryptos = new Set();


function scanForCryptos(element) {
    if (element.nodeType === Node.TEXT_NODE) {
        const matches = element.textContent.match(cryptoRegex);
        if (matches) {
            matches.forEach((match) => {
                
                const cleanMatch = match
                    .replace(/[\(\)\[\]\{\}",]/g, "") 
                    .trim()
                    .toUpperCase();

                if (normalizationMap[cleanMatch]) {
                    detectedCryptos.add(normalizationMap[cleanMatch]);
                }
            });
        }
    } else if (element.nodeType === Node.ELEMENT_NODE && element.tagName !== "SCRIPT" && element.tagName !== "STYLE") {
        element.childNodes.forEach(scanForCryptos);
    }
}

scanForCryptos(document.body);

chrome.runtime.sendMessage({
    type: "crypto_detected",
    cryptos: Array.from(detectedCryptos),
});