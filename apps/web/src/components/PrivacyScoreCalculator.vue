<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useIntersectionObserver } from '../composables/useIntersectionObserver'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { GaugeChart, BarChart } from 'echarts/charts'
import {
    TitleComponent,
    TooltipComponent,
    GridComponent,
    LegendComponent
} from 'echarts/components'
import VChart from 'vue-echarts'
import { gsap } from 'gsap'
import Card from './Card.vue'

// Register ECharts components
use([
    CanvasRenderer,
    GaugeChart,
    BarChart,
    TitleComponent,
    TooltipComponent,
    GridComponent,
    LegendComponent
])

interface PrivacyMetrics {
    trackersBlocked: number
    httpsUpgrades: number
    fingerprintingBlocked: number
    cookiesBlocked: number
    scriptsBlocked: number
}

const animatedScore = ref(0)
const targetScore = ref(0)

// Reveal on scroll
const privacyScoreHeadingRef = ref<HTMLElement | null>(null)
const { hasBeenVisible: privacyScoreHeadingVisible } = useIntersectionObserver(privacyScoreHeadingRef, { threshold: 0.1, once: true })

const metrics = ref<PrivacyMetrics>({
    trackersBlocked: 0,
    httpsUpgrades: 0,
    fingerprintingBlocked: 0,
    cookiesBlocked: 0,
    scriptsBlocked: 0
})

const targetMetrics: PrivacyMetrics = {
    trackersBlocked: 1247,
    httpsUpgrades: 892,
    fingerprintingBlocked: 156,
    cookiesBlocked: 3421,
    scriptsBlocked: 573
}

// Calculate overall score
const calculateScore = (m: PrivacyMetrics): number => {
    const weights = {
        trackersBlocked: 0.25,
        httpsUpgrades: 0.15,
        fingerprintingBlocked: 0.25,
        cookiesBlocked: 0.20,
        scriptsBlocked: 0.15
    }

    const normalized = {
        trackersBlocked: Math.min(m.trackersBlocked / 2000, 1) * 100,
        httpsUpgrades: Math.min(m.httpsUpgrades / 1000, 1) * 100,
        fingerprintingBlocked: Math.min(m.fingerprintingBlocked / 200, 1) * 100,
        cookiesBlocked: Math.min(m.cookiesBlocked / 5000, 1) * 100,
        scriptsBlocked: Math.min(m.scriptsBlocked / 1000, 1) * 100
    }

    return Math.round(
        normalized.trackersBlocked * weights.trackersBlocked +
        normalized.httpsUpgrades * weights.httpsUpgrades +
        normalized.fingerprintingBlocked * weights.fingerprintingBlocked +
        normalized.cookiesBlocked * weights.cookiesBlocked +
        normalized.scriptsBlocked * weights.scriptsBlocked
    )
}

const scoreColor = computed(() => {
    if (animatedScore.value >= 80) return '#10b981'
    if (animatedScore.value >= 60) return '#f59e0b'
    return '#ef4444'
})

const scoreLabel = computed(() => {
    if (animatedScore.value >= 90) return 'Excellent'
    if (animatedScore.value >= 80) return 'Very Good'
    if (animatedScore.value >= 70) return 'Good'
    if (animatedScore.value >= 60) return 'Fair'
    return 'Poor'
})

// Gauge Chart Options
const gaugeOption = computed(() => ({
    series: [
        {
            type: 'gauge',
            startAngle: 180,
            endAngle: 0,
            radius: '100%',
            center: ['50%', '70%'],
            min: 0,
            max: 100,
            splitNumber: 10,
            axisLine: {
                lineStyle: {
                    width: 15,
                    color: [
                        [0.6, '#ef4444'],
                        [0.8, '#f59e0b'],
                        [1, '#10b981']
                    ]
                }
            },
            pointer: {
                itemStyle: {
                    color: scoreColor.value
                },
                length: '70%',
                width: 6
            },
            axisTick: {
                distance: -15,
                length: 5,
                lineStyle: {
                    color: '#fff',
                    width: 1
                }
            },
            splitLine: {
                distance: -20,
                length: 10,
                lineStyle: {
                    color: '#fff',
                    width: 2
                }
            },
            axisLabel: {
                color: '#d4d4d8',
                distance: 20,
                fontSize: 12
            },
            detail: {
                valueAnimation: true,
                formatter: '{value}',
                color: scoreColor.value,
                fontSize: 48,
                fontWeight: 'bold',
                offsetCenter: [0, '-10%']
            },
            data: [
                {
                    value: animatedScore.value
                }
            ]
        }
    ]
}))

// Bar Chart Options
const barOption = computed(() => ({
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            type: 'shadow'
        },
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        borderColor: '#a855f7',
        textStyle: {
            color: '#ffffff'
        }
    },
    grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
    },
    xAxis: {
        type: 'value',
        axisLabel: {
            color: '#d4d4d8'
        },
        splitLine: {
            lineStyle: {
                color: '#404040'
            }
        }
    },
    yAxis: {
        type: 'category',
        data: ['Scripts', 'Cookies', 'Fingerprinting', 'HTTPS', 'Trackers'],
        axisLabel: {
            color: '#d4d4d8'
        }
    },
    series: [
        {
            type: 'bar',
            data: [
                {
                    value: metrics.value.scriptsBlocked,
                    itemStyle: { color: '#fb923c' }
                },
                {
                    value: metrics.value.cookiesBlocked,
                    itemStyle: { color: '#60a5fa' }
                },
                {
                    value: metrics.value.fingerprintingBlocked,
                    itemStyle: { color: '#a855f7' }
                },
                {
                    value: metrics.value.httpsUpgrades,
                    itemStyle: { color: '#34d399' }
                },
                {
                    value: metrics.value.trackersBlocked,
                    itemStyle: { color: '#f472b6' }
                }
            ],
            barWidth: '60%',
            label: {
                show: true,
                position: 'right',
                color: '#ffffff',
                formatter: '{c}'
            }
        }
    ]
}))

const startCalculation = () => {
    // Reset
    animatedScore.value = 0
    metrics.value = {
        trackersBlocked: 0,
        httpsUpgrades: 0,
        fingerprintingBlocked: 0,
        cookiesBlocked: 0,
        scriptsBlocked: 0
    }

    // Animate metrics
    gsap.to(metrics.value, {
        trackersBlocked: targetMetrics.trackersBlocked,
        httpsUpgrades: targetMetrics.httpsUpgrades,
        fingerprintingBlocked: targetMetrics.fingerprintingBlocked,
        cookiesBlocked: targetMetrics.cookiesBlocked,
        scriptsBlocked: targetMetrics.scriptsBlocked,
        duration: 2,
        ease: 'power2.out',
        onUpdate: () => {
            targetScore.value = calculateScore(metrics.value)
        }
    })

    // Animate score with slight delay
    gsap.to(animatedScore, {
        value: calculateScore(targetMetrics),
        duration: 2.5,
        ease: 'elastic.out(1, 0.5)',
        delay: 0.3
    })
}

onMounted(() => {
    setTimeout(startCalculation, 500)
})
</script>

<template>
    <Card variant="highlight">
        <div class="mb-6">
            <h3 ref="privacyScoreHeadingRef"
                class="text-2xl font-bold mb-2 text-gradient-purple transition-all duration-700"
                :class="{ 'opacity-0 translate-y-8': !privacyScoreHeadingVisible, 'opacity-100 translate-y-0': privacyScoreHeadingVisible }">
                📊 Privacy Score Calculator
            </h3>
            <p class="text-neutral-300 text-sm">
                Your comprehensive privacy protection score based on real blocking metrics
            </p>
        </div>

        <!-- Score Gauge -->
        <div class="glass-strong rounded-lg p-6 mb-6">
            <VChart :option="gaugeOption" class="w-full h-[300px]" autoresize />
            <div class="text-center mt-2">
                <div class="text-2xl font-bold" :style="{ color: scoreColor }">
                    {{ scoreLabel }}
                </div>
                <div class="text-sm text-neutral-400 mt-1">
                    Privacy Protection Level
                </div>
            </div>
        </div>

        <!-- Metrics Breakdown -->
        <div class="glass rounded-lg p-6 mb-6">
            <h4 class="text-lg font-semibold mb-4 text-braveOrange">Blocked This Week</h4>
            <VChart :option="barOption" class="w-full h-[300px]" autoresize />
        </div>

        <!-- Info Cards -->
        <div class="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
            <div class="glass p-3 rounded-lg">
                <div class="text-xs text-neutral-400 mb-1"><i class="bi-shield-fill-check"></i> Trackers</div>
                <div class="text-lg font-bold text-bravePurple">{{ metrics.trackersBlocked.toLocaleString() }}</div>
            </div>
            <div class="glass p-3 rounded-lg">
                <div class="text-xs text-neutral-400 mb-1"><i class="bi-lock-fill"></i> HTTPS</div>
                <div class="text-lg font-bold text-green-600">{{ metrics.httpsUpgrades.toLocaleString() }}</div>
            </div>
            <div class="glass p-3 rounded-lg">
                <div class="text-xs text-neutral-400 mb-1"><i class="bi-person-fill"></i> Fingerprinting</div>
                <div class="text-lg font-bold text-braveOrange">{{ metrics.fingerprintingBlocked.toLocaleString() }}
                </div>
            </div>
            <div class="glass p-3 rounded-lg">
                <div class="text-xs text-neutral-400 mb-1"><i class="bi-cookie"></i> Cookies</div>
                <div class="text-lg font-bold text-braveBlue">{{ metrics.cookiesBlocked.toLocaleString() }}</div>
            </div>
            <div class="glass p-3 rounded-lg">
                <div class="text-xs text-neutral-400 mb-1"><i class="bi-file-earmark-code"></i> Scripts</div>
                <div class="text-lg font-bold text-yellow-500">{{ metrics.scriptsBlocked.toLocaleString() }}</div>
            </div>
            <div class="glass p-3 rounded-lg">
                <div class="text-xs text-neutral-400 mb-1"><i class="bi-lightning-charge-fill"></i> Total</div>
                <div class="text-lg font-bold text-gradient-rainbow">
                    {{ (metrics.trackersBlocked + metrics.httpsUpgrades + metrics.fingerprintingBlocked +
                        metrics.cookiesBlocked + metrics.scriptsBlocked).toLocaleString() }}
                </div>
            </div>
        </div>

        <!-- Recalculate Button -->
        <button @click="startCalculation"
            class="w-full px-4 py-3 rounded-lg bg-gradient-to-r from-bravePurple to-braveOrange hover:opacity-90 transition-all font-medium neon-glow">
            🔄 Recalculate Score
        </button>
    </Card>
</template>
