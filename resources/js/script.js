'use strict';

/* ----- 4 ----- */
function formatQueryString(paramsObj) {
    const queryItems = Object.keys(paramsObj)
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(paramsObj[key])}`);
    return queryItems.join('&');
}

/* ----- 6 ----- */
function renderResults(responseJson) {
    console.log(responseJson);

    responseJson.forEach(brewery => {
        $('.js-results-list').append(
            `<li class="list-item">
                <h4>${brewery.name}</h4>
                <address>
                    <a href="https://www.google.com/maps/place/${brewery.street},${brewery.city},${brewery.state},${brewery.postal_code}">
                        <p>${brewery.street}</p>
                        <p>${brewery.city}, ${brewery.state}, ${brewery.postal_code}</p>
                    </a>
                </address>
                <p><b>Brewery Type:</b> ${brewery.brewery_type}</p>
                <p><b>Phone:</b> <a href="tel:${brewery.phone}">${brewery.phone}</a></p>
                <p><a href="${brewery.website_url}">Click here to visit their website</a></p>
            </li>`
        );
    });
}

/* ----- 5 ----- */
function fetchResults(uri) {
    $('.js-results-list').empty();
    fetch(uri)
        .then(response => {
            if (response.ok) {
                $('.js-error-message').text('');
                return response.json();
            } else {
                throw new Error(response.statusText);
            }
        })
        .then(responseJson => {
            if (responseJson.length < 1) {
                throw new Error(`No results were returned. Try a different search.`);
            } else {
               renderResults(responseJson);
            }
        })
        .catch(err => {
            $('.js-error-message').text(`There was an issue: ${err.message}`);
            console.log(`There was an issue: ${err}`);
        });
}

function renderUserSearch(userSearch) {
    const searchPrint = [];
    for (let key in userSearch) {
        if (key == userSearch.by_city || userSearch.by_state) {
            searchPrint.push(`in ${userSearch[key]}`);
        } else if (key == userSearch.by_type) {
            searchPrint.push(`of ${userSearch[key]} type`);
        }
    }

    
    console.log(searchPrint);
    //$('.js-results-feedback').text(`Returned results for breweries in: `);
}



/* ----- 2 ----- */
function formParams(city, state, number, type) {
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

    //renderUserSearch(newParams);

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
    $('.js-start-form').on('submit', function(event) {
        event.preventDefault();
        console.log(`handleStartForm is running`);
        const userBreweryCity = $('.js-brewery-city').val();
        const userBreweryState = $('.js-brewery-state').val();
        const userBreweryNumber = $('.js-brewery-number').val();
        const userBreweryType = $('.js-type-selector').val();
        $('.js-brewery-city').val('');
        $('.js-brewery-state').val('');
        $('.js-brewery-number').val('20');
        $('.js-type-selector').val('');
        $('.js-start-section').hide();

        const paramsObj = formParams(userBreweryCity, userBreweryState, userBreweryNumber, userBreweryType);
        
        getBrewery(paramsObj);
    });
}

/* ----- 1 ----- */
function handleMainForm() {
    $('.js-main-form').on('submit', function(event) {
        event.preventDefault();
        console.log(`handleMainForm is running`);
        const userBreweryCity = $('.js-main-city').val();
        const userBreweryState = $('.js-main-state').val();
        const userBreweryNumber = $('.js-main-number').val();
        const userBreweryType = $('.js-main-type').val();
        $('.js-main-city').val('');
        $('.js-main-state').val('');
        $('.js-main-number').val('20');
        $('.js-main-type').val('');

        const paramsObj = formParams(userBreweryCity, userBreweryState, userBreweryNumber, userBreweryType);
        getBrewery(paramsObj);
    });
}

function logoClick() {
    $('.js-logo').on('click', () => $('.js-start-section').show());
}

$(function() {
    console.log('App ready');
    handleStartForm();
    handleMainForm();
    logoClick();
});
