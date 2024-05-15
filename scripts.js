var modal = document.getElementById("myModal");
var span = document.getElementsByClassName("close")[0];

var cards = [
    { image: '1.jpg', description: 'Опис 1', showDescription: false, tag: '1', price: 10},
    { image: '1.jpg', description: 'Опис 11', showDescription: false, tag: '1', price: 10 },
    { image: '1.jpg', description: 'Опис 111', showDescription: false, tag: '1', price: 10 },
    { image: '1.jpg', description: 'Опис 1111', showDescription: false, tag: '1', price: 10 },
    { image: '1.jpg', description: 'Опис 11111', showDescription: false, tag: '1', price: 10 },
    { image: '1.jpg', description: 'Опис 111111', showDescription: false, tag: '1', price: 10 },
    { image: '1.jpg', description: 'Опис 1111111', showDescription: false, tag: '1', price: 10 },
    { image: '2.jpg', description: 'Опис 2', showDescription: false, tag: '2', price: 30 },
    { image: '3.jpg', description: 'Опис 3', showDescription: false, tag: '3', price: 40 },
];

var globalforsort;

function loadData() {
    var filter = document.getElementById("filter").value;
    var filteredCards = [];

    if (filter === "filter1") {
        // Filter cards based on some condition, for example, by description
        filteredCards = cards.filter(function(card) {
            return card.tag === '1'; // Change the condition as needed
        });
    } else if (filter === "filter2") {
        filteredCards = cards.filter(function(card) {
            return card.tag !== '1'; // Change the condition as needed
        });
    }
        else if (filter === "filter0") {
            filteredCards = cards.filter(function(card) {
                return card.tag; // Change the condition as needed
            });
    }

    var cardsDiv = document.getElementById('card-container');
    cardsDiv.innerHTML = '';

    // Add filtered cards to the DOM
    filteredCards.forEach(function(card) {
        var cardElement = document.createElement('div');
        cardElement.className = 'card';

        var cardImage = document.createElement('img');
        cardImage.src = card.image;
        cardImage.alt = "Card image";
        cardImage.style.width = "100%";

        var cardDescription = document.createElement('p');
        cardDescription.textContent = card.description;

        var addButton = document.createElement('button');
        addButton.textContent = "Add to Basket";
        addButton.onclick = function() {
            addToBasket(card.image, card.description,card.price);
        };

        var addPrice = document.createElement('h4');
        addPrice.textContent = card.price;

        cardElement.appendChild(cardImage);
        cardElement.appendChild(cardDescription);
        cardElement.appendChild(addButton);
        cardElement.appendChild(addPrice);
        cardsDiv.appendChild(cardElement);

        
    });

    var filter = document.getElementById("filter").value;
    var minPrice = parseFloat(document.getElementById("minPrice").value);
    var maxPrice = parseFloat(document.getElementById("maxPrice").value);

    var filteredCards = cards;

    if (filter === "sortByDescriptionAscending") {
        filteredCards = sortByDescriptionAscending(filteredCards);
    } else if (filter === "sortByPriceAscending") {
        filteredCards = sortByPriceAscending(filteredCards);
    } else if (filter === "sortByPriceDescending") {
        filteredCards = sortByPriceDescending(filteredCards);
    }

    if (!isNaN(minPrice) && !isNaN(maxPrice)) {
        filteredCards = filterByPriceRange(filteredCards, minPrice, maxPrice);
    }
    globalforsort=filteredCards;
    displayCards(filteredCards);
}

function displayCards(cards) {
    var cardsDiv = document.getElementById('card-container');
    cardsDiv.innerHTML = '';

    cards.forEach(function(card) {
        var cardElement = document.createElement('div');
        cardElement.className = 'card';

        var cardImage = document.createElement('img');
        cardImage.src = card.image;
        cardImage.alt = "Card image";
        cardImage.style.width = "100%";

        var cardDescription = document.createElement('p');
        cardDescription.textContent = card.description + " - Price: $" + card.price;

        var addButton = document.createElement('button');
        addButton.textContent = "Add to Basket";
        addButton.onclick = function() {
            addToBasket(card.image, card.description, card.price);
        };

        cardElement.appendChild(cardImage);
        cardElement.appendChild(cardDescription);
        cardElement.appendChild(addButton);
        cardsDiv.appendChild(cardElement);
    });
}

function showModal() {
    modal.style.display = "block";
}

span.onclick = function() {
    modal.style.display = "none";
}

window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

window.onload = function() {
    loadData();
};

function adjustCardWidth() {
    var containerWidth = document.getElementById('card-container').offsetWidth;
    var cardWidth = document.querySelector('.card').offsetWidth;
    var numCardsPerRow = Math.floor(containerWidth / (cardWidth + 20)); // Assuming 10px margin on both sides of the card

    var cards = document.querySelectorAll('.card');
    cards.forEach(function(card) {
        card.style.width = 'calc(' + (100 / numCardsPerRow) + '% - 20px)';
    });
}


var basketItems = []; // Array to store added business cards

function toggleBasketMenu() {
    var basketMenu = document.getElementById("basketMenu");
    basketMenu.style.display = (basketMenu.style.display === "block") ? "none" : "block";
}

function addToBasket(image, description, price) {
    var index = basketItems.findIndex(function(item) {
        return item.image === image && item.description === description;
    });

    if (index !== -1) {
        basketItems[index].quantity++;
    } else {
        basketItems.push({ image: image, description: description, price: price, quantity: 1 });
    }
    updateBasketMenu();
}

function updateQuantity(index, increment) {
    if (increment) {
        basketItems[index].quantity++;
    } else {
        if (basketItems[index].quantity > 1) {
            basketItems[index].quantity--;
        } else {
            // Remove item from basket if quantity is 1
            basketItems.splice(index, 1);
        }
    }
    updateBasketMenu();
}

// Update basket menu with quantity buttons
function updateBasketMenu() {
    var basketMenu = document.getElementById("basketMenu");
    basketMenu.innerHTML = ""; // Clear previous items

    // Calculate total price
    var totalPrice = 0;
    basketItems.forEach(function(item) {
        console.log("Item:", item);
        totalPrice += item.price * item.quantity;
    });

    console.log("Total Price:", totalPrice);

    // Display total price
    var totalPriceElement = document.createElement("div");
    totalPriceElement.textContent = "Total Price: $" + totalPrice.toFixed(2);
    basketMenu.appendChild(totalPriceElement);

    // Add items to basket menu
    basketItems.forEach(function(item, index) {
        var basketItem = document.createElement("div");
        basketItem.className = "basket-item";

        var itemName = document.createElement("span");
        itemName.textContent = item.description + " - Quantity: " + item.quantity;
        basketItem.appendChild(itemName);

        var increaseButton = document.createElement("button");
        increaseButton.textContent = "+";
        increaseButton.onclick = function(event) {
            updateQuantity(index, true);
            event.stopPropagation(); // Prevent the event from bubbling up and closing the basket menu
        };
        basketItem.appendChild(increaseButton);

        var decreaseButton = document.createElement("button");
        decreaseButton.textContent = "-";
        decreaseButton.onclick = function(event) {
            updateQuantity(index, false);
            event.stopPropagation(); // Prevent the event from bubbling up and closing the basket menu
        };
        basketItem.appendChild(decreaseButton);

        basketMenu.appendChild(basketItem);
    });
}

function sortByDescriptionAscending() {
    globalforsort.sort(function(a, b) {
        return a.description.localeCompare(b.description);
    });
    displayCards(globalforsort);
}

// Sort cards by price (ascending)
function sortByPriceAscending() {
    globalforsort.sort(function(a, b) {
        return a.price - b.price;
    });
    displayCards(globalforsort);
}

// Sort cards by price (descending)
function sortByPriceDescending() {
    globalforsort.sort(function(a, b) {
        return b.price - a.price;
    });
    displayCards(globalforsort);
}

// Filter cards within a specified price range
function filterByPriceRange() {
    var minPrice = parseFloat(document.getElementById("minPrice").value);
    var maxPrice = parseFloat(document.getElementById("maxPrice").value);
    if (!isNaN(minPrice) && !isNaN(maxPrice)) {
        var filteredCards = globalforsort.filter(function(card) {
            return card.price >= minPrice && card.price <= maxPrice;
        });
        displayCards(filteredCards);
    } else {
        // Handle invalid input
        alert("Please enter valid price range.");
    }
}