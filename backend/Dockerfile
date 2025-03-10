# Use official Node.js 18 image
FROM node:18

# Set working directory inside the container
WORKDIR /app/backend

# Copy all files from the host to the container
COPY . .

# Install PM2 globally and dependencies
RUN npm install -g pm2 pm2-logrotate && npm install

# Create logs directory
RUN mkdir -p /app/backend/logs

# Install PM2 Logrotate module and configure log rotation
RUN pm2 install pm2-logrotate && \
    pm2 set pm2-logrotate:max_size 10M && \
    pm2 set pm2-logrotate:retain 30 && \
    pm2 set pm2-logrotate:compress false && \
    pm2 set pm2-logrotate:dateFormat YYYY-MM-DD_HH-mm-ss && \
    pm2 set pm2-logrotate:workerInterval 30 && \
    pm2 set pm2-logrotate:rotateInterval 0 0 * * * && \
    pm2 set pm2-logrotate:rotateModule true

# Expose necessary ports
EXPOSE 8000 9090

# Start application using PM2 ecosystem file
CMD ["pm2-runtime", "start", "ecosystem.config.js"]
