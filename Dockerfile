# ---------- Stage 1: Build with Node ----------
FROM node:22.6.0 AS build

WORKDIR /app

# Use built-in node user
USER node

# Copy package files
COPY --chown=node:node package*.json ./
RUN npm install --force

# Copy source
COPY --chown=node:node . .
RUN npm run build


# ---------- Stage 2: Serve with Apache ----------
FROM httpd:alpine

# Create non-root node user (alpine uses adduser)
RUN addgroup -S node && adduser -S node -G node

# Change Apache to listen on 8080 (non-root port)
RUN sed -i 's/Listen 80/Listen 8080/g' /usr/local/apache2/conf/httpd.conf

# Copy build artifacts
COPY --from=build /app/dist/cbp-ai-ui /usr/local/apache2/htdocs

# Copy .htaccess and custom 404 page
COPY ./.htaccess /usr/local/apache2/htdocs
COPY src/404.html /usr/local/apache2/htdocs/404.html

# Enable mod_rewrite and configure custom 404
RUN sed -i '/LoadModule rewrite_module/s/^#//g' /usr/local/apache2/conf/httpd.conf && \
    echo 'ErrorDocument 404 /404.html' >> /usr/local/apache2/conf/httpd.conf

# Fix ownership
RUN chown -R node:node /usr/local/apache2/htdocs

# Switch to non-root
USER node

EXPOSE 8080

CMD ["httpd-foreground"]
