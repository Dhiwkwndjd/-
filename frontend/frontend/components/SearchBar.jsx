import "./SearchBar.css";

function SearchBar({ search, setSearch }) {
  return (
    <div className="search-container">
      <h2>Поиск поездок</h2>

      <input
        className="search-input"
        type="text"
        placeholder="Введите город..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
    </div>
  );
}

export default SearchBar;