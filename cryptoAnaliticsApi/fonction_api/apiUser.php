<?php 

require_once("../core/bdd.php");
$method =  strtolower($_SERVER['REQUEST_METHOD']);

if(isset($_REQUEST['function'])){
	$method = $_REQUEST['function'];
}
elseif(!function_exists($method)) die(json_encode(['error' => 'Action inconnue']));

echo $method();


function post(){
	$post = $_POST;
	if(empty($_POST))
    	$post = json_decode(file_get_contents('php://input'), true);

	if(isset($post['email']) && isset($post['lastname']) && isset($post['firstname']) && isset($post['password'])){
		
		$statement = connect(data());

		$sql = 'INSERT INTO user (mail_user, nom_user, prenom_user, password_user) VALUES (:email, :lastname, :firstname, :password)';
		$exec = PDOQuery($statement, $sql, ['email' => $post['email'], 'lastname' => $post['lastname'], 'firstname' => $post['firstname'], 'password' => $post['password']]);
		$post['id'] = $statement->lastInsertId();
		return json_encode($post);
	}
	http_response_code(400);
	return json_encode(['error' => 'Verifiez le formulaire']);
}

function update(){ return put(); }
function put(){
	$put = $_POST;
	if(empty($_POST))
		$put = json_decode(file_get_contents('php://input'), true);

	if(!isset($put['id']) || !$put['id'])
		$put['id'] = PDOQuery('SELECT id_user AS id FROM user WHERE mail_user = "'. $put['email'] .'"')->fetch(PDO::FETCH_ASSOC)['id'];

	if(isset($put['id']) && isset($put['email']) && isset($put['lastname']) && isset($put['firstname']) && isset($put['password'])){
	
		$sql = 'UPDATE user SET mail_user = :email, nom_user = :lastname, prenom_user = :firstname, password_user = :password WHERE id_user = :id';
		$exec = PDOQuery($sql, ['id' => $put['id'], 'email' => $put['email'], 'lastname' => $put['lastname'], 'firstname' => $put['firstname'], 'password' => $put['password']]);

		if(isset($put['cryptos'])) {
			// die(var_dump($put['cryptos']));
			PDOQuery('DELETE FROM monnaie_crypto_user WHERE id_user = '. $put['id']);
			if($put['cryptos']) {
				$sql = 'INSERT INTO monnaie_crypto_user (id_monnaie_crypto, id_user) VALUES';
				$values = [];
				foreach($put['cryptos'] as $id_monnaie)
					$values[] .= '("'. $id_monnaie .'", '. $put['id'] .') ';
				$sql .= implode(', ', $values);
				$exec = PDOQuery($sql);
			}
		}
		if(isset($put['currency'])) {
			PDOQuery('DELETE FROM currency_user WHERE id_user = '. $put['id']);
			if($put['currency']) {
				$sql = 'INSERT INTO currency_user (id_currency, id_user) VALUES';
				$values = [];
				foreach($put['currency'] as $id_currency)
					$values[] .= '("'. $id_currency .'", '. $put['id'] .') ';
				$sql .= implode(', ', $values);
				$exec = PDOQuery($sql);
			}
		}
		$put['currencies'] = @$put['currency'];
		$put['crypto'] = @$put['cryptos'];
		return json_encode($put);
	}
	http_response_code(400);
	return json_encode(['error' => 'Verifiez le formulaire']);
}

function get(){
	

	if(isset($_GET['id'])){
		if($_GET['id']){
			$sql = 'SELECT mail_user AS email, nom_user AS lastname, prenom_user AS firstname, password_user AS password FROM user where id_user = :id';
			$sql_crypto = 'SELECT id_monnaie_crypto FROM monnaie_crypto_user WHERE id_user = :id';
			$sql_currency = 'SELECT id_currency FROM user_currency WHERE id_user = :id';
			$cryptos = PDOQuery($sql_crypto, ['id' => $_GET['id']])->fetchAll(PDO::FETCH_ASSOC);
			$myCryptos = [];
			foreach ($cryptos as $key => $crypto) {
				$myCryptos[] = $crypto['id_monnaie_crypto'];
			}
			$currencies = PDOQuery($sql_currency, ['id' => $_GET['id']])->fetchAll(PDO::FETCH_ASSOC);
			$myCurrencies = [];
			foreach ($currencies as $key => $currency) {
				$myCurrencies[] = $currency['id_currency'];
			}
			$results = [PDOQuery($sql, ['id' => $_GET['id']])->fetch(PDO::FETCH_ASSOC) + ['crypto' => $myCryptos, 'cryptos' => $myCryptos, 'currency' => $myCurrencies, 'currencies' => $myCurrencies] ]; // Return in duplicate, just to be sure you get the good value either using "crypto" or "cryptos", etc...
		}
		else {
			$results = false;
		}
	}
	else{
		$sql = 'SELECT mail_user AS email, nom_user AS lastname, prenom_user AS firstname, password_user AS password FROM user';
		$results = PDOQuery($sql)->fetchAll(PDO::FETCH_ASSOC);
	}

	return json_encode($results);
}

function delete(){
	
	$delete = $_POST;
	if(empty($_POST))
		$delete = json_decode(file_get_contents('php://input'), true);

	

	$sql = 'DELETE FROM user WHERE id_user = :id';
	$results = PDOQuery($sql, ['id' => $delete['id']])->fetchAll(PDO::FETCH_ASSOC);

	return json_encode(true);
}

function connexion(){

	$post = $_POST;
	if(empty($post))
		$post = json_decode(file_get_contents('php://input'), true);

	

	$sql = 'SELECT id_user FROM user WHERE mail_user = :email and password_user = :password';
	$result = PDOQuery($sql, ['email' => $post['email'], 'password' => $post['password']])->fetch(PDO::FETCH_ASSOC);

	if($result)
		return json_encode(['id' => $result['id_user']]);
	return json_encode(false);
}