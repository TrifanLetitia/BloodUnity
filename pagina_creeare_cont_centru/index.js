function readCSV(file, callback) {
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", file, true);
    rawFile.onreadystatechange = function () {
        if (rawFile.readyState === 4 && rawFile.status === 200) {
            var allText = rawFile.responseText;
            callback(allText);
        }
    };
    rawFile.send(null);
}

// Funcție pentru a popula dropdown-ul cu județe
function populateCountyDropdown(csvData) {
    var lines = csvData.split("\n");
    var select = document.getElementById("judet");

    var uniqueCounties = new Set();

    for (var i = 0; i < lines.length; i++) {
        var parts = lines[i].split(",");
        var county = parts[1].trim().replace(/"/g, ''); // elimină ghilimelele cu replace

        if (county !== "" && !uniqueCounties.has(county)) {
            uniqueCounties.add(county);

            var option = document.createElement("option");
            option.value = county; // doar județul
            option.text = county; // păstrează ghilimelele aici pentru județe
            select.add(option);
        }
    }
}

// Funcție pentru a popula dropdown-ul cu localități în funcție de județ
function populateLocalityDropdown(csvData, selectedCounty) {
    var lines = csvData.split("\n");
    var select = document.getElementById("localitate");

    // Curățăm dropdown-ul pentru localități
    select.innerHTML = "";

    for (var i = 0; i < lines.length; i++) {
        var parts = lines[i].split(",");
        var county = parts[1].trim().replace(/"/g, ''); // elimină ghilimelele cu replace
        var locality = parts[0].trim().replace(/"/g, ''); // elimină ghilimelele cu replace

        // Verificăm dacă județul este cel selectat
        if (county === selectedCounty && locality !== "") {
            var option = document.createElement("option");
            option.value = locality; // doar localitatea
            option.text = locality; // păstrează ghilimelele aici pentru localități
            select.add(option);
        }
    }
}


// Apelăm funcția pentru a citi și procesa fișierul CSV pentru județe
readCSV('../Localities.csv', populateCountyDropdown);

// Adăugăm un eveniment pentru a detecta schimbările în dropdown-ul pentru județ
document.getElementById("judet").addEventListener("change", function () {
    var selectedCounty = this.value;
    // Apelăm funcția pentru a citi și procesa fișierul CSV pentru localități
    readCSV('../Localities.csv', function (csvData) {
        populateLocalityDropdown(csvData, selectedCounty);
    });
});

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

// Retrieve data from URL parameters
var name = getParameterByName('name');
var email = getParameterByName('email');
var password = getParameterByName('password');
console.log(name, email, password)
// Fill in form fields with retrieved data
document.getElementById('fname').value = name;
document.getElementById('email').value = email;
document.getElementById('password').value = password;

function submitForm(event) {
    event.preventDefault(); // Împiedică trimiterea automată a formularului

    // Obțineți datele din formular
    var formData = {
        email: document.getElementById('email').value,
        location: document.getElementById('judet').value,
        password: document.getElementById('password').value,
        phoneNumber: document.getElementById('telNumber').value,
        program: document.getElementById('program').value,
        name: getParameterByName('name'),
    };

    console.log(formData)

    // Faceți o cerere POST către backend
    fetch('http://localhost:8080/centers', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    })
        .then(response => response.json())
        .then(data => {
            console.log('Succes:', data);
            // Aici puteți adăuga orice acțiuni suplimentare după ce a avut loc cu succes cererea POST
        })
        .catch((error) => {
            console.error('Eroare:', error);
        });
}