require("dotenv").config();

const request = require("supertest");
const api = request(process.env.SONARR_URL);

describe("Sonarr", function () {
  let apiKey;
  let rootFolders;
  let downloadclients;

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

  describe("Configure Root Folder", function () {
    before("Check Root Folders", function () {
      return api
        .get("/api/v3/rootFolder")
        .set("X-Api-Key", apiKey)
        .set("Accept", "application/json")
        .expect(200)
        .then((res) => (rootFolders = JSON.parse(res.text)));
    });

    it("Set Root Folder", function () {
      return rootFolders && rootFolders.length === 0
        ? api
            .post("/api/v3/rootFolder")
            .set("X-Api-Key", apiKey)
            .set("Accept", "application/json")
            .send({
              path: "/data/",
            })
            .expect(201)
        : this.skip();
    });
  });

  describe("Configure Flood", function () {
    before("Check Download Clients", function () {
      return api
        .get("/api/v3/downloadclient?")
        .set("X-Api-Key", apiKey)
        .set("Accept", "application/json")
        .expect(200)
        .then((res) => (downloadclients = JSON.parse(res.text)));
    });

    it("Set Download Client as Flood", function () {
      return downloadclients && downloadclients.length === 0
        ? api
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
                  value: ["sonarr"],
                },
                {
                  name: "postImportTags",
                },
                {
                  name: "additionalTags",
                  value: [],
                },
                {
                  name: "startOnAdd",
                  value: true,
                },
              ],
              implementationName: "Flood",
              implementation: "Flood",
              configContract: "FloodSettings",
              infoLink: "https://wiki.servarr.com/sonarr/supported#flood",
              message: {
                message:
                  "Sonarr will handle automatic removal of torrents based on the current seed criteria in Settings -> Indexers",
                type: "info",
              },
              tags: [],
            })
            .expect(201)
        : this.skip();
    });
  });
});
