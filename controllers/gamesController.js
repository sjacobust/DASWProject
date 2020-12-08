
const fs = require('fs');
const GAMES_DB = require('../data/games.json');
const CloudantSDK = require('@cloudant/cloudant');
const CLOUDANT_CREDS = require('../localdev-config.json');
const cloudant = new CloudantSDK(CLOUDANT_CREDS.url);
const GAMES_CLOUDANT_DB = cloudant.db.use('games-db');
let CURRENT_ID = 0;

// console.table(GAMES_DB);

class GamesController {
    generateId(){
        let id = CURRENT_ID;
        CURRENT_ID++;
        fs
        return id;
    }
    insertGame(game,cbOk){
        GAMESS_CLOUDANT_DB.insert(game).then((addedEntry)=>{
            console.log(addedEntry);
            if(addedEntry.ok){
                game.rev= addedEntry.rev;
                game.id = addedEntry.id;
                cbOk(game);
            }else{
                cbOk();
            }
        }).catch((error)=>{
            cbOk(null,error);
        });
    }
    updateGame(game,cbOk){
        console.log('update game...')
        let updatee = {
            _id: game.id,
            _rev: game.rev,
            game: game.game,
            genre: game.genre,
            image_url: game.image_url,
            article_no: game.article_no,
            developers: game.developers,
            online: game.online,
            platform: game.platform
        }
        this.getGame(updatee._id, (foundGame)=>{
            if(foundGame){
                GAMES_CLOUDANT_DB.insert(updatee).then((addedEntry)=>{
                    console.log(addedEntry);
                    if(addedEntry.ok){
                        game.rev= addedEntry.rev;
                        game.id = addedEntry.id;
                        cbOk(game);
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
    getUniqueGame(game,genre,cbOk){
        const q = {
            selector:{
                game:{"$eq":game},
                genre:{"$eq":genre},
            }
        }
        GAMES_CLOUDANT_DB.find(q).then((docs)=>{
            console.log(docs);
            if(docs.docs.length>0){
                //regresar resultado..
                let game = {
                    game: docs.docs[0].game,
                    genre: docs.docs[0].genre,
                    image_url: docs.docs[0].image_url,
                    article_no: docs.docs[0].article_no,
                    developers: docs.docs[0].developers,
                    online: docs.docs[0].online,
                    platform: docs.docs[0].platform,
                    id: docs.docs[0]._id,
                    rev: docs.docs[0]._rev
                }
                cbOk(game);
            }else{
                cbOk();
            }
        });
    }

    deleteGame(game,cbOk){
        GAMES_CLOUDANT_DB.destroy(game.id,game.rev).then((body)=>{
            console.log(body);
            if(body.ok){
                cbOk(true);
            }else{
                cbOk(false);
            }
        });
    }

    
    async getList(cbOk){
        let game = new Array();
        let entries = await GAMES_CLOUDANT_DB.list({include_docs:true});
            for(let entry of entries.rows){
                console.log(entry);
                game.push( entry.doc );
            }
        return game;
    }
    
    async getGame(id){
        let game = await GAMES_CLOUDANT_DB.get(id);
        return game;
    }

}

module.exports = GamesController;
