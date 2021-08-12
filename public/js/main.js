let input = document.querySelector("#input-fieldset input");
let input_label = document.querySelector("#input-fieldset label");

let output = document.querySelector("#output-fieldset .input-block input");
let output_label = document.querySelector("#output-fieldset label");

let clipboard  = document.querySelector(".clipboard");
let notifications = document.querySelector(".notifications");

let swap_btn = document.querySelector(".swap");

// Instancing the decimal and binary calc auxiliary variables 
let decimal;
let binary;

// Reseting values on load
input.value = null;
output.value = null;

// Instancing the calc object
let calc = {
    mode: "binary_to_decimal",
    last_input: null,
    last_output: null,
    notifications: 0,
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

                // Printing the result
                output.value = binary_arr.join('');

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
function swap() {

    switch(calc.mode) {
        case "binary_to_decimal":

            calc.mode = "decimal_to_binary";
            
            input_label.setAttribute("for","decimal");
            input_label.innerHTML = "Decimal";

            input.setAttribute("id","decimal");
            input.setAttribute("name","decimal");

            output_label.innerHTML = "Binary";
            
            input.value = calc.last_output;
            output.value = calc.last_input;

            calc.last_input = input.value;
            calc.last_output = output.value;
            

        break;

        case "decimal_to_binary":

            calc.mode = "binary_to_decimal";

            input_label.setAttribute("for","binary");
            input_label.innerHTML = "Binary";

            input.setAttribute("id","binary");
            input.setAttribute("name","binary");

            output_label.innerHTML = "Decimal";
            
            input.value = calc.last_output;
            output.value = calc.last_input;

            calc.last_input = input.value;
            calc.last_output = output.value;

        break;

    }


}

// Adding an event listener for copy to clipboard feature
clipboard.addEventListener("click", copyToClipboard);

// Implementing the copy to clipboard feature
async function copyToClipboard() {

    // Selecting the output
    output.select();

    // Copying the output value
    document.execCommand("copy");

    // Increasing by one the notifications quantity number
    calc.notifications++;

    // Assigning the current notification how the calc.notifications value
    let current_notifiction = calc.notifications;

    // Firing the notification
    notifications.innerHTML += `
    <div class="success-message-${current_notifiction}" style="width: 37rem; height: 7.2rem; margin-bottom: 3rem; animation: fade-out 5s ease-in-out forwards;">
        <div class="box" style="display: flex; justify-content: space-between; align-items: center; width: 37rem; height: 5.2rem; border-radius: 0.5rem; background: linear-gradient(90deg, #05A65B 0%, #88DE52 99.55%);">
            <span style="font-size: 2.4rem; font-weight: 400; margin: 0rem 2rem;">Copied to clipboard :)</span>
            <img style="margin: 0rem 2rem; cursor: pointer;" src="public/images/icons/close_message.svg" onclick="closeCopyToClipboardNotification(${current_notifiction})">
        </div>
        <div class="progress-bar" style="width: 37rem; height: 1rem; margin: 1rem 0rem; background-color: #443D63; border-radius: 0.5rem;">
            <div class="current-progress" style="width: 65%; height: 1rem; border-radius: 0.5rem; background: linear-gradient(0deg, #05A65B 0%, #88DE52 121.75%); animation: condense 5s ease-in-out forwards;"></div>
        </div>
    </div>`;

    // Waiting five seconds
    await sleep(5000);

    // Removing the notification
    document.querySelector(`.success-message-${current_notifiction}`).remove();

};

// Implementing close "copy to clipboard" notification feature
function closeCopyToClipboardNotification(notification_id) {
    document.querySelector(`.success-message-${notification_id}`).remove();
}