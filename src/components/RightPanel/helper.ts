// 生成体重数据的辅助函数
export const generateWeightData = () => {
  const dates = [];
  const weights = [];
  const today = new Date();

  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    dates.push(date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' }));

    // 模拟体重数据，基础体重70kg，随机波动
    const baseWeight = 70;
    const variation = Math.sin(i / 5) * 1.5 + Math.random() * 0.8 - 0.4;
    weights.push(Number((baseWeight + variation).toFixed(1)));
  }

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
        smooth: true,
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

  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    dates.push(date.toLocaleDateString('zh-CN', { weekday: 'short', month: 'short', day: 'numeric' }));

    // 模拟营养数据，基础值 + 随机波动
    const caloriesBase = 1600;
    const proteinBase = 100;
    const fatBase = 50;
    const carbBase = 200;

    const dailyVariation = Math.sin(i / 3) * 0.15 + (Math.random() - 0.5) * 0.2;

    caloriesData.push(Math.round(caloriesBase + caloriesBase * dailyVariation));
    proteinData.push(Math.round(proteinBase + proteinBase * dailyVariation));
    fatData.push(Math.round(fatBase + fatBase * dailyVariation));
    carbData.push(Math.round(carbBase + carbBase * dailyVariation));
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