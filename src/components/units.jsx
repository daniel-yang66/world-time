export default function UnitsDir({ onSetUnits, onSetDir }) {
  return (
    <>
      <select className="units" onChange={(e) => onSetUnits(e.target.value)}>
        <option value="imperial">Imperial</option>
        <option value="metric">Metric</option>
      </select>
      <select className="to-from" onChange={(e) => onSetDir(e.target.value)}>
        <option value="to">Blowing To</option>
        <option value="from">Blowing From</option>
      </select>
    </>
  );
}
