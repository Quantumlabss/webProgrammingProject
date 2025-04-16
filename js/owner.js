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
    }

    function validateEmail(email) {
        const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        return regex.test(email);
    }

    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(";").shift();
        return null;
    }

    function setCookie(name, value, days) {
        const expires = new Date();
        expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
        document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
    }
});

document.addEventListener("DOMContentLoaded", function () {
    const addStudioBtn = document.querySelector(".studioBtn button"); // "Add New Studio" button
    const studioContainer = document.querySelector(".studioContainer"); // Popup container
    const closeBtn = studioContainer.querySelector(".close"); // Close button
    const addStudioForm = document.querySelector(".addStudio"); // "Add Studio" button inside popup
    const studioList = document.querySelector(".studio-list"); // Container for new studios

    // Ensure studio-list exists; if not, create one
    if (!studioList) {
        const newStudioList = document.createElement("div");
        newStudioList.classList.add("studio-list");
        document.body.appendChild(newStudioList);
    }

    // Show the popup when clicking "Add New Studio"
    addStudioBtn.addEventListener("click", function () {
        studioContainer.style.display = "flex";
        setTimeout(() => studioContainer.classList.add("show"), 10);
    });

    // Hide the popup when clicking the close button
    closeBtn.addEventListener("click", function () {
        studioContainer.classList.remove("show");
        setTimeout(() => studioContainer.style.display = "none", 300);
    });

    // Add event listener for the "Add Studio" button
    addStudioForm.addEventListener("click", function () {
        addStudio();
    });

    function addStudio() {
        // Get input values
        const studioName = document.querySelector(".studioArea input[placeholder=\"Studio's name\"]").value.trim();
        const address = document.querySelector(".studioArea input[placeholder='Insert the address']").value.trim();
        const area = document.querySelector(".studioArea input[placeholder='Area (in square meters)']").value.trim();
        const type = document.querySelector(".studioArea input[placeholder='Type of studio']").value.trim();
        const capacity = document.querySelector(".studioArea input[placeholder='How many people can it accommodate?']").value.trim();
        const parking = document.getElementById("parking").value;
        const publicTransport = document.getElementById("publicTransport").value;
        const rentalTerm = document.getElementById("rentalTerm").value;
        const price = document.querySelector(".studioArea input[placeholder='Insert the price per rental term']").value.trim();

        // Validation: Ensure all fields are filled
        if (!studioName || !address || !area || !type || !capacity || !price || parking === "" || publicTransport === "" || rentalTerm === "") {
            alert("Please fill in all fields!");
            return;
        }

        // Create a new studio div
        const studioDiv = document.createElement("div");
        studioDiv.classList.add("studio-card");

        // Add studio details with delete button
        studioDiv.innerHTML = `
            <h3>${studioName}</h3>
            <p><strong>Address:</strong> ${address}</p>
            <p><strong>Area:</strong> ${area} sq. meters</p>
            <p><strong>Type:</strong> ${type}</p>
            <p><strong>Capacity:</strong> ${capacity} people</p>
            <p><strong>Parking:</strong> ${parking}</p>
            <p><strong>Public Transport:</strong> ${publicTransport}</p>
            <p><strong>Rental Term:</strong> ${rentalTerm}</p>
            <p><strong>Price:</strong> $${price} per ${rentalTerm}</p>
            <button class="deleteStudio">Delete</button>
        `;

        // Append the new studio card inside the studio-list container
        document.querySelector(".studio-list").appendChild(studioDiv);

        // Hide the popup after adding
        studioContainer.classList.remove("show");
        setTimeout(() => studioContainer.style.display = "none", 300);

        // Clear input fields after adding
        document.querySelectorAll(".studioArea input").forEach(input => input.value = "");

        // Send the studio data to the server to be saved
        const studioData = {
            studioName,
            address,
            area,
            type,
            capacity,
            parking,
            publicTransport,
            rentalTerm,
            price
        };

        // Send the studio data to the server to save it
        fetch("/add-studio", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(studioData)
        })
            .then(response => response.json())
            .then(data => {
                console.log("Studio saved:", data);
            })
            .catch(error => {
                console.error("Error saving studio:", error);
            });

        // Delete button functionality
        const deleteBtn = studioDiv.querySelector(".deleteStudio");
        deleteBtn.addEventListener("click", function () {
            studioDiv.remove(); // Remove studio card from the list
        });
    }
});
