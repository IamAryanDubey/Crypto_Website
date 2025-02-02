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
        const volume = coin.volume ? `$${coin.volume.toLocaleString()}` : "N/A";
        const changeRate = (coin.delta.day * 100).toFixed(2);

        document.getElementById("cryptoDetails").innerHTML = `
            <img src="${coin.png64}" alt="${coin.name} logo" id="detailImage">
            <h2 id="detailRank">Rank: ${coin.rank}</h2>
            <h2>${coin.name} (${coinCode})</h2>
            <p id="detailPrice">Current Price: $${coin.rate?.toFixed(2) || "N/A"}</p>
            <p>Volume (24h): ${volume}</p>
            <div class="detailStats">
                <label for="changePeriod" class='flexCol'>Rate of change in</label>
                <select id="changePeriod">
                    <option value="hour">Last Hour</option>
                    <option value="day" selected>Last 24 Hours</option>
                    <option value="week">Last 7 Days</option>
                    <option value="month">Last 30 Days</option>
                    <option value="quarter">Last 90 Days</option>
                    <option value="year">Last 365 Days</option>
                </select>
                <p id="changeRate" class='flexCol' style="color: ${getChangeColor(changeRate)}"> ${changeRate}%</p>
            </div>
            <button id="myButton">Back to Home</button>
        `;

        // Dropdown change
        document.getElementById("changePeriod").addEventListener("change", function() {
            const selectedPeriod = this.value;
            const changeRate = (coin.delta[selectedPeriod] * 100).toFixed(2);
            const changeRateElement = document.getElementById("changeRate");

            changeRateElement.innerText = ` ${changeRate}%`;
            changeRateElement.style.color = getChangeColor(changeRate);
        });

        // Add event listener **after** the button has been added to the DOM
        document.getElementById("myButton").addEventListener("click", function() {
            window.location.href = "index.html";
        });

    } catch (error) {
        console.error("Error fetching coin details:", error);
        document.getElementById("cryptoDetails").innerHTML = "<p>Failed to load details.</p>";
    }
}

// Function to determine color based on change rate
function getChangeColor(rate) {
    return rate >= 0 ? "green" : "red";
}

// Call when the page loads
document.addEventListener("DOMContentLoaded", fetchCoinDetails);
