
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
<div style="display: none;"><?php require_once 'lista.php'; ?></div>
 

  <!-- Page Content -->
  <div class="container">
    <div class="row">
      <div class="col-lg-12 text-center">
        <h1 class="mt-5">Bem vindo ao planejador Master</h1>
        <p class="lead">Fa&ccedil;a seu login logo abaixo!</p>
       
        <form action="lista.php" method="GET" >
          <label>E-mail ou senha incorretos! Tente novamente!</label>
           <div class="form-group">
                <label>E-mail:</label>
                <input type="text" name="email" class="form-control" placeholder="Insira seu E-mail">
          </div>
           <div class="form-group">
                <label>Senha:</label>
                <input type="password"  name="senha" class="form-control" placeholder="Insira Sua Senha">
          </div>
           <div class="form-group">
       <button type ="submit" class="btn btn-primary" name="login">Login</button>
           </div>
        
        </form>
      </div>
    </div>
  </div>

  <!-- Bootstrap core JavaScript -->
  <script src="js/jquery.slim.min.js"></script>
  <script src="js/bootstrap.bundle.min.js"></script>

</body>

</html>
