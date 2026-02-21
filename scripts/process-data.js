import fs from 'fs';
import path from 'path';

const csvFilePath = './Retail Selling Price (RSP) of Petrol and Diesel in Metro Cities.csv';
const outputFilePath = './src/data.json';

function parseCSV(csvText) {
    const lines = csvText.split('\n');
    const headers = lines[0].split(',');
    const results = [];

    for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;

        // Simple CSV parser that handles quotes
        const regex = /(".*?"|[^",\s]+)(?=\s*,|\s*$)/g;
        const matches = [];
        let match;
        let lastIndex = 0;

        // Handle empty fields and quotes
        const row = [];
        let inQuotes = false;
        let currentValue = '';

        for (let char of line) {
            if (char === '"') {
                inQuotes = !inQuotes;
            } else if (char === ',' && !inQuotes) {
                row.push(currentValue.trim().replace(/^"|"$/g, ''));
                currentValue = '';
            } else {
                currentValue += char;
            }
        }
        row.push(currentValue.trim().replace(/^"|"$/g, ''));

        if (row.length < 7) continue;

        const [country, fy, monthStr, date, product, city, priceStr] = row;
        const price = parseFloat(priceStr) || 0;

        // Extract year and month from date (YYYY-MM-DD)
        if (!date || !date.includes('-')) continue;
        const [year, monthNum] = date.split('-');
        const monthName = new Date(date).toLocaleString('default', { month: 'long' });

        results.push({
            year,
            month: monthName,
            monthIndex: parseInt(monthNum, 10),
            city,
            product: product.trim(),
            price
        });
    }
    return results;
}

try {
    const csvData = fs.readFileSync(csvFilePath, 'utf8');
    const parsedData = parseCSV(csvData);

    // Aggregation: { [year]: { [city]: { [product]: { [month]: { sum: number, count: number } } } } }
    const aggregated = {};

    parsedData.forEach(item => {
        if (!aggregated[item.year]) aggregated[item.year] = {};
        if (!aggregated[item.year][item.city]) aggregated[item.year][item.city] = {};
        if (!aggregated[item.year][item.city][item.product]) aggregated[item.year][item.city][item.product] = {};
        if (!aggregated[item.year][item.city][item.product][item.month]) {
            aggregated[item.year][item.city][item.product][item.month] = { sum: 0, count: 0 };
        }

        aggregated[item.year][item.city][item.product][item.month].sum += item.price;
        aggregated[item.year][item.city][item.product][item.month].count += 1;
    });

    // Calculate averages
    const finalData = {};
    for (const year in aggregated) {
        finalData[year] = {};
        for (const city in aggregated[year]) {
            finalData[year][city] = {};
            for (const product in aggregated[year][city]) {
                finalData[year][city][product] = {};
                for (const month in aggregated[year][city][product]) {
                    const { sum, count } = aggregated[year][city][product][month];
                    finalData[year][city][product][month] = parseFloat((sum / count).toFixed(2));
                }
            }
        }
    }

    fs.writeFileSync(outputFilePath, JSON.stringify(finalData, null, 2));
    console.log(`Successfully processed data and saved to ${outputFilePath}`);
} catch (error) {
    console.error('Error processing data:', error);
    process.exit(1);
}
