import { useState, useEffect } from "react";
import { getUps } from "../../utils/Api-candelaria/api";
import { Navbar } from "../Navbar/Navbar";
import { UpsCard } from "./UpsCard/UpsCard";
import { UpsDashboard } from "./UpsDashboard/UpsDashboard";
import "./ups.css";

export function Ups() {
  const [allUps, setUps] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const upsList = await getUps();
        setUps(upsList);
      } catch (error) {
        console.error("Error al obtener el listado de Ups:", error);
        return error;
      }
    };
    fetchData();
  }, []);

  return (
    <>
      <Navbar title={"Dashboard UPS"} />
      <UpsDashboard allUps={allUps} />
      <div className="ups-cards-container">
        {allUps.map((ups) => (
          <UpsCard key={ups.id} ups={ups} />
        ))}
      </div>
    </>
  );
}
