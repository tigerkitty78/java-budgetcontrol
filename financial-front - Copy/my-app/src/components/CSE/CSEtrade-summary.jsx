import React, { useEffect, useState } from 'react';
import axios from 'axios';

const CseData = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch data from Flask API
    const fetchData = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:5000/get_cse_data');
        setData(response.data); // Update state with the fetched data
      } catch (error) {
        console.error("There was an error fetching the data", error);
      } finally {
        setLoading(false); // Set loading to false once data is fetched
      }
    };

    fetchData(); // Fetch data on component mount
  }, []); // Empty dependency array to only run once when component mounts

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>CSE Data</h1>
      <table border="1" style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>Company Name</th>
            <th>Symbol</th>
            <th>Last Trade (Rs.)</th>
            <th>Change (%)</th>
            <th>Change (Rs.)</th>
            <th>High (Rs.)</th>
            <th>Low (Rs.)</th>
            <th>Open (Rs.)</th>
            <th>Previous Close (Rs.)</th>
            <th>Share Volume</th>
            <th>Trade Volume</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={index}>
              <td>{row["Company Name"]}</td>
              <td>{row["Symbol"]}</td>
              <td>{row["**Last Trade (Rs.)"]}</td>
              <td>{row["Change (%)"]}</td>
              <td>{row["Change(Rs)"]}</td>
              <td>{row["High (Rs.)"]}</td>
              <td>{row["Low (Rs.)"]}</td>
              <td>{row["Open (Rs.)"]}</td>
              <td>{row["Previous Close (Rs.)"]}</td>
              <td>{row["Share Volume"]}</td>
              <td>{row["Trade Volume"]}</td>
              <td>{row["Date"]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CseData;
