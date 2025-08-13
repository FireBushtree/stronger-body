import { WeightTrendDB, UserBodyInfoDB, NutritionTrendDB } from '../../utils/db';

// 生成体重数据的辅助函数
export const generateWeightData = () => {
  const dates: string[] = [];
  const weights: number[] = [];
  
  // 获取真实的体重数据
  const weightMap = WeightTrendDB.get();
  
  // 只显示用户实际输入的空腹体重记录
  const records: Array<[string, any]> = Array.from(weightMap.entries())
    .filter(([_, record]) => record.isFasting) // 只显示空腹测量的数据
    .sort(([dateA], [dateB]) => dateA.localeCompare(dateB)); // 按日期排序

  if (records.length === 0) {
    // 如果没有任何记录，返回空数据
    return { dates: [], weights: [] };
  }

  // 转换数据格式
  records.forEach(([dateStr, record]) => {
    const date = new Date(dateStr);
    const displayDate = date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' });
    dates.push(displayDate);
    weights.push(record.weight);
  });

  return { dates, weights };
};

// ECharts配置选项
export const getWeightChartOption = (dates: string[], weights: number[]) => {
  return {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis',
      backgroundColor: '#374151',
      borderColor: '#6b7280',
      textStyle: {
        color: '#ffffff'
      },
      formatter: function(params: unknown) {
        const data = Array.isArray(params) ? params[0] : params;
        if (data && typeof data === 'object' && 'name' in data && 'value' in data) {
          return `${data.name}<br/>体重: ${data.value} kg`;
        }
        return '';
      }
    },
    grid: {
      left: '2%',
      right: '2%',
      top: '10%',
      bottom: '5%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      data: dates,
      axisLine: {
        lineStyle: {
          color: '#6b7280'
        }
      },
      axisLabel: {
        color: '#9ca3af',
        fontSize: 11
      }
    },
    yAxis: {
      type: 'value',
      name: '体重 (kg)',
      nameTextStyle: {
        color: '#9ca3af'
      },
      axisLine: {
        lineStyle: {
          color: '#6b7280'
        }
      },
      axisLabel: {
        color: '#9ca3af',
        fontSize: 11
      },
      splitLine: {
        lineStyle: {
          color: '#374151',
          type: 'dashed'
        }
      }
    },
    series: [
      {
        name: '体重',
        type: 'line',
        data: weights,
        lineStyle: {
          color: '#3b82f6',
          width: 3
        },
        itemStyle: {
          color: '#3b82f6',
          borderColor: '#1e40af',
          borderWidth: 2
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: 'rgba(59, 130, 246, 0.3)'
              },
              {
                offset: 1,
                color: 'rgba(59, 130, 246, 0.05)'
              }
            ]
          }
        },
        symbol: 'circle',
        symbolSize: 6,
        emphasis: {
          itemStyle: {
            color: '#60a5fa',
            borderColor: '#3b82f6',
            borderWidth: 3,
            shadowBlur: 10,
            shadowColor: '#3b82f6'
          }
        }
      }
    ]
  };
};

// 生成近7天营养数据的辅助函数
export const generateNutritionTrendData = () => {
  const dates = [];
  const caloriesData = [];
  const proteinData = [];
  const fatData = [];
  const carbData = [];
  const today = new Date();

  // 获取最近7天的日期范围
  const endDate = today.toISOString().split('T')[0];
  const startDate = new Date(today.getTime() - 6 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  
  // 获取真实的营养数据
  const nutritionRecords = NutritionTrendDB.getDateRange(startDate, endDate);
  
  // 创建日期到记录的映射
  const recordMap = new Map();
  nutritionRecords.forEach(record => {
    recordMap.set(record.date, record);
  });

  // 生成最近7天的数据
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    const dateString = date.toISOString().split('T')[0];
    
    dates.push(date.toLocaleDateString('zh-CN', { weekday: 'short', month: 'short', day: 'numeric' }));

    // 使用真实数据或0（如果没有记录）
    const record = recordMap.get(dateString);
    if (record) {
      caloriesData.push(record.calories);
      proteinData.push(Math.round(record.protein));
      fatData.push(Math.round(record.fat));
      carbData.push(Math.round(record.carbohydrates));
    } else {
      // 没有记录的日期显示0
      caloriesData.push(0);
      proteinData.push(0);
      fatData.push(0);
      carbData.push(0);
    }
  }

  return { dates, caloriesData, proteinData, fatData, carbData };
};

// 营养摄入趋势柱状图配置选项
export const getNutritionTrendChartOption = () => {
  const { dates, caloriesData, proteinData, fatData, carbData } = generateNutritionTrendData();

  return {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis',
      backgroundColor: '#374151',
      borderColor: '#6b7280',
      textStyle: {
        color: '#ffffff'
      },
      formatter: function(params: unknown) {
        if (Array.isArray(params)) {
          let result = `${params[0]?.name || ''}<br/>`;
          params.forEach((item: { seriesName?: string; value?: number; name?: string }) => {
            if (item && 'seriesName' in item && 'value' in item) {
              const unit = item.seriesName === '总卡路里' ? 'kcal' : 'g';
              result += `${item.seriesName}: ${item.value}${unit}<br/>`;
            }
          });
          return result;
        }
        return '';
      }
    },
    legend: {
      data: ['总卡路里', '蛋白质', '脂肪', '碳水'],
      textStyle: {
        color: '#9ca3af',
        fontSize: 11
      },
      top: '5%'
    },
    grid: {
      left: '5%',
      right: '5%',
      top: '25%',
      bottom: '15%'
    },
    xAxis: {
      type: 'category',
      data: dates,
      axisLine: {
        lineStyle: {
          color: '#6b7280'
        }
      },
      axisLabel: {
        color: '#9ca3af',
        fontSize: 11
      }
    },
    yAxis: [
      {
        type: 'value',
        name: '卡路里(kcal)',
        nameTextStyle: {
          color: '#9ca3af',
          fontSize: 10
        },
        position: 'left',
        axisLine: {
          lineStyle: {
            color: '#6b7280'
          }
        },
        axisLabel: {
          color: '#9ca3af',
          fontSize: 10
        },
        splitLine: {
          lineStyle: {
            color: '#374151',
            type: 'dashed'
          }
        }
      },
      {
        type: 'value',
        name: '营养素(g)',
        splitLine: {
          lineStyle: {
            color: '#ccc',
            type: 'dashed'
          }
        },
        nameTextStyle: {
          color: '#9ca3af',
          fontSize: 10
        },
        position: 'right',
        axisLine: {
          lineStyle: {
            color: '#6b7280'
          }
        },
        axisLabel: {
          color: '#9ca3af',
          fontSize: 10
        }
      }
    ],
    series: [
      {
        name: '总卡路里',
        type: 'bar',
        yAxisIndex: 0,
        data: caloriesData,
        itemStyle: {
          color: '#fb923c'
        },
        barGap: '10%',
        barWidth: 12
      },
      {
        name: '蛋白质',
        type: 'bar',
        yAxisIndex: 1,
        data: proteinData,
        itemStyle: {
          color: '#60a5fa'
        },
        barGap: '10%',
        barWidth: 12
      },
      {
        name: '脂肪',
        type: 'bar',
        yAxisIndex: 1,
        data: fatData,
        itemStyle: {
          color: '#facc15'
        },
        barGap: '10%',
        barWidth: 12
      },
      {
        name: '碳水',
        type: 'bar',
        yAxisIndex: 1,
        data: carbData,
        itemStyle: {
          color: '#4ade80'
        },
        barGap: '10%',
        barWidth: 12
      }
    ]
  };
};