$(document).ready(function () {
    const API_URL = "https://api.coingecko.com/api/v3/coins/markets";
    const MAX_COMPARISON = 5;
  
    // Load comparison list from localStorage or initialize as empty
    let comparisonList = JSON.parse(localStorage.getItem("comparisonList")) || [];
  
    // Fetch cryptocurrency data and display
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
      container.empty(); // Clear existing content
  
      data.forEach((crypto) => {
        const card = $(`
          <div class="crypto-card">
            <h3>${crypto.name} (${crypto.symbol.toUpperCase()})</h3>
            <p>Price: $${crypto.current_price.toFixed(2)}</p>
            <p>24h Change: ${crypto.price_change_percentage_24h.toFixed(2)}%</p>
            <p>Market Cap: $${crypto.market_cap.toLocaleString()}</p>
            <button class="compare-btn" data-id="${crypto.id}" data-name="${crypto.name}" data-symbol="${crypto.symbol}" data-price="${crypto.current_price}">
              Compare
            </button>
          </div>
        `);
        container.append(card);
      });
  
      // Add event listeners to the "Compare" buttons
      $(".compare-btn").on("click", function () {
        const id = $(this).data("id");
        const name = $(this).data("name");
        const symbol = $(this).data("symbol");
        const price = $(this).data("price");
        addToComparison({ id, name, symbol, price });
      });
    }
  
    // Add cryptocurrency to comparison
    function addToComparison(crypto) {
      if (comparisonList.length >= MAX_COMPARISON) {
        alert("You can compare up to 5 cryptocurrencies.");
        return;
      }
  
      if (!comparisonList.some((item) => item.id === crypto.id)) {
        comparisonList.push(crypto);
        localStorage.setItem("comparisonList", JSON.stringify(comparisonList));
        updateComparison();
      } else {
        alert(`${crypto.name} is already in the comparison list.`);
      }
    }
  
    // Update the comparison section
    function updateComparison() {
      const container = $("#comparison-container");
      container.empty(); // Clear existing content
  
      comparisonList.forEach((crypto) => {
        const card = $(`
          <div class="crypto-card">
            <h3>${crypto.name} (${crypto.symbol.toUpperCase()})</h3>
            <p>Price: $${crypto.price.toFixed(2)}</p>
            <button class="remove-btn" data-id="${crypto.id}">Remove</button>
          </div>
        `);
        container.append(card);
      });
  
      // Add event listeners to the "Remove" buttons
      $(".remove-btn").on("click", function () {
        const id = $(this).data("id");
        removeFromComparison(id);
      });
    }
  
    // Remove cryptocurrency from comparison
    function removeFromComparison(id) {
      comparisonList = comparisonList.filter((crypto) => crypto.id !== id);
      localStorage.setItem("comparisonList", JSON.stringify(comparisonList));
      updateComparison();
    }
  
    // Restore comparison list from localStorage and update the UI
    function initializeComparison() {
      updateComparison();
    }
  
    // Initial setup
    fetchCryptocurrencies();
    initializeComparison();
  
    // Refresh data every minute
    setInterval(fetchCryptocurrencies, 60000);
  });
  