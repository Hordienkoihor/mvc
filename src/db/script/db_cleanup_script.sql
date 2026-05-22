SET
GLOBAL event_scheduler = ON;

DROP
EVENT IF EXISTS weekly_cleanup;

CREATE
EVENT weekly_cleanup
       ON SCHEDULE EVERY 7 DAY
       STARTS '2026-05-23 03:00:00'
       DO
BEGIN
DELETE
FROM books
WHERE deleted_at < NOW() - INTERVAL 7 DAY LIMIT 1000;
DELETE
FROM authors
WHERE deleted_at < NOW() - INTERVAL 7 DAY LIMIT 1000;
END;


