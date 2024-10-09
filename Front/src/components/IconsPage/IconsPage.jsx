import { SiCisco } from "react-icons/si";
import { BiSolidTachometer } from "react-icons/bi";

export const IconsPage = () => {
  return (
    <div className="cisco-prtg-icons">
      <div>
        <SiCisco size="2rem" color="green" />
      </div>
      <div>
        <BiSolidTachometer size="1.7rem" color="green" />
      </div>
    </div>
  );
};
