import { useEffect, useState } from 'react';
import axios from 'axios';

export default function ArticleFilterByJournalist() {
  const [articles, setArticles] = useState([]);
  const [journalists, setJournalists] = useState([]);
  const [selectedJournalistId, setSelectedJournalistId] = useState('');

  useEffect(() => {
    fetchJournalists();
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

  const fetchArticles = async (journalistId = '') => {
    try {
      const url = journalistId
        ? `http://localhost:3000/journalists/${journalistId}/articles`
        : 'http://localhost:3000/articles';
      const response = await axios.get(url);
      setArticles(response.data);
    } catch (error) {
      console.error('Error fetching articles:', error);
    }
  };

  const handleApplyFilters = () => {
    fetchArticles(selectedJournalistId);
  };

  const handleResetFilters = () => {
    setSelectedJournalistId('');
    fetchArticles();
  };

  const handleJournalistChange = (e) => {
    setSelectedJournalistId(e.target.value);
  };

  return (
    <div>
      <h2>Articles</h2>
      <div>
        <label htmlFor="journalistFilter">Filter by Journalist:</label>
        <select id="journalistFilter" value={selectedJournalistId} onChange={handleJournalistChange}>
          <option value="">All Journalists</option>
          {journalists.map(journalist => (
            <option key={journalist.id} value={journalist.id}>
              {journalist.name}
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
              <small>By Journalist #{article.journalistId} | Category #{article.categoryId}
                
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