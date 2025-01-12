# Ubuntu/Debian
sudo apt update
sudo apt install postgresql postgresql-contrib

# macOS (using Homebrew)
brew install postgresql
brew services start postgresql

# Windows
# Download and install from https://www.postgresql.org/download/windows/

# Connect to PostgreSQL
psql -U postgres

# Create database and user
CREATE DATABASE restaurant_db;
CREATE USER restaurant_user WITH ENCRYPTED PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE restaurant_db TO restaurant_user;

# Ubuntu/Debian
sudo apt update
sudo apt install redis-server

# macOS
brew install redis
brew services start redis

# Windows
# Download and install from https://github.com/microsoftarchive/redis/releases

redis-cli ping
# Should return PONG

bind 127.0.0.1
port 6379
maxmemory 256mb
maxmemory-policy allkeys-lru