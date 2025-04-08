export default function CreditButton({ onHandleCreditClick2 }) {
  return (
    <button
      className="credit-btn"
      onClick={(e) => {
        onHandleCreditClick2(true);
      }}
    >
      Credits
    </button>
  );
}
