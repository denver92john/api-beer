'use strict';





function formatQueryString(paramsObj) {
    const queryItems = Object.keys(paramsObj)
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(paramsObj[key])}`);
    return queryItems.join('&');
}

function renderResults(responseJson) {
    $('#results-list').empty();

    responseJson.forEach(brewery => {
        $('#results-list').append(
            `<li class="list-item">
                <h3>${brewery.name}</h3>
                <p>Type: ${brewery.brewery_type}</p>
                <p><a href="${brewery.website_url}">Click here to visit their website.</a></p>
            </li>`
        );
    });

}


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

function getBrewery(userBreweryState) {
    const params = {
        by_state: userBreweryState,
        per_page: 50
        //by_name: userBrewery
        //Pagination & Per Page (default per page is 20; max per page is 50): /breweries?page=2&per_page=30
    };

    const baseUri = "https://api.openbrewerydb.org/breweries";
    const queryString = formatQueryString(params);
    const uri = `${baseUri}?${queryString}`;

    console.log(uri);

    fetchResults(uri);
}

function handleStartForm() {
    $('#start-form').submit(function(event) {
        event.preventDefault();
        //const userBrewery = $('#brewery-name').val();
        const userBreweryState = $('#brewery-state').val();

        getBrewery(userBreweryState);
    });
}

$(function() {
    console.log('App ready');
    handleStartForm();
});