# ---------- Stage 1: Build with Node ----------
FROM node:22.6.0 AS build

WORKDIR /app

# Create directory and set ownership in one layer
RUN mkdir -p /app && chown -R node:node /app

USER node

COPY --chown=node:node package*.json ./
RUN npm install --force

COPY --chown=node:node . .
RUN npm run build


# ---------- Stage 2: Serve with Apache ----------
# ---------- Stage 2: Serve with Apache ----------
FROM httpd:alpine

# Create non-root user
RUN addgroup -S node && adduser -S node -G node

# Change Apache to use port 8080
RUN sed -i 's/Listen 80/Listen 8080/g' /usr/local/apache2/conf/httpd.conf

# Set ServerName to suppress warning
RUN echo "ServerName localhost" >> /usr/local/apache2/conf/httpd.conf

# Fix permissions for required Apache directories
RUN chown -R node:node /usr/local/apache2/htdocs \
    /usr/local/apache2/logs \
    /usr/local/apache2/conf

# Copy build artifacts
COPY --from=build /app/dist/cbp-ai-ui /usr/local/apache2/htdocs

# Copy extra files
COPY ./.htaccess /usr/local/apache2/htdocs
COPY src/404.html /usr/local/apache2/htdocs/404.html

# Switch to non-root
USER node

EXPOSE 8080

CMD ["httpd-foreground"]
