$(document).ready(function () {
    const API_URL = "https://api.coingecko.com/api/v3/coins/markets";
    const MAX_COMPARISON = 5;
  
    let comparisonList = JSON.parse(localStorage.getItem("comparisonList")) || [];
  
    function fetchCryptocurrencies() {
      $.ajax({
        url: API_URL,
        data: { vs_currency: "usd", per_page: 10, page: 1 },
        success: displayCryptocurrencies,
        error: () => alert("Error fetching cryptocurrency data"),
      });
    }
  
    function displayCryptocurrencies(data) {
      const container = $("#crypto-container");
      container.empty();
      data.forEach((crypto) => {
        const card = `
          <div class="crypto-card">
            <h3>${crypto.name} (${crypto.symbol.toUpperCase()})</h3>
            <p>Price: $${crypto.current_price.toFixed(2)}</p>
            <p>24h Change: ${crypto.price_change_percentage_24h.toFixed(2)}%</p>
            <p>Market Cap: $${crypto.market_cap.toLocaleString()}</p>
            <button onclick="addToComparison('${crypto.id}')">Compare</button>
          </div>
        `;
        container.append(card);
      });
    }
  
    fetchCryptocurrencies();
    updateComparison();
  
    setInterval(fetchCryptocurrencies, 60000); // Update every minute
  });
  