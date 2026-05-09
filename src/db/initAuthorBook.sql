CREATE TABLE IF NOT EXISTS authorBook (
    a_id INT NOT NULL,
    b_id INT NOT NULL,
    PRIMARY KEY (a_id, b_id),
    FOREIGN KEY (a_id) REFERENCES authors(a_id) ON DELETE CASCADE,
    FOREIGN KEY (b_id) REFERENCES books(b_id) ON DELETE CASCADE
);