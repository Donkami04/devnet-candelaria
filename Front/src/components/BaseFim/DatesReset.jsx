import { MdArrowForwardIos } from "react-icons/md";
import moment from "moment";
import "./BaseFim.css";

export function DatesReset({ month, setMonth, changeMonth, dataDownSelected, baseName, setShowDatesReset }) {
  dataDownSelected = dataDownSelected.sort((a, b) => b.id - a.id);
  const months = moment.months();
  return (
    <div className="dates-reset">
      <MdArrowForwardIos
        onClick={() => setShowDatesReset(false)}
        style={{
          position: "absolute",
          top: "10px",
          left: "5px",
          cursor: "pointer",
        }}
      />
      <h2 style={{ textAlign: "center" }}>Fechas de reinicio en el mes de {month}</h2>
      <div style={{ marginTop: "30px" }}>
        <h3 style={{marginBottom: "1rem"}} >{baseName}</h3>
        {/* <p style={{fontSize: "0.9rem"}}>Total de reinicios en {month}: {dataDownSelected.length}</p>
        <p style={{ marginTop: "0.5rem", fontSize: "0.9rem", marginBottom: "0.5rem" }}>Selecciona el mes</p>
        <select
          value={moment().month(month).month()} // Establece el mes como índice (0-11)
          onChange={(e) => {
            const selectedIndex = Number(e.target.value);
            const selectedMonthName = moment().month(selectedIndex).format("MMMM");
            setMonth(selectedMonthName);
            console.log("eeeeeeeeeee", e.target.value);
            changeMonth(baseName);
          }}
          style={{ marginBottom: "1rem" }}
        >
          {months.map((m, index) => (
            <option key={index} value={index}>
              {m.charAt(0).toUpperCase() + m.slice(1)}
            </option>
          ))}
        </select> */}
        {dataDownSelected.length === 0 ? (
          <p style={{ marginTop: "2rem" }}>No hay registros de intentos de reinicio</p>
        ) : (
          dataDownSelected.map((e) => (
            <div className="dates-container" key={e.id}>
              <table className="table-reset-fim">
                <tbody>
                  <tr>
                    {/* <td>{e.id}</td> */}
                    <td>{e.date}</td>
                    <td
                      style={{
                        width: "30%",
                        color: e.status === "Fail" ? "red" : "inherit",
                        fontWeight: e.status === "Failed" ? "bolder" : "normal",
                      }}
                    >
                      {e.status}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
