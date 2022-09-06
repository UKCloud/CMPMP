import * as https from "https";
import * as fs from "fs";
import * as path from 'path';
import * as decompress from "decompress";

const url: string = "https://use.fontawesome.com/releases/v6.2.0/fontawesome-free-6.2.0-web.zip";
const zipPath: string = path.join("src", "assets");
fs.mkdirSync(zipPath, { recursive: true });
const fontAwesomeFile: string = "fontawesome.zip";
const fontAwesomeFilePath: string = path.join(zipPath, fontAwesomeFile);
const fontAwesomeUnzippedFile: string = "fontawesome";
const destFilePath: string = path.join(zipPath, fontAwesomeUnzippedFile);
const file = fs.createWriteStream(fontAwesomeFilePath);
const currPath: string = path.join(zipPath, "fontawesome-free-6.2.0-web")

https.get(url, function (response) {
    response.pipe(file);
    file.on("finish", () => {
        file.close();
        console.log("Download Completed");
        decompress(fontAwesomeFilePath, zipPath).then(() => {
            fs.rename(currPath, destFilePath, () => {
                console.log("Download unzipped")
                fs.unlinkSync(fontAwesomeFilePath);
            })
        })
    });
});
