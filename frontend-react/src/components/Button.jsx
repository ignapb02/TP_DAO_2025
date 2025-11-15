export default function Button({ 
    variant = 'primary', 
    size = 'default', 
    onClick, 
    disabled = false, 
    children,
    className = '',
    ...props 
}) {
    const sizeClass = size === 'small' ? 'btn-small' : '';
    const variantClass = `btn-${variant}`;
    
    return (
        <button 
            className={`btn ${variantClass} ${sizeClass} ${className}`}
            onClick={onClick}
            disabled={disabled}
            {...props}
        >
            {children}
        </button>
    );
}
