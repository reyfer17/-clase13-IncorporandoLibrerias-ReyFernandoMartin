//declaracion de clases, métodos, objetos, constantes, variables y arrays
class Producto {
    constructor(nombre, precio, detalle, imagen){
        this.nombre = nombre
        this.precio = precio
        this.detalle = detalle
        this.imagen = imagen
    }
    totalizar(pedido){
        let totalPedido = 0
        pedido.forEach (elemento =>{
            totalPedido += elemento.precio ?? 1000 //control por si trae undefined o null, suma el valor maximo de los productos que hay, me aseguro de no perder plata
        })
        return totalPedido
    }
}

const divProductos =document.getElementById("productos")
const divCarrito =document.getElementById("carritoHTML")
const divTotal =document.getElementById("total")
const divCantidadEnCarrito =document.getElementById("cantidadEnCarrito")
const botonVaciarCarrito = document.getElementById("divVaciarCarrito")
const botonFinalizarCompra = document.getElementById("finalizarCompra")
let carrito = []
let pedido = []
let cantidad = 0
let total
//fetch llamando a un archivo json con productos para representar asincronia
fetch("./json/productos.json")
.then(res=>res.json())
.then(productos=>{
    //recorro el array para armar el HTML con los productos ofrecidos y luego recorro para identificar el boton Agregar en cada uno
        productos.forEach((producto, indice)=>{
            divProductos.innerHTML += `
            <div class="card productos"  id="producto${indice}" style="width: 14rem;">
                <img src="${producto.imagen}" class="card-img-top" alt="...">
                <div class="card-body">
                    <h5 class="card-title">${producto.nombre}</h5>
                    <p class="card-text">${producto.detalle}</p>
                    <h2 class="card-text">$${producto.precio}</h2>
                    <button class="btn btn-success">Agregar</button>
                </div>
            </div>
            `
        })
        productos.forEach((producto, indice)=>{
            document.getElementById(`producto${indice}`).lastElementChild.lastElementChild.addEventListener("click",() =>{
                carrito.push(producto)
                localStorage.setItem("pedido", JSON.stringify(carrito))
                toastifyCargar()
                mostrarCarrito()
            })
        })
})
//preparación del localStorage
if(localStorage.getItem("pedido")){
    pedido =JSON.parse(localStorage.getItem("pedido"))
    carrito = structuredClone(pedido)
} else {localStorage.setItem("pedido", JSON.stringify(carrito))}

//declaro funciones, en las cuales creo el HTML para el carrito e interactuo con este
function mostrarCarrito (){
    mostrarCantidad()
    mostrarTituloCarrito()
    mostrarProductosAgregados()
    mostrarTotal()
    mostrarBotonFinalizarCompra()
    mostrarVaciarCarrito()
}
function mostrarCantidad(){
    cantidad = carrito.length
    divCantidadEnCarrito.innerHTML = `
    <div class="card" id="celdaCantidad" style="width: 20rem;">Total de productos en carrito: ${cantidad}</div>
    `
}
function mostrarTituloCarrito(){
    if(cantidad>0){
        divCarrito.innerHTML =`
        <h2 id="tituloCarrito">Carrito de compras</h2>
        `
    } else (
        divCarrito.innerHTML =`
        <h2 id="tituloCarrito"></h2>
        `
    )
}
function mostrarProductosAgregados(){
    carrito.forEach ((elemento, indice) => {
        divCarrito.innerHTML += `
        <div class="card carrito" id="productoCarrito${indice}">
            <img src="${elemento.imagen}" class="card-img" alt="...">
            <h5 class="card-title carrito-title">${elemento.nombre}</h5> 
            <div class="card-body">               
                <h2 class="card-text carrito-text">$${elemento.precio}</h2>
                <button class="btn btn-danger botonTacho"><span class="material-symbols-outlined">
                delete
                </span></button>
            </div>
        </div>
        `
    })
    carrito.forEach((producto,indice) =>{
        document.getElementById(`productoCarrito${indice}`).lastElementChild.lastElementChild.addEventListener("click",() =>{
            carrito.splice(indice,1)
            localStorage.setItem("pedido", JSON.stringify(carrito))
            mostrarCarrito()
            toastifyEliminar()
        })
    })
}
function mostrarTotal(){
    let p = new Producto
    if(cantidad>0){
        divTotal.innerHTML =`
        <div class="card cuadroTotal" 
        style="width: 100%;">
            <div class="card-body">
                <h5 class="card-title total">TOTAL: $${p.totalizar(carrito)}</h5>
            </div>
        </div>
        `
    } else (
        divTotal.innerHTML =``
    )
    total=p.totalizar(carrito)
}
function mostrarBotonFinalizarCompra(){
    if(cantidad>0){
        botonFinalizarCompra.innerHTML = `
        <button id="botonFinalizarCompras"class="btn btn-primary">Finalizar compra</button>
        `
    } else (      
        botonFinalizarCompra.innerHTML = ``
    )
}
function vaciarCarrito(){
    carrito.splice(0, carrito.length)
    localStorage.setItem("pedido", JSON.stringify(carrito))
    mostrarCarrito()
}
function mostrarVaciarCarrito(){
    if (cantidad==0){
        botonVaciarCarrito.innerHTML=``
    } else(botonVaciarCarrito.innerHTML=`<button id="botonVaciarCarrito" class="btn btn-dark">VACIAR CARRITO</button>`)
}
//botones para vaciar el carrito y finalizar la compra
botonVaciarCarrito.addEventListener("click",() =>{
    vaciarCarrito()
})
botonFinalizarCompra.addEventListener("click",()=>{
    Swal.fire({
        title: '¿Desea confirmar la compra?',
        text: "El total es de $ " + total,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#04B431',
        cancelButtonColor: '#d33',
        confirmButtonText: '¡Comprar!',
        cancelButtonText: 'Seguir comprando'
      }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire(
                'Su compra se realizó con éxito',
                'Gracias por comprar en el Candy shop',
                'success'
            )
            vaciarCarrito()
        }
      })
})
//funciones para utilizar toastify al agregar y desagregar productos del carrito
function toastifyCargar(){
    Toastify({
        text: "PRODUCTO AGREGADO AL CARRITO",
        duration: 3000,
        destination: "https://github.com/apvarun/toastify-js",
        newWindow: true,
        close: true,
        gravity: "top", // `top` or `bottom`
        position: "right", // `left`, `center` or `right`
        stopOnFocus: true, // Prevents dismissing of toast on hover
        style: {
        background: "linear-gradient(to left, #11aaaa, #00ffff)",
        },
        onClick: function(){} // Callback after click
    }).showToast();
}
function toastifyEliminar(){
    Toastify({
        text: "PRODUCTO ELIMINADO DEL CARRITO",
        duration: 3000,
        destination: "https://github.com/apvarun/toastify-js",
        newWindow: true,
        close: true,
        gravity: "top", // `top` or `bottom`
        position: "right", // `left`, `center` or `right`
        stopOnFocus: true, // Prevents dismissing of toast on hover
        style: {
        background: "linear-gradient(to left, #000000, #ff0000)",
        },
        onClick: function(){} // Callback after click
    }).showToast();
}
//corro pantalla principal
mostrarCarrito()
