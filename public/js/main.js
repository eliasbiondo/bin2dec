let input = document.querySelector("#input-fieldset input");
let output = document.querySelector("#output-fieldset .input-block input");
let clipboard  = document.querySelector(".clipboard");

let calc = {
    mode: "binary_to_decimal",
    last_input: null,
    last_output: null,
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

                // Instancing the binary number how an array of integers (Eg. 1011 -> [1,0,1,1]). 
                let binary = Array.from(String(input.value), Number);

                // Reverting the array (Eg. [1,0,1,1] -> [1,1,0,1]) to facilitate the calc
                binary.reverse();

                // Instancing the decimal value
                let decimal = 0;

                // Going through the array, summing the decimal corresponding value
                binary.forEach( (number, index) => {
                    
                    // If current number is equals to one, sum their decimal corresponding to 'decimal' variable value
                    if (number == 1) {
                        decimal += Math.pow(2, index);
                    }

                })

                // Assinging the last output value how the calculated decimal
                calc.last_output = decimal;

                // Printing the result on screen
                output.value = decimal;

            break;
                
    
            case "decimal_to_binary":
    
            break;
    
        }

    } else if (!input.value && calc.last_input) {
        output.value = null;
    }

    return;
}

// Calling "calculte()" function in intervals of 250ms for auto calculate
setInterval(calculate, 250);


// Adding an event listener for copy to clipboard feature
clipboard.addEventListener("click", copyToClipboard);

// Implementing the copy to clipboard feature
function copyToClipboard() {
    output.select();
    document.execCommand("copy");
};