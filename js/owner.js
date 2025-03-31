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

        // Delete button functionality
        const deleteBtn = studioDiv.querySelector(".deleteStudio");
        deleteBtn.addEventListener("click", function () {
            studioDiv.remove(); // Remove studio card from the list
        });
    }
});
