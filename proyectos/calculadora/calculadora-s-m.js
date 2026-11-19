let numero1 = null;
let operador = null;
let esperandoNumero = false;
let reiniciarAlDigitar = false;

const resultado = () => document.getElementById("resultado");
const operacion = () => document.getElementById("operacion");

function mostrarResultado(valor) {
    resultado().value = valor;
}

function limpiar() {
    numero1 = null;
    operador = null;
    esperandoNumero = false;
    reiniciarAlDigitar = false;
    operacion().textContent = "";
    resultado().value = "";
    resultado().placeholder = "0";
}

function borrarUltimo() {
    if (reiniciarAlDigitar) return;

    resultado().value = resultado().value.slice(0, -1);

    if (resultado().value === "") {
        resultado().placeholder = "0";
    }
}

function agregarNumero(digito) {
    let pantalla = resultado();

    if (reiniciarAlDigitar) {
        pantalla.value = "";
        pantalla.placeholder = "0";
        reiniciarAlDigitar = false;
    }

    if (esperandoNumero) {
        pantalla.value = "";
        esperandoNumero = false;
    }

    if (pantalla.value.length >= 15) return;

    if (digito === "." && pantalla.value.includes(".")) return;

    if (pantalla.value === "0" && digito !== ".") {
        pantalla.value = digito;
    } else {
        pantalla.value += digito;
    }
}

function cambiarSigno() {
    let pantalla = resultado();

    if (!pantalla.value) return;

    if (pantalla.value.startsWith("-")) {
        pantalla.value = pantalla.value.slice(1);
    } else {
        pantalla.value = "-" + pantalla.value;
    }
}

function porcentaje() {
    let valor = Number(resultado().value);

    if (!Number.isFinite(valor) || valor === 0) return;

    resultado().value = String(valor / 100);
}

function seleccionarOperacion(op) {
    let valorActual = resultado().value;

    if (valorActual === "" && numero1 === null) return;

    if (numero1 !== null && operador && !esperandoNumero) {
        calcular();
    } else if (valorActual !== "") {
        numero1 = Number(valorActual);
    }

    operador = op;
    esperandoNumero = true;
    reiniciarAlDigitar = false;

    operacion().textContent = formatearNumero(numero1) + " " + simboloOperacion(op);
}

function calcular() {
    if (numero1 === null || operador === null) return;

    let valorActual = resultado().value;

    if (valorActual === "") valorActual = String(numero1);

    let numero2 = Number(valorActual);

    if (!Number.isFinite(numero2)) {
        mostrarError("Error");
        return;
    }

    if (operador === "/" && numero2 === 0) {
        operacion().textContent = formatearNumero(numero1) + " ÷ 0 =";
        mostrarError("No se puede dividir por 0");
        return;
    }

    let resultadoOperacion;

    if (operador === "+") resultadoOperacion = numero1 + numero2;
    else if (operador === "-") resultadoOperacion = numero1 - numero2;
    else if (operador === "*") resultadoOperacion = numero1 * numero2;
    else if (operador === "/") resultadoOperacion = numero1 / numero2;

    if (!Number.isFinite(resultadoOperacion)) {
        mostrarError("Error");
        return;
    }

    operacion().textContent = formatearNumero(numero1) + " " + simboloOperacion(operador) + " " + formatearNumero(numero2) + " =";

    let valorFinal = Number(resultadoOperacion.toPrecision(12));
    mostrarResultado(formatearNumero(valorFinal));

    numero1 = valorFinal;
    operador = null;
    esperandoNumero = false;
    reiniciarAlDigitar = true;
}

function mostrarError(mensaje) {
    resultado().value = "";
    resultado().placeholder = mensaje;
    numero1 = null;
    operador = null;
    esperandoNumero = false;
    reiniciarAlDigitar = true;
}

function simboloOperacion(op) {
    if (op === "*") return "×";
    if (op === "/") return "÷";
    if (op === "-") return "−";
    return op;
}

function formatearNumero(valor) {
    if (!Number.isFinite(valor)) return "Error";

    return String(Number(Number(valor).toPrecision(12)));
}

document.addEventListener("keydown", function(evento) {
    if (/^[0-9]$/.test(evento.key)) {
        agregarNumero(evento.key);
    } else if (evento.key === "." || evento.key === ",") {
        agregarNumero(".");
    } else if (["+", "-", "*", "/"].includes(evento.key)) {
        seleccionarOperacion(evento.key);
    } else if (evento.key === "Enter" || evento.key === "=") {
        evento.preventDefault();
        calcular();
    } else if (evento.key === "Backspace") {
        borrarUltimo();
    } else if (evento.key === "Escape" || evento.key === "Delete") {
        limpiar();
    } else if (evento.key === "%") {
        porcentaje();
    }
});

window.calcular = calcular;
window.seleccionarOperacion = seleccionarOperacion;
window.agregarNumero = agregarNumero;
window.limpiar = limpiar;
window.borrarUltimo = borrarUltimo;
window.cambiarSigno = cambiarSigno;
window.porcentaje = porcentaje;
