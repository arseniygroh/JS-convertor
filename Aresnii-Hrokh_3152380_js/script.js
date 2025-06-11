const tabButtons = document.querySelectorAll('.tabs__item'); // receiving an element 
const tabElements = document.querySelectorAll('.tab-content'); // receiving an element 
const submitBtn = document.querySelector('.--temperature__btn'); // receiving an element 
const currencyContainer = document.querySelector(".currency__container"); // receiving an element 
const tempContainer = document.querySelector(".temperature__container"); // receiving an element 
const distanceContainer = document.querySelector(".distance__container"); // receiving an element 
let output = document.createElement("p"); // creating "p" element for future insertion
const preloader = document.querySelector('.preloader'); // receiving an element 

preloader.addEventListener("animationend", (e) => { // after "fade-out" animation I hide preloader so that user could interact with a page
    if (e.animationName === 'fade-out') {
        preloader.style.display = 'none';
    }
})

tabButtons.forEach((button, index) => {
    button.addEventListener("click", (e) => {
        for (let i = 0; i < tabButtons.length; i++) { // here I am removing "active" class from every elment
            tabButtons[i].classList.remove("active");
        }
        e.target.classList.add("active"); // adding "active" class to element that was clicked
        tabElements.forEach((element) => element.classList.remove('show')); // removing "show" class from each tab element
        tabElements[index].classList.add("show"); // adding "show" class to corresponding tab element
    })
})
submitBtn.addEventListener('click', () => {
    const conversionTypeVal = document.querySelector('[name="temperatures1"]').value; // getting value from a "temperatures1" select element
    const userConversionTypeVal = document.querySelector('[name="temperatures2"]').value; // getting value from a "temperatures2" select element
    const userValue = parseFloat(document.getElementById("user-temperature").value); // getting value that user types
    output.classList.add("output"); // adding class to "p" element
    if (isNaN(userValue)) { // checking for valid input 
        output.innerHTML = "Invalid input try again";
    } else {
        // checks for a specific selection and applying appropriate function 
        if (conversionTypeVal === "celsious" && userConversionTypeVal === "fahrenheit") {
            output.innerHTML = `The result of conversion is <strong>${Math.round(celciusToFahrenheit(userValue) * 100) / 100}</strong>`
        } else if (conversionTypeVal === "celsious" && userConversionTypeVal === "kelvin") {
            output.innerHTML = `The result of conversion is <strong>${Math.round(celsiusToKelvin(userValue) * 100) / 100}</strong>`
        } else if (conversionTypeVal === "kelvin" && userConversionTypeVal === "celsious") {
            output.innerHTML = `The result of conversion is <strong>${Math.round(kelvinToCelsius(userValue) * 100) / 100}</strong>`
        } else if (conversionTypeVal === "kelvin" && userConversionTypeVal === "fahrenheit") {
            output.innerHTML = `The result of conversion is <strong>${Math.round(kelvinToFahrenheit(userValue) * 100) / 100}</strong>`
        } else if (conversionTypeVal === "fahrenheit" && userConversionTypeVal === "celsious") {
            output.innerHTML = `The result of conversion is <strong>${Math.round(fahrenheitToCelcius(userValue) * 100) / 100}</strong>`
        } else if (conversionTypeVal === "fahrenheit" && userConversionTypeVal === "kelvin") {
            output.innerHTML = `The result of conversion is <strong>${Math.round(fahrenheitToKelvin(userValue) * 100) / 100}</strong>`
        } else {
            output.innerHTML = `The result of conversion is <b>${userValue}</b>`
        }
    }

    let childrenArray = Array.from(tempContainer.children); // convering to an array 
    childrenArray.find((item) => { // find() finds first instance of an element that meets a condidtion, so it removes first "p" 
        if (item.tagName == "p") {
            item.remove();
        }
    })
    tempContainer.insertAdjacentElement('beforeend', output); // inserting a "p" element before tempContainer's closing tag
})



// convertion functions
function celciusToFahrenheit(celcius) {
    return celcius * (9 / 5) + 32;
}

function celsiusToKelvin(celsius) {
    return celsius + 273.15;
}

function kelvinToCelsius(kelvin) {
    return kelvin - 273.15;
}
function kelvinToFahrenheit(kelvin) {
    return ((kelvin - 273.15) * 9 / 5) + 32;
}

function fahrenheitToKelvin(fahrenheit) {
    return ((fahrenheit - 32) * 5 / 9) + 273.15;
}

function fahrenheitToCelcius(fahrenheit) {
    return (fahrenheit - 32) * 5 / 9;
}

// ============================================================================================

const currencyBtn = document.querySelector(".--currency__btn");
async function getCurrencyData() { // asynchronous function 
    try {
        // fetch() in an asynchronous operation, thats why I use await (it returns promise)
        const response = await fetch('https://api.freecurrencyapi.com/v1/latest?apikey=fca_live_bP8rQEmh0G5yPhihqKelLaOc1ZmVj7g8NE78Qk9q', {
            method: "GET",
        })
        const data = await response.json(); // converting response to JSON format
        return data.data; // return data
    } catch (e) {
        console.log(e);
    }
}

const currency1SelectElem = document.querySelector('[name="currency1"]');
const currencyImage = document.querySelector(".currency1-image");
const currencyImage2 = document.querySelector(".currency2-image");
const currency2SelectElem = document.querySelector('[name="currency2"]');
// this object is needed for dynamic image swapping, since keys in this object correspond to value attribut in option element
const currencyOptions = {
    'USD': 'images/usa-image.png',
    'EUR': 'images/eu-image.png',
    'CZK': 'images/czech-image.png',
    'PLN': 'images/poland-image.png'
}


currency1SelectElem.addEventListener("change", () => {
    const conversionTypeVal = document.querySelector('[name="currency1"]').value;
    // dynamicly changing src attribute 
    if (currencyOptions[conversionTypeVal]) {
        currencyImage.setAttribute('src', currencyOptions[conversionTypeVal]);
    }
})

currency2SelectElem.addEventListener("change", () => {
    const userConversionTypeVal = document.querySelector('[name="currency2"]').value;
     // dynamicly changing src attribute 
    if (currencyOptions[userConversionTypeVal]) {
        currencyImage2.setAttribute('src', currencyOptions[userConversionTypeVal]);
    }
})

currencyBtn.addEventListener("click", async () => { 
    const conversionTypeVal = document.querySelector('[name="currency1"]').value;
    const userConversionTypeVal = document.querySelector('[name="currency2"]').value;
    const userValue = document.getElementById("user-currency").value;
    const data = await getCurrencyData(); // since it returns promise I use await 
    let exchangeRate = data[userConversionTypeVal] / data[conversionTypeVal];
    output.classList.add("output");
    currencyContainer.insertAdjacentElement('beforeend', output);
    output.innerHTML = `The result of conversion is <strong>${Number((userValue * exchangeRate).toFixed(2))} ${userConversionTypeVal}</strong>`; // toFixed() rounds up to 2 digits after decimal point
    let childrenArray = Array.from(currencyContainer.children);
    childrenArray.find((item) => {
        if (item.tagName == "p") {
            item.remove();
        }
    })
})

// ============================================================================================


const metricInputs = document.querySelectorAll(".metric-input");
// iterating through each input 
metricInputs.forEach((input) => {
    input.addEventListener("input", (e) => {
        // getting id and values of selected input
        let inputValue = e.target.value;
        let inputId = e.target.id;
        // checking if the input isnt negative
        if (!inputValue.includes("-")) {
            if (inputId === "milimeters") {
                // (\.\d*?)0+$ looks for a decimal point followed by some digits, and then it checks if there are one or more trailing 0 digits at the end of the string and replace them with a first capture group
                document.getElementById("centimeters").value = Number((inputValue * 0.1).toString().replace(/(\.\d*?)0+$/, '$1'));
                document.getElementById("meters").value = Number((inputValue * 0.001).toString().replace(/(\.\d*?)0+$/, '$1'));
                document.getElementById("kilometers").value = Number((inputValue * 0.000001).toString().replace(/(\.\d*?)0+$/, '$1'));

            } else if (inputId === "centimeters") {
                document.getElementById("milimeters").value = Number((inputValue * 10).toString().replace(/(\.\d*?)0+$/, '$1'));
                document.getElementById("meters").value = Number((inputValue / 100).toString().replace(/(\.\d*?)0+$/, '$1'));
                document.getElementById("kilometers").value = Number((inputValue / 100000).toString().replace(/(\.\d*?)0+$/, '$1'));
            } else if (inputId === "meters") {
                document.getElementById("milimeters").value = Number((inputValue * 1000).toString().replace(/(\.\d*?)0+$/, '$1'));
                document.getElementById("centimeters").value = Number((inputValue * 100).toString().replace(/(\.\d*?)0+$/, '$1'));
                document.getElementById("kilometers").value = Number((inputValue * 0.001).toString().replace(/(\.\d*?)0+$/, '$1'));
            } else if (inputId === "kilometers") {
                document.getElementById("milimeters").value = Number((inputValue * 1000000).toString().replace(/(\.\d*?)0+$/, '$1'));
                document.getElementById("centimeters").value = Number((inputValue * 100000).toString().replace(/(\.\d*?)0+$/, '$1'));
                document.getElementById("meters").value = Number((inputValue * 1000).toString().replace(/(\.\d*?)0+$/, '$1'));
            }
        } else {
            output.classList.add("output");
            output.innerHTML = `Input can't be negative`;
            distanceContainer.insertAdjacentElement('beforeend', output);
            // removes error message after 2 seconds
            setTimeout(() => {
                output.remove();
            }, 2000)
        }
    })
})

