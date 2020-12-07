
const fs = require('fs');
const ARTICLES_DB = require('../data/articles.json');
const CloudantSDK = require('@cloudant/cloudant');
const CLOUDANT_CREDS = require('../localdev-config.json');
const cloudant = new CloudantSDK(CLOUDANT_CREDS.url);
const ARTICLES_CLOUDANT_DB = cloudant.db.use('articles-db');
let CURRENT_ID = 0;

// console.table(ARTICLES_DB);

class ArticlesController {
    generateId(){
        let id = CURRENT_ID;
        CURRENT_ID++;
        fs
        return id;
    }
    insertArticle(article,cbOk){
        ARTICLES_CLOUDANT_DB.insert(article).then((addedEntry)=>{
            console.log(addedEntry);
            if(addedEntry.ok){
                article.rev= addedEntry.rev;
                article.id = addedEntry.id;
                cbOk(article);
            }else{
                cbOk();
            }
        }).catch((error)=>{
            cbOk(null,error);
        });
    }
    updateArticle(article,cbOk){
        console.log('update article...')
        let updatee = {
            _id: article.id,
            _rev: article.rev,
            title: article.title,
            body: article.body,
            tags: article.tags,
            game: article.game
        }
        this.getArticle(updatee._id, (foundArticle)=>{
            if(foundArticle){
                ARTICLES_CLOUDANT_DB.insert(updatee).then((addedEntry)=>{
                    console.log(addedEntry);
                    if(addedEntry.ok){
                        article.rev= addedEntry.rev;
                        article.uid = addedEntry.id;
                        cbOk(article);
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

    deleteArticle(article,cbOk){
        ARTICLES_CLOUDANT_DB.destroy(article.uid,article.rev).then((body)=>{
            console.log(body);
            if(body.ok){
                cbOk(true);
            }else{
                cbOk(false);
            }
        });
    }

    
    async getList(cbOk){
        let article = new Array();
        let entries = await ARTICLES_CLOUDANT_DB.list({include_docs:true});
            for(let entry of entries.rows){
                console.log(entry);
                article.push( entry.doc );
            }
        return article;
    }
    
    async getArticle(id){
        let article = await ARTICLES_CLOUDANT_DB.get(id);
        return article;
    }

}

module.exports = ArticlesController;