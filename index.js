async function fetchCryptoData() {
    try {
        const response = await fetch("https://api.livecoinwatch.com/coins/list", {
            method: "POST",
            headers: {
                "content-type": "application/json",
                "x-api-key": "1f6ab8fb-de76-43b9-8bdc-2f548cd1343a", // Replace with a safer backend approach
            },
            body: JSON.stringify({
                currency: "USD",
                sort: "rank",
                order: "ascending",
                offset: 0,
                limit: 10, // Fetch top 10 cryptocurrencies
                meta: true,
            }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log("API Response:", data); // Debugging: check API response structure
        updateCryptoList(data);
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

function updateCryptoList(cryptoData) {
    const container = document.querySelector(".stocksTable");

    if (!container) {
        console.error("Container not found!");
        return;
    }

    container.innerHTML = ""; // Clear previous content

    cryptoData.forEach((coin) => {
        if (!coin.rate) {
            console.warn(`Skipping coin with missing rate:`, coin);
            return;
        }

        const cryptoRow = document.createElement("a");
        cryptoRow.href = `details.html?code=${coin.code}`;
        cryptoRow.classList.add("tablerow");
        const priceChange = coin.delta.day.toFixed(2);
        const changeClass = priceChange < 0 ? "red-bg" : "green-bg"; 


        cryptoRow.innerHTML = `
            <div class="flexCol">
                <img src="${coin.png64}" alt="${coin.name}" class="">
            </div>
            <div class="flexCol">
                <p class="stockName">${coin.name} (${coin.code})</p>
            </div>
            <div class="flexCol">
                <div class="priceContainer">
                    <p class="stockPrice">$${coin.rate.toFixed(2)}</p>
                    <div class="flexCol ${changeClass}">
                        <p class="priceChange">${priceChange > 0 ? '+' : ''}${priceChange}%</p>
                    </div>
                </div>
            </div>
        `;

        container.appendChild(cryptoRow);
    });
}

// Call the function when the page loads
document.addEventListener("DOMContentLoaded", fetchCryptoData);
