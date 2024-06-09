FROM php:7.4
MAINTAINER Conjecto <contact@conjecto.com>

RUN apt-get update && apt-get install -y \
  --no-install-recommends git zip zlib1g-dev wget libzip-dev

RUN docker-php-ext-install -j$(nproc) zip

COPY app/ /var/app/
WORKDIR /var/app/

# install composer
RUN php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');"
RUN \
    EXPECTED_SIGNATURE=$(wget -q -O - https://composer.github.io/installer.sig) && \
    php -r "if (hash_file('SHA384', 'composer-setup.php') === '${EXPECTED_SIGNATURE}') { echo 'Installer verified'; } else { echo 'Installer corrupt'; unlink('composer-setup.php'); } echo PHP_EOL;" && \
    php composer-setup.php && \
    php -r "unlink('composer-setup.php');"

# install vendors
ENV COMPOSER_ALLOW_SUPERUSER=1
RUN php composer.phar install

# run server
CMD ["php", "-S", "0.0.0.0:80", "-t", "/var/app/www"]
