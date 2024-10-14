FRONT_IMAGE=kryptodian_frontend_image
BACK_IMAGE=kryptodian_backend_image
FRONT_CONTAINER=Kryptodian_frontend_container
BACK_CONTAINER=Kryptodian_backend_container
ENV=./.env
DB_NAME=kryptodian_test
DB_USER=petchanop
DB_IMAGE=kryptodian_postgres
DB_PASSWORD=kryptodian
CHECK_FRONT_CONTAINER_EXIST=docker ps -a | grep ${FRONT_CONTAINER} &> /dev/null
CHECK_BACK_CONTAINER_EXIST=docker ps -a | grep ${BACK_CONTAINER} &> /dev/null
CHECK_FRONT_IMAGE_EXIST=docker image ls | grep ${FRONT_IMAGE}  &> /dev/null
CHECK_BACK_IMAGE_EXIST=docker image ls | grep ${BACK_IMAGE}  &> /dev/null

init:
	git init ./Backend/
	git init ./Frontend/
	git init

run-db:
	docker start $(DB_NAME)
db:
	docker pull postgres
	docker tag postgres:latest $(DB_IMAGE)
	docker run --name $(DB_NAME) -p 5432:5432 -e POSTGRES_PASSWORD=$(DB_PASSWORD) -e POSTGRES_DB=$(DB_NAME) -e POSTGRES_USER=$(DB_USER) -d $(DB_IMAGE)

re-db:
	docker stop $(DB_NAME)
	docker rm $(DB_NAME)
	docker run --name $(DB_NAME) -p 5432:5432 -e POSTGRES_PASSWORD=$(DB_PASSWORD) -e POSTGRES_DB=$(DB_NAME) -e POSTGRES_USER=$(DB_USER) -d $(DB_IMAGE)

build:
	docker compose -f ./docker-compose.yml --env-file $(ENV) build --no-cache

up:
	docker compose -f ./docker-compose.yml --env-file $(ENV) up --build -d

down:
	docker compose -f ./docker-compose.yml stop
	docker compose -f ./docker-compose.yml down

front-down:
	@echo "stop running ${FRONT_CONTAINER}";
	@if ${CHECK_FRONT_CONTAINER_EXIST}; then \
		docker stop ${FRONT_CONTAINER}; \
		docker rm ${FRONT_CONTAINER}; \
		echo "remove ${FRONT_CONTAINER}";\
	else \
		echo "no ${FRONT_CONTAINER} found.";\
	fi

back-down:
	@echo "stop running ${BACK_CONTAINER}";
	@if ${CHECK_BACK_CONTAINER_EXIST}; then \
		docker stop ${BACK_CONTAINER}; \
		docker rm ${BACK_CONTAINER}; \
		echo "remove ${BACK_CONTAINER}";\
	else \
		echo "no ${BACK_CONTAINER} found.";\
	fi

front-clean:front-down
	@echo "remove ${FRONT_IMAGE} image";
	@if ${CHECK_FRONT_IMAGE_EXIST}; then \
		docker rmi ${FRONT_IMAGE}; \
		docker image prune -a; \
	else \
		echo "image ${FRONT_IMAGE} does not exits";\
	fi

back-clean:back-down
	@echo "remove ${BACK_IMAGE} image";
	@if ${CHECK_BACK_IMAGE_EXIST}; then \
		docker rmi ${BACK_IMAGE}; \
		docker image prune -a; \
	else \
		echo "image ${BACK_IMAGE} does not exits";\
	fi

fclean:down front-clean back-clean
	docker network prune -f

re:fclean 
	docker compose -f .devcontainer/docker-compose.yml --env-file ${ENV} up --force-recreate --build -d

.PHONY: up down fclean re 
