FROM python:3.12-slim

ARG KUBECTL_VERSION=v1.32.2

ENV DEBIAN_FRONTEND=noninteractive
ENV PIP_NO_CACHE_DIR=1

RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        bash \
        ca-certificates \
        curl \
        git \
        less \
        openssh-client \
    && rm -rf /var/lib/apt/lists/*

RUN pip install --no-cache-dir ansible==11.2.0

RUN curl -fsSLo /usr/local/bin/kubectl https://dl.k8s.io/release/${KUBECTL_VERSION}/bin/linux/amd64/kubectl \
    && chmod +x /usr/local/bin/kubectl

COPY entrypoint.sh /usr/local/bin/toolbox-entrypoint.sh
RUN chmod +x /usr/local/bin/toolbox-entrypoint.sh

WORKDIR /workspace
ENTRYPOINT ["/usr/local/bin/toolbox-entrypoint.sh"]
