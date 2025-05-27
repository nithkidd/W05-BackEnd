import { useEffect, useState } from 'react';
import axios from 'axios';

export default function ArticleFilter() {
  const [articles, setArticles] = useState([]);
  const [journalists, setJournalists] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedJournalistId, setSelectedJournalistId] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState('');

  // Fetch journalists, categories, and initial articles on component mount
  useEffect(() => {
    fetchJournalists();
    fetchCategories();
    fetchArticles();
  }, []);

  const fetchJournalists = async () => {
    try {
      const response = await axios.get('http://localhost:3000/journalists');
      setJournalists(response.data);
    } catch (error) {
      console.error('Error fetching journalists:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://localhost:3000/categories');
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchArticles = async (journalistId = '', categoryId = '') => {
    try {
      let fetchedArticles = [];
      if (journalistId) {
        // Fetch articles by journalist
        const response = await axios.get(`http://localhost:3000/journalists/${journalistId}/articles`);
        fetchedArticles = response.data;
        console.log('Articles from journalist:', fetchedArticles);
        // Apply category filter client-side if selected
        if (categoryId) {
          fetchedArticles = fetchedArticles.filter(
            article => article.categoryId === parseInt(categoryId)
          );
          console.log('After category filter:', fetchedArticles);
        }
      } else if (categoryId) {
        // Fetch articles by category
        const response = await axios.get(`http://localhost:3000/categories/${categoryId}/articles`);
        fetchedArticles = response.data;
        console.log('Articles from category:', fetchedArticles);
        // Apply journalist filter client-side if selected (optional)
        if (journalistId) {
          fetchedArticles = fetchedArticles.filter(
            article => article.journalistId === parseInt(journalistId)
          );
          console.log('After journalist filter:', fetchedArticles);
        }
      } else {
        // Fetch all articles
        const response = await axios.get('http://localhost:3000/articles');
        fetchedArticles = response.data;
        console.log('All articles:', fetchedArticles);
      }
      setArticles(fetchedArticles);
    } catch (error) {
      console.error('Error fetching articles:', error);
      setArticles([]);
    }
  };

  const handleApplyFilters = () => {
    fetchArticles(selectedJournalistId, selectedCategoryId);
  };

  const handleResetFilters = () => {
    setSelectedJournalistId('');
    setSelectedCategoryId('');
    fetchArticles();
  };

  const handleJournalistChange = (e) => {
    setSelectedJournalistId(e.target.value);
  };

  const handleCategoryChange = (e) => {
    setSelectedCategoryId(e.target.value);
  };

  return (
    <div>
      <h2>Articles</h2>
      <div>
        <label htmlFor="journalistFilter">Filter by Journalist:</label>
        <select
          id="journalistFilter"
          value={selectedJournalistId}
          onChange={handleJournalistChange}
        >
          <option value="">All Journalists</option>
          {journalists.map(journalist => (
            <option key={journalist.id} value={journalist.id}>
              {journalist.name}
            </option>
          ))}
        </select>

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
              <strong>{article.title || 'Untitled'}</strong> <br />
              <small>
                By {journalists.find(j => j.id === article.journalistId)?.name || 'Unknown'} | 
                Category {categories.find(c => c.id === article.categoryId)?.name || 'Unknown'}
              </small>
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