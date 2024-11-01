const signUpButton = document.getElementById('signUp');
const signInButton = document.getElementById('signIn');
const container = document.getElementById('container');

signUpButton.addEventListener('click', () => {
	container.classList.add("right-panel-active");
});

signInButton.addEventListener('click', () => {
	container.classList.remove("right-panel-active");
});

function validatePassword1() {
	var passwordField = document.getElementById("signupPassword");

	// Add your password validation logic here
	// For example, check if the password has a minimum length
	var isValid = passwordField.value.length >= 8;

	// Apply styles based on validation result
	if (isValid) {
		passwordField.classList.remove("invalid");
		passwordField.classList.add("valid");
		document.getElementById("password-validation-1").classList.remove("show")
		document.getElementById("password-validation-1").classList.add("hidden")
	} else {
		passwordField.classList.remove("valid");
		passwordField.classList.add("invalid");
		document.getElementById("password-validation-1").classList.remove("hidden")
		document.getElementById("password-validation-1").classList.add("show")
	}
}

function validatePassword2() {
	var passwordField = document.getElementById("signinPassword");

	// Add your password validation logic here
	// For example, check if the password has a minimum length
	var isValid = passwordField.value.length >= 8;

	// Apply styles based on validation result
	if (isValid) {
		passwordField.classList.remove("invalid");
		passwordField.classList.add("valid");
		document.getElementById("password-validation-2").classList.remove("show")
		document.getElementById("password-validation-2").classList.add("hidden")
	} else {
		passwordField.classList.remove("valid");
		passwordField.classList.add("invalid");
		document.getElementById("password-validation-2").classList.remove("hidden")
		document.getElementById("password-validation-2").classList.add("show")
	}
}

function showSignUpContainer() {
	document.getElementById("form-container-sign-in-container").style.display = 'none'
	document.getElementById("form-container-sign-up-container").style.display = 'block'
}

function showSignInContainer() {
	document.getElementById("form-container-sign-up-container").style.display = 'none'
	document.getElementById("form-container-sign-in-container").style.display = 'block'
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

var userType = getParameterByName('userType')
console.log(userType)


function signUp() {
	// Retrieve user input

		var name = document.getElementById('signupName').value;
		var email = document.getElementById('signupEmail').value;
		var password = document.getElementById('signupPassword').value;
		window.location.href = 'http://127.0.0.1:5500/pagina_creeare_cont_centru/index.html?name=' + encodeURIComponent(name) +
			'&email=' + encodeURIComponent(email) +
			'&password=' + encodeURIComponent(password);
	

	// Perform any necessary validation

	// Save the data (you may want to send it to a server)


	// Return false to prevent the form from submitting (we handle the redirection)
	return false;
}

async function signIn() {
    var email = document.getElementById('signinEmail').value;
    var password = document.getElementById('signinPassword').value;
    
        try {
            const response = await fetch('http://localhost:8080/centers/authenticate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            if (!response.ok) {
				document.getElementById('account-validation').style.display = 'block';
				document.getElementById('signinPassword').addEventListener('input', () => {
					document.getElementById('account-validation').style.display = 'none';;
				});
                throw new Error('Authentication failed');
            }

            const donorDetails = await response.json();
            console.log('Centru details:', donorDetails);

			// Stocăm detalii în Local Storage
			localStorage.setItem('centruDetails', JSON.stringify(donorDetails));
			const donorDetailsString = localStorage.getItem('centruDetails');
    
    		if (donorDetailsString) {
        		const donorDetails = JSON.parse(donorDetailsString);
        		console.log('Detalii centru preluate:', donorDetails);

    			}		
            // Redirect to the new URL for donors
            const donorProfileUrl = window.location.origin + '/center_profile/center_profile.html';
            window.location.href = donorProfileUrl;
        } catch (error) {
            console.error('Error:', error.message);}
}