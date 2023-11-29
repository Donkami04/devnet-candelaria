import "./map.css";
import { GiBrickWall } from "react-icons/gi";
import { CiCloudOn } from "react-icons/ci";
import { Navbar } from "../../Navbar/Navbar";

export const Map = () => {
  return (
    <>
      <Navbar />
      <div className="firewalls-nodes-container">
        <div className="node-container-1">
          <p className="name-node">FW Santiago</p>
          <GiBrickWall className="node-fw" />
          <div class="status-node"></div>
          <hr className="line-node line-1" />
        </div>
        <div className="node-container-2">
          <p className="name-node">FW Santiago</p>
          <GiBrickWall className="node-fw" />
          <div class="status-node"></div>
          <hr className="line-node line-2" />
        </div>
        <div className="node-container-3">
          <p className="name-node">FW Santiago</p>
          <GiBrickWall className="node-fw" />
          <div class="status-node"></div>
          <hr className="line-node line-3" />
        </div>
        <div className="node-container-4">
          <p className="name-node">FW Santiago</p>
          <GiBrickWall className="node-fw" />
          <div class="status-node"></div>
          <hr className="line-node line-4" />
        </div>
        <div className="node-container-5">
          <p className="name-node">FW Santiago</p>
          <GiBrickWall className="node-fw" />
          <div class="status-node"></div>
          <hr className="line-node line-5" />
        </div>
        <div className="node-container-6">
          <p className="name-node">FW Santiago</p>
          <GiBrickWall className="node-fw" />
          <div class="status-node"></div>
          <hr className="line-node line-6" />
        </div>
        <div className="node-container-7">
          <p className="name-node">FW Santiago</p>
          <GiBrickWall className="node-fw" />
          <div class="status-node"></div>
          <hr className="line-node line-7" />
        </div>
      </div>
      <div className="internet-cloud-container">
        <CiCloudOn className="cloud" />
        <p className="name-internet">Internet</p>
      </div>

      <div className="canales-nodes-container">
        <div className="canales-container-1">
          <div>
            <CiCloudOn className="cloud-canales" />
            <p className="name-canal">Starlink</p>
            <div class="status-node-canal"></div>
          </div>
          <div>
            <CiCloudOn className="cloud-canales" />
            <p className="name-canal">Canal Admin</p>
            <div class="status-node-canal"></div>
          </div>
        </div>
        <div>
          <CiCloudOn className="cloud-canales" />
          <p className="name-canal">Canal Conce</p>
          <div class="status-node-canal"></div>
        </div>
        <div>
          <CiCloudOn className="cloud-canales" />
          <p className="name-canal">Canal Ojos</p>
          <div class="status-node-canal"></div>
        </div>
      </div>

      <div className="curves-container">
        <div className="curve-container-1">
          <div class="curve-1" />
        </div>
        <div className="curve-container-2">
          <div class="curve-2" />
        </div>
        <div className="curve-container-3">
          <div class="curve-3" />
        </div>
        <div className="curve-container-4">
          <div class="curve-4" />
        </div>
        <div className="curve-container-5">
          <div class="curve-5" />
        </div>
      </div>

    </>
  );
};
