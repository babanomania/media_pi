require("dotenv").config();

const request = require("supertest");
const api = request(process.env.JELLYFIN_URL);

describe("Jellyfin", function () {
  let setupCompleted;

  before("Check Startup Wizard Status", async function () {
    await api
      .get("/System/Info/Public")
      .set("Accept", "application/javascript")
      .expect(200)
      .then((res) => {
        let status = JSON.parse(res.text);
        setupCompleted = status.StartupWizardCompleted;
      });
  });

  it("Set Language", function () {
    return setupCompleted
      ? this.skip()
      : api
          .post("/Startup/Configuration")
          .set("Accept", "application/json")
          .send({
            UICulture: "en-US",
            MetadataCountryCode: process.env.JF_METADATA_COUNTRY_CODE || "US",
            PreferredMetadataLanguage: process.env.JF_METADATA_LANG || "en",
          })
          .expect(204);
  });

  it("Set User", function () {
    return setupCompleted
      ? this.skip()
      : api
          .post("/Startup/User")
          .set("Accept", "application/json")
          .send({
            Name: process.env.JF_USERNAME || "hotio",
            Password: process.env.JF_PASSWORD || "hotio",
          })
          .expect(204);
  });

  it("Set Movie Directory", function () {
    return setupCompleted
      ? this.skip()
      : api
          .post(
            "/Library/VirtualFolders?collectionType=movies&refreshLibrary=false&name=Movies"
          )
          .set("Accept", "application/json")
          .send({
            LibraryOptions: {
              EnableArchiveMediaFiles: false,
              EnablePhotos: true,
              EnableRealtimeMonitor: true,
              ExtractChapterImagesDuringLibraryScan: false,
              EnableChapterImageExtraction: false,
              EnableInternetProviders: true,
              SaveLocalMetadata: false,
              EnableAutomaticSeriesGrouping: false,
              PreferredMetadataLanguage: "en",
              MetadataCountryCode: process.env.JF_METADATA_COUNTRY_CODE || "US",
              SeasonZeroDisplayName: "Specials",
              AutomaticRefreshIntervalDays: 0,
              EnableEmbeddedTitles: false,
              EnableEmbeddedEpisodeInfos: false,
              AllowEmbeddedSubtitles: "AllowAll",
              SkipSubtitlesIfEmbeddedSubtitlesPresent: false,
              SkipSubtitlesIfAudioTrackMatches: false,
              SaveSubtitlesWithMedia: true,
              RequirePerfectSubtitleMatch: true,
              AutomaticallyAddToCollection: false,
              MetadataSavers: [],
              TypeOptions: [
                {
                  Type: "Movie",
                  MetadataFetchers: ["TheMovieDb", "The Open Movie Database"],
                  MetadataFetcherOrder: [
                    "TheMovieDb",
                    "The Open Movie Database",
                  ],
                  ImageFetchers: [
                    "TheMovieDb",
                    "The Open Movie Database",
                    "Embedded Image Extractor",
                    "Screen Grabber",
                  ],
                  ImageFetcherOrder: [
                    "TheMovieDb",
                    "The Open Movie Database",
                    "Embedded Image Extractor",
                    "Screen Grabber",
                  ],
                },
              ],
              LocalMetadataReaderOrder: ["Nfo"],
              SubtitleDownloadLanguages: [],
              DisabledSubtitleFetchers: [],
              SubtitleFetcherOrder: [],
              PathInfos: [
                {
                  Path: "/data/movies",
                },
              ],
            },
          })
          .expect(204);
  });

  it("Set TV Directory", function () {
    return setupCompleted
      ? this.skip()
      : api
          .post(
            "/Library/VirtualFolders?collectionType=tvshows&refreshLibrary=false&name=Shows"
          )
          .set("Accept", "application/json")
          .send({
            LibraryOptions: {
              EnableArchiveMediaFiles: false,
              EnablePhotos: true,
              EnableRealtimeMonitor: true,
              ExtractChapterImagesDuringLibraryScan: false,
              EnableChapterImageExtraction: false,
              EnableInternetProviders: true,
              SaveLocalMetadata: false,
              EnableAutomaticSeriesGrouping: false,
              PreferredMetadataLanguage: "en",
              MetadataCountryCode: process.env.JF_METADATA_COUNTRY_CODE || "US",
              SeasonZeroDisplayName: "Specials",
              AutomaticRefreshIntervalDays: 0,
              EnableEmbeddedTitles: false,
              EnableEmbeddedEpisodeInfos: false,
              AllowEmbeddedSubtitles: "AllowAll",
              SkipSubtitlesIfEmbeddedSubtitlesPresent: false,
              SkipSubtitlesIfAudioTrackMatches: false,
              SaveSubtitlesWithMedia: true,
              RequirePerfectSubtitleMatch: true,
              AutomaticallyAddToCollection: false,
              MetadataSavers: [],
              TypeOptions: [
                {
                  Type: "Series",
                  MetadataFetchers: ["TheMovieDb", "The Open Movie Database"],
                  MetadataFetcherOrder: [
                    "TheMovieDb",
                    "The Open Movie Database",
                  ],
                  ImageFetchers: ["TheMovieDb"],
                  ImageFetcherOrder: ["TheMovieDb"],
                },
                {
                  Type: "Season",
                  MetadataFetchers: ["TheMovieDb"],
                  MetadataFetcherOrder: ["TheMovieDb"],
                  ImageFetchers: ["TheMovieDb"],
                  ImageFetcherOrder: ["TheMovieDb"],
                },
                {
                  Type: "Episode",
                  MetadataFetchers: ["TheMovieDb", "The Open Movie Database"],
                  MetadataFetcherOrder: [
                    "TheMovieDb",
                    "The Open Movie Database",
                  ],
                  ImageFetchers: [
                    "TheMovieDb",
                    "The Open Movie Database",
                    "Embedded Image Extractor",
                    "Screen Grabber",
                  ],
                  ImageFetcherOrder: [
                    "TheMovieDb",
                    "The Open Movie Database",
                    "Embedded Image Extractor",
                    "Screen Grabber",
                  ],
                },
              ],
              LocalMetadataReaderOrder: ["Nfo"],
              SubtitleDownloadLanguages: [],
              DisabledSubtitleFetchers: [],
              SubtitleFetcherOrder: [],
              PathInfos: [
                {
                  Path: "/data/tv",
                },
              ],
            },
          })
          .expect(204);
  });

  it("Disable Remote Access", function () {
    return setupCompleted
      ? this.skip()
      : api
          .post("/Startup/RemoteAccess")
          .set("Accept", "application/json")
          .send({
            EnableRemoteAccess: false,
            EnableAutomaticPortMapping: false,
          })
          .expect(204);
  });

  it("Complete Setup", function () {
    return setupCompleted
      ? this.skip()
      : api
          .post("/Startup/Complete")
          .set("Accept", "application/json")
          .expect(204);
  });
});
