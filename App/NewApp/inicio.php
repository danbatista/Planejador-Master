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

<!-- Navigation -->
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark static-top">
    <div class="container">
      <a class="navbar-brand" href="#">Menu</a>
      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarResponsive" aria-controls="navbarResponsive" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarResponsive">
        <ul class="navbar-nav ml-auto">
          <li class="nav-item active">
            <a class="nav-link" href="calcpt.php">Calculo Pontuação
            </a>
          </li>
          <li class="nav-item">
            <a  class="nav-link" href="next.php">Simulador Next</a>
          </li>
          <li class="nav-item">
            <a  class="nav-link" href="plan.php">Planejador</a>
          </li>
           <li class="nav-item">
            <a  class="nav-link" href="cadastro_contas.php">Cadastro de Contas</a>
          </li>
        </ul>
      </div>
    </div>
  </nav>
  <?php 
  session_start();
  if(isset ($_SESSION['id'])){
      $ids = $_SESSION['id'];
      
  }
  
      
      ?>
  <!-- Page Content
  <div class="container">
    <div class="row">
      <div class="col-lg-12 text-center">
        <h1 class="mt-5">Bem vindo ao planejador Master</h1>
        <p class="lead">Fa&ccedil;a seu login logo abaixo!</p>
      
        <form action="insere.php" method="post" >
        
          <div class="form-group">
                <label>Nome:</label>
                <input type="text" name="nome" class="form-control" placeholder="Insira seu Nome">
          </div>
           <div class="form-group">
                <label>E-mail:</label>
                <input type="text" name="email" class="form-control" placeholder="Insira seu E-mail">
          </div>
           <div class="form-group">
                <label>Senha:</label>
                <input type="password" name="senha" class="form-control" placeholder="Insira Sua Senha">
          </div>
           <div class="form-group">
                <label>Gradua&ccedil;&atilde;o:</label>
                <input type="text" name="graduacao" class="form-control" placeholder="Insira sua Gradua&ccedil;&atilde;o">
          </div>
           <div class="form-group">
       <button type ="submit" class="btn btn-primary" name="salva">Cadastrar</button>
           </div>
        
        </form>
      </div>
    </div>
  </div>
 -->
  <!-- Bootstrap core JavaScript -->
  <script src="js/jquery.slim.min.js"></script>
  <script src="js/bootstrap.bundle.min.js"></script>
  
  <script type="text/javascript">

  $(document).ready(function(){ 
      $("next").click(function(){ 
          
    	  window.location.href = "http://localhost:8207/App/NewApp/next.php";
      }); 

      $("plan").click(function(){ 
    	  window.location.href = "http://localhost:8207/App/NewApp/plan.php";
      }); 

      $("calc").click(function(){ 
    	  window.location.href = "http://localhost:8207/App/NewApp/calcpt.php";
      }); 
  }); 

  </script>

</body>

</html>