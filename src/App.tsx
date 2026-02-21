import "@mantine/core/styles.css";
import { MantineProvider, Container, Title, Select, Stack, Group, Paper, Text } from "@mantine/core";
import { useState, useMemo, useEffect } from "react";
import { theme } from "./theme";
import rawData from "./data.json";
import RSPChart from "./components/RSPChart";

const data = rawData as Record<string, Record<string, Record<string, Record<string, number>>>>;

export default function App() {
  const years = useMemo(() => Object.keys(data).sort((a, b) => b.localeCompare(a)), []);

  const [selectedYear, setSelectedYear] = useState<string | null>(years[0] || null);

  const cities = useMemo(() => {
    if (!selectedYear) return [];
    return Object.keys(data[selectedYear] || {}).sort();
  }, [selectedYear]);

  const [selectedCity, setSelectedCity] = useState<string | null>(null);

  // Sync city when year changes
  useEffect(() => {
    if (cities.length > 0 && (!selectedCity || !cities.includes(selectedCity))) {
      setSelectedCity(cities[0]);
    }
  }, [cities, selectedCity]);

  const fuelTypes = useMemo(() => {
    if (!selectedYear || !selectedCity) return [];
    return Object.keys(data[selectedYear][selectedCity] || {}).sort();
  }, [selectedYear, selectedCity]);

  const [selectedFuel, setSelectedFuel] = useState<string | null>(null);

  // Sync fuel when city/year changes
  useEffect(() => {
    if (fuelTypes.length > 0 && (!selectedFuel || !fuelTypes.includes(selectedFuel))) {
      setSelectedFuel(fuelTypes[0]);
    }
  }, [fuelTypes, selectedFuel]);

  const chartData = useMemo(() => {
    if (selectedYear && selectedCity && selectedFuel) {
      return data[selectedYear][selectedCity][selectedFuel] || {};
    }
    return {};
  }, [selectedYear, selectedCity, selectedFuel]);

  return (
    <MantineProvider theme={theme}>
      <Container size="md" py="xl">
        <Stack gap="lg">
          <Stack gap={0}>
            <Title order={1} style={{ textAlign: 'center', color: '#1c7ed6' }}>
              Metro City Fuel Price Analytics
            </Title>
            <Text size="sm" c="dimmed" style={{ textAlign: 'center' }}>
              Monthly Average Retail Selling Price (RSP)
            </Text>
          </Stack>

          <Paper p="md" withBorder shadow="sm" radius="md">
            <Group grow align="flex-end">
              <Select
                label="City"
                placeholder="Pick a city"
                data={cities}
                value={selectedCity}
                onChange={setSelectedCity}
                allowDeselect={false}
              />
              <Select
                label="Fuel Type"
                placeholder="Pick fuel type"
                data={fuelTypes}
                value={selectedFuel}
                onChange={setSelectedFuel}
                allowDeselect={false}
              />
              <Select
                label="Year"
                placeholder="Pick a year"
                data={years}
                value={selectedYear}
                onChange={setSelectedYear}
                allowDeselect={false}
              />
            </Group>
          </Paper>

          {selectedYear && selectedCity && selectedFuel ? (
            <Paper p="md" withBorder shadow="sm" radius="md">
              <RSPChart
                data={chartData}
                title={`${selectedFuel} Prices in ${selectedCity} (${selectedYear})`}
              />
            </Paper>
          ) : (
            <Text c="dimmed" style={{ textAlign: 'center' }} py="xl">
              Please select City, Fuel Type, and Year to view the chart.
            </Text>
          )}
        </Stack>
      </Container>
    </MantineProvider>
  );
}
