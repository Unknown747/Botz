const fs = require('fs');
const ethers = require('ethers');
require('colors');

const provider = new ethers.providers.WebSocketProvider(
'wss://eth-mainnet.g.alchemy.com/v2/Pz2U5x9Np5heyA6vUOP3hwjKKwd8TbjP'
);

async function checkBalances() {
const results = [];

try {
    const addresses = fs
        .readFileSync('hits.txt', 'utf8')
        .split('\n')
        .map((val) => val.split(','));

    for (let i = 0; i < addresses.length; i++) {
        const [address, privateKey] = addresses[i];
        try {
            const balance = await provider.getBalance(address);

            if (balance.gt(0)) {
                const result = {
                    address,
                    balance: balance.toString(),
                    privateKey,
                };
                results.push(result);

                console.log(address.bgGreen.black, balance.toString().bgGreen.black);
                console.log('Private Key: '.yellow, privateKey);
            } else {
                console.log(address, 0);
            }
        } catch (error) {
            console.error(`Error fetching balance for address ${address}:`, error.message);
        }
    }
} catch (fileError) {
    console.error('Error reading the addresses file:', fileError.message);
} finally {
    // Disconnect from the provider
    if (provider.connection) {
        try {
            provider.connection.close();
        } catch (error) {
            console.error('Error closing the WebSocket connection:', error.message);
        }
    }

    // Save results to a file
    fs.writeFileSync('win.json', JSON.stringify(results, null, 2));
}
}

// Handle unhandled promise rejections
process.on('unhandledRejection', (error) => {
console.error('Unhandled Promise Rejection:', error.message);
process.exit(1);
});

checkBalances();
