import { useState, useEffect, useRef } from "react";
import Clock from "./clock";
import Removebutton from "./remove";
import Loading from "./loading";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/timezone";
dayjs.extend(timezone);
dayjs.extend(utc);

export default function Data({
  timezone,
  city,
  cityLat,
  cityLon,
  faveList,
  onSetFavesList,
  onSetActive,
  isActiveData,
  unit,
  onFetchWeather,
  mode,
  toFrom,
}) {
  const [time, setTime] = useState("");
  const [condition, setCondition] = useState("");
  const [temp, setTemp] = useState("");
  const [wind, setWind] = useState("");
  const [aqi, setAqi] = useState("");
  const [descrip, setDescrip] = useState("");
  const [loading, setLoading] = useState("loading");
  const [trigger, setTrigger] = useState(false);
  const lastUpdate = useRef(Date.now());

  const daysOfweek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const timeConversion = function (tz, func) {
    const hour = String(dayjs().tz(tz).$H).padStart(2, "0");
    const min = String(dayjs().tz(tz).$m).padStart(2, "0");

    const day = dayjs().tz(tz).$W;

    func(`${hour}:${min} | ${daysOfweek[day]}`);
  };

  useEffect(() => {
    onFetchWeather(
      cityLat,
      cityLon,
      setCondition,
      setTemp,
      setDescrip,
      setAqi,
      setLoading,
      setWind,
      city
    );
  }, [city, trigger]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!timezone) return;
      timeConversion(timezone, setTime);
      if ((Date.now() - lastUpdate.current) / 1000 >= 1200) {
        setTrigger((prevTrigger) => !prevTrigger);
        lastUpdate.current = Date.now();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [timezone]);

  let icon;

  if (condition === "clear-day") {
    icon = (
      <img
        src={`/wx-icons/${condition}.png`}
        height="45"
        width="45"
        alt="weather icon"
        className="spin icon"
      />
    );
  } else if (condition === "partly-cloudy-day") {
    icon = (
      <div className="partly-cloudy-overlap">
        <img
          src={`/wx-icons/clear-day.png`}
          height="35"
          width="35"
          alt="weather icon"
          className="spin icon"
        />
        <img
          src={`/wx-icons/cloudy.png`}
          height="40"
          width="40"
          alt="weather icon"
          className="overlap-cloud"
        />
      </div>
    );
  } else if (condition === "rain-snow-showers-day") {
    icon = (
      <div className="partly-cloudy-overlap">
        <img
          src={`/wx-icons/clear-day.png`}
          height="34"
          width="34"
          alt="weather icon"
          className="spin icon"
        />
        <img
          src={`/wx-icons/rain-snow.png`}
          height="38"
          width="38"
          alt="weather icon"
          className="overlap-cloud-precip"
        />
      </div>
    );
  } else if (condition === "showers-day") {
    icon = (
      <div className="partly-cloudy-overlap">
        <img
          src={`/wx-icons/clear-day.png`}
          height="34"
          width="34"
          alt="weather icon"
          className="spin icon"
        />
        <img
          src={`/wx-icons/rain.png`}
          height="38"
          width="38"
          alt="weather icon"
          className="overlap-cloud-precip"
        />
      </div>
    );
  } else if (condition === "snow-showers-day") {
    icon = (
      <div className="partly-cloudy-overlap">
        <img
          src={`/wx-icons/clear-day.png`}
          height="34"
          width="34"
          alt="weather icon"
          className="spin icon"
        />
        <img
          src={`/wx-icons/snow.png`}
          height="38"
          width="38"
          alt="weather icon"
          className="overlap-cloud-precip"
        />
      </div>
    );
  } else if (condition === "thunder-showers-day") {
    icon = (
      <div className="partly-cloudy-overlap">
        <img
          src={`/wx-icons/clear-day.png`}
          height="34"
          width="34"
          alt="weather icon"
          className="spin icon"
        />
        <img
          src={`/wx-icons/thunder-rain.png`}
          height="38"
          width="38"
          alt="weather icon"
          className="overlap-cloud-precip"
        />
      </div>
    );
  } else {
    icon = (
      <img
        src={`/wx-icons/${condition}.png`}
        height="45"
        width="45"
        alt="weather icon"
        className="icon"
      />
    );
  }
  let aqiColor;
  if (!aqi) aqiColor = "lightgray";
  else if (aqi <= 50) aqiColor = "green";
  else if (aqi > 50 && aqi <= 100) aqiColor = "yellow";
  else if (aqi > 100 && aqi <= 150) aqiColor = "orange";
  else if (aqi > 150) aqiColor = "red";

  if (loading === "done") {
    return (
      <div
        className={
          mode === "day"
            ? isActiveData === city
              ? `city-data day-data active-city`
              : `city-data day-data`
            : isActiveData === city
            ? `city-data night-data active-city`
            : `city-data night-data`
        }
        onClick={(e) => {
          if (e.target.innerHTML !== "X") {
            onSetActive(city);
          }
        }}
      >
        <div className="city-name">{city}</div>
        <div className="current-condition-desc">
          {descrip.replace("Partially", "Partly")}
        </div>

        <Removebutton
          list={faveList}
          func={onSetFavesList}
          location={city}
          resetActive={onSetActive}
          activeCity={isActiveData}
          mode={mode}
        />
        <div className="clock-weather">
          <Clock tz={timezone} />
          <div className="weather-wind">
            <div className="weather">
              {icon}
              {unit === "imperial"
                ? temp + "\xB0F"
                : Math.round((+temp - 32) * (5 / 9)) + "\xB0C"}
            </div>
            <div className="wind-info">
              <img
                src="/icons/wind.png"
                height="21"
                width="21"
                alt="icon"
                style={{
                  animationName: "spin",
                  animationDuration:
                    wind !== 0
                      ? `${
                          unit === "imperial"
                            ? 0.5 * (15 / wind[0])
                            : 0.5 * ((15 * 1.609) / wind[0])
                        }s`
                      : "",
                  animationIterationCount: "infinite",
                  animationTimingFunction: "linear",
                }}
              />
              <div style={{ fontSize: "13px" }}>
                {unit === "imperial"
                  ? wind[0] + " mph"
                  : Math.round(+wind[0] * 1.609) + " kph"}
              </div>
              <img
                src="/icons/arrow.png"
                height="19"
                width="19"
                alt="arrow"
                style={{
                  transform: wind[1]
                    ? `rotate(${toFrom === "to" ? wind[1] - 180 : wind[1]}deg)`
                    : "hidden",
                }}
              />
            </div>
          </div>
        </div>

        <div className="digital-clock">{time ? time : "--:--"}</div>

        <div
          className="aqi-current"
          style={{
            backgroundColor: aqiColor,
          }}
        >
          <div
            style={{
              color:
                aqiColor === "green" || aqiColor === "red" ? "white" : "black",
            }}
          >
            AQI: {aqi ? aqi : "N/A"}
          </div>
        </div>
      </div>
    );
  } else {
    return <Loading mode={mode} />;
  }
}
