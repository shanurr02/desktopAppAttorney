const fs = require("fs");
const toIco = require("to-ico");

(async () => {
  try {
    const pngBuffer = fs.readFileSync("assets/icon.png");
    const icoBuffer = await toIco([pngBuffer]);
    fs.writeFileSync("assets/icons/win/icon.ico", icoBuffer);
    console.log("✅ Icon converted successfully!");
  } catch (err) {
    console.error("❌ Error converting icon:", err);
  }
})();
