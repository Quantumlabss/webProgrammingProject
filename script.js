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
