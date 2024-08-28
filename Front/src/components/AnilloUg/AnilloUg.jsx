import { Navbar } from "../Navbar/Navbar";
import "./AnilloUg.css";

export function AnilloUg() {
  return (
    <main className="main-container-anilloug">
      <Navbar title={"Anillo UG"} />
      <div className="anilloug-image-container">
        <img className="anilloug-image" src="/mapa-ug.webp" alt="" />
        <div className="main-lights-anilloug-container">
          <div className="status-light-anillo-container">
            <p // 10.224.114.86
              title={"aaa"}
              className={`status-light-anillo id18900}`}
            >
              <a
                style={{ color: "black" }}
                href={`7918&tabid=1`}
                // href={`${PRTG_URL}7918&tabid=1`}
                target="_blank"
              >
                Eth1/47
              </a>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
