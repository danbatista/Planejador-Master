<?php
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
            
     
    
?>