const express = require("express");
const nodeMailer = require("nodemailer");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const mysql = require("mysql");
const StoneCut = require("./Routes/StoneCut");
const Lousada = require("./Routes/Lousada");
const MinorcaRoute = require("./Routes/MinorcaRoute");
const MonofioRoute = require("./Routes/MonofioRoute");
const Serra3500 = require("./Routes/Serra3500");
const StoneCut45Mill = require('./Routes/StoneCut45Mill');
const Alarms = require('./Routes/AlarmSettings');
const AlarmSettings = require("./Routes/AlarmSettings");


/*const client = require("twilio")(
  "AC30d90c932ea37c30c67b90ed466a24ad",
  "d2994d9914dcabe2dd60190c96fb4b0d"
);*/
/*
const db = mysql.createPool({
  host: "orion.morecolab.pt",
  port: "5505",
  user: "pedra",
  password: "pedra",
  insecureAuth: true,
  database: "db",
});*/

let mysqlDB = null; // db handler
let connected = null; // default null / boolean
let connectFreq = 5000; // When database is disconnected, how often to attempt reconnect? Miliseconds
let testFreq = 600000; // After database is connected, how often to test connection is still good? Miliseconds

function attemptMySQLConnection(callback) {
  console.log('Tentativa de ligação à BD MySQL\n')
 

    mysqlDB = mysql.createPool({
      host: "orion.morecolab.pt",
      port: "5505",
      user: "pedra",
      password: "pedra",
      insecureAuth: true,
      database: "db",
      connectionLimit: 300,
      waitForConnections: true, // Default value.
      queueLimit: 300, // Unlimited
      acquireTimeout: 60000,
      timeout: 60000,
      debug: false
    });

    testConnection((result) => {
      callback(result)
    })

  } 

function testConnection(cb) {
  console.log('\nTeste à ligação MySQL')
  mysqlDB.query('SELECT 1 + 1 AS solution', (error, results, fields) => {
    try {
      if (error) {
        throw new Error('\nSem ligação!!!');
      } else {
        if (results[0].solution) {
          cb(true)
        } else {
          cb(false)
        }
      }
    } catch (e) {
      // console.error(e.name + ': ' + e.message);
      cb(false)
    }
  });
}

function callbackCheckLogic(res) {
  if (res) {
    console.log('\nLigação com sucesso!!!\nPróximo teste em: ', testFreq, 'ms')
    setTimeout(testConnectionCB, testFreq);
  } else {
    console.log('\nMá ligação com BD\nPróxima tentativa de ligação em: ', connectFreq, 'ms')
    setTimeout(connectMySQL, connectFreq);
  }
}

function testConnectionCB() {
  testConnection((result) => {
    callbackCheckLogic(result);
  })
}

function connectMySQL() {
  attemptMySQLConnection(result => {
    callbackCheckLogic(result);
  });
}

connectMySQL(); // Start the process by calling this once

//module.exports = mysqlDB;

var corsOptions = {
  origin: "http://localhost:3000"
};
app.use(cors(corsOptions));

//app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use( '/' , express.static( 'oliveira-rodrigues-dashboard-api/build' ) );
app.use("/", StoneCut);
app.use("/", StoneCut45Mill);
app.use("/", Lousada);
app.use("/", MinorcaRoute);
app.use("/", MonofioRoute);
app.use("/", Serra3500);
app.use("/", AlarmSettings);

// notificação por SMS

const accountSid = "AC30d90c932ea37c30c67b90ed466a24ad";
const authToken = "c2c2be79e7500dc91d3d134e7d9c2c21";
const client = require('twilio')(accountSid, authToken);

app.post("/sendnotification", (req, res) => {
  const data = req.body.data;
  console.log("Mensagem a enviar: ", data);
  client.messages
    .create({
      body: `${data}`,
      //messagingServiceSid: "MGb2518061199ca35940162d5cc523d424",
      from : "+19897046095",
      to: "+351937012912",
    })
    .then((message) => console.log(message.sid))
    .done();
  res.json("Mensagem enviada!");
});

// API Twilio antiga
/*app.post("/sendnotification", (req, res) => {
  const data = req.body.data;
  console.log("Mensagem a enviar: ", data);
  client.messages
    .create({
      body: data,
      messagingServiceSid: "MGb2518061199ca35940162d5cc523d424",
      to: "+351937012912",
    })
    .then((message) => console.log(message.sid))
    .done();
  res.json("Mensagem enviada!");
});*/

//notificação por email

app.post('/send-email', function (req, res) {
  let transporter = nodeMailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
          user: 'orodrigues.app',
          pass: 'dhzotwfvyvqyrxpw'
      }
  });
  let mailOptions = {
      from: '"OR - App" <orodrigues.app@gmail.com>', // sender address
      //to: req.body.to, // list of receivers
      to: "rfreitas@morecolab.pt",
      //subject: req.body.subject, // Subject line
      subject: "Teste para notificações da pedreira",
      //text: req.body.body, // plain text body
      text: "Máquina: STONECUT\nErro: Alarm7:vedação ar baixa\n\nData: 04/07/2022 12:35\n",
      //html: '<b>PEDREIRA - NodeJS Email TESTE</b>' // html body
  };

  transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
          return console.log(error);
      }
      console.log('Message %s sent: %s', info.messageId, info.response);
          res.render('index');
      });
  });
     

app.listen(3001, () => {
  console.log("Running on port 3001");
});
