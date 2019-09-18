
<!DOCTYPE html>
<html lang="pt_BR">

<head>

  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
  <meta name="description" content="">
  <meta name="author" content="">

  <title>Master</title>

  <!-- Bootstrap core CSS -->
  <link href="css/bootstrap.min.css" rel="stylesheet">

</head>

<body>
<div style="display: none;"><?php require_once 'insere_contas.php'; ?></div>
 

  <!-- Page Content -->
  <div class="container">
    <div class="row">
      <div class="col-lg-12 text-center">
        <h1 class="mt-5">Bem vindo ao planejador Master</h1>
        <p class="lead">Cadastre sua conta logo abaixo logo abaixo!</p>
       
        <form action="insere_contas.php" method="post" >
        
          <div class="form-group">
                <label>Nome da Conta:</label>
                <input type="text" name="nomeconta" class="form-control" placeholder="Insira a conta">
          </div>
         <div class="form-group">
                <label>Conta Pai:</label>
                <input type="text" name="contapai" class="form-control" placeholder="Preencha com qualquer dado se nao souber qual conta esta acima">
          </div>
           <div class="form-group">
                <label>Pontua&ccedil;&atilde;o da Perna Esquerda</label>
                <input type="text" name="ptes" class="form-control" placeholder="Insira a pontua&ccedil;&atilde;o da perna esquerda">
          </div>
           <div class="form-group">
                <label>Pontua&ccedil;&atilde;o da Perna Direita</label>
                <input type="text" name="ptdir" class="form-control" placeholder="Insira a pontua&ccedil;&atilde;o da perna direita">
          </div>
           <div class="form-group">
                <label>Pontua&ccedil;&atilde;o a calcular</label>
                <input type="text" name="acalcular" class="form-control" placeholder="Insira a pontua&ccedil;&atilde;o a calcular">
          </div>
              <div class="form-group">
                <label>Lado da pontação sobrando</label>
                <span id="cc">Este campo só aceita 1 ou 2</span>
                <input type="number"  maxlength="2"  id="opcao" name="opcao" class="form-control" placeholder="Direita  1 | Esquerda 2">
          </div> 
          
            <div class="form-group">
                <label>Tipo Conta</label>
                <span id="dd">Este campo só aceita 1 ou 2</span>
                <input type="number" maxlength="2" id="tipoconta" name="tipoconta" class="form-control" placeholder="Pro  1 | Enterprise 2">
          </div> 
          
               <div class="form-group">
                <label>Lado em que a conta está cadastrada</label>
                <span id="dd">Este campo só aceita 1 ou 2</span>
                <input type="number" maxlength="2" id="ladoconta" name="ladoconta" class="form-control" placeholder="Direita  1 | Esquerda 2">
          </div> 
        
        
           <div class="form-group">
       <button type ="submit" class="btn btn-primary" id="salva" name="salva">Cadastrar</button>
           </div>
        
        </form>
      </div>
    </div>
  </div>

  <!-- Bootstrap core JavaScript -->
  <script src="js/jquery.slim.min.js"></script>
  <script src="js/bootstrap.bundle.min.js"></script>
  
  
  
   <script type="text/javascript">




   </script>
</body>

</html>
