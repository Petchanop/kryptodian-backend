FROM node:20-bookworm-slim

RUN apt-get update \
    && apt-get -y upgrade \
    && apt-get install -y git

WORKDIR /workspaces/Backend/kryptodian-backend
    
RUN npm i -g @nestjs/cli
    
USER root

