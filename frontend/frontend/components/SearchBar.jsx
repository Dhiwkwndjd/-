import { Search } from "lucide-react";
import "./SearchBar.css"

export default function SearchBar({ search, setSearch }) {
    return (
        <div className="search-container">
            <div className="search-box">
                <Search className="search-icon" size={24} />

                <input
                  className="search-input"
                  type="text"
                  placeholder="Введите город..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
            </div>
        </div>
    );
}