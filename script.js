console.log("SCRIPT IS WORKING");

const interestingButton = document.getElementById("interestingButton");
const aiResponse = document.getElementById("aiResponse");
const countryInput = document.getElementById("countryInput");
const searchButton = document.getElementById("searchButton");

const loadingMessage = document.getElementById("loadingMessage");
const errorMessage = document.getElementById("errorMessage");

const countryFlag = document.getElementById("countryFlag");
const countryName = document.getElementById("countryName");
const countryCapital = document.getElementById("countryCapital");
const countryPopulation = document.getElementById("countryPopulation");
const countryRegion = document.getElementById("countryRegion");
const countryLanguages = document.getElementById("countryLanguages");

const recentSearches = document.getElementById("recentSearches");


// ===============================
// SUPABASE EDGE FUNCTION
// ===============================

const SUPABASE_FUNCTION_URL =
    "https://erexplmmvogurrbaxkix.supabase.co/functions/v1/interesting-fact";


// ===============================
// VARIABLES
// ===============================

let recentCountries = [];


// ===============================
// INITIAL STATE
// ===============================

loadingMessage.textContent = "";
errorMessage.textContent = "";
aiResponse.textContent = "";

interestingButton.disabled = true;


// ===============================
// EVENT LISTENERS
// ===============================

interestingButton.addEventListener(
    "click",
    getInterestingFact
);

searchButton.addEventListener(
    "click",
    searchCountry
);


// Allow Enter key to search

countryInput.addEventListener(
    "keydown",
    function (event) {

        if (event.key === "Enter") {

            searchCountry();

        }

    }
);


// ===============================
// SEARCH COUNTRY
// ===============================

async function searchCountry() {

    const country =
        countryInput.value.trim();


    // Check empty input

    if (country === "") {

        errorMessage.textContent =
            "Please enter a country name";

        return;
    }


    // Show loading

    loadingMessage.textContent =
        "Loading...";

    searchButton.disabled = true;

    interestingButton.disabled = true;

    errorMessage.textContent = "";

    aiResponse.textContent = "";


    try {

        // ===============================
        // CALL SUPABASE EDGE FUNCTION
        // ===============================

        const response = await fetch(
            SUPABASE_FUNCTION_URL,
            {
                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json"
                },

                body: JSON.stringify({

                    action: "country",

                    country: country

                })

            }
        );


        console.log(
            "Supabase country status:",
            response.status
        );


        // ===============================
        // CONVERT RESPONSE TO JSON
        // ===============================

        const result =
            await response.json();


        console.log(
            "Supabase country response:",
            result
        );


        // ===============================
        // COUNTRY NOT FOUND
        // ===============================

        if (response.status === 404) {

            throw new Error(
                "COUNTRY_NOT_FOUND"
            );

        }


        // ===============================
        // API ERROR
        // ===============================

        if (!response.ok) {

            console.error(
                "Country API error response:",
                result
            );

            throw new Error(
                "REST_API_ERROR"
            );

        }


        // ===============================
        // CHECK RESPONSE
        // ===============================

        if (
            !result ||
            !result.data ||
            !Array.isArray(result.data.objects) ||
            result.data.objects.length === 0
        ) {

            throw new Error(
                "COUNTRY_NOT_FOUND"
            );

        }


        // ===============================
        // GET COUNTRY DATA
        // ===============================

        const countryData =
            result.data.objects[0];


        console.log(
            "Country data:",
            countryData
        );


        // ===============================
        // COUNTRY NAME
        // ===============================

        const commonName =
            countryData.names?.common ||
            country;


        countryName.textContent =
            commonName;


        // ===============================
        // FLAG
        // ===============================

        countryFlag.src =
            countryData.flag?.url_png ||
            countryData.flag?.url_svg ||
            "";

        countryFlag.alt =
            `${commonName} flag`;


        // ===============================
        // CAPITAL
        // ===============================

        if (
            countryData.capitals &&
            Array.isArray(countryData.capitals) &&
            countryData.capitals.length > 0
        ) {

            countryCapital.textContent =
                countryData.capitals[0]?.name ||
                "N/A";

        } else {

            countryCapital.textContent =
                "N/A";

        }


        // ===============================
        // POPULATION
        // ===============================

        if (
            typeof countryData.population ===
            "number"
        ) {

            countryPopulation.textContent =
                countryData.population.toLocaleString();

        } else {

            countryPopulation.textContent =
                "N/A";

        }


        // ===============================
        // REGION
        // ===============================

        countryRegion.textContent =
            countryData.region ||
            "N/A";


        // ===============================
        // LANGUAGES
        // ===============================

        if (
            countryData.languages &&
            Array.isArray(countryData.languages)
        ) {

            const languageNames =
                countryData.languages
                    .map(function (language) {

                        return language.name;

                    })
                    .filter(Boolean);


            countryLanguages.textContent =
                languageNames.length > 0
                    ? languageNames.join(", ")
                    : "N/A";

        } else {

            countryLanguages.textContent =
                "N/A";

        }


        // ===============================
        // RECENT SEARCHES
        // ===============================

        addRecentCountry(
            commonName
        );


        // ===============================
        // ENABLE AI BUTTON
        // ===============================

        interestingButton.disabled =
            false;


    } catch (error) {

        console.error(
            "Country API error:",
            error
        );


        // ===============================
        // ERROR MESSAGE
        // ===============================

        if (
            error.message ===
            "COUNTRY_NOT_FOUND"
        ) {

            errorMessage.textContent =
                "Country not found";

        } else {

            errorMessage.textContent =
                "Sorry, we couldn't load the country information. Please try again.";

        }


        // ===============================
        // CLEAR COUNTRY INFORMATION
        // ===============================

        countryFlag.src = "";

        countryFlag.alt =
            "Country flag";

        countryName.textContent = "";

        countryCapital.textContent = "";

        countryPopulation.textContent = "";

        countryRegion.textContent = "";

        countryLanguages.textContent = "";


        // Disable AI button

        interestingButton.disabled =
            true;

    } finally {

        loadingMessage.textContent = "";

        searchButton.disabled =
            false;

    }
}


// ===============================
// ADD RECENT COUNTRY
// ===============================

function addRecentCountry(country) {

    // Remove duplicate

    recentCountries =
        recentCountries.filter(
            function (item) {

                return item !== country;

            }
        );


    // Add newest country first

    recentCountries.unshift(
        country
    );


    // Keep only latest 5

    if (recentCountries.length > 5) {

        recentCountries.pop();

    }


    displayRecentCountries();
}


// ===============================
// DISPLAY RECENT COUNTRIES
// ===============================

function displayRecentCountries() {

    recentSearches.innerHTML = "";


    recentCountries.forEach(
        function (country) {

            const listItem =
                document.createElement("li");


            listItem.textContent =
                country;


            // Click recent search

            listItem.addEventListener(
                "click",
                function () {

                    countryInput.value =
                        country;

                    searchCountry();

                }
            );


            recentSearches.appendChild(
                listItem
            );

        }
    );
}


// ===============================
// AI INTERESTING FACT
// ===============================

async function getInterestingFact() {

    const country =
        countryName.textContent.trim();


    // Check country

    if (!country) {

        aiResponse.textContent =
            "Please search for a country first.";

        return;

    }


    // Show loading

    aiResponse.textContent =
        "Loading...";

    interestingButton.disabled =
        true;


    try {

        // ===============================
        // CALL SUPABASE EDGE FUNCTION
        // ===============================

        const response = await fetch(
            SUPABASE_FUNCTION_URL,
            {
                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json"
                },

                body: JSON.stringify({

                    action: "fact",

                    country: country

                })

            }
        );


        console.log(
            "Supabase AI status:",
            response.status
        );


        // ===============================
        // CONVERT RESPONSE
        // ===============================

        const data =
            await response.json();


        console.log(
            "Supabase AI response:",
            data
        );


        // ===============================
        // CHECK RESPONSE
        // ===============================

        if (!response.ok) {

            throw new Error(
                "SUPABASE_FUNCTION_ERROR"
            );

        }


        if (!data.answer) {

            throw new Error(
                "NO_AI_RESPONSE"
            );

        }


        // ===============================
        // DISPLAY AI RESPONSE
        // ===============================

        aiResponse.textContent =
            data.answer;


    } catch (error) {

        console.error(
            "Supabase function error:",
            error
        );


        aiResponse.textContent =
            "Sorry, we couldn't get an AI response right now. Please try again.";

    } finally {

        interestingButton.disabled =
            false;

    }
}