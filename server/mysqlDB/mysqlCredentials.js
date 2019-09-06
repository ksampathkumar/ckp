
const mysqlConfig = {
    host: "192.168.5.139",
    user: "reader",
    password: "escienceReader",
    dialect: "mysql",
    native: true,
    pool: { maxConnections: 50, maxIdleTime: 30 }
};


module.exports.getConfig = () => { return mysqlConfig; };
