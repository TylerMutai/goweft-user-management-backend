
server:
	npm start;

docker_database:
	docker run --name goweft_user_management -e MYSQL_ROOT_PASSWORD=phpmyadmin -p 3306:3306 -d docker.io/library/mariadb:10.3