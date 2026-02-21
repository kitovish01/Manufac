import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

interface RSPChartProps {
    data: { [month: string]: number };
    title: string;
}

const RSPChart: React.FC<RSPChartProps> = ({ data, title }) => {
    const chartRef = useRef<HTMLDivElement>(null);
    const chartInstance = useRef<echarts.ECharts | null>(null);

    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    useEffect(() => {
        if (chartRef.current) {
            if (!chartInstance.current) {
                chartInstance.current = echarts.init(chartRef.current);
            }

            // Sort data by month order
            const sortedValues = months.map(month => data[month] || 0);

            const option: echarts.EChartsOption = {
                title: {
                    text: title,
                    left: 'center',
                    textStyle: {
                        fontSize: 16,
                        fontWeight: 'bold'
                    }
                },
                tooltip: {
                    trigger: 'axis',
                    formatter: '{b}: ₹{c}/L'
                },
                xAxis: {
                    type: 'category',
                    data: months,
                    axisLabel: {
                        rotate: 45
                    }
                },
                yAxis: {
                    type: 'value',
                    name: 'Price (₹/L)',
                    min: (value) => Math.max(0, Math.floor(value.min - 5))
                },
                series: [
                    {
                        data: sortedValues,
                        type: 'bar',
                        itemStyle: {
                            color: '#228be6'
                        },
                        label: {
                            show: true,
                            position: 'top',
                            formatter: '₹{c}'
                        }
                    }
                ],
                grid: {
                    bottom: '20%',
                    left: '10%',
                    right: '5%',
                    top: '15%'
                }
            };

            chartInstance.current.setOption(option);
        }

        const handleResize = () => {
            chartInstance.current?.resize();
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            // We don't necessarily want to dispose here if the component is just re-rendering
        };
    }, [data, title]);

    return <div ref={chartRef} style={{ width: '100%', height: '400px' }} id="rsp-chart" />;
};

export default RSPChart;
