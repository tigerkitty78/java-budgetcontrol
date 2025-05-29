import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Com = () => {
    const [data, setData] = useState([]);
    const [currentCategoryPage, setCurrentCategoryPage] = useState(0);
    const [tablePages, setTablePages] = useState({});
    const categoriesPerPage = 2;
    const tablesPerCategory = 3;
    const rowsPerTable = 5;

    const categories = {
        age: { name: 'Age-Specific', color: '#00b4d8', icon: '👶' },
        gender: { name: 'Gender-Specific', color: '#ff69b4', icon: '👩' },
        investment: { name: 'Investments', color: '#2a9d8f', icon: '📈' },
        standard: { name: 'Standard', color: '#6c757d', icon: '🏦' },
        cards: { name: 'Cards', color: '#f4a261', icon: '💳' },
        loans: { name: 'Loans', color: '#e76f51', icon: '💰' }
    };

    useEffect(() => {
        axios.get('http://127.0.0.1:5000/scrape')
            .then(response => {
                const grouped = groupData(response.data);
                setData(grouped);
                initializeTablePages(grouped);
            })
            .catch(console.error);
    }, []);

    const groupData = (data) => {
        return data.reduce((acc, item) => {
            const category = categorizeAccount(item.expand_link);
            if (!acc[category]) acc[category] = [];
            acc[category].push(item);
            return acc;
        }, {});
    };

    const categorizeAccount = (title) => {
        if (title.includes('Women')) return 'gender';
        if (title.includes('Children') || title.includes('Teen')) return 'age';
        if (title.includes('Loan') || title.includes('Gold')) return 'loans';
        if (title.includes('Credit') || title.includes('Debit')) return 'cards';
        if (title.includes('Investment') || title.includes('Deposit')) return 'investment';
        return 'standard';
    };

    const initializeTablePages = (groupedData) => {
        const initialPages = {};
        Object.keys(groupedData).forEach(category => {
            initialPages[category] = 0;
        });
        setTablePages(initialPages);
    };

    const handleTablePageChange = (category, direction) => {
        setTablePages(prev => ({
            ...prev,
            [category]: Math.max(0, prev[category] + direction)
        }));
    };

    const visibleCategories = Object.entries(categories)
        .slice(currentCategoryPage * categoriesPerPage, (currentCategoryPage + 1) * categoriesPerPage);

    return (
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '20px' }}>
            <h1 style={{ textAlign: 'center', margin: '40px 0', color: '#2d3436' }}>
                <span style={{ borderBottom: '3px solid #00b894' }}>Banking Products</span>
            </h1>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '25px' }}>
                {visibleCategories.map(([categoryKey, config]) => (
                    data[categoryKey]?.length > 0 && (
                        <div key={categoryKey} style={{
                            border: `1px solid ${config.color}30`,
                            borderRadius: '12px',
                            background: '#fff',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
                        }}>
                            <div style={{
                                padding: '15px',
                                background: `${config.color}15`,
                                borderBottom: `2px solid ${config.color}`,
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px'
                            }}>
                                <span style={{ fontSize: '1.4em' }}>{config.icon}</span>
                                <h3 style={{ margin: 0, color: config.color }}>
                                    {config.name} Accounts
                                </h3>
                            </div>

                            <div style={{ padding: '15px' }}>
                                <div style={{ display: 'grid', gap: '20px' }}>
                                    {data[categoryKey]
                                        .slice(tablePages[categoryKey] * tablesPerCategory, 
                                            (tablePages[categoryKey] + 1) * tablesPerCategory)
                                        .map((item, index) => (
                                        <div key={index} style={{
                                            border: '1px solid #eee',
                                            borderRadius: '8px',
                                            overflow: 'hidden'
                                        }}>
                                            <div style={{
                                                padding: '12px',
                                                background: '#f8f9fa',
                                                borderBottom: '1px solid #eee'
                                            }}>
                                                <div style={{ 
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center'
                                                }}>
                                                    <strong style={{ color: config.color }}>
                                                        {item.expand_link}
                                                    </strong>
                                                </div>
                                            </div>
                                            
                                            <div style={{ padding: '12px' }}>
                                                {item.table.data.slice(0, rowsPerTable).map((row, rowIndex) => (
                                                    <div key={rowIndex} style={{
                                                        padding: '8px 0',
                                                        display: 'grid',
                                                        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                                                        gap: '10px',
                                                        borderBottom: '1px solid #f0f0f0'
                                                    }}>
                                                        {item.table.headers.map((header, headerIndex) => (
                                                            <div key={headerIndex}>
                                                                <small style={{ 
                                                                    color: '#666',
                                                                    display: 'block',
                                                                    fontSize: '0.8em'
                                                                }}>{header}</small>
                                                                <div style={{ 
                                                                    fontWeight: 500,
                                                                    color: '#2d3436'
                                                                }}>{row[headerIndex]}</div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    marginTop: '15px',
                                    padding: '0 10px'
                                }}>
                                    <button
                                        onClick={() => handleTablePageChange(categoryKey, -1)}
                                        disabled={tablePages[categoryKey] === 0}
                                        style={{
                                            padding: '6px 12px',
                                            background: 'none',
                                            border: `1px solid ${config.color}`,
                                            color: config.color,
                                            borderRadius: '20px',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        ← Previous
                                    </button>
                                    
                                    <span style={{ color: '#666' }}>
                                        {Math.min(
                                            (tablePages[categoryKey] + 1) * tablesPerCategory, 
                                            data[categoryKey].length
                                        )} of {data[categoryKey].length}
                                    </span>

                                    <button
                                        onClick={() => handleTablePageChange(categoryKey, 1)}
                                        disabled={(tablePages[categoryKey] + 1) * tablesPerCategory >= data[categoryKey].length}
                                        style={{
                                            padding: '6px 12px',
                                            background: config.color,
                                            border: 'none',
                                            color: 'white',
                                            borderRadius: '20px',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        Next →
                                    </button>
                                </div>
                            </div>
                        </div>
                    )
                ))}
            </div>

            <div style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '20px',
                margin: '40px 0',
                padding: '20px 0',
                borderTop: '1px solid #eee'
            }}>
                <button
                    onClick={() => setCurrentCategoryPage(p => Math.max(0, p - 1))}
                    disabled={currentCategoryPage === 0}
                    style={{
                        padding: '10px 25px',
                        background: '#00b894',
                        color: 'white',
                        border: 'none',
                        borderRadius: '25px',
                        cursor: 'pointer'
                    }}
                >
                    Previous Category
                </button>
                
                <button
                    onClick={() => setCurrentCategoryPage(p => p + 1)}
                    disabled={(currentCategoryPage + 1) * categoriesPerPage >= Object.keys(categories).length}
                    style={{
                        padding: '10px 25px',
                        background: '#00b894',
                        color: 'white',
                        border: 'none',
                        borderRadius: '25px',
                        cursor: 'pointer'
                    }}
                >
                    Next Category
                </button>
            </div>
        </div>
    );
};

export default Com;