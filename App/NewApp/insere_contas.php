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
    
$nomeConta = $_POST['nomeconta'] ;
$contaPai  = $_POST['contapai'] ;
$ptEs  = $_POST['ptes'] ;
$ptDir = $_POST['ptdir'] ;
$acalcular = $_POST['acalcular'] ;
$opcao = $_POST['opcao'] ;
$tipoconta=$_POST['tipoconta'];
$ladoconta= $_POST['ladoconta'];
$total = 0 ;
$binario = 0 ;
$inddireta = 0 ;


$conexao->query("INSERT INTO conta(nomeconta, contapai, ptes, ptdir, acalcular, binario, inddireta, opcao, total,tipoconta,ladoconta) 
VALUES('$nomeConta','$contaPai','$ptEs','$ptDir','$acalcular','$binario','$inddireta','$opcao', '$total','$tipoconta','$ladoconta')") 
or
die(mysqli_errno($conexao));

print '<javascript>alert("Cadastro realizado com sucesso!");</javascript>';

}
?>
















?>