import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getConfig } from "../../config/env";
import EditorCommandButton from "../../components/editor/EditorCommandButton";
import { EDITOR_COMMANDS } from "../../components/editor/EditorCommands";
import "./Blog.css";

const BlogEdit = () => {
  const { apiUrl } = getConfig();
  const navigate = useNavigate();
  const { slug } = useParams();

  const [user, setUser] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [featuredImageFile, setFeaturedImageFile] = useState(null);

  const contentRef = useRef(null);
  const fileInputRef = useRef(null);

  /* ================= AUTH CHECK ================= */
  useEffect(() => {
    fetch(`${apiUrl}/api/session.php`, { credentials: "include" })
      .then(res => res.json())
      .then(data => {
        const sessionUser = data.session?.user || null;
        if (!sessionUser || sessionUser.role !== "admin") {
          navigate("/login");
          return;
        }
        setUser(sessionUser);
        setAuthChecked(true);
      })
      .catch(() => navigate("/login"));
  }, [apiUrl, navigate]);

  /* ================= FETCH POST ================= */
  useEffect(() => {
    if (!authChecked) return;

    const fetchPost = async () => {
      try {
        const res = await fetch(
          `${apiUrl}/index.php?page=blog&action=show&slug=${slug}`
        );
        const data = await res.json();
        if (data.status === "success" && data.post) {
          setPost(data.post);
        } else {
          alert("Post no encontrado");
        }
      } catch {
        alert("Error de red");
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [authChecked, slug, apiUrl]);

  if (!authChecked) return <p>Verificando permisos…</p>;
  if (loading) return <p>Cargando post…</p>;
  if (!post) return <p>Post no encontrado</p>;

  /* ================= EDITOR CORE ================= */
  const exec = (command, value = null) => {
    contentRef.current?.focus();
    document.execCommand(command, false, value);
  };

  const insertHeading = level => exec("formatBlock", `H${level}`);
  const addLink = () => {
    const url = prompt("URL");
    if (url) exec("createLink", url);
  };
  const triggerImageUpload = () => fileInputRef.current.click();
  const insertImage = e => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => exec("insertImage", reader.result);
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const editorCommands = EDITOR_COMMANDS({ exec, insertHeading, addLink, triggerImageUpload });

  /* ================= HANDLERS ================= */
  const handleTitleChange = e => setPost(prev => ({ ...prev, title: e.target.value }));
  const handleImageChange = e => {
    const file = e.target.files[0];
    if (file) setFeaturedImageFile(file);
    e.target.value = "";
  };

  const handleSave = async () => {
    if (!post.title.trim()) {
      alert("El título es obligatorio");
      return;
    }

    const content = contentRef.current?.innerHTML || "";
    setSaving(true);

    try {
      const formData = new FormData();
      formData.append("title", post.title);
      formData.append("content", content);
      if (featuredImageFile) formData.append("featured_image", featuredImageFile);

      const res = await fetch(
        `${apiUrl}/index.php?page=blog&action=update&slug=${slug}`,
        { method: "POST", body: formData }
      );

      const data = await res.json();
      if (data.status === "success") navigate(`/blog/${post.slug}`);
      else alert("Error al actualizar: " + data.message);
    } catch {
      alert("Error de red");
    } finally {
      setSaving(false);
    }
  };

  /* ================= STYLES ================= */
  const styles = {
    container: { maxWidth: "800px", margin: "0 auto", padding: "2rem", fontFamily: "Arial, sans-serif" },
    titleInput: { fontSize: "2rem", width: "100%", marginBottom: "1rem", padding: "0.5rem" },
    image: { width: "100%", marginBottom: "1rem", borderRadius: "8px" },
    scroller: { minHeight: "250px", maxHeight: "400px", overflowY: "auto", border: "1px solid #ddd", padding: "1rem", borderRadius: "8px", marginBottom: "1rem", textAlign: "left" },
  };

  /* ================= RENDER ================= */
  return (
    <div style={styles.container}>
      {post.image && <img src={`${apiUrl}/uploads/${post.image}`} alt={post.title} style={styles.image} />}

      <input type="text" value={post.title} onChange={handleTitleChange} style={styles.titleInput} />

      <div ref={contentRef} style={styles.scroller} contentEditable suppressContentEditableWarning dangerouslySetInnerHTML={{ __html: post.content }} />

      <div className="toolbar editor-toolbar">
        {editorCommands.map(cmd => (
          <EditorCommandButton key={cmd.type} type={cmd.type} title={cmd.title} onClick={cmd.action} />
        ))}
      </div>

      <input ref={fileInputRef} type="file" accept="image/*" hidden onChange={insertImage} />
      <input type="file" accept="image/*" onChange={handleImageChange} />

      <button onClick={handleSave} disabled={saving}>{saving ? "Guardando…" : "Guardar cambios"}</button>
    </div>
  );
};

export default BlogEdit;
