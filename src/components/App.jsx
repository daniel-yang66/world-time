import { useState, useEffect, useRef } from "react";
import TopArea from "./toparea";
import Search from "./search";
import Credits from "./credits";
import Footer from "./footer";
import Times from "./times";
import Data from "./data";
import Map from "./map";
import Title from "./title";
import Weather from "./weather";
import SettingsButton from "./settingsBtn";
import Settings from "./settings";
import UnitsDir from "./units";
import NightSettings from "./NightSettings";

function App() {
  const allForecasts = useRef([]);
  const [faves, setFaves] = useState([]);
  const [selection, setSelection] = useState("");
  const [isCreditOpen, setIsCreditOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [nightSettings, setNightSettings] = useState(["20:00", "06:30"]);
  const [activeMarker, setActiveMarker] = useState("");
  const [units, setUnits] = useState("imperial");
  const [allData, setAllData] = useState([]);
  const [mode, setMode] = useState("day");
  const [dropdownClose, setDropdownClose] = useState(true);
  const [toFrom, setToFrom] = useState("to");
  const [loading, setLoading] = useState(false);
  const [trigger, setTrigger] = useState(false);
  const [weather, setWeather] = useState([]);
  const lastUpdate = useRef(Date.now());

  useEffect(() => {
    try {
      if (JSON.parse(localStorage.getItem("faves")))
        setFaves(JSON.parse(localStorage.getItem("faves")));
      if (JSON.parse(localStorage.getItem("nightSched")))
        setNightSettings(JSON.parse(localStorage.getItem("nightSched")));
    } catch {
      setFaves([]);
      setNightSettings(["20:00", "06:30"]);
    }
  }, []);

  function handleGlobalClick(e) {
    if (
      e.target.className !== "input" &&
      !e.target.className.includes("credits") &&
      !e.target.className.includes("credit-btn") &&
      !e.target.closest("div").className.includes("settings") &&
      !e.target.closest("div").className.includes("night-schedule") &&
      e.target.className !== "settings-btn"
    ) {
      setDropdownClose(true);
      setIsCreditOpen(false);
      setIsSettingsOpen(false);
    } else if (e.target.className === "input") {
      setDropdownClose(false);
    }
    if (e.target.className.includes("city-data-active")) {
      setActiveMarker("");
    }
  }

  const fetchWeather = async (lat, lon, city, tz) => {
    const weatherData = await fetch(
      `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${lat},${lon}?key=${
        import.meta.env.VITE_WEATHER_KEY
      }&elements=%2Baqius`
    );
    const parsedWeatherData = await weatherData.json();

    allForecasts.current = allForecasts.current.filter((forecast) => {
      return forecast.loc !== city;
    });

    allForecasts.current.push({
      loc: city,
      data: parsedWeatherData["days"],
      tz: parsedWeatherData["timezone"],
    });
    setAllData(allForecasts.current);
    // cache.current.push(city);

    return {
      condition: `${parsedWeatherData["currentConditions"]["icon"]}`,
      temp: `${Math.round(parsedWeatherData["currentConditions"]["temp"])}`,
      wind: [
        Math.round(parsedWeatherData["currentConditions"]["windspeed"]),
        parsedWeatherData["currentConditions"]["winddir"],
      ],
      aqi: `${parsedWeatherData["currentConditions"]["aqius"]}`,
      descrip: `${parsedWeatherData["currentConditions"]["conditions"]}`,
      city: city,
      tz: tz,
    };
  };

  checkMode(mode);
  function checkMode(curMode) {
    let newMode, night;

    const curTime = `${String(new Date().getHours()).padStart(2, "0")}:${String(
      new Date().getMinutes()
    ).padStart(2, "0")}`;

    if (nightSettings[0] > nightSettings[1]) {
      night = curTime >= nightSettings[0] || curTime <= nightSettings[1];
    } else {
      night = curTime >= nightSettings[0] && curTime <= nightSettings[1];
    }

    newMode = night ? "night" : "day";

    if (curMode === newMode) return;
    else {
      setMode(newMode);
    }
  }

  useEffect(() => {
    const interval = setInterval(() => checkMode(mode), 20000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if ((Date.now() - lastUpdate.current) / 1000 >= 1200) {
        setTrigger((prevTrigger) => !prevTrigger);
        lastUpdate.current = Date.now();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    async function fetchSequential() {
      try {
        setLoading("loading");
        const filteredWeather = weather.filter((wx) => {
          return faves.map((fave) => fave[0]).includes(wx.city);
        });
        let weatherLst =
          filteredWeather.length === 0 ? [] : [...filteredWeather];

        for (const fave of faves) {
          if (!weather.map((wx) => wx.city).includes(fave[0])) {
            const data = await fetchWeather(fave[2], fave[3], fave[0], fave[1]);
            await new Promise((r) => setTimeout(r, 300));

            weatherLst.push(data);
          }
        }
        weatherLst =
          weatherLst.length > 0
            ? weatherLst.sort((a, b) => a.city.localeCompare(b.city))
            : weatherLst;

        setWeather(weatherLst);
      } catch {
        alert("Failed to get weather data");
      } finally {
        setLoading("done");
      }
    }
    fetchSequential();
  }, [faves]);

  useEffect(() => {
    setWeather([]);

    async function fetchSequential() {
      try {
        setLoading("loading");
        let weatherLst = [];
        for (const fave of faves) {
          const data = await fetchWeather(fave[2], fave[3], fave[0], fave[1]);
          await new Promise((r) => setTimeout(r, 300));
          weatherLst.push(data);
        }
        weatherLst =
          weatherLst.length > 0
            ? weatherLst.sort((a, b) => a.city.localeCompare(b.city))
            : weatherLst;
        setWeather(weatherLst);
      } catch {
        alert("Failed to get weather data");
      } finally {
        setLoading("done");
      }
    }
    fetchSequential();
  }, [trigger]);

  return (
    <div
      className={
        mode === "day" ? `all-content ${mode}-bg` : `all-content ${mode}-bg`
      }
      onClick={handleGlobalClick}
    >
      <TopArea mode={mode}>
        <Title />

        <Search
          selectedValue={selection}
          onSetSelection={setSelection}
          dropdownClose={dropdownClose}
          favorites={faves}
          onSetFavorites={setFaves}
          mode={mode}
        />

        <SettingsButton onHandleSettingClick={setIsSettingsOpen} />
      </TopArea>

      <div className="times-map">
        <Times>
          {weather.length === 0 ? (
            <h2 style={{ margin: "auto" }}>Add up to 6 Locations</h2>
          ) : (
            weather.map((data, i) => {
              return (
                <Data
                  timezone={data.tz}
                  city={data.city ? data.city : "--"}
                  key={i}
                  condition={data.condition}
                  temp={data.temp ? data.temp : "--"}
                  wind={data.wind ? data.wind : [0, 0]}
                  aqi={data.aqi}
                  descrip={data.descrip ? data.descrip : "--"}
                  faveList={faves}
                  onSetFavesList={setFaves}
                  onSetActive={setActiveMarker}
                  isActiveData={activeMarker}
                  unit={units}
                  mode={mode}
                  toFrom={toFrom}
                  loading={loading}
                />
              );
            })
          )}
        </Times>
        <div className="map-weather">
          <Map
            faveList={faves}
            active={activeMarker}
            curSettings={nightSettings}
          />

          <Weather
            location={activeMarker}
            units={units}
            data={allData}
            mode={mode}
            dir={toFrom}
          />
        </div>

        <Footer onHandleCreditClick={setIsCreditOpen} />
        <Credits openStatus={isCreditOpen} mode={mode} />
        <Settings openStatus={isSettingsOpen} mode={mode}>
          Units & Wind Arrow
          <UnitsDir onSetUnits={setUnits} onSetDir={setToFrom} />
          <NightSettings
            curSettings={nightSettings}
            onSetNightSched={setNightSettings}
            onCheckMode={checkMode}
            curMode={mode}
          />
        </Settings>
      </div>
    </div>
  );
}

export default App;
