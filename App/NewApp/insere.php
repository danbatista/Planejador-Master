<?php


// Insere os dados recebidos no banco: 
$servidor = '127.0.0.1';
$usuario = 'root';
$senha = '';
$bd = 'app';

$conexao = mysqli_connect($servidor, $usuario, $senha, $bd);



if(mysqli_errno($conexao)){
    echo "Problema ao se conectar";
} else{
   
}
 
if(isset($_POST['salva'])){
    
$nome = $_POST['nome'] ;
$email = $_POST['email'] ;
$senhauser= $_POST['senha'] ;
$graduacao= $_POST['graduacao'] ;

$conexao->query("INSERT INTO usuario(nome, email, senha,graduacao) VALUES('$nome','$email','$senhauser','$graduacao')") or
die(mysqli_errno($conexao));

print '<javascript>alert("deu bom");</javascript>';

}
?>
















?>