var gamespotKey = "e1c898ffd3a1cccaf5ff6ef297f51a43f05238a3";
var searchForm = document.querySelector("#search-form");
var searchBar = document.querySelector("#search-bar");
var searchDisplay = document.querySelector("#search-display");
var contentEl = document.querySelector("#main-content");
var resultsContainerEL = document.querySelector("#results-container");
var gameColumnsContainerEl = document.querySelector("#game-columns-container");

function gameRequest(gameName) {
    var gameApi = "https://cors-anywhere.herokuapp.com/http://www.gamespot.com/api/games/?api_key=" + gamespotKey + "&filter=name:" + gameName + "&format=json&limit=6";
    // fetch the response
    fetch(gameApi)
        .then(function (response) {
            return response.json();
        })
        .then(function (response) {
            console.log(response);

            //Clear gameColumnsContainerEl
            $(gameColumnsContainerEl).empty();
            for (var i = 0; i < response.results.length; i++) {
                var gameColumnEl = document.createElement("div");
                gameColumnEl.setAttribute("id", "game-column");
                gameColumnEl.setAttribute('data-description', response.results[i].description)
                gameColumnEl.setAttribute("class", "column search-results is-two-fifths has-background-grey-lighter is-family-monospace has-text-black-bis mx-3 my-4");
                gameColumnsContainerEl.appendChild(gameColumnEl);

                //Columns 1 (baseSearchEl) Stores IMAGE and TITLE
                var baseSearchEl = document.createElement("div");
                baseSearchEl.setAttribute("id", "base-search");
                baseSearchEl.setAttribute("class", "columns is-vcentered");
                gameColumnEl.appendChild(baseSearchEl);

                //Create Columns 2 (baseClickEl)
                var baseClickEl = document.createElement("div");
                baseClickEl.setAttribute("id", "base-click");
                baseClickEl.setAttribute("class", "columns is-mobile");
                gameColumnEl.appendChild(baseClickEl);
                //$(baseClickEl).hide();

                //Columns 1 (baseSearchEl) Column 1 (columnImageEl) Stores Image Column 
                var columnImageEl = document.createElement("div");
                columnImageEl.setAttribute("id", "column-image");
                columnImageEl.setAttribute("class", "column is-one-fith");
                baseSearchEl.appendChild(columnImageEl);
                //Image
                var gameImg = document.createElement("img");
                gameImg.setAttribute("id", "game-image");
                gameImg.setAttribute("src", response.results[i].image.square_tiny);
                gameImg.setAttribute("alt", "Image of " + gameName);
                columnImageEl.appendChild(gameImg);
                //Columns 1 (baseSearchEl) Column 2 (gameHeaderEl) Stores Title and Rating
                var gameHeaderEl = document.createElement("div");
                gameHeaderEl.setAttribute("id", "game-header");
                gameHeaderEl.setAttribute("class", "column has-text-centered");
                baseSearchEl.appendChild(gameHeaderEl);
                //Title Text
                var gameTitleEl = document.createElement("h1");
                gameTitleEl.setAttribute("class", "title");
                gameHeaderEl.appendChild(gameTitleEl);
                var gameTitleText = document.createTextNode(response.results[i].name);
                gameTitleEl.appendChild(gameTitleText);

                //Create Columns 2 (baseClickEl) Column 1 For Description (columnDescriptionEl)
                var columnDescriptionEl = document.createElement("div");
                columnDescriptionEl.setAttribute("id", "column-description");
                columnDescriptionEl.setAttribute("class", "column");
                baseClickEl.appendChild(columnDescriptionEl);
                //Game Stars Element
                var gameStarsEl = document.createElement("div");
                gameStarsEl.setAttribute("id", "game-stars");
                gameStarsEl.setAttribute("class", "container has-text-centered");
                //columnDescriptionEl.appendChild(gameStarsEl);
                //Game Stars
                var gameTitleStarSpan = document.createElement("h3");
                gameTitleStarSpan.setAttribute("class", "title has-text-centered is-size-3");
                gameStarsEl.appendChild(gameTitleStarSpan);
                var gameTitleStar1 = document.createElement("i");
                var gameTitleStar2 = document.createElement("i");
                var gameTitleStar3 = document.createElement("i");
                var gameTitleStar4 = document.createElement("i");
                var gameTitleStar5 = document.createElement("i");
                gameTitleStar1.setAttribute("class", "fas fa-star");
                gameTitleStar2.setAttribute("class", "fas fa-star");
                gameTitleStar3.setAttribute("class", "fas fa-star");
                gameTitleStar4.setAttribute("class", "fas fa-star");
                gameTitleStar5.setAttribute("class", "fas fa-star");
                gameTitleStarSpan.appendChild(gameTitleStar1);
                gameTitleStarSpan.appendChild(gameTitleStar2);
                gameTitleStarSpan.appendChild(gameTitleStar3);
                gameTitleStarSpan.appendChild(gameTitleStar4);
                gameTitleStarSpan.appendChild(gameTitleStar5);
                //Summary Text
                var gameSummary = document.createElement("p");
                columnDescriptionEl.appendChild(gameSummary);

                $(".search-results").click(function () {
                    var gameDescription = ($(this).attr('data-description'));
                    console.log(gameDescription);
                    var gameSummaryClick = ($(this).find("p"));
                    console.log(gameSummaryClick);
                    gameSummaryClick.text(gameDescription);
                });

            }

            //Anime Fetch Call
            animeRequest(gameName);
        })
        .catch(function (error) {
            console.log(error);
        });

};

function animeRequest(gameName) {

    var animeApi = "https://kitsu.io/api/edge/anime?";
    fetch(animeApi + "filter[text]=" + gameName)
        .then(function (animeResponse) {
            return animeResponse.json();
        })
        .then(function (animeResponse) {
            console.log(animeResponse);
            $("#results-container").empty();

            // convert game title and anime title to uppercase to check for correct titles
            var animeName = animeResponse.data[0].attributes.canonicalTitle;
            var animeNameUp = animeName.toUpperCase();
            var gameNameUp = gameName.toUpperCase();

            if (animeNameUp.includes(gameNameUp) === false) {
                $("#anime-alert").addClass("is-active");
                $("#anime-alert-text").html("<p>There weren't any Anime found for " + gameName + ".</p>");
                $("#anime-alert-btn").on("click", function () {
                    ($("#anime-alert").removeClass("is-active"));
                });
                return;
            }

            for (var i = 0; i < 5; i++) {
                var animeName = animeResponse.data[i].attributes.canonicalTitle;
                var animeNameUp = animeName.toUpperCase();
                var gameNameUp = gameName.toUpperCase();

                if (animeNameUp.includes(gameNameUp) === false) {
                    return;
                }

                // Kitsu API results related to gameName value
                // create a container for all the kitsu api results
                var animeContainer = document.createElement("div");
                animeContainer.setAttribute("id", "anime-container");
                animeContainer.setAttribute("data-description", animeResponse.data[i].attributes.description);
                animeContainer.setAttribute("data-rating", animeResponse.data[i].attributes.averageRating);
                animeContainer.classList = "column anime-class search-results-anime is-two-fifths has-text-centered has-background-grey-lighter is-family-monospace has-text-black-bis mx-3 my-4";
                resultsContainerEL.appendChild(animeContainer);
                // div to contain title, rating, and description
                var animeInfoEl = document.createElement("div");
                animeInfoEl.setAttribute("id", "anime-info");
                animeInfoEl.classList = "container has-text-centered is-size-5";
                animeInfoEl.innerHTML = "Anime found for " + gameName + ":";
                animeContainer.appendChild(animeInfoEl);
                // display/create title 
                var animeTitle = document.createElement("h3");
                animeTitle.setAttribute("id", "anime-title");
                animeTitle.classList = "title has-text-centered is-size-3";
                animeTitle.innerHTML = animeResponse.data[i].attributes.canonicalTitle;
                animeInfoEl.appendChild(animeTitle);
                // create rating span 
                var animeRatingEl = document.createElement("span");
                animeRatingEl.setAttribute("id", "anime-rating");
                animeRatingEl.classList = "container has-text-centered is-family-monospace is-size-4 has-text-black-bis";
                // display video of the anime
                var animeVidContainer = document.createElement("div");
                animeVidContainer.classList = "container is-centered";
                animeContainer.appendChild(animeVidContainer);
                animeContainer.appendChild(animeRatingEl);
                //create anime video
                var animeVid = document.createElement("iframe");
                animeVid.setAttribute("id", "anime-video");
                animeVid.setAttribute("src", "https://www.youtube.com/embed/" + animeResponse.data[i].attributes.youtubeVideoId + "?controls=1");
                animeVid.setAttribute("allowfullscreen", "");
                animeVid.setAttribute("alt", "Trailer for " + gameName);
                animeVidContainer.appendChild(animeVid);
                //display description
                var animeDescriptionEl = document.createElement("p");
                animeDescriptionEl.setAttribute("id", "anime-description");
                animeDescriptionEl.classList = "container has-text-left is-family-monospace is-size-6 has-text-black-bis";
                animeContainer.appendChild(animeDescriptionEl);

            }

            $(".search-results-anime").one("click", function () {
                console.log("Click Video");
                var animeDescription = ($(this).attr("data-description"))
                console.log(animeDescription);
                var animeRating = ($(this).attr("data-rating"))
                console.log(animeRating);
                var animeContainerClick = ($(this).find("p"));
                var animeFindSpan = ($(this).find("span"));
                var animeStar1 = document.createElement("i");
                animeStar1.classList = "far fa-star";
                var animeStar2 = document.createElement("i");
                animeStar2.classList = "far fa-star";
                var animeStar3 = document.createElement("i");
                animeStar3.classList = "far fa-star";
                var animeStar4 = document.createElement("i");
                animeStar4.classList = "far fa-star";
                var animeStar5 = document.createElement("i");
                animeStar5.classList = "far fa-star";

                $(animeFindSpan).append(animeStar1);
                $(animeFindSpan).append(animeStar2);
                $(animeFindSpan).append(animeStar3);
                $(animeFindSpan).append(animeStar4);
                $(animeFindSpan).append(animeStar5);
                
                if (animeRating < 30) {
                    animeStar1.classList.remove("far");
                    animeStar1.classList.add("fas");
                } else if (animeRating > 30 && animeRating < 50) {
                    animeStar1.classList.remove("far");
                    animeStar1.classList.add("fas");
                    animeStar2.classList.remove("far");
                    animeStar2.classList.add("fas");
                } else if (animeRating > 50 && animeRating < 70) {
                    animeStar1.classList.remove("far");
                    animeStar1.classList.add("fas");
                    animeStar2.classList.remove("far");
                    animeStar2.classList.add("fas");
                    animeStar3.classList.remove("far");
                    animeStar3.classList.add("fas");
                } else if (animeRating > 70 && animeRating < 90) {
                    animeStar1.classList.remove("far");
                    animeStar1.classList.add("fas");
                    animeStar2.classList.remove("far");
                    animeStar2.classList.add("fas");
                    animeStar3.classList.remove("far");
                    animeStar3.classList.add("fas");
                    animeStar4.classList.remove("far");
                    animeStar4.classList.add("fas");
                } else if (animeRating > 90 && animeRating <= 100) {
                    animeStar1.classList.remove("far");
                    animeStar1.classList.add("fas");
                    animeStar2.classList.remove("far");
                    animeStar2.classList.add("fas");
                    animeStar3.classList.remove("far");
                    animeStar3.classList.add("fas");
                    animeStar4.classList.remove("far");
                    animeStar4.classList.add("fas");
                    animeStar5.classList.remove("far");
                    animeStar5.classList.add("fas");
                };

                animeContainerClick.text(animeDescription);
            });

        });
};

// var searchGame = function (event) {
function searchGame(event) {
    event.preventDefault();

    var searchValue = searchBar.value.trim().toUpperCase();
    // clicking search button submits value and calls gameRequest function
    console.log("searchValue: " + searchValue);

    if (searchValue) {
        gameRequest(searchValue);
        gameButtons(searchValue);
        storeSearchedGames();
    } else {
        //if search is empty, alert with a modal
        $("#empty-search").addClass("is-active");
        $("#empty-search-btn").on("click", function () {
            ($("#empty-search").removeClass("is-active"));
        });
        return;
    }

    // clear search bar after submitting
    searchBar.value = "";
};

function storeSearchedGames() {
    var userSearch = searchBar.value.trim().toUpperCase();

    // get history if any exists, if not is an array
    var gameHistory = JSON.parse(localStorage.getItem("game-search")) || [];
    // push searched game into the gameHistory array
    gameHistory.push(userSearch);

    // save search into localstorage
    localStorage.setItem("game-search", JSON.stringify(gameHistory));
};

function loadSearchedGames() {
    if (localStorage.getItem("game-search")) {
        var previousGames = JSON.parse(localStorage.getItem("game-search"));
        for (var i = 0; i < previousGames.length; i++) {
            gameButtons(previousGames[i]);
        }
    };

    for (i = 0; i < document.getElementsByClassName("game-button").length; i++) {
        document.getElementsByClassName("game-button")[i].addEventListener('click', function () {
            var buttonClicked = this.getAttribute("data-game");
            gameRequest(buttonClicked);
        });
    }
};

function gameButtons(game) {
    // create buttons for searched games
    var searchedGame = document.createElement("button");
    searchedGame.textContent = game;
    searchedGame.classList = "button game-button is-rounded is-light";
    searchedGame.setAttribute("data-game", game);
    searchedGame.setAttribute("type", "submit");
    searchedGame.setAttribute("id", "game-" + game);

    // append button to gametitle-buttons div
    $("#gametitle-buttons").append(searchedGame);
};

searchForm.addEventListener("submit", searchGame);

loadSearchedGames();