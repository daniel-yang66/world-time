export default function Settings({ openStatus, mode, children }) {
  return (
    <div className={openStatus === true ? `settings ${mode}-data` : "hidden"}>
      {children}
    </div>
  );
}
