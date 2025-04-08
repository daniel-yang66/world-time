export default function SettingsButton({ onHandleSettingClick }) {
  return (
    <img
      src="/icons/gear.png"
      height="27"
      width="27"
      alt="gear"
      onClick={(e) => {
        onHandleSettingClick(true);
      }}
      className="settings-btn"
    />
  );
}
