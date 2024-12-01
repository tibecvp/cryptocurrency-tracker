$(document).ready(function () {
    const API_URL = "https://api.coingecko.com/api/v3/coins/markets";
    const MAX_COMPARISON = 5;
  
    // Load comparison list and preferences from localStorage
    let comparisonList = JSON.parse(localStorage.getItem("comparisonList")) || [];
    let preferences = JSON.parse(localStorage.getItem("preferences")) || {
      showPriceChange: true,
      sortOption: "market_cap_desc",
      favorites: [],
    };
  
    // Fetch and display initial cryptocurrency data
    function fetchCryptocurrencies() {
      $.ajax({
        url: API_URL,
        data: {
          vs_currency: "usd",
          order: preferences.sortOption,
          per_page: 10,
          page: 1,
        },
        success: displayCryptocurrencies,
        error: () => alert("Error fetching cryptocurrency data"),
      });
    }
  
    function displayCryptocurrencies(data) {
      const container = $("#crypto-container");
      container.empty(); // Clear existing content
  
      data.forEach((crypto) => {
        const isFavorite = preferences.favorites.includes(crypto.id);
        const card = $(`
          <div class="crypto-card ${isFavorite ? "favorite" : ""}">
            <h3>${crypto.name} (${crypto.symbol.toUpperCase()})</h3>
            <p>Price: $${crypto.current_price.toFixed(2)}</p>
            ${
              preferences.showPriceChange
                ? `<p>24h Change: ${crypto.price_change_percentage_24h.toFixed(2)}%</p>`
                : ""
            }
            <p>Market Cap: $${crypto.market_cap.toLocaleString()}</p>
            <button class="favorite-btn" data-id="${crypto.id}">
              ${isFavorite ? "Unfavorite" : "Favorite"}
            </button>
            <button class="compare-btn" data-id="${crypto.id}" data-name="${crypto.name}" data-symbol="${crypto.symbol}" data-price="${crypto.current_price}">
              Compare
            </button>
          </div>
        `);
        container.append(card);
      });
  
      // Add event listeners to buttons
      $(".favorite-btn").on("click", function () {
        const id = $(this).data("id");
        toggleFavorite(id);
      });
  
      $(".compare-btn").on("click", function () {
        const id = $(this).data("id");
        const name = $(this).data("name");
        const symbol = $(this).data("symbol");
        const price = $(this).data("price");
        addToComparison({ id, name, symbol, price });
      });
    }
  
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
  
    function removeFromComparison(id) {
      comparisonList = comparisonList.filter((crypto) => crypto.id !== id);
      localStorage.setItem("comparisonList", JSON.stringify(comparisonList));
      updateComparison();
    }
  
    function toggleFavorite(id) {
      const isFavorite = preferences.favorites.includes(id);
      if (isFavorite) {
        preferences.favorites = preferences.favorites.filter((fav) => fav !== id);
      } else {
        preferences.favorites.push(id);
      }
      savePreferences();
      fetchCryptocurrencies();
    }
  
    function savePreferences() {
      localStorage.setItem("preferences", JSON.stringify(preferences));
    }
  
    function initializePreferences() {
      // Populate UI controls based on preferences
      $("#show-price-change").prop("checked", preferences.showPriceChange);
      $("#sort-option").val(preferences.sortOption);
  
      // Event listener for price change toggle
      $("#show-price-change").on("change", function () {
        preferences.showPriceChange = $(this).is(":checked");
        savePreferences();
        fetchCryptocurrencies();
      });
  
      // Event listener for sort option
      $("#sort-option").on("change", function () {
        preferences.sortOption = $(this).val();
        savePreferences();
        fetchCryptocurrencies();
      });
    }
  
    // Initial setup
    initializePreferences();
    fetchCryptocurrencies();
    updateComparison();
  
    // Refresh data every minute
    setInterval(fetchCryptocurrencies, 60000);
  });
  