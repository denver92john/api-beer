'use strict';

/* ----- 6 ----- */
function formatQueryString(paramsObj) {
    const queryItems = Object.keys(paramsObj)
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(paramsObj[key])}`);
    return queryItems.join('&');
}

/* ----- 8 ----- */
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
                <p class="p-info"><b>Brewery Type:</b> ${brewery.brewery_type}</p>
                <p class="p-info"><b>Phone:</b> <a href="tel:${brewery.phone}">${brewery.phone}</a></p>
                <p class="p-info"><a href="${brewery.website_url}">Click here to visit their website</a></p>
            </li>`
        );
    });
}

/* ----- 7 ----- */
function fetchResults(uri) {
    fetch(uri)
        .then(response => {
            if (response.ok) {
                $('footer').removeClass('hidden');
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
            $('footer').addClass('hidden');
            console.log(`There was an issue: ${err}`);
        });
}

/* ----- 4 ----- */
function renderUserSearch(userSearch) {
    // renders search to DOM under Results heading
    const searchPrint = [];
    for (let key in userSearch) {
        searchPrint.push(` ${userSearch[key]}`);
    }
    console.log(searchPrint);
    $('.js-results-feedback').text(`For: ${searchPrint}`);
}

function clearDOM() {
    // clears starting form
    $('.js-brewery-city').val('');
    $('.js-brewery-state').val('');
    $('.js-brewery-number').val('20');
    $('.js-type-selector').val('');

    // clears 'Find Another Brewery Form'
    $('.js-main-city').val('');
    $('.js-main-state').val('');
    $('.js-main-number').val('20');
    $('.js-main-type').val('');

    // clears user search criteria and error message
    $('.js-results-feedback').text('');
    $('.js-error-message').text('');

    // clears brewery listing
    $('.js-results-list').empty();
}

/* ----- 2 ----- */
function requireCityOrState(city, state) {
    if (city == '' && state == '') {
        $('.js-error-message').text(`City or state must be selected.`);
        $('footer').addClass('hidden');
        throw `City or state must be selected`;
    }
}

/* ----- 3 ----- */
function formParams(city, state, number, type) {
    // formats the parameters to be included in the search
    const params = {
        by_city: city,
        by_state: state,
        per_page: number,
        by_type: type
    }

    const newParams = {};
    for (let key in params) {
        // if any of the parameters are empty strings they aren't included
        if (params[key] != "") {
            newParams[key] = params[key];
        }
    }

    renderUserSearch(newParams);
    console.log(newParams);
    return newParams;
}

/* ----- 5 ----- */
function getBrewery(paramsObj) {
    // formats uri string to pass in the fetch
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
        $('.js-start-section').hide();

        clearDOM();
        requireCityOrState(userBreweryCity, userBreweryState);
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

        clearDOM();
        requireCityOrState(userBreweryCity, userBreweryState);
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
