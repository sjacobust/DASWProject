
const fs = require('fs');
const USERS_DB = require('../data/users.json');
const CloudantSDK = require('@cloudant/cloudant');
const CLOUDANT_CREDS = require('../localdev-config.json');
const cloudant = new CloudantSDK(CLOUDANT_CREDS.url);
const USERS_CLOUDANT_DB = cloudant.db.use('users-db');
let CURRENT_ID = 0;


let uids = USERS_DB.map((obj)=>{return obj.uid});
CURRENT_ID = Math.max(...uids)+1;
console.log(`Current id: ${CURRENT_ID}`);
// console.table(USERS_DB);

class UsersController {
    generateId(){
        let id = CURRENT_ID;
        CURRENT_ID++;
        fs
        return id;
    }
    insertUser(user,cbOk){
        // user.uid = this.generateId();
        // USERS_DB.push(user);
        // return user;
        //user.password = bcrypt.hashSync(user.password,5);
        USERS_CLOUDANT_DB.insert(user).then((addedEntry)=>{
            console.log(addedEntry);
            if(addedEntry.ok){
                user.rev= addedEntry.rev;
                user.uid = addedEntry.id;
                cbOk(user);
            }else{
                cbOk();
            }
        }).catch((error)=>{
            cbOk(null,error);
        });
    }
    updateUser(user,cbOk){
        // let index = USERS_DB.findIndex(element => element.uid === user.uid);
        // if(index>-1){
        //     USERS_DB[index] = Object.assign(USERS_DB[index],user);
        //     return user;
        // }else{
        //     return undefined;
        // }
        console.log('update user...')
        let updatee = {
            nombre: user.nombre,
            apellidos: user.apellidos,
            username: docs.docs[0].username,
            email: user.email,
            password: user.password,
            fecha: user.fecha,
            _id: user.uid,
            _rev: user.rev,
            token: user.token
        }
        this.getUserByEmail(updatee.email,(foundUser)=>{
            if(foundUser){
                USERS_CLOUDANT_DB.insert(updatee).then((addedEntry)=>{
                    console.log(addedEntry);
                    if(addedEntry.ok){
                        user.rev= addedEntry.rev;
                        user.uid = addedEntry.id;
                        cbOk(user);
                    }else{
                        cbOk();
                    }
                }).catch((error)=>{
                    cbOk(null,error);
                });
            }else{
                cbOk();
            }
        })
    }

    deleteUser(user,cbOk){
        // let index = USERS_DB.findIndex(element => element.uid === user.uid);
        // if(index>-1){
        //     USERS_DB.splice(index,1);
        //     return true;
        // }else{
        //     return false;
        // }
        USERS_CLOUDANT_DB.destroy(user.uid,user.rev).then((body)=>{
            console.log(body);
            if(body.ok){
                cbOk(true);
            }else{
                cbOk(false);
            }
        });
    }

    
    async getList(cbOk){
        // return USERS_DB;
        // let users = new Array();
        // USERS_CLOUDANT_DB.list({include_docs:true})
        // .then((entries)=>{
        //     for(let entry of entries.rows){
        //         console.log(entry);
        //         users.push( entry.doc );
        //     }
        //     cbOk(users);
        // });
        let users = new Array();
        let entries = await USERS_CLOUDANT_DB.list({include_docs:true});
            for(let entry of entries.rows){
                console.log(entry);
                users.push( entry.doc );
            }
        return users;
    }
    async getUserByCredentials(email, password,cbOk){
        // let users = USERS_DB.filter((item,index,arr)=>{
        //     if( item.password.toLowerCase()=== password.toLowerCase() &&
        //         item.email.toLowerCase() === email.toLowerCase()){
        //         return true;
        //     }
        //     return false;
        // });
        // return users[0];
        const q = {
            selector:{
                email:{"$eq":email},
                password:{"$eq":password}
            }
        }
        let docs = await USERS_CLOUDANT_DB.find(q);
        if(docs.docs.length>0){
            //regresar resultado..
            // cbOk(true);
                let user = {
                    nombre: docs.docs[0].nombre,
                    apellidos: docs.docs[0].apellidos,
                    username: docs.docs[0].username,
                    email: docs.docs[0].email,
                    password: docs.docs[0].password,
                    fecha: docs.docs[0].fecha,
                    uid: docs.docs[0]._id,
                    rev: docs.docs[0]._rev
                }
            return user;
        }else{
            // cbOk(false);
            return ;
        }
    }
    getUniqueUser(name,lastname,email,cbOk){
        // let users = USERS_DB.filter((item,index,arr)=>{
        //     if(item.nombre.toLowerCase()=== name.toLowerCase() &&
        //         item.apellidos.toLowerCase()=== lastname.toLowerCase() &&
        //         item.email.toLowerCase() === email.toLowerCase()){
        //         return true;
        //     }
        //     return false;
        // });
        // return users[0];
        const q = {
            selector:{
                email:{"$eq":email},
                nombre:{"$eq":name},
                apellidos:{"$eq":lastname}
            }
        }
        USERS_CLOUDANT_DB.find(q).then((docs)=>{
            console.log(docs);
            if(docs.docs.length>0){
                //regresar resultado..
                let user = {
                    nombre: docs.docs[0].nombre,
                    apellidos: docs.docs[0].apellidos,
                    username: docs.docs[0].username,
                    email: docs.docs[0].email,
                    password: docs.docs[0].password,
                    fecha: docs.docs[0].fecha,
                    uid: docs.docs[0]._id,
                    rev: docs.docs[0]._rev
                }
                cbOk(user);
            }else{
                cbOk();
            }
        });
    }
    async getUser(id){
        // let user = USERS_DB.find(ele=>ele.uid ===id);
        // return user;
        let user = await USERS_CLOUDANT_DB.get(id);
        return user;
    }
    getUserByEmail(email,cbOk){
        // let user = USERS_DB.find(ele=>ele.email ===email);
        // return user;
        const q = {
            selector:{
                email:{"$eq":email}
            }
        }
        USERS_CLOUDANT_DB.find(q).then((docs)=>{
            if(docs.docs.length>0){
                //regresar resultado..
                let user = {
                    nombre: docs.docs[0].nombre,
                    apellidos: docs.docs[0].apellidos,
                    username: docs.docs[0].username,
                    email: docs.docs[0].email,
                    password: docs.docs[0].password,
                    fecha: docs.docs[0].fecha,
                    uid: docs.docs[0]._id,
                    rev: docs.docs[0]._rev
                }
                cbOk(user);
            }else{
                cbOk();
            }
        });
    }
    getUserByUsername(username,cbOk){
        // let user = USERS_DB.find(ele=>ele.email ===email);
        // return user;
        const q = {
            selector:{
                username:{"$eq":username}
            }
        }
        USERS_CLOUDANT_DB.find(q).then((docs)=>{
            if(docs.docs.length>0){
                //regresar resultado..
                let user = {
                    nombre: docs.docs[0].nombre,
                    apellidos: docs.docs[0].apellidos,
                    username: docs.docs[0].username,
                    email: docs.docs[0].email,
                    password: docs.docs[0].password,
                    fecha: docs.docs[0].fecha,
                    uid: docs.docs[0]._id,
                    rev: docs.docs[0]._rev
                }
                cbOk(user);
            }else{
                cbOk();
            }
        });
    }

}

module.exports = UsersController;