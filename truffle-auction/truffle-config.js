module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",     // Localhost
      port: 7545,            // Port par défaut Ganache
      network_id: "*",       // Any network
      gas: 8000000,          // Limite haute
      gasPrice: 20000000000  // 20 gwei
    }
  },
  compilers: {
    solc: {
      version: "0.8.19",     // ou "native" si tu veux la dernière
      settings: {
        optimizer: {
          enabled: true,
          runs: 200
        }
      }
    }
  }
};