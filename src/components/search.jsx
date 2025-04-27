import { useState } from "react";
import Option from "./option";
import { useDebouncedCallback } from "use-debounce";

export default function Search({
  onSetSelection,
  dropdownClose,
  favorites,
  onSetFavorites,
  mode,
}) {
  const [options, setOptions] = useState([]);
  const [inputValue, setInputValue] = useState("");

  const fetchResults = async function (text) {
    const fetchedData = await fetch(
      `https://api.mapbox.com/search/geocode/v6/forward?q=${text}&types=place,district,neighborhood&language=en&access_token=${
        import.meta.env.VITE_TOKEN
      }`
    );

    const results = await fetchedData.json();

    let placesTemp = [];

    results["features"].forEach((location) => {
      placesTemp.push(
        `${location["properties"]["name_preferred"]}, ${
          location["properties"]["context"]["country"][
            "country_code_alpha_3"
          ] === "USA"
            ? location["properties"]["context"]["region"]["region_code"]
            : location["properties"]["context"]["country"]["country_code"]
        } | ${location["geometry"]["coordinates"][1]},${
          location["geometry"]["coordinates"][0]
        }`
      );
    });
    if (placesTemp.length !== 0) {
      placesTemp = placesTemp.sort();
      let placesFinal = [placesTemp[0]];

      let placeName = placesTemp[0];
      placesTemp.slice(1).forEach((place, i) => {
        if (place.split(" | ")[0] !== placeName) {
          placesFinal.push(place);
        }
        placeName = place.split(" | ")[0];
      });

      setOptions(placesFinal);
    } else {
      setOptions([]);
    }
  };
  const debounce = useDebouncedCallback(fetchResults, 200);

  return (
    <div className="search">
      <input
        className="input"
        type="text"
        placeholder="Location Search"
        onChange={(e) => {
          debounce(e.target.value);
          setInputValue(e.target.value);
        }}
        value={inputValue}
      ></input>
      <div
        className={
          dropdownClose === true || options.length === 0
            ? "hidden"
            : mode === "day"
            ? "dropdown"
            : "dropdown-night"
        }
      >
        {[...new Set(options)].map((opt) => {
          return (
            <Option
              loc={opt}
              favesList={favorites}
              onSetFavesList={onSetFavorites}
              key={opt}
              onSetSelection={onSetSelection}
              onSetInputValue={setInputValue}
              mode={mode}
            />
          );
        })}
      </div>
    </div>
  );
}
