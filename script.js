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

const REST_COUNTRIES_API_KEY = "rc_live_cedd56130fb94f2b9071e0020f427195";

let recentCountries = [];

loadingMessage.textContent = "";
interestingButton.disabled = true;

interestingButton.addEventListener("click", getInterestingFact);
searchButton.addEventListener("click", searchCountry);


async function searchCountry() {

    const country = countryInput.value.trim();

    if (country === "") {
        errorMessage.textContent = "Please enter a country name";
        return;
    }

    loadingMessage.textContent = "Loading...";
    searchButton.disabled = true;
    interestingButton.disabled = true;
    errorMessage.textContent = "";
    aiResponse.textContent = "";

    try {

        const response = await fetch(
            `https://api.restcountries.com/countries/v5/names.common/${encodeURIComponent(country)}`,
            {
                headers: {
                    "Authorization": `Bearer ${REST_COUNTRIES_API_KEY}`
                }
            }
        );

        if (response.status === 404) {
            throw new Error("COUNTRY_NOT_FOUND");
        }

        if (!response.ok) {
            throw new Error("REST_API_ERROR");
        }

        const data = await response.json();

        if (
            !data ||
            !data.data ||
            !data.data.objects ||
            data.data.objects.length === 0
        ) {
            throw new Error("COUNTRY_NOT_FOUND");
        }

        const countryData = data.data.objects[0];

        countryFlag.src = countryData.flag.url_png;
        countryFlag.alt = `${countryData.names.common} flag`;

        countryName.textContent = countryData.names.common;

        countryCapital.textContent =
            countryData.capitals &&
            countryData.capitals.length > 0
                ? countryData.capitals[0].name
                : "N/A";

        countryPopulation.textContent =
            countryData.population
                ? countryData.population.toLocaleString()
                : "N/A";

        countryRegion.textContent =
            countryData.region || "N/A";

        countryLanguages.textContent =
            countryData.languages &&
            countryData.languages.length > 0
                ? countryData.languages
                    .map(function(language) {
                        return language.name;
                    })
                    .join(", ")
                : "N/A";

        addRecentCountry(countryData.names.common);

        interestingButton.disabled = false;

    } catch (error) {

        if (error.message === "COUNTRY_NOT_FOUND") {

            errorMessage.textContent = "Country not found";

        } else {

            errorMessage.textContent =
                "Sorry, we couldn't load the country information. Please try again.";

        }

        countryFlag.src = "";
        countryFlag.alt = "Country flag";

        countryName.textContent = "";
        countryCapital.textContent = "";
        countryPopulation.textContent = "";
        countryRegion.textContent = "";
        countryLanguages.textContent = "";

        interestingButton.disabled = true;

        console.error(error);

    } finally {

        loadingMessage.textContent = "";
        searchButton.disabled = false;

    }
}


function addRecentCountry(country) {

    recentCountries = recentCountries.filter(
        function(item) {
            return item !== country;
        }
    );

    recentCountries.unshift(country);

    if (recentCountries.length > 5) {
        recentCountries.pop();
    }

    displayRecentCountries();
}


function displayRecentCountries() {

    recentSearches.innerHTML = "";

    recentCountries.forEach(function(country) {

        const listItem = document.createElement("li");

        listItem.textContent = country;

        listItem.addEventListener("click", function() {

            countryInput.value = country;
            searchCountry();

        });

        recentSearches.appendChild(listItem);

    });
}


async function getInterestingFact() {

    const country = countryName.textContent.trim();

    if (!country) {

        aiResponse.textContent =
            "Please search for a country first.";

        return;
    }

    aiResponse.textContent = "Loading...";
    interestingButton.disabled = true;

    const prompt =
        `Tell me one fascinating historical fact about ${country} in 2 sentences.`;

    try {

        const response = await fetch(
            "https://openrouter.ai/api/v1/chat/completions",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer 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"
                },

                body: JSON.stringify({
                    model: "nvidia/nemotron-3-super-120b-a12b:free",

                    messages: [
                        {
                            role: "user",
                            content: prompt
                        }
                    ]
                })
            }
        );

        if (!response.ok) {
            throw new Error("OPENROUTER_API_ERROR");
        }

        const data = await response.json();

        if (
            !data.choices ||
            !data.choices[0] ||
            !data.choices[0].message
        ) {
            throw new Error("OPENROUTER_API_ERROR");
        }

        aiResponse.textContent =
            data.choices[0].message.content;

    } catch (error) {

        aiResponse.textContent =
            "Sorry, we couldn't get an AI response right now. Please try again.";

        console.error(error);

    } finally {

        interestingButton.disabled = false;

    }
}