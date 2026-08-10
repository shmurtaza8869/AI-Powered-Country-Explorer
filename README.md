# AI-Powered Country Explorer

An interactive web application that allows users to search for countries and explore important information using the REST Countries API.

## Features

* Search for any country by name
* Display country flag
* Display capital city
* Display population
* Display region
* Display languages
* Generate interesting historical facts using OpenRouter AI
* Loading states for API requests
* Error handling for failed requests
* Recent Searches feature
* Stores the latest 5 searched countries
* Prevents duplicate recent searches
* Click a recent search to search that country again
* Responsive interface for different screen sizes

## Technologies Used

* HTML5
* CSS3
* JavaScript
* REST Countries API
* OpenRouter AI API
* Fetch API
* JSON

## How It Works

1. Enter a country name in the search field.
2. The application sends a request to the REST Countries API.
3. Country information is displayed on the webpage.
4. Click "Tell me something interesting" to generate a historical fact using OpenRouter AI.
5. Recently searched countries are displayed under "Recent Searches".

## Project Structure

```text
country-explorer/
│
├── index.html
├── style.css
└── script.js
```

## APIs Used

REST Countries API is used to retrieve country information.

OpenRouter API is used to generate AI-powered historical facts about the selected country.

## Future Improvements

* Add localStorage for persistent recent searches
* Add country comparison
* Add maps and geographic information
* Improve AI responses
* Add more country-related features
* Move API keys to a secure backend before production deployment

## Author

Developed as a beginner-level university project to demonstrate web development, API integration, JavaScript, and AI integration.
