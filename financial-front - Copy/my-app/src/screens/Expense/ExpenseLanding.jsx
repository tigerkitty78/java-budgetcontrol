import React from "react";
import { useNavigate, Link } from 'react-router-dom';
import "bootstrap/dist/css/bootstrap.min.css";

// Image imports (consider using SVG icons for better scaling)
import c from "../../images/c.jpg";
import g from "../../images/gra.jpg";
import u from "../../images/u.jpg";
import p from "../../images/pe.jpg";
import t from "../../images/tra.jpg";
import r from "../../images/rec.jpg";
import l from "../../images/l.jpg";
import  { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { getExpenses } from "../../Redux/ExpenseSlice";
const CardGrid = () => {
  const navigate = useNavigate();
  const colorPalette = {
    primary: "#1a7d6b",
    secondary: "#f4fdfa",
    accent: "#e8fcf5",
    text: "#2d3748",
    background: "#f4fdfa"
  };
const dispatch = useDispatch();
  const { expenses, isLoading, error } = useSelector((state) => state.expenseSlice);
 

  const [filteredExpenses, setFilteredExpenses] = useState([]);

  useEffect(() => {
    dispatch(getExpenses());
  }, [dispatch]);

  const exportToCSV = () => {
    const headers = ["ID", "Amount", "Description", "Category", "Date", "User Email", "Username"];
    const rows = expenses.map(exp => [
      exp.id,
      exp.amount,
      exp.description,
      exp.category,
      exp.date,
      exp.user?.email || "",
      exp.user?.username || ""
    ]);

    const csvContent = [
      headers.join(","), 
      ...rows.map(row => row.map(cell => `"${cell}"`).join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "expenses.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleScanClick = () => navigate('/ocrform');

  return (
    <div className="container py-5" style={{
      backgroundColor: colorPalette.background,
      fontFamily: "'Inter', sans-serif",
      maxWidth: "1200px",
      margin: "2rem auto",
      borderRadius: "24px"
    }}>
      {/* Header Section */}
      <div className="mb-5 text-center text-md-start px-3">
        <h1 className="fw-bold mb-3" style={{
          fontSize: "2.25rem",
          color: colorPalette.primary,
          letterSpacing: "-0.5px"
        }}>
          Hi! 👋
        </h1>
        <p style={{
          fontSize: "1.125rem",
          color: "#4a5568",
          maxWidth: "600px",
          lineHeight: "1.6"
        }}>
          Manage your expenses with precision – track, analyze, and optimize your financial flow
        </p>
      </div>

      {/* Cards Grid */}
      <div className="row g-4 px-3">
        {[
          { link: "/expense", img: l, text: "View, Edit & Delete Expenses" },
          // { link: "/transactions", img: r, text: "Transactions" },
          { link: "/ex", img: p, text: "Add an Expense" },
          { link: "/expForecast", img: t, text: "Forecasts" },
          { link: "/pred", img: g, text: "Graphical Insights" },
          // { link: "/group-expenses", img: u, text: "Shared Expenses" }
        ].map((item, index) => (
          <div key={index} className="col-md-4 col-6">
            <Link to={item.link} className="text-decoration-none">
              <div className="card h-100 transition-all"
                style={{
                  borderRadius: "16px",
                  border: "none",
                  background: "white",
                  boxShadow: "0 4px 24px rgba(25, 125, 107, 0.08)",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  cursor: "pointer",
                  minHeight: "180px"
                }}>
                <div className="card-body d-flex flex-column align-items-center justify-content-center p-4">
                  <div className="icon-wrapper mb-3 p-3 rounded-circle"
                    style={{
                      background: colorPalette.accent,
                      width: "64px",
                      height: "64px",
                      display: "grid",
                      placeItems: "center"
                    }}>
                    <img
                      src={item.img}
                      alt="Icon"
                      style={{
                        height: "32px",
                        width: "32px",
                        objectFit: "contain",
                        filter: "hue-rotate(-10deg)"
                      }}
                    />
                  </div>
                  <p className="text-center mb-0 fw-medium" style={{
                    color: colorPalette.text,
                    fontSize: "1rem",
                    lineHeight: "1.4"
                  }}>
                    {item.text}
                  </p>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>

      {/* Action Buttons Section */}
      <div className="mt-5 px-3">
        <div className="d-flex flex-column gap-4">
          {/* Scan Button */}
          <button
            className="btn d-inline-flex align-items-center gap-3 py-3 px-4 mx-auto"
            style={{
              borderRadius: "12px",
              background: colorPalette.primary,
              color: "white",
              border: "none",
              width: "fit-content",
              transition: "all 0.3s ease"
            }}
            onClick={handleScanClick}
            onMouseOver={(e) => e.currentTarget.style.transform = "translateY(-2px)"}
            onMouseOut={(e) => e.currentTarget.style.transform = "none"}
          >
            <img src={c} alt="Camera" style={{ 
              height: "24px", 
              width: "24px",
              filter: "brightness(0) invert(1)"
            }} />
            <span style={{ fontWeight: "500" }}>
              Scan Receipt
            </span>
          </button>

          {/* Import/Export Section */}
          <div className="d-flex flex-column flex-md-row gap-4 justify-content-between align-items-center p-4 rounded-3"
            style={{
              background: colorPalette.secondary,
              border: `1px solid ${colorPalette.accent}`
            }}>
            <p className="mb-0 text-center text-md-start" style={{
              color: colorPalette.primary,
              fontSize: "0.95rem",
              maxWidth: "400px"
            }}>
              Upload expenses recorded in Excel sheets or export existing data
            </p>
            <div className="d-flex gap-3">
              <button className="btn px-4 py-2 d-flex align-items-center gap-2"
                style={{
                  background: "white",
                  color: colorPalette.primary,
                  borderRadius: "8px",
                  border: `2px solid ${colorPalette.primary}`
                }}  onClick={exportToCSV}>
                <span>📤</span>
                Export Excel
              </button>
              <button className="btn px-4 py-2 d-flex align-items-center gap-2"
                style={{
                  background: colorPalette.primary,
                  color: "white",
                  borderRadius: "8px",
                  border: "none"
                }}>
                <span>📥</span>
                Import Excel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardGrid;