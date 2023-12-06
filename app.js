const express = require("express");
const path = require("path");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const app = express();
app.use(express.json());

const dbpath = path.join(__dirname, "covid19India.db");

db = null;

const instalazation = async () => {
  try {
    db = await open({ filename: dbpath, driver: sqlite3.Database });
    app.listen(3000, () => {
      console.log("server is running on http://localhost:3000/covid-19/");
    });
  } catch (e) {
    console.log(`error ${e.message}`);
    process.exit(1)
  }
};

instalazation();

const convertStateObj = (Obj) =>{
    return{
        stateId: obj.state_id,
        stateName: obj.state_name,
        population: obj.population
        
    }
}

/// API 1

app.get("/states/",(request,response) =>{
    const api1Q = `
    SELECT * 
    FROM 
    state
    ORDER BY 
    state_id
    `
    const array = await db.all(api1Q)
    response.send(array.map((i) => convertStateObj(i)))

})
