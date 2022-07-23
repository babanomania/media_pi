require("dotenv").config();

const request = require("supertest");
const api = request(process.env.PROWLARR_URL);
const sonarrApi = request(process.env.SONARR_URL);
const radarrApi = request(process.env.RADARR_URL);

const indexerNames = process.env.TORRENT_INDEXERS.split(",");

describe("Prowlarr", function () {
  let apiKey;
  let sonarrApiKey;
  let radarrApiKey;
  let indexersList = [];

  before("Get Api-Key", async function () {
    await api
      .get("/initialize.js")
      .set("Accept", "application/javascript")
      .expect(200)
      .then((res) => {
        apiKey = res.text
          .split("=")[1]
          .split(";")[0]
          .split("{")[1]
          .split("}")[0]
          .split(",")
          .find((dta) => dta.indexOf("apiKey") > 0)
          .split("'")[1];
      });
  });

  before("Get Sonarr Api-Key", async function () {
    await sonarrApi
      .get("/initialize.js")
      .set("Accept", "application/javascript")
      .expect(200)
      .then((res) => {
        sonarrApiKey = res.text
          .split("=")[1]
          .split(";")[0]
          .split("{")[1]
          .split("}")[0]
          .split(",")
          .find((dta) => dta.indexOf("apiKey") > 0)
          .split("'")[1];
      });
  });

  before("Get Radarr Api-Key", async function () {
    await radarrApi
      .get("/initialize.js")
      .set("Accept", "application/javascript")
      .expect(200)
      .then((res) => {
        radarrApiKey = res.text
          .split("=")[1]
          .split(";")[0]
          .split("{")[1]
          .split("}")[0]
          .split(",")
          .find((dta) => dta.indexOf("apiKey") > 0)
          .split("'")[1];
      });
  });

  it("Add sonarr Client", function () {
    return api
      .post("/api/v1/applications?")
      .set("X-Api-Key", apiKey)
      .set("Accept", "application/json")
      .send({
        syncLevel: "fullSync",
        name: "Sonarr",
        fields: [
          {
            name: "prowlarrUrl",
            value: process.env.PROWLARR_URL,
          },
          {
            name: "baseUrl",
            value: process.env.SONARR_URL,
          },
          {
            name: "apiKey",
            value: sonarrApiKey,
          },
          {
            name: "syncCategories",
            value: [2000, 2010, 2020, 2030, 2040, 2045, 2050, 2060, 2070, 2080],
          },
        ],
        implementationName: "Radarr",
        implementation: "Radarr",
        configContract: "RadarrSettings",
        infoLink: "https://wiki.servarr.com/prowlarr/supported#radarr",
        tags: [],
      })
      .expect(201);
  });

  it("Add radarr Client", function () {
    return api
      .post("/api/v1/applications?")
      .set("X-Api-Key", apiKey)
      .set("Accept", "application/json")
      .send({
        syncLevel: "fullSync",
        name: "Radarr",
        fields: [
          {
            name: "prowlarrUrl",
            value: process.env.PROWLARR_URL,
          },
          {
            name: "baseUrl",
            value: process.env.RADARR_URL,
          },
          {
            name: "apiKey",
            value: radarrApiKey,
          },
          {
            name: "syncCategories",
            value: [2000, 2010, 2020, 2030, 2040, 2045, 2050, 2060, 2070, 2080],
          },
        ],
        implementationName: "Radarr",
        implementation: "Radarr",
        configContract: "RadarrSettings",
        infoLink: "https://wiki.servarr.com/prowlarr/supported#radarr",
        tags: [],
      })
      .expect(201);
  });

  before("Get Indexers List", async function () {
    await api
      .get("/api/v1/indexer/schema")
      .set("X-Api-Key", apiKey)
      .set("Accept", "application/json")
      .expect(200)
      .then((res) => {
        indexersList = JSON.parse(res.text);
      });
  });

  indexerNames.forEach((indexerName) => {
    it(`Add Indexer '${indexerName}'`, () =>
      api
        .post("/api/v1/indexer?")
        .set("X-Api-Key", apiKey)
        .set("Accept", "application/json")
        .send(indexersList.find((idx) => idx.name === indexerName))
        .expect(201));
  });
});
