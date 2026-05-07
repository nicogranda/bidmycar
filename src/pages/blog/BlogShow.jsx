import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { getConfig } from "../../config/env";
import "./Blog.css";

const BlogShow = () => {
  const { apiUrl } = getConfig();
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch(`${apiUrl}/index.php?page=blog&action=show&slug=${slug}`);
        const data = await res.json();

        if (data.status === "success") {
          setPost(data.post);
        } else {
          console.error("Error backend:", data.message);
        }
      } catch (err) {
        console.error("Error de red:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [slug, apiUrl]);

  if (loading) return <p>Cargando post...</p>;
  if (!post) return <p>Post no encontrado</p>;

  const styles = {
    container: {
      maxWidth: "800px",
      margin: "0 auto",
      padding: "2rem",
      fontFamily: "Arial, sans-serif",
      textAlign: "justify",
    },
    titleWrapper: {
      paddingTop: "2rem",
      paddingBottom: "2rem",
    },
    title: {
      textAlign: "center",
      margin: 0, // importante
    },
    heroImage: {
      width: "100%",
      height: "auto",
      marginBottom: "2rem",
      borderRadius: "8px",
      objectFit: "cover",
    },
    excerpt: {
      maxWidth: "720px",
      margin: "0 auto 0 auto",
      paddingTop: "1.5rem",
      // paddingBottom: "1.5rem",
      fontStyle: "italic",
      fontSize: "0.9em",
      // lineHeight: 1.6,
      textAlign: "justify",
      color: "#444",
    },    
    paragraph: { fontSize: "1.1rem", marginBottom: "1rem", lineHeight: 1.6 },
    // h2: { marginTop: "1.5rem", marginBottom: "0.5rem", textAlign: "left" },
    h2: {
      marginTop: "4.5rem",
      marginBottom: "0.75rem",
      lineHeight: 1.3,
      textAlign: "left",
    },
    
    image: { maxWidth: "100%", marginBottom: "1rem" },
  };

  const renderBlock = (block, index) => {
    switch (block.type) {
      case "p":
      case "intro":
        return (
          <div
            key={index}
            style={styles.paragraph}
            dangerouslySetInnerHTML={{ __html: block.content }}
          />
        );
      case "h1":
      case "h2":
      case "h3":
      case "h4":
      case "h5":
      case "h6":
        return (
          <div
            key={index}
            style={styles[block.type] || styles.h2}
            dangerouslySetInnerHTML={{ __html: block.content }}
          />
        );
      case "image":
        return (
          <img
            key={index}
            src={`${apiUrl}/uploads/${block.image}`}
            alt=""
            style={styles.image}
          />
        );
      default:
        return null;
    }
  };

  const schemaBlogPost = post && {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.meta_title || post.title,
    "description": post.meta_description,
    "image": `https://bidmycar.es/uploads/${post.og_image || post.image}`,
    "author": {
      "@type": "Organization",
      "name": "BidMyCar"
    },
    "publisher": {
      "@type": "Organization",
      "name": "BidMyCar",
      "logo": {
        "@type": "ImageObject",
        "url": "https://bidmycar.es/assets/img/logo.png"
      }
    },
    "datePublished": post.created_at,
    "dateModified": post.updated_at || post.created_at,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://bidmycar.es${post.canonical_url}`
    }
  };
  
  return (
    <div className="blog" style={styles.page}>
      {/* SEO */}
      {post && (
        <Helmet>
          <title>{post.meta_title || post.title}</title>

          <meta name="description" content={post.meta_description} />
          <meta name="author" content="BidMyCar" />

          <link
            rel="canonical"
            href={`https://bidmycar.es${post.canonical_url}`}
          />

          {/* Open Graph */}
          <meta property="og:type" content="article" />
          <meta property="og:title" content={post.meta_title || post.title} />
          <meta property="og:description" content={post.meta_description} />
          <meta
            property="og:url"
            content={`https://bidmycar.es${post.canonical_url}`}
          />
          <meta
            property="og:image"
            content={`https://bidmycar.es/uploads/${post.og_image || post.image}`}
          />

          {/* Twitter / X */}
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content={post.meta_title || post.title} />
          <meta name="twitter:description" content={post.meta_description} />
          <meta
            name="twitter:image"
            content={`https://bidmycar.es/uploads/${post.og_image || post.image}`}
          />

          {/* Schema.org JSON-LD */}
          <script type="application/ld+json">
            {JSON.stringify(schemaBlogPost)}
          </script>
        </Helmet>
      )}

      <div style={styles.titleWrapper}>
        <h1 style={styles.title}>{post.title}</h1>
      </div>

      {/* Hero Image full screen */}
      {post.image && (
        
        <div className="blog-hero">
          <img
            src={`${apiUrl}/uploads/${post.image}`}
            alt={post.title}
            title={post.title}
            className="blog-hero__image"
          />
        </div>
      )}

<div style={styles.excerpt}>
  {post.excerpt}
</div>


      {/* Content container */}
      <div style={styles.container}>

        <div
          className="post-content"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </div>
    </div>
  );
};

export default BlogShow;
