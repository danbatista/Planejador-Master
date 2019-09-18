<?php
$servidor = '127.0.0.1';
$usuario = 'root';
$senha = '';
$bd = 'app';
session_start();

$cnx = mysqli_connect($servidor, $usuario, $senha, $bd);

if (isset($_SESSION['id'])) {
    $ids = $_SESSION['id'];
}

if (isset($_POST['calc'])) {
    $val = $_POST['val'];
    $id = $_POST['id'];
}

$resultado = $cnx->query("SELECT * FROM conta WHERE nomeconta IN(SELECT contapai FROM conta WHERE iduser=" . $ids . " and id=" . $id . ")");
if ($resultado != null) {

    $res = $resultado->fetch_assoc();

    $nomeConta = $res['nomeconta'];
    $contaPai = $res['contapai'];
    $ptEs = $res['ptes'];
    $ptDir = $res['ptdir'];
    $acalcular = $res['acalcular'];
    // 1 é a direita e 2 é a esquerda (a perna em qual a pontuação está a calcular
    $opcao = $res['opcao'];
    // se é pro 1 ou entrerprise 2
    $tipoconta = $res['tipoconta'];

    if ($tipoconta == 1) {

        $novapt = $val / 50;
        $novapt = $novapt * 8;
        $binario = $acalcular * 0.5;
        $inddireta = $val * 0.1;
        $total = $binario + $inddireta;

        if ($opcao == 1) {

            $ptDir = $ptDir + $novapt;
            $acalcular = $acalcular - $novapt;

            $cnx->query("UPDATE conta SET ptdir =" . $ptDir . ",acalcular=" . $acalcular . ", binario=" . $binario . ", inddireta=" . $inddireta . ", opcao=" . $opcao . ", total=" . 
                $total . " WHERE nomeconta ='" . $nomeConta . "'") or die(mysqli_errno($cnx));

            // Inicia o processo de calculo retroativo

            $retro = $cnx->query("SELECT * FROM conta WHERE nomeconta='" . $contaPai . "'");
            $retroativo = $retro->fetch_assoc();
            echo "Entrou aqui 1 ";
            while ($retroativo['contapai'] != null) :
            echo "Entrou aqui 2";
            if($retroativo['acalcular'] > 0){
                $addBinarioPai = $retroativo['acalcular'] * 0.6;
                $addPtPai = $retroativo['ptdir'] + $novapt;
                $addAcalcularPai = $retroativo['acalcular'] - $novapt;
                
                
                $cnx->query("UPDATE conta SET ptdir =" . $addPtPai . ",acalcular=" . $addAcalcularPai . ", binario=" . $addBinarioPai . ", inddireta=" . 0 . ", opcao=" . $opcao . ", total=" . 
                    $addBinarioPai . " WHERE nomeconta ='" . $nomeConta . "'") or die(mysqli_errno($cnx));
            }
                $retro = $cnx->query("SELECT * FROM conta WHERE nomeconta='" . $contaPai . "'");
                $retroativo = $retro->fetch_assoc();
            endwhile
            ;
            // encerra o calculo retroativo;

            header('Location: plan.php');
        } else {

            $acalcular = $acalcular - $novapt;
            $ptEs = $ptEs + $novapt;

          $cnx->query("UPDATE conta SET ptes =" . $ptEs . ", acalcular=" . $acalcular . ", binario=" . $binario . ", inddireta=" . $inddireta . ", opcao=" . $opcao . ", total=" . $total . " WHERE nomeconta ='" . $nomeConta . "'") or die(mysqli_errno($cnx));

            // Inicia o processo de calculo retroativo
            
            $retro = $cnx->query("SELECT * FROM conta WHERE nomeconta='" . $contaPai . "'");
            $retroativo = $retro->fetch_assoc();
            
            echo "|_____Conta Pai antes de entrar|".$retroativo['contapai'];
            while ($retroativo['contapai'] != null || $retroativo['contapai'] != "") :
            if($retroativo['acalcular'] > 0){
                $addBinarioPai = $retroativo['acalcular'] * 0.6;
                $addPtPai = $retroativo['ptes'] + $novapt;
                $addAcalcularPai = $retroativo['acalcular'] - $novapt;
                
                
                $cnx->query("UPDATE conta SET ptes =" . $addPtPai . ",acalcular=" . $addAcalcularPai . ", binario=" . $addBinarioPai . ", inddireta=" . 0 . ", opcao=" . $opcao . ", total=" .
                    $addBinarioPai . " WHERE nomeconta ='" . $retroativo['nomeconta'] . "'") or die(mysqli_errno($cnx));
            }
            $retro = $cnx->query("SELECT contapai FROM conta WHERE nomeconta='" . $retroativo['contapai'] . "'");
            $retroativo = $retro->fetch_assoc();
            echo "|Conta pai aqui entro precisa mudar ->".$retroativo['contapai'];
            endwhile;
            // encerra o calculo retroativo;

           
          //  header('Location: plan.php');
        }
        // tipo de conta é  PRO 1  ou Enterprise 2
    } else if ($tipoconta == 2) {

        $novapt = $val / 50;
        $novapt = $novapt * 8;
        $binario = $acalcular * 0.6;
        $inddireta = $val * 0.1;
        $total = $binario + $inddireta;

         // Opção é em qual lado da perna a pontuação está sobrando esquerda 2 ou direita 1
        if ($opcao == 1) {

            $ptEs = $ptEs + $novapt;
            $acalcular = $acalcular - $novapt;

            $cnx->query("UPDATE conta SET ptes =" . $ptEs . ",acalcular=" . $acalcular . ", binario=" . $binario . ", inddireta=" . $inddireta . ", opcao=" . $opcao . ", total=" . $total . " WHERE nomeconta ='" . $nomeConta . "'") or die(mysqli_errno($cnx));

            // Inicia o processo de calculo retroativo
            
            $retro = $cnx->query("SELECT * FROM conta WHERE nomeconta='" . $contaPai . "'");
            $retroativo = $retro->fetch_assoc();
            
            while ($retroativo['contapai'] != null) :
            if($retroativo['acalcular'] > 0){
                $addBinarioPai = $retroativo['acalcular'] * 0.6;
                $addPtPai = $retroativo['ptes'] + $novapt;
                $addAcalcularPai = $retroativo['acalcular'] - $novapt;
                
                
                $cnx->query("UPDATE conta SET ptes =" . $addPtPai . ",acalcular=" . $addAcalcularPai . ", binario=" . $addBinarioPai . ", inddireta=" . 0 . ", opcao=" . $opcao . ", total=" .
                    $addBinarioPai . " WHERE nomeconta ='" . $nomeConta . "'") or die(mysqli_errno($cnx));
            }
            $retro = $cnx->query("SELECT * FROM conta WHERE nomeconta='" . $contaPai . "'");
            $retroativo = $retro->fetch_assoc();
            endwhile
            ;
            // encerra o calculo retroativo;
            
            header('Location: plan.php');
        } else {

            $acalcular = $acalcular - $novapt;
           
            $ptDir = $ptDir + $novapt;
            $cnx->query("UPDATE conta SET ptdir =" . $ptDir . ", acalcular=" . $acalcular . ", binario=" . $binario . ", inddireta=" . $inddireta . ", opcao=" . $opcao . ", total=" .
                $total . " WHERE nomeconta ='" . $nomeConta . "'") or die(mysqli_errno($cnx));

            // Inicia o processo de calculo retroativo
            
            $retro = $cnx->query("SELECT * FROM conta WHERE nomeconta='" . $contaPai . "'");
            $retroativo = $retro->fetch_assoc();
           
         while ($retroativo['contapai'] != null) :
            
            echo "Entrou_____";
            
            if($retroativo['acalcular'] > 0){
                $addBinarioPai = $retroativo['acalcular'] * 0.6;
                $addPtPai = $retroativo['ptes'] + $novapt;
                $addAcalcularPai = $retroativo['acalcular'] - $novapt;
                
                echo "Entrou_____".$addBinarioPai;
                echo "_____".$addPtPai;
                echo "_____".$addAcalcularPai;
                
                $cnx->query("UPDATE conta SET ptes=" . $addPtPai . ",acalcular=" . $addAcalcularPai . ", binario=" . $addBinarioPai . ", inddireta=" . 0 . ", opcao=" . $opcao . ", total=" .
                    $addBinarioPai . " WHERE nomeconta ='" . $nomeConta . "'") or die(mysqli_errno($cnx));
            }
            $retro = $cnx->query("SELECT * FROM conta WHERE nomeconta='" . $contaPai . "'");
            $retroativo = $retro->fetch_assoc();
            endwhile
            ;
            
            // encerra o calculo retroativo;
         
            header('Location: plan.php');
        }
    }
} else {}

?>