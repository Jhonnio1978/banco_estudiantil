document.getElementById("registerForm").addEventListener("submit", function(event) {
    event.preventDefault();

    let name = document.getElementById("name").value;
    let phone = document.getElementById("phone").value;
    let accountType = document.getElementById("accountType").value;
    let password = document.getElementById("password").value;

    if (name && phone && accountType && password) {
        let accountID = "ABE" + Math.floor(Math.random() * 1000000);
        let user = { id: accountID, name, phone, type: accountType, password, balance: 0 };

        let accounts = JSON.parse(localStorage.getItem("accounts")) || [];
        accounts.push(user);
        localStorage.setItem("accounts", JSON.stringify(accounts));

        document.getElementById("accountID").innerText = "Tu ID de cuenta es: " + accountID;
        document.getElementById("registerForm").reset();
    }
});

function verifyAccount() {
    let verifyID = document.getElementById("verifyID").value;
    let verifyPassword = document.getElementById("verifyPassword").value;
    let accounts = JSON.parse(localStorage.getItem("accounts")) || [];
    let account = accounts.find(acc => acc.id === verifyID && acc.password === verifyPassword);

    if (account) {
        document.getElementById("verificationResult").innerText = 
            `Cuenta encontrada: ${account.name} - ${account.type} - Saldo: $${account.balance}`;
    } else {
        document.getElementById("verificationResult").innerText = "Cuenta no encontrada o contraseña incorrecta.";
    }
}

function deposit() {
    let accountID = document.getElementById("accountIDTransaction").value;
    let password = document.getElementById("passwordTransaction").value;
    let amount = parseFloat(document.getElementById("amount").value);

    let accounts = JSON.parse(localStorage.getItem("accounts")) || [];
    let account = accounts.find(acc => acc.id === accountID && acc.password === password);

    if (account && amount > 0) {
        account.balance += amount;
        localStorage.setItem("accounts", JSON.stringify(accounts));
        alert(`Depósito exitoso. Nuevo saldo: $${account.balance}`);
    } else {
        alert("Datos incorrectos o monto inválido.");
    }
}

function withdraw() {
    let accountID = document.getElementById("accountIDTransaction").value;
    let password = document.getElementById("passwordTransaction").value;
    let amount = parseFloat(document.getElementById("amount").value);

    let accounts = JSON.parse(localStorage.getItem("accounts")) || [];
    let account = accounts.find(acc => acc.id === accountID && acc.password === password);

    if (account && amount > 0 && account.balance >= amount) {
        account.balance -= amount;
        localStorage.setItem("accounts", JSON.stringify(accounts));
        alert(`Retiro exitoso. Nuevo saldo: $${account.balance}`);
    } else {
        alert("Fondos insuficientes o datos incorrectos.");
    }
}

function transfer() {
    let senderID = document.getElementById("senderID").value;
    let senderPassword = document.getElementById("senderPassword").value;
    let receiverID = document.getElementById("receiverID").value;
    let amount = parseFloat(document.getElementById("transferAmount").value);

    let accounts = JSON.parse(localStorage.getItem("accounts")) || [];
    let sender = accounts.find(acc => acc.id === senderID && acc.password === senderPassword);
    let receiver = accounts.find(acc => acc.id === receiverID);

    if (sender && receiver && amount > 0 && sender.balance >= amount) {
        sender.balance -= amount;
        receiver.balance += amount;
        localStorage.setItem("accounts", JSON.stringify(accounts));
        alert(`Transferencia de $${amount} a ${receiver.id} exitosa.`);
    } else {
        alert("Error en la transferencia.");
    }
}
