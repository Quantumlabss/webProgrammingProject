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


    signupBtn.addEventListener("click", () => {
        const name = document.querySelector(".popup-content input[placeholder='Name']").value.trim();
        const phone = document.querySelector(".popup-content input[placeholder='Phone number']").value.trim();
        const email = document.querySelectorAll(".popup-content input[type='email']")[1].value.trim();
        const userTypeElement = document.querySelector(".popup-content input[name='userType']:checked");

        if (!name || !phone || !validateEmail(email) || !userTypeElement) {
            showError("Please fill in all fields with valid information and select your user type.");
            return;
        }

        const accountData = {
            name,
            phone,
            email,
            userType: userTypeElement.value
        };

        // Send data to server
        fetch('/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(accountData)
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert(`Signup successful for: ${name} (${accountData.userType})`);
                    popup.style.display = "none";
                } else {
                    showError(data.message || "Signup failed.");
                }
            })
            .catch(error => {
                console.error('Error:', error);
                showError("An error occurred. Please try again.");
            });
    });

    loginBtn.addEventListener("click", () => {
        const email = document.querySelector(".popup-content input[type='email']").value.trim();

        if (!validateEmail(email)) {
            showError("Please enter a valid email address for login.");
            return;
        }

        fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email })
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert(`Login successful for ${data.user.name} (${data.user.userType})`);
                    popup.style.display = "none";
                } else {
                    showError(data.message || "Login failed.");
                }
            })
            .catch(error => {
                console.error('Error:', error);
                showError("An error occurred. Please try again.");
            });
    });

    function showError(message) {
        errorDisplay.textContent = message;
        errorDisplay.style.color = "red";
    }

    function validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }


