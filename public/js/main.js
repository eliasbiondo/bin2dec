let body = document.querySelector("body");
let calc_dom = document.querySelector("#calc");

let input = document.querySelector("#input-fieldset input");
let input_label = document.querySelector("#input-fieldset label");
let output = document.querySelector("#output-fieldset .input-block input");
let output_label = document.querySelector("#output-fieldset label");

let clipboard  = document.querySelector(".clipboard");

let notifications = document.querySelector(".notifications");

let save = document.querySelector(".save");

let swap_btn = document.querySelector(".swap");
let history_btn = document.querySelector(".history");

let history_tab = document.querySelector(".history-tab");
let saved_items = document.querySelector(".saved-items");
let close_history_btn = document.querySelector(".close-btn");

let cookies_alert;

// Instancing the decimal and binary calc auxiliary variables 
let decimal;
let binary;

// Reseting values on load
input.value = null;
output.value = null;

// Verifying the existence of saved items
localStorage.getItem("count_saved") ? null : localStorage.setItem("count_saved", 0);

// Verifying the existence of cookies preferences
localStorage.getItem("cookies") ? null : localStorage.setItem("cookies", false);

// Instancing the calc object
let calc = {
    mode: "binary_to_decimal",
    last_input: null,
    last_output: null,
    notifications: 0,
    count_saved: Number(localStorage.getItem("count_saved")),
    cookies: JSON.parse(localStorage.getItem("cookies")),
}

function isValidNumber(e) {

    switch(calc.mode) {

        case "binary_to_decimal":
            
            if (e.keyCode == 48 || e.keyCode == 49) {
                return true;
            }

            return false;

        case "decimal_to_binary":

            if (e.keyCode >=48 && e.keyCode <= 57) {
                return true;
            }
            
            return false;
        
    }

}

function calculate() {

    // Refresing input data for auto calculate
    input = document.querySelector("#input-fieldset input");

    // Checking if exists an input value and if it's diff from last input
    if(input.value && input.value != calc.last_input) {

        // Assigning last input value how current input vale
        calc.last_input = input.value;
        
        // Calculating
        switch(calc.mode) {

            case "binary_to_decimal":

                // Setting the binary number how an array of integers (Eg. 1011 -> [1,0,1,1]). 
                binary = Array.from(String(input.value), Number);

                // Reverting the array (Eg. [1,0,1,1] -> [1,1,0,1]) to facilitate the calc
                binary.reverse();

                // Instancing the decimal value
                decimal = 0;

                // Going through the array, summing the decimal corresponding value
                binary.forEach( (number, index) => {
                    
                    // If current number is equals to one, sum their decimal corresponding to 'decimal' variable value
                    if (number == 1) {
                        decimal += Math.pow(2, index);
                    }

                })

                // Assinging the last output value how the calculated decimal
                calc.last_output = decimal;

                // Printing the result
                output.value = decimal;

            break;
                
    
            case "decimal_to_binary":
                
                // Setting the decimal number how the input value
                decimal = input.value;

                // Instancing the binary array
                let binary_arr = [];

                // Instancing the decrease index
                let decrease_index;
                
                // Getting the binary inverted array
                do {

                    decrease_index = Math.floor(decimal/2);

                    if (decimal % 2 == 0) {
                        binary_arr.push(0);
                        decimal = decimal - decrease_index;
                    } else {
                        binary_arr.push(1);
                        decimal = decimal - decrease_index - 1;
                    }

                } while (decimal > 0);

                // Reversing the binary array to get the real binary number
                binary_arr.reverse();

                calc.last_output = binary_arr.join('');

                // Printing the result
                output.value = calc.last_output;

            break;
    
        }

    } else if (!input.value && calc.last_input) {
        output.value = null;
    }

    return;
}

// Calling "calculte()" function in intervals of 250ms for auto calculate
setInterval(calculate, 250);

// Implementing the sleep function
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

swap_btn.addEventListener("click", swap);

// Implementing the swap feature
async function swap() {

    switch(calc.mode) {
        case "binary_to_decimal":

            // Changing calc mode
            calc.mode = "decimal_to_binary";
            
            // Adding swipe effect class
            input_label.classList.add("fade-out");
            output_label.classList.add("fade-out");
            input.classList.add("input-fade-out");
            output.classList.add("output-fade-out");

            // Waiting 500ms
            await sleep(500);

            // Removing swipe effect class
            input_label.classList.remove("fade-out");
            output_label.classList.remove("fade-out");
            input.classList.remove("input-fade-out");
            output.classList.remove("output-fade-out");

            input_label.innerHTML = "Decimal";
            output_label.innerHTML = "Binary";

            input.value = calc.last_output;
            output.value = calc.last_input;

            calc.last_input = input.value;
            calc.last_output = output.value;

            input_label.setAttribute("for","decimal");
            input.setAttribute("id","decimal");
            input.setAttribute("name","decimal");

            // Adding swipe effect class
            input_label.classList.add("fade-in");
            output_label.classList.add("fade-in");

            // Waiting 500ms
            await sleep(500);

            // Removing swipe effect class
            input_label.classList.remove("fade-in");
            output_label.classList.remove("fade-in");

        break;

        case "decimal_to_binary":

            // Changing calc mode
            calc.mode = "binary_to_decimal";

            // Adding swipe effect class
            input_label.classList.add("fade-out");
            output_label.classList.add("fade-out");
            input.classList.add("input-fade-out");
            output.classList.add("output-fade-out");

            // Waiting 500ms
            await sleep(500);

            // Removing swipe effect class
            input_label.classList.remove("fade-out");
            output_label.classList.remove("fade-out");
            input.classList.remove("input-fade-out");
            output.classList.remove("output-fade-out");

            input_label.innerHTML = "Binary";
            output_label.innerHTML = "Decimal";

            input.value = calc.last_output;
            output.value = calc.last_input;

            calc.last_input = input.value;
            calc.last_output = output.value;

            input_label.setAttribute("for","binary");
            input.setAttribute("id","binary");
            input.setAttribute("name","binary");

            // Adding swipe effect class
            input_label.classList.add("fade-in");
            output_label.classList.add("fade-in");

            // Waiting 500ms
            await sleep(500);

            // Removing swipe effect class
            input_label.classList.remove("fade-in");
            output_label.classList.remove("fade-in");

        break;

    }

    return;


}

// Adding an event listener for copy to clipboard feature
clipboard.addEventListener("click", copyToClipboard);

// Implementing the copy to clipboard feature
async function copyToClipboard() {

    // Verifying if has no output value
    if(!output.value) {
        // Assigning the current notification how the calc.notifications value
        let current_notification = calc.notifications;

        // Increasing by one the notifications quantity number
        calc.notifications++;

        // Firing the notification
        notifications.innerHTML += `
        <div class="failure-message" id="failure-message-${current_notification}">
            <div class="box">
                <span>No value to copy!</span>
                <img src="public/images/icons/close_message.svg" onclick="closeNotification('#failure-message-',${current_notification})">
            </div>
            <div class="progress-bar">
                <div class="current-progress"></div>
            </div>
        </div>`;

        // Waiting four seconds
        await sleep(4000);

        // Capturing the current failure message
        let failure_message = document.querySelector(`#failure-message-${current_notification}`)

        // Adding animation class to it
        failure_message.classList.add("mobile-fly-out");
        failure_message.children[0].classList.add("mobile-fly-out");

        // Waiting one second
        await sleep(1000);

        // Removing the notification
        document.querySelector(`#failure-message-${current_notification}`).remove();
        
        return;
    }

    // Selecting the output
    output.select();

    // Copying the output value
    document.execCommand("copy");

    // Increasing by one the notifications quantity number
    calc.notifications++;

    // Assigning the current notification how the calc.notifications value
    let current_notification = calc.notifications;

    // Firing the notification
    notifications.innerHTML += `
    <div class="success-message" id="success-message-${current_notification}">
        <div class="box">
            <span>Copied to clipboard :)</span>
            <img src="public/images/icons/close_message.svg" onclick="closeNotification('#success-message-',${current_notification})">
        </div>
        <div class="progress-bar">
            <div class="current-progress"></div>
        </div>
    </div>`;

    // Waiting four seconds
    await sleep(4000);

    // Capturing the current failure message
    let success_message = document.querySelector(`#success-message-${current_notification}`)

    // Adding animation class to it
    success_message.classList.add("mobile-fly-out");
    success_message.children[0].classList.add("mobile-fly-out");

    // Waiting one second
    await sleep(1000);


    // Removing the notification
    document.querySelector(`#success-message-${current_notification}`).remove();

    return;

};

// Implementing "close notification" feature
function closeNotification(prefix, notification_id) {
    document.querySelector(`${prefix}${notification_id}`).remove();
    return;
}

// Adding an event listener for "save result" feature
save.addEventListener("click", saveResult);

// Implementing the "save result" feature
async function saveResult() {

    // Verifying if has no input value to save
    if (!input.value) {
        // Assigning the current notification how the calc.notifications value
        let current_notification = calc.notifications;

        // Firing the notification
        notifications.innerHTML += `
        <div class="failure-message" id="failure-message-${current_notification}">
            <div class="box large-box">
                <span>No value to save! Verify the input field.</span>
                <img src="public/images/icons/close_message.svg" onclick="closeNotification('#failure-message-',${current_notification})">
            </div>
            <div class="progress-bar">
                <div class="current-progress"></div>
            </div>
        </div>`;

        // Waiting four seconds
        await sleep(4000);

        // Capturing the current failure message
        let failure_message = document.querySelector(`#failure-message-${current_notification}`)

        // Adding animation class to it
        failure_message.classList.add("mobile-fly-out");
        failure_message.children[0].classList.add("mobile-fly-out");

        // Waiting one second
        await sleep(1000);

        // Removing the notification
        document.querySelector(`#failure-message-${current_notification}`).remove();
        
        return;
    }

    // Saving values from binary to decimal
    switch(calc.mode) {
        case "binary_to_decimal":
            localStorage.setItem(`saved-value-id-${calc.count_saved+1}`, `["${calc.last_input}","${calc.last_output}"]`);
        break;

        case "decimal_to_binary":
            localStorage.setItem(`saved-value-id-${calc.count_saved+1}`, `["${calc.last_output}","${calc.last_input}"]`);
        break;

    }

    // Increase saved values quantity by one
    calc.count_saved++

    // Saving the change on localStorage
    localStorage.setItem("count_saved",calc.count_saved);

    // Assigning the current notification how the calc.notifications value
    let current_notification = calc.notifications;

    // Firing the notification
    notifications.innerHTML += `
    <div class="success-message" id="success-message-${current_notification}">
        <div class="box large-box">
            <span>Value saved successfully! Check on history tab.</span>
            <img src="public/images/icons/close_message.svg" onclick="closeNotification('#success-message-',${current_notification})">
        </div>
        <div class="progress-bar">
            <div class="current-progress"></div>
        </div>
    </div>`;

    // Waiting four seconds
    await sleep(4000);

    // Capturing the current failure message
    let success_message = document.querySelector(`#success-message-${current_notification}`)

    // Adding animation class to it
    success_message.classList.add("mobile-fly-out");
    success_message.children[0].classList.add("mobile-fly-out");

    // Waiting one second
    await sleep(1000);

    // Removing the notification
    document.querySelector(`#success-message-${current_notification}`).remove();

    return;
}

// Adding an event listener for "history" feature
history_btn.addEventListener("click", openHistory);

// Implementing the "history" feature
function openHistory() {

    // Setting the body overflow style how hidden
    body.style.overflow = "hidden"

    // Setting the history_tab display style how flex
    history_tab.style.display = "flex";

    // Checking if have no items
    if(calc.count_saved == 0) {

        saved_items.innerHTML += `
        <div class="no-items-found">
            <span>No items found!</span>
        </div>
        `
        saved_items.style.height = "35rem";
        saved_items.style.alignItems = "center";

        return;
    }

    // Printing each item on the history tab
    for(let i = 1; i <= calc.count_saved; i++) {

        let arr = JSON.parse(localStorage.getItem(`saved-value-id-${i}`));

        saved_items.innerHTML += `
        <div class="item">
            <div class="vertical-bar"></div>
            <div class="data">
                <div class="binary">
                    <span class="title">Binary</span>
                    <span class="value">${arr[0]}</span>
                </div>
                <div class="decimal">
                    <span class="title">Decimal</span>
                    <span class="value">${arr[1]}</span>
                </div>
            </div>
        </div>
        `
    }

    return;
}

// Adding an event listener for "close history tab" feature
close_history_btn.addEventListener("click", closeHistory);

// Implementing the "close history tab" feature
async function closeHistory() {

    // Setting the body overflow style how visible
    body.style.overflow = "visible"

    // Adding the effect classes
    history_tab.classList.add("zoom-out");

    await sleep(740);

    // Removing the effect class
    history_tab.classList.remove("zoom-out");

    // Setting the history_tab display style how none
    history_tab.style.display = "none";

    // Getting all items
    let items = document.querySelectorAll(".item, .no-items-found");

    // Deleting all items
    items.forEach(item => {
        item.remove();
    })

    return;

}

// Implementing the "close cookies alert" feature if needed
if(!calc.cookies) {

    // Getting the "cookies_alert"
    cookies_alert = document.querySelector(".cookies-alert");

    // Adding an event listener for "close cookies alert" feature
    cookies_alert.children[1].addEventListener("click", closeCookiesAlert);

    // Implementing the "close cookies alert" feature 
    function closeCookiesAlert() {
        localStorage.setItem("cookies","true");
        cookies_alert.remove();
    }
    
} else {
    document.querySelector(".cookies-alert").remove();
}

