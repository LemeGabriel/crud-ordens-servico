document.getElementById('login-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Recupera a lista de usuários cadastrados
    const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

    // Verifica se o usuário e a senha coincidem com algum usuário cadastrado
    const usuarioEncontrado = usuarios.find(usuario => usuario.usuario === username && usuario.senha === password);

    if (usuarioEncontrado) {
        localStorage.setItem("usuarioLogado", "true");
        window.location.href = "index.html"; // Redireciona para a página principal
    } else {
        alert("Usuário ou senha incorretos!");
    }
});

