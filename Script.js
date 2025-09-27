const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const categoryFilter = document.getElementById('categoryFilter');
const typeFilter = document.getElementById('typeFilter');
const maxTimeInput = document.getElementById('maxTimeInput');
const recipeContainer = document.getElementById('recipeContainer');
const timeDisplay = document.getElementById('time');
const searchStatus = document.getElementById('searchStatus');
const apiUsed = document.getElementById('apiUsed');

// Recipe dataset with prepTime in minutes
const recipes = [
    { name: "Aloo Tamatar Sabzi", category: "Main Course", type: "Veg", prepTime: 25, ingredients: ["potato","tomato","onion","spices"], img: "https://images.unsplash.com/photo-1604908177545-3dfbbdb38bdf?auto=format&fit=crop&w=400&h=300" },
    { name: "Paneer Butter Masala", category: "Main Course", type: "Veg", prepTime: 30, ingredients: ["paneer","butter","tomato","cream"], img: "https://images.unsplash.com/photo-1617196032786-5c71a84c03e0?auto=format&fit=crop&w=400&h=300" },
    { name: "Grilled Chicken", category: "Main Course", type: "Non-Veg", prepTime: 35, ingredients: ["chicken","spices","lemon"], img: "https://images.unsplash.com/photo-1617196032780-32d53f0c4f4d?auto=format&fit=crop&w=400&h=300" },
    { name: "Veg Pasta", category: "Main Course", type: "Veg", prepTime: 20, ingredients: ["pasta","tomato","cheese"], img: "https://images.unsplash.com/photo-1617196032778-f11d7d2d823b?auto=format&fit=crop&w=400&h=300" },
    { name: "Chicken Sandwich", category: "Side", type: "Non-Veg", prepTime: 15, ingredients: ["bread","chicken","cheese"], img: "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&w=400&h=300" },
    { name: "Vegan Salad", category: "Vegan", type: "Veg", prepTime: 10, ingredients: ["lettuce","tomato","olive"], img: "https://images.unsplash.com/photo-1617196032774-82c2caa50eae?auto=format&fit=crop&w=400&h=300" },
    { name: "Banana Smoothie", category: "Breakfast", type: "Veg", prepTime: 5, ingredients: ["banana","milk","honey"], img: "https://images.unsplash.com/photo-1606312610729-1a623d20fbe8?auto=format&fit=crop&w=400&h=300" },
    { name: "French Fries", category: "Side", type: "Veg", prepTime: 20, ingredients: ["potato","salt","oil"], img: "https://images.unsplash.com/photo-1606312610725-823dbf26b909?auto=format&fit=crop&w=400&h=300" },
    { name: "Tomato Soup", category: "Side", type: "Veg", prepTime: 15, ingredients: ["tomato","cream","garlic"], img: "https://images.unsplash.com/photo-1606312610717-d8460cfb1e82?auto=format&fit=crop&w=400&h=300" },
    { name: "Chocolate Cake", category: "Dessert", type: "Veg", prepTime: 50, ingredients: ["chocolate","flour","sugar","egg"], img: "https://images.unsplash.com/photo-1617196032788-7c5a9f17e01d?auto=format&fit=crop&w=400&h=300" },
    { name: "Fried Fish", category: "Main Course", type: "Non-Veg", prepTime: 30, ingredients: ["fish","oil","spices"], img: "https://images.unsplash.com/photo-1617196032770-2f3c8725ebfd?auto=format&fit=crop&w=400&h=300" }
];

// Show current time
function showTime() {
    const now = new Date();
    const options = { hour: '2-digit', minute: '2-digit', second: '2-digit' };
    timeDisplay.textContent = `Current Time: ${now.toLocaleTimeString([], options)}`;
}
setInterval(showTime, 1000);
showTime();

// Highlight search terms
function highlight(text, terms) {
    if (!terms || terms.length === 0) return text;
    terms.forEach(term => {
        const regex = new RegExp(`(${term})`, 'gi');
        text = text.replace(regex, '<span class="highlight">$1</span>');
    });
    return text;
}

// Display recipes
function displayRecipes(recipesToShow, searchTerms = []) {
    recipeContainer.innerHTML = '';
    if (recipesToShow.length === 0) {
        recipeContainer.innerHTML = '<p>⚠ No recipes found.</p>';
        return;
    }
    recipesToShow.forEach(r => {
        const card = document.createElement('div');
        card.classList.add('recipe-card');

        const imgTag = document.createElement('img');
        imgTag.src = r.img;
        imgTag.onerror = function() {
            this.src = "https://via.placeholder.com/250x150.png?text=Image+Not+Found";
        }
        imgTag.alt = r.name;

        card.innerHTML = `
            <h3>${highlight(r.name, searchTerms)}</h3>
            <p><strong>Category:</strong> ${r.category}</p>
            <p><strong>Type:</strong> ${r.type}</p>
            <p><strong>Ingredients:</strong> ${highlight(r.ingredients.join(', '), searchTerms)}</p>
            <p><strong>Prep Time:</strong> ${r.prepTime} minutes</p>
        `;
        card.prepend(imgTag);
        recipeContainer.appendChild(card);
    });
}

// Filter recipes
function filterRecipes() {
    const searchText = searchInput.value.toLowerCase().trim();
    const searchTerms = searchText.split(',').map(s => s.trim()).filter(s => s);

    searchStatus.textContent = "Searching recipes...";
    apiUsed.textContent = "API/Source Used: Local Dataset";

    let filtered = recipes;

    // Filter by ingredients (AND search)
    if (searchTerms.length > 0) {
        filtered = filtered.filter(r => 
            searchTerms.every(term => r.ingredients.some(ing => ing.toLowerCase().includes(term)))
        );
    }

    // Filter by category
    const selectedCategory = categoryFilter.value;
    if (selectedCategory) filtered = filtered.filter(r => r.category === selectedCategory);

    // Filter by type
    const selectedType = typeFilter.value;
    if (selectedType) filtered = filtered.filter(r => r.type === selectedType);

    // Filter by max prep time
    const maxTimeValue = parseInt(maxTimeInput.value);
    if (maxTimeValue && !isNaN(maxTimeValue)) {
        filtered = filtered.filter(r => r.prepTime <= maxTimeValue);
    }

    displayRecipes(filtered, searchTerms);
    searchStatus.textContent = `Search completed. Found ${filtered.length} recipe(s).`;
}

// Event listeners
searchBtn.addEventListener('click', filterRecipes);
searchInput.addEventListener('keydown', e => { if (e.key === 'Enter') filterRecipes(); });
categoryFilter.addEventListener('change', filterRecipes);
typeFilter.addEventListener('change', filterRecipes);
maxTimeInput.addEventListener('input', filterRecipes);

// Initial message
recipeContainer.innerHTML = '<p>Type ingredients and click Search to fetch recipes...</p>';