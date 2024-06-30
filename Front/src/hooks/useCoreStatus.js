import { useDataInfGen } from "./useDataInfGen";
// console.log(data)

export const useCoreStatus = async () => {
  const data = await useDataInfGen();
  const coreAdminUp = data.upElements.filter(
    (e) => e.name_switch === "SW CORE ADMIN" && e.status === "Up"
  );
  const coreAdminDown = data.downElements.filter(
    (e) => e.name_switch === "SW CORE ADMIN" && e.status.includes("Down")
  );

  const coreConceUp = data.upElements.filter(
    (e) => e.name_switch === "SW CORE CONCE" && e.status === "Up"
  );
  const coreConceDown = data.downElements.filter(
    (e) => e.name_switch === "SW CORE CONCE" && e.status.includes("Down")
  );

  const coreOjosUp = data.upElements.filter(
    (e) => e.name_switch === "SW CORE OJOS" && e.status === "Up"
  );
  const coreOjosDown = data.downElements.filter(
    (e) => e.name_switch === "SW CORE OJOS" && e.status.includes("Down")
  );
  

  const coreAdminUpPercent = Math.floor(
    (coreAdminUp.length / (coreAdminUp.length + coreAdminDown.length)) * 100);
  const coreConceUpPercent = Math.floor(
    (coreConceUp.length / (coreConceUp.length + coreConceDown.length)) * 100);
  const coreOjosUpPercent = Math.floor(
    (coreOjosUp.length / (coreOjosUp.length + coreOjosDown.length)) * 100);


  return {
    coreAdminUpPercent: coreAdminUpPercent,
    colorAdminCore: getColorStatus(coreAdminUpPercent),
    coreConceUpPercent: coreConceUpPercent,
    colorConceCore: getColorStatus(coreConceUpPercent),
    coreOjosUpPercent: coreOjosUpPercent,
    colorOjosCore: getColorStatus(coreOjosUpPercent),
  };
};

function getColorStatus (percent) {
  if (70 <= percent && percent < 100) {
    return "yellow";
  }
  if (percent < 70) {
    return "red";
  }
  if (percent === 100) {
    return "green";
  }
};
