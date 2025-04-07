//-----------------------------------------------------------------------------------------------------------------//
document.addEventListener("DOMContentLoaded", function () {
    const filterButtons = document.querySelectorAll('.icons span');
    const studios = document.querySelectorAll('.storeStudio');
    const storeTitle = document.querySelector('.storeTitle');  // Captura o h1 com a classe storeTitle
  
    filterButtons.forEach(button => {
      button.addEventListener('click', function () {
        const filterId = this.id;
        filterStudios(filterId);
        updateTitle(filterId);  // Atualiza o texto do título com base no filtro
      });
    });
  
    function filterStudios(filterId) {
      studios.forEach(studio => {
        if (studio.classList.contains(`storeStudio${capitalizeFirstLetter(filterId)}`) || filterId === 'all') {
          studio.style.display = 'block';
        } else {
          studio.style.display = 'none';
        }
      });
    }
  
    function updateTitle(filterId) {
      let titleText = 'Studios';  // Valor padrão para o título
  
      switch (filterId) {
        case 'art':
          titleText = 'Art Studios';
          break;
        case 'game':
          titleText = 'Gaming Studios';
          break;
        case 'msc':
          titleText = 'Music Studios';
          break;
        case 'rec':
          titleText = 'Recording Studios';
          break;
        case 'mask':
          titleText = 'Rehearsal Studios';
          break;
        case 'dmd':
          titleText = 'Premium Studios';
          break;
        case 'all':
          titleText = 'All Studios';
          break;
        default:
          titleText = 'Studios';  // Caso nenhum filtro seja aplicado
          break;
      }
  
      storeTitle.textContent = titleText;  // Atualiza o texto do título
    }
  
    function capitalizeFirstLetter(str) {
      return str.charAt(0).toUpperCase() + str.slice(1);
    }
  
    showAllStudios();  // Exibe todos os estúdios ao carregar a página
  
    function showAllStudios() {
      studios.forEach(studio => {
        studio.style.display = 'block';
      });
    }
  });
  
  



document.addEventListener("DOMContentLoaded", function () {
    
    const storeContainer = document.getElementById('storeContainer'); 
    const loginButton = document.querySelector('.login-btn'); 
    const signupButton = document.querySelector('.signup-btn'); 

    
    let isLoggedIn = false;

    // Função para mostrar a loja se o usuário está logado ou se clicou em Login/Sign Up
    function showStore() {
        if (isLoggedIn || (loginButton.clicked || signupButton.clicked)) {
            storeContainer.style.display = 'grid'; // Exibe a loja
        } else {
            storeContainer.style.display = 'none'; // Esconde a loja se não estiver logado
        }
    }

    loginButton.addEventListener('click', function () {
        isLoggedIn = true; 
        showStore(); 
    });

    signupButton.addEventListener('click', function () {
        isLoggedIn = true; 
        showStore(); 
    });

    showStore();
});

//-----------------------------------------------------------------------------------------------------------------//
document.addEventListener("DOMContentLoaded", function () {
    const popup = document.querySelector(".popup");
    const userIcon = document.querySelector(".bxs-user-circle");
    const closeBtn = document.querySelector(".close");

    if (!popup || !userIcon || !closeBtn) {
        return;
    }

    userIcon.addEventListener("click", function () {
        popup.style.display = "flex";
        setTimeout(() => popup.classList.add("show"), 10);
    });

    closeBtn.addEventListener("click", function () {
        popup.classList.remove("show");
        setTimeout(() => popup.style.display = "none", 300);
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const loginBtn = document.querySelector('.login-btn');
    const signupBtn = document.querySelector('.signup-btn');
    const errorDisplay = document.querySelector('.error-display');
    const popup = document.querySelector('.popup');

 
    document.querySelector('.bxs-user-circle').addEventListener('click', () => {
        popup.style.display = 'block';
    });

   
    document.querySelector('.close').addEventListener('click', () => {
        popup.style.display = 'none';
    });

    loginBtn.addEventListener('click', () => {
        const email = document.querySelector(".popup-content input[type='email']").value.trim();

        if (!validateEmail(email)) {
            showError("Please enter a valid email address for login.");
            return;
        }


        fetch(`/users/${email}.json`, { method: 'GET' })
            .then(response => {
                if (response.ok) {
                    alert(`Login successful for email: ${email}`);
                    popup.style.display = "none";
                } else {
                    showError("Account not found. Please sign up.");
                }
            })
            .catch(err => {
                showError("An error occurred while checking for the user.");
            });
    });

  
    signupBtn.addEventListener('click', () => {
        const name = document.querySelector(".popup-content input[placeholder='Name']").value.trim();
        const phone = document.querySelector(".popup-content input[placeholder='Phone number']").value.trim();
        const email = document.querySelectorAll(".popup-content input[type='email']")[1].value.trim();
        const userType = document.querySelector('input[name="userType"]:checked')?.value;

        if (!name || !phone || !validateEmail(email) || !userType) {
            showError("Please fill in all fields with valid information.");
            return;
        }

        
        const userData = { name, phone, email, userType };
        fetch('/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData)
        })
            .then(response => response.json())
            .then(data => {
                alert(data.message);
                popup.style.display = "none";
            })
            .catch(err => {
                showError("Error occurred during signup. Please try again.");
            });
    });

  
  

    
    function validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
});
