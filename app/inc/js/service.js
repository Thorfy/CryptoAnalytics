app.service('UserService', function ($resource, $q) {
	$this = this;

	var userResource = $resource('cryptoAnaliticsApi/fonction_api/apiUser.php?id=:id', null, {
		'save': {method: 'POST', params: {function: 'post'} },
		'update': { method: 'PUT' , params: {function: 'update'} },
		'connexion': { method: 'POST', params: {function: 'connexion'} }
	});

	$this.currentUser = null;
	$this.allUsers = null;

	$this.getUser = function (id, callback) {
		var defer = $q.defer();

		userResource.query({id: id}, function(response){
			defer.resolve(response[0]);
			$this.setCurrentUser(response[0]);
		});
		return defer.promise;
	}
	$this.getUsers = function (callback) {
		if (!$this.allUsers) {
			$this.allUsers = userResource.query(function () {
				callback($this.allUsers);
			});
		}
		else {
			return $this.allUsers;
		}
	}
	$this.getCurrentUser = function (callback) {
		return $this.currentUser;
	}
	$this.setCurrentUser = function (user, callback) {
		$this.currentUser = user;
	}
	$this.addNewUser = function (user, callback) {
		userResource.save(null, user, function () {
			callback(user);
		});
	}
	$this.modifyUser = function (user, callback) {
		userResource.update(null, user, callback());
	}
	$this.deleteUser = function (user, callback) {
		/* Check if working... */
		userResource.$delete(null, user, callback());
	}
	$this.checkUser = function(email, password){
		var defer = $q.defer();

		userResource.connexion({email: email, password: password}, function(response){
			defer.resolve($this.getUser(response.id));
		});

		return defer.promise;
	}
});
