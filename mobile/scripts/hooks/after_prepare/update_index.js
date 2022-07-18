const fs = require("fs");
const path = require("path");

module.exports = function (ctx) {
   const androidPlatformRoot = path.join(ctx.opts.projectRoot, "platforms/android");
   const androidIndexFileLocation = path.join(androidPlatformRoot, "app/src/main/assets/www/index.html");

   if (fs.existsSync(androidIndexFileLocation)) {

      let indexFileContents = fs.readFileSync(androidIndexFileLocation, "utf8");
      const cordovaSectionRegex = new RegExp(/<!-- cordova-section-begin(.*)cordova-section-end -->/gis);
      const cordovaSection = cordovaSectionRegex.exec(indexFileContents);

      if (cordovaSection) {
         console.log("after_pepare hook: Cordova section found in index.html. Updating...");
         indexFileContents = indexFileContents.replace(/<\/body>/, `${cordovaSection[1]}</body>`);
         indexFileContents = indexFileContents.replace(cordovaSectionRegex, "");
         fs.writeFileSync(androidIndexFileLocation, indexFileContents, "utf-8");
         console.log("after_pepare hook: Cordova section has been successfully updated");
      } else {
         console.warn("after_pepare hook: Failed to find cordova section in index.html");
      }
   } else {
      console.log(
         `after_pepare hook: index.html for Android platform in not present. Skipping: ${androidIndexFileLocation}`
      );
   }
};
