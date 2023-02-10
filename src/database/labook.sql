-- Active: 1675117008088@@127.0.0.1@3306
CREATE TABLE users(
    id TEXT PRIMARY KEY UNIQUE NOT NULL,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT NOT NULL,
    created_at TEXT DEFAULT (DATETIME('now', 'localtime')) NOT NULL
);

INSERT INTO users(id, name, email, password, role)
VALUES
    ('u001', 'Guilherme', 'guilherme@email.com', 'guilherme2003', 'Administrador'),
    ('u002', 'Geovanna', 'geovanna@email.com', 'geovanna2004', 'Usuário'),
    ('u003', 'Fulano', 'fulano@email.com', 'fulano2002', 'Usuário');

SELECT * FROM users;

DROP TABLE users;

CREATE TABLE posts(
    id TEXT PRIMARY KEY UNIQUE NOT NULL,
    content TEXT NOT NULL,
    likes INTEGER DEFAULT(0) NOT NULL,
    dislikes INTEGER DEFAULT(0) NOT NULL,
    created_at TEXT DEFAULT(DATETIME('now', 'localtime')),
    updated_at TEXT DEFAULT(DATETIME('now', 'localtime')),
    creator_id TEXT NOT NULL,
    FOREIGN KEY (creator_id) REFERENCES users(id)
);

INSERT INTO posts (id, creator_id, content)
VALUES
    ('p001', 'u001', 'Sou adminstrador do labook'),
    ('p002', 'u003', 'Como funciona essa rede social?'),
    ('p003', 'u002', 'Gostei muito do labook');

SELECT * FROM posts;

CREATE TABLE likes_dislikes(
    user_id TEXT NOT NULL,
    post_id TEXT NOT NULL,
    like INTEGER NOT NULL,
    FOREIGN KEY (post_id) REFERENCES posts(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

INSERT INTO likes_dislikes(user_id, post_id, like)
VALUES
    ('u001', 'p001', 3000),
    ('u003', 'p002', 100),
    ('u002', 'p003', 50);

SELECT * FROM likes_dislikes;
