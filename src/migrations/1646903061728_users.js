module.exports = {
    "up": `CREATE TABLE users (
        user_id INT NOT NULL AUTO_INCREMENT,
        user_name VARCHAR(500) NOT NULL DEFAULT '0',
        created_at DATETIME NOT NULL DEFAULT curreNT_TIMESTAMP(),
        PRIMARY KEY (user_id)
    )
    COLLATE='utf8mb4_general_ci'
    ;
    `,
    "down": ""
}