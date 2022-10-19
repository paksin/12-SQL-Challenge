const mysql = require('mysql2');
const inquirer = require('inquirer');
const cTable = require('console.table');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'company_db'
},
console.log(`Connected to the company_db database.`)
);

function init() {
    inquirer
        .prompt([{
            type: 'list',
            message: 'What would you like to do?',
            name: 'todo',
            choices: [
                'View All Departments', 
                'View All Roles', 
                'View All Employees', 
                'Add Department',
                'Add Role',
                'Add Employee',
                'Update Employee Role',
                'Update Employee Manager',
                'View Employees by Manager',
                'View Employees by Department',
                'Delete Department',
                'Delete Role',
                'Delete Employee',
                'Total Budget of Department',
                'Quit'
            ],
        },])
        .then(function (input) {
            if (input.todo == 'View All Departments'){
                viewDept();
            }else if (input.todo == 'View All Roles'){
                viewRole();
            }else if (input.todo == 'View All Employees'){
                viewEmployee();
            }else if (input.todo == 'Add Department'){
                addDept();
            }else if (input.todo == 'Add Role'){
                addRole();
            }else if (input.todo == 'Add Employee'){
                addEmployee();
            }else if (input.todo == 'Update Employee Role'){
                updateRole();
            }
            
        });
};

function viewDept() {
    db.query('SELECT * FROM department;', function(err, results){
        if (err){
            res.status(400).send('Error in Database');
        }else{
            console.table(results);
            init();
        }
    });
};

function viewRole(){
    db.query('SELECT * FROM role;', function(err, results){
        if (err){
            res.status(400).send('Error in Database');
        }else{
            console.table(results);
            init();
        }
    });
};

function viewEmployee(){
    db.query('SELECT a.id, a.first_name, a.last_name, role.title, department.name, role.salary, concat(b.first_name, " ", b.last_name) AS manager FROM employee AS a LEFT JOIN employee AS b ON a.manager_id = b.id JOIN role ON a.role_id = role.id JOIN department ON role.department_id = department.id;', function(err, results){
        if (err){
            console.log('Error in Database');
        }else{
            console.table(results);
            init();
        }
    });
}; 

function addDept(){
    inquirer
        .prompt([{
            type: 'input',
            message: "Name of department?",
            name: 'deptName',
        },
    ])
    .then(answer => {
        db.query(`INSERT INTO department (name) VALUES ("${answer.deptName}");`, function(err,results){
            if (err){
                console.log('Error in Database');
            }else{
                console.log("Success");
                init();
            }
        });
    })
};

function addRole(){
    const deptList = [];
    db.query('SELECT name, id FROM department;', function(err, results){
        if (err){
            console.log('Error in Database');
        }else{
            results.forEach(dept => {
                let temp = {
                    name: dept.name,
                    value: dept.id
                }
                deptList.push(temp);
            });
        }
    });
    inquirer
        .prompt([{
            type: 'input',
            message: "Title of role?",
            name: 'roleName',
        },{
            type: 'input',
            message: "Salary of role?",
            name: 'roleSalary',
        },{
            type: 'list',
            message: "Department of role?",
            name: 'roleDept',
            choices: deptList,
        },
    ])
    .then(answer => {
        db.query(`INSERT INTO role (title, salary, department_id) VALUES ("${answer.roleName}", ${answer.roleSalary}, ${answer.roleDept});`, function(err,results){
            if (err){
                console.log('Error in Database');
            }else{
                console.log("Success")
                init();
            }
        });
    })
};

function addEmployee(){
    const roleList = [];
    const empList =[];
    db.query('SELECT title, id FROM role;', function(err, results){
        if (err){
            console.log('Error in Database');
        }else{
            results.forEach(role => {
                let temp = {
                    name: role.title,
                    value: role.id
                }
                roleList.push(temp);
            });
        }
    });
    db.query('SELECT concat (first_name, " ", last_name) as name, id FROM employee;', function(err, results){
        if (err){
            console.log('Error in Database');
        }else{
            results.forEach(emp => {
                let temp = {
                    name: emp.name,
                    value: emp.id
                }
                empList.push(temp);
            });
        }
    });
    inquirer
        .prompt([{
            type: 'input',
            message: "Employee first name?",
            name: 'firstName',
        },{
            type: 'input',
            message: "Employee last name?",
            name: 'lastName',
        },{
            type: 'list',
            message: "Employee role?",
            name: 'empRole',
            choices: roleList,
        },{
            type: 'list',
            message: "Employee manager?",
            name: 'empMan',
            choices: empList,
        },
    ])
    .then(answer => {
        db.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("${answer.firstName}", "${answer.lastName}", ${answer.empRole}, ${answer.empMan});`, function(err,results){
            if (err){
                console.log('Error in Database');
            }else{
                console.log("Success")
                init();
            }
        });
    })
};

function updateRole(){
    const roleList = [];
    const empList =[];
    db.query('SELECT title, id FROM role;', function(err, results){
        if (err){
            console.log('Error in Database');
        }else{
            results.forEach(role => {
                let temp = {
                    name: role.title,
                    value: role.id
                }
                roleList.push(temp);
            });
        }
    });
    db.query('SELECT concat (first_name, " ", last_name) as name, id FROM employee;', function(err, results){
        if (err){
            console.log('Error in Database');
        }else{
            results.forEach(emp => {
                let temp = {
                    name: emp.name,
                    value: emp.id
                }
                empList.push(temp);
            });
        }
    });
    inquirer
        .prompt([
            {
            type: 'input',
            message: "Press any key to continue.",
            name: 'confirm',
        },
        {
            type: 'list',
            message: "Change who's role?",
            name: 'employee',
            choices: empList,
        },
        {
            type: 'list',
            message: "Change to which role?",
            name: 'empRole',
            choices: roleList,
        },
    ])
    .then(answer => {
        db.query(`UPDATE employee SET role_id = ${answer.empRole} WHERE id = ${answer.employee};`, function(err,results){
            if (err){
                console.log('Error in Database');
            }else{
                console.log("Success")
                init();
            }
        });
    })
};

init();

