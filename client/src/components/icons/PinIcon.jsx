export default function PinIcon({ className = "w-4 h-4" }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 2v6.5L7 10v1h4v10l1 1 1-1V11h4v-1l-2-1.5V2H9z"
      />
    </svg>
  );
}
