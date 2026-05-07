import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getConfig } from "../../config/env";

import EditorCommandButton from "../../components/editor/EditorCommandButton";
import { EDITOR_COMMANDS } from "../../components/editor/EditorCommands";

import "./Blog.css";

export default function BlogCreate() {
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [step, setStep] = useState(1);
  const [featuredImage, setFeaturedImage] = useState(null);
  const [saving, setSaving] = useState(false);

  const editableRef = useRef(null);
  const fileInputRef = useRef(null);

  const navigate = useNavigate();
  const { apiUrl } = getConfig();

  const slugify = (text) =>
    text
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/ñ/gi, "n")
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

  const slug = slugify(title);

  /* ================= SEO COUNTERS ================= */
  const titleLength = title.length;
  const titleClass =
    titleLength < 40
      ? "seo-warning"
      : titleLength <= 60
      ? "seo-success"
      : "seo-danger";

  const excerptLength = excerpt.length;
  const excerptClass =
    excerptLength < 120
      ? "seo-warning"
      : excerptLength <= 300
      ? "seo-success"
      : "seo-danger";

  const metaLength = metaDescription.length;
  const metaClass =
    metaLength < 120
      ? "seo-warning"
      : metaLength <= 160
      ? "seo-success"
      : "seo-danger";

  /* ================= AUTO META FROM CONTENT ================= */
  useEffect(() => {
    if (editableRef.current && !metaDescription) {
      const text = editableRef.current.innerText || "";
      if (text) setMetaDescription(text.substring(0, 160));
    }
  }, [step, metaDescription]);

  const exec = (command, value = null) => {
    editableRef.current?.focus();
    document.execCommand(command, false, value);
  };

  const insertHeading = (level) => exec("formatBlock", `h${level}`);
  const addLink = () => {
    const url = prompt("URL");
    if (url) exec("createLink", url);
  };

  const triggerImageUpload = () => fileInputRef.current.click();

  const insertImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => exec("insertImage", reader.result);
    reader.readAsDataURL(file);

    e.target.value = "";
  };

  const savePost = async () => {
    if (!title.trim()) {
      alert("El título es obligatorio");
      return;
    }

    if (saving) return;
    setSaving(true);

    const content = editableRef.current?.innerHTML || "";

    const formData = new FormData();
    formData.append("title", title);
    formData.append("slug", slug);
    formData.append("excerpt", excerpt);
    formData.append("content", content);
    if (featuredImage) formData.append("featured_image", featuredImage);
    formData.append("meta_title", title);
    formData.append("meta_description", metaDescription.substring(0, 160));
    formData.append("canonical_url", `/blog/${slug}`);

    try {
      const res = await fetch(`${apiUrl}/index.php?page=blog&action=store`, {
        method: "POST",
        body: formData,
      });

      const text = await res.text();
      const data = JSON.parse(text);

      if (data.status === "success") {
        navigate(`/blog/${data.slug || slug}`);
      } else {
        alert(data.message || "Error al crear el post");
      }
    } catch (err) {
      alert("Error de red");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div id="editor">
      <div className="title-step">
        {/* ===== TITLE ===== */}
        <input
          className="title-input"
          placeholder="Título del post (H1)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          readOnly={step > 1}
        />

        {title && (
          <div className="slug-row">
            <span>
              <strong>Slug:</strong> {slug}
            </span>
            <span className={`seo-counter ${titleClass}`}>
              {titleLength} /(55-75)
            </span>
          </div>
        )}

        {/* ===== EXCERPT / PRÓLOGO ===== */}
        <textarea
          className="title-input"
          placeholder="Prólogo / excerpt visible del post"
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          rows={4}
          style={{ width: "100%", marginTop: "1rem", padding: "0.5rem" }}
          readOnly={step > 1}
        />

        <div className="slug-row">
          <span></span>
          <span className={`seo-counter ${excerptClass}`}>
            {excerptLength} /(120-300)
          </span>
        </div>

        {/* ===== META DESCRIPTION ===== */}
        <textarea
          className="title-input"
          placeholder="Meta description (SEO, Google, OG, X)"
          value={metaDescription}
          onChange={(e) => setMetaDescription(e.target.value)}
          maxLength={160}
          rows={3}
          style={{ width: "100%", marginTop: "1rem", padding: "0.5rem" }}
          readOnly={step > 1}
        />

        <div className="slug-row">
          <span></span>
          <span className={`seo-counter ${metaClass}`}>
            {metaLength} / 160
          </span>
        </div>
      </div>

      {/* ===== FEATURED IMAGE ===== */}
      {step >= 2 && (
        <div className="featured-image-step">
          <p>Imagen destacada (opcional)</p>
          <button onClick={triggerImageUpload}>Cargar imagen</button>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            hidden
            onChange={(e) => setFeaturedImage(e.target.files[0])}
          />
          {featuredImage && <p>{featuredImage.name}</p>}
        </div>
      )}

      {/* ===== CONTENT ===== */}
      {step === 3 && (
        <>
          <div
            ref={editableRef}
            className="editable"
            contentEditable
            suppressContentEditableWarning
          />

          <div className="toolbar editor-toolbar">
            {EDITOR_COMMANDS({
              exec,
              insertHeading,
              addLink,
              triggerImageUpload,
            }).map((cmd) => (
              <EditorCommandButton
                key={cmd.type}
                type={cmd.type}
                title={cmd.title}
                onClick={cmd.action}
              />
            ))}
          </div>

          <button className="save-btn" onClick={savePost} disabled={saving}>
            {saving ? "Guardando..." : "Guardar post"}
          </button>
        </>
      )}

      {step === 1 && title && (
        <button onClick={() => setStep(2)}>Continuar</button>
      )}
      {step === 2 && title && (
        <div className="step-section step-continue">
          <button onClick={() => setStep(3)}>
            Continuar a contenido
          </button>
        </div>
      )}

    </div>
  );
}
