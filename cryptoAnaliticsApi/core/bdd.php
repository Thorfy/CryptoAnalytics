<?php

function data(){
	$myData = array(
		"database_host" => 'localhost',
		"database_name" => 'cryptoanalytics',
		"database_user" => 'root',
		"database_password" => '',
	);
	return $myData;
}

$hote = data()['database_host']; //'localhost';
$utilisateur = data()['database_user']; //'root';
$mdp = data()['database_password']; //'';
$nombdd = data()['database_name']; //'cryptoanalytics'; // Nom de la base de données
$bdd = new mysqli($hote, $utilisateur, $mdp, $nombdd);
if ($bdd->connect_error) {
	$response = ['response'=>'Erreur de connexion (' . $bdd->connect_errno . ') ' . $bdd->connect_error];
	echo json_encode($response);
}

// Fonctions utilisées pour apiUser

function connect($data) {
	$query = new \PDO( 'mysql:host='.$data["database_host"].';dbname='.$data["database_name"], $data["database_user"], $data["database_password"]);
	$query->exec('SET NAMES \'utf8\'');
	if(isset($data['using'])) $query->exec('use '. $data['using']);

	return $query;
}

function PDOquery($pdoObject, $sql = null, array $args = null, &$success = null)
{
	try{
		if(!$pdoObject instanceof \PDO)		//Si la fonction est appelée par PDOquery($sql, $args) => ommission du $pdoObject
		{
			$args = $sql;
			$sql = $pdoObject;
			$pdoObject = connect(data());
		}									//Fin du changement de parametres 


		$sql = checkForArray($sql, $args);	//On verifie s'il y a des bindings en tableaux, et on modifie le SQL en consequence
		$stmt = $pdoObject->prepare($sql);	//Prepare la requete
		if($args){							//S'il y a des bindings, on les lie à la requete
			foreach($args as $key=>$value)
				$stmt->bindValue($key, $value);	
		}
		//echo($stmt->queryString);
		$success = $stmt->execute();					//On execute la requête
											//$success (reference) renvoie le success de la requete
		return $stmt;		//Puis on renvoie le PDOStatement pour pouvoir réalisé le fetch par exemple
	}
	catch(Exception $e){
		die('Une exception a été levée suite à la requête : '. $sql . '<br/>Erreur : '. $e->getMessage());
	}
}

//Fonction pour binder des tableaux à la requête
// ex : SELECT * FROM table WHERE id_table IN (:myArray)
//  avec binds = [ {"myArray" : [1, 2, 3, 4] }, "valeur2" : "coucou", ... ]
//
//  retour => SELECT * FROM table WHERE id_table IN (:myArray_0, :myArray_1, :myArray_2, :myArray_3)
//  binds = [ "myArray_0" : 1, "myArray_1" : 1, "myArray2" : 3, "myArray3" : 4, "valeur2" : "coucou" ]
function checkForArray($sql, &$binds){

	if(!$binds)			//S'il n'y a pas de paramètres, on renvoie comme tel
		return $sql;
	foreach($binds as $key => $value){	//Sinon on itère dans le tableau
		if(is_array($value)){								//On agit si la valeur est un tableau
			$position = getPositionWord($sql, ':'. $key);	//Recupère la position du tableau dans la requete
			if($position >= 0){	//Si elle est trouvée
				$replace = '';
				for($i = 0; $i < count($value); $i++)						//On crée une chaine de remplacement
					$replace .= ($i > 0 ? ', ' : '') . ':'. $key .'_'. $i;	// ex : ":myArray" => ":myArray1, :myArray2, ..."

				$sqlBefore = substr($sql, 0, $position);				//On prend le début et la fin de la requete
				$sqlAfter = substr($sql, $position + strlen($key) + 1);
				
				$sql = $sqlBefore . $replace . $sqlAfter;		//Et on insert la nouvelle requête

				$i = 0;
				foreach($value as $oneValue){			//On ajoute chaque valeur au tableau de bindings
					$binds[$key.'_'.$i] = $oneValue;
					$i++;
				}
				unset($binds[$key]);	//Remove the array from binds

			}
		}
	}
	return $sql;
}
function getPositionWord($string, $word){
	preg_match('~'. $word .'\b~', $string, $matches, PREG_OFFSET_CAPTURE);	//Recherche le mot exact et renvoie les occurences
	if(count($matches) == 0)
		return -1;
	return $matches[0][1]; //Offset of the first occurence
}
