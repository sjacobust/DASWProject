'use strict';
const { log } = require('console');
const express = require('express');
const UsersController = require('../controllers/usersController');
const usersCtrl = new UsersController();
const router = express();

router.post('/', (req, res) => {
    let b = req.body;
    if (b.username && b.nombre && b.apellidos && b.email && b.fecha) {
        usersCtrl.getUniqueUser(b.nombre, b.apellidos, b.email, (u)=>{
            console.log(u);
            if (u) {
                res.status(400).send('user already exists');
            } else {
                usersCtrl.insertUser(b,(user)=>{
                    res.status(201).send(user);
                });
            }
        });
    } else {
        res.status(400).send('missing arguments');
    }
});

router.get('/:username', (req,res)=>{
    // let userCtrl = new UsersController();
    // let users = userCtrl.getList();
    if(req.params.username){
        // users = users.find(ele=> ele.email === req.params.email);
        usersCtrl.getUserByEmail(req.params.username,(users)=>{
            if(users){
                res.send(users);
            }else{
                res.set('Content-Type','application/json');
                res.status(204).send({});
            }
        });
    }else{
        res.status(400).send('missing params');
    }
});

// router.delete('/:email',(req,res)=>{
//     if (req.params.email) {
//         usersCtrl.getUserByEmail(req.params.email,(u)=>{
//             if (u) {
//                 usersCtrl.deleteUser(u,(deleted)=>{
//                     res.status(200).send({"deleted":deleted});
//                 })
//             } else {
//                 res.status(404).send('user does not exist');
//             }
//         });
//     } else {
//         res.status(400).send('missing arguments');
//     }
// });

module.exports = router;