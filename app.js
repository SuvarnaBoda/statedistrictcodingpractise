const express = require("express");
const path = require("path");

const { open } = require("sqlite");
const sqlite3 = require("sqlite3");

const app = express();
app.use(express.json());
const dbpath = path.join(__dirname, "covid19India.db");
const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbpath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server Running at http://localhost:3000/");
    });
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
    process.exit(1);
  }
};
initializeDBAndServer();
app.get(" /states/", async (request, response) => {
  const alllistquery = `
        SELECT * FROM  state  ORDER BY state_id;
    `;
  const dballresponse = await db.all(alllistquery);
  response.send(dballresponse);
});
app.get("/states/:stateId/", async (request, response) => {
  const { stateId } = request.params;
  const statequery = `
        SELECT * FROM state ORDER BY state_id WHERE state_id=${state_id};
    `;
  const stateresponse = await db.get(statequery);
  response.send(stateresponse);
});
app.post("/districts/", async (request, response) => {
  const districtdetails = request.body;
  const { districtName, cases, cured, active, deaths } = districtdetails;
  const postdistquery = `
        INSERT INTO district (districtName,cases,
  cured,
  active,
  deaths
  ) VALUES (${districtName},${cases},
  ${cured},
  ${active},
  ${deaths});
    `;
  const postdistresponse = await db.run(postdistquery);
  const districtId = postdistresponse.lastID;
  response.send("District Successfully Added");
});

app.get("/districts/:districtId/", async (request, response) => {
  const districtId = request.params;
  const singledistquery = `
        SELECT * FROM district ORDER BY districtId WHERE districtId=${districtId};
    `;
  const simgledistresponse = await db.get(singledistquery);
  response.send(simgledistresponse);
});
app.delete("/districts/:districtId/", async (request, response) => {
  const districtId = request.params;
  const deletedist = `
        DELETE FROM district WHERE districtId=${districtId};
    `;
  const deleteresponse = await db.run(deletedist);
  response.send("District Removed");
});
app.put("/districts/:districtId/", async (request, response) => {
  const districtId = request.params;
  const districtdetails = request.body;
  const { districtName, cases, cured, active, deaths } = districtdetails;
  const putquery = `
        UPDATE district SET 
        districtName =${districtName}, cases=${cases}, cured=${cured}, active=${active}, deaths=${deaths}
        WHERE districtId=${districtId};
    `;
  const putresponse = await db.run(putquery);
  response.send("District Details Updated");
});
app.get("/states/:stateId/stats/", async (request, response) => {
  const { stateId } = request.params;
  const statequery = `
        SELECT * FROM state ORDER BY state_id WHERE state_id=${stateId};
    `;
  const statesingleresponse = await db.get(statequery);
  response.send(statesingleresponse);
});

module.exports = app;
