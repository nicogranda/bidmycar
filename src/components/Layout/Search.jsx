import { useState, useEffect } from "react";
import "./Search.css";

function VehicleSearch({ apiUrl }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      return;
    }

    const delay = setTimeout(async () => {
      setLoading(true);

      try {
        const res = await fetch(
          `${apiUrl}/api/products/read.php?search=${encodeURIComponent(query)}`
        );

        if (!res.ok) throw new Error("Error en servidor");

        const data = await res.json();
        setResults(data);
      } catch (err) {
        console.error(err);
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(delay);
  }, [query, apiUrl]);

  return (
    <div>
      <form className="search-form" onSubmit={(e) => e.preventDefault()}>
        <input
          type="text"
          placeholder="Buscar por marca, modelo, año, color o localidad..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type="submit" title="Buscar">
          <i className="fas fa-search"></i>
        </button>
      </form>

      {loading && <p>Buscando...</p>}

      <ul>
        {results.map((v) => (
          <li key={v.id}>
            {v.year} {v.brand} {v.model} ({v.color}) en {v.location_name ?? "N/A"}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default VehicleSearch;
