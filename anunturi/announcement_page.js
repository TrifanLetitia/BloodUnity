document.addEventListener('DOMContentLoaded', function () {
    const announcementContainer = document.getElementById('announcement-container');

    function buildCenterUrl(centerId) {
        const baseUrl = 'http://localhost:8080/centers/';
        return centerId ? baseUrl + centerId : null;
    }

    // Make a GET request to fetch announcements from the backend
    fetch('http://localhost:8080/announcements')  // Update the URL to your backend endpoint
        .then(response => response.json())
        .then(announcements => {
            console.log('Announcements:', announcements);

            announcements.forEach(announcement => {
                console.log('One announcement',announcement);

                const centerId = announcement.transfusionCenterID;
                console.log('Center ID:', centerId); 

                // Make a GET request to fetch details about the center using its ID
                const centerUrl = buildCenterUrl(centerId);
                
                if (centerUrl) {
                    fetch(centerUrl)
                        .then(response => response.json())
                        .then(centerData => {
                            const announcementElement = document.createElement('div');
                            announcementElement.className = 'announcement';
                            announcementElement.innerHTML = `
                                <strong>${centerData.name}</strong><br>
                                <strong>Blood Type:</strong> ${announcement.bloodType}<br>
                                <strong>Location:</strong> ${centerData.location}<br>
                                <strong>Description:</strong> ${announcement.description}
                            `;
                            announcementContainer.appendChild(announcementElement);
                        })
                        .catch(error => console.error('Error fetching center details:', error));
                } else {
                    console.error('Invalid centerId:', centerId);
                }
            });
        })
        .catch(error => console.error('Error fetching announcements:', error));
});