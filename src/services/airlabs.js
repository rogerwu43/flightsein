import axios from 'axios';


const API_URL = 'https://airlabs.co/api/v9';
const API_KEY = 'f410e654-34a3-48da-b5ae-b7a1ee186b2b'; // This would normally be imported more securely!


class AirLabsService {
    async fetchAirports() {
        try {
            const params = {
                api_key: API_KEY,
                country_code: 'AU'
            };
            const response = await axios.get(`${API_URL}/airports`, { params });
            // console.log(response.data.response);
            const majorAirports = response.data.response.filter((airportData) => {
                return airportData.is_major;
            });
            console.log(majorAirports);
            // Be able to filter by state in the template
        } catch(error) {
            console.error('Error fetching data:', error);
        }
    }
}

const airlabsService = new AirLabsService();

export default airlabsService;
