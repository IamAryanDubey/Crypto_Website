async function fetchCoinDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    const coinCode = urlParams.get("code");
    
    if (!coinCode) {
        document.getElementById("cryptoDetails").innerHTML = "<p>Invalid coin code.</p>";
        return;
    }

    try {
        const response = await fetch("https://api.livecoinwatch.com/coins/single", {
            method: "POST",
            headers: {
                "content-type": "application/json",
                "x-api-key": "1f6ab8fb-de76-43b9-8bdc-2f548cd1343a", // Replace with a secure backend approach
            },
            body: JSON.stringify({
                currency: "USD",
                code: coinCode,
                meta: true
            }),
        });
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const coin = await response.json();

        // Ensure properties exist before displaying them
        const volume = coin.volume ? `$${coin.volume.toLocaleString()}` : "N/A";

        document.getElementById("cryptoDetails").innerHTML = `
            <img src="${coin.png64}" alt="${coin.name} logo" id="detailImage">
            <h2 id="detailRank">Rank: ${coin.rank}</h2>
            <h2>${coin.name} (${coinCode})</h2>
            <p id="detailPrice">Current Price: $${coin.rate?.toFixed(2) || "N/A"}</p>
            <p>Volume (24h): ${volume}</p>
            <p>Rate of change in the last hour: ${(coin.delta.hour)*100}%</p>
            <p>Rate of change in the last 24 hours: ${(coin.delta.day)*100}%</p>
            <p>Rate of change in the last 7 days: ${(coin.delta.week)*100}%</p>
            <p>Rate of change in the last 30 days: ${(coin.delta.month)*100}%</p>
            <p>Rate of change in the last 90 days: ${(coin.delta.quarter)*100}%</p>
            <p>Rate of change in the last 365 days: ${(coin.delta.year)*100}%</p>
            <button id="myButton">Back to Home</button>
            
        `;

        // Add event listener **after** the button has been added to the DOM
        document.getElementById("myButton").addEventListener("click", function() {
            window.location.href = "index.html";
        });

    } catch (error) {
        console.error("Error fetching coin details:", error);
        document.getElementById("cryptoDetails").innerHTML = "<p>Failed to load details.</p>";
    }
}

// Call when the page loads
document.addEventListener("DOMContentLoaded", fetchCoinDetails);
