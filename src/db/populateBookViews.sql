INSERT INTO bookViews (b_id, b_count)
SELECT b_id, 0
FROM books
WHERE b_id NOT IN (SELECT b_id FROM bookViews)