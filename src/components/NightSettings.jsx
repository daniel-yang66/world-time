export default function NightSettings({
  curSettings,
  onSetNightSched,
  onCheckMode,
  curMode,
}) {
  return (
    <>
      <h4>Dark Mode</h4>
      <div className="night-schedule">
        <input
          type="time"
          className="mode-from"
          value={curSettings[0]}
          onChange={(e) => {
            onSetNightSched([e.target.value, curSettings[1]]);
            onCheckMode(curMode);
            localStorage.setItem(
              "nightSched",
              JSON.stringify([e.target.value, curSettings[1]])
            );
          }}
        />
        To
        <input
          type="time"
          className="mode-to"
          value={curSettings[1]}
          onChange={(e) => {
            onSetNightSched([curSettings[0], e.target.value]);
            onCheckMode(curMode);
            localStorage.setItem(
              "nightSched",
              JSON.stringify([curSettings[0], e.target.value])
            );
          }}
        />
      </div>
    </>
  );
}
