To docerize applications:

    - flask-app - it is application written on flask:
        * to write Dockerfile for app image;
        * to write docker-compose.yml for two containers:
                * webapi (entrypoint: python app.py)
                * mongodb (push data into docker container)
    - spring-boot-app - it is web application written on Java Spring Framework:
        * to write Dockerfile for putting project files into container;
        * to write docker-compose.yml for building Dockerfile and running app
          (entrypoint: mvn clean spring-boot:run)
