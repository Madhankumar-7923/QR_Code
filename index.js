import express from "express";
import bodyParser from "body-parser";
import qr from "qr-image";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const port = 3000;

// Get the directory name from the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(bodyParser.urlencoded({ extended: true }));

// set the public files directory
app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'ejs');

// Set the views directory
app.set('views', path.join(__dirname, 'views'));

app.get("/", (req, res) => {
    res.render("index.ejs");
});

app.post("/qr-gen", (req, res) => {
    const url = req.body.url;
    const filename = req.body.filename;

    const qr_svg = qr.image(url, { type: 'png' });
    let buffer = [];
    qr_svg.on('data', chunk => buffer.push(chunk));

    qr_svg.on('end', () => {

        const qrCodeBuffer = Buffer.concat(buffer);
        const qrCodeBase64 = qrCodeBuffer.toString('base64');
        const qrCodeDataUri = `data:image/png;base64,${qrCodeBase64}`;

        res.render("text-qr.ejs", { qrcodeencoded: qrCodeDataUri, qrfile: filename });
    });

});

app.get("*", (req, res) => {
    res.render("error.ejs", { title: "404 - Page Not Found" });
});

app.listen(port, () => {
    console.log(`Server Started in port ${port}`);
});