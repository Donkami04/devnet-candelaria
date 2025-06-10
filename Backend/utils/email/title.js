const navbar = () => {
  try {
    const title = `
<div style="width: 100%; height: 4rem; background-color: #e5e5e5; text-align: center;">
  <h1 style="position: absolute; left: 50%; transform: translateX(-50%); text-align: center; font-family: Verdana, Tahoma, sans-serif; font-size: 2.5rem; color: #bd0b21;">
    Devnet
  </h1>
</div>

  `;

    return title;
  } catch (error) {
    console.error("Error fetching device data:", error);
    throw new Error("Failed to fetch device data");
  }
};

module.exports = {
  navbar,
};
