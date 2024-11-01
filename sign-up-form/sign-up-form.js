// Funcție pentru a citi și procesa fișierul CSV
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
        var county = (parts[1] ? parts[1].trim().replace(/"/g, '') : '');

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
        var county = (parts[1] ? parts[1].trim().replace(/"/g, '') : '');
        var locality = (parts[0] ? parts[0].trim().replace(/"/g, '') : '');

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

// Funcție pentru a face vizibil/căscat câmpul pentru data la care ai donat ultima dată
// Funcție pentru a face vizibil/căscat câmpul pentru data la care ai donat ultima dată
function showLastDonationDate() {
    var radioDonationYes = document.getElementById("yes");
    var lastDonationDateDiv = document.getElementById("lastDonationDate");

    if (radioDonationYes.checked) { // Verificăm dacă "Yes" este selectat
        lastDonationDateDiv.style.display = "block";
    } else {
        lastDonationDateDiv.style.display = "none";
        // Dacă "No" este selectat, resetăm și valoarea din câmpul de dată
        document.getElementById("lastDonation").value = "";
    }
}

// Adăugăm un eveniment onchange pe radio button-ul "Yes"
document.getElementById("yes").addEventListener("change", showLastDonationDate);

// Adăugăm un eveniment onchange pe radio button-ul "No"
document.getElementById("no").addEventListener("change", showLastDonationDate);

// Inițializăm vizibilitatea câmpului în funcție de valoarea selectată inițial
showLastDonationDate();


// Funcție pentru a afișa mesajul de greutate
function showEligibilityMessage() {
    var radioNoKG = document.getElementById("no-kg");
    var kgMessage = document.getElementById("kgMessage");

    if (radioNoKG.checked) {
        kgMessage.style.display = "block";
    } else {
        kgMessage.style.display = "none";
    }
}

// Funcție pentru a ascunde mesajul de greutate
function hideEligibilityMessage() {
    var kgMessage = document.getElementById("kgMessage");
    kgMessage.style.display = "none";
}

// Inițializăm vizibilitatea mesajului în funcție de valoarea selectată inițial
hideEligibilityMessage();

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
var prenume = getParameterByName('prenume');
var email = getParameterByName('email');
var password = getParameterByName('password');
console.log(name,prenume,email,password)
// Fill in form fields with retrieved data
document.getElementById('lname').value = name;
document.getElementById('fname').value = prenume;
document.getElementById('email').value = email;
document.getElementById('password').value = password;

// Funcție pentru a face cererea POST către backend
function submitForm(event) {
    event.preventDefault(); // Împiedică trimiterea automată a formularului
    var adress = document.getElementById('localitate').value + ', ' + document.getElementById('judet').value;

    // Obțineți datele din formular
    var formData = {
        firstName: document.getElementById('fname').value, 
        lastName: document.getElementById('lname').value,
        county: adress,
        email: document.getElementById('email').value,
        password: document.getElementById('password').value,
        bloodType: document.getElementById('grupa').value,
        lastDonation: document.getElementById('lastDonation').value,
        status:true
    };

    console.log(formData)

    // Faceți o cerere POST către backend
    fetch('http://localhost:8080/donors', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    })
    .then(response => response.json())
    .then(data => {
        console.log('Succes:', formData);
        // Aici puteți adăuga orice acțiuni suplimentare după ce a avut loc cu succes cererea POST
    })
    .catch((error) => {
        console.error('Eroare:', error);
    });
}





