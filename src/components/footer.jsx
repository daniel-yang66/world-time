import CreditButton from "./creditBtn";
export default function Footer({ onHandleCreditClick }) {
  return (
    <footer className="footer">
      &copy;{" "}
      <a
        href="https://www.linkedin.com/in/daniel-yang-a17ab3229/"
        target="_blank"
        rel="noreferrer"
        className="a"
      >
        Daniel Yang
      </a>{" "}
      | Powered by{" "}
      <a
        href="https://www.visualcrossing.com/"
        target="_blank"
        rel="noreferrer"
        className="a"
      >
        Visual Crossing
      </a>{" "}
      | <CreditButton onHandleCreditClick2={onHandleCreditClick} />
    </footer>
  );
}
