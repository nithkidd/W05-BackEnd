import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

export default function ArticlePage() {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // Function to fetch article by ID

    const fetchArticle = async () => {
      try {
        const response = await fetch(`http://localhost:3000/articles/${id}`);
        if (!response.ok) {
          throw new Error("Article not found");
        }
        const data = await response.json();
        setArticle(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchArticle();
  }, [id]);

  if (loading) return <div>Loading article...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!article) return <div>No article found.</div>;

  return (
    <div>
      <h2>{article.title}</h2>
      <p>{article.content}</p>
      <div>
        <strong>Journalist ID:</strong> {article.journalistId}
      </div>
      <div>
        <strong>Category ID:</strong> {article.categoryId}
      </div>
    </div>
  );
}
