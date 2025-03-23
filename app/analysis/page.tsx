"use client";

import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

const AnalysisPage = () => {
    const [activeTab, setActiveTab] = useState('overview');

    // Production Environment Data (5 Charts, 1M datapoints each)
    const productionData = {
        metrics: [
            { name: 'LCP (s)', SSR: 8.81, Client: 0.17, ServerComponents: 0.30 },
            { name: 'CLS', SSR: 0.16, Client: 0.17, ServerComponents: 0.38 },
            { name: 'Total Time (s)', SSR: 16.10, Client: 5.55, ServerComponents: 5.68 },
            { name: 'Scripting (s)', SSR: 5.62, Client: 4.05, ServerComponents: 3.36 }
        ],
        heap: [
            { name: 'Min JS Heap (MB)', SSR: 1.8, Client: 305, ServerComponents: 298 },
            { name: 'Max JS Heap (MB)', SSR: 392, Client: 628, ServerComponents: 661 }
        ],
        nodes: [
            { name: 'Min Nodes', SSR: 4, Client: 456, ServerComponents: 298 },
            { name: 'Max Nodes', SSR: 498, Client: 849, ServerComponents: 594 }
        ]
    };

    // Local Production Build (10 Charts, 1M datapoints each)
    const localProdData = {
        metrics: [
            { name: 'LCP (s)', SSR: 4.39, Client: 0.06, ServerComponents: 0.08 },
            { name: 'CLS', SSR: 0.08, Client: 0.68, ServerComponents: 0.40 },
            { name: 'Total Time (s)', SSR: 7.35, Client: 5.73, ServerComponents: 5.59 }
        ],
        network: [
            { name: 'Network Transfer (MB)', SSR: 8.1, Client: 7.7, ServerComponents: 25.3 }
        ]
    };

    // Production (1 Chart, 10K datapoints)
    const smallChartData = {
        metrics: [
            { name: 'LCP (s)', SSR: 0.76, Client: 0.15, ServerComponents: 0.32 },
            { name: 'CLS', SSR: 0.11, Client: 0.06, ServerComponents: 0.06 },
            { name: 'Total Time (s)', SSR: 2.59, Client: 2.05, ServerComponents: 1.97 }
        ]
    };

    // Development Environment (Chart Refresh)
    const chartRefreshData = [
        { name: '1 Chart (1M points)', SSR: 8.2, Client: 8.4, ServerComponents: 26.4 },
        { name: '10 Charts (1M points each)', SSR: 49.5, Client: 44.2, ServerComponents: 138.5 }
    ];

    // Development Environment (Page Load)
    const pageLoadData = [
        { name: '1 Chart (1M points)', SSR: 19.20, Client: 11.37, ServerComponents: 10.70 },
        { name: '10 Charts (1M points each)', SSR: 72.0, Client: 11.39, ServerComponents: 10.69 }
    ];

    // DOM Loaded times (Dev, Slow 4G)
    const domLoadedData = [
        { name: '1 Chart (1M points)', SSR: 17.9, Client: 1.25, ServerComponents: 1.25 },
        { name: '10 Charts (1M points each)', SSR: 58.72, Client: 1.28, ServerComponents: 1.23 }
    ];

    // LCP comparison across all dataset sizes
    const lcpComparisonData = [
        { name: '1 Chart (10K points), prod', SSR: 0.76, Client: 0.15, ServerComponents: 0.32 },
        { name: '5 Charts (1M points each), prod', SSR: 8.81, Client: 0.17, ServerComponents: 0.30 },
        { name: '10 Charts (1M points each), local', SSR: 4.39, Client: 0.06, ServerComponents: 0.08 }
    ];

    // Radar chart data for overall strengths/weaknesses
    const radarData = [
        { subject: 'Initial Load Speed', SSR: 2, Client: 5, ServerComponents: 4 },
        { subject: 'Layout Stability', SSR: 5, Client: 2, ServerComponents: 3 },
        { subject: 'Memory Efficiency', SSR: 4, Client: 3, ServerComponents: 2 },
        { subject: 'Chart Update Speed', SSR: 4, Client: 4, ServerComponents: 1 },
        { subject: 'Network Efficiency', SSR: 4, Client: 4, ServerComponents: 2 },
        { subject: 'DOM Loading Speed', SSR: 1, Client: 5, ServerComponents: 5 }
    ];

    // Best approach recommendations
    const recommendations = [
        { scenario: 'Fast initial visual feedback', best: 'Client', notes: 'Consistently lowest LCP times across all datasets' },
        { scenario: 'SEO & initial content visibility', best: 'SSR', notes: 'Provides complete HTML at load' },
        { scenario: 'Frequent chart updates', best: 'Client', notes: 'Best chart refresh performance' },
        { scenario: 'Large datasets (10+ charts)', best: 'Client', notes: 'Minimal impact on performance as chart count increases' },
        { scenario: 'Memory constrained environments', best: 'SSR', notes: 'Lowest initial JS heap usage' },
        { scenario: 'Layout stability priority', best: 'SSR', notes: 'Best overall CLS values' },
        { scenario: 'Small datasets', best: 'Server Components', notes: 'Good performance with smaller data volumes' }
    ];

    return (
        <div className="flex flex-col gap-6 p-4">
            <div className="flex justify-center mb-4">
                <div className="inline-flex rounded-md shadow-sm">
                    <button
                        onClick={() => setActiveTab('overview')}
                        className={`px-4 py-2 text-sm font-medium rounded-l-lg ${activeTab === 'overview' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}
                    >
                        Overall Comparison
                    </button>
                    <button
                        onClick={() => setActiveTab('production')}
                        className={`px-4 py-2 text-sm font-medium ${activeTab === 'production' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}
                    >
                        Production (5 Charts)
                    </button>
                    <button
                        onClick={() => setActiveTab('localprod')}
                        className={`px-4 py-2 text-sm font-medium ${activeTab === 'localprod' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}
                    >
                        Local Prod (10 Charts)
                    </button>
                    <button
                        onClick={() => setActiveTab('smalldata')}
                        className={`px-4 py-2 text-sm font-medium ${activeTab === 'smalldata' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}
                    >
                        Small Dataset
                    </button>
                    <button
                        onClick={() => setActiveTab('development')}
                        className={`px-4 py-2 text-sm font-medium rounded-r-lg ${activeTab === 'development' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}
                    >
                        Development
                    </button>
                </div>
            </div>

            {activeTab === 'overview' && (
                <>
                    <div>
                        <h2 className="text-xl font-bold mb-2">LCP Comparison Across Environments</h2>
                        <p className="mb-4 text-gray-600">Lower is better - Shows how each method performs with different data sizes</p>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={lcpComparisonData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis label={{ value: 'Seconds', angle: -90, position: 'insideLeft' }} />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="SSR" fill="#8884d8" name="SSR" />
                                    <Bar dataKey="Client" fill="#82ca9d" name="Client" />
                                    <Bar dataKey="ServerComponents" fill="#ffc658" name="Server Components" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div>
                        <h2 className="text-xl font-bold mb-2">Strengths & Weaknesses Comparison</h2>
                        <p className="mb-4 text-gray-600">Higher is better - Relative performance in key areas (scale: 1-5)</p>
                        <div className="h-96">
                            <ResponsiveContainer width="100%" height="100%">
                                <RadarChart outerRadius={150} width={500} height={500} data={radarData}>
                                    <PolarGrid />
                                    <PolarAngleAxis dataKey="subject" />
                                    <PolarRadiusAxis angle={30} domain={[0, 5]} />
                                    <Radar name="SSR" dataKey="SSR" stroke="#8884d8" fill="#8884d8" fillOpacity={0.5} />
                                    <Radar name="Client" dataKey="Client" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.5} />
                                    <Radar name="Server Components" dataKey="ServerComponents" stroke="#ffc658" fill="#ffc658" fillOpacity={0.5} />
                                    <Legend />
                                </RadarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div>
                        <h2 className="text-xl font-bold mb-2">Chart Refresh Processing Time (Dev, Slow 4G)</h2>
                        <p className="mb-4 text-gray-600">Lower is better - Shows how performance scales with more charts</p>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={chartRefreshData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis label={{ value: 'Seconds', angle: -90, position: 'insideLeft' }} />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="SSR" fill="#8884d8" name="SSR" />
                                    <Bar dataKey="Client" fill="#82ca9d" name="Client" />
                                    <Bar dataKey="ServerComponents" fill="#ffc658" name="Server Components" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </>
            )}

            {activeTab === 'production' && (
                <>
                    <div>
                        <h2 className="text-xl font-bold mb-2">Production Environment (5 Charts, 1M datapoints each)</h2>
                        <p className="mb-4 text-gray-600">Key performance metrics comparison</p>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={productionData.metrics}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="SSR" fill="#8884d8" name="SSR" />
                                    <Bar dataKey="Client" fill="#82ca9d" name="Client" />
                                    <Bar dataKey="ServerComponents" fill="#ffc658" name="Server Components" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h2 className="text-xl font-bold mb-2">JavaScript Heap Usage</h2>
                            <p className="mb-4 text-gray-600">Memory footprint (min-max)</p>
                            <div className="h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={productionData.heap}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="name" />
                                        <YAxis />
                                        <Tooltip />
                                        <Legend />
                                        <Bar dataKey="SSR" fill="#8884d8" name="SSR" />
                                        <Bar dataKey="Client" fill="#82ca9d" name="Client" />
                                        <Bar dataKey="ServerComponents" fill="#ffc658" name="Server Components" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        <div>
                            <h2 className="text-xl font-bold mb-2">DOM Node Count</h2>
                            <p className="mb-4 text-gray-600">DOM complexity (min-max)</p>
                            <div className="h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={productionData.nodes}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="name" />
                                        <YAxis />
                                        <Tooltip />
                                        <Legend />
                                        <Bar dataKey="SSR" fill="#8884d8" name="SSR" />
                                        <Bar dataKey="Client" fill="#82ca9d" name="Client" />
                                        <Bar dataKey="ServerComponents" fill="#ffc658" name="Server Components" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                </>
            )}

            {activeTab === 'localprod' && (
                <>
                    <div>
                        <h2 className="text-xl font-bold mb-2">Local Production Build (10 Charts, 1M datapoints each)</h2>
                        <p className="mb-4 text-gray-600">Key performance metrics comparison</p>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={localProdData.metrics}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="SSR" fill="#8884d8" name="SSR" />
                                    <Bar dataKey="Client" fill="#82ca9d" name="Client" />
                                    <Bar dataKey="ServerComponents" fill="#ffc658" name="Server Components" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div>
                        <h2 className="text-xl font-bold mb-2">Network Transfer Size</h2>
                        <p className="mb-4 text-gray-600">Data transferred over network</p>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={localProdData.network}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="SSR" fill="#8884d8" name="SSR" />
                                    <Bar dataKey="Client" fill="#82ca9d" name="Client" />
                                    <Bar dataKey="ServerComponents" fill="#ffc658" name="Server Components" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </>
            )}

            {activeTab === 'smalldata' && (
                <div>
                    <h2 className="text-xl font-bold mb-2">Small Dataset Performance (1 Chart, 10K datapoints)</h2>
                    <p className="mb-4 text-gray-600">Key performance metrics comparison</p>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={smallChartData.metrics}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="SSR" fill="#8884d8" name="SSR" />
                                <Bar dataKey="Client" fill="#82ca9d" name="Client" />
                                <Bar dataKey="ServerComponents" fill="#ffc658" name="Server Components" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            )}

            {activeTab === 'development' && (
                <>
                    <div>
                        <h2 className="text-xl font-bold mb-2">Development Environment - DOM Loaded Time (Slow 4G)</h2>
                        <p className="mb-4 text-gray-600">Lower is better - Time until DOM is ready</p>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={domLoadedData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis label={{ value: 'Seconds', angle: -90, position: 'insideLeft' }} />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="SSR" fill="#8884d8" name="SSR" />
                                    <Bar dataKey="Client" fill="#82ca9d" name="Client" />
                                    <Bar dataKey="ServerComponents" fill="#ffc658" name="Server Components" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div>
                        <h2 className="text-xl font-bold mb-2">Development Environment - Page Load Time (Slow 4G)</h2>
                        <p className="mb-4 text-gray-600">Lower is better - Complete page load time</p>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={pageLoadData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis label={{ value: 'Seconds', angle: -90, position: 'insideLeft' }} />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="SSR" fill="#8884d8" name="SSR" />
                                    <Bar dataKey="Client" fill="#82ca9d" name="Client" />
                                    <Bar dataKey="ServerComponents" fill="#ffc658" name="Server Components" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </>
            )}

            <div>
                <h2 className="text-xl font-bold mb-2">Best Approach by Scenario</h2>
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-300">
                        <thead>
                        <tr>
                            <th className="py-2 px-4 border-b">Scenario</th>
                            <th className="py-2 px-4 border-b">Best Approach</th>
                            <th className="py-2 px-4 border-b">Notes</th>
                        </tr>
                        </thead>
                        <tbody>
                        {recommendations.map((row, index) => (
                            <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : ''}>
                                <td className="py-2 px-4 border-b">{row.scenario}</td>
                                <td className="py-2 px-4 border-b font-medium">
                    <span className={
                        row.best === 'Client' ? 'text-green-600' :
                            row.best === 'SSR' ? 'text-purple-600' :
                                'text-yellow-600'
                    }>
                      {row.best}
                    </span>
                                </td>
                                <td className="py-2 px-4 border-b">{row.notes}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AnalysisPage;
