
import React, { useState, useContext, useEffect } from 'react';
import { UserContext } from "../../App";
import Header from "./Header";

const DevStats = () => {
  const { userState } = useContext(UserContext);

  const [stats, setStats] = useState([]);

  async function getStats() {
    try {
      const response = await fetch("http://localhost:2000/usg/", {
        method: "GET"
      });
      const data = await response.json();
      
      if (data.success) {
        setStats(data.stats);
      }
    } catch (error) {
      console.error("Failed to get usage statistics: " + error);
    }
  }

  useEffect(() => {
    getStats();
  }, []);

  return (
    <>
      <Header hideOptions={true}/>
      <div className="container mt-3">
        <p>Hey {userState.user.fname}!</p>
        <p>Dev Stats:</p>
        {stats.map((stat) => <p key={stat.key}>{stat.key}: {stat.counter}</p>)}
      </div>

    </>
  );
}

export default DevStats;