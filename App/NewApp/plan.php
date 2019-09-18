<!DOCTYPE html>
<html lang="pt_BR">

<head>

<meta charset="utf-8">
<meta name="viewport"
	content="width=device-width, initial-scale=1, shrink-to-fit=no">
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
			<button class="navbar-toggler" type="button" data-toggle="collapse"
				data-target="#navbarResponsive" aria-controls="navbarResponsive"
				aria-expanded="false" aria-label="Toggle navigation">
				<span class="navbar-toggler-icon"></span>
			</button>
			<div class="collapse navbar-collapse" id="navbarResponsive">
				<ul class="navbar-nav ml-auto">
					<li class="nav-item active"><a class="nav-link" href="calcpt.php">Calculo
							Pontuação </a></li>
					<li class="nav-item"><a class="nav-link" href="next.php">Simulador
							Next</a></li>
					<li class="nav-item"><a class="nav-link" href="plan.php">Planejador</a>
					</li>
				</ul>
			</div>
		</div>
	</nav>
       
           <?php

$servidor = '127.0.0.1';
        $usuario = 'root';
        $senha = '';
        $bd = 'app';
        session_start();

        $cnx = mysqli_connect($servidor, $usuario, $senha, $bd);

        ?>
           
  
  <!-- Page Content -->
	<div class="container">
		<div class="row">
			<div class="col-lg-12 text-center">
				<h1 class="mt-5">Bem vindo ao planejador Master</h1>
				<p class="lead">Fa&ccedil;a seu cálculo logo abaixo!</p>

				<div id="chart_div"></div>


				<div class="row justify-content-center">
					<table id='table'
						class="table table-striped table-dark table-hover table-sm table-responsive">

						<thead class="thead-dark">
							<tr>
								<th>Nome da conta</th>
								<th>Pt Esquerda</th>
								<th>Pt Direita</th>
								<th>Pt a Calcular</th>
								<th>Ind. Direta</th>
								<th>Binario</th>
								<th>Total</th>
								<th>Investimento na Conta</th>
							</tr>
						</thead>
					<?php
    if (isset($_SESSION['id'])) {
        $ids = $_SESSION['id'];
    }
    $result = $cnx->query('SELECT * FROM conta WHERE iduser=' . $ids);
    if ($result != null) {
        $i = 0;
        while ($lista = $result->fetch_assoc()) :

            ?>
					<tr id="<?php $i = $i = $i+1; echo $i;?>">
							<td id='nomeconta' class='nomeconta'><?php echo $lista['nomeconta'];?></td>
							<td id='contapai' class='contapai '><?php echo $lista['contapai'];?></td>
							<td id='ptdir' class='ptdir '><?php echo $lista['ptdir'];?></td>
							<td id='acalcular' class='acalcular '><?php echo $lista['acalcular'];?></td>
							<td id='inddireta' class='inddireta '><?php echo $lista['inddireta'];?></td>
							<td id='binario' class='binario '><?php echo $lista['binario'];?></td>
							<td id='ladoconta' class='ladoconta '><?php echo $lista['ladoconta'];?></td>

							<td>
								<form action="calculoMaster.php" method="post">
									<div class="input-group input-group-sm mb-3">
										<input type="number" name="val" class="form-control"
											aria-label="Quantia" placeholder="Valor em USD"> <input
											type="number" name="id" class="hide"
											value="<?php echo $lista['id']; ?>">
									</div>
									<button type="submit" class="btn btn-primary" name="calc">Calcula</button>
								</form>
							</td>
							<!-- 	<td><?php //echo $lista['inddireta'];?></td>	-->

						</tr>
				<?php

endwhile
        ;
    } else {
        print 'Ocorreu algum erro! Tente novamente!';
    }
    ?>	
                
            </table>


					<!-- Exibe os resultados do cálculo -->


				</div>


			</div>
		</div>
	</div>
	<script type="text/javascript"
		src="https://www.gstatic.com/charts/loader.js"></script>
	<script src="js/jquery.slim.min.js"></script>
	<script src="js/bootstrap.bundle.min.js"></script>



	<script type="text/javascript">

	$('.hide').hide();

  
    google.charts.load('current', {packages:["orgchart"]});
    google.charts.setOnLoadCallback(drawChart);

    function drawChart() {
    	var tabela = document.getElementById("table");
    	var linhas = tabela.getElementsByTagName("tr");
    	
    	var contapai =	$("#contapai").text();
    	  var nomeconta=	$("#nomeconta").text();
    	  
        var data = new google.visualization.DataTable();
        data.addColumn('string', 'Name');
        data.addColumn('string', 'Manager');
        data.addColumn('string', 'ToolTip');

        // For each orgchart box, provide the name, manager, and tooltip to show.
        
        for(var i = 0; i < linhas.length; i++){
        	var linha = linhas[i];
          var nomeconta = linha.getElementsByClassName("nomeconta");
         var contapai =   linha.getElementsByClassName("contapai");
         var acalcular= linha.getElementsByClassName("acalcular");
         var ladoconta= linha.getElementsByClassName("ladoconta");

         if($(ladoconta).text() == 1){
             ladoconta = "Dir";
         }else{
             ladoconta="Esq";
         }
        data.addRows([
        [{v:$(nomeconta).text(),f:""+$(nomeconta).text()+"<div>PT:"+$(acalcular).text()+"|"+ladoconta+"</div>"},$(contapai).text(), '']    
        ]);

        }
        // Create the chart.
        var chart = new google.visualization.OrgChart(document.getElementById('chart_div'));
        // Draw the chart, setting the allowHtml option to true for the tooltips.
        chart.draw(data, {allowHtml:true});
      }
 </script>


</body>

</html>