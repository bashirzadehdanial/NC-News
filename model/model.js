const db= require('../db/connection.js');


function fetchTopics(){
   return db.query('SELECT * FROM topics').then(result=>{
        return result.rows
})
}


module.exports= {fetchTopics}