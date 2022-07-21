require("dotenv").config();

const request = require("supertest");
const api = request(process.env.RADARR_URL);

describe("Radarr", function () {
  let apiKey;

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

  it("Set Root Folder", function () {
    return api
      .post("/api/v3/rootFolder")
      .set("X-Api-Key", apiKey)
      .set("Accept", "application/json")
      .send({
        path: "/data/",
      })
      .expect(201);
  });

  it("Set qflood Client", function () {
    return api
      .post("/api/v3/downloadclient?")
      .set("X-Api-Key", apiKey)
      .set("Accept", "application/json")
      .send({
        enable: true,
        protocol: "torrent",
        priority: 1,
        removeCompletedDownloads: true,
        removeFailedDownloads: true,
        name: "qflood",
        fields: [
          {
            name: "host",
            value: "qflood",
          },
          {
            name: "port",
            value: 3000,
          },
          {
            name: "useSsl",
            value: false,
          },
          {
            name: "urlBase",
          },
          {
            name: "username",
          },
          {
            name: "password",
          },
          {
            name: "destination",
          },
          {
            name: "tags",
            value: ["radarr"],
          },
          {
            name: "postImportTags",
          },
          {
            name: "additionalTags",
            value: [],
          },
          {
            name: "addPaused",
            value: false,
          },
        ],
        implementationName: "Flood",
        implementation: "Flood",
        configContract: "FloodSettings",
        infoLink: "https://wiki.servarr.com/radarr/supported#flood",
        message: {
          message:
            "Radarr will handle automatic removal of torrents based on the current seed criteria in Settings -> Indexers",
          type: "info",
        },
        tags: [],
      })
      .expect(201);
  });
});
