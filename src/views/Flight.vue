<template>
    <div class="page">
        <pulse-loader :loading="isFetchingFlight"></pulse-loader>
        <div v-if="!isFetchingFlight" class="flight-details">
            <h1 class="lite">Flight number {{ flight.flight_number }}</h1>

            <table class="details">
                <tr>
                    <td class="bold">Departs:</td>
                    <td>{{ dateFromFlightDatetime(flight.dep_time) }}, {{ timeFromFlightDatetime(flight.dep_time) }}, {{ flight.dep_name }} - Gate {{ flight.dep_gate }}</td>
                </tr>
                <tr>
                    <td class="bold">Arrives:</td>
                    <td>{{ dateFromFlightDatetime(flight.arr_time) }}, {{ timeFromFlightDatetime(flight.arr_time) }}, {{ flight.arr_name }} - Gate {{ flight.arr_gate }}</td>
                </tr>
                <tr v-if="flight.duration">
                    <td class="bold">Duration:</td>
                    <td>{{ flight.duration >= 60 ? `${Math.floor(flight.duration / 60)}hrs ` : '' }}{{ flight.duration - Math.floor(flight.duration / 60) * 60 }}min</td>
                </tr>
                <tr v-if="flight.manufacturer && flight.model">
                    <td class="bold">Aircraft:</td>
                    <td>{{ flight.manufacturer }}, {{ flight.model }}</td>
                </tr>
                <tr v-if="flight.airline_name">
                    <td class="bold">Airline:</td>
                    <td>{{ flight.airline_name }}</td>
                </tr>
            </table>
        </div>
    </div>
</template>

<script>
    import PulseLoader from 'vue-spinner/src/PulseLoader.vue';
    import airlabsService from '@/services/airlabs';

    export default {
        name: 'FlightView',
        components: {
            PulseLoader
        },
        data() {
            return {
                isFetchingFlight: true,
                fetchFlightError: false,
                flight: undefined
            };
        },

        async created() {
            airlabsService.fetchFlight(this.$route.params.icao).then((flight) => {
                this.flight = flight;
                console.log(this.flight);
            }).catch(() => {
                this.fetchFlightError = true;
            }).finally(() => {
                this.isFetchingFlight = false;
            });
        },

        methods: {
            dateFromFlightDatetime(datetime) {
                return datetime.split(' ')[0];
            },
            timeFromFlightDatetime(datetime) {
                return datetime.split(' ')[1];
            },
        }
    };
</script>

<style lang="scss" scoped>
    .page {
        .v-spinner {
            padding: 100px 0;
            text-align: center;
        }

        .flight-details {
            background-color: white;
            padding: 1.5rem 2rem;
            border-radius: 1rem;

            h1 {
                margin-top: 0;
            }

            .details {
                border-collapse: separate;
                border-spacing: 0.5rem;

                tr {
                    td {
                        &.bold {
                            font-weight: bold;
                        }
                    }
                }
            }
        }
    }
</style>
