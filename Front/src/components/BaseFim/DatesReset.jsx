import { MdArrowForwardIos } from "react-icons/md";
import "./BaseFim.css";

export function DatesReset({ dataDownSelected, baseName, setShowDatesReset }) {
  console.log(dataDownSelected);
  dataDownSelected = dataDownSelected.sort((a, b) => b.id - a.id);
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
      <h2 style={{ textAlign: "center" }}>Fechas de Reinicio</h2>
      <div style={{ marginTop: "30px" }}>
        <h3>{baseName}</h3>
        {dataDownSelected.length === 0 ? (
          <p style={{marginTop: "2rem"}} >No hay registros de intentos de reinicio</p>
        ) : (
          dataDownSelected.map((e) => (
            <div className="dates-container" key={e.id}>
              <table className="table-reset-fim">
                <tbody>
                  <tr>
                    <td>{e.id}</td>
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
