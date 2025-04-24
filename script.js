//--------------------------------- studioOwnerPage.html logic --------------------------------------------//
document.addEventListener("DOMContentLoaded", function () {
  // Check if current page is studioOwnerPage
  const isStudioOwnerPage = window.location.pathname.includes("studioOwnerPage");

  if (isStudioOwnerPage) {
    // Toggle logout popup when avatar is clicked
    const avatarImage = document.getElementById("avatarImage");
    const logoutPopup = document.getElementById("logoutPopup");

    if (avatarImage && logoutPopup) {
      avatarImage.addEventListener("click", () => {
        logoutPopup.classList.toggle("show");
      });
    }

    // Fetch user data based on email from URL
    const email = new URLSearchParams(window.location.search).get("email");
    const safeEmail = email.replace(/[^a-zA-Z0-9]/g, '_');

    if (email) {
      fetch(`/users/${safeEmail}`)
        .then(response => {
          if (!response.ok) throw new Error("User not found");
          return response.json();
        })
        .then(user => {
          document.getElementById('nameInput').value = user.name || '';
          document.getElementById('phoneInput').value = user.phone || '';
          document.getElementById('emailInput').value = user.email || '';
          document.getElementById('welcomeTitle').textContent = `Welcome, ${user.name}`;
          loadUserStudios(safeEmail); // Load studios for this user
        })
        .catch(error => {
          alert("Could not fetch user data.");
        });
    }

    // Enable edit mode for user info fields
    document.querySelectorAll('.edit-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const inputId = btn.getAttribute('data-target');
        const inputField = document.getElementById(inputId);
        const saveBtn = document.querySelector(`.save-btn[data-target="${inputId}"]`);
        inputField.removeAttribute('readonly');
        inputField.focus();
        saveBtn.style.display = 'inline-block';
      });
    });

    // Save updated user info
    document.querySelectorAll('.save-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const inputId = btn.getAttribute('data-target');
        const inputField = document.getElementById(inputId);
        inputField.setAttribute('readonly', true);
        btn.style.display = 'none';

        const name = document.getElementById('nameInput').value.trim();
        const phone = document.getElementById('phoneInput').value.trim();
        const email = document.getElementById('emailInput').value.trim();

        fetch('/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, phone, email, userType: "studioOwner" })
        })
          .then(response => response.json())
          .then(data => {
            document.getElementById("updateStatus").textContent = "Information updated successfully!";
          })
          .catch(error => {
            alert("Error updating user info.");
          });
      });
    });
  }
});

//--------------------------------- Studio popup open/close logic --------------------------------------------//
document.addEventListener('DOMContentLoaded', () => {
  const openBtn = document.querySelector('.studioBtn button');
  const studioContainer = document.querySelector('.studioContainer');
  const closeBtn = document.querySelector('.studioContainer .close');

  // Open studio popup
  if (openBtn && studioContainer) {
    openBtn.addEventListener('click', () => {
      studioContainer.style.display = 'flex';
      setTimeout(() => {
        studioContainer.classList.add('show');
      }, 10);
    });
  }

  // Close studio popup
  if (closeBtn && studioContainer) {
    closeBtn.addEventListener('click', () => {
      studioContainer.classList.remove('show');
      setTimeout(() => {
        studioContainer.style.display = 'none';
      }, 300);
    });
  }
});

//--------------------------------- Studio submission logic --------------------------------------------//
document.addEventListener('DOMContentLoaded', () => {
  const submitBtn = document.querySelector('.studioContainer .addStudio');
  const studioContainer = document.querySelector('.studioContainer');

  // Handle studio submission
  if (submitBtn && studioContainer) {
    submitBtn.addEventListener('click', () => {
      const studioName = document.querySelector('input[placeholder="Studio\'s name"]')?.value.trim();
      const address = document.querySelector('input[placeholder="Insert the address"]')?.value.trim();
      const area = document.querySelector('input[placeholder="Area (in square meters)"]')?.value.trim();
      const type = document.getElementById("studioType")?.value;
      const capacity = document.querySelector('input[placeholder*="accommodate"]')?.value.trim();
      const price = document.querySelector('input[placeholder*="price"]')?.value.trim();
      const parking = document.getElementById("parking")?.value;
      const publicTransport = document.getElementById("publicTransport")?.value;
      const rentalTerm = document.getElementById("rentalTerm")?.value;
      const email = new URLSearchParams(window.location.search).get("email");

      if (!studioName || !address || !area || !type || !capacity || !price || !parking || !publicTransport || !rentalTerm || !email) {
        alert("Please fill out all fields.");
        return;
      }

      const studio = {
        studioName, address, area, type, capacity,
        parking, publicTransport, rentalTerm, price,
        email
      };

      fetch('/add-studio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(studio)
      })
        .then(response => response.json())
        .then(data => {
          alert("Studio added successfully!");
          studioContainer.classList.remove('show');
          setTimeout(() => {
            studioContainer.style.display = 'none';
          }, 300);
          const safeEmail = email.replace(/[^a-zA-Z0-9]/g, '_');
          loadUserStudios(safeEmail);
        })
        .catch(error => {
          alert("Error adding studio.");
          console.error(error);
        });
    });
  }
});

//--------------------------------- Login / Sign Up Popup Toggle (home/index.html) --------------------------------------------//
document.addEventListener('DOMContentLoaded', () => {
  const userIcon = document.querySelector('.bxs-user-circle');
  const popup = document.querySelector('.popup');
  const closeBtn = document.querySelector('.popup .close');

  // Toggle login/signup popup
  if (userIcon && popup && closeBtn) {
    userIcon.addEventListener('click', () => {
      popup.style.display = 'flex';
      setTimeout(() => popup.classList.add('show'), 10);
    });

    closeBtn.addEventListener('click', () => {
      popup.classList.remove('show');
      setTimeout(() => popup.style.display = 'none', 300);
    });
  }
});
//-------------------------------login logic-------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
    const loginBtn = document.querySelector('.login-btn');
    const popup = document.querySelector('.popup');

    // Handle login and redirect to correct page
    if (loginBtn) {
        loginBtn.addEventListener('click', () => {
            const email = document.getElementById('loginEmail')?.value.trim();

            if (!email) {
                alert("Please enter your email.");
                return;
            }

            fetch(`/users/${encodeURIComponent(email)}`)
                .then(res => {
                    if (!res.ok) {
                        throw new Error('User not found.');
                    }
                    return res.json();
                })
                .then(data => {
                    // Save user data to localStorage
                    localStorage.setItem("loggedInUser", JSON.stringify({
                        name: data.name,
                        email: data.email,
                        phone: data.phone,
                        userType: data.userType
                    }));

                    // Log the welcome message
                    alert(`Welcome ${data.userType === "studioOwner" ? "Studio Owner" : "User"}: ${data.name}`);

                    // Hide the login popup
                    popup.classList.remove('show');
                    setTimeout(() => popup.style.display = 'none', 300);

                    // Prepare redirect URL with user data
                    const redirect = data.userType === "studioOwner" ? "studioOwnerPage.html" : "newUser.html";
                    const { name, phone, email } = data;

                    // Redirect with query parameters
                    window.location.href = `${redirect}?name=${encodeURIComponent(name)}&phone=${encodeURIComponent(phone)}&email=${encodeURIComponent(email)}`;
                })
                .catch(err => {
                    alert("Login failed: Account not found or server error.");
                    console.error(err);
                });
        });
    }
});





//--------------------------------- Signup logic (redirect after success) --------------------------------------------//
document.addEventListener('DOMContentLoaded', () => {
  const signUpBtn = document.getElementById('signUpBtn');
  const popup = document.querySelector('.popup');

  // Handle signup and redirect to correct page
  if (signUpBtn) {
    signUpBtn.addEventListener('click', () => {
      const name = document.getElementById("name")?.value.trim();
      const phone = document.getElementById("phone")?.value.trim();
      const email = document.getElementById("signupEmail")?.value.trim();
      const userType = document.querySelector('input[name="userType"]:checked')?.value;

      if (!name || !phone || !email || !userType) {
        alert("Please fill in all fields.");
        return;
      }

      const user = { name, phone, email, userType };

      fetch('/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
      })
        .then(res => res.json())
        .then(data => {
          alert(data.message);
          popup.classList.remove('show');
          setTimeout(() => popup.style.display = 'none', 300);
          const redirect = userType === "studioOwner" ? "studioOwnerPage.html" : "newUser.html";
          window.location.href = `${redirect}?name=${encodeURIComponent(name)}&phone=${encodeURIComponent(phone)}&email=${encodeURIComponent(email)}`;
        })
        .catch(err => {
          alert("Error during sign up.");
          console.error(err);
        });
    });
  }
});

//--------------------------------- Load and display studios --------------------------------------------//

function loadUserStudios(email) {
  const container = document.getElementById("userStudios");
  container.innerHTML = "";

  // Fetch studios for the user and render cards
  fetch(`/studios/${email}`)
    .then(res => res.json())
    .then(studios => {
      if (!studios.length) {
        container.innerHTML = "<p>No studios added yet.</p>";
        return;
      }
      
    })
    .catch(err => {
      container.innerHTML = "<p>Error loading studios.</p>";
      console.error(err);
    });
    

    
}

//display studios for newuser------
document.addEventListener('DOMContentLoaded', () => {
    fetch('/all-studios')
        .then(response => response.json())
        .then(studios => {
            const container = document.getElementById('studioList');
            container.innerHTML = '';

            studios.forEach(studio => {
                const studioDiv = document.createElement('div');
                studioDiv.className = 'studio-card';
                studioDiv.innerHTML = `
          <h3>${studio.studioName}</h3>
          <p><strong>Address:</strong> ${studio.address}</p>
          <p><strong>Area:</strong> ${studio.area} m²</p>
          <p><strong>Price:</strong> $${studio.price}</p>
          <p><strong>Type:</strong> ${studio.type}</p>
          <p><strong>Available:</strong> ${studio.available ? 'Yes' : 'No'}</p>
        `;
                container.appendChild(studioDiv);
            });
        })
        .catch(err => {
            console.error('Error loading studios:', err);
        });
});

document.addEventListener('DOMContentLoaded', () => {
  fetch('/all-studios')
    .then(response => response.json())
    .then(studios => {
      const container = document.getElementById('studioList');
      const searchInput = document.getElementById('studioSearch');

      function displayStudios(filteredStudios) {
        container.innerHTML = '';
        if (filteredStudios.length === 0) {
          container.innerHTML = '<p>No studios found.</p>';
          return;
        }
        filteredStudios.forEach(studio => {
          const studioDiv = document.createElement('div');
          studioDiv.className = 'studio-card';
          studioDiv.innerHTML = `
            <h3>${studio.studioName}</h3>
            <p><strong>Address:</strong> ${studio.address}</p>
            <p><strong>Area:</strong> ${studio.area} m²</p>
            <p><strong>Price:</strong> $${studio.price}</p>
            <p><strong>Type:</strong> ${studio.type}</p>
            <p><strong>Available:</strong> ${studio.available ? 'Yes' : 'No'}</p>
          `;
          container.appendChild(studioDiv);
        });
      }

      displayStudios(studios); // display all initially

      searchInput.addEventListener('input', () => {
        const searchTerm = searchInput.value.toLowerCase();
        const filtered = studios.filter(studio =>
          studio.studioName.toLowerCase().includes(searchTerm)
        );
        displayStudios(filtered);
      });
    })
    .catch(err => {
      console.error('Error loading studios:', err);
    });
});


//--------EDIT--------
document.addEventListener('DOMContentLoaded', () => {
    fetch('/all-studios')
        .then(res => res.json())
        .then(studios => {
            const container = document.getElementById('userStudios');
            container.innerHTML = '';

            studios.forEach(studio => {
                const studioDiv = document.createElement('div');
                studioDiv.className = 'studio-card';
                studioDiv.innerHTML = `
          <h3>${studio.studioName}</h3>
          <p><strong>Address:</strong> ${studio.address}</p>
          <p><strong>Area:</strong> ${studio.area} m²</p>
          <p><strong>Price:</strong> $${studio.price}</p>
          <p><strong>Type:</strong> ${studio.type}</p>
          <p><strong>Available:</strong> ${studio.available ? 'Yes' : 'No'}</p>
          <div class="studio-btns">
            <button class="edit-btn" data-filename="${studio.filename}" data-email="${studio.email}">Edit</button>
            <button class="delete-btn" data-filename="${studio.filename}" data-email="${studio.email}">Delete</button>
          </div>
        `;
                container.appendChild(studioDiv);
            });

            setupStudioButtons();
        });

});

function setupStudioButtons() {
    document.querySelectorAll('.delete-btn').forEach(button => {
        button.addEventListener('click', () => {
            const filename = button.dataset.filename;
            const email = button.dataset.email;

            if (!filename || !email) {
                console.error('Missing filename or email:', { filename, email });
                alert('Error: Missing filename or email. Cannot delete studio.');
                return;
            }

            fetch(`/delete-studio/${email}/${filename}`, {
                method: 'DELETE'
            })
                .then(res => res.json())
                .then(result => {
                    alert(result.message);
                    location.reload();
                })
                .catch(err => {
                    console.error('Delete failed:', err);
                    alert('An error occurred while deleting the studio.');
                });
        });
    });

   // });

    document.querySelectorAll('.edit-btn').forEach(button => {
        button.addEventListener('click', () => {
            const filename = button.dataset.filename;
            const email = button.dataset.email;
            
            const newName = prompt("Enter new studio name:");
            const newAddress = prompt("Enter new address:");

            if (newName && newAddress) {
                fetch(`/update-studio/${email}/${filename}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ studioName: newName, address: newAddress })
                })
                    .then(res => res.json())
                    .then(result => {
                        alert(result.message);
                        location.reload();
                    });
            }
        });
    });
}


