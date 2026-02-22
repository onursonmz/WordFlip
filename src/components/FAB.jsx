import React from 'react';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const FAB = () => {
    const navigate = useNavigate();

    return (
        <button className="fab" onClick={() => navigate('/add')}>
            <Plus size={32} />
        </button>
    );
};

export default FAB;
