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

let idUser = '';

document.addEventListener('DOMContentLoaded', function () {
    // Obținem detalii din Local Storage
    const centruDetailsString = localStorage.getItem('centruDetails');
    
    if (centruDetailsString) {

        const centruDetails = JSON.parse(centruDetailsString);
        console.log('Detalii centru preluate:', centruDetails);
        document.getElementById('d_lname').innerText = centruDetails.name
        document.getElementById('d_email').innerText = centruDetails.email;
        document.getElementById('d_county').innerText = centruDetails.location;
        document.getElementById('nr_tel').innerText = centruDetails.phoneNumber;
        document.getElementById('last_donation1').innerText = centruDetails.program;
        document.getElementById('nume_centru').innerText = centruDetails.name;
        document.getElementById('prenume').innerText = centruDetails.name;
        idUser = centruDetails.id;
    }
});



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
    const lastNameInput = document.getElementById('donor_lastname');
    const emailInput = document.getElementById('donor_email');
    const phone_number = document.getElementById('phone_number')
    const phoneMessage = document.getElementById('phone_message');
    const passwordInput = document.getElementById('donor_password');
    const passwordMessage = document.getElementById('password_message');

    lastNameInput.addEventListener('input', validateLastName);
    emailInput.addEventListener('input', validateEmail);
    phone_number.addEventListener('input', validateNumber);
    passwordInput.addEventListener('input', validatePassword);

    function validateLastName() {
        const isValid = /^[A-Za-z\s]+$/.test(this.value); // Allow spaces with \s
        const icon = document.getElementById('IconWrapper-module--icon-lname');
    
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

    function validateNumber() {
        const cleanPhoneNumber = this.value.replace(/\D/g, '');
        const icon = document.getElementById('IconWrapper-module--icon-phone')

        const isValid = /^\d{10}$/.test(cleanPhoneNumber);
      
        if (isValid) {
          this.classList.remove('invalid');
          this.classList.add('valid');
      
          icon.classList.remove('invalidIcon');
          icon.classList.add('validIcon');
          phoneMessage.textContent = ''
        } else {
          this.classList.remove('valid');
          this.classList.add('invalid');
      
          icon.classList.remove('validIcon');
          icon.classList.add('invalidIcon');
          phoneMessage.textContent = 'Numărul de telefon trebuie să conțină exact 10 cifre!'
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
        name : document.getElementById('donor_lastname').value,
        email: document.getElementById('donor_email').value,
        password: document.getElementById('donor_password').value,
        location: adress,
        phoneNumber: document.getElementById('phone_number').value,
        program: document.getElementById('dateInput').value
    }


    try {
        const response = await fetch(`http://localhost:8080/centers/${idUser}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        const centruDetails = await response.json();
        if (!response.ok) {
            throw new Error('User update failed');
        }
        localStorage.clear();

        localStorage.setItem('centruDetails', JSON.stringify(formData));

    } catch (error) {
        console.error('Error:', error.message);
    }
};