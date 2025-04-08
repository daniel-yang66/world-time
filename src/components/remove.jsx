export default function Removebutton({
  list,
  func,
  location,
  resetActive,
  activeCity,
  mode,
}) {
  return (
    <div
      className={mode === "day" ? `remove ${mode}-data` : `remove ${mode}-data`}
      onClick={() => {
        if (activeCity === location) resetActive("");

        func(
          list.filter((fave) => {
            return fave[0] !== location;
          })
        );
        localStorage.setItem(
          "faves",
          JSON.stringify(
            list.filter((fave) => {
              return fave[0] !== location;
            })
          )
        );
      }}
    >
      X
    </div>
  );
}
