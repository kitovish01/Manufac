# Metro City Fuel Price Analytics Dashboard

Interactive data visualization dashboard for analyzing the **Retail Selling Price (RSP)** of Petrol and Diesel across major metro cities in India (Delhi, Mumbai, Chennai, Kolkata). 

Data source: **National Data and Analytics Platform (NDAP), NITI Aayog**.

## 🚀 Live Demo
**[manufac-rsp-visualization-kknbxmht2.vercel.app](https://manufacanalytics.vercel.app)

## 📊 Dashboard Preview
[Dashboard Screenshot attached]

## 🛠️ Tech Stack
- **Framework**: [Vite](https://vitejs.dev/) + [React](https://reactjs.org/) (TypeScript)
- **UI Library**: [Mantine UI](https://mantine.dev/) (v8)
- **Visualization**: [Apache ECharts](https://echarts.apache.org/) (Native integration)
- **Data Source**: NDAP NITI Aayog (daily daily prices consolidated to monthly averages) as given in the assignment pdf link for datasets 
- **Deployment**: [Vercel](https://vercel.com/)

## 📝 Key Features
1. **Time-Efficient Data Pipeline**: A pre-processing script (`scripts/process-data.js`) converts the 2MB raw daily CSV into a compact, optimized `data.json`. This ensures the UI remains snappy even with thousands of records.
2. **Interactive Selection**: Three synchronization-aware dropdowns for selecting Metro City, Fuel Type, and Calendar Year.
3. **Responsive Charts**: Apache ECharts bar chart that visualizes monthly trends with precision labels and tooltips.
4. **Clean Codebase**: Fully typed with TypeScript, modular component structure, and comprehensive comments for maintainability.

## 🏗️ Folder Structure
```bash
/src
  /components
    RSPChart.tsx    # Native ECharts wrapper component
  App.tsx           # Main dashboard logic and state management
  data.json         # Optimized pre-processed dataset
/scripts
  process-data.js   # Script to calculate monthly averages from CSV
/public
  dashboard-screenshot.png
```

## ⚙️ Setup Instructions

1.  **Install dependencies**:
    ```bash
    yarn install
    ```
2.  **Process raw data**
    ```bash
    node scripts/process-data.js
    ```
3.  **Run locally**:
    ```bash
    yarn dev
    ```
4.  **Production build**:
    ```bash
    yarn build
    ```
