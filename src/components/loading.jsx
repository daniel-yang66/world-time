export default function Loading({ mode }) {
  return (
    <div className={mode === "day" ? "loading day-data" : "loading night-data"}>
      <img
        src="/icons/wind.png"
        height="40"
        width="40"
        alt="icon"
        className="loading-icon"
      />
    </div>
  );
}
