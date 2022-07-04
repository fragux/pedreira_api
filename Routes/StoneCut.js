const express = require('express');
const mysql = require('mysql');
const router = express.Router();

const db = mysql.createPool({
    host: 'orion.morecolab.pt',
    port: '5505',
    user: 'pedra',
    password: 'pedra',
    insecureAuth : true,
    database: 'db',
})

//endpoint para CNC - STONECUT

router.get('/machine/cnc1/dia', (req, res) =>{
    const sqlSelect = "SELECT * FROM `CNC1` WHERE DATE(DateTime) = CURDATE() ORDER BY DateTime DESC";
    db.query(sqlSelect, (err, result) =>{
        if (err){
            console.log(err);
        }
        else {
            res.send(result);
            console.log(result);
        }
    })
});
router.get('/machine/cnc1/semana', (req, res) =>{
    const sqlSelect = "SELECT * FROM `CNC1` WHERE DATE(DateTime) >= CURDATE() - INTERVAL 7 DAY";
    db.query(sqlSelect, (err, result) =>{
        if (err){
            console.log(err);
        }
        else {
            res.send(result);
            console.log(result);
        }
    })
});
router.get('/machine/cnc1/mes', (req, res) =>{
    const sqlSelect = "SELECT * FROM `CNC1` WHERE DATE(DateTime) >= CURDATE() - INTERVAL 30 DAY";
    db.query(sqlSelect, (err, result) =>{
        if (err){
            console.log(err);
        }
        else {
            res.send(result);
            console.log(result);
        }
    })
});

router.get('/machine/cnc1/last', (req, res) =>{
    const sqlSelect = "SELECT * FROM CNC1  WHERE DateTime > curdate() ORDER BY DateTime Desc Limit 1";
    db.query(sqlSelect, (err, result) =>{
        if (err){
            console.log(err);
        }
        else {
            res.send(result);
            console.log(result);
        }
    })
});


router.get('/machine/cnc1/job', (req, res) =>{
    const sqlSelect = "SELECT DateTime, Job, Production, Production - LAG(Production) OVER (PARTITION BY Job ORDER BY DateTime) AS nJob FROM `CNC1` WHERE DATE(DateTime) = CURDATE()  AND Job = 1 AND Production > 0 AND Production <= 4 ";
    db.query(sqlSelect, (err, result) =>{
        if (err){
            console.log(err);
        }
        else {
            res.send(result);
            console.log(result);
        }
    })
});

router.get('/machine/cnc1/start', (req, res) =>{
    const sqlSelect = "SELECT * FROM `CNC1` WHERE DATE(DateTime) = CURDATE() AND Tension >100 Limit 1";    
    db.query(sqlSelect, (err, result) =>{
        if (err){
            console.log(err);
        }
        else {
            res.send(result);
            console.log(result);
        }
    })
});


router.get('/machine/cnc1/alarms/dia', (req, res) =>{
    const sqlSelect = "SELECT * FROM `CNC1` WHERE DATE(DateTime) = CURDATE () AND Alarm <> 'Clear' AND Alarm <> '' ORDER BY DateTime DESC";    
    db.query(sqlSelect, (err, result) =>{
        if (err){
            console.log(err);
        }
        else {
            res.send(result);
            console.log(result);
        }
    })
});

router.get('/machine/cnc1/alarms/semana', (req, res) =>{
    const sqlSelect = "SELECT * FROM `CNC1` WHERE DATE(DateTime) >= CURDATE() - INTERVAL 7 DAY AND Alarm <> 'Clear' AND Alarm <> '' ORDER BY DateTime DESC";    
    db.query(sqlSelect, (err, result) =>{
        if (err){
            console.log(err);
        }
        else {
            res.send(result);
            console.log(result);
        }
    })
});
router.get('/machine/cnc1/alarms/mes', (req, res) =>{
    const sqlSelect = "SELECT * FROM `CNC1` WHERE DATE(DateTime) >= CURDATE() - INTERVAL 30 DAY AND Alarm <> 'Clear' AND Alarm <> '' ORDER BY DateTime DESC";    
    db.query(sqlSelect, (err, result) =>{
        if (err){
            console.log(err);
        }
        else {
            res.send(result);
            console.log(result);
        }
    })
});





module.exports = (router);