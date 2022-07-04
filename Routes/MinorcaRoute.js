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

router.get('/minorca', (req, res) =>{
    const sqlSelect = "SELECT * FROM minorca ";
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



router.get('/minorca/dia', (req, res) =>{
    const sqlSelect = "SELECT * FROM minorca ORDER BY data_hora DESC LIMIT 8";
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

router.get('/minorca/semana', (req, res) =>{
    const sqlSelect = "SELECT * FROM minorca ORDER BY data_hora DESC LIMIT 16";
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

router.get('/minorca/mes', (req, res) =>{
    const sqlSelect = "SELECT * FROM minorca ORDER BY data_hora DESC LIMIT 30";
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

router.get('/machine/minorca/last', (req, res) =>{
    const sqlSelect = "SELECT * FROM db.Minorça WHERE Date(DateTime) = CURDATE() ORDER BY `DateTime` DESC LIMIT 1";
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

router.get('/machine/minorca/start', (req, res) =>{
    const sqlSelect = "SELECT * FROM `Minorça` WHERE DATE(DateTime) = CURDATE() AND Start = 1 Limit 1";    
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

router.get('/machine/minorca/dia', (req, res) =>{
    const sqlSelect = "SELECT * FROM db.Minorça WHERE DATE(DateTime) = CURDATE() ORDER BY DateTime DESC";
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
router.get('/machine/minorca/semana', (req, res) =>{
    const sqlSelect = "SELECT * FROM db.Minorça WHERE DATE(DateTime) >= CURDATE() - INTERVAL 7 DAY";
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
router.get('/machine/minorca/mes', (req, res) =>{
    const sqlSelect = "SELECT * FROM db.Minorça WHERE DATE(DateTime) >= CURDATE() - INTERVAL 30 DAY";
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