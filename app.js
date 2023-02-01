//Definicion de constantes
const express = require('express');
const app = express();
const router = express.Router();
const path = __dirname + '/views/';
const port = 8080;

//Rutas
router.use(function (req,res,next) {
  console.log('/' + req.method);
  next();
});

router.get('/', function(req,res){
  res.sendFile(path + 'index.html');
});

router.get('/ejemplo', function(req,res){
  res.sendFile(path + 'ejemplo.html');
});

router.get('/hola', function(req,res){
   	const soap = require('soap');
	const USERID = 'xxUSUARIOxx';
	const USERPWD = 'xxPASSWORDxx';
	const AGENCY = '012345';
	const CLICODE = '0123';
	const URLWS = 'http://localhost.11111/Service1.svc';
	const ENDPOINT = 'http://localhost.11111/Service1.svc?WSDL';
	const WSCONTRACT = 'http://www.tourlineexpress.com/IService1/';
	const WSNAMESPACE = 'http://www.tourlineexpress.com';
	const WSXSD = 'http://www.w3.org/2005/08/addressing';

		class WS_Tourline {
		  constructor() {}

		  async setSoap() {
		    this.soapClient = await soap.createClient(ENDPOINT);
		  }

		  async login(wsMethod) {
		    const headers = {
		      'UserId': {'$': {'xmlns': WSNAMESPACE}, '_': USERID},
		      'Password': {'$': {'xmlns': WSNAMESPACE}, '_': USERPWD},
		      'Action': {'$': {'xmlns': WSXSD}, '_': WSCONTRACT + wsMethod},
		      'To': {'$': {'xmlns': WSXSD}, '_': URLWS}
		    };
		    this.soapClient.addSoapHeader(headers);
		  }

		  async GetAgenciaCan(postalCode, townName, warns) {
		    try {
		      const wsMethod = 'GetAgenciaCan';
		      await this.login(wsMethod);
		      const retval = await this.soapClient[wsMethod]({
			'AgencyClientCode': AGENCY,
			'PostalCode': postalCode,
			'Town': townName,
			'UseWarnings': warns
		      });

		      if (this.soapClient.isFault(retval)) {
			console.error(`SOAP Fault: (faultcode: ${retval.faultcode}, faultstring: ${retval.faultstring})`);
		      } else if (retval.HasError) {
			console.log(retval);
		      } else {
			console.error('ERROR DE WEBSERVICE');
		      }
		    } catch (err) {
		      console.error(`Tourline Exception: ${err.message}`);
		    }
		  }
		}
	});

//Middleware
app.use(express.static(path));
app.use('/', router);

app.listen(port, function () {
  console.log('Api en el puerto 8080')
})
