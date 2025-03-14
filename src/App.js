import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import DataTable from "react-data-table-component";
import './App.css';
import "bootstrap-icons/font/bootstrap-icons.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import StockDetailPage from './StockDetailPage';
import { Link } from 'react-router-dom';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend } from 'chart.js';
import Select from 'react-select';
ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend);

const URL = "http://127.0.0.1:8000/";
//const URL = "http://192.168.1.110:8000/";
const Home = () => {
  const [stockdata, setStockdata] = useState([]);  
  const [chartData, setChartData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOption, setSelectedOption] = useState(null);


  useEffect(() => {
    axios
      .get(URL)      
      .then((response) => {
        setStockdata(response.data);        
        setIsLoading(false);        
      })
      .catch((err) => {
        alert(err);
        setIsLoading(false);
      })
  })
  useEffect(() => {
    if (selectedOption) {
      updateChartData(selectedOption.value);
    }
  }, [selectedOption, stockdata]);
  

  const updateChartData = (tradeCode) => {    
    const filteredData = stockdata.filter(item => item.trade_code === tradeCode);   
    const sortedStockData = filteredData.sort((a, b) => a.date - b.date);
    const dates = sortedStockData.map(item => item.date);
    const closeValues = sortedStockData.map(item => item.close);
    const volumeValues = sortedStockData.map(item => item.volume);    
    
    setChartData({
      labels: dates,
      datasets: [
        {
          label: 'Close Price',
          data: closeValues,
          borderColor: 'rgb(75, 192, 192)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          fill: false,
          yAxisID: 'y1',
        },
        {
          label: 'Volume',
          data: volumeValues,
          borderColor: 'rgb(255, 99, 132)',
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          type: 'bar',
          yAxisID: 'y2',
        },
      ],
    });
  };
  const columns = [
    {
      name: "ID",
      selector: row => row.id,
      sortable: true,
      width: "80px",
    },
    {
      name: "DATE",
      selector: row => row.date,
      sortable: true
    },
    {
      name: "TRADE CODE",
      selector: row => row.trade_code,
      sortable: true,
      width: "130px",

    },
    {
      name: "HIGH",
      selector: row => row.high,
      sortable: true
    },
    {
      name: "LOW",
      selector: row => row.low,
      sortable: true
    },
    {
      name: "OPEN",
      selector: row => row.open,
      sortable: true
    },
    {
      name: "CLOSE",
      selector: row => row.close,
      sortable: true
    },
    {
      name: "VOLUME",
      selector: row => row.volume,
      sortable: true
    },
    {
      name: "ACTION",
      selector: "null",
      sortable: false,
      width: '80px',
      cell: (e) => [
        <Link to={`/${e.id}`}><i className="bi bi-pen-fill" ></i></Link>,
        <Link onClick={() => handleDelete(e.id)}><i className="bi bi-trash-fill" style={{ color: 'red', marginLeft: '10px' }}></i></Link>
      ]
    }

  ];
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${URL}${id}/`, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      alert("Stock deleted successfully!");
    } catch (err) {
      alert(err);
    }
  };
 
  const selectOptions = Array.from(new Set(stockdata.map(item => item.trade_code)))
  .map(code => ({ label: code, value: code }));

  const handleSelectChange = (selectedOption) => {
    setSelectedOption(selectedOption);
    if (selectedOption) {
      updateChartData(selectedOption.value);
    }
  };
  
  return (
    <div className="App">
      <h2 className="App-header">Stock Market Data</h2>
      <div className="container">
        {isLoading? (
          <p>Loading...</p>
        ):(
          <>       
        <Select
            options={selectOptions}
            value={selectedOption}
            onChange={handleSelectChange}
            placeholder="Select a trade code..."            
          />
        
        {chartData.labels && (
          <div style={{ height: '500px', width: '80%', margin: 'auto' }}>
            <Line
              data={chartData}             
              options={{
                responsive: true,
                plugins: { title: { display: true, text: 'Stock Market Data' }, tooltip: { mode: 'index', intersect: false } },
                scales: {
                  x: { type: 'category', title: { display: true, text: 'Date' } },
                  y1: { type: 'linear', position: 'left', title: { display: true, text: 'Close Price' }, ticks: { beginAtZero: false } },
                  y2: { type: 'linear', position: 'right', title: { display: true, text: 'Volume' }, ticks: { beginAtZero: false } },
                },
              }}
            />
          </div>
        )}        
        <DataTable columns={columns} data={stockdata} pagination />
        </>
      )}
      </div>
    </div>
  );
}
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/:id" element={<StockDetailPage URL={URL} />} />
      </Routes>
    </Router>
  );

}

export default App;
