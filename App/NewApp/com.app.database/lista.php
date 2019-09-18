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

$nome;
$email;
$senhauser;
$graduacao;

$resultado= $conexao->query("SELECT * FROM usuario") or
die(mysqli_errno($conexao));

 $nome = $resultado->fetch_assoc();
    echo $nome['nome'];


?>
















?>