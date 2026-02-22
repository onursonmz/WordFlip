import React from 'react';
import { Search, Settings, Filter } from 'lucide-react';

const Header = ({ searchQuery, setSearchQuery, activeFilter, setActiveFilter }) => {
    const filters = [
        { id: 'all', label: 'Tümü' },
        { id: 'favorites', label: 'Favoriler' },
        { id: 'study', label: 'Çalışma Listesi' }
    ];

    return (
        <header className="view-header">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h1 className="view-title" style={{ color: 'var(--primary)', letterSpacing: '-0.5px' }}>WordFlip</h1>
                <button className="btn btn-ghost" style={{ padding: '8px' }}>
                    <Settings size={24} />
                </button>
            </div>

            <div style={{ position: 'relative' }}>
                <Search
                    size={20}
                    style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}
                />
                <input
                    type="text"
                    placeholder="Kelime veya anlam ara..."
                    className="input-field"
                    style={{ paddingLeft: '44px' }}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            <div className="filter-tabs">
                {filters.map(filter => (
                    <button
                        key={filter.id}
                        className={`filter-tag ${activeFilter === filter.id ? 'active' : ''}`}
                        onClick={() => setActiveFilter(filter.id)}
                    >
                        {filter.label}
                    </button>
                ))}
            </div>
        </header>
    );
};

export default Header;
