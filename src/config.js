module.exports = {
    PORT: process.env.PORT || 8000,
    NODE_ENV: process.env.NODE_ENV || 'development',
    DATABASE_URL:process.env.DATABASE_URL || 'postgresql://kamirska@localhost/green-thumb-data',
    TEST_DATABASE_URL: process.env.TEST_DATABASE_URL || 'postgresql://kamirska@localhost/green-thumb-test',
    JWT_SECRET: process.env.JWT_SECRET || 'zielony-sekret',
    CLIENT_ORIGIN: 'https://green-thumbs-up.now.sh'
}