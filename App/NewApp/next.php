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
            <a class="nav-link" href="next.php">Simulador Next</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="plan.php">Planejador</a>
          </li>
        </ul>
      </div>
    </div>
  </nav>
  
  <!-- Page Content -->
  <div class="container">
    <div class="row">
      <div class="col-lg-12 text-center">
        <h1 class="mt-5">Bem vindo ao planejador Master</h1>
        <p class="lead">Fa&ccedil;a sua simulação do Next logo abaixo!</p>
       
        <form action="" method="post" >
        
          <div class="form-group">
                <label>Investimento(U$):</label>
                <input type="number" name="dolar" class="form-control" placeholder="Digite o valor investido em USD">
          </div>
           <div class="form-group">
       <button type ="submit" class="btn btn-primary" name="calc">Calcula</button>
           </div>
           
           <div class="row justify-content-center">
            <table class="table">
            
              <thead> <tr> <th>Nº Cotas </th>
                           <th>Pro</th>
                           <th>Enterprise </th> </tr>
                           
              <!-- Insere o numero de cotas -->             
                           <tr><th><?php if(isset($_POST['dolar'])){
                               
                               $cota = $_POST['dolar'];
                               
                           
                           echo $cota/50;}?> </th></tr>
                           
                      <!-- Insere o a pontua��o -->           
                           <tr><th>Pontuação </th>
                             <!-- PTs Pro -->    
                           <th><?php if(isset($_POST['dolar'])){
                               
                               $cota = $_POST['dolar'];
                               
                               $cota = $cota/50;
                           
                           echo $cota*8;}?> </th> 
                           
                             <!-- PTs Enterprise -->   
                           <th> <?php if(isset($_POST['dolar'])){
                               
                               $cota = $_POST['dolar'];
                               
                               $cota = $cota/50;
                           
                           echo $cota*8;}?> </th></tr>
                           
                             <!-- Insere o valor do Binario -->   
                           <tr><th>Bin�rio U$</th>
                           
                             <!-- Val Pro -->   
                           <th><?php if(isset($_POST['dolar'])){
                               
                               $cota = $_POST['dolar'];
                               
                               $cota = $cota/50;
                               $cota = $cota*8;
                           echo $cota*0.5;}?> </th>
                           
                             <!-- Val Enterprise -->   
                              <th><?php if(isset($_POST['dolar'])){
                               
                               $cota = $_POST['dolar'];
                               
                               $cota = $cota/50;
                               $cota = $cota*8;
                           echo $cota*0.6;}?> </th>
                           </tr>
                           <!-- Insere o valor da Ind. Direta -->  
                           <tr><th>Ind. Direta U$ </th>
                           
                           <!-- valor pro -->  
                           <th><?php if(isset($_POST['dolar'])){
                               
                               $cota = $_POST['dolar'];
                               
                               
                           echo $cota*0.1;}?></th>
                           
                           <!-- valor Enterprise -->  
                           <th><?php if(isset($_POST['dolar'])){
                               
                               $cota = $_POST['dolar'];
                               
                               
                           echo $cota*0.1;}?></th>
                           
                           </tr>
                           <!-- Calcula o valor total de bonus -->  
                           <tr><th>Total U$ </th>
                           
                           <!-- Total pro -->  
                           <th> <?php if(isset($_POST['dolar'])){
                               
                               $cota = $_POST['dolar'];
                               $bin;
                               $ind = $cota*0.1;
                               
                               $cota = $cota/50;
                               $cota = $cota*8;
                               $bin = $cota*0.5;
                               
                               $total = $ind + $bin;
                               echo $total; }?> </th>
                           
                            <!-- Total enterprise --> 
                             <th>  <?php if(isset($_POST['dolar'])){
                               
                               $cota = $_POST['dolar'];
                               $bin;
                               $ind = $cota*0.1;
                               
                               $cota = $cota/50;
                               $cota = $cota*8;
                               $bin = $cota*0.6;
                               
                               $total = $ind + $bin;
                               echo $total; }?>  </th>
                           </tr>
            </thead> 
                 
            </table>
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