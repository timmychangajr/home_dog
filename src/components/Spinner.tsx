import '../styles/Spinner.css';
export default function Spinner({ className }: { className?: string }) {
  return (
    <div className={`spinner ${className}`} />
  );
}
