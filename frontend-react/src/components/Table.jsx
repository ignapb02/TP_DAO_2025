export default function Table({ data, columns, actions }) {
    if (!data || data.length === 0) {
        return (
            <p style={{ textAlign: 'center', color: '#999', padding: '40px' }}>
                No hay datos disponibles
            </p>
        );
    }

    return (
        <div className="table-container">
            <table>
                <thead>
                    <tr>
                        {columns.map((col) => (
                            <th key={col.key}>{col.label}</th>
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
