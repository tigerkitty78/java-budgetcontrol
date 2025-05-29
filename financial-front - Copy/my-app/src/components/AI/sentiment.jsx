import React, { useEffect, useState } from "react";
import * as d3 from "d3-scale";
import 'bootstrap/dist/css/bootstrap.min.css';

const months = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

const SentimentMonthHeatmapBootstrap = () => {
  const [data, setData] = useState([]);
  const jwtToken = localStorage.getItem('jwtToken');

  useEffect(() => {
    fetch("http://localhost	:8080/api/sentiment", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwtToken}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setData(data.predictions))
      .catch((err) => console.error("Fetch error:", err));
  }, [jwtToken]);

  // Color scale from -2 to 2
  const colorScale = d3
    .scaleLinear()
    .domain([-2, 0, 2])
    .range(["#aa89d9", "#3958e3", "#89d9c6"]);

  // Grouping weeks by month/week-of-month
  const gridData = Array.from({ length: 4 }, (_, weekIdx) =>
    Array.from({ length: 12 }, (_, monthIdx) => {
      const match = data.find((d) => {
        const date = new Date(d.year, 0, (d.week - 1) * 7);
        const m = date.getMonth();
        const w = Math.floor((date.getDate() - 1) / 7);
        return m === monthIdx && w === weekIdx;
      });
      return match?.prediction ?? null;
    })
  );

  return (
    <div className="container py-4">
      <h4 className="mb-3">Weekly Sentiment Grid</h4>
      <div className="d-flex mb-1">
        <div className="me-2" style={{ width: "40px" }}></div>
        {months.map((m, idx) => (
          <div
            key={idx}
            className="text-center"
            style={{ width: "30px", fontSize: "0.75rem" }}
          >
            {m}
          </div>
        ))}
      </div>

      {gridData.map((row, weekIdx) => (
        <div className="d-flex align-items-center mb-1" key={weekIdx}>
          <div
            style={{ width: "40px", fontSize: "0.75rem" }}
            className="text-end me-2 text-muted"
          >
            Week {weekIdx + 1}
          </div>
          {row.map((val, colIdx) => {
            const bgColor = val !== null ? colorScale(val) : "#e0e0e0";
            return (
              <div
                key={colIdx}
                title={`W${weekIdx + 1}, ${months[colIdx]}: ${val !== null ? val.toFixed(2) : "N/A"}`}
                className="me-1"
                style={{
                  width: "30px",
                  height: "30px",
                  backgroundColor: bgColor,
                  borderRadius: "4px",
                }}
              ></div>
            );
          })}
        </div>
      ))}

      {/* Legend */}
      <div className="d-flex justify-content-center align-items-center mt-4 gap-3" style={{ fontSize: "0.8rem" }}>
        <div className="d-flex align-items-center">
          <div style={{ width: 20, height: 20, backgroundColor: "#aa89d9", borderRadius: 4, marginRight: 6 }}></div>
          Sad (-2)
        </div>
        <div className="d-flex align-items-center">
          <div style={{ width: 20, height: 20, backgroundColor: "#3958e3", borderRadius: 4, marginRight: 6 }}></div>
          Neutral (0)
        </div>
        <div className="d-flex align-items-center">
          <div style={{ width: 20, height: 20, backgroundColor: "#89d9c6", borderRadius: 4, marginRight: 6 }}></div>
          Happy (+2)
        </div>
      </div>
    </div>
  );
};

export default SentimentMonthHeatmapBootstrap;
