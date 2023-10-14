
document.addEventListener("DOMContentLoaded", function () {
    const carListingsContainer = document.getElementById("car-listings");
    const addCarButton = document.getElementById("add-car-button");
    const addCarModal = document.getElementById("add-car-modal");
    const closeAddCarModalButton = addCarModal.querySelector(".close");
    const addCarForm = document.getElementById("add-car-form");

    let cars = [];

    fetch('https://matrix-nj55.onrender.com/cars') 
    .then(response => {
        if (response.ok) {
            return response.json();
        } else {
            throw new Error('Failed to fetch car data.');
        }
    })
    .then(data => {
        cars = data; // Updating  the cars array with the fetched data
        renderCarListings(); // Render the car listings with the updated data
    })
    .catch(error => {
        console.error(error);
        alert('Failed to fetch car data. Please try again.');
    });


        // Function to render car listings
   function renderCarListings() {
    carListingsContainer.innerHTML = ""; // Clear existing listings
    cars.forEach(car => {
        const carElement = document.createElement("div");
        carElement.classList.add("car-listing");
        carElement.innerHTML = `
            <img src="${car.image}" alt="${car.name}">
            <h2>${car.name}</h2>
            <p>${car.Description}</p>
            <p><strong>Price: ${car.price}</strong></p>
            <button class="purchase-button" data-car-id="${car.id}">Purchase</button>
            <button class="delete-button" data-car-id="${car.id}">Delete</button>
            <button class="update-button" data-car-id="${car.id}">Update</button>

        `;
        carListingsContainer.appendChild(carElement);

        // Adding a click event listener for the "Purchase" button
        const purchaseButton = carElement.querySelector(".purchase-button");
        purchaseButton.addEventListener("click", () => {
            alert(`Purchase is being processed...`);
        });
    });
}



// Function to open the "Add Car" modal
function openAddCarModal() {
    addCarModal.style.display = "block";
}

// Function to close the "Add Car" modal
function closeAddCarModal() {
    addCarModal.style.display = "none";
    addCarForm.reset(); 
}


// Function to delete a car  
function deleteCarHttp(carId) {
    fetch(`http://localhost:3000/cars/${carId}`, {
        method: 'DELETE',
    })
    .then(response => {
        if (response.ok) {
            // Successful DELETE request
            return response.json();
        } else {
            // Handle the error if the request fails
            throw new Error('Failed to delete the car.');
        }
    })
    .then(data => {
        // Remove the car from the local array
        cars = cars.filter(car => car.id !== parseInt(carId));
        renderCarListings();
    })
    .catch(error => {
        console.error(error);
        alert('Failed to delete the car. Please try again.');
    });
}

// Event listener for the "Delete" button
carListingsContainer.addEventListener("click", (event) => {
    if (event.target.classList.contains("delete-button")) {
        const carId = event.target.getAttribute("data-car-id");
        deleteCarHttp(carId);
    }
});

   
// Function to add a new car to the database
    function addNewCar(newCar) {
    fetch('http://localhost:3000/cars', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(newCar),
  })
    .then(response => {
    if (response.ok) {
        // Successful POST request
        return response.json();
    } else {
        // Handle the error if the request fails
        throw new Error('Failed to add a new car.');
    }
   })
  .then(data => {
    cars.push(data);
    renderCarListings();
    closeAddCarModal();
   })
  .catch(error => {
    console.error(error);
    alert('Failed to add a new car. Please try again.');
  });
  }

// Function to update a car by its ID
function updateCarHttp(carId, updatedCar) {
    fetch(`http://localhost:3000/cars/${carId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedCar),
    })
    .then(response => {
        if (response.ok) {
            // Successful PUT request
            return response.json();
        } else {
            // Handle the error if the request fails
            throw new Error('Failed to update the car.');
        }
    })
    .then(data => {
        // Finding the index of the updated car in the local array
        const updatedIndex = cars.findIndex(car => car.id === parseInt(carId));
        if (updatedIndex !== -1) {
            cars[updatedIndex] = data;
            renderCarListings();
        }
        closeUpdateCarModal();
    })
    .catch(error => {
        console.error(error);
        alert('Failed to update the car. Please try again.');
    });
}


// Function to open the "Update Car" modal with pre-filled data
function openUpdateCarModal(car) {
    const updateCarModal = document.getElementById("update-car-modal");
    const closeUpdateCarModalButton = document.getElementById("close-update-car-modal");
    const updateCarForm = document.getElementById("update-car-form");

    const updateCarName = document.getElementById("update-car-name");
    const updateCarImage = document.getElementById("update-car-image");
    const updateCarDescription = document.getElementById("update-car-Description");
    const updateCarPrice = document.getElementById("update-car-price");

    updateCarName.value = car.name;
    updateCarImage.value = car.image;
    updateCarDescription.value = car.Description;
    updateCarPrice.value = car.price;

    updateCarModal.style.display = "block";

    // Event listener for the "Close" button in the modal
    closeUpdateCarModalButton.addEventListener("click", closeUpdateCarModal);

    // Event listener for the form submission to update the car
    updateCarForm.addEventListener("submit", function (event) {
        event.preventDefault();

        // Gather updated input values from the form
        const updatedName = updateCarName.value;
        const updatedImage = updateCarImage.value;
        const updatedDescription = updateCarDescription.value;
        const updatedPrice = updateCarPrice.value;

        // Create an updated car object
        const updatedCar = {
            name: updatedName,
            image: updatedImage,
            Description: updatedDescription,
            price: updatedPrice,
        };

        // Close the modal
        closeUpdateCarModal();

        // Calling the function to update the car on the server
        updateCarHttp(car.id, updatedCar);
    });
}

// Function to close the "Update Car" modal
function closeUpdateCarModal() {
    const updateCarModal = document.getElementById("update-car-modal");
    updateCarModal.style.display = "none";
}

// Event listener for the "Update" button
carListingsContainer.addEventListener("click", (event) => {
    if (event.target.classList.contains("update-button")) {
        const carId = event.target.getAttribute("data-car-id");
        const carToUpdate = cars.find(car => car.id === parseInt(carId));
        openUpdateCarModal(carToUpdate);
    }
});


// Event listener for the "Add New Car" button
addCarButton.addEventListener("click", openAddCarModal);

// Event listener for the "Close" button in the modal
closeAddCarModalButton.addEventListener("click", closeAddCarModal);

// Event listener for the form submission to add a new car
addCarForm.addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent the form from submitting normally

    // Gathering input values from the form
    const carName = document.getElementById("car-name").value;
    const carImage = document.getElementById("car-image").value;
    const carDescription = document.getElementById("car-description").value;
    const carPrice = document.getElementById("car-price").value;

    // Creating  a new car object
    const newCar = {
        id: cars.length + 1, 
        name: carName,
        image: carImage,
        Description: carDescription,
        price: carPrice,
    };

    addNewCar(newCar);
});

// Calling  the function to initially render car listings
renderCarListings();
});

