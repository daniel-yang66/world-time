export default function Forecast({
  int,
  unit,
  day,
  icon,
  conditionDesc,
  temp,
  wind,
  precip,
  hum,
  windDir,
  toFrom,
}) {
  let time;

  const hour24 = new Date(day).getHours();
  let hour12 = hour24 <= 12 ? hour24 : hour24 - 12;
  if (hour12 === 0) {
    hour12 = 12;
  }
  const amPm = hour24 < 12 ? "AM" : "PM";
  time = `${hour12} ${amPm}`;

  if (int === "daily") {
    time = day;
  }
  let wxIcon;

  if (icon === "clear-day") {
    wxIcon = (
      <img
        src={`/wx-icons/${icon}.png`}
        height="44"
        width="44"
        alt="weather icon"
        className="spin icon"
      />
    );
  } else if (icon === "partly-cloudy-day") {
    wxIcon = (
      <div className="partly-cloudy-overlap">
        <img
          src={`/wx-icons/clear-day.png`}
          height="38"
          width="38"
          alt="weather icon"
          className="spin icon"
        />
        <img
          src={`/wx-icons/cloudy.png`}
          height="44"
          width="44"
          alt="weather icon"
          className="overlap-cloud"
        />
      </div>
    );
  } else if (icon === "rain-snow-showers-day") {
    wxIcon = (
      <div className="partly-cloudy-overlap">
        <img
          src={`/wx-icons/clear-day.png`}
          height="38"
          width="38"
          alt="weather icon"
          className="spin icon"
        />
        <img
          src={`/wx-icons/rain-snow.png`}
          height="44"
          width="44"
          alt="weather icon"
          className="overlap-cloud-precip"
        />
      </div>
    );
  } else if (icon === "showers-day") {
    wxIcon = (
      <div className="partly-cloudy-overlap">
        <img
          src={`/wx-icons/clear-day.png`}
          height="38"
          width="38"
          alt="weather icon"
          className="spin icon"
        />
        <img
          src={`/wx-icons/rain.png`}
          height="44"
          width="44"
          alt="weather icon"
          className="overlap-cloud-precip"
        />
      </div>
    );
  } else if (icon === "snow-showers-day") {
    wxIcon = (
      <div className="partly-cloudy-overlap">
        <img
          src={`/wx-icons/clear-day.png`}
          height="38"
          width="38"
          alt="weather icon"
          className="spin icon"
        />
        <img
          src={`/wx-icons/snow.png`}
          height="44"
          width="44"
          alt="weather icon"
          className="overlap-cloud-precip"
        />
      </div>
    );
  } else if (icon === "thunder-showers-day") {
    wxIcon = (
      <div className="partly-cloudy-overlap">
        <img
          src={`/wx-icons/clear-day.png`}
          height="38"
          width="38"
          alt="weather icon"
          className="spin icon"
        />
        <img
          src={`/wx-icons/thunder-rain.png`}
          height="44"
          width="44"
          alt="weather icon"
          className="overlap-cloud-precip"
        />
      </div>
    );
  } else {
    wxIcon = (
      <img
        src={`/wx-icons/${icon}.png`}
        height="44"
        width="44"
        alt="weather icon"
        className="icon"
      />
    );
  }

  return (
    <div className="forecast-box">
      <div>{time}</div>
      <div style={{ fontSize: "70%" }}>
        {conditionDesc.replace("Partially", "Partly")}
      </div>
      <div className="icon-hum">
        {wxIcon}
        <div className="humidity">
          <img src="/icons/hum.png" width="22" height="22" alt="water" />
          <p style={{ fontSize: "70%" }}>{hum}</p>
        </div>
      </div>
      <div className="precip">
        <img src="/icons/precip.png" width="13" height="13" alt="water drop" />
        {precip}
      </div>
      {int === "hourly" ? (
        <div>{temp}</div>
      ) : (
        <div>
          <div>{temp.split(",")[0]}</div>
          <div>{temp.split(",")[1]}</div>
        </div>
      )}
      <div className="wind-info">
        <img
          src="/icons/wind.png"
          height="30"
          width="30"
          alt="icon"
          style={{
            animationName: "spin",
            animationDuration:
              wind !== 0
                ? `${
                    unit === "imperial"
                      ? 0.5 * (15 / wind)
                      : 0.5 * ((15 * 1.609) / wind)
                  }s`
                : "",
            animationIterationCount: "infinite",
            animationTimingFunction: "linear",
          }}
        />
        <div>{unit === "imperial" ? wind + " mph" : wind + " kph"}</div>
        <img
          src="/icons/arrow.png"
          height="25"
          width="25"
          alt="arrow"
          style={{
            transform: windDir
              ? `rotate(${toFrom === "to" ? windDir - 180 : windDir}deg)`
              : "hidden",
          }}
        />
      </div>
    </div>
  );
}
