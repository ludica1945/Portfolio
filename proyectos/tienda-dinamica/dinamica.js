const productos = [
    {
        nombre:      "Lapiz",
        precio:      6767,
        descripcion: "Escribe piola.",
        imagen:      "lapiz.jfif"
    },
    {
        nombre:      "Hoja",
        precio:      123456000,
        descripcion: "Bien blanca.",
        imagen:      "hoja.jfif"
    },
    {
        nombre:      "Borrador",
        precio:      99999,
        descripcion: "Borra zarpado.",
        imagen:      "borrador.jfif"
    },
    {
        nombre:      "Pegamento",
        precio:      33333333,
        descripcion: "Pega más que Alberto.",
        imagen:      "pegamento.jfif"
    },
    {
        nombre:      "Lentes",
        precio:      7,
        descripcion: "RTX en la vida real bro.",
        imagen:      "lentes.jfif"
    },
    {
        nombre:      "Mouse Gamer",
        precio:      250000,
        descripcion: "Mouse no apto para noobs.",
        imagen:      "mousegamer.jfif"
    },
    {
        nombre:      "Rei Chikita",
        precio:      67676767,
        descripcion: "From Neon Genesis Evangelion.",
        imagen:      "rei.jfif"
    },
    {
        nombre:      "Asuka Chikita",
        precio:      99999900000,
        descripcion: "From Neon Genesis Evangelion.",
        imagen:      "asuka.jfif"
    }
];

const cuantasVeVisible = 4;
let posicion = 0;

function renderizarProductos() {
    let track = document.getElementById('carrusel-track');
    track.innerHTML = '';

    productos.forEach(function(producto, i) {
        let precioFormateado = producto.precio.toLocaleString('es-AR');

        let tarjeta = document.createElement('div');
        tarjeta.classList.add('producto-card');

        tarjeta.innerHTML = `
            <img src="${producto.imagen}" alt="${producto.nombre}">
            <div class="producto-info">
                <p class="producto-nombre">${producto.nombre}</p>
                <p class="producto-descripcion">${producto.descripcion}</p>
                <p class="producto-precio">$${precioFormateado}</p>
                <button class="btn-agregar" onclick="agregarAlCarrito(${i})">
                     Agregar al carrito
                </button>
            </div>
        `;

        track.appendChild(tarjeta);
    });

    renderizarIndicadores();
    actualizarFlechas();
}

function renderizarIndicadores() {
    let contenedor = document.getElementById('indicadores');
    contenedor.innerHTML = '';

    let totalPaginas = Math.ceil(productos.length / cuantasVeVisible);
    let maxPosicion = productos.length - cuantasVeVisible;
    let paginaActual = maxPosicion > 0 ? Math.round((posicion / maxPosicion) * (totalPaginas - 1)) : 0;

    for (let i = 0; i < totalPaginas; i++) {
        let punto = document.createElement('button');
        punto.classList.add('punto');

        if (i === paginaActual) {
            punto.classList.add('activo');
        }

        punto.onclick = function() {
            if (i === totalPaginas - 1) {
                posicion = maxPosicion > 0 ? maxPosicion : 0;
            } else {
                posicion = i * cuantasVeVisible;
            }
            aplicarDesplazamiento();
        };

        contenedor.appendChild(punto);
    }
}

function moverCarrusel(direccion) {
    posicion = posicion + (direccion * cuantasVeVisible);

    if (posicion < 0) {
        posicion = 0;
    }

    let maxPosicion = productos.length - cuantasVeVisible;
    if (posicion > maxPosicion) {
        posicion = maxPosicion;
    }

    aplicarDesplazamiento();
}

function aplicarDesplazamiento() {
    let track = document.getElementById('carrusel-track');

    let desplazamiento = posicion * (100 / cuantasVeVisible);
    track.style.transform = `translateX(calc(-${desplazamiento}% - ${posicion * 0.3}rem))`;

    actualizarFlechas();
    actualizarPuntos();
}

function actualizarFlechas() {
    let btnAnterior = document.getElementById('btn-anterior');
    let btnSiguiente = document.getElementById('btn-siguiente');

    btnAnterior.disabled = (posicion === 0);
    btnSiguiente.disabled = (posicion >= productos.length - cuantasVeVisible);
}

function actualizarPuntos() {
    let puntos = document.querySelectorAll('.punto');
    let totalPaginas = Math.ceil(productos.length / cuantasVeVisible);
    let maxPosicion = productos.length - cuantasVeVisible;
    let paginaActual = maxPosicion > 0 ? Math.round((posicion / maxPosicion) * (totalPaginas - 1)) : 0;

    puntos.forEach(function(punto, i) {
        if (i === paginaActual) {
            punto.classList.add('activo');
        } else {
            punto.classList.remove('activo');
        }
    });
}

let carrito = [];

function agregarAlCarrito(indiceProducto) {
    let producto = productos[indiceProducto];

    carrito.push({
        nombre: producto.nombre,
        precio: producto.precio
    });

    let span = document.getElementById('contador-carrito');
    span.textContent = carrito.length;

    let botonFlotante = document.getElementById('carrito-flotante');
    botonFlotante.style.display = 'block';

    botonFlotante.classList.remove('rebote');
    void botonFlotante.offsetWidth;
    botonFlotante.classList.add('rebote');

    setTimeout(function() {
        botonFlotante.classList.remove('rebote');
    }, 400);
}

function verCarrito() {
    if (carrito.length === 0) {
        alert('Tu carrito está vacío.');
        return;
    }

    let total = 0;
    let resumen = ' TU CARRITO:\n';
    resumen += '─────────────────────\n';

    carrito.forEach(function(item, i) {
        resumen += `${i + 1}. ${item.nombre} — $${item.precio.toLocaleString('es-AR')}\n`;
        total = total + item.precio;
    });

    resumen += '─────────────────────\n';
    resumen += `TOTAL: $${total.toLocaleString('es-AR')}`;

    alert(resumen);
}

function cambiarTema() {
    document.body.classList.toggle('oscuro');

    let boton = document.getElementById('btn-tema');

    if (document.body.classList.contains('oscuro')) {
        boton.textContent = 'Clarito';
    } else {
        boton.textContent = 'Negrito';
    }
}

document.addEventListener('DOMContentLoaded', function() {
    renderizarProductos();
});