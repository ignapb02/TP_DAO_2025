export default function Form({ onSubmit, children, className = '' }) {
    return (
        <form onSubmit={onSubmit} className={className}>
            {children}
        </form>
    );
}

export function FormGroup({ label, error, children, ...props }) {
    return (
        <div className="form-group" {...props}>
            {label && <label>{label}</label>}
            {children}
            {error && <span style={{ color: '#dc3545', fontSize: '0.85rem', marginTop: '4px' }}>{error}</span>}
        </div>
    );
}

export function FormRow({ children, className = '' }) {
    return (
        <div className={`form-row ${className}`}>
            {children}
        </div>
    );
}

export function FormActions({ children, className = '' }) {
    return (
        <div className={`form-actions ${className}`}>
            {children}
        </div>
    );
}
