document.getElementById("cadastro-form").addEventListener("submit", function(event) {
    event.preventDefault();

    const novoUsuario = document.getElementById("novo-usuario").value;
    const novaSenha = document.getElementById("nova-senha").value;

    // Verifica se já existe algum usuário registrado
    let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

    // Adiciona o novo usuário no array
    usuarios.push({ usuario: novoUsuario, senha: novaSenha });

    // Salva os usuários no localStorage
    localStorage.setItem("usuarios", JSON.stringify(usuarios));

    alert("Cadastro realizado com sucesso!");
    window.location.href = "login.html"; // Redireciona para a página de login
});
