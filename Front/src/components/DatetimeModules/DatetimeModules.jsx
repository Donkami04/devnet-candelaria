import React, { useEffect, useState } from "react";
import { getDatetimeModules } from "../../utils/Api-candelaria/api";
import { Message } from "../Message/Message";
import "./DatetimeModules.css";

export function DatetimeModules({ module }) {
  const [moduleData, setModuleData] = useState({});
  const [message, setMessage] = useState("");
  const [color, setColor] = useState("");
  const [show, setShow] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let data = await getDatetimeModules();
        console.log(data);
        data = data.filter((e) => e.system_name === module);

        if (data.length > 0) {
          setModuleData(data[0]);
          if (data[0].status === "ERROR") {
            setMessage(
              `Hay un error con el modulo ${module.toUpperCase()}, la información puede verse afectada.`
            );
            setColor("red-message");
            setShow(true);
          }
        } else {
          setModuleData({
            system_name: module,
            datetime: "Error DevNet",
            status: "Error DevNet",
          });
        }
      } catch (error) {
        setModuleData({
          system_name: module,
          datetime: "Error DevNet",
          status: "Error DevNet",
        });
        console.error("Error al obtener estado del sistema", error);
        return error;
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <Message message={message} color={color} show={show} />
      <div
        style={show ? { marginTop: "20px" } : {}}
        className="module-datetime-container"
      >
        {moduleData.system_name ? (
          <div>
            <p>Info Sistema: {moduleData.system_name.toUpperCase()}</p>
            <ul>
              <li>Última consulta: {moduleData.datetime}</li>
              <li>
                Estado: {moduleData.status}{" "}
                <span className={moduleData.status === "OK" ? "green" : "red"}>
                  `
                </span>
              </li>
            </ul>
          </div>
        ) : (
          <p>Cargando datos...</p>
        )}
      </div>
    </>
  );
}
