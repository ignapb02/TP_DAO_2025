export default function Modal({ id, isOpen, onClose, title, children, maxWidth = '500px' }) {
    return (
        <div id={id} className={`modal ${isOpen ? 'active' : ''}`}>
            <div className="modal-content" style={{ maxWidth }}>
                <div className="modal-header">
                    <h3>{title}</h3>
                    <button className="close-btn" onClick={onClose}>×</button>
                </div>
                <div className="modal-body">
                    {children}
                </div>
            </div>
        </div>
    );
}
