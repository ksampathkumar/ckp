
const mysqlConfig = {
    host: "35.184.100.181",
    user: "reader",
    password: "escienceReader",
    dialect: "mysql",
    native: true,
    pool: { maxConnections: 50, maxIdleTime: 30 }
};


module.exports.getConfig = () => { return mysqlConfig; };
