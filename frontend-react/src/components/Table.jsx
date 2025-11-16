export default function Table({ data, columns, actions, onSort, onRemoveSort, sortConfig }) {
    if (!data || data.length === 0) {
        return (
            <p style={{ textAlign: 'center', color: '#999', padding: '40px' }}>
                No hay datos disponibles
            </p>
        );
    }

    const getHeaderStyle = (col) => {
        if (!col.sortable) return {};
        
        const isActive = sortConfig?.some(s => s.campo === col.key);
        return {
            cursor: 'pointer',
            backgroundColor: isActive ? '#e7f3ff' : 'transparent',
            color: isActive ? '#007bff' : '#333',
            fontWeight: isActive ? '600' : '400',
            userSelect: 'none',
            position: 'relative'
        };
    };

    const getSortIndicator = (col) => {
        if (!col.sortable) return null;

        const sortField = sortConfig?.find(s => s.campo === col.key);
        if (!sortField) return null;

        // Solo retornar la flecha de dirección, sin número de prioridad
        return sortField.direccion === 'asc' ? '↑' : '↓';
    };

    const handleHeaderClick = (e, col) => {
        if (!col.sortable) return;

        // Si es Ctrl+Click, remover el ordenamiento de esta columna
        if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            onRemoveSort && onRemoveSort(col.key);
        } else {
            // Click normal, cambiar orden o agregar nuevo ordenamiento
            onSort && onSort(col.key);
        }
    };

    return (
        <div className="table-container">
            <table>
                <thead>
                    <tr>
                        {columns.map((col) => (
                            <th 
                                key={col.key}
                                onClick={(e) => handleHeaderClick(e, col)}
                                style={getHeaderStyle(col)}
                                title={col.sortable ? 'Click para ordenar, Ctrl+Click para remover' : ''}
                            >
                                <span style={{ display: 'inline-block' }}>{col.label}</span>
                                {(() => {
                                    const ind = getSortIndicator(col);
                                    if (!ind) return null;
                                    return (
                                        <span style={{ marginLeft: 8, fontSize: '0.95rem', color: '#007bff', fontWeight: 600 }}>
                                            {ind}
                                        </span>
                                    );
                                })()}
                            </th>
                        ))}
                        {actions && <th style={{ width: '150px' }}>Acciones</th>}
                    </tr>
                </thead>
                <tbody>
                    {data.map((row, index) => (
                        <tr key={row.id || index}>
                            {columns.map((col) => (
                                <td key={col.key}>
                                    {col.render ? col.render(row) : row[col.key]}
                                </td>
                            ))}
                            {actions && (
                                <td>
                                    <div className="table-actions">
                                        {actions(row, index)}
                                    </div>
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
