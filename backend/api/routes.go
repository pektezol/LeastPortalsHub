package api

import (
	"github.com/gin-gonic/gin"
	"github.com/pektezol/leastportalshub/backend/handlers"
	swaggerfiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"
)

const (
	apiPath             string = "/api"
	v1Path              string = "/v1"
	swaggerPath         string = "/swagger/*any"
	indexPath           string = "/"
	tokenPath           string = "/token"
	loginPath           string = "/login"
	profilePath         string = "/profile"
	usersPath           string = "/users/:userid"
	demosPath           string = "/demos"
	mapSummaryPath      string = "/maps/:mapid/summary"
	mapImagePath        string = "/maps/:mapid/image"
	mapLeaderboardsPath string = "/maps/:mapid/leaderboards"
	mapRecordPath       string = "/maps/:mapid/record"
	mapRecordIDPath     string = "/maps/:mapid/record/:recordid"
	mapDiscussionsPath  string = "/maps/:mapid/discussions"
	mapDiscussionIDPath string = "/maps/:mapid/discussions/:discussionid"
	rankingsPath        string = "/rankings"
	searchPath          string = "/search"
	gamesPath           string = "/games"
	chaptersPath        string = "/games/:gameid"
	gameMapsPath        string = "/games/:gameid/maps"
	chapterMapsPath     string = "/chapters/:chapterid"
	scoreLogsPath       string = "/logs/score"
	modLogsPath         string = "/logs/mod"
)

func InitRoutes(router *gin.Engine) {
	api := router.Group(apiPath)
	{
		v1 := api.Group(v1Path)
		// Swagger
		v1.GET(swaggerPath, ginSwagger.WrapHandler(swaggerfiles.Handler))
		v1.GET(indexPath, func(c *gin.Context) {
			c.File("docs/index.html")
		})
		// Tokens, login
		v1.GET(tokenPath, handlers.GetCookie)
		v1.DELETE(tokenPath, handlers.DeleteCookie)
		v1.GET(loginPath, handlers.Login)
		// Users, profiles
		v1.GET(profilePath, CheckAuth, handlers.Profile)
		v1.PUT(profilePath, CheckAuth, handlers.UpdateCountryCode)
		v1.POST(profilePath, CheckAuth, handlers.UpdateUser)
		v1.GET(usersPath, CheckAuth, handlers.FetchUser)
		// Maps
		// - Summary
		v1.GET(mapSummaryPath, handlers.FetchMapSummary)
		v1.POST(mapSummaryPath, CheckAuth, handlers.CreateMapSummary)
		v1.PUT(mapSummaryPath, CheckAuth, handlers.EditMapSummary)
		v1.DELETE(mapSummaryPath, CheckAuth, handlers.DeleteMapSummary)
		v1.PUT(mapImagePath, CheckAuth, handlers.EditMapImage)
		// - Leaderboards
		v1.GET(mapLeaderboardsPath, handlers.FetchMapLeaderboards)
		v1.POST(mapRecordPath, CheckAuth, handlers.CreateRecordWithDemo)
		v1.DELETE(mapRecordIDPath, CheckAuth, handlers.DeleteRecord)
		v1.GET(demosPath, handlers.DownloadDemoWithID)
		// - Discussions
		v1.GET(mapDiscussionsPath, handlers.FetchMapDiscussions)
		v1.GET(mapDiscussionIDPath, handlers.FetchMapDiscussion)
		v1.POST(mapDiscussionsPath, CheckAuth, handlers.CreateMapDiscussion)
		v1.PUT(mapDiscussionIDPath, CheckAuth, handlers.EditMapDiscussion)
		v1.DELETE(mapDiscussionIDPath, CheckAuth, handlers.DeleteMapDiscussion)
		// Rankings, search
		v1.GET(rankingsPath, handlers.Rankings)
		v1.GET(searchPath, handlers.SearchWithQuery)
		// Games, chapters, maps
		v1.GET(gamesPath, handlers.FetchGames)
		v1.GET(chaptersPath, handlers.FetchChapters)
		v1.GET(chapterMapsPath, handlers.FetchChapterMaps)
		v1.GET(gameMapsPath, handlers.FetchMaps)
		// Logs
		v1.GET(scoreLogsPath, handlers.ScoreLogs)
		v1.GET(modLogsPath, CheckAuth, handlers.ModLogs)
	}
}
