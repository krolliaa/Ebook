const env = require('./env')
let resUrl;
let dbHost;
let dbUser;
let dbPwd;

// 连接数据库分开发和生产两种环境
if (env === 'dev') {
    resUrl = 'http://172.20.10.2:9090/book/res'
    dbHost = 'localhost';
    dbUser = 'root';
    dbPwd = '123456qwe';
} else if (env === 'prod') {
    resUrl = 'http://172.20.10.2:9090/book/res'
    dbHost = 'localhost';
    dbUser = 'root';
    dbPwd = '123456qwe';
}

// 学科名通用
const category = [
    'Biomedicine',
    'BusinessandManagement',
    'ComputerScience',
    'EarthSciences',
    'Economics',
    'Engineering',
    'Education',
    'Environment',
    'Geography',
    'History',
    'Laws',
    'LifeSciences',
    'Literature',
    'SocialSciences',
    'MaterialsScience',
    'Mathematics',
    'MedicineAndPublicHealth',
    'Philosophy',
    'Physics',
    'PoliticalScienceAndInternationalRelations',
    'Psychology',
    'Statistics'
];

// 导出
module.exports = {
    resUrl,
    dbHost,
    dbUser,
    dbPwd,
    category
}
