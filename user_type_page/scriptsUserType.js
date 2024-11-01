function centerType() {
  redirectToLogin('centru');
}

function userType() {
  redirectToLogin('donator');
}

function redirectToLogin(userType) {
  let newUrl;

  // Verifică tipul de utilizator și setează URL-ul corespunzător
  if (userType === 'centru') {
    newUrl = window.location.origin + '/login_page_centru/login-page-centru.html?#';
  } else if (userType === 'donator') {
    newUrl = window.location.origin + '/login_page/login.html?#';
  } else {
    // Dacă tipul de utilizator nu este recunoscut, poți să setezi un URL implicit sau să afișezi o eroare
    console.error('Tip de utilizator necunoscut');
    return;
  }

  // Redirectează către noul URL
  window.location.href = newUrl;
}