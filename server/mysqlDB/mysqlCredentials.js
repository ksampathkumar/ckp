
const mysqlConfig = {
    host: "192.168.5.8",
    user: "root",
    password: "escience",
    dialect: "mysql",
    native: true,
    pool: { maxConnections: 50, maxIdleTime: 30 }
};


module.exports.getConfig = () => { return mysqlConfig; };
