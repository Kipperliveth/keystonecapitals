import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import axios from 'axios';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);


const BitcoinChart = () => {
  const [chartData, setChartData] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          'https://api.coingecko.com/api/v3/coins/bitcoin/market_chart',
          {
            params: {
              vs_currency: 'usd',
              days: 7, // Data for the last 7 days
            },
          }
        );
  
        if (response.data && response.data.prices) {
          const prices = response.data.prices;
          const labels = prices.map(price => new Date(price[0]).toLocaleDateString());
          const dataPoints = prices.map(price => price[1]);
  
          setChartData({
            labels,
            datasets: [
              {
                label: 'Bitcoin Price (USD)',
                data: dataPoints,
                borderColor: 'rgba(75, 192, 192, 1)',
                fill: false,
              },
            ],
          });
        } else {
          console.error("No prices found in response");
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data", error);
        setLoading(false);
      }
    };
  
    fetchData();
  }, []);
  
  const [loading, setLoading] = useState(true);

  return (
    <div>
      <h2>Bitcoin Price Movement (Last 7 Days)</h2>
      {loading ? <p>Loading chart...</p> : <Line data={chartData} />}
    </div>
  );
};

export default BitcoinChart;
