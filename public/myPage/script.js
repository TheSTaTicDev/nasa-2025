// ====== ACTION REQUIRED! ======
// Paste your free API key from OpenWeatherMap.org here
const WEATHER_API_KEY = '3fe686b17567d676a20827a9bd89adc2'; // e.g., 'a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6'


// ====== CONFIGURATION & STATE VARIABLES ======
var config = { lat: 0, lng: 0, zoom: 0, autoSpin: true, autoReset: true, isHaloVisible: true, isPoleVisible: false, segX: 14, segY: 12 };
var stats, world, worldBg, globe, globeContainer, globePole, globeHalo, globePin;
var vertices = [], globeDoms = [];
var isMouseDown = false, isTweening = false;
var dragX, dragY, dragLat, dragLng;
var rX = 0, rY = 0;
var tick = 1;
var resetTimer = null;
var timeInterval = null;

var pin = { lat: 0, lng: 0, x: 0, y: 0, z: 0, visible: false };
var URLS = { bg: './images/css_globe_bg.jpg', diffuse: './images/css_globe_diffuse.jpg', halo: './images/css_globe_halo.png' };

var groupedCities = {
    "Antarctica": {
        "Aurora Australis": {
            "lat": -75.0,
            "lng": 0.0,
            "timezone": "Antarctica/McMurdo",
            "description": "Southern lights dancing over the Antarctic ice sheets, creating ribbons of green and red in the polar darkness.",
            "image": "images/aurora_australis.png",
            "fact": "Aurora Australis occurs when solar particles interact with Earth's magnetic field at the South Pole.",
            "population": "Uninhabited",
            "country": "Antarctica",
            "landmarks": [
                "Ross Ice Shelf",
                "McMurdo Station",
                "Transantarctic Mountains"
            ]
        }
    },
    "North America": {
        "New York City": {
            "lat": 40.7128,
            "lng": -74.006,
            "timezone": "America/New_York",
            "description": "The bright grid of Manhattan's streets creates a distinctive pattern of lights, with Central Park as a dark rectangle.",
            "image": "images/nyc_night.jpeg",
            "fact": "One of the brightest cities on Earth at night, visible from space due to light pollution.",
            "population": "8.3 Million (City)",
            "country": "USA",
            "landmarks": [
                "Manhattan",
                "Central Park",
                "Brooklyn Bridge",
                "Statue of Liberty"
            ]
        },
        "Bingham Canyon Mine": {
            "lat": 40.523,
            "lng": -112.1515,
            "timezone": "America/Denver",
            "description": "The world's largest man-made excavation appears as a massive spiral crater in the Utah landscape.",
            "image": "images/bingham_mine.jpg",
            "fact": "2.5 miles wide and 0.5 miles deep, it's one of the few man-made objects visible from space.",
            "population": "Mining Operation",
            "country": "USA",
            "landmarks": [
                "Kennecott Copper Mine",
                "Oquirrh Mountains",
                "Salt Lake City",
                "Great Salt Lake"
            ]
        },
        "Mississippi River": {
            "lat": 35.0,
            "lng": -90.0,
            "timezone": "America/Chicago",
            "description": "The Mississippi River winds its way south through the United States, visible as a broad, meandering ribbon from orbit.",
            "image": "images/mississippi_river.jpg",
            "fact": "One of the longest rivers in the world at 2,340 miles, historically vital for transport, agriculture, and settlement.",
            "population": "Millions in the basin",
            "country": "USA",
            "landmarks": [
                "Missouri River confluence",
                "St. Louis",
                "Memphis",
                "New Orleans"
            ]
        }
    },
    "South America": {
        "Amazon River": {
            "lat": -3.4653,
            "lng": -62.2159,
            "timezone": "America/Manaus",
            "description": "The world's largest river by volume appears as a massive brown serpent winding through endless green rainforest.",
            "image": "images/amazon_river.jpg",
            "fact": "Flows over 4,000 miles and discharges more water than the next seven largest rivers combined.",
            "population": "30 Million (Basin)",
            "country": "Brazil/Peru/Colombia",
            "landmarks": [
                "Amazon Rainforest",
                "Rio Negro",
                "Manaus",
                "Andes Mountains"
            ]
        }
    },
    "Africa": {
        "Sahara Desert": {
            "lat": 23.0,
            "lng": 8.0,
            "timezone": "Africa/Algiers",
            "description": "The world's largest hot desert displays mesmerizing patterns of golden sand dunes and ancient riverbeds.",
            "image": "images/sahara_desert.jpg",
            "fact": "Covers an area roughly the size of the United States, with temperatures reaching 136°F (58°C).",
            "population": "2.5 Million (Scattered)",
            "country": "Multiple African Nations",
            "landmarks": [
                "Great Sand Sea",
                "Tibesti Mountains",
                "Ahaggar Mountains",
                "Nile River Valley"
            ]
        },
        "Atlas Mountains": {
            "lat": 32.0,
            "lng": -6.0,
            "timezone": "Africa/Casablanca",
            "description": "The Atlas Mountain range rises dramatically from Morocco's Atlantic coast, extending east through Algeria and Tunisia.",
            "image": "images/Atlas_mt.jpg",
            "fact": "Extends over 2,500 km across northwest Africa, with peaks reaching over 4,000m in elevation.",
            "population": "20 Million (Region)",
            "country": "Morocco/Algeria/Tunisia",
            "landmarks": [
                "High Atlas",
                "Middle Atlas",
                "Anti-Atlas",
                "Toubkal Peak"
            ]
        },
        "Dakhla Bay": {
            "lat": 23.7,
            "lng": -15.9,
            "timezone": "Africa/El_Aaiun",
            "description": "A distinctive bay formation on the Western Sahara coast, creating a unique inlet pattern visible from orbit.",
            "image": "images/Dakhla_Bay.jpg",
            "fact": "Located in disputed Western Sahara territory, known for its strategic coastal position and natural harbor.",
            "population": "100,000 (City)",
            "country": "Western Sahara",
            "landmarks": [
                "Dakhla Peninsula",
                "Atlantic Coast",
                "Western Sahara",
                "Lagoons"
            ]
        }
    },
    "Asia": {
        "Himalayas": {
            "lat": 28.0,
            "lng": 84.0,
            "timezone": "Asia/Katmandu",
            "description": "The world's highest mountain range creates dramatic white peaks and deep valleys visible across multiple countries.",
            "image": "images/himalayas.jpg",
            "fact": "Contains 14 peaks over 8,000m including Mount Everest at 8,849m, the highest point on Earth.",
            "population": "50 Million (Region)",
            "country": "Nepal/India/Bhutan/China",
            "landmarks": [
                "Mount Everest",
                "K2",
                "Annapurna",
                "Ganges River"
            ]
        }
    },
    "Europe": {
        "British Isles": {
            "lat": 54.0,
            "lng": -2.0,
            "timezone": "Europe/London",
            "description": "The distinctive outline of Britain and Ireland glows with city lights, clearly showing the Thames and major urban centers.",
            "image": "images/british_isles.jpg",
            "fact": "Home to 70 million people with London as one of the brightest spots visible from space.",
            "population": "70 Million (Islands)",
            "country": "UK/Ireland",
            "landmarks": [
                "London",
                "Thames River",
                "Scottish Highlands",
                "Irish Sea"
            ]
        },
        "Strait of Gibraltar": {
            "lat": 36.1408,
            "lng": -5.3536,
            "timezone": "Europe/Madrid",
            "description": "The narrow channel connecting the Atlantic Ocean and Mediterranean Sea, separating Europe from Africa.",
            "image": "images/gibraltar_strait.jpg",
            "fact": "Only 14 km wide at its narrowest point, this strategic waterway has shaped history for millennia.",
            "population": "Major Shipping Route",
            "country": "Spain/Morocco",
            "landmarks": [
                "Rock of Gibraltar",
                "Tangier",
                "Ceuta",
                "Tarifa"
            ]
        }
    },
    "Arctic": {
        "Aurora Borealis": {
            "lat": 69.0,
            "lng": -130.0,
            "timezone": "America/Yellowknife",
            "description": "Northern lights create spectacular curtains of green, purple, and red dancing across the polar night sky.",
            "image": "images/aurora_borealis.png",
            "fact": "Best viewed from space between September and March when Earth's magnetic field is most active.",
            "population": "Uninhabited Regions",
            "country": "Canada/Alaska/Greenland",
            "landmarks": [
                "Arctic Ocean",
                "Greenland Ice Sheet",
                "Canadian Arctic Archipelago",
                "Beaufort Sea"
            ]
        }
    },
    "Atlantic Ocean": {
        "Hurricane Gabrielle": {
            "lat": 25.0,
            "lng": -50.0,
            "timezone": "Atlantic/Canary",
            "description": "Hurricane Gabrielle captured as a powerful Category 4 storm with sustained winds of 140 mph, visible as a massive spiral formation.",
            "image": "images/Hurricane.jpg",
            "fact": "Captured on Sept. 23, 2025, from the ISS at 258 miles above Earth, showing the classic hurricane eye structure.",
            "population": "Weather Phenomenon",
            "country": "Atlantic Ocean",
            "landmarks": [
                "Eye Wall",
                "Spiral Bands",
                "Storm Center",
                "Cloud Formation"
            ]
        },
        "Sunlit Clouds": {
            "lat": 25.0,
            "lng": -40.0,
            "timezone": "Etc/GMT+3",
            "description": "Cloud tops illuminated during orbital sunrise, creating dramatic lighting effects over the Atlantic Ocean.",
            "image": "images/clounds_atlantic.jpg",
            "fact": "Captured on May 15, 2024, from the ISS at 264 miles above Earth during an orbital sunrise.",
            "population": "Atmospheric Phenomenon",
            "country": "International Waters",
            "landmarks": [
                "Cloud Formations",
                "Ocean Surface",
                "Atmospheric Layers",
                "Orbital Sunrise"
            ]
        }
    },
    "Pacific Ocean": {
        "Hawaiian Islands": {
            "lat": 21.3099,
            "lng": -157.8581,
            "timezone": "Pacific/Honolulu",
            "description": "The volcanic island chain appears as emerald jewels scattered across the deep blue Pacific Ocean.",
            "image": "images/hawaii.jpg",
            "fact": "Formed by volcanic activity over a hotspot, creating a 1,500-mile island chain.",
            "population": "1.4 Million (Islands)",
            "country": "USA",
            "landmarks": [
                "Mauna Kea",
                "Mauna Loa",
                "Pearl Harbor",
                "Diamond Head"
            ]
        }
    }
};

var transformStyleName = PerspectiveTransform.transformStyleName;

// ====== INITIALIZATION ======
document.addEventListener('DOMContentLoaded', function () { init(); });

function init() {
    world = document.querySelector('.world');
    worldBg = document.querySelector('.world-bg');
    globe = document.querySelector('.world-globe');
    globeContainer = document.querySelector('.world-globe-doms-container');
    globePole = document.querySelector('.world-globe-pole');
    globeHalo = document.querySelector('.world-globe-halo');
    globePin = document.querySelector('.globe-pin');
    worldBg.style.backgroundImage = 'url(' + URLS.bg + ')';
    globeHalo.style.backgroundImage = 'url(' + URLS.halo + ')';
    regenerateGlobe();

    var gui = new dat.GUI();
    gui.add(config, 'lat', -90, 90).listen();
    gui.add(config, 'lng', -180, 180).listen();
    gui.add(config, 'zoom', 0, 1).listen();
    gui.add(config, 'autoSpin');
    var controls = { reset: function () { if (resetTimer) clearTimeout(resetTimer); resetGlobe(); } };
    gui.add(controls, 'reset').name('Reset Globe');
    gui.add(config, 'autoReset').name('Auto Reset (5 seconds)');
    gui.width = 350;

    var cityGui = new dat.GUI({ autoPlace: false });
    cityGui.width = 300;
    for (var countryName in groupedCities) {
        var countryFolder = cityGui.addFolder(countryName);
        var citiesInCountry = groupedCities[countryName];
        for (var cityName in citiesInCountry) {
            (function (cityObj, name) {
                var tempController = {};
                tempController[name] = function () { goTo(cityObj, name); };
                countryFolder.add(tempController, name);
            })(citiesInCountry[cityName], cityName);
        }
        countryFolder.open();
    }
    var cityGuiContainer = document.createElement('div');
    cityGuiContainer.id = 'city-gui-container';
    cityGuiContainer.appendChild(cityGui.domElement);
    document.body.appendChild(cityGuiContainer);

    stats = new Stats();
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.left = '0px';
    stats.domElement.style.top = '0px';
    document.body.appendChild(stats.domElement);

    world.addEventListener('mousedown', onMouseDown);
    world.addEventListener('mousemove', onMouseMove);
    world.addEventListener('mouseup', onMouseUp);
    document.getElementById('panel-close-btn').addEventListener('click', hideInfoPanel);

    loop();
}

// ====== CORE FUNCTIONS ======
function goTo(cityObject, cityName) {
    if (resetTimer) clearTimeout(resetTimer);
    config.autoSpin = false;
    updatePin(cityObject.lat, cityObject.lng);
    showInfoPanel(cityObject, cityName);

    isTweening = true;
    TweenMax.to(config, 2.0, { lat: cityObject.lat, lng: cityObject.lng, ease: 'easeInOutSine' });
    TweenMax.to(config, 2.0, {
        zoom: 0.5, ease: 'easeInOutSine', onComplete: function () {
            isTweening = false;
            if (config.autoReset) {
                resetTimer = setTimeout(resetGlobe, 5000);
            }
        }
    });
}

function resetGlobe() {
    hideInfoPanel();
    pin.visible = false;
    config.autoSpin = true;
    isTweening = true;
    TweenMax.to(config, 1.5, { lat: 0, lng: 0, zoom: 0, ease: 'easeInOutSine', onComplete: function () { isTweening = false; } });
}

function updatePin(lat, lng) {
    pin.visible = true;
    var radius = 268;
    var phi = (90 - lat) * Math.PI / 180;
    var theta = (90 + lng - 270) * Math.PI / 180;
    pin.x = -((radius) * Math.sin(phi) * Math.cos(theta));
    pin.y = ((radius) * Math.cos(phi));
    pin.z = ((radius) * Math.sin(phi) * Math.sin(theta));
}

function showInfoPanel(cityObject, cityName) {
    // Set the image source
    document.getElementById('panel-image').src = cityObject.image;

    // Populate text content
    document.getElementById('panel-title').textContent = cityName;
    document.getElementById('panel-description').textContent = cityObject.description;
    document.getElementById('panel-fact-text').textContent = cityObject.fact;
    document.getElementById('panel-country').textContent = cityObject.country;
    document.getElementById('panel-population').textContent = cityObject.population;

    // Populate landmarks
    var landmarksList = document.getElementById('panel-landmarks-list');
    landmarksList.innerHTML = '';
    cityObject.landmarks.forEach(name => {
        var li = document.createElement('li');
        li.textContent = name;
        landmarksList.appendChild(li);
    });

    // Update live info and show the panel
    updateLiveInfo(cityObject);
    document.getElementById('info-panel').classList.add('visible');
}

function hideInfoPanel() {
    if (timeInterval) clearInterval(timeInterval);
    document.getElementById('info-panel').classList.remove('visible');
}

function updateLiveInfo(cityObject) {
    // --- Update Time ---
    if (timeInterval) clearInterval(timeInterval);
    var timeEl = document.getElementById('panel-time');
    var tzEl = document.getElementById('panel-timezone');
    timeInterval = setInterval(() => {
        var time = new Date().toLocaleTimeString('en-US', { timeZone: cityObject.timezone, hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
        timeEl.textContent = time;
        tzEl.textContent = cityObject.timezone;
    }, 1000);

    // --- Update Weather ---
    var weatherTempEl = document.getElementById('panel-weather-temp');
    var weatherDescEl = document.getElementById('panel-weather-desc');
    var weatherIconEl = document.getElementById('panel-weather-icon');
    if (!WEATHER_API_KEY || WEATHER_API_KEY === '') {
        weatherDescEl.textContent = "Add API Key";
        return;
    }
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${cityObject.lat}&lon=${cityObject.lng}&appid=${WEATHER_API_KEY}&units=metric`)
        .then(response => response.json())
        .then(data => {
            weatherTempEl.textContent = `${Math.round(data.main.temp)}°C`;
            weatherDescEl.textContent = data.weather[0].main;
            weatherIconEl.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
        })
        .catch(error => {
            console.error("Error fetching weather:", error);
            weatherDescEl.textContent = "Weather N/A";
        });
}


// ====== MOUSE & TOUCH EVENTS ======
function onMouseDown(evt) { if (resetTimer) clearTimeout(resetTimer); isMouseDown = true; dragX = evt.pageX; dragY = evt.pageY; dragLat = config.lat; dragLng = config.lng; }
function onMouseMove(evt) { if (isMouseDown) { var dX = evt.pageX - dragX, dY = evt.pageY - dragY; config.lat = clamp(dragLat + dY * 0.5, -90, 90); config.lng = clampLng(dragLng - dX * 0.5); } }
function onMouseUp(evt) { isMouseDown = false; if (config.autoReset) { if (resetTimer) clearTimeout(resetTimer); resetTimer = setTimeout(resetGlobe, 5000); } }

// ====== ANIMATION LOOP & RENDERING (Full version in previous responses, abbreviated here for brevity) ======
// The full, complex render() and transformGlobe() functions should be pasted here from the last working version.
// For the sake of providing a complete file, here's the essential render() again.
function loop() { stats.begin(); render(); stats.end(); requestAnimationFrame(loop); }
function render() {
    if (config.autoSpin && !isMouseDown && !isTweening) { config.lng -= 0.2; }
    rX = config.lat * Math.PI / 180;
    rY = (config.lng - 270) * Math.PI / 180;

    globePole.style.display = config.isPoleVisible ? 'block' : 'none';
    globeHalo.style.display = config.isHaloVisible ? 'block' : 'none';
    var zoomRatio = 1 + config.zoom * 3;
    globe.style.transform = 'scale(' + zoomRatio + ')';
    var bgRatio = 1 + Math.pow(config.zoom, 3) * 0.3;
    worldBg.style.transform = 'scale(' + bgRatio + ')';

    if (pin.visible) {
        var cosRY = Math.cos(rY), sinRY = Math.sin(rY);
        var cosRX = Math.cos(-rX), sinRX = Math.sin(-rX);
        var x0 = pin.x * cosRY - pin.z * sinRY;
        var z0 = pin.z * cosRY + pin.x * sinRY;
        var y0 = pin.y * cosRX - z0 * sinRX;
        z0 = z0 * cosRX + pin.y * sinRX;
        var offset = 1 + (z0 / 4000);
        var px = (x0 * offset) / zoomRatio;
        var py = (y0 * offset) / zoomRatio;

        if (z0 < 0) {
            globePin.style.opacity = 0;
            globePin.style.transform = 'translate(' + px + 'px, ' + py + 'px) scale(0)';
        } else {
            globePin.style.opacity = 1;
            globePin.style.transform = 'translate(' + px + 'px, ' + py + 'px) scale(1)';
        }
    } else {
        globePin.style.opacity = 0;
        globePin.style.transform = 'scale(0)';
    }
    transformGlobe();
}

// ====== UTILITY & HELPER FUNCTIONS (Full versions from previous responses) ======
var pixelExpandOffset = 1.5;
function expand(v1, v2) { var x = v2.px - v1.px, y = v2.py - v1.py, det = x * x + y * y, idet; if (det === 0) return; idet = pixelExpandOffset / Math.sqrt(det); x *= idet; y *= idet; v2.tx = v2.px + x; v2.ty = v2.py + y; v1.tx = v1.px - x; v1.ty = v1.py - y; }
function clamp(x, min, max) { return x < min ? min : x > max ? max : x; }
function clampLng(lng) { return ((lng + 180) % 360) - 180; }
function regenerateGlobe() { var segWidth = 1600 / config.segX | 0, segHeight = 800 / config.segY | 0, radius = 268, diffuseImg = 'url(' + URLS.diffuse + ')'; while (globeContainer.firstChild) { globeContainer.removeChild(globeContainer.firstChild); } vertices = []; globeDoms = []; for (var y = 0; y <= config.segY; y++) { var vRow = []; for (var x = 0; x <= config.segX; x++) { var u = x / config.segX, v = y / config.segY; vRow.push({ x: -radius * Math.cos(u * Math.PI * 2) * Math.sin(v * Math.PI), y: -radius * Math.cos(v * Math.PI), z: radius * Math.sin(u * Math.PI * 2) * Math.sin(v * Math.PI) }); } vertices.push(vRow); } for (y = 0; y < config.segY; y++) { for (x = 0; x < config.segX; x++) { var dom = document.createElement('div'); dom.style.position = 'absolute'; dom.style.width = segWidth + 'px'; dom.style.height = segHeight + 'px'; dom.style.overflow = 'hidden'; dom.style[PerspectiveTransform.transformOriginStyleName] = '0 0'; dom.style.backgroundImage = diffuseImg; var p = new PerspectiveTransform(dom, segWidth, segHeight); dom.perspectiveTransform = p; dom.topLeft = vertices[y][x]; dom.topRight = vertices[y][x + 1]; dom.bottomLeft = vertices[y + 1][x]; dom.bottomRight = vertices[y + 1][x + 1]; dom.style.backgroundPosition = (-segWidth * x) + 'px ' + (-segHeight * y) + 'px'; globeContainer.appendChild(dom); globeDoms.push(dom); } } }
function transformGlobe() { if (tick ^= 1) { var cosRY = Math.cos(rY), sinRY = Math.sin(rY), cosRX = Math.cos(-rX), sinRX = Math.sin(-rX); for (var y = 0; y <= config.segY; y++) { for (var x = 0; x <= config.segX; x++) { var v = vertices[y][x], x0 = v.x * cosRY - v.z * sinRY, z0 = v.z * cosRY + v.x * sinRY, y0 = v.y * cosRX - z0 * sinRX; z0 = z0 * cosRX + v.y * sinRX; var offset = 1 + (z0 / 4000); v.px = x0 * offset; v.py = y0 * offset; } } for (var i = 0, len = globeDoms.length; i < len; i++) { var dom = globeDoms[i], p = dom.perspectiveTransform, v1 = dom.topLeft, v2 = dom.topRight, v3 = dom.bottomLeft, v4 = dom.bottomRight; expand(v1, v2); expand(v2, v3); expand(v3, v4); expand(v4, v1); p.topLeft.x = v1.tx; p.topLeft.y = v1.ty; p.topRight.x = v2.tx; p.topRight.y = v2.ty; p.bottomLeft.x = v3.tx; p.bottomLeft.y = v3.ty; p.bottomRight.x = v4.tx; p.bottomRight.y = v4.ty; if (!(p.hasError = p.checkError())) { p.calc(); } } } else { for (var i = 0, len = globeDoms.length; i < len; i++) { var p = globeDoms[i].perspectiveTransform; if (!p.hasError) { p.update(); } else { p.style[transformStyleName] = 'translate3d(-8192px, 0, 0)'; } } } }