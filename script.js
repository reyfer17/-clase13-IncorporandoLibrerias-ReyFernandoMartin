//declaracion de clases, métodos, objetos y arrays
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

const pochocloGrande = new Producto ("Pochoclo Grande", 1000, "dulce, en balde", 'images/pochocloGrande.jpg')
const pochocloMediano = new Producto ("Pochoclo Mediano", 800, "dulce, en caja", 'images/pochocloMediano.jpg')
const pochocloChico = new Producto ("Pochoclo Chico", 600, "dulce, en bolsita", 'images/pochocloChico.gif')
const gaseosaGrande = new Producto ("Gaseosa Grande", 500, "vaso x 950ml", 'images/gaseosaGrande.jpg')
const gaseosaChica = new Producto ("Gaseosa Chica", 400, "botella x 500ml", 'images/gaseosaChica.jpg')
const agua = new Producto ("Agua", 300, "botella x 500ml", 'images/agua.png')
const chocolate = new Producto ("Chocolate", 800, "con leche x 300g", 'images/chocolate.jpg')

const productos = [pochocloGrande, pochocloMediano, pochocloChico, gaseosaGrande, gaseosaChica, agua, chocolate]

const divProductos =document.getElementById("productos")
const divCarrito =document.getElementById("carritoHTML")
const divTotal =document.getElementById("total")
const divCantidadEnCarrito =document.getElementById("cantidadEnCarrito")
const botonVaciarCarrito = document.getElementById("botonVaciarCarrito")
let carrito = []
let pedido = []
let cantidad = 0
//preparación del localStorage
if(localStorage.getItem("pedido")){
    pedido =JSON.parse(localStorage.getItem("pedido"))
    carrito = structuredClone(pedido)
} else {localStorage.setItem("pedido", JSON.stringify(carrito))}

//recorro el array de productos para mostrarlo por HTML
productos.forEach ((producto, indice) => {
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
productos.forEach((producto,indice) =>{
    document.getElementById(`producto${indice}`).lastElementChild.lastElementChild.addEventListener("click",() =>{
        carrito.push(producto)
        localStorage.setItem("pedido", JSON.stringify(carrito))
        mostrarCarrito()
    })
})
//declaro funciones, en las cuales creo el HTML para el carrito
function mostrarCarrito (){
    mostrarCantidad()
    mostrarTituloCarrito()
    mostrarProductosAgregados()
    mostrarTotal()
}
function mostrarCantidad(){
    cantidad = carrito.length
    divCantidadEnCarrito.innerHTML = `
    <div>Total de productos en carrito: ${cantidad}</div>
    `
}
function mostrarTituloCarrito(){
    divCarrito.innerHTML =`
    <h2 id="tituloCarrito">Carrito de compras</h2>
    `
}
function mostrarProductosAgregados(){
    carrito.forEach ((elemento, indice) => {
        divCarrito.innerHTML += `
        <div class="card carrito" id="productoCarrito${indice}"
        style="width: 14rem;">
            <img src="${elemento.imagen}" class="card-img-top" alt="...">
            <div class="card-body">
                <h5 class="card-title">${elemento.nombre}</h5>         
                <h2 class="card-text">$${elemento.precio}</h2>
                <button class="btn btn-danger">Eliminar</button>
            </div>
        </div>
        `
    })
    carrito.forEach((producto,indice) =>{
        document.getElementById(`productoCarrito${indice}`).lastElementChild.lastElementChild.addEventListener("click",() =>{
            carrito.splice(indice,1)
            localStorage.setItem("pedido", JSON.stringify(carrito))
            mostrarCarrito()
        })
    })
}

function mostrarTotal(){
    let p = new Producto
    divTotal.innerHTML =`
    <div class="card" 
    style="width: 100%;">
        <div class="card-body total">
            <h5 class="card-title">TOTAL: $${p.totalizar(carrito)}</h5>
        </div>
    </div>
    `
}

//elimino toda la info del array y del localStorage y vuelvo a cero con la carga
botonVaciarCarrito.addEventListener("click",() =>{
    carrito.splice(0, carrito.length)
    localStorage.setItem("pedido", JSON.stringify(carrito))
    mostrarCarrito()
})

mostrarCarrito()