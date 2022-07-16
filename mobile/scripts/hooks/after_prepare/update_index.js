const fs = require("fs");
const path = require("path");

module.exports = function (ctx) {

   function replaceStringInFile(filename, toReplace, replaceWith) {
      var data = fs.readFileSync(filename, "utf8");
      var result = data.replace(new RegExp(toReplace, "g"), replaceWith);
      fs.writeFileSync(filename, result, "utf8");
   }

   const androidPlatformRoot = path.join(ctx.opts.projectRoot, "platforms/android");
   const androidIndexFileLocation = path.join(androidPlatformRoot, "app/src/main/assets/www/index.html");

   if (fs.existsSync(androidIndexFileLocation)) {
      replaceStringInFile(androidIndexFileLocation, /<!-- web-version-config-on -->/, "<!-- web-version-config-off");
      replaceStringInFile(androidIndexFileLocation, /<!-- end-web-version-config-on -->/,"end-web-version-config-off -->");
      replaceStringInFile(androidIndexFileLocation, /<!-- cordova-version-config-off/,"<!-- cordova-version-config-on -->");
      replaceStringInFile(androidIndexFileLocation, /end-cordova-version-config-off -->/,"<!-- end-cordova-version-config-on -->");
   } else {
      console.log(`Failed to find index.html file for Android platform: ${androidIndexFileLocation}`);
   }

   const iosPlatformRoot = path.join(ctx.opts.projectRoot, "platforms/ios");
   const iosIndexFileLocation = (value = path.join(iosPlatformRoot, "app/src/main/assets/www/index.html"));

   if (fs.existsSync(iosIndexFileLocation)) {
      replaceStringInFile(iosIndexFileLocation, /<!-- web-version-config-on -->/, "<!-- web-version-config-off");
      replaceStringInFile(iosIndexFileLocation, /<!-- end-web-version-config-on -->/,"end-web-version-config-off -->");
      replaceStringInFile(iosIndexFileLocation, /<!-- cordova-version-config-off/,"<!-- cordova-version-config-on -->");
      replaceStringInFile(iosIndexFileLocation, /end-cordova-version-config-off -->/,"<!-- end-cordova-version-config-on -->");
   } else {
      console.log(`Failed to find index.html file for Android platform: ${iosIndexFileLocation}`);
   }
};
