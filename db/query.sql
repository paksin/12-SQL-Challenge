SELECT a.id, a.first_name, a.last_name, role.title, department.name, role.salary, concat(b.first_name, " ", b.last_name) AS Manager 
FROM employee AS a 
LEFT JOIN employee AS b ON a.manager_id = b.id 
JOIN role ON a.role_id = role.id 
JOIN department ON role.department_id = department.id