<?php


// Insere os dados recebidos no banco: 
$servidor = '127.0.0.1';
$usuario = 'root';
$senha = '1234';
$bd = 'app';

$conexao = mysqli_connect($servidor, $usuario, $senha, $bd);



if(mysqli_errno($conexao)){
    echo "Problema ao se conectar";
} else{
    echo "Conectado";
}

$nome = "daniel";
$email = "teste@daniel.com";
$senhauser = "1234";
$graduacao = "Ruby";

$conexao->query("INSERT INTO usuario(nome, email, senha,graduacao) VALUES('$nome','$email','$senhauser','$graduacao')") or
die(mysqli_errno($conexao));

?>
















?>