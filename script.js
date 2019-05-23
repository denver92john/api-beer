'use strict';

/* ----- 4 ----- */
function formatQueryString(paramsObj) {
    const queryItems = Object.keys(paramsObj)
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(paramsObj[key])}`);
    return queryItems.join('&');
}

/* ----- 6 ----- */
function renderResults(responseJson) {
    $('#results-list').empty();

    responseJson.forEach(brewery => {
        $('.js-results-list').append(
            `<li class="list-item">
                <h3>${brewery.name}</h3>
                <p>Brewery Type: ${brewery.brewery_type}</p>
                <address>
                    <p>${brewery.street}</p>
                    <p>${brewery.city}</p>
                    <p>${brewery.state}</p>
                    <p>${brewery.postal_code}</p>
                </address>
                <p><a href="${brewery.website_url}">Click here to visit their website</a></p>
            </li>`
        );
    });
}

/* ----- 5 ----- */
function fetchResults(uri) {
    fetch(uri)
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error(response.statusText);
            }
        })
        .then(responseJson => renderResults(responseJson))
        .catch(err => console.log(`There was an issue: ${err}`));
}

/* ----- 2 ----- */
function startFormParams(city, state, number, type) {
    const params = {
        by_city: city,
        by_state: state,
        per_page: number,
        by_type: type
    }

    const newParams = {};
    for (let key in params) {
        if (params[key] != "") {
            newParams[key] = params[key];
        }
    }
    console.log(newParams);
    return newParams;
}

/* ----- 3 ----- */
function getBrewery(paramsObj) {
    const baseUri = "https://api.openbrewerydb.org/breweries";
    const queryString = formatQueryString(paramsObj);
    const uri = `${baseUri}?${queryString}`;

    console.log(uri);

    fetchResults(uri);
}

/* ----- 1 ----- */
function handleStartForm() {
    $('.js-start-form').submit(function(event) {
        event.preventDefault();
        const userBreweryCity = $('.js-brewery-city').val();
        const userBreweryState = $('.js-brewery-state').val();
        const userBreweryNumber = $('.js-brewery-number').val();
        const userBreweryType = $('.js-type-selector').val();
        const paramsObj = startFormParams(userBreweryCity, userBreweryState, userBreweryNumber, userBreweryType);

        $('.js-start-section').hide();
        getBrewery(paramsObj);
    });
}

$(function() {
    console.log('App ready');
    handleStartForm();
});