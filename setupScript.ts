const https = require("https");
const fs = require("fs");
const path = require("path");
const decompress = require("decompress");
const AdmZip = require("adm-zip")

const url = "https://use.fontawesome.com/releases/v6.2.0/fontawesome-free-6.2.0-web.zip";

const zipPath = path.join("src", "assets");

fs.mkdirSync(zipPath, { recursive: true });

const fontAwesomeFile = "fontawesome.zip";
const fontAwesomeFilePath = path.join(zipPath, fontAwesomeFile);
const fontAwesomeUnzippedFile = "fontawesome";
const fontAwesomeUnzippedFilePath = path.join(zipPath, fontAwesomeUnzippedFile);
const file = fs.createWriteStream(fontAwesomeFilePath);
const unzippedFile = fs.createWriteStream(fontAwesomeUnzippedFilePath);
const currZipPath = path.join(zipPath, "fontawesome-free-6.2.0-web")

https.get(url, function (response) {
    response.pipe(file, unzippedFile);
    file.on("finish", () => {
        file.close();
        console.log("Download Completed");
        const unzipFile = decompress(fontAwesomeFilePath, zipPath);
        console.log("Unzipped");

    });
});

try {
    fs.renameSync(currZipPath, fontAwesomeUnzippedFilePath);
    console.log("Renamed the directory.")
} catch (err) {
    console.log(err)
}

