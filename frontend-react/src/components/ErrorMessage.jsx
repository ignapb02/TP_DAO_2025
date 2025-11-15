export default function ErrorMessage({ msg }) {
    return (
        <div className="alert alert-danger mt-4">
            {msg}
        </div>
    );
}
