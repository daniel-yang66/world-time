export default function Credits({ openStatus, mode }) {
  return (
    <div className={openStatus === true ? `credits ${mode}-data` : "hidden"}>
      <a
        href="https://www.flaticon.com/free-icons/time-and-date"
        title="time and date icons"
        className={`a-${mode}`}
      >
        Time and date icons created by Smashicons - Flaticon
      </a>
      <a
        href="https://www.flaticon.com/free-icons/geo"
        title="geo icons"
        className={`a-${mode}`}
      >
        Geo icons created by Fathema Khanom - Flaticon
      </a>

      <a
        href="https://www.flaticon.com/free-icons/propeller"
        title="propeller icons"
        className={`a-${mode}`}
      >
        Propeller icons created by Vitaly Gorbachev - Flaticon
      </a>
      <a
        href="https://www.flaticon.com/free-icons/gear"
        title="gear icons"
        className={`a-${mode}`}
      >
        Gear icons created by Slidicon - Flaticon
      </a>
      <a
        href="https://www.flaticon.com/free-icons/arrow-up"
        title="arrow up icons"
        className={`a-${mode}`}
      >
        Arrow up icons created by adrianadam - Flaticon
      </a>
      <a
        href="https://www.flaticon.com/free-icons/dew"
        title="dew icons"
        className={`a-${mode}`}
      >
        Dew icons created by Freepik - Flaticon
      </a>
      <a
        href="https://www.flaticon.com/free-icons/water-drop"
        title="water drop icons"
        className={`a-${mode}`}
      >
        Water drop icons created by Freepik - Flaticon
      </a>
    </div>
  );
}
