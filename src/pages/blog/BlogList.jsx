import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getConfig } from "../../config/env";
import "./BlogList.css";

const BlogList = () => {
  const { apiUrl } = getConfig();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await fetch(`${apiUrl}/index.php?page=blog&action=index`);
      const data = await res.json();
      if (data.status === "success" && data.posts.length) {
        setPosts(data.posts.slice(0, 8)); // máximo 8 posts
      }
    } catch (err) {
      console.error("Error cargando posts:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Cargando blog…</p>;
  if (!posts.length) return <p>No hay posts publicados.</p>;

  return (
    <div className="blog-container">
      {/* HERO / GIRO */}
      <div className="blog-hero">
        <img
          src={`${apiUrl}/uploads/693ed691cdb91.jpg`} // Cambia por tu imagen de hero
          alt="Hero destacado"
          className="hero-img"
        />
        <div className="hero-text">
          <h1>Información</h1>
          <p>Actualizaciones y novedades sobre coches</p>
        </div>
      </div>

      {/* GALERÍA DE POSTS */}
      <div className="blog-gallery">
        {posts.map((post) => (
          <div key={post.id} className="gallery-item">
            <Link to={`/blog/${post.slug}`} className="gallery-link">
              {post.image && (
                <img
                  src={`${apiUrl}/uploads/${post.image}`}
                  alt={post.title}
                  className="gallery-img"
                />
              )}
              <h3 className="gallery-title">{post.title}</h3>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BlogList;
