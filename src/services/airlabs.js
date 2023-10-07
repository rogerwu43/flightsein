import axios from 'axios';

const API_URL = 'https://airlabs.co/api/v9';
const API_KEY = 'f410e654-34a3-48da-b5ae-b7a1ee186b2b';

class AirLabsService {
    constructor() {
        this.fetchPromise = undefined;
        this.fetchedAt = undefined;

        this.airports = undefined;
    }

    async fetchAirports() {
        if (this.fetchPromise) {
            return this.fetchPromise;
        }

        const now = new Date().getTime();
        const fetchedRecently = this.fetchedAt && (now - this.fetchedAt) < 1000 * 60 * 5; // 5 minute cache
        if (fetchedRecently) {
            return Promise.resolve(this.airports);
        }

        const params = {
            api_key: API_KEY,
            country_code: 'AU'
        };
        this.fetchPromise = axios.get(`${API_URL}/airports`, { params }).then((response) => {
            const allAirports = response.data.response;
            this.airports = allAirports.filter((airport) => {
                if (airport.type !== 'airport') { return false; }
                if (airport.status !== 'active') { return false; }
                if (!airport.is_major) { return false; }
                return true;
            });

            this.fetchedAt = new Date().getTime();
            this.fetchPromise = undefined;

            return this.airports;
        });
        return this.fetchPromise;
    }

    getAirport(icao) {
        if (!this.fetchedAt) {
            return undefined;
        }
        
        return this.airports.find((airport) => {
            return airport.icao_code === icao;
        });
    }

    async fetchFlightSchedule(airportIcao) {
        const departureParams = {
            api_key: API_KEY,
            dep_icao: airportIcao
        };
        return axios.get(`${API_URL}/schedules`, { params: departureParams }).then((response) => {
            const departures = response.data.response;

            const arrivalParams = {
                api_key: API_KEY,
                arr_icao: airportIcao
            };
            return axios.get(`${API_URL}/schedules`, { params: arrivalParams }).then((response) => {
                const arrivals = response.data.response;
                return [...departures, ...arrivals];
            });
        });
    }

    async fetchFlight(icao) {
        const params = {
            api_key: API_KEY,
            flight_icao: icao
        };
        return axios.get(`${API_URL}/flight`, { params }).then((response) => {
            return response.data.response;
        });
    }
}

const airlabsService = new AirLabsService();

export default airlabsService;
