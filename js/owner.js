document.addEventListener("DOMContentLoaded", function () {
    const addStudioBtn = document.querySelector(".studioBtn button");
    const studioContainer = document.querySelector(".studioContainer");
    const closeBtn = studioContainer.querySelector(".close");
    const addStudioFormBtn = document.querySelector(".addStudio");

    let editingStudio = null;

    addStudioBtn.addEventListener("click", function () {
        editingStudio = null;
        studioContainer.style.display = "flex";
        setTimeout(() => studioContainer.classList.add("show"), 10);
        clearForm();
        addStudioFormBtn.textContent = "Add Studio";
    });

    closeBtn.addEventListener("click", function () {
        studioContainer.classList.remove("show");
        setTimeout(() => studioContainer.style.display = "none", 300);
    });

    addStudioFormBtn.addEventListener("click", function () {
        const studioData = getFormData();
        if (!validateFormData(studioData)) {
            alert("Please fill in all fields!");
            return;
        }

        if (editingStudio) {
            updateStudioCard(editingStudio, studioData);
            editingStudio = null;
            addStudioFormBtn.textContent = "Add Studio";
        } else {
            const card = createStudioCard(studioData);
            document.querySelector(".studio-list").appendChild(card);
        }

        studioContainer.classList.remove("show");
        setTimeout(() => studioContainer.style.display = "none", 300);
        clearForm();
    });

    function createStudioCard(data) {
        const div = document.createElement("div");
        div.className = "studio-card";
        div.innerHTML = buildCardHTML(data);

        const deleteBtn = div.querySelector(".deleteStudio");
        deleteBtn.addEventListener("click", () => div.remove());

        const updateBtn = div.querySelector(".update-button");
        updateBtn.addEventListener("click", () => {
            editingStudio = div;
            fillFormWithData(data);
            studioContainer.style.display = "flex";
            setTimeout(() => studioContainer.classList.add("show"), 10);
            addStudioFormBtn.textContent = "Update Studio";
        });

        return div;
    }

    function updateStudioCard(card, data) {
        card.innerHTML = buildCardHTML(data);

        card.querySelector(".deleteStudio").addEventListener("click", () => card.remove());

        card.querySelector(".update-button").addEventListener("click", () => {
            editingStudio = card;
            fillFormWithData(data);
            studioContainer.style.display = "flex";
            setTimeout(() => studioContainer.classList.add("show"), 10);
            addStudioFormBtn.textContent = "Update Studio";
        });
    }

    function buildCardHTML(data) {
        return `
            <h3>${data.studioName}</h3>
            <p><strong>Address:</strong> ${data.address}</p>
            <p><strong>Area:</strong> ${data.area} sq. meters</p>
            <p><strong>Type:</strong> ${data.type}</p>
            <p><strong>Capacity:</strong> ${data.capacity} people</p>
            <p><strong>Parking:</strong> ${data.parking}</p>
            <p><strong>Public Transport:</strong> ${data.publicTransport}</p>
            <p><strong>Is it available to rent?:</strong> ${data.rent}</p>
            <p><strong>Rental Term:</strong> ${data.rentalTerm}</p>
            <p><strong>Price:</strong> $${data.price} per ${data.rentalTerm}</p>
            <button class="deleteStudio">Delete</button>
            <button class="update-button">Update</button>
        `;
    }

    function getFormData() {
        return {
            studioName: document.querySelector(".studioArea input[placeholder=\"Studio's name\"]").value.trim(),
            address: document.querySelector(".studioArea input[placeholder='Insert the address']").value.trim(),
            area: document.querySelector(".studioArea input[placeholder='Area (in square meters)']").value.trim(),
            type: document.querySelector(".studioArea input[placeholder='Type of studio']").value.trim(),
            capacity: document.querySelector(".studioArea input[placeholder='How many people can it accommodate?']").value.trim(),
            parking: document.getElementById("parking").value,
            publicTransport: document.getElementById("publicTransport").value,
            rent: document.getElementById("rent").value,
            rentalTerm: document.getElementById("rentalTerm").value,
            price: document.querySelector(".studioArea input[placeholder='Insert the price per rental term']").value.trim()
        };
    }

    function validateFormData(data) {
        return Object.values(data).every(val => val !== "");
    }

    function fillFormWithData(data) {
        document.querySelector(".studioArea input[placeholder=\"Studio's name\"]").value = data.studioName;
        document.querySelector(".studioArea input[placeholder='Insert the address']").value = data.address;
        document.querySelector(".studioArea input[placeholder='Area (in square meters)']").value = data.area;
        document.querySelector(".studioArea input[placeholder='Type of studio']").value = data.type;
        document.querySelector(".studioArea input[placeholder='How many people can it accommodate?']").value = data.capacity;
        document.getElementById("parking").value = data.parking;
        document.getElementById("publicTransport").value = data.publicTransport;
        document.getElementById("rent").value = data.rent;
        document.getElementById("rentalTerm").value = data.rentalTerm;
        document.querySelector(".studioArea input[placeholder='Insert the price per rental term']").value = data.price;
    }

    function clearForm() {
        document.querySelectorAll(".studioArea input").forEach(input => input.value = "");
        document.getElementById("parking").value = "";
        document.getElementById("publicTransport").value = "";
        document.getElementById("rent").value = "";
        document.getElementById("rentalTerm").value = "";
    }

    if (!document.querySelector(".studio-list")) {
        const list = document.createElement("div");
        list.className = "studio-list";
        document.body.appendChild(list);
    }
});
