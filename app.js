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
    process.exit(1);
  }
};

instalazation();

const convertStateObj = (obj) => {
  return {
    stateId: obj.state_id,
    stateName: obj.state_name,
    population: obj.population,
  };
};

const convertDistObj = (obj) => {
  return {
    districtId: obj.district_id,
    districtName: obj.district_name,
    stateId: obj.state_id,
    cases: obj.cases,
    cured: obj.cured,
    active: obj.active,
    deaths: obj.deaths,
  };
};
/// API 1

app.get("/states/", async (request, response) => {
  const api1Q = `
    SELECT * 
    FROM 
    state
    ORDER BY 
    state_id
    `;
  const array = await db.all(api1Q);
  response.send(array.map((i) => convertStateObj(i)));
});

///API 2

app.get("/states/:stateId/", (request, response) => {
  const { stateId } = request.params;
  const api2Q = `
    SELECT * 
    FROM 
    state
    WHERE 
        state_id = ${stateId}
    `;
  const result = db.get(api2Q);
  response.send(convertStateObj(result));
});

///API 3

app.post("/districts/", async (request, response) => {
  const { districtName, stateId, cases, cured, active, deaths } = request.body;
  const api3Q = `
    INSERT INTO
    district (district_name,state_id,cases,cured,active,deaths)

    VALUES (
        '${districtName}',
        ${stateId},
        ${cases},
        ${cured},
        ${active},
        ${deaths}
    )
    `;
  await db.run(api3Q);
  response.send("District Successfully Added");
});

///API 4

app.get("/districts/:districtId/", async (request, response) => {
  const { districtId } = request.params;
  const api4Q = `
    SELECT * 
    FROM 
    district
    WHERE 
    district_id = ${districtId}
    `;
  const A = await db.get(api4Q);
  response.send(convertDistObj(A));
});

/// API 5

app.delete("/districts/:districtId/", async (request, response) => {
  const { districtId } = request.params;
  const api5Q = `
    DELETE 
    FROM 
    district
    WHERE 
    district_id = ${districtId}
    `;
  await db.run(api5Q);
  response.send("District Removed");
});

/// API 6

app.put("/districts/:districtId/", async (request, response) => {
  const { districtId } = request.params;
  const { districtName, stateId, cases, cured, active, deaths } = request.body;

  const api6Q = `
    UPDATE 
    
    district 
    SET 
    district_name = '${districtName}',
    state_id = ${stateId},
    cases = ${cases},
    cured = ${cured},
    active = ${active},
    deaths = ${deaths}
    WHERE 
    district_id = ${districtId}

    `;
  await db.run(api6Q);
  response.send("District Details Updated");
});

/// API 7
app.get("/states/:stateId/stats/", async (request, response) => {
  const { stateId } = request.params;
  console.log(stats);
  const api7Q = `
     SELECT 
     SUM(cases) AS totalCases,
     SUM(cured) AS totalCured,
     SUM(active) AS totalActive,
     SUM(deaths) AS totalDeaths

     FORM 
     district
     WHERE 
     state_id = ${stateId}
     `;
  const r1 = db.get(api7Q);
  response.send(r1);
});

/// API 8

app.get("/districts/:districtId/details/", async (request, response) => {
  const { districtId } = request.params;
  const api8Q = `
     SELECT state_name AS stateName
     FROM 
     state JOIN district 
     ON state.state_id = district.state_id
     WHERE 
     district.district_id = ${districtId}
     `;

  const r = await get(api8Q);

  response.send(r);
});
module.exports = app;
