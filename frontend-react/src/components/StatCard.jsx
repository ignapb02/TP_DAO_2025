export default function StatCard({ icon, number, label }) {
    return (
        <div className="stat-card">
            <div className="icon">{icon}</div>
            <div className="number">{number}</div>
            <div className="label">{label}</div>
        </div>
    );
}
