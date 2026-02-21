/**
 * Data Processing Script
 * 
 * Purpose: 
 *   Converts the raw daily Retail Selling Price (RSP) CSV into a consolidated 
 *   JSON format containing monthly averages. This improves application efficiency 
 *   as the UI only loads pre-calculated aggregates rather than processing 2MB of raw data.
 * 
 * Logic:
 *   1. Parses CSV rows handling quoted values.
 *   2. Groups data by Year -> City -> Fuel Type -> Month.
 *   3. Calculates the average price for each group (handling missing values as 0).
 *   4. Saves the results to src/data.json.
 */

import fs from 'fs';

const csvFilePath = './Retail Selling Price (RSP) of Petrol and Diesel in Metro Cities.csv';
const outputFilePath = './src/data.json';

/**
 * Custom CSV parser to handle nested commas and quotes.
 * @param {string} csvText Raw CSV content.
 * @returns {Array<Object>} List of parsed records.
 */
function parseCSV(csvText) {
    const lines = csvText.split('\n');
    const results = [];

    // Skip header (i=0)
    for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;

        const row = [];
        let inQuotes = false;
        let currentValue = '';

        // State-machine loop for CSV parsing
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

        // Basic validation: Ensure we have enough columns
        if (row.length < 7) continue;

        const [country, fy, monthStr, date, product, city, priceStr] = row;
        const price = parseFloat(priceStr) || 0; // Treatment of missing values as 0

        // Extract year and localized month name from the YYYY-MM-DD string
        if (!date || !date.includes('-')) continue;
        const [year, monthNum] = date.split('-');

        // Month name from date object
        const monthDate = new Date(parseInt(year), parseInt(monthNum) - 1, 15);
        const monthName = monthDate.toLocaleString('default', { month: 'long' });

        results.push({
            year,
            month: monthName,
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

    // Initial aggregation structure
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

    // Compute arithmetic means
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
