let numero1 = "";
let operador = "";

function seleccionarOperacion(op) {
    let valorInput = document.getElementById("resultado").value;
    
    if (valorInput !== "") {
        numero1 = valorInput;
    }
    
    if (numero1 === "") return;
    
    operador = op;
    document.getElementById("operacion").textContent = numero1 + " " + operador;
    document.getElementById("resultado").value = "";
    document.getElementById("resultado").placeholder = "0";
}

function calcular() {
    let numero2 = document.getElementById("resultado").value;

    document.getElementById("operacion").textContent = numero1 + " " + operador + " " + numero2 + " =";

    let toggle = document.getElementById("toggle-suscripcion");
    if (toggle && toggle.checked) {
        document.getElementById("overlay-suscripcion").style.display = "flex";
        return;
    }

    let n1 = Number(numero1);
    let n2 = Number(numero2);
    let res = 0;

    if (operador === "+") res = n1 + n2;
    else if (operador === "-") res = n1 - n2;
    else if (operador === "*") res = n1 * n2;
    else if (operador === "/") {
        if (n2 === 0) {
            res = "No se puede dividir por 0";
        } else {
            res = n1 / n2;
        }
    }

    if (res === "Error") {
        document.getElementById("resultado").value = "";
        document.getElementById("resultado").placeholder = "Error";
        numero1 = "";
    } else {
        document.getElementById("resultado").value = Number(res.toFixed(10));
        numero1 = document.getElementById("resultado").value;
    }
    
    operador = "";
}