document.addEventListener("DOMContentLoaded", function () {
    const tabs = document.querySelectorAll(".route-tab");
    const details = document.querySelectorAll(".route-detail");

    tabs.forEach(tab => {
        tab.addEventListener("click", function () {
            tabs.forEach(t => t.classList.remove("active"));
            details.forEach(d => d.classList.remove("active"));

            this.classList.add("active");
            const routeId = this.getAttribute("data-route") + "-route";
            document.getElementById(routeId).classList.add("active");
        });
    });

    const mapLocation = L.map('map').setView([49.9802, 19.1508], 16);


    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mapLocation);

    L.marker([49.9802, 19.1508]).addTo(mapLocation)
        .bindPopup("Nasza przystań: <br> ul. T. Kościuszki 24, Brzeszcze <br> Zapraszamy na rejsy!")
        .openPopup();

    const apiKey = '4b36886274464bfa836183528252602';
    const city = 'Brzeszcze';
    const url = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}&lang=pl`;

    async function getWeather() {
        try {
            const response = await fetch(url);
            const data = await response.json();

            const temperature = data.current.temp_c;
            const conditions = data.current.condition.text;
            const iconCode = data.current.condition.icon;

            document.querySelector('.weather-widget .temperature').textContent = `${temperature}°C`;
            document.querySelector('.weather-widget .conditions').textContent = conditions;
            const iconUrl = `https:${iconCode}`;
            document.querySelector('.weather-widget .weather-icon i').innerHTML = `<img src="${iconUrl}" alt="Pogoda">`;

        } catch (error) {
            console.error('Błąd:', error);
            document.querySelector('.weather-widget .temperature').textContent = 'Błąd ładowania pogody';
            document.querySelector('.weather-widget .conditions').textContent = 'Spróbuj ponownie później';
        }
    }

    window.onload = getWeather;

    let map;

function initMap() {
    if (!document.getElementById('route-map')) {
        console.error("Element o id 'route-map' nie istnieje na stronie");
        return;
    }

    map = L.map('route-map').setView([51.1079, 17.0385], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    function drawRoute(routeId) {
        map.eachLayer(function(layer) {
            if (layer instanceof L.Polyline) {
                map.removeLayer(layer);
            }
        });
        
        let latlngs;

        switch(routeId) {
            case "oswiecim1":
                latlngs = [
                    [51.1079, 17.0385],  // Przystań
                    [51.1100, 17.0450]   // Most Niepodległości
                ];
                break;
            case "oswiecim2":
                latlngs = [
                    [51.1079, 17.0385],  // Przystań
                    [51.1200, 17.0700],  // Punkt "0km"
                    [51.1300, 17.0800],  // Śluzowanie
                    [51.1400, 17.0900],  // Smolice
                    [51.1079, 17.0385]   // Powrót do przystani
                ];
                break;
            case "krakow":
                latlngs = [
                    [51.1079, 17.0385],  // Przystań
                    [51.1200, 17.1200],  // Pierwsza śluza
                    [51.1300, 17.1400],  // Druga śluza
                    [51.1500, 17.1800],  // Tyniec
                    [50.0647, 19.9450],  // Kraków
                    [51.1079, 17.0385]   // Powrót do przystani
                ];
                break;
            case "tyniec":
                latlngs = [
                    [51.1079, 17.0385],  // Przystań
                    [51.1200, 17.1200],  // Pierwsza śluza
                    [51.1300, 17.1400],  // Druga śluza
                    [51.1500, 17.1800],  // Tyniec
                    [51.1079, 17.0385]   // Powrót do przystani
                ];
                break;
            default:
                console.error("Nieznane ID trasy:", routeId);
                return;
        }

        const route = L.polyline(latlngs, {color: 'blue'}).addTo(map);
        map.fitBounds(route.getBounds(), {padding: [30, 30]});
    }

    drawRoute('oswiecim1');
    document.querySelectorAll('.route-tab').forEach(button => {
        button.addEventListener('click', function() {
            document.querySelectorAll('.route-tab').forEach(btn => {
                btn.classList.remove('active');
            });
            
            this.classList.add('active');
            
            const routeId = this.getAttribute('data-route');
            drawRoute(routeId);
        });
    });
}

if (document.readyState === 'complete' || document.readyState === 'interactive') {
    setTimeout(initMap, 1);
} else {
    document.addEventListener('DOMContentLoaded', initMap);
}


const testimonials = document.querySelectorAll(".testimonial");
    const dots = document.querySelectorAll(".testimonial-dot");
    const prevButton = document.querySelector(".testimonial-prev");
    const nextButton = document.querySelector(".testimonial-next");

    let currentIndex = 0;

    function showTestimonial(index) {
        testimonials.forEach((testimonial, i) => {
            testimonial.classList.toggle("active", i === index);
        });

        dots.forEach((dot, i) => {
            dot.classList.toggle("active", i === index);
        });

        currentIndex = index;
    }

    prevButton.addEventListener("click", function () {
        let newIndex = currentIndex - 1;
        if (newIndex < 0) newIndex = testimonials.length - 1;
        showTestimonial(newIndex);
    });

    nextButton.addEventListener("click", function () {
        let newIndex = (currentIndex + 1) % testimonials.length;
        showTestimonial(newIndex);
    });

    dots.forEach((dot, i) => {
        dot.addEventListener("click", function () {
            showTestimonial(i);
        });
    });

});
