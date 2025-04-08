export default function CreditButton({ onHandleCreditClick2 }) {
  return (
    <div
      className="credit-btn"
      onClick={(e) => {
        onHandleCreditClick2(true);
      }}
    >
      Credits
    </div>
  );
}
