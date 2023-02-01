//Requires
const express = require("express");
const multer = require("multer");
const bodyParser = require("body-parser");
const reqSanitizer = require("req-sanitizer");
const fileSystem = require("fs");
const XLSX = require("xlsx");
//Multer para manejar el buffer de archivos y donde se va a guardar (carpeta uploads)
const upload = multer({ dest: "uploads/" });
const storageInMemory = multer.memoryStorage();
const uploadInMemory = multer({ storageInMemory });

const app = express();
const router = express.Router();

//Rutas y puerto
const pathu = __dirname + "/uploads/";
const pathd = __dirname + "/downloads/";
const port = 8085;

const excelController = require("./controllers/excelController");

app.post("/sayhi", function (req, res) {
    res.send("Hi");
});

//Acepta(xls, csv, xlsx):Devuelve un JSON con el excel parseado
router.post(
    "/readexcel",
    uploadInMemory.single("file"),
    function (req, res, next) {
        console.log("READ-------");
        var excelread = XLSX.read(req.file.buffer, { type: "buffer" });
        const tablaexcel = excelread.Sheets[excelread.SheetNames[0]];
        const data = XLSX.utils.sheet_to_json(tablaexcel, { raw: false });
        const arrayErrors = [];

        res.status(200).json({
            status: arrayErrors.length > 0 ? 0 : 1,
            data,
            errors: arrayErrors,
        });
    }
);

// Ruta para crear un excel con un JSON
router.post("/writerexcel", function (req, res, next) {
    console.log("WRITE-------");
    const data = req.body;
    const exceljson = XLSX.utils.json_to_sheet(data);
    const tablaexcel = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(tablaexcel, exceljson, "Excel Api");
    //XLSX.writeFile(tablaexcel, pathd + 'test.xlsx');
    const vuelta = XLSX.write(tablaexcel, { type: "buffer", bookType: "xlsx" });
    //Envio para download
    //res.sendFile(path + 'test.xlsx');
    //*Pipestream
    const filePath = pathd + "test.xlsx";
    let stat = fileSystem.statSync(filePath);

    /*return res.status(200).json({
    data:vuelta
	})
	*/
    res.writeHead(200, {
        "Content-Type": "application/vnd.ms-excel",
    });

    return res.end(Buffer.from(vuelta.buffer));
    //let readStream = fileSystem.createReadStream(filePath);
    //readStream.pipe(res);
});

//Express
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(reqSanitizer());
app.use("/", router);

//Api listen
app.listen(port, function () {
    console.log("Api en el puerto 8085");
});
