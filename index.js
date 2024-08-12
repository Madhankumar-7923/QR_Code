import express from "express";
import bodyParser from "body-parser";
import qr from "qr-image";

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

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

app.listen(port, () => {
    console.log(`Server Started in port ${port}`);
});