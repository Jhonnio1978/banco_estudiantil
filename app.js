const supabaseUrl = 'https://fkqsdzwdzteacogjhkqm.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZrcXNkendkenRlYWNvZ2poa3FtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDExMzAwMDQsImV4cCI6MjA1NjcwNjAwNH0.iKGGMuh0WX939Kx95LmdZWqQM7u_GcSDjvEfiEn7NHA'
const supabase = supabase.createClient(supabaseUrl, supabaseKey)

// Función para registrar un usuario
async function registrarUsuario() {
    let nombre = document.getElementById("nombre").value;
    let telefono = document.getElementById("telefono").value;
    let contraseña = document.getElementById("contraseña").value;

    if (nombre === "" || telefono === "" || contraseña === "") {
        alert("Por favor, completa todos los campos.");
        return;
    }

    let { data, error } = await supabase
        .from('usuarios')
        .insert([{ nombre, telefono, contraseña, saldo: 100 }]);

    if (error) {
        alert("Error al registrar el usuario: " + error.message);
    } else {
        document.getElementById("resultadoRegistro").innerHTML = 
            `✅ ¡Registro exitoso!`;
        document.getElementById("nombre").value = "";
        document.getElementById("telefono").value = "";
        document.getElementById("contraseña").value = "";
    }
}

// Función para iniciar sesión
async function iniciarSesion() {
    let telefono = document.getElementById("loginCuenta").value;
    let contraseña = document.getElementById("loginContraseña").value;

    let { data: usuarios, error } = await supabase
        .from('usuarios')
        .select('*')
        .eq('telefono', telefono)
        .eq('contraseña', contraseña);

    if (error || usuarios.length === 0) {
        document.getElementById("resultadoLogin").innerHTML = "⚠️ Cuenta o contraseña incorrecta.";
    } else {
        localStorage.setItem("usuarioActivo", JSON.stringify(usuarios[0]));
        document.getElementById("resultadoLogin").innerHTML = `✅ ¡Bienvenido, ${usuarios[0].nombre}!`;
    }
}

// Función para verificar saldo
function verificarSaldo() {
    let usuarioActivo = JSON.parse(localStorage.getItem("usuarioActivo"));

    if (usuarioActivo) {
        document.getElementById("saldoCuenta").innerHTML = 
            `💰 Tu saldo actual es: <b>${usuarioActivo.saldo} USD</b>`;
    } else {
        document.getElementById("saldoCuenta").innerHTML = "⚠️ Debes iniciar sesión primero.";
    }
}

// Función para transferir dinero
async function transferirDinero() {
    let usuarioActivo = JSON.parse(localStorage.getItem("usuarioActivo"));
    let cuentaDestino = document.getElementById("cuentaDestino").value;
    let monto = parseFloat(document.getElementById("montoTransferencia").value);

    if (!usuarioActivo) {
        document.getElementById("resultadoTransferencia").innerHTML = "⚠️ Debes iniciar sesión.";
        return;
    }

    let { data: destinatario, error } = await supabase
        .from('usuarios')
        .select('*')
        .eq('telefono', cuentaDestino)
        .single();

    if (error || !destinatario) {
        document.getElementById("resultadoTransferencia").innerHTML = "⚠️ La cuenta destino no existe.";
        return;
    }

    if (usuarioActivo.saldo < monto) {
        document.getElementById("resultadoTransferencia").innerHTML = "⚠️ Saldo insuficiente.";
        return;
    }

    // Actualizar saldos
    let { error: errorUpdate1 } = await supabase
        .from('usuarios')
        .update({ saldo: usuarioActivo.saldo - monto })
        .eq('telefono', usuarioActivo.telefono);

    let { error: errorUpdate2 } = await supabase
        .from('usuarios')
        .update({ saldo: destinatario.saldo + monto })
        .eq('telefono', cuentaDestino);

    if (errorUpdate1 || errorUpdate2) {
        document.getElementById("resultadoTransferencia").innerHTML = "⚠️ Error en la transferencia.";
    } else {
        // Actualizar usuario activo en localStorage
        usuarioActivo.saldo -= monto;
        localStorage.setItem("usuarioActivo", JSON.stringify(usuarioActivo));
        document.getElementById("resultadoTransferencia").innerHTML = 
            `✅ Transferencia de ${monto} USD realizada a la cuenta ${cuentaDestino}`;
    }
}