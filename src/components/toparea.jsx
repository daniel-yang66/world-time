export default function TopArea({ mode, children }) {
  return (
    <div className={mode === "night" ? `top-area ${mode}-bg` : "top-area"}>
      {children}
    </div>
  );
}
