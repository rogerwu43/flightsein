<template>
    <div class="home">
        <div>
            Flightsein
        </div>
        <SearchMenu/>
    </div>
</template>

<script>
    // import airlabsService from '@/services/airlabs.js';
    import SearchMenu from '@/components/SearchMenu.vue';

    export default {
        name: 'HomeView',
        components: {
            SearchMenu
        }

        // async created() {
        //     try {
        //         // Call the service method to fetch data
        //         await airlabsService.fetchAirports();
        //     } catch (error) {
        //         console.error('Error fetching data:', error);
        //     }
        // }
    };
</script>

<style lang="scss" scoped>
    .home {
        height: 100vh;

        background-color: #F3F4F6;
    }
</style>
