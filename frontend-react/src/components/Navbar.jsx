import { Link } from "react-router-dom";

export default function Navbar() {
    return (
        <nav className="navbar navbar-expand-lg bg-dark navbar-dark px-4">
            <Link className="navbar-brand" to="/">Turnero Médico</Link>

            <div className="collapse navbar-collapse">
                <ul className="navbar-nav ms-auto">
                    <li className="nav-item">
                        <Link className="nav-link" to="/pacientes">Pacientes</Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" to="/medicos">Médicos</Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" to="/turnos">Turnos</Link>
                    </li>
                </ul>
            </div>
        </nav>
    );
}
