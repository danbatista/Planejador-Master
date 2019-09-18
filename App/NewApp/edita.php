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


$id = '1';

$resultado= $conexao->query("SELECT * FROM usuario WHERE id=$id") or
die(mysqli_errno($conexao));
if (count($resultado) == 1){
    $ler = $resultado->fetch_array();
    $nome = $ler['nome'];
    print 'Antigo nome: '.$nome;  
    
    $nome = "Daniel2";
    
    $conexao->query("UPDATE usuario SET nome='$nome' WHERE id=$id") or
    die(mysqli_errno($conexao));
    
    print 'Novo nome:' .$nome;
}

$nome = $resultado->fetch_assoc();
echo $nome['nome'];


?>
















?>