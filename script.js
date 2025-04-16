// Aguardar até que o DOM esteja completamente carregado
document.addEventListener("DOMContentLoaded", function () {
  const signUpBtn = document.getElementById('signUpBtn');

  // Ao clicar no botão de "Sign Up"
  signUpBtn.addEventListener('click', function (e) {
      e.preventDefault(); // Prevenir o comportamento padrão (recarregar página)

      // Obter os valores dos campos
      const name = document.getElementById('name').value;
      const phone = document.getElementById('phone').value;
      const email = document.getElementById('signupEmail').value;
      
      // Verificar qual tipo de usuário foi selecionado
      const userType = document.querySelector('input[name="userType"]:checked');

      if (!name || !phone || !email || !userType) {
          alert("Por favor, preencha todos os campos e selecione um tipo de usuário.");
          return;
      }

      // Obter o valor do tipo de usuário
      const userTypeValue = userType.value;

      // Construir a URL para redirecionamento com parâmetros
      let redirectUrl = '';

      if (userTypeValue === 'studioOwner') {
          // Se for um proprietário de estúdio
          redirectUrl = `studioOwnerPage.html?name=${encodeURIComponent(name)}&phone=${encodeURIComponent(phone)}&email=${encodeURIComponent(email)}`;
      } else if (userTypeValue === 'newUser') {
          // Se for um novo usuário
          redirectUrl = `newUser.html?name=${encodeURIComponent(name)}&phone=${encodeURIComponent(phone)}&email=${encodeURIComponent(email)}`;
      }

      // Redirecionar para a página correspondente
      window.location.href = redirectUrl;
  });
});


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
  
      // Primeiro envia os dados para o backend
      fetch('/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(userData)
      })
      .then(response => response.json())
      .then(data => {
          alert(data.message);
          popup.style.display = "none";
  
          // Depois redireciona para a página correspondente com os dados na URL
          const queryParams = `?name=${encodeURIComponent(name)}&phone=${encodeURIComponent(phone)}&email=${encodeURIComponent(email)}`;
  
          if (userType === "studioOwner") {
              window.location.href = `studioOwnerPage.html${queryParams}`;
          } else if (userType === "newUser") {
              window.location.href = `new-user.html${queryParams}`;
          }
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
