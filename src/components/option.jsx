import tz_lookup from "tz-lookup";

export default function Option({
  loc,
  favesList,
  onSetFavesList,
  onSetSelection,
  onSetInputValue,
  mode,
}) {
  function handleOptionClick(newItem) {
    let stop = false;
    favesList.forEach((fave) => {
      if (newItem.split(" | ")[0] === fave[0]) {
        stop = true;
      }
    });
    if (stop === true) return;
    if (favesList.length >= 6) {
      alert("You already have 6 cities. Remove one, then add new one.");
      return;
    }

    onSetFavesList([
      [
        newItem.split(" | ")[0],
        tz_lookup(
          newItem.split(" | ")[1].split(",")[0],
          newItem.split(" | ")[1].split(",")[1]
        ),
        newItem.split(" | ")[1].split(",")[0],
        newItem.split(" | ")[1].split(",")[1],
      ],
      ...(favesList.length >= 6 ? favesList.pop() : favesList),
    ]);

    localStorage.setItem(
      "faves",
      JSON.stringify([
        [
          newItem.split(" | ")[0],
          tz_lookup(
            newItem.split(" | ")[1].split(",")[0],
            newItem.split(" | ")[1].split(",")[1]
          ),
          newItem.split(" | ")[1].split(",")[0],
          newItem.split(" | ")[1].split(",")[1],
        ],

        ...(favesList.length >= 6 ? favesList.pop() : favesList),
      ])
    );
  }
  return (
    <div
      className={mode == "day" ? "option-day" : "option-night"}
      onClick={() => {
        handleOptionClick(loc);
        onSetSelection(loc.split(" | ")[0]);
        onSetInputValue(loc.split(" | ")[0]);
      }}
    >
      {loc.split(" | ")[0]}
    </div>
  );
}
