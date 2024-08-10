const cities = [
    { name: 'Lincoln, UK', value: '53.1,-0.13' },
    { name: 'New York, USA', value: '40.7128,-74.0060' },
    { name: 'Tokyo, Japan', value: '35.6895,139.6917' },
    { name: 'Paris, France', value: '48.8566,2.3522' },
    { name: 'Los Angeles, USA', value: '34.0522,-118.2437' },
    { name: 'London, UK', value: '51.5074,-0.1278' },
    { name: 'Berlin, Germany', value: '52.52,13.4050' },
    { name: 'Sydney, Australia', value: '-33.8688,151.2093' },
    { name: 'Toronto, Canada', value: '43.6510,-79.3470' },
    { name: 'Rio de Janeiro, Brazil', value: '-22.9068,-43.1729' },
    { name: 'Moscow, Russia', value: '55.7558,37.6176' },
    { name: 'Istanbul, Turkey', value: '41.0082,28.9784' },
    { name: 'Dubai, UAE', value: '25.2760,55.2962' },
    { name: 'Cape Town, South Africa', value: '-33.9249,18.4241' },
    { name: 'Mumbai, India', value: '19.0760,72.8777' },
    { name: 'Buenos Aires, Argentina', value: '-34.6037,-58.3816' },
];

const cityInput = document.getElementById('city-input');
const suggestions = document.getElementById('suggestions');

cityInput.addEventListener('input', () => {
    const inputValue = cityInput.value.toLowerCase();
    suggestions.innerHTML = '';

    if (inputValue) {

        const filteredCities = cities.filter(city =>
            city.name.toLowerCase().startsWith(inputValue)
        );

        if (filteredCities.length > 0) {
            filteredCities.forEach(city => {
                const item = document.createElement('div');
                item.textContent = city.name;
                item.className = 'suggestion-item';
                item.addEventListener('click', () => {
                    cityInput.value = city.name;
                    suggestions.innerHTML = '';

                    document.getElementById('location-name').textContent = city.name;
                    document.getElementById('background-image').style.opacity = 0;
                    fetchImageFromUnsplash(city.name);
                    fetchWeatherData(city.value);
                });
                suggestions.appendChild(item);
            });
        } else {
            const noResult = document.createElement('div');
            noResult.textContent = 'No results found';
            noResult.className = 'suggestion-item';
            suggestions.appendChild(noResult);
        }
    }
});

document.addEventListener('click', (event) => {
    if (!event.target.closest('.autocomplete')) {
        suggestions.innerHTML = '';
    }
});

function fetchImageFromUnsplash(city) {
    const apiKey = 'WxtNb3qu8jEmbvLk8SPKkkbaLVIDD9-BMcsVszH08zI'; // Replace with your Unsplash API key
    const url = `https://api.unsplash.com/search/photos?query=${city}&client_id=${apiKey}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.results && data.results.length > 0) {
                const imageUrl = data.results[0].urls.regular;
                const backgroundImage = document.getElementById('background-image');
                backgroundImage.style.backgroundImage = `url('${imageUrl}')`;


                setTimeout(() => {
                    backgroundImage.style.opacity = 1;
                }, 100);
            } else {
                console.error('No images found for city:', city);
                // Set a default image here if no image is found
                document.getElementById('background-image').style.backgroundImage = `url('default.jpg')`;


                setTimeout(() => {
                    document.getElementById('background-image').style.opacity = 1;
                }, 100);
            }
        })
        .catch(error => {
            console.error('Error fetching image from Unsplash:', error);

            document.getElementById('background-image').style.backgroundImage = `url('default.jpg')`;


            setTimeout(() => {
                document.getElementById('background-image').style.opacity = 1;
            }, 100);
        });
}

function fetchWeatherData(location) {
    const xhr = new XMLHttpRequest();
    xhr.withCredentials = true;

    xhr.addEventListener('readystatechange', function () {
        if (this.readyState === this.DONE) {
            console.log('API Response:', this.responseText);

            try {
                const response = JSON.parse(this.responseText);

                if (response && response.location && response.current) {
                    document.getElementById('location-name').textContent = response.location.name;
                    document.getElementById('temp').textContent = `${response.current.temp_c}°C`;
                    document.getElementById('condition').textContent = response.current.condition.text;
                    document.getElementById('humidity').textContent = response.current.humidity;
                    document.getElementById('wind-speed').textContent = response.current.wind_kph;
                } else {
                    console.error('Unexpected API response structure:', response);
                    alert('Unable to fetch weather data. Please try again.');
                }
            } catch (error) {
                console.error('Error parsing API response:', error);
                alert('Error fetching weather data. Please try again.');
            }
        }
    });

    xhr.open('GET', `https://weatherapi-com.p.rapidapi.com/current.json?q=${location}`);
    xhr.setRequestHeader('x-rapidapi-key', '4123484206msh53d201428929f09p1d7aaajsn1f0c3a6a0ae0');
    xhr.setRequestHeader('x-rapidapi-host', 'weatherapi-com.p.rapidapi.com');

    xhr.send(null);

    getUserLocationAndTime();
}

function getUserLocationAndTime() {
    setInterval(() => {
        const localTime = new Date().toLocaleTimeString();
        document.getElementById('local-time').textContent = localTime;
    }, 1000);
}

document.getElementById('weather-facts').addEventListener('click', function(event) {
    if (event.target.tagName === 'LI') {
        const info = event.target.getAttribute('data-info');
        document.getElementById('fact-info').textContent = info;
    }
});
