// Your API Key
const API_KEY = 'f00a3db19f56451da3146f24820faee5';

// Default placeholder image for articles without an image
const DEFAULT_IMAGE = 'https://via.placeholder.com/300x200?text=No+Image';

// Function to check if an image URL is valid
const validateImageUrl = (url) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = url;
    img.onload = () => resolve(url); // If the image loads, use the URL
    img.onerror = () => resolve(DEFAULT_IMAGE); // If it fails, use the default image
  });
};

// Fetch news articles based on category
const fetchNews = async (category) => {
  try {
    const response = await fetch(
      `https://newsapi.org/v2/top-headlines?category=${category}&country=us&apiKey=${API_KEY}`
    );
    const data = await response.json();
    displayNews(data.articles);
  } catch (error) {
    console.error('Error fetching news:', error);
  }
};

// Display news articles in the UI
const displayNews = (articles) => {
  const newsFeed = document.getElementById('newsFeed');
  newsFeed.innerHTML = '';

  articles.forEach(async (article) => {
    const articleImage = article.urlToImage ? await validateImageUrl(article.urlToImage) : DEFAULT_IMAGE;

    const articleDiv = document.createElement('div');
    articleDiv.classList.add('bg-white', 'rounded-lg', 'shadow-lg', 'p-6', 'mb-6', 'transition-transform', 'transform', 'hover:scale-105');

    articleDiv.innerHTML = `
      <img src="${articleImage}" alt="${article.title}" class="w-full h-40 object-cover rounded-md mb-4" />
      <h3 class="text-lg font-semibold mb-2">${article.title}</h3>
      <p class="text-sm text-gray-600 mb-4">${article.description || 'No description available'}</p>
      <div class="flex justify-between">
        <button onclick="saveArticle('${article.url}', '${article.title}')" class="bg-green-500 hover:bg-green-400 text-white py-2 px-4 rounded-lg">Save</button>
        <a href="${article.url}" target="_blank" class="bg-blue-500 hover:bg-blue-400 text-white py-2 px-4 rounded-lg">Read More</a>
      </div>
    `;
    newsFeed.appendChild(articleDiv);
  });
};

// Save article to localStorage
const saveArticle = (url, title) => {
  let savedArticles = JSON.parse(localStorage.getItem('savedArticles')) || [];
  const articleExists = savedArticles.some((article) => article.url === url);

  if (!articleExists) {
    savedArticles.push({ url, title });
    localStorage.setItem('savedArticles', JSON.stringify(savedArticles));
    displaySavedArticles();
  } else {
    alert('Article already saved!');
  }
};

// Display saved articles from localStorage
const displaySavedArticles = () => {
  const savedArticlesDiv = document.getElementById('savedArticles');
  const savedArticles = JSON.parse(localStorage.getItem('savedArticles')) || [];

  savedArticlesDiv.innerHTML = '';
  savedArticles.forEach((article) => {
    const articleDiv = document.createElement('div');
    articleDiv.classList.add('bg-gray-200', 'p-4', 'rounded-lg', 'shadow-sm', 'mb-4');

    articleDiv.innerHTML = `
      <h3 class="text-md font-semibold mb-2">${article.title}</h3>
      <a href="${article.url}" target="_blank" class="text-blue-600 underline">Read More</a>
    `;
    savedArticlesDiv.appendChild(articleDiv);
  });
};

// Load saved articles on page load
window.onload = displaySavedArticles;
