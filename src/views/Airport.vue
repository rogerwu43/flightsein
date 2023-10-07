<template>
    <div class="page">
        <pulse-loader :loading="isFetchingAirport"></pulse-loader>
        <div v-if="!isFetchingAirport">
            <div v-if="airport">
                <div class="airport-details">
                    <h1 class="lite">{{ airport.name }} ({{ airport.iata_code }})</h1>
                    <p>
                        <i>{{ airport.city }}, {{ airport.state }}</i>
                    </p>

                    <p v-show="airport.website">
                        <font-awesome-icon icon="fa-solid fa-globe" /> <strong>Website:</strong> <a :href="airport.website" target="_blank">{{ airport.website }}</a>
                    </p>
                    <p v-show="airport.phone_formatted">
                        <font-awesome-icon icon="fa-solid fa-square-phone" /> <strong>Phone:</strong> {{ airport.phone_formatted }}
                    </p>
                    <p v-show="airport.email">
                        <font-awesome-icon icon="fa-solid fa-envelope" /> <strong>Email:</strong> {{ airport.email }}
                    </p>
                    <p v-show="airport.twitter">
                        <font-awesome-icon icon="fa-brands fa-square-twitter" /> <strong>Twitter:</strong> <a :href="`https://${airport.twitter}`" target="_blank">{{ `https://${airport.twitter}` }}</a>
                    </p>
                </div>

                <div class="search-container">
                    <h1 class="lite">
                        Flight Schedule
                    </h1>

                    <div class="input-container">
                        <input type="text" v-model="searchText" placeholder="Search flights" @keyup.enter="search(searchText)">
                        <button @click="search(searchText)"><font-awesome-icon icon="fa-solid fa-magnifying-glass" /></button>
                    </div>
                </div>

                <pulse-loader :loading="isFetchingSchedule"></pulse-loader>
                <div v-if="!isFetchingSchedule">
                    <div v-if="schedule && schedule.length > 0" class="results-container">
                        <router-link v-for="(flight, index) in filteredSchedulePage"
                                     :key="index"
                                     :to="`/flight/${flight.flight_icao}`"
                                     class="flight-block">
                            <h2 v-if="flight.dep_icao === airport.icao_code"><font-awesome-icon icon="fa-solid fa-plane-departure" /> Departure</h2> 
                            <h2 v-if="flight.arr_icao === airport.icao_code"><font-awesome-icon icon="fa-solid fa-plane-arrival" /> Arrival</h2>

                            <div class="timing-container">
                                <div :class="{ highlighted: flight.dep_icao === airport.icao_code }">
                                    <div class="time">{{ timeFromFlightDatetime(flight.dep_time) }}</div>
                                    <div class="date">{{ dateFromFlightDatetime(flight.dep_time) }}</div>
                                    <div>{{ flight.dep_iata }}</div>
                                </div>
                                <div>→</div>
                                <div :class="{ highlighted: flight.arr_icao === airport.icao_code }">
                                    <div class="time">{{ timeFromFlightDatetime(flight.arr_time) }}</div>
                                    <div class="date">{{ dateFromFlightDatetime(flight.arr_time) }}</div>
                                    <div>{{ flight.arr_iata }}</div>
                                </div>
                            </div>

                            <div class="flight-number">
                                Flight {{ flight.flight_number }}
                            </div>
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

                    <p v-if="schedule && schedule.length === 0" class="footer-message">
                        No flights found.
                    </p>
                    <p v-if="fetchScheduleError" class="footer-message">
                        Oops! Error fetching flights.
                    </p>
                </div>
            </div>
            <div v-if="fetchAirportError" class="footer-message">
                Oops! Error fetching airport.
            </div>
        </div>
    </div>
</template>

<script>
    import PulseLoader from 'vue-spinner/src/PulseLoader.vue';
    import airlabsService from '@/services/airlabs';

    export default {
        name: 'AirportView',
        components: {
            PulseLoader
        },
        data() {
            return {
                isFetchingAirport: true,
                fetchAirportError: false,
                airport: undefined,

                isFetchingSchedule: false,
                fetchScheduleError: false,
                schedule: undefined,
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
                this.airport = airlabsService.getAirport(this.$route.params.icao);
                this.isFetchingAirport = false;
                this.search();
            }).catch(() => {
                this.fetchAirportError = true;
                this.isFetchingAirport = false;
            });
        },

        computed: {
            filteredSchedulePage() {
                if (this.pagination.totalPages === 1) {
                    return this.schedule;
                }

                const startIndex = this.pagination.currentPage * this.pagination.pageLength;

                var endIndex = startIndex + this.pagination.pageLength;
                if (endIndex > this.schedule.length) {
                    endIndex = this.schedule.length - 1;
                }

                return this.schedule.slice(startIndex, endIndex);
            },
        },

        methods: {
            flightMatchesSearchText(flight, searchText) {
                if (!searchText || !searchText.trim()) {
                    return true;
                }

                var match = true;
                
                const searchTerms = searchText.split(' ');
                for (let i = 0; i < searchTerms.length; i++) {
                    const searchTerm = searchTerms[i].toLowerCase();

                    var searchTermMatch = false;
                    if (flight.flight_number === searchTerm) { searchTermMatch = true; }
                    if (flight.dep_icao.toLowerCase() === searchTerm) { searchTermMatch = true; }
                    if (flight.dep_iata.toLowerCase() === searchTerm) { searchTermMatch = true; }
                    if (flight.arr_icao.toLowerCase() === searchTerm) { searchTermMatch = true; }
                    if (flight.arr_iata.toLowerCase() === searchTerm) { searchTermMatch = true; }
                    if (searchTerm === 'departure' && flight.dep_icao === this.airport.icao_code) { return true; }
                    if (searchTerm === 'arrival' && flight.arr_icao === this.airport.icao_code) { return true; }

                    if (!searchTermMatch) {
                        match = false;
                        break;
                    }
                }

                return match;
            },

            async search(searchText) {
                const self = this;

                self.isFetchingSchedule = true;
                self.fetchScheduleError = false;
                airlabsService.fetchFlightSchedule(this.airport.icao_code).then((schedule) => {
                    self.schedule = schedule.filter((flight) => {
                        return self.flightMatchesSearchText(flight, searchText);
                    }).sort((flightA, flightB) => {
                        if (flightA.dep_time_ts === flightB.dep_time_ts) {
                            return flightA.arr_time_ts > flightB.arr_time_ts;
                        }
                        return flightA.dep_time_ts > flightB.dep_time_ts;
                    });

                    self.pagination.totalPages = Math.ceil(self.schedule.length / self.pagination.pageLength);
                    self.pagination.currentPage = 1;
                }).catch(() => {
                    self.fetchScheduleError = true;
                }).finally(() => {
                    self.isFetchingSchedule = false;
                });
            },

            dateFromFlightDatetime(datetime) {
                return datetime.split(' ')[0];
            },
            timeFromFlightDatetime(datetime) {
                return datetime.split(' ')[1];
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
        .v-spinner {
            padding: 100px 0;
            text-align: center;
        }

        .airport-details {
            background-color: white;
            padding: 1.5rem 2rem;
            border-radius: 1rem;

            a:visited {
                color: blue;
            }

            h1 {
                margin-top: 0;
                margin-bottom: 0;
            }

            p {
                margin-top: 0;
            }
        }

        .search-container {
            margin-top: 2rem;

            background: linear-gradient(-135deg, #374c4e 25%, #5b7771);
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
                    @media(max-width: 720px) {
                        width: 256px;
                    }
                    @media(max-width: 370px) {
                        width: 180px;
                    }

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

        .results-container {
            padding-top: 2rem;
            padding-bottom: 2rem;
            border-left: 1px solid #cde;
            border-right: 1px solid #cde;

            .flight-block {
                display: flex;
                align-items: center;

                margin-top: 2rem;
                margin-left: 2rem;
                margin-right: 2rem;

                background-color: white;
                padding: 1rem 2rem;
                border-radius: 1rem;
                border: 1px solid #cde;
                box-shadow: 0 1px 3px 0 rgb(0 0 0/0.1), 0 1px 2px -1px rgb(0 0 0/0.1);

                color: #394151;
                text-decoration: none;

                &:first-child {
                    margin-top: 0;
                }

                h2 {
                    margin: 0;
                }

                .timing-container {
                    margin-top: 0.5rem;

                    display: flex;
                    align-items: center;
                    column-gap: 1rem;
                    text-align: center;

                    margin-left: 1.5rem;
                    padding-left: 1.5rem;
                    border-left: 1px solid #cde;

                    .highlighted {
                        font-weight: bold;
                    }

                    .time {
                        font-size: 2rem;
                    }

                    .date {
                        font-size: 0.8rem;
                        color: #5f687a;
                    }
                }

                .flight-number {
                    flex: 1;

                    margin-left: 1.5rem;
                    padding-left: 1.5rem;
                    border-left: 1px solid #cde;

                    text-align: right;
                    font-size: 1.5rem;
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
</style>
