-- We're now going to mark them as gray instead of deleting them
UPDATE work_order SET row_color = 'row-gray' WHERE status = -1;