var textarea = document.querySelector('textarea');

textarea.addEventListener('keydown', autosize);

function autosize() {
    var el = this;
    setTimeout(function () {
        el.style.cssText = 'height:auto; padding:0';
        // for box-sizing other than "content-box" use:
        // el.style.cssText = '-moz-box-sizing:content-box';
        el.style.cssText = 'height:' + el.scrollHeight + 'px';
    }, 0);
}

function menuToggle() {
    const toggleMenu = document.querySelector(".menu-profile");
    toggleMenu.classList.toggle("active");
}

function dropDownFunction() {
    document.getElementById("myDropdown").classList.toggle("show");
}

function appendBloodType(button) {
    // Check if the button is already selected
    var isSelected = button.classList.contains('selected');
    var lastButton = document.querySelector('.button.btn-5:last-child')
    if (lastButton.classList.contains('selected')) {
        clearSelection()
    }

    if (!isSelected) {
        if (isLastButton(button)) {
            console.log("last button")
            clearSelection()
        }
        // Clear previous selection
        //clearSelection();

        // Mark the button as selected
        button.classList.add('selected');

        // Create a new container div
        var newContainer = document.createElement("div");
        newContainer.classList.add("div-blood-type");

        // Create a new paragraph element
        var newParagraph = document.createElement("p");
        var buttonText = button.textContent;

        // Set some content for the new paragraph
        var paragraphContent = document.createTextNode(buttonText);

        // Append the content to the paragraph
        newParagraph.appendChild(paragraphContent);
        newParagraph.classList.add("b-type");

        // Append the paragraph to the container
        newContainer.appendChild(newParagraph);

        var deleteButton = document.createElement("span");
        deleteButton.innerHTML = "x";
        deleteButton.classList.add("delete-button-1");
        deleteButton.onclick = function () {
            // Call the deleteParagraph function when the delete button is clicked
            deleteParagraph(newContainer);
        };

        // Append the delete button to the container
        newContainer.appendChild(deleteButton);

        // Append the container to the output div
        document.getElementById("type-selected").appendChild(newContainer);
    }
}

function isLastButton(button) {
    var parent = button.parentElement;
    var lastButton = parent.lastElementChild;
    return button === lastButton;
}

function clearSelection() {
    // Remove the "selected" class from all blood type buttons
    var bloodTypeButtons = document.querySelectorAll('.button.btn-5');
    bloodTypeButtons.forEach(function (button) {
        button.classList.remove('selected');
    });

    // Remove previous blood type containers
    var bloodTypeContainers = document.querySelectorAll('.div-blood-type');
    bloodTypeContainers.forEach(function (container) {
        container.remove();
    });
}

function clearSelection2() {
    // Remove the "selected" class from all blood type buttons
    var bloodTypeButtons = document.querySelectorAll('.button.btn-6');
    bloodTypeButtons.forEach(function (button) {
        button.classList.remove('selected');
    });

    // Remove previous blood type containers
    var bloodTypeContainers = document.querySelectorAll('.divLocation');
    bloodTypeContainers.forEach(function (container) {
        container.remove();
    });
}

function deleteParagraph(paragraph) {
    // Remove the paragraph and clear the selection
    paragraph.remove();
}

function deleteParagraph2(paragraph) {
    paragraph.remove();
}


function appendType(button) {
    var isSelected = button.classList.contains('selected');

    if (!isSelected) {
        // Clear previous selection
        clearSelection2();

        // Mark the button as selected
        button.classList.add('selected');

        // Create a new container div
        var newContainer = document.createElement("div");
        newContainer.classList.add("divLocation");

        // Create a new paragraph element
        var newParagraph = document.createElement("p");
        var buttonText = button.textContent;

        // Set some content for the new paragraph
        var paragraphContent = document.createTextNode(buttonText);

        // Append the content to the paragraph
        newParagraph.appendChild(paragraphContent);
        newParagraph.classList.add("don-type");

        // Append the paragraph to the container
        newContainer.appendChild(newParagraph);

        var deleteButton = document.createElement("span");
        deleteButton.innerHTML = "x";
        deleteButton.classList.add("delete-button-2");
        deleteButton.onclick = function () {
            // Call the deleteParagraph function when the delete button is clicked
            deleteParagraph2(newContainer);
        };

        // Append the delete button to the container
        newContainer.appendChild(deleteButton);

        // Append the container to the output div
        document.getElementById("donation-type-selected").appendChild(newContainer);
    }
}

var modal = document.getElementById("myModal");

// Get the button that opens the modal
var btn = document.getElementById("saveButton");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];


// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
}


function saveAnnouncement() {
    // Get data from the frontend
    var announcementText = document.querySelector('.textarea').value; // Use class selector
    var selectedBloodTypes = Array.from(document.querySelectorAll('.b-type')).map(type => type.textContent);
    var selectedLocationType = Array.from(document.querySelectorAll('.don-type')).map(type => type.textContent)[0];
    console.log(selectedLocationType)
    console.log(announcementText)
    console.log(selectedBloodTypes)
    // Prepare data for the backend
    
    if (announcementText === '' || selectedBloodTypes.length === 0 || selectedLocationType === undefined) {
        alert("Adăugați o descriere, selectați grupa necesară/ locația la care se poate face donarea!")
        return
    }
    
    // Obțineți obiectul de la cheia 'centruData' din localStorage
    const centruData = JSON.parse(localStorage.getItem('centruDetails'));
    console.log(centruData)
    console.log(centruData.id)
    // Verifică dacă obiectul există și conține o proprietate 'id'
    const idCentru=centruData.id;
    console.log(idCentru)

    var announcementData = {
        transfusionCenterID:idCentru,
        description: announcementText,
        status: "True", 
        bloodType: selectedBloodTypes[0],

    };
    console.log(announcementData)
    // Make a POST request to the backend
    fetch('http://localhost:8080/announcements', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(announcementData),
    })
        .then(response => response.json())
        .then(data => {
            // Handle the response from the backend
            console.log('Success:', data);
            modal.style.display = "block";
    

            // Optionally, you can reset the form or provide additional feedback to the user
            resetForm();
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}

function resetForm() { console.log("form resetat") }