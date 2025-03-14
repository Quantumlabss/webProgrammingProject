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


document.addEventListener("DOMContentLoaded", () => {
    const popup = document.querySelector(".popup");
    const closeBtn = document.querySelector(".close");
    const loginBtn = document.querySelector(".login-btn");
    const signupBtn = document.querySelector(".signup-btn");
    const errorDisplay = document.createElement("p");
    errorDisplay.className = "error-message";
    document.querySelector(".popup-content").appendChild(errorDisplay);


    closeBtn.addEventListener("click", () => {
        popup.style.display = "none";
    });


    loginBtn.addEventListener("click", () => {
        const email = document.querySelector(".popup-content input[type='email']").value.trim();

        if (!validateEmail(email)) {
            showError("Please enter a valid email address for login.");
            return;
        }

        const savedAccount = getCookie("account");
        if (savedAccount && JSON.parse(savedAccount).email === email) {
            alert(`Login successful for email: ${email}`);
            popup.style.display = "none";
        } else {
            showError("Account not found. Please sign up.");
        }
    });

    
    signupBtn.addEventListener("click", () => {
        const name = document.querySelector(".popup-content input[placeholder='Name']").value.trim();
        const phone = document.querySelector(".popup-content input[placeholder='Phone number']").value.trim();
        const email = document.querySelectorAll(".popup-content input[type='email']")[1].value.trim();

        if (!name || !phone || !validateEmail(email)) {
            showError("Please fill in all fields with valid information.");
            return;
        }

        const accountData = JSON.stringify({ name, phone, email });
        setCookie("account", accountData, 7); 

        alert(`Signup successful for: ${name}`);
        popup.style.display = "none";
    });


    function showError(message) {
        errorDisplay.textContent = message;
        errorDisplay.style.color = "red";
    }

  
    function validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

 
    function setCookie(name, value, days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        document.cookie = `${name}=${value}; expires=${date.toUTCString()}; path=/`;
    }

    function getCookie(name) {
        const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
        return match ? match[2] : null;
    }
});

