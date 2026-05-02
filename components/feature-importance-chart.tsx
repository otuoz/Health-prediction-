'use client';

import { motion } from 'framer-motion';
import { Bar, BarChart, XAxis, YAxis, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { FeatureContribution } from '@/types/health';

interface FeatureImportanceChartProps {
  contributions: FeatureContribution[];
}

export function FeatureImportanceChart({ contributions }: FeatureImportanceChartProps) {
  // Prepare data for the chart
  const chartData = contributions.slice(0, 6).map((fc) => ({
    name: fc.displayName,
    value: fc.contribution,
    fill: fc.contribution > 0 ? 'var(--color-chart-3)' : 'var(--color-chart-1)',
    status: fc.status,
    originalValue: fc.value,
    unit: fc.unit,
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
    >
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Factor Contributions</CardTitle>
          <CardDescription>
            How each factor affects your risk score. Positive values increase risk, negative values decrease it.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                layout="vertical"
                margin={{ top: 0, right: 20, left: 100, bottom: 0 }}
              >
                <XAxis 
                  type="number" 
                  domain={['dataMin', 'dataMax']}
                  tickFormatter={(value) => value.toFixed(1)}
                  tick={{ fill: 'var(--color-muted-foreground)', fontSize: 12 }}
                  axisLine={{ stroke: 'var(--color-border)' }}
                />
                <YAxis 
                  type="category" 
                  dataKey="name"
                  tick={{ fill: 'var(--color-foreground)', fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                  width={95}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (!active || !payload?.length) return null;
                    const data = payload[0].payload;
                    return (
                      <div className="rounded-lg border bg-background p-3 shadow-lg">
                        <p className="font-medium">{data.name}</p>
                        <p className="text-sm text-muted-foreground">
                          Value: {data.originalValue} {data.unit}
                        </p>
                        <p className="text-sm">
                          Contribution: <span className={data.value > 0 ? 'text-chart-3' : 'text-chart-1'}>
                            {data.value > 0 ? '+' : ''}{data.value.toFixed(3)}
                          </span>
                        </p>
                      </div>
                    );
                  }}
                />
                <Bar 
                  dataKey="value" 
                  radius={[0, 4, 4, 0]}
                  maxBarSize={24}
                >
                  {chartData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.fill}
                      className="transition-opacity hover:opacity-80"
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          
          {/* Legend */}
          <div className="mt-4 flex items-center justify-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="size-3 rounded bg-chart-3" />
              <span className="text-muted-foreground">Increases Risk</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="size-3 rounded bg-chart-1" />
              <span className="text-muted-foreground">Decreases Risk</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
