<template>
    <nav-bar></nav-bar>
    <router-view v-slot="{ Component }">
        <keep-alive include="AirportsSearchView, AirportView">
            <component :is="Component" />
        </keep-alive>
    </router-view>
</template>

<script>
    import NavBar from '@/components/NavBar';

    export default {
        name: 'App',
        components: {
            NavBar
        }
    };
</script>

<style>
    @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap');
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap');

    #app {
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;

        --page-max-width: 1232px;
    }

    html {
        font-family: Inter, Helvetica, Arial, sans-serif;
        font-size: 14px;
        color: #394151;
    }

    body {
        margin: 0;

        background-color: #F3F4F6;
    }

    h1, h2, h3, h4, h5, h6 {
        font-family: 'DM Serif Display', 'Times New Roman', serif;
    }

    h1 {
        &.lite {
            font-family: Inter;
            font-size: 1rem;
            letter-spacing: 0.1rem;
            line-height: 1.8rem;
            margin-top: 0;
            margin-bottom: 1.6rem;

            text-transform: uppercase;
        }
    }

    .page {
        max-width: var(--page-max-width);
        padding-left: 1rem;
        padding-right: 1rem;
        margin-left: auto;
        margin-right: auto;
        margin-top: 1rem;
        min-height: 100vh;
    }
</style>
