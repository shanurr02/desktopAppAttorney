const fs = require("fs");
const sharp = require("sharp");
const toIco = require("to-ico");

(async () => {
  try {
    // Your source PNG (should be at least 256x256)
    const sourcePng = "assets/icon.png";

    // Sizes to embed inside the .ico file
    const sizes = [16, 24, 32, 48, 64, 128, 256];

    // Generate buffers for each size
    const images = await Promise.all(
      sizes.map(size =>
        sharp(sourcePng)
          .resize(size, size, { fit: "contain" })
          .png()
          .toBuffer()
      )
    );

    // Combine into one .ico
    const icoBuffer = await toIco(images);

    // Save final multi-size .ico
    fs.writeFileSync("assets/icons/win/icon.ico", icoBuffer);

    console.log("✅ Multi-size icon.ico created successfully!");
  } catch (err) {
    console.error("❌ Error creating multi-size icon:", err);
  }
})();
