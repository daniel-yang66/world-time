import { useState, useEffect } from "react";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
dayjs.extend(timezone);

export default function Clock({ tz }) {
  const setClock = function (tz, hfunc, mfunc, sfunc) {
    const hours = dayjs().tz(tz).$H;

    const minutes = dayjs().tz(tz).$m;

    const seconds = new Date().getSeconds();

    hfunc(hours * 30 + minutes / 2);
    mfunc(minutes * 6 + seconds / 10);
    sfunc(seconds * 6);
  };
  const [hourHand, setHourHand] = useState("");
  const [minHand, setMinHand] = useState("");
  const [secHand, setSecHand] = useState("");

  useEffect(() => {
    if (!tz) return;
    const interval = setInterval(() => {
      setClock(tz, setHourHand, setMinHand, setSecHand);
    }, 1000);
    return () => clearInterval(interval);
  }, [tz]);

  return (
    <div className="clock">
      <div
        className="hour"
        style={
          hourHand !== 0
            ? {
                transform: `rotate(${hourHand}deg)`,
                transition: "all 1s linear",
              }
            : { transform: `rotate(${hourHand}deg)`, transition: "none" }
        }
      ></div>
      <div
        className="minute"
        style={
          minHand !== 0
            ? {
                transform: `rotate(${minHand}deg)`,
                transition: "all 1s linear",
              }
            : { transform: `rotate(${minHand}deg)`, transition: "none" }
        }
      ></div>
      <div
        className="second"
        style={
          secHand !== 0
            ? {
                transform: `rotate(${secHand}deg)`,
                transition: "all 1s linear",
              }
            : { transform: `rotate(${secHand}deg)`, transition: "none" }
        }
      ></div>
      <div className="dot"></div>
    </div>
  );
}
