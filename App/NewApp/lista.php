<?php

// Insere os dados recebidos no banco:
$servidor = '127.0.0.1';
$usuario = 'root';
$senha = '';
$bd = 'app';

$conexao = mysqli_connect($servidor, $usuario, $senha, $bd);

session_start();
if(isset($_GET['login'])){ 
   
    $email = $_GET['email'] ;
    $senhauser= $_GET['senha'] ;

    $resultado= $conexao->query("SELECT * FROM usuario WHERE email='$email' and senha='$senhauser'"); 
    
    $user = $resultado->fetch_assoc();
    
    if($user !== null){
        
        header('Location: inicio.php');
        $_SESSION['id'] = $user['id'];
      
    }else{
        header('Location: login_erro.php');
        $_SESSION['id'] = $user['id'];
    }
    
}

//$resultado= $conexao->query("SELECT * FROM usuario") or
//die(mysqli_errno($conexao));

// $nome = $resultado->fetch_assoc();
  //  echo $nome['nome'];


?>
















?>