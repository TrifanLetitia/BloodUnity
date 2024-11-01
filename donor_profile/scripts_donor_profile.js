function editProfile() {
    var profile = document.getElementById("profile-info");
    profile.style.display = "none";
    var edit = document.getElementById("personal-details-edit");
    edit.style.display = "flex"
}

function menuToggle() {
    const toggleMenu = document.querySelector(".menu-profile");
    toggleMenu.classList.toggle("active");
}

function dropDownFunction() {
    document.getElementById("myDropdown").classList.toggle("show");
}

const currentDate = new Date().toISOString().split('T')[0];
document.getElementById("dateInput").setAttribute("max", currentDate)

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

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

let idUser = '';
var grupa = '';

document.addEventListener('DOMContentLoaded', function () {
    // Obținem detalii din Local Storage
    const donorDetailsString = localStorage.getItem('donorDetails');
    
    if (donorDetailsString) {
        const donorDetails = JSON.parse(donorDetailsString);
        console.log('Detalii donator preluate:', donorDetails);
        document.getElementById('prenume').innerText = donorDetails.firstName;
        document.getElementById('fname').innerText = donorDetails.firstName;
        document.getElementById('lname').innerText = donorDetails.lastName;
        document.getElementById('demail').innerText = donorDetails.email;
        document.getElementById('dcounty').innerText = donorDetails.county;
        document.getElementById('last_donation1').innerText = donorDetails.lastDonation;
        document.getElementById('donor_name').innerText = donorDetails.firstName
        idUser = donorDetails.id;
        grupa = donorDetails.bloodType;
        // Folosește detalii aici cum dorești
    }
});



/*
var name = getParameterByName('donor_lastname');
var prenume = getParameterByName('donor_firstname');
var email = getParameterByName('email');
var password = getParameterByName('password');
var date = getParameterByName('dateInput')
var judet = getParameterByName('judet')
var localitate = getParameterByName('localitate')
var kg = getParameterByName('kg')
console.log(name,prenume,email,password, date,judet, localitate, kg)

document.getElementById('prenume').innerText = prenume;
document.getElementById('lname').innerText = name;
document.getElementById('fname').innerText = prenume;
document.getElementById('demail').innerText = email;
document.getElementById('dcounty').innerText = judet
document.getElementById('dadress').innerText = localitate
document.getElementById('last_donation1').innerText = date
document.getElementById('dweight').innerText = kg
*/


// Funcție pentru a popula dropdown-ul cu județe
function populateCountyDropdown(csvData) {
    var lines = csvData.split("\n");
    var select = document.getElementById("donor_county");

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
    var select = document.getElementById("donor_adress");

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
document.getElementById("donor_county").addEventListener("change", function () {
    var selectedCounty = this.value;
    // Apelăm funcția pentru a citi și procesa fișierul CSV pentru localități
    readCSV('../Localities.csv', function (csvData) {
        populateLocalityDropdown(csvData, selectedCounty);
    });
});

document.addEventListener('DOMContentLoaded', function () {
    const firstNameInput = document.getElementById('donor_firstname');
    const lastNameInput = document.getElementById('donor_lastname');
    const emailInput = document.getElementById('donor_email');
    const passwordInput = document.getElementById('donor_password');
    const passwordMessage = document.getElementById('password_message');

    firstNameInput.addEventListener('input', validateFirstName);
    lastNameInput.addEventListener('input', validateLastName);
    emailInput.addEventListener('input', validateEmail);
    passwordInput.addEventListener('input', validatePassword);

    function validateFirstName() {
        const isValid = /^[A-Za-z]+$/.test(this.value);
        const icon = document.getElementById('IconWrapper-module--icon-fname')

        if (isValid) {
            this.classList.remove('invalid');
            this.classList.add('valid');

            icon.classList.remove('invalidIcon');
            icon.classList.add('validIcon');
        } else {
            this.classList.remove('valid');
            this.classList.add('invalid');

            icon.classList.remove('validIcon');
            icon.classList.add('invalidIcon');
        }
    }

    function validatePassword() {
        const isValid = this.value.length >= 8;
        const icon = document.getElementById('IconWrapper-module--icon-password')

        if (isValid) {
            this.classList.remove('invalid');
            this.classList.add('valid');

            icon.classList.remove('invalidIcon');
            icon.classList.add('validIcon');
            passwordMessage.textContent = ''
        } else {
            this.classList.remove('valid');
            this.classList.add('invalid');

            icon.classList.remove('validIcon');
            icon.classList.add('invalidIcon');
            passwordMessage.textContent = 'Parola trebuie să conțină cel puțin 8 caractere!';
        }
    }

function validateLastName() {
    const isValid = /^[A-Za-z]+$/.test(this.value);
    const icon = document.getElementById('IconWrapper-module--icon-lname')

    if (isValid) {
        this.classList.remove('invalid');
        this.classList.add('valid');

        icon.classList.remove('invalidIcon');
        icon.classList.add('validIcon');
    } else {
        this.classList.remove('valid');
        this.classList.add('invalid');

        icon.classList.remove('validIcon');
        icon.classList.add('invalidIcon');
    }
}

function validateEmail() {
    const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.value);
    const icon_email = document.getElementById('IconWrapper-module--icon-email')

    if (isValid) {
        this.classList.remove('invalid');
        this.classList.add('valid');

        icon_email.classList.remove('invalidIcon');
        icon_email.classList.add('validIcon');
    } else {
        this.classList.remove('valid');
        this.classList.add('invalid');

        icon_email.classList.remove('validIcon');
        icon_email.classList.add('invalidIcon');
    }
}
});

async function submitForm() {

    var adress = document.getElementById('donor_adress').value + ', ' + document.getElementById('donor_county').value;

    var formData = {
        id: idUser,
        firstName: document.getElementById('donor_firstname').value,
        lastName: document.getElementById('donor_lastname').value,
        county: adress,
        email: document.getElementById('donor_email').value,
        password: document.getElementById('donor_password').value,
        bloodType: grupa,
        lastDonation: document.getElementById('dateInput').value,
        status: true
    }

    try {
        const response = await fetch(`http://localhost:8080/donors/${idUser}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });


        const donorDetails = await response.json();
        if (!response.ok) {
            throw new Error('User update failed');
        }

        console.log('Donor updates:', donorDetails);
        localStorage.clear()

        localStorage.setItem('donorDetails', JSON.stringify(formData));
    } catch (error) {
        console.error('Error:', error.message);
    }
};