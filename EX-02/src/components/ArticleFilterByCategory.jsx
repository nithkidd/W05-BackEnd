import { useEffect, useState } from 'react';
import axios from 'axios';

export default function ArticleFilterByCategory() {
  const [articles, setArticles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState('');

  useEffect(() => {
    fetchCategories();
    fetchArticles();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://localhost:3000/categories');
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchArticles = async (categoryId = '') => {
    try {
      const url = categoryId
        ? `http://localhost:3000/categories/${categoryId}/articles`
        : 'http://localhost:3000/articles';
      const response = await axios.get(url);
      setArticles(response.data);
    } catch (error) {
      console.error('Error fetching articles:', error);
    }
  };

  const handleApplyFilters = () => {
    fetchArticles(selectedCategoryId);
  };

  const handleResetFilters = () => {
    setSelectedCategoryId('');
    fetchArticles();
  };

  const handleCategoryChange = (e) => {
    setSelectedCategoryId(e.target.value);
  };

  return (
    <div>
      <h2>Articles</h2>
      <div>
        <label htmlFor="categoryFilter">Filter by Category:</label>
        <select
          id="categoryFilter"
          value={selectedCategoryId}
          onChange={handleCategoryChange}
        >
          <option value="">All Categories</option>
          {categories.map(category => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
        <button onClick={handleApplyFilters}>Apply Filters</button>
        <button onClick={handleResetFilters}>Reset Filters</button>
      </div>
      <ul>
        {articles.length === 0 ? (
          <p>No articles found.</p>
        ) : (
          articles.map(article => (
            <li key={article.id}>
              <strong>{article.title}</strong> <br />
              <small>By Journalist #{article.journalistId} | Category #{article.categoryId}</small>
              <br />
              <button disabled>Delete</button>
              <button disabled>Update</button>
              <button disabled>View</button>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}