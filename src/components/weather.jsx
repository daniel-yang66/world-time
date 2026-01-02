import { useState, useMemo } from "react";
import { useInView, InView } from "react-intersection-observer";
import Forecast from "./forecast";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
dayjs.extend(timezone);
dayjs.extend(utc);

export default function Weather({ location, units, data, mode, dir }) {
  const [dayForecast, setDayForecast] = useState([]);
  const [hourlyForecast, setHourlyForecast] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeBtn, setActiveBtn] = useState("daily");
  const [interval, setTimeInterval] = useState("daily");
  const { ref, inView } = useInView({
    threshold: 0.85,
    root: null,
  });

  const daysofWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const [visibleSection, setVisibleSection] = useState(["..."]);
  const fcastOfInterest = data.filter((fcast) => {
    return fcast.loc === location;
  });

  const setInView = (inView, entry) => {
    if (inView) {
      setVisibleSection([...new Set([entry.target.getAttribute("id")])]);
    }
  };

  const fetchWeather = () => {
    try {
      if (fcastOfInterest.length === 0) return;
      setLoading(true);

      const parsedWeatherData = fcastOfInterest[0]["data"];

      const tzID = fcastOfInterest[0]["tz"];

      let hourlyData = [];
      parsedWeatherData.forEach((day) => {
        day["hours"].forEach((hour) => {
          hour["wholeTime"] = day["datetime"] + " " + hour["datetime"];
          hourlyData.push(hour);
        });
      });

      const hourlyForecastSlice = hourlyData.filter((hour) => {
        return (
          hour["wholeTime"] >
          `${dayjs().tz(tzID).$y}-${String(
            Number(dayjs().tz(tzID).$M) + 1
          ).padStart(2, "0")}-${String(dayjs().tz(tzID).$D).padStart(
            2,
            "0"
          )} ${String(dayjs().tz(tzID).$H).padStart(2, "0")}:00:00`
        );
      });
      setHourlyForecast(hourlyForecastSlice);

      const dailyData = parsedWeatherData;

      const dayForecastSlice = dailyData.filter((day) => {
        return (
          day["datetime"] >=
          `${dayjs().tz(tzID).$y}-${String(
            Number(dayjs().tz(tzID).$M) + 1
          ).padStart(2, "0")}-${String(dayjs().tz(tzID).$D).padStart(2, "0")}`
        );
      });
      setDayForecast(dayForecastSlice);

      setLoading(false);
    } catch {
      alert("Failed to get forecast.");
      setLoading(true);
    }
  };

  useMemo(() => {
    if (!location) return;
    fetchWeather();
  }, [location, data]);

  const activeForecast = interval === "hourly" ? hourlyForecast : dayForecast;

  if (location === "") {
    return (
      <div
        className={
          mode === "day"
            ? `weather-info ${mode}-data`
            : `weather-info ${mode}-data`
        }
      >
        Tap City Above for Forecast
      </div>
    );
  } else if (loading) {
    return (
      <div
        className={
          mode === "day"
            ? `weather-info ${mode}-data`
            : `weather-info ${mode}-data`
        }
      >
        <img
          src="/icons/wind.png"
          height="40"
          width="40"
          alt="icon"
          className="loading-icon"
        />
      </div>
    );
  } else {
    return (
      <div
        className={
          mode === "day"
            ? `weather-info ${mode}-data`
            : `weather-info ${mode}-data`
        }
      >
        <div className="daily-hourly-buttons">
          <button
            className={
              activeBtn === "daily"
                ? "daily-button active-day-hour"
                : "daily-button"
            }
            onClick={() => {
              setActiveBtn("daily");
              setTimeInterval("daily");
            }}
          >
            Daily
          </button>
          <button
            className={
              activeBtn === "hourly"
                ? "hourly-button active-day-hour"
                : "hourly-button"
            }
            onClick={() => {
              setActiveBtn("hourly");
              setTimeInterval("hourly");
            }}
          >
            Hourly
          </button>
        </div>

        <h1 className="weather-city">
          {location} {interval === "hourly" ? `(${visibleSection[0]})` : ""}
        </h1>

        <div className="forecast" ref={ref}>
          {activeForecast.map((data) => (
            <InView
              onChange={setInView}
              threshold={0.85}
              key={`${data["datetimeEpoch"]}-${location}`}
            >
              {({ ref }) => {
                return (
                  <div
                    ref={ref}
                    id={
                      interval === "hourly"
                        ? `${
                            daysofWeek[
                              new Date(`${data["wholeTime"]}`).getDay()
                            ]
                          } | ${
                            months[new Date(`${data["wholeTime"]}`).getMonth()]
                          } ${new Date(`${data["wholeTime"]}`).getDate()}`
                        : `${
                            daysofWeek[
                              new Date(`${data["datetime"]} 00:00:00`).getDay()
                            ]
                          } | ${
                            months[
                              new Date(
                                `${data["datetime"]} 00:00:00`
                              ).getMonth()
                            ]
                          } ${new Date(
                            `${data["datetime"]} 00:00:00`
                          ).getDate()}`
                    }
                  >
                    <Forecast
                      int={interval}
                      unit={units}
                      day={
                        interval === "hourly"
                          ? `${data["wholeTime"]}`
                          : `${
                              daysofWeek[
                                new Date(
                                  `${data["datetime"]} 00:00:00`
                                ).getDay()
                              ]
                            } | ${
                              months[
                                new Date(
                                  `${data["datetime"]} 00:00:00`
                                ).getMonth()
                              ]
                            } ${new Date(
                              `${data["datetime"]} 00:00:00`
                            ).getDate()}`
                      }
                      precip={
                        units === "imperial"
                          ? ` ${Math.round(data["precipprob"])}% | ${+data[
                              "precip"
                            ].toFixed(2)} in`
                          : `${Math.round(data["precipprob"])}% | ${+(
                              data["precip"] * 25.4
                            ).toFixed(2)} mm`
                      }
                      icon={data["icon"]}
                      conditionDesc={data["conditions"]}
                      hum={
                        units === "imperial"
                          ? `${Math.round(data["dew"])}\xB0F`
                          : `${Math.round((data["dew"] - 32) * (5 / 9))}\xB0C`
                      }
                      temp={
                        interval === "hourly"
                          ? units === "imperial"
                            ? `${Math.round(data["temp"])}\xB0F`
                            : `${Math.round(
                                (data["temp"] - 32) * (5 / 9)
                              )}\xB0C`
                          : units === "imperial"
                          ? `Hi: ${Math.round(
                              data["tempmax"]
                            )}\xB0F,Lo: ${Math.round(data["tempmin"])}\xB0F`
                          : `Hi: ${Math.round(
                              (data["tempmax"] - 32) * (5 / 9)
                            )}\xB0C,Lo: ${Math.round(
                              (data["tempmin"] - 32) * (5 / 9)
                            )}\xB0C`
                      }
                      wind={
                        units === "imperial"
                          ? Math.round(data["windspeed"])
                          : Math.round(data["windspeed"] * 1.609)
                      }
                      windDir={data["winddir"] ? data["winddir"] : undefined}
                      toFrom={dir}
                      key={data["datetimeEpoch"]}
                    />
                  </div>
                );
              }}
            </InView>
          ))}
        </div>
      </div>
    );
  }
}
