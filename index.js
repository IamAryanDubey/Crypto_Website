
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
                limit: 300, // Fetch 10 cryptocurrencies
                meta: true,
            }),
        });
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log("API Response:", data); // Debugging: check API response structure
        updateTable(data);
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

function updateTable(cryptoData) {
    const table = document.querySelector("table");

    // Check if the table exists in the DOM
    if (!table) {
        console.error("Table not found!");
        return;
    }

    // Reset the table while keeping the headers
    table.innerHTML = `
        <tr class="tableContentHeading">
            <th class="tableSymbol">Symbol</th>
            <th class="tableName">Name</th>
            <th class="tablePrice">Price (USD)</th>
        </tr>
    `;

    // Iterate over the cryptoData and append each row
    cryptoData.forEach((coin) => {
        if (!coin.rate) {
            console.warn(`Skipping coin with missing rate:`, coin);
            return;
        }

        const row = document.createElement("tr");
        row.classList.add("tableRow");
        row.innerHTML = `
            
                <td class="tableName"><a href="details.html?code=${coin.code}"><img src="${coin.png64}"></img></a></td>
                <td class="tableName"><a href="details.html?code=${coin.code}"><p>${coin.name} (${coin.code})</p></a></td>
                <td class="tablePrice"><a href="details.html?code=${coin.code}"><p>$${coin.rate.toFixed(2)}</p></a></td>
            
        `;
        table.appendChild(row);
    });
}

// Call the function when the page loads
document.addEventListener("DOMContentLoaded", fetchCryptoData);  // Ensure the DOM is fully loaded before calling fetch
