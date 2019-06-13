
const mysqlConfig = {
    host: "35.194.5.71",
    user: "reader",
    password: "escienceReader",
    dialect: "mysql",
    native: true,
    pool: { maxConnections: 50, maxIdleTime: 30 }
};


module.exports.getConfig = () => { return mysqlConfig; };
