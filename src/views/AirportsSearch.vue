<template>
    <div class="page">
        <div class="search-container">
            <h1 class="lite">
                Airports
            </h1>

            <div class="input-container">
                <input type="text" v-model="searchText" placeholder="Search airports" @keyup.enter="search(searchText)">
                <button @click="search(searchText)"><font-awesome-icon icon="fa-solid fa-magnifying-glass" /></button>
            </div>
        </div>

        <div class="main-section-container">
            <pulse-loader :loading="isFetchingAirports"></pulse-loader>
            <div v-if="!isFetchingAirports">
                <div v-if="airports && airports.length > 0" class="results-container">
                    <router-link v-for="(airport, index) in filteredAirportsPage"
                                :key="index"
                                :to="`/airports/airport/${airport.icao_code}`"
                                class="airport-block">
                        <h2>{{ airport.name }} ({{ airport.iata_code }})</h2>
                        <p>
                            <i>{{ airport.city }}, {{ airport.state }}</i>
                        </p>
                    </router-link>

                    <div v-show="pagination.totalPages > 1" class="pagination-container">
                        <button @click="goToPage(1)" :disabled="pagination.currentPage === 1">
                            &lt;&lt;
                        </button>
                        <button @click="goToPage(pagination.currentPage - 2)" v-show="pagination.currentPage > 2">
                            {{ pagination.currentPage - 2 }}
                        </button>
                        <button @click="goToPage(pagination.currentPage - 1)" v-show="pagination.currentPage > 1">
                            {{ pagination.currentPage - 1 }}
                        </button>
                        <button class="current" disabled>
                            {{ pagination.currentPage }}
                        </button>
                        <button @click="goToPage(pagination.currentPage + 1)" v-show="pagination.currentPage < pagination.totalPages - 1">
                            {{ pagination.currentPage + 1 }}
                        </button>
                        <button @click="goToPage(pagination.currentPage + 2)" v-show="pagination.currentPage < pagination.totalPages - 2">
                            {{ pagination.currentPage + 2 }}
                        </button>
                        <button @click="goToPage(pagination.totalPages - 1)" :disabled="pagination.currentPage >= pagination.totalPages - 1">
                            &gt;&gt;
                        </button>
                    </div>
                </div>

                <p v-if="airports && airports.length === 0" class="footer-message">
                    No airports found.
                </p>
                <p v-if="fetchAirportError" class="footer-message">
                    Oops! Error fetching airports.
                </p>
            </div>
        </div>
    </div>
</template>

<script>
    import PulseLoader from 'vue-spinner/src/PulseLoader.vue';
    import airlabsService from '@/services/airlabs';

    export default {
        name: 'AirportsSearchView',
        components: {
            PulseLoader
        },
        data() {
            return {
                isFetchingAirports: true,
                fetchAirportError: false,

                airports: undefined,
                searchText: undefined,
                pagination: {
                    pageLength: 10,
                    totalPages: undefined,
                    currentPage: undefined,
                }
            };
        },
        async created() {
            airlabsService.fetchAirports().then(() => {
                this.search();
            });
        },

        computed: {
            filteredAirportsPage() {
                if (this.pagination.totalPages === 1) {
                    return this.airports;
                }

                const startIndex = this.pagination.currentPage * this.pagination.pageLength;

                var endIndex = startIndex + this.pagination.pageLength;
                if (endIndex > this.airports.length) {
                    endIndex = this.airports.length - 1;
                }

                return this.airports.slice(startIndex, endIndex);
            }
        },

        methods: {
            airportMatchesSearchText(airport, searchText) {
                if (!searchText || !searchText.trim()) {
                    return true;
                }

                var match = true;
                
                const searchTerms = searchText.split(' ');
                for (let i = 0; i < searchTerms.length; i++) {
                    const searchTerm = searchTerms[i].toLowerCase();

                    var searchTermMatch = false;
                    if (airport.name.toLowerCase().includes(searchTerm)) { searchTermMatch = true; }
                    if (airport.state.toLowerCase() === searchTerm) { searchTermMatch = true; }
                    if (airport.city.toLowerCase().includes(searchTerm)) { searchTermMatch = true; }
                    if (airport.city_code.toLowerCase() === searchTerm) { searchTermMatch = true; }
                    if (airport.icao_code.toLowerCase() === searchTerm) { searchTermMatch = true; }
                    if (airport.iata_code.toLowerCase() === searchTerm) { searchTermMatch = true; }

                    if (!searchTermMatch) {
                        match = false;
                        break;
                    }
                }

                return match;
            },

            async search(searchText) {
                const self = this;

                self.isFetchingAirports = true;
                self.fetchAirportError = false;
                airlabsService.fetchAirports().then(function(airports) {
                    self.airports = airports.filter((airport) => {
                        return self.airportMatchesSearchText(airport, searchText);
                    });

                    self.pagination.totalPages = Math.ceil(self.airports.length / self.pagination.pageLength);
                    self.pagination.currentPage = 1;
                }).catch(() => {
                    self.fetchAirportError = true;
                }).finally(() => {
                    self.isFetchingAirports = false;
                });
            },

            goToPage(page) {
                this.pagination.currentPage = page;
                window.scrollTo(0, 0);
            }
        }
    };
</script>

<style lang="scss" scoped>
    .page {
        .search-container {
            background: linear-gradient(-135deg, #373f4E 25%, #5B6677);
            padding: 20px 20px 35px;

            text-align: center;
            
            h1 {
                color: white;
            }

            .input-container {
                input {
                    border: 1px solid #cde;
                    border-right: none;
                    border-top-left-radius: 0.25rem;
                    border-bottom-left-radius: 0.25rem;

                    width: 512px;
                    padding: 0.5rem;

                    font-size: 1.2rem;

                    &:focus {
                        outline: none;
                    }
                }

                button {
                    border: 1px solid #cde;
                    border-left: none;
                    border-top-right-radius: 0.25rem;
                    border-bottom-right-radius: 0.25rem;
                    background-color: white;

                    padding: 0.5rem;

                    font-size: 1.2rem;

                    &:hover {
                        cursor: pointer;
                    }
                }
            }
        }

        .main-section-container {
            .v-spinner {
                padding: 100px 0;
                text-align: center;
            }

            .results-container {
                padding-top: 2rem;
                padding-bottom: 2rem;
                border-left: 1px solid #cde;
                border-right: 1px solid #cde;

                .airport-block {
                    display: block;

                    margin-top: 2rem;
                    margin-left: 2rem;
                    margin-right: 2rem;

                    background-color: white;
                    padding: 1rem;
                    border-radius: 1rem;
                    border: 1px solid #cde;
                    box-shadow: 0 1px 3px 0 rgb(0 0 0/0.1), 0 1px 2px -1px rgb(0 0 0/0.1);

                    color: #394151;
                    text-decoration: none;

                    &:first-child {
                        margin-top: 0;
                    }

                    h2, p {
                        margin: 0;
                    }
                }

                .pagination-container {
                    margin-top: 2rem;
                    text-align: center;

                    display: flex;
                    justify-content: center;
                    column-gap: 0.5rem;

                    button {
                        background-color: white;
                        height: 2.5rem;
                        width: 2.5rem;
                        border: none;
                        border-radius: 5rem;

                        display: flex;
                        align-items: center;
                        justify-content: center;

                        color: #394151;

                        &:hover {
                            cursor: pointer;
                        }
                        &:disabled {
                            opacity: 0.25;
                            color: #747d8e;
                            cursor: default;
                        }

                        &.current {
                            background-color: #cde;
                            opacity: 1;
                            color: #394151;
                        }
                    }
                }
            }

            .footer-message {
                margin-top: 2rem;
                margin-bottom: 0;
                text-align: center;
            }
        }
    }
</style>
