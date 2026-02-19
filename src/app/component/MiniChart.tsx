'use client'

import {
    createChart,
    ColorType,
    CandlestickSeries,
    AreaSeries,
    IChartApi,
    ISeriesApi,
    Time,
    SeriesMarker,
    createSeriesMarkers 
} from 'lightweight-charts';

import React, { useEffect, useRef, useState, useMemo } from 'react';

interface TradeMarker {
    time: number;
    type: 'buy' | 'sell';
    price?: number;
    text?: string;
    volume?: number;
}

interface MiniChartProps {
    symbol?: string;
    data?: any[];
    trades?: TradeMarker[];
    height?: number;
    chartType?: 'area' | 'candlestick';
    color?: string;
    count?: number;
    timeframe?: string;
}

export const MiniChart = ({
    symbol,
    data,
    trades = [],
    height = 200,
    chartType = 'candlestick',
    color = '#2962FF',
    count = 100,
    timeframe = 'H1'
}: MiniChartProps) => {

    const chartContainerRef = useRef<HTMLDivElement>(null);
    const chartInstanceRef = useRef<IChartApi | null>(null);
    const seriesInstanceRef = useRef<ISeriesApi<any> | null>(null);

    const [fetchedData, setFetchedData] = useState<any[]>([]);

    const chartData = useMemo(
        () => (data && data.length > 0 ? data : fetchedData),
        [data, fetchedData]
    );

    /*
    ======================
    FETCH CANDLES
    ======================
    */
    useEffect(() => {
        if (data && data.length > 0) return;
        if (!symbol || symbol === "undefined") return;

        let isMounted = true;

        const fetchCandles = async () => {
            try {
                const response = await fetch(
                    `/api/candles/${symbol}?count=${count}&timeframe=${timeframe}`
                );

                if (!response.ok) return;

                const result = await response.json();
                if (isMounted && Array.isArray(result)) {
                    setFetchedData(result);
                }
            } catch (error) {
                console.error(error);
            }
        };

        fetchCandles();
        return () => { isMounted = false; };
    }, [symbol, count, timeframe]);

    /*
    ======================
    CREATE CHART
    ======================
    */
    useEffect(() => {
        if (!chartContainerRef.current) return;

        if (chartInstanceRef.current) {
            try { chartInstanceRef.current.remove(); } catch {}
        }

        const chart = createChart(chartContainerRef.current, {
            layout: {
                background: { type: ColorType.Solid, color: 'transparent' },
                textColor: '#333'
            },
            width: chartContainerRef.current.clientWidth,
            height: height,
            timeScale: {
                visible: true,
                timeVisible: true,
                borderColor: '#D1D4DC'
            },
            grid: {
                vertLines: { visible: false },
                horzLines: { visible: false }
            },
        });

        const series =
        chartType === 'area'
            ? chart.addSeries(AreaSeries, {
                lineColor: color,
                topColor: color,
                bottomColor: 'rgba(0,0,0,0)',
                priceFormat: {
                type: 'price',
                precision: 4,
                minMove: 0.0001,
                }
            })
            : chart.addSeries(CandlestickSeries, {
                upColor: '#26a69a',
                downColor: '#ef5350',
                priceFormat: {
                type: 'price',
                precision: 4,
                minMove: 0.0001,
                }
            });

        chartInstanceRef.current = chart;
        seriesInstanceRef.current = series;

        const ro = new ResizeObserver(e => {
            if (e[0].contentRect) {
                chart.applyOptions({ width: e[0].contentRect.width });
            }
        });

        ro.observe(chartContainerRef.current);

        return () => {
            ro.disconnect();
            if (chartInstanceRef.current) {
                try { chartInstanceRef.current.remove(); } catch {}
                chartInstanceRef.current = null;
                seriesInstanceRef.current = null;
            }
        };

    }, [chartType, height, color]);

    /*
    ======================
    UPDATE DATA + MARKERS
    ======================
    */
    useEffect(() => {
        if (!seriesInstanceRef.current) return;
        if (!chartData || chartData.length === 0) return;

        try {
            const cleanData = chartData
                .map((d: any) => ({
                    time: d.time as Time,
                    value: d.close || d.value,
                    open: d.open,
                    high: d.high,
                    low: d.low,
                    close: d.close
                }))
                .filter((d: any) => d.time)
                .sort((a: any, b: any) => (a.time as number) - (b.time as number));

            if (cleanData.length === 0) return;

            seriesInstanceRef.current.setData(cleanData);

            /*
            ======================
            CREATE TRADE MARKERS
            ======================
            */
            if (trades.length > 0) {

            const markers: SeriesMarker<Time>[] = trades.map(t => {
            const candle =
                [...cleanData]
                    .reverse()
                    .find((c: any) => c.time <= t.time)
                || cleanData[0];

            const price = t.price && t.price > 0
                ? t.price
                : candle.close;

            return {
                time: candle.time,
                position: t.type === 'buy' ? 'belowBar' : 'aboveBar',
                color: t.type === 'buy' ? '#2196F3' : '#e91e63',
                shape: t.type === 'buy' ? 'arrowUp' : 'arrowDown',
                text: t.text || t.type.toUpperCase(),
                price: price
            };
        });

            createSeriesMarkers(seriesInstanceRef.current, markers);
        }

        } catch (error) {
            console.error(error);
        }

    }, [chartData, trades, chartType]);

    return (
        <div
            ref={chartContainerRef}
            className="w-full relative"
            style={{ height: `${height}px` }}
        />
    );
};
