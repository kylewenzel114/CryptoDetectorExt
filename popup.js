document.addEventListener("DOMContentLoaded", () => {
    const cryptoList = document.getElementById("crypto-list");
    const loader = document.getElementById("loader");
    const noDataMessage = document.getElementById("no-data");

    chrome.storage.local.get("cryptoPrices", (data) => {
        loader.style.display = "none"; 
        if (data.cryptoPrices) {
            Object.entries(data.cryptoPrices).forEach(([crypto, price]) => {
                const listItem = document.createElement("li");
                listItem.innerHTML = `${crypto}: <span>$${price}</span>`;
                cryptoList.appendChild(listItem);
            });
            noDataMessage.style.display = "none"; 
        } else {
            cryptoList.style.display = "none"; 
            noDataMessage.style.display = "block";
        }
    });
});
