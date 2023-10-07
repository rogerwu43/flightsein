<template>
    <div class="page">
        <h1 class="lite">About</h1>

        <p>
            Hi! I thought I'd jot down my thoughts on implementation here.
        </p>

        <p>
            While I've done the bare essentials, unfortunately I haven't been able to find as much time as I'd like to work on this. Coupled with learning Vue, there's so much more I'd wanted to do!
        </p>

        <p>
            First, I would have liked to put much more polish into the site's UI and UX. Some things that come to mind:
            <br>- General appearance - the pages look a bit bland to me, especially the Flight Details page.
            <br>- More responsive elements when interacting, e.g. the search bar should highlight when focused, or buttons should animate when clicked.
            <br>- Processed date and time formats, e.g. 10 Oct 23 or 2:00pm.
            <br>- I haven't gotten around to further searches while one's going. Right now it just ignores further clicks.
            <br>- UX around the Home button. Ideally it shows always, but I felt it strange UX to click on it while already on the 'Home' (Airport Search) page and nothing happens at all. So I've hidden it while on it.
            <br>- I would have liked the Home button to clear the Airport Search's search text before navigating to it.
            <br>- On page navigation, it doesn't scroll all the way to the top - instead just below the navbar. My guess is the navbar exists outside of the router?
            <br>- The UX around back-navigation could be much better in relation to search result caching (e.g. clicking into a Flight and going back causes a re-fetch of the Schedule list, which isn't ideal).
        </p>

        <p>
            Other thoughts on the more technical side:
            <br>- Based on the constraints and behaviour of the Airlabs API, I felt caching searches would work here. I added a 5 minutes cache to the Airport Search list, and would have liked to extend it to Airport Schedule searches.
            <br>- My logic around search lists being searchable is rudimentary. Normally I would spec this out in detail - the equivalent here would be asking questions, which I wish I'd done.
            <br>- I'm sure I could have handled the importing of FontAwesome icons better.
            <br>- The API key would normally be imported in a more secure manner!
            <br>- By 'includes departures and arrivals... for the current day', I interpreted this as the next 24 hrs based on what makes sense to me as a user. The API says it only fetches up to 10hrs ahead, so haven't got any special logic to filter for this.
            <br>- I'm painfully aware that there's a tonne of elements and functions that should be dedicated components and services, e.g. search bars, search results, pagination, result list cards...
        </p>

        <p>
            If I had one more day, I think I'd work on refactoring and modularising components & functions.
        </p>
    </div>
</template>

<script>
    export default {
        name: 'AboutView'
    };
</script>
