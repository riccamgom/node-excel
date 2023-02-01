//Service
const excelService = require("../services/excelService.js");

/*class excelController{
    static prueba(req, res) {
        console.log ("hola controlador");
        res.send('Hola cont');
    }
}
module.exports = excelController
*/

module.exports = {
    prueba(req, res) {
        res.send("Excel controller");
    },
};
