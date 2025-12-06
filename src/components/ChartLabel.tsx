
import {Cell, Pie, PieChart, Tooltip, type PieLabelRenderProps } from "recharts";

 const RADIAN = Math.PI / 180;
 const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A28BFE", "#FF6B9A"];

 const renderCustomizedLabel = ({
   cx,
   cy,
   midAngle,
   innerRadius,
   outerRadius,
   percent,
 }: PieLabelRenderProps) => {
   if (cx == null || cy == null || innerRadius == null || outerRadius == null) {
     return null;
   }
   const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
   const ncx = Number(cx);
   const x = ncx + radius * Math.cos(-(midAngle ?? 0) * RADIAN);
   const ncy = Number(cy);
   const y = ncy + radius * Math.sin(-(midAngle ?? 0) * RADIAN);

   return (
     <text x={x} y={y} fill="white" textAnchor={x > ncx ? "start" : "end"} dominantBaseline="central">
       {`${((percent ?? 0) * 100).toFixed(0)}%`}
     </text>
   );
 };

 const CustomTooltip = ({ active, payload}: any) => {
   if (active && payload && payload.length) {
     const { name, value } = payload[0];
     const total = payload[0].payload?.total;
    const percent = total ? ((value / total) * 100).toFixed(0) : 0;
     return (
       <div className="bg-gray-900 text-white p-2 rounded shadow-lg border border-gray-700">
         <p className="font-semibold">{name}</p>
         <p className="text-sm">${value.toFixed(2)}</p>
         <p className="text-sm">{`${percent}%`}</p>
       </div>
     );
   }
   return null;
 };

export function PieChartWithCustomizedLabel({ pieData, isAnimationActive = true }: { pieData: { name: string; value: number }[]; isAnimationActive?: boolean }) {
    const total = pieData.reduce((sum, item) => sum + item.value, 0);
    const endData = pieData.map((item) => ({ ...item, total }));
   return (
     <PieChart style={{ width: "100%", maxWidth: "220px", maxHeight: "200px", aspectRatio: 1 }} responsive>
       <Pie data={endData} labelLine={false} label={renderCustomizedLabel} dataKey="value" isAnimationActive={isAnimationActive} innerRadius={40} outerRadius={80}>
         {endData.map((entry, index) => (
           <Cell key={`cell-${entry.name}`} fill={COLORS[index % COLORS.length]} />
         ))}
       </Pie>
       <Tooltip content={<CustomTooltip  />} />
     </PieChart>
   );
 }

